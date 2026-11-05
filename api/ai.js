// JavaQuest Serverless AI Engine — api/ai.js
// Runs on Vercel Node.js Serverless Runtime
// Securely proxies requests to Gemini Flash-Lite using process.env.GEMINI_API_KEY
// Zero client-side API key leakage; handles Quiz Generation, Deep Dives, Mistake Diagnostics & Chat

const https = require('https');

function getApiKey(reqBody) {
  return process.env.GEMINI_API_KEY || (reqBody && reqBody.apiKey) || '';
}

function callGeminiAPI(apiKey, model, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const targetModel = model || 'gemini-flash-lite-latest';
    const path = `/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 25000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch(e) {
            reject(new Error('Invalid JSON response from Gemini'));
          }
        } else {
          try {
            const errObj = JSON.parse(body);
            reject(new Error((errObj.error && errObj.error.message) || `Gemini API error ${res.statusCode}`));
          } catch(e) {
            reject(new Error(`Gemini API error ${res.statusCode}: ${body.slice(0, 100)}`));
          }
        }
      });
    });

    req.on('error', err => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to Gemini API timed out (25s)'));
    });

    req.write(data);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    body = body || {};

    const apiKey = getApiKey(body);
    if (!apiKey) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please configure it in your Vercel project environment variables.'
      });
      return;
    }

    const action = body.action || 'chat';

    // ─────────────────────────────────────────────────────────────────
    // 1. DYNAMIC QUIZ GENERATION (Randomized, Deep & Varied)
    // ─────────────────────────────────────────────────────────────────
    if (action === 'quiz') {
      const topic = body.topic || 'Java Programming';
      const level = body.level || 'intermediate';
      const count = Math.min(Math.max(parseInt(body.count || 3, 10), 1), 5);
      const seed = Math.floor(Math.random() * 1000000);

      const prompt = `You are an expert Java educator and technical author referencing "Core Java" by Cay Horstmann and "Effective Java" by Joshua Bloch.
Generate exactly ${count} completely distinct, challenging, highly educational quiz questions for a Java learner studying: "${topic}" (${level} level).
Random seed variation: ${seed}.
Focus on real Java runtime behavior, memory implications, subtle syntax rules, and practical production code.

Each question MUST be one of these types:
- "mcq" (Multiple choice concept question with 4 options)
- "output" (Predict output of a realistic Java snippet with 4 options)
- "bug" (Find the bug in a snippet with 4 options explaining the root cause)

STRICT FORMAT: Return ONLY a raw JSON array of objects. No markdown, no triple backticks (\`\`\`json).
Format:
[
  {
    "type": "mcq",
    "question": "Clear, precise question?",
    "code": "Optional Java code snippet (use \\n for line breaks) or empty string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Clear explanation referencing JVM/Java language specification rules."
  }
]`;

      const geminiPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      };

      const result = await callGeminiAPI(apiKey, 'gemini-flash-lite-latest', geminiPayload);
      let rawText = '';
      try {
        rawText = result.candidates[0].content.parts[0].text;
      } catch(e) {
        throw new Error('Gemini returned an empty candidate');
      }

      // Clean markdown code blocks if present
      rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      let questions;
      try {
        questions = JSON.parse(rawText);
      } catch(e) {
        // If wrapped or partial, extract JSON array
        const match = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (match) {
          questions = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse questions JSON from AI');
        }
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('AI generated an empty questions list');
      }

      // Sanitize question items
      questions = questions.map((q, idx) => ({
        type: q.type || 'mcq',
        question: q.question || `Question ${idx + 1}`,
        code: q.code || '',
        options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['A', 'B', 'C', 'D'],
        answer: typeof q.answer === 'number' && q.answer >= 0 && q.answer < (q.options ? q.options.length : 4) ? q.answer : 0,
        explanation: q.explanation || 'Refer to the Java Language Specification.'
      }));

      res.status(200).json({ success: true, questions });
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. AI DEEP DIVE ("Under the Hood" JVM Architecture)
    // ─────────────────────────────────────────────────────────────────
    if (action === 'deep-dive') {
      const topic = body.topic || 'Java Internals';
      const lessonTitle = body.lessonTitle || '';
      const slideTitle = body.slideTitle || '';
      const slideContent = body.slideContent || '';

      const prompt = `You are a principal Java architect and JVM engineer writing a technical "Under the Hood" guide for a student studying:
Module: "${topic}"
Lesson: "${lessonTitle}"
Current Slide: "${slideTitle}"
Context: "${slideContent.slice(0, 350)}"

Provide an authoritative, in-depth technical deep dive (350-500 words) formatted in clean Markdown with:
1. ### ⚙️ JVM Internals & Memory Layout
   - How this exact concept is represented in the JVM (Stack frame, Heap layout, Metaspace, or Bytecode instructions like \`invokevirtual\` vs \`invokestatic\`).
2. ### 🚀 HotSpot JIT & Compiler Optimizations
   - How the HotSpot C1/C2 compiler optimizes this (e.g. escape analysis, inlining, monomorphic call site devirtualization).
3. ### ⚠️ Production Gotchas & Effective Java Rule
   - Specific pitfall or gotcha that senior developers avoid, referencing best practices from Joshua Bloch's "Effective Java".
4. ### 💻 Bytecode or Low-Level Snippet
   - A short, illustrative code snippet or bytecode breakdown.

Keep tone high-energy, authoritative, crystal clear, and educational.`;

      const geminiPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1200
        }
      };

      const result = await callGeminiAPI(apiKey, 'gemini-flash-lite-latest', geminiPayload);
      const text = result.candidates[0].content.parts[0].text;
      res.status(200).json({ success: true, markdown: text });
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. AI MISTAKE DIAGNOSTIC EXPLAINER
    // ─────────────────────────────────────────────────────────────────
    if (action === 'explain-mistake') {
      const question = body.question || '';
      const code = body.code || '';
      const correctAns = body.correctAns || '';
      const chosenAns = body.chosenAns || '';

      const prompt = `A Java learner answered a quiz question incorrectly:
Question: "${question}"
${code ? `Code:\n\`\`\`java\n${code}\n\`\`\`\n` : ''}
Correct Answer: "${correctAns}"
Learner's Incorrect Choice: "${chosenAns}"

