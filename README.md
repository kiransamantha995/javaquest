# ☕ JavaQuest — Learn Modern Java Like a Game

[![Java 21 LTS](https://img.shields.io/badge/Java-21_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://javaquest-ashen.vercel.app)
[![Supabase Auth & DB](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![CodeMirror 6](https://img.shields.io/badge/CodeMirror-6-blue?style=for-the-badge)](https://codemirror.net)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Live Production URL**: [https://javaquest-ashen.vercel.app](https://javaquest-ashen.vercel.app)

**JavaQuest** is an interactive, gamified learning platform for **Modern Java (Java 21 LTS baseline)** styled with a retro neobrutalist aesthetic inspired by platforms like Codédex and Minecraft.

From crafting your first `Hello, World!` in the Overworld to mastering Virtual Threads, Records, Pattern Matching, and Spring Boot REST APIs in The End, JavaQuest takes you on a comprehensive adventure with zero heavyweight IDE setup required.

---

## 🌟 What Sets JavaQuest Apart?

- **Real OpenJDK 22 Compiler & Runner**: Unlike simulators that use regular expressions or pretend execution, JavaQuest compiles and runs your code against real OpenJDK 22 in a secure execution sandbox with deterministic stdout/stderr capture and test suite assertions.
- **Codédex-Inspired Split-Screen Lesson Shell**: A distraction-free 2-column workspace featuring concept guides, CodeMirror 6 code editor with live syntax diagnostics, interactive stdin terminal, and visual test case diff runners.
- **3-Tier Progressive Hint System**: Stuck on a bug? Request a conceptual nudge, actionable guidance, or a near-solution snippet before unlocking the full reference solution.
- **JavaBot AI Tutor v2**: Built with Gemini Flash-Lite and gated behind authenticated Supabase JWT tokens. JavaBot acts as a genuine Socratic tutor — explaining compiler stack traces in plain English, performing line-by-line code reviews, and remembering tricky concepts in your local Learner Memory.
- **Minecraft-Inspired Gamification**: Earn XP, level up, unlock pixelated achievements in the Trophy Room, customize retro avatars, and toggle optional 8-bit Web Audio synthesizer sound effects and glowing XP orbs.
- **Academic Rigor**: Every lesson includes authoritative textbook citations (*The Java Language Specification*, *Core Java*, *Head First Java*, *Effective Java*).

---

## 🗺️ Curriculum Tracks (24 Modules)

```
                              THE OVERWORLD (Track 1)
 [B1: First Steps] ──> [B2: Variables & Types] ──> [B3: Decisions] ──> [B4: Loops]
                                                                          │
 [B8: Expense Tracker Project] <── [B7: Exceptions] <── [B6: Arrays] <────┘
          │
          v
                                THE NETHER (Track 2)
 [I1: Classes & Encapsulation] ──> [I2: Inheritance] ──> [I3: Records & Enums] ──> [I4: Collections]
                                                                                        │
 [I8: Library Management Project] <── [I7: File I/O & NIO.2] <── [I6: Lambdas] <────────┘
          │
          v
                                 THE END (Track 3)
 [A1: Generics Deep Dive] ──> [A2: Virtual Threads] ──> [A3: JVM Internals] ──> [A4: Design Patterns]
                                                                                       │
 [A8: Cloud Task API Capstone] <── [A7: Modern Java Features] <── [A6: Spring Boot] <──┘
```

### Track 1: The Overworld (Beginner)
- **B1**: First Steps in the Overworld (JDK, JRE, JVM, Main method, `System.out.println`)
- **B2**: Crafting Materials (Primitive data types, arithmetic operators, type casting)
- **B3**: Forks in the Mine (If-else branching, logical operators, switch expressions)
- **B4**: Automated Redstone Repeaters (For loops, while loops, break, continue)
- **B5**: Functional Crafting Tables (Method definitions, parameters, return types, overloading)
- **B6**: Chests & Inventories (1D/2D arrays, bounds checking, traversal)
- **B7**: Shielding Against Creepers (Exceptions, `try-catch-finally`, custom exceptions)
- **B8**: Milestone Project: Personal Expense Tracker (Console CLI, arrays, validation)

### Track 2: The Nether (Intermediate)
- **I1**: Nether Fortress Architectures (Classes, objects, constructors, `this`, access modifiers)
- **I2**: Bloodline Inheritances (Polymorphism, method overriding, `super`, abstract classes)
- **I3**: Modern Artifacts: Records & Enums (Immutable `record` classes, rich `enum` types)
- **I4**: Hopper Sorting Networks: Collections (ArrayList, HashSet, HashMap, Iterators)
- **I5**: Diamond Ingot Generic Blueprints (Generics, type parameters, bounded wildcards)
- **I6**: Soul Sand Stream Pipelines (Lambda expressions, `Stream` API, `map`, `filter`, `reduce`)
- **I7**: Ancient Tomes: File I/O & NIO.2 (`Files`, `Path`, `BufferedReader`, serializing data)
- **I8**: Milestone Project: Nether Library Management System (OOP, collections, file persistence)

### Track 3: The End (Advanced)
- **A1**: Obsidian Monoliths: Generics & Type Variance (PECS, invariant/covariance, type erasure)
- **A2**: Elytra Flight: Concurrency & Virtual Threads (Project Loom, virtual threads, structured concurrency)
- **A3**: Dragon Core: JVM Internals & Memory Architecture (Heap, stack, Metaspace, GC algorithms)
- **A4**: Stronghold Blueprints: Modern Design Patterns (Builder, Factory, Singleton, Strategy)
- **A5**: End Crystal Connections: Networking & HTTP Client (`java.net.http.HttpClient`, JSON parsing)
- **A6**: Ender Dragon Slaying: Spring Boot REST APIs (Dependency Injection, `@RestController`, Spring Data)
- **A7**: Transmuted Realities: Pattern Matching & Sealed Types (Sealed classes, pattern matching for `instanceof` and `switch`)
- **A8**: Capstone Project: Production Cloud Task API (Spring Boot, security, Dockerfile containerization)

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: Vanilla HTML5, modern CSS tokens (Neobrutalism), Vanilla JavaScript (ES2022+ modules).
- **Editor**: CodeMirror 6 standalone bundle (`lib/editor.bundle.js`, 456 KB, zero external CDNs) with Java syntax mode, line numbers, and error squiggles.
- **Audio & FX**: Web Audio API retro synthesizer (`lib/game-fx.js`) and particle canvas for glowing XP orbs.
- **Compiler Backend**: Serverless proxy (`/api/run.js`) with Wandbox OpenJDK 22 backend. (See [`RUNNER_RFC.md`](RUNNER_RFC.md) for self-hosted microVM runner architecture).
- **AI Tutor**: Google Gemini Flash-Lite routed through authenticated Serverless proxy (`/api/ai.js`).
- **Database & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS) and server-side cryptographic XP verification.
- **Hosting**: Vercel Serverless & Edge Network.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kiransamantha995/javaquest.git
cd javaquest
```

### 2. Run locally
JavaQuest works in **Guest Mode** with zero dependencies:
```bash
# Using Node.js built-in server
node local-server.js

# Or using Python 3
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Connect Supabase & AI Tutor (Optional)
To run the full authenticated suite locally:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from template:
   ```env
   GEMINI_API_KEY="your-google-ai-studio-key"
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="your-supabase-anon-key"
   AI_DAILY_LIMIT="50"
   ```
3. Run with Vercel CLI to execute serverless routes:
   ```bash
   npx vercel dev
   ```

---

## 🔒 Security & Sandboxing Architecture

JavaQuest is built on a strict defense-in-depth model:
- **Zero Unauthenticated Proxy Access**: Both `/api/run.js` and `/api/ai.js` require cryptographically valid Supabase JWT tokens. Requests lacking authorization receive immediate `401 Unauthorized`.
- **Zero Client-Side API Keys**: `GEMINI_API_KEY` is kept exclusively on the server and passed via the `x-goog-api-key` header (never exposed in URLs or client bundles).
- **No Simulation Runner**: All code runs against real OpenJDK 22; no AI hallucinations or fake regular-expression evaluators.
- **Output Sanitization**: All compiler outputs, diffs, and AI responses are passed through HTML entity encoding before rendering into the DOM.
- **Strict Content Security Policy**: CSP headers configured in `vercel.json` enforce `'self'` script restrictions without `'unsafe-eval'`.

For full security specifications, review [`SECURITY.md`](SECURITY.md).

---

## 📄 License & Legal Notice

JavaQuest is open-source software licensed under the [MIT License](LICENSE).

### Mojang / Microsoft Trademark Disclaimer
*JavaQuest is an independent educational project and is **not** affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with Mojang Studios, Microsoft Corporation, or any of their subsidiaries or affiliates. "Minecraft" is a registered trademark of Mojang Synergies AB.*
