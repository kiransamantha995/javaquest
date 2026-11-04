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

## Security & Architecture

- **Content Security Policy**: Headers configured across `vercel.json` and `_headers` to restrict unauthorized script execution and restrict external connections to trusted endpoints.
- **Database Row-Level Security**: Supabase tables enforce RLS policies ensuring users can only read and write their own records.
- **Static Hosting**: The client runs entirely in the browser with zero custom server-side dependencies to maintain.

## License

MIT License. Free for personal and educational use.