Provide a 2-3 sentence diagnostic:
1. Why this is an intuitive, common misconception in Java.
2. The exact technical reason why "${correctAns}" is correct according to the Java runtime/language rules.
3. A memorable rule-of-thumb or mnemonic (max 60 words total).`;

      const geminiPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200
        }
      };

      const result = await callGeminiAPI(apiKey, 'gemini-flash-lite-latest', geminiPayload);
      const text = result.candidates[0].content.parts[0].text;
      res.status(200).json({ success: true, explanation: text });
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. AI TUTOR INTERACTIVE CHAT
    // ─────────────────────────────────────────────────────────────────
    if (action === 'chat') {
      const messages = body.messages || [];
      const userMessage = body.message || 'Help me understand Java.';

      // Transform history
      const formattedContents = [
        {
          role: 'user',
          parts: [{
            text: `You are JavaBot, the expert interactive AI Tutor inside JavaQuest.
You are grounded in authoritative Java textbooks ("Core Java" by Cay Horstmann, "Effective Java" by Joshua Bloch, and "Java Concurrency in Practice" by Brian Goetz).
Your mission:
- Provide clear, friendly, technically rigorous Java guidance.
- Explain "why" things work under the hood (JVM, memory model, bytecode, heap/stack).
- Format code snippets cleanly in Java.
- Keep responses concise, structured, and encouraging.`
          }]
        },
        {
          role: 'model',
          parts: [{ text: "Hello! I am JavaBot, your JavaQuest mentor. What Java concept, code snippet, or JVM internal can I help you master today?" }]
        }
      ];

      // Add conversation turns if supplied
      if (Array.isArray(messages)) {
        messages.forEach(m => {
          if (m && m.role && m.text) {
            formattedContents.push({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: String(m.text) }]
            });
          }
        });
      }

      formattedContents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const geminiPayload = {
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 900
        }
      };

      const result = await callGeminiAPI(apiKey, 'gemini-flash-lite-latest', geminiPayload);
      const text = result.candidates[0].content.parts[0].text;
      res.status(200).json({ success: true, reply: text });
      return;
    }

    res.status(400).json({ error: `Unknown action: "${action}"` });

  } catch(err) {
    console.error('API Error in /api/ai:', err);
    res.status(500).json({
      error: err.message || 'An unexpected error occurred while communicating with AI.'
    });
  }
};
