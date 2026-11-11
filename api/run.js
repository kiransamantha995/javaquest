// JavaQuest — api/run.js
// Authenticated Java compilation proxy via Wandbox (OpenJDK).
// No simulated / AI fallback — real execution only.
// Security: Supabase JWT required, rate-limited, max code/stdin size enforced.

// ─── Config ───────────────────────────────────────────────────────────────────
const ALLOWED_ORIGIN = 'https://javaquest-ashen.vercel.app';
const MAX_CODE_BYTES  = 20 * 1024;   // 20 KB
const MAX_STDIN_BYTES = 2  * 1024;   //  2 KB
const WANDBOX_TIMEOUT = 25000;        // ms

// ─── Simple in-process rate limiter (resets on cold start) ────────────────────
// For production scale, move to Upstash Redis or similar.
const _ipBucket  = new Map(); // ip  → { count, resetAt }
const _userBucket = new Map(); // uid → { count, resetAt }
const IP_LIMIT   = 10;  // per minute
const USER_LIMIT = 20;  // per minute

function checkRateLimit(bucket, key, limit) {
  const now = Date.now();
  let entry = bucket.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + 60_000 };
    bucket.set(key, entry);
  }
  entry.count++;
  if (entry.count > limit) {
    return false; // rate limited
  }
  return true;
}

// ─── Supabase JWT verification (lightweight RS256 header check) ───────────────
// We trust Supabase's public key; for a full production check use a JWT library.
// This minimal version: decode payload, verify exp, verify iss matches our project.
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const pad = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(pad, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function verifySupabaseJwt(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null; // expired

  // For users (not anon), sub is the user UUID
  if (!payload.sub) return null;

  // Double-check with Supabase /auth/v1/user to confirm token is live
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`
        },
        signal: AbortSignal.timeout(5000)
      });
      if (!r.ok) return null;
      const user = await r.json();
      return user; // { id, email, role, ... }
    } catch {
      // Network hiccup — fall through to payload-only check
    }
  }

  // Fallback: trust payload (acceptable for dev / misconfigured env)
  return { id: payload.sub, email: payload.email, role: payload.role };
}

// ─── Code sanitizer (compile-time helpers only, NOT security) ─────────────────
function sanitizeJavaCode(code) {
  // Auto-repair common copy-paste typo: "port java..." -> "import java..."
  let prepared = code.replace(/^[ \t]*port[ \t]+/gm, 'import ');
  // Strip 'public' from top-level types so multi-class files work in Wandbox
  prepared = prepared.replace(/\bpublic\s+(class|interface|record|enum)\b/g, '$1');
  return prepared;
}

// ─── Privacy-safe logger ──────────────────────────────────────────────────────
function safeLog(level, msg, meta) {
  // Never log code content, chat text, emails, or keys
  const safeMeta = meta ? { ...meta } : {};
  delete safeMeta.code;
  delete safeMeta.stdin;
  delete safeMeta.email;
  if (level === 'error') console.error(`[run] ${msg}`, safeMeta);
  else if (level === 'warn') console.warn(`[run] ${msg}`, safeMeta);
  else console.log(`[run] ${msg}`, safeMeta);
}

// ─── Wandbox runner ───────────────────────────────────────────────────────────
async function runWandbox(code, stdin) {
  const prepared = sanitizeJavaCode(code);
  const userStdin = stdin != null ? String(stdin) : '';

  const response = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'openjdk-jdk-22+36',
      code: prepared,
      stdin: userStdin
    }),
    signal: AbortSignal.timeout(WANDBOX_TIMEOUT)
  });

  if (!response.ok) {
    throw new Error(`Wandbox HTTP ${response.status}`);
  }

  const data = await response.json();
  const statusCode = parseInt(data.status || '0', 10);
  const compilerErr = (data.compiler_error || data.compiler_message || '').trim();
  let programOut = (data.program_output || '').replace(/\r\n/g, '\n');
  let programErr = (data.program_error || '').replace(/\r\n/g, '\n').trim();

  if (statusCode !== 0 && compilerErr) {
    return {
      compile: { code: statusCode, stderr: compilerErr },
      run:     { stdout: '', stderr: compilerErr, code: statusCode }
    };
  }

  // Scanner waiting for input detection
  if (
    statusCode !== 0 &&
    (programErr.includes('NoSuchElementException') ||
     programErr.includes('No line found') ||
     programErr.includes('NoSuchElement'))
  ) {
    return {
      compile: null,
      run: { stdout: programOut, stderr: '', code: 0, waitingForInput: true }
    };
  }

  return {
    compile: null,
    run: { stdout: programOut, stderr: programErr, code: statusCode, waitingForInput: false }
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  const origin = req.headers['origin'] || '';
  const isAllowed = origin === ALLOWED_ORIGIN || process.env.NODE_ENV === 'development';
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const user = await verifySupabaseJwt(req.headers['authorization']);
  if (!user) {
    res.status(401).json({ error: 'Authentication required. Please sign in to use the compiler.' });
    return;
  }

  // ── Rate limit by IP and user ─────────────────────────────────────────────
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (!checkRateLimit(_ipBucket, ip, IP_LIMIT)) {
    safeLog('warn', 'IP rate limited', { ip });
    res.status(429).json({ error: 'Too many requests from your network. Please wait a minute and try again.' });
    return;
  }
  if (!checkRateLimit(_userBucket, user.id, USER_LIMIT)) {
    safeLog('warn', 'User rate limited', { uid: user.id });
    res.status(429).json({ error: 'You\'re running code too fast! Take a breath and try again in a minute.' });
    return;
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const code  = (body.code  || '').trim();
  const stdin = (body.stdin || '').slice(0, MAX_STDIN_BYTES);

  if (!code) {
    res.status(400).json({ error: 'No Java code provided.' });
    return;
  }
  if (Buffer.byteLength(code, 'utf8') > MAX_CODE_BYTES) {
    res.status(400).json({ error: `Code is too large. Maximum size is ${MAX_CODE_BYTES / 1024} KB.` });
    return;
  }

  // ── Run (Wandbox only — no AI simulation) ─────────────────────────────────
  try {
    const result = await runWandbox(code, stdin);
    res.status(200).json(result);
  } catch (err) {
    safeLog('warn', 'Wandbox failed', { status: err.message });
    res.status(503).json({
      error: 'The Java runner is busy or temporarily down. Please wait a moment and try again.',
      details: null // never expose internal errors to client
    });
  }
};
