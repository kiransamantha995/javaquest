# JavaQuest — SECURITY.md

This document lists every security threat addressed in Phase 1 of the upgrade, residual risks, and planned future work.

---

## ✅ Fixed in Phase 1

### 1. Unauthenticated API Access (`api/ai.js`, `api/run.js`)
- **Was:** `Access-Control-Allow-Origin: *`, no auth, any internet client could call.
- **Fixed:** Supabase JWT required on every request. CORS restricted to `javaquest-ashen.vercel.app`. Guest access is not permitted.

### 2. API Key Leakage via URL (`api/ai.js`)
- **Was:** `?key=${apiKey}` in Gemini request URL — appeared in server logs.
- **Fixed:** Gemini key passed via `x-goog-api-key` header only. Never in URL.

### 3. `body.apiKey` Client Override (`api/ai.js`)
- **Was:** `getApiKey(body)` — anyone could supply their own or our key from the request body.
- **Fixed:** `body.apiKey` is explicitly deleted before processing. Server uses only `process.env.GEMINI_API_KEY`.

### 4. Prompt Injection (`api/ai.js`)
- **Was:** `topic`, `level`, chat messages, and code interpolated directly into prompts.
- **Fixed:** System instructions separated from user data. User content wrapped in clearly delimited `[DATA]` sections with explicit instruction to ignore embedded commands. Input lengths capped and HTML-escaped before embedding.

### 5. AI-Simulated Code Execution (`api/run.js`)
- **Was:** When Wandbox failed, Gemini was asked to pretend to run the code — producing false output.
- **Fixed:** Simulated fallback removed entirely. If Wandbox is down, the API returns HTTP 503 with a clear user-facing message. No fake output.

### 6. XSS via `innerHTML` with AI output (`app.js`, `ai-tutor.js`)
- **Was:** ~68 `innerHTML` assignments; several rendered AI-generated text directly.
- **Fixed:**
  - Added global `esc(str)` utility (HTML-encodes `& < > " '`).
  - `fmt(s)` already called `esc(s)` first ✓.
  - `appendChatMsg()` HTML-escapes before rendering ✓.
  - `api/ai.js` now `escHtml()`-escapes all string fields before returning JSON.
  - Remaining `innerHTML` assignments only receive static HTML strings or already-escaped values.
  - `callGeminiDirect()` client-side fallback removed.

### 7. Free Heart Refill (`app.js`)
- **Was:** `refillHearts()` immediately set hearts to 3 with no cost or cooldown.
- **Fixed:** 4-hour cooldown enforced. Button in Settings shows time remaining. Toast guides player to complete practice to earn hearts back.

### 8. CSP Misconfiguration — Duplicate Sources (`vercel.json`, `_headers`)
- **Was:** `vercel.json` and `_headers` had conflicting CSPs. `wandbox.org` missing in one. `unsafe-eval` present.
- **Fixed:** `vercel.json` is the **single source of truth** for all security headers. `_headers` is now a stub comment. `unsafe-eval` removed. `wandbox.org` and `blob:` added where needed. `emkc.org` removed (no longer used).

### 9. Privacy Logging
- **Was:** Console logs could contain code content, chat text, and error details.
- **Fixed:** `safeLog()` wrappers in both API files strip `code`, `stdin`, `email` fields. Only action type, reason code, and user ID are logged.

---

## ⚠️ Residual Risks (to address in later phases)

### R1. Client-Side XP/Hearts/Level
- **Risk:** A logged-in user can still set `STATE.player.xp = 999999` in the browser console and `localSave()` will sync it to Supabase.
- **Plan:** Phase 1 mitigated this by restricting CORS and removing unauthenticated API access. Full fix in Phase 6: move XP awards to Supabase RPC / Edge Functions + tighten RLS so clients cannot `UPDATE` `xp`, `level`, `hearts` directly.

### R2. `unsafe-inline` in CSP
- **Risk:** Inline `<script>` tags and inline event handlers remain possible.
- **Plan:** Migrate all remaining inline scripts to external files, then switch to nonce- or hash-based CSP in Phase 7.

### R3. JWT Verification is Payload-Only in Edge Cases
- **Risk:** If Supabase is unreachable during the `/auth/v1/user` check, the API falls back to trusting the JWT payload (expiry check only, no revocation check).
- **Plan:** Add a lightweight JWKS RS256 signature verification using Supabase's public key (no network call required) in Phase 6.

### R4. No Supabase RLS on `profiles` for `xp`/`level`/`hearts`
- **Risk:** Supabase RLS policies have not been audited. Clients may still be able to `UPDATE` these fields directly.
- **Plan:** Audit and tighten RLS in Phase 6. Add migration files.

### R5. Rate Limiter is In-Process
- **Risk:** The in-memory rate limiter resets on every cold start (Vercel serverless function restarts frequently).
- **Plan:** Move to Upstash Redis (or Vercel KV) for persistent rate limiting in Phase 6.

### R6. No CSRF Protection
- **Risk:** Cross-site requests could trigger state changes if cookies are used (we use `Authorization` header + Bearer token, which mitigates this for API calls).
- **Status:** Low risk currently because we use Bearer tokens, not cookies.

---

## 🔮 Planned Future Work

| Item | Phase |
|------|-------|
| Supabase RLS audit + `award_xp` Edge Function | 6 |
| JWKS RS256 JWT signature verification | 6 |
| Persistent rate limiter (Upstash Redis) | 6 |
| Remove `unsafe-inline` via nonces/hashes | 7 |
| Self-hosted sandbox runner (gVisor/Fly.io) | 7 |
| Unit tests: sanitizer, rate limiter, schema validator | 6 |
| Abuse logging dashboard (count + reason codes) | 6 |

---

## 📋 Mojang / Minecraft Legal Notice

JavaQuest uses **original pixel/voxel art** inspired by — but not copied from — Minecraft. All SVG badge icons and character sprites are original works. No Mojang textures, skins, or logos are used.

> *JavaQuest is not affiliated with or endorsed by Mojang Studios or Microsoft Corporation.*

Review [Mojang's Brand and Assets Guidelines](https://www.minecraft.net/en-us/brand-guidelines) before any public launch of Minecraft-themed content.

---

*Last updated: Phase 1 deployment.*
