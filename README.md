# JavaQuest

JavaQuest is a web-based learning platform for Java, styled with a retro neobrutalist aesthetic inspired by platforms like Codédex. It guides learners from basic syntax through advanced concepts like concurrency, JVM internals, and Spring Boot through bite-sized lessons, interactive challenges, and a built-in code runner.

## Overview

Learning Java usually involves wrestling with heavy IDEs and boilerplate before writing your first program. JavaQuest keeps things approachable and fast by letting you read lessons, write code, run test cases, and track your progress directly in the browser.

### Key Highlights

- **Three Learning Tracks (24 Modules)**:
  - **Beginner**: Variables, operators, control flow, methods, arrays, basic OOP, and exceptions. Ends with a console-based Personal Expense Tracker project.
  - **Intermediate**: Advanced OOP, records, collections, generics, streams, file I/O, regex, and JDBC. Ends with a Library Management project.
  - **Advanced**: JVM memory models, virtual threads, design patterns, Spring Boot REST APIs, and Docker basics. Ends with a Task Management API project.
- **In-Browser Code Runner**: Write and run Java code directly in the browser playground with syntax highlighting and instant output.
- **Coding Challenges & Test Cases**: Each module includes coding problems tested against structured test cases with attempt-based scoring.
- **AI Coding Tutor (JavaBot)**: A built-in tutor powered by Gemini Flash-Lite that reviews your code, explains compiler errors, and offers hints without spoiling solutions. It is accessible once signed in.
- **Progress Tracking & Guest Mode**: Supports user accounts via Supabase for cloud sync across devices, as well as a local guest mode that saves progress to localStorage.
- **Customizable Avatars & Badges**: Earn milestone badges and customize your character avatar as you complete lessons and maintain daily streaks.

## Tech Stack

The application is built deliberately as a lightweight, dependency-free single-page application:

- **Frontend**: HTML5, modern CSS3 (Neobrutalism design system), Vanilla JavaScript (ES6+)
- **Typography**: Space Grotesk, Plus Jakarta Sans, JetBrains Mono
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **AI Assistant**: Google Gemini Flash-Lite API
- **Deployment**: Static hosting (Vercel, Netlify, or GitHub Pages)

## Getting Started

Because there is no build step or bundler requirement, you can run the project locally with any static web server.

### 1. Clone the repository
```bash
git clone https://github.com/kiransamantha995/javaquest.git
cd javaquest
```

### 2. Configure API Keys (Optional)
JavaQuest runs completely out-of-the-box in **Guest Mode** with zero configuration required.

If you want to use the **JavaBot AI Tutor** or **Supabase Cloud Sync**:
1. Copy the example configuration:
   ```bash
   cp config.example.js config.js
   ```
2. Add your free [Gemini API Key](https://aistudio.google.com/apikey) to `config.js`, or simply paste it into the application Settings (⚙️).
3. (Optional) Add your Supabase project credentials to `config.js` if you wish to connect your own PostgreSQL database.

*(Note: `config.js` is ignored by git to keep your private keys safe.)*

### 3. Run locally
Using Node.js:
```bash
node local-server.js
```
Or using Python:
```bash
python -m http.server 3000
```

Open `http://localhost:3000` in your browser.

## Project Structure

```
├── index.html         # Main single-page application structure and screens
├── style.css          # Neobrutalist styling, design tokens, and layout
├── config.example.js  # Template for API keys (Gemini, Supabase)
├── app.js             # Core application state, navigation, and compiler logic
├── curriculum.js      # Complete 24-module curriculum and challenge data
├── ai-tutor.js        # AI tutor integration and prompt handling
├── supabase.js        # Authentication and cloud database synchronization
├── supabase_schema.sql # Database schema, RLS policies, and triggers for Supabase
├── animations.js      # UI transitions and micro-interactions
├── local-server.js    # Minimal local HTTP development server
└── vercel.json        # Static routing and Content Security Policy rules
```

## Security Measures

JavaQuest is designed with security best practices across client-side logic, network communications, and cloud database access:

- **Strict Content Security Policy (CSP)**: HTTP response headers configured across `vercel.json` and `_headers` enforce restrictive resource boundaries:
  - `connect-src` is strictly allowlisted to Supabase (`https://*.supabase.co`), Google Gemini AI (`https://generativelanguage.googleapis.com`), and Piston code execution (`https://emkc.org`).
  - `X-Frame-Options: DENY` prevents Clickjacking and UI redress attacks.
  - `X-Content-Type-Options: nosniff` protects against MIME-type confusion attacks.
  - `Strict-Transport-Security` enforces modern TLS and HTTPS across all requests.
  - `Permissions-Policy` completely disables unauthorized access to camera, microphone, and geolocation APIs.

- **PostgreSQL Row-Level Security (RLS)**:
  - Every database table (`profiles`, `progress`, `earned_badges`) enforces strict Row Level Security.
  - Read, write, and delete operations are restricted to the record owner via cryptographically verified Supabase auth tokens (`auth.uid() = id`).
  - No user or unauthenticated client can read or modify another learner's profile, lesson progress, or achievements.

- **Credential & Secret Protection**:
  - Runtime API keys and database credentials in `config.js` and `.env` are excluded from version control via `.gitignore`.
  - Deployment platforms inject secrets via encrypted environment variables at build time using `build.js`.
  - User-supplied API keys for the AI tutor (JavaBot) are kept exclusively within browser `localStorage` and sent only to Google's official Gemini endpoint.

- **Input Sanitization & XSS Defense**:
  - Compiler outputs and AI chat responses are escaped before DOM insertion. Code snippets are rendered within `<pre>` and `<code>` blocks with syntax tokens rather than executable HTML.
  - Persistent state from remote storage and local cache passes through validation (`sanitizeState()`) to protect against malformed or malicious payloads.

- **Sandboxed Code Execution**:
  - User Java code is compiled and executed inside ephemeral, resource-constrained container sandboxes via Piston API with strict execution timeouts, isolating untrusted code from the host system.

- **Session & Token Hygiene**:
  - Authentication tokens received from email confirmation flows are parsed and immediately purged from the browser address bar using `window.history.replaceState` to prevent token exposure in browser histories or referrers.
  - JWT sessions automatically expire and refresh securely.

## License

MIT License. Free for personal and educational use.
