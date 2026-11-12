# RFC 001: Dedicated Sandboxed Code Execution Runner for JavaQuest

- **Status**: Proposed / Architectural Blueprint
- **Author**: JavaQuest Core Engineering Team
- **Target Runtime**: OpenJDK 21 LTS / OpenJDK 22 (Headless)
- **Deployment Targets**: Fly.io MicroVMs or Hetzner Cloud with gVisor (`runsc`)

---

## 1. Executive Summary

JavaQuest currently runs learner Java code through hardened serverless proxy routes (`/api/run.js`) delegating to Wandbox's OpenJDK 22 compiler/runner. While Wandbox provides deterministic compilation and eliminates client-side simulation, third-party shared sandboxes introduce critical operational constraints:

1. **Shared Rate Limits & Throttling**: Wandbox public endpoints are shared with thousands of developers globally and can throttle or queue requests during peak hours.
2. **Interactive Stdin Latency**: Interactive lessons (e.g. `Scanner(System.in)`) require fast, reliable stdin streaming.
3. **Data Privacy**: Learner code passes through third-party servers.
4. **Custom JVM Diagnostics**: Custom flags (`-XX:+TieredCompilation`, `-Xcomp`, custom security managers, JFR events) cannot be passed to third-party endpoints.

This RFC outlines the architectural blueprint, security isolation guarantees, communication protocol, and cost projection for deploying a dedicated, self-hosted Java sandbox runner.

---

## 2. Sandbox Architecture & Isolation Strategy

Running untrusted arbitrary user code in a multi-tenant environment requires strict defense-in-depth isolation:

```
                  +-----------------------------------+
                  |  Vercel Serverless Function       |
                  |  (/api/run.js)                    |
                  +-----------------+-----------------+
                                    |
                    HTTPS / mTLS / HMAC-SHA256 Token
                                    |
                                    v
+-----------------------------------------------------------------------+
|  Dedicated Runner Host (Fly.io / Hetzner Cloud)                       |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |  Reverse Proxy & Queue Worker (Go or Rust / Actix)            |   |
|   +-------------------------------+-------------------------------+   |
|                                   |                                   |
|       +---------------------------+---------------------------+       |
|       |                                                       |       |
|       v                                                       v       |
|  +--------------------------------+   +--------------------------------+
|  | MicroVM / gVisor Container 1   |   | MicroVM / gVisor Container 2   |
|  | - OpenJDK 21/22 Slim           |   | - OpenJDK 21/22 Slim           |
|  | - tmpfs RAM /workspace (64MB)  |   | - tmpfs RAM /workspace (64MB)  |
|  | - cgroup: 256MB RAM max        |   | - cgroup: 256MB RAM max        |
|  | - cgroup: 1 vCPU cap           |   | - cgroup: 1 vCPU cap           |
|  | - Network: NONE (unshared net) |   | - Network: NONE (unshared net) |
|  | - Seccomp: BPF filter          |   | - Seccomp: BPF filter          |
|  | - Timeout: SIGKILL after 5s    |   | - Timeout: SIGKILL after 5s    |
|  +--------------------------------+   +--------------------------------+
+-----------------------------------------------------------------------+
```

### 2.1 Sandboxing Technologies Comparison

| Technology | Isolation Level | Startup Overhead | Cost / Complexity | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Docker (`runc`)** | OS namespace only | ~150 ms | Low | ❌ **Rejected** (kernel exploits could escape) |
| **gVisor (`runsc`)** | User-space kernel intercepting syscalls | ~200 ms | Medium | ✅ **Preferred for Hetzner/Bare-Metal** |
| **Firecracker MicroVM** | Hardware virtualization (KVM) | ~5-30 ms (forked) | High | ✅ **Preferred for Fly.io / AWS ECS** |

### 2.2 Kernel & System Resource Constraints

1. **Network**:
   - Strictly isolated using Linux network namespaces with only a disconnected loopback:
     ```bash
     --network none
     ```
   - Zero outbound TCP/UDP, DNS, or raw socket creation allowed.
2. **Filesystem**:
   - Root filesystem is mounted strictly **Read-Only** (`ro`).
   - Learner workspace is an ephemeral memory-backed `tmpfs` mounted at `/workspace` with a **64MB size cap** and `noexec,nodev,nosuid` flags where feasible.
   - All files are wiped immediately upon process termination.
3. **Memory Limits**:
   - `cgroup v2` memory limit: **256 MB** hard limit.
   - JVM flags: `-Xms32m -Xmx192m -XX:+UseSerialGC -XX:MaxRAMPercentage=75`.
   - Out-of-memory triggers kernel OOM killer or JVM `OutOfMemoryError` without crashing the host.
