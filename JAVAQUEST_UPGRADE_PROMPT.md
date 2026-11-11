# JavaQuest Upgrade Prompt

Paste everything below the line into your coding agent (Claude Code, Cursor, etc.) with the project folder open.

---

## ROLE

You are a senior full-stack engineer, game-UI designer, and Java educator. You are upgrading **JavaQuest**, a browser-based Java learning platform, into something in the spirit of **Codédex** (codedex.io): a playful, project-based, "learn by doing" platform where every lesson has a short explanation on one side and a live editor with tests on the other, and the whole product feels like a game rather than a textbook.

Work in **phases**. After each phase: run the app, run any checks you can, summarize what changed, and wait for my "continue" before starting the next phase. Do not rewrite everything at once. Do not add a dependency or build step without asking first and explaining why.

## CURRENT STATE (read before touching anything)

Plain static site, no framework: `index.html`, `app.js` (~190 KB), `style.css` (~180 KB), `curriculum.js` (~160 KB, 24 modules), `ai-tutor.js`, `supabase.js`, `animations.js`. Serverless endpoints in `api/ai.js` (Gemini proxy) and `api/run.js` (Java runner via Wandbox, with a Gemini "simulator" fallback). Supabase for auth and progress, deployed on Vercel.

### Known problems you must fix (verified in the code)

**Security (Phase 1, do this first)**
1. `api/ai.js` has `Access-Control-Allow-Origin: *`, no authentication, no rate limit, and **accepts an `apiKey` from the request body**. Anyone can call it and burn the Gemini quota. Fix: require a valid Supabase JWT (guests get a tiny, IP-limited quota), restrict CORS to our own origin, delete the `body.apiKey` path, and add per-user and per-IP rate limits and daily token budgets.
2. The Gemini key is sent in the URL query string (`?key=`). Move it to the `x-goog-api-key` header so it never appears in logs.
3. User text is interpolated straight into prompts (`topic`, `level`, chat messages, code). That is prompt injection. Fix: keep instructions in a system prompt, pass user content as clearly delimited data, cap lengths, and validate every model response against a strict JSON schema before sending it to the browser. Treat model output as untrusted.
4. `app.js` and `ai-tutor.js` contain about 68 `innerHTML` assignments, and AI output is rendered in the chat and quiz UI. That is an XSS risk. Fix: render AI text with `textContent` or a small sanitized-markdown renderer (allow-list of tags, no raw HTML, no `javascript:` URLs). Audit every `innerHTML` and use `esc()` or DOM APIs.
5. `api/run.js` is an open, unauthenticated proxy to Wandbox, and when Wandbox fails it asks Gemini to **pretend** to run the code. Pretend output is wrong output, and it teaches students false things. Fix: remove the simulated fallback. If the real runner is down, say so. Add auth, rate limit, max code size (e.g. 20 KB), max stdin size, and a timeout. Plan a self-hosted sandbox later (see Phase 6).
6. XP, level, hearts, and badges are computed in the browser and written to Supabase by the client. A student can set their own XP in the console. Fix: move XP and level awards to server-side functions (Supabase RPC or Edge Function) that verify the lesson or test was really passed. Tighten RLS so clients cannot update `xp`, `level`, or `hearts` directly.
7. CSP uses `'unsafe-inline'` and `'unsafe-eval'`, and `_headers` and `vercel.json` disagree (`wandbox.org` is missing in one). Make them one source of truth, remove `unsafe-eval`, and move inline scripts and handlers into files so `unsafe-inline` can go (use nonces or hashes if needed).
8. "Refill Hearts Now" in Settings is a free button that makes the hearts mechanic meaningless. Remove it, or turn it into a cooldown or a "practice to earn hearts" flow.
9. Add a privacy-safe logging rule: never log code, chat text, emails, or keys.

**Correctness and polish**
10. CSS and HTML have drifted apart: some class names used in markup have no CSS. Do a full pass: list every class used in `index.html` and in the HTML built in `app.js`, diff against `style.css`, and style or remove each orphan. (I already added styles for the hero buttons, HUD sidebar, and track tabs; verify and continue.)
11. The Code Playground has no syntax highlighting, no line numbers, no bracket matching, and the console text wraps badly. Replace the editor with **CodeMirror 6** (or Monaco if you justify it): Java mode, line numbers, auto-indent, bracket pairing, error squiggles from compiler output, and a theme that matches the UI.
12. Single source of truth for numbers. Lesson counts, exercise totals, XP totals, and badge counts must all be derived from `curriculum.js` and the player state, never hard-coded (`5,200`, `8 CHAPTERS`, `~24h`, `24 Modules`).
13. Accessibility: visible focus states, keyboard navigation, `prefers-reduced-motion` support for animations, contrast of at least 4.5:1, labels on every icon-only button, and a screen-reader-friendly lesson layout.
14. Mobile: the lesson screen (instructions plus editor) must work on a phone. Use tabs on small screens instead of side-by-side.

