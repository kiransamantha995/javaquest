// build.js — Optional static build helper for Vercel / Netlify / CI
// Generates config.js from environment variables during deployment if config.js does not exist
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.js');

if (!fs.existsSync(configPath)) {
  const config = {
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
  };
  const content = `// Generated at deployment from environment variables\nwindow.CONFIG = ${JSON.stringify(config, null, 2)};\n`;
  fs.writeFileSync(configPath, content, 'utf8');
  console.log('Created config.js from environment variables.');
} else {
  console.log('config.js already exists.');
}
