# Contributing to JavaQuest

Thank you for your interest in contributing to **JavaQuest**! JavaQuest is an open-source, gamified learning platform for modern Java (Java 21 LTS baseline) built with a retro neobrutalist aesthetic inspired by platforms like Codédex.

---

## 1. Project Philosophy & Core Principles

1. **Real Code Execution**: We never simulate Java execution using regular expressions or AI hallucinations. Code runs against a real OpenJDK 21/22 compiler and JVM.
2. **Deterministic Feedback**: Every exercise includes at least 3 rigorous, deterministic test cases (including boundary/edge conditions).
3. **Zero Bloat, Vanilla First**: The core frontend is deliberately built with vanilla JavaScript, modern CSS tokens, and zero heavy build pipelines or framework dependencies.
4. **Defense in Depth**: Client credentials are never exposed. External API requests (AI tutor, compiler) are gated behind authenticated Supabase JWT verification in serverless functions.
5. **Academic Rigor**: Modules include textbook citations (*Head First Java*, *Core Java*, *The Java Language Specification*, *Effective Java*) alongside engaging Minecraft-style game lore.

---

## 2. Local Development Setup

### Prerequisites
- Node.js 18+ or any local HTTP server
- Git

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/kiransamantha995/javaquest.git
cd javaquest

# 2. Start the local server
node local-server.js

# 3. Open in your browser
# Visit http://localhost:3000
```

### Environment Variables (for AI Tutor & Supabase Auth)
To test the AI Tutor or cloud account synchronization locally:
1. Copy `.env.example` to `.env` (or configure `config.js`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
2. Run using Vercel CLI to test serverless functions:
   ```bash
   npx vercel dev
   ```

---

## 3. Curriculum Authoring Guide

Curriculum tracks are modularized under `curriculum/`:
- `curriculum/track1.js`: The Overworld (Beginner — B1 to B8)
- `curriculum/track2.js`: The Nether (Intermediate — I1 to I8)
- `curriculum/track3.js`: The End (Advanced — A1 to A8)
- `curriculum.js`: Aggregates the tracks and exposes `window.CURRICULUM`.

### Module Structure Specification

Every module must follow this schema:

```javascript
{
  id: "b1_first_steps",
  track: 1, // 1 = Beginner, 2 = Intermediate, 3 = Advanced
  title: "First Steps in the Overworld",
  subtitle: "Setup, Syntax, and Your First Program",
  description: "Wake up in the Overworld, understand the JVM, and craft your first Java program.",
  icon: "⛏️",
  bookCitation: "Core Java Vol 1, Ch 2 & 3; Head First Java, Ch 1",
  checkpoint: {
    title: "Overworld Checkpoint: Basic Crafting",
    tasks: [
      "Explain the role of the JDK, JRE, and JVM",
      "Write a valid Java class with a main method",
      "Print formatted messages to standard output"
    ]
  },
  lessons: [
    {
      id: "b1_l1_hello_world",
      title: "Hello, Minecraft!",
      conceptMarkdown: `### The Java Main Method\n\nEvery standalone Java application begins execution at the \`main\` method...`,
      starterCode: `public class Main {\n    public static void main(String[] args) {\n        // TODO: Print "Hello, Crafting World!"\n    }\n}`,
      solution: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Crafting World!");\n    }\n}`,
      hints: [
        "Use System.out.println() to print a string with a newline.",
        "Ensure the string exactly matches: \"Hello, Crafting World!\"",
        "The complete statement is: System.out.println(\"Hello, Crafting World!\");"
      ],
      tests: [
        {
          name: "Prints exact greeting",
          stdin: "",
          expected: "Hello, Crafting World!"
        },
        {
          name: "Ends with newline",
          stdin: "",
          expectedRegex: "^Hello, Crafting World!\\r?\\n?$"
        },
        {
          name: "Compiles without warnings",
          stdin: "",
          expectedExitCode: 0
        }
      ]
    }
  ],
  quiz: [
    {
      question: "Which component executes Java bytecode?",
      options: [
        "(Recommended) JVM (Java Virtual Machine)",
        "JDK (Java Development Kit)",
        "Javac compiler",
        "Operating System kernel directly"
      ],
      answer: 0,
      explanation: "The JVM is the abstract computing machine that enables a computer to run a Java program."
    }
  ]
}
```

### Quality Checklist for Exercises
- [ ] At least 3 test cases per exercise (happy path, boundary condition, syntax/type edge case).
- [ ] Three progressive tiers of hints (Nudge $\rightarrow$ Guidance $\rightarrow$ Near-Solution).
- [ ] Starter code compiles or has clear, self-explanatory `// TODO` markers.
- [ ] Accurate textbook citation to official references (*The Java Language Specification*, *Core Java*, *Effective Java*).

---

## 4. Security & Safety Guidelines

1. **No Client Secrets**: Never commit API keys, service role keys, or tokens.
2. **Output Sanitization**: Always use the `esc()` helper function when rendering user or compiler content into HTML templates.
3. **No `eval()`**: Never use `eval()`, `Function()`, or `setTimeout` with string arguments.
4. **Content Security Policy**: Keep `vercel.json` CSP rules strict. Do not add `'unsafe-eval'`.

---

## 5. Commit & Pull Request Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat(curriculum)`: New exercise or module
- `fix(editor)`: Bug fix in CodeMirror or test runner
- `security(api)`: Enhancements to auth, proxies, or rate limiting
- `docs(readme)`: Documentation updates
- `style(css)`: Visual polish or design tokens

Please open a pull request with a descriptive title and screenshots of any UI alterations.