4. **CPU & Time Limits**:
   - `cgroup` CPU quota: 100% of 1 vCPU.
   - Wall-clock timeout: **5,000 milliseconds** (5 seconds).
   - If process fails to exit within 5,000ms, runner delivers `SIGKILL` (signal 9) and reports `TIMEOUT`.
5. **Seccomp System Call Filtering**:
   - Deny: `fork()` / `clone()` (beyond JVM runtime thread creation threshold), `socket()`, `connect()`, `bind()`, `listen()`, `ptrace()`, `mount()`, `chroot()`, `reboot()`.

---

## 3. Communication API Specification

The runner exposes a lightweight, authenticated internal HTTP/2 API.

### 3.1 Authentication

Every request between Vercel Serverless (`/api/run.js`) and the Runner must include an HMAC-SHA256 signature in the header:

```http
POST /v1/execute
Host: runner.javaquest.dev
Content-Type: application/json
X-JavaQuest-Signature: sha256=4f53cda18c2...
X-JavaQuest-Timestamp: 1794462000
```

### 3.2 Request Schema

```json
{
  "source": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello JavaQuest\");\n    }\n}",
  "stdin": "optional input line 1\nline 2\n",
  "timeoutMs": 5000,
  "javaVersion": 21
}
```

### 3.3 Response Schema

```json
{
  "status": "COMPLETED",
  "exitCode": 0,
  "stdout": "Hello JavaQuest\n",
  "stderr": "",
  "compilationTimeMs": 284,
  "executionTimeMs": 86,
  "peakMemoryBytes": 42106880
}
```

#### Status Enum Values:
- `COMPLETED`: Code compiled and ran to completion.
- `COMPILATION_ERROR`: `javac` exited with non-zero status; compiler error diagnostics in `stderr`.
- `RUNTIME_ERROR`: Java runtime threw an unhandled exception; stack trace in `stderr`.
- `TIMEOUT`: Execution exceeded `timeoutMs` (5,000ms); terminated via `SIGKILL`.
- `OUT_OF_MEMORY`: Exceeded 256MB memory quota.
- `SECURITY_VIOLATION`: Intercepted prohibited system call or permission breach.

---

## 4. High-Availability & Failover Strategy

JavaQuest maintains 99.9% execution uptime via an automated dual-tier circuit breaker:

```mermaid
flowchart TD
    Req[Learner Runs Code] --> VercelAPI[/api/run.js]
    VercelAPI --> CB{Circuit Breaker Check}
    CB -->|Runner Healthy| DedicatedRunner[Dedicated Sandboxed Runner]
    CB -->|Runner Error / Timeout > 3x| WandboxFallback[Wandbox OpenJDK 22 Fallback]
    DedicatedRunner -->|Success| Output[Return Output & Tests Diff]
    DedicatedRunner -->|Failure / Unreachable| FallbackTrigger[Trip Circuit Breaker] --> WandboxFallback
    WandboxFallback --> Output
```

1. **Primary**: Dedicated Runner (average roundtrip latency ~350ms).
2. **Secondary Fallback**: Wandbox OpenJDK 22 endpoint (fallback latency ~1,200ms).
3. **Degraded State Alert**: Automatic telemetry logging when fallback is engaged.

---

## 5. Cost & Infrastructure Projections

### Fly.io Provisioning Estimate

- **Base Host**: 1x `shared-cpu-2x` (2 shared vCPUs, 1,024 MB RAM) in `iad` (US East, co-located with Vercel):
  - Base cost: **$5.70 / month**
- **Bandwidth**: ~1 KB per compilation request = 10 GB/month for 10,000,000 runs (within free allocation).
- **Scale-to-Zero**: Suspends to idle after 10 minutes of zero traffic; cold-boot time is under 400ms.
- **Estimated Cost per 10,000 Executions**: **~$0.0019**

---

## 6. Implementation Milestones

1. **Milestone 1**: Dockerfile with OpenJDK 21/22 Headless, non-root user `sandbox`, and resource limits.
2. **Milestone 2**: Lightweight Go/Rust HTTP daemon executing `javac` + `java` inside gVisor/Firecracker micro-jail.
3. **Milestone 3**: Deploy instance to Fly.io (`fly launch`).
4. **Milestone 4**: Update `api/run.js` with `RUNNER_ENDPOINT` environment variable and fallback circuit breaker.
