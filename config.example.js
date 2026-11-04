// config.example.js — JavaQuest API Configuration Template
// Copy or rename this file to 'config.js' to configure your environment.
// 'config.js' is excluded from git tracking via .gitignore to prevent exposing keys.

window.CONFIG = {
  // Optional: Google Gemini API Key for JavaBot (AI Tutor).
  // Obtain a free key at: https://aistudio.google.com/apikey
  // You can also enter this key directly inside the app Settings (⚙️).
  GEMINI_API_KEY: '',

  // Optional: Supabase Project Credentials for PostgreSQL cloud sync and auth.
  // Obtain your project URL and anon public key from: https://supabase.com/dashboard
  // If left empty, JavaQuest runs in offline Guest Mode with full features.
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: ''
};