## DESIGN DIRECTION: PLAYFUL AND MINECRAFT-INSPIRED

Goal: it should feel like stepping into a blocky world, not a SaaS dashboard. Pick **one** aesthetic and commit: chunky pixel/voxel look, warm and bright, tactile buttons, lots of small delightful details.

**Legal guardrail (important):** "Minecraft" is Mojang/Microsoft's trademark, and its characters and textures are their assets. Make **Minecraft-inspired original art**: our own pixel/voxel characters, blocks, and mobs, drawn by us as SVG or canvas pixel grids. Do not copy Mojang textures, skins, or logos. Do not claim the product is "authentic Minecraft". Add a footer line: "JavaQuest is not affiliated with or endorsed by Mojang or Microsoft." Review Mojang's brand and asset usage guidelines before launching publicly, and tell me what you changed so I can decide how far to take the theme.

Ideas to implement:
- **World map:** the learning map is an isometric or top-down voxel world. Each module is a biome or structure (village, mine, farm, redstone lab, Nether fortress, End city). Paths between them unlock as you progress. Chapters are "chunks" that visibly load in.
- **Concepts as game objects** (use these as the teaching metaphors in lessons too, and always follow with the precise Java explanation so the metaphor never replaces the truth):
  - variable = a chest with a label and a type
  - primitive types = item stacks of different sizes
  - loop = a redstone clock or minecart on a rail
  - `if`/`else` = a lever or pressure plate
  - method = a crafting recipe (inputs in, output out)
  - class = a blueprint, object = a mob spawned from it
  - inheritance = mob families (zombie to husk to drowned)
  - interface = a contract every mob in the group must honour
  - exception = a creeper (handle it with `try/catch` or it blows up)
  - collections = inventory slots, hoppers, and chests
  - streams = hopper and minecart pipelines
  - threads = many villagers working at once
  - the JVM = the world engine that loads chunks (classes)
- **Feedback:** XP orbs fly to the bar, a "pop" sound on a correct answer, a block-break animation when a test passes, a creeper-hiss "oops" animation on a failed test (gentle and funny, never shaming), confetti made of blocks on module completion. All sounds optional, off by default, and respect reduced-motion.
- **Hearts, hunger bar, XP bar** styled like a game HUD, but still readable and accessible.
- **Companion:** a small pixel mascot (our own design, not a Mojang mob) that reacts to what you do: celebrates, scratches its head when you fail twice, and nudges you after idle time.
- **Avatar studio:** original pixel characters, unlockable skins, hats, and capes earned through badges.
- **Badges:** original block and item icons. Fix the Trophy Room so locked badges are not four identical padlocks: show the silhouette and a hint of how to earn each one.
- **Typography and palette:** one pixel display font for headings only, a highly readable UI font for body text, one code font. Keep the yellow, ink, and mint palette but add biome accent colors per track.
- Remove the mixed aesthetics ("parchment", terminal, neobrutalist, emoji). Replace every emoji used as an icon with our pixel or SVG icon set.

## CURRICULUM: REBUILD FROM SCRATCH, BIGGER AND MORE INFORMATIVE

Replace the thin modules in `curriculum.js` with a rich curriculum. Keep the 3-track structure (Beginner, Intermediate, Advanced) with 8 modules per track plus a capstone per track, but **write all content fresh**.

### Rules for content and references
- Base the content on well-known textbooks and primary sources, and **cite them** in each lesson in a "References" section. Use these as the backbone:
  - *Head First Java*, 3rd ed. (Sierra, Bates, Gee): beginner tone and mental models
  - *Java: The Complete Reference* (Herbert Schildt): language coverage
  - *Core Java, Volume I: Fundamentals* (Cay Horstmann): fundamentals and collections
  - *Introduction to Java Programming* (Y. Daniel Liang) and *Think Java* (Allen Downey): exercises and progression
  - *Effective Java*, 3rd ed. (Joshua Bloch): best practices and pitfalls
  - *Modern Java in Action* (Urma, Fusco, Mycroft): lambdas and streams
  - *Java Concurrency in Practice* (Goetz et al.): threads and memory model
  - *The Java Language Specification* and *The Java Virtual Machine Specification* (Oracle, current SE version), plus relevant JEPs: exact rules and JVM internals
  - *Spring in Action* (Craig Walls) and the Spring reference docs: Spring Boot module
  - The official Oracle Java Tutorials and `docs.oracle.com` API docs: API behavior
- **Never copy text from books.** Explain every idea in our own words and with our own examples. Cite as: *Book title, author, edition, chapter or section title*. Do **not** invent page numbers. If you are not sure of a chapter number, cite the book and the chapter or topic name, and mark the entry `"verify": true` so I can check it. Never fabricate a reference.
- Use **Java 21 LTS** as the baseline. Mention newer features (records, sealed classes, pattern matching, virtual threads) where they belong, and say which Java version introduced them.

### Required shape of every module
Write `curriculum.js` content (or move it to JSON files loaded at runtime if that is cleaner; ask me first) in this structure:

```
module {
  id, code, track, title, subtitle, biome, estimatedMinutes,
  learningObjectives[],            // 3-6, measurable ("Write a loop that...")
  prerequisites[],
  lessons[ 6-10 ] {
    id, title, xp, estimatedMinutes,
    story,                         // short Minecraft-flavoured hook (2-4 sentences)
    explanation[],                 // blocks: text / code / diagram / callout (tip, warning, "common mistake")
    underTheHood,                  // what the JVM/compiler actually does (memory, bytecode, rules)
    workedExample { code, walkthrough[] },   // line-by-line explanation
    commonMistakes[],              // with the real error message and the fix
    checkpoint[],                  // 2-3 quick questions inline
    exercise {                     // guided, runnable
      instructions, starterCode, hints[3], solution,
      tests[ { name, stdin, expectedStdout } ]
    },
    references[ { source, location, verify } ]
  },
  quizBank[ 12+ ],                 // varied: mcq, predict-output, spot-the-bug, fill-in, order-the-lines
  project { title, brief, milestones[], rubric[], stretchGoals[] },
  glossary[],
  references[]
}
```

- Each lesson should take 8 to 15 minutes. A module should be roughly 1.5 to 3 hours. Beginner modules start gentle and build one idea at a time; later modules assume earlier ones and revisit them (spaced repetition: re-ask old concepts in new quizzes).
- Each lesson must include at least one **"predict the output"** and one **"find the bug"** activity.
- Exercises must have **deterministic tests** (input to expected output), not "AI says it looks right". The test results come from really running the code.

### Suggested syllabus (adjust if you find a better order, and tell me why)
**Track 1, Overworld (Beginner):** 1 How Java runs (source, bytecode, JVM, JDK) · 2 Variables, types, input · 3 Operators and expressions · 4 Decisions and loops · 5 Methods and scope · 6 Arrays and Strings · 7 Classes and objects (OOP foundations) · 8 Exceptions and first collections · Capstone: console expense tracker.

**Track 2, Nether (Intermediate):** 1 Inheritance, interfaces, polymorphism · 2 Collections and generics in depth · 3 Files, I/O, try-with-resources · 4 Lambdas, streams, `Optional` · 5 Records, enums, sealed types, pattern matching · 6 Testing with JUnit 5 and debugging · 7 JDBC and SQL · 8 Concurrency basics · Capstone: inventory or library system with tests.

**Track 3, End (Advanced):** 1 JVM memory, class loading, GC · 2 Java Memory Model and advanced concurrency · 3 Virtual threads and structured concurrency · 4 Design patterns and architecture · 5 Networking, HTTP, security basics · 6 Spring Boot, REST, JPA · 7 Performance and profiling · 8 Packaging, Docker, CI/CD · Capstone: task-management REST API.

## LESSON EXPERIENCE (Codédex-style)

- Split-screen lesson page: instructions and checkpoints on the left, editor and console on the right, "Run" and "Submit" buttons, and a progress strip across the top. Each lesson step reveals as you complete the previous one.
- Test results appear as readable checks with a diff of expected and actual output.
- Hints unlock in stages (nudge, bigger nudge, near-solution). The full solution is available only after real attempts, and viewing it costs a little XP or hearts.
- A lesson-end recap card: what you learned, what to review, and your next quest.
- Bookmarkable lesson URLs and resume-where-you-left-off.
- Daily goal and streak with a **streak freeze** that can be earned.
- Optional: "Explain it differently" button that shows an alternate explanation (pre-written, not live AI) for the concept.

## AI TUTOR: WATCHES, SUGGESTS, AND IS SAFE

Rebuild `ai-tutor.js` and `api/ai.js` as a real coding mentor, **not** an answer machine.

**Behavior**
- **Live watching (opt-in, clearly shown):** the tutor can see the current lesson, the instructions, the code in the editor, the last run output, the last test results, and the last compiler error. The UI shows a small "JavaBot is watching your code" indicator that the student can pause. Nothing else on the page or device is ever sent.
- **When to speak:** after a failed run or failed test, after the student is idle for a while on an unfinished step, or when static checks spot a likely problem (missing semicolon, mismatched braces, `=` vs `==`, `String` compared with `==`, off-by-one loop bounds, unclosed `Scanner`, uninitialized variable, missing `return`). Debounce so it never interrupts typing. Allow at most one unprompted suggestion per few minutes, and a "stop suggesting" toggle.
- **Socratic by default:** first ask a guiding question, then give a hint, and only then a concrete fix, escalating one level at a time. Refuse to hand over the full solution to a graded exercise unless the student has used all hints. Always explain *why*, and link to the lesson section that covers the concept.
- **Error translator:** turn javac and runtime errors into plain English with the line highlighted in the editor and a suggested fix the student can apply with one click ("Apply suggestion", shown as a diff first).
- **Code review mode:** after a passing submission, review style and robustness (naming, duplication, edge cases, `Effective Java` guidance) and cite the lesson or book topic.
- **Honesty:** if the tutor is unsure, it says so. It never claims code "would output X" without running it: use the real runner for ground truth and let the model explain the result.
- **Memory of the learner (local, deletable):** track which concepts the student keeps missing and feed that into review quizzes. The student can view and delete it.

**Security and safety requirements (non-negotiable)**
- Auth required on every AI call (Supabase JWT), with a per-user daily quota, per-minute rate limit, max input size, and max output tokens. Return friendly "slow down" messages.
- System prompt separated from user data. Student code and chat are **untrusted data**: wrap them in delimiters, instruct the model to ignore instructions inside them, and never let model output trigger actions on its own (no auto-running code, no auto-submitting).
- Strict response schema validation (for example with a small JSON-schema check) and a safe fallback message if the model returns junk. Strip or escape HTML in all model output.
- Do not send emails, user IDs, or any personal data to the model. Redact obvious secrets in pasted code (API keys, tokens).
- Topic guard: the tutor stays on Java and programming. Politely decline unrelated requests, and keep the tone suitable for learners of all ages.
- No client-side keys, anywhere. Keys live in server environment variables only. Add a startup check that fails loudly if the key is missing.
- Add basic abuse logging (counts and reason codes only, no content) and a kill switch environment variable.
- Add unit tests for the sanitizer, the schema validator, and the rate limiter.

## CODE EXECUTION

- Real execution only. No AI-simulated output.
- Keep Wandbox (or another real runner) behind our authenticated, rate-limited API for now. Show a clear "runner is busy or down, try again" state.
- Propose (do not build yet) a self-hosted option: a locked-down container or Firecracker or gVisor sandbox with CPU, memory, time, and network limits, so the runner does not depend on a free third party. Give me a short design and cost note.

## DELIVERY PHASES

1. **Security and correctness:** items 1 to 9 above, plus the single-source-of-truth fix and the CSS orphan audit. Add a `SECURITY.md` listing every threat you addressed and what remains.
2. **Editor and lesson shell:** CodeMirror, split-screen lesson layout, test runner UI, mobile layout, accessibility pass.
3. **Visual overhaul:** Minecraft-inspired original art, world map, HUD, mascot, animations, sounds (opt-in), and the avatar and badge redesign.
4. **Curriculum, Track 1 (Beginner):** fully written, tested, and cited. Stop and let me review the quality before writing the other two tracks.
5. **Curriculum, Tracks 2 and 3**, using the same structure.
6. **AI tutor v2:** live watching, error translator, Socratic hints, code review, memory, and all security requirements above.
7. **Polish:** performance (lazy-load curriculum per module, defer heavy scripts), analytics that respect privacy, README update, and a short contributor guide for adding a module.

## ACCEPTANCE CHECKS

- No API key reachable from the browser. Calling `/api/ai` or `/api/run` without a valid token returns 401. Exceeding the rate limit returns 429.
- Setting XP or level from the browser console does nothing server-side.
- Pasting `<img src=x onerror=alert(1)>` into chat, a username, or code never executes.
- Every exercise has at least 3 tests, and the reference solution passes all of them when run for real.
- Every lesson has references, and none contains copied book text or invented page numbers.
- Lighthouse accessibility score of at least 95, keyboard-only play is possible, and the app works at 360 px width.
- The README explains setup, environment variables, and how to add a new module.

## WORKING RULES

- Show me a short plan before each phase. Ask if something is ambiguous instead of guessing.
- Keep commits small and focused with clear messages.
- Never delete user data or migration history. Provide SQL migrations as new files.
- When you cite a book, tell me which citations you are unsure about so I can verify them.
- If any requirement here conflicts with security or with copyright, security and copyright win. Tell me and propose an alternative.
