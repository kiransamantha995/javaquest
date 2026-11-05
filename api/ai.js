// JavaQuest Serverless AI Engine — api/ai.js
// Runs on Vercel Node.js Serverless Runtime
// Securely proxies requests to Gemini using process.env.GEMINI_API_KEY
// Zero client-side API key leakage; handles Quiz Generation, Deep Dives, Mistake Diagnostics & Chat
// Features multi-model fallback (gemini-flash-lite-latest -> gemini-3.5-flash-lite -> gemini-flash-latest -> gemini-2.5-flash)

const https = require('https');

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
  'gemini-flash-latest'
];

function getApiKey(reqBody) {
  return process.env.GEMINI_API_KEY || (reqBody && reqBody.apiKey) || '';
}

async function callGeminiSingle(apiKey, model, payload) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(28000)
  });

  const bodyText = await response.text();
  let json;
  try {
    json = JSON.parse(bodyText);
  } catch(e) {
    throw new Error(`Invalid JSON from Gemini: ${bodyText.slice(0, 100)}`);
  }

  if (!response.ok) {
    const errMessage = (json.error && json.error.message) || `Gemini API error ${response.status}`;
    throw new Error(errMessage);
  }

  return json;
}

async function callGeminiWithFallback(apiKey, payload) {
  let lastErr = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const res = await callGeminiSingle(apiKey, model, payload);
      return res;
    } catch(err) {
      lastErr = err;
      console.warn(`[AI Proxy] Model ${model} failed (${err.message}). Trying fallback...`);
      continue;
    }
  }
  throw lastErr || new Error('All AI models are currently busy. Please retry in a few seconds.');
}

function extractCandidateText(result) {
  const parts = (result && result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) || [];
  let txt = '';
  for (const p of parts) {
    if (p.text && !p.thought) txt += p.text;
  }
  if (!txt && parts.length > 0) txt = parts[0].text || '';
  return txt;
}

module.exports = async function handler(req, res) {
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

      const prompt = `You are a principal Java educator and author of "Core Java" and "Effective Java".
Generate exactly ${count} completely fresh, unique, challenging quiz questions for a Java learner studying: "${topic}" (${level} level).
Seed: ${seed}.
Focus on runtime behavior, memory layout, subtle language specification rules, and production pitfalls.

Each question MUST be one of:
- "mcq" (Multiple choice with 4 distinct options)
- "output" (Predict output of a realistic Java snippet with 4 options)
- "bug" (Spot the subtle bug with 4 explanation options)

STRICT FORMAT: Return ONLY a raw JSON array of objects. No markdown formatting, no code fences.
[
  {
    "type": "mcq",
    "question": "Question text?",
    "code": "Optional snippet or empty string",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
    "explanation": "Clear explanation referencing JVM/JLS rules."
  }
]`;

      const geminiPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      };

      const result = await callGeminiWithFallback(apiKey, geminiPayload);
      let rawText = extractCandidateText(result);
      rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      let questions;
      try {
        questions = JSON.parse(rawText);
      } catch(e) {
        const match = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (match) {
          questions = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse questions JSON from AI: ' + rawText.slice(0, 150));
        }
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('AI generated an empty questions list');
      }

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

      const prompt = `You are a Principal JVM Engineer and Java Systems Architect writing a technical "Under the Hood" guide for a student studying:
Module: "${topic}"
Lesson: "${lessonTitle}"
Current Slide: "${slideTitle}"
Context: "${slideContent.slice(0, 350)}"

Provide an authoritative, in-depth technical deep dive (350-500 words) formatted in clean Markdown with:
1. ### ⚙️ JVM Internals & Memory Layout
   - How this exact concept is represented in the JVM (Stack frame, Heap layout, Metaspace, or Bytecode instructions).
2. ### 🚀 HotSpot JIT & Compiler Optimizations
   - How HotSpot optimizes this (escape analysis, monomorphic call site inlining, etc.).
3. ### ⚠️ Production Gotchas & Effective Java Rule
   - Specific pitfall or gotcha referencing Joshua Bloch's "Effective Java".
4. ### 💻 Bytecode or Low-Level Snippet
   - A short, illustrative code snippet or bytecode breakdown.`;

      const geminiPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1200
        }
      };

      const result = await callGeminiWithFallback(apiKey, geminiPayload);
      const text = extractCandidateText(result);
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

      const result = await callGeminiWithFallback(apiKey, geminiPayload);
      const text = extractCandidateText(result);
      res.status(200).json({ success: true, explanation: text });
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. AI TUTOR INTERACTIVE CHAT
    // ─────────────────────────────────────────────────────────────────
    if (action === 'chat') {
      const messages = body.messages || [];
      const userMessage = body.message || 'Help me understand Java.';

      const formattedContents = [
        {
          role: 'user',
          parts: [{
            text: `You are JavaBot, the expert interactive AI Tutor inside JavaQuest.
You are grounded in authoritative Java textbooks ("Core Java" by Cay Horstmann, "Effective Java" by Joshua Bloch, and "Java Concurrency in Practice" by Brian Goetz).
Provide clear, friendly, technically rigorous Java guidance. Format code snippets cleanly in Java. Keep responses under 80 words.`
          }]
        },
        {
          role: 'model',
          parts: [{ text: "Hello! I am JavaBot, your JavaQuest mentor. What Java concept or code snippet can I help you master today?" }]
        }
      ];

      // Copy history excluding the latest turn if it already matches userMessage
      const history = Array.isArray(messages) ? messages.slice() : [];
      if (history.length > 0 && history[history.length - 1].role === 'user') {
        history.pop();
      }

      history.forEach(m => {
        if (m && m.role && m.text) {
          const role = (m.role === 'model' || m.role === 'assistant') ? 'model' : 'user';
          const lastTurn = formattedContents[formattedContents.length - 1];
          if (lastTurn && lastTurn.role === role) {
            lastTurn.parts[0].text += '\n' + String(m.text);
          } else {
            formattedContents.push({
              role: role,
              parts: [{ text: String(m.text) }]
            });
          }
        }
      });

      // Append user's current message, ensuring strictly alternating turn
      const lastTurn = formattedContents[formattedContents.length - 1];
      if (lastTurn && lastTurn.role === 'user') {
        lastTurn.parts[0].text += '\n' + String(userMessage);
      } else {
        formattedContents.push({
          role: 'user',
          parts: [{ text: String(userMessage) }]
        });
      }

      const geminiPayload = {
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 900
        }
      };

      const result = await callGeminiWithFallback(apiKey, geminiPayload);
      const text = extractCandidateText(result);
      res.status(200).json({ success: true, reply: text });
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. AUTOMATED AI PROJECT CODE EVALUATOR
    // ─────────────────────────────────────────────────────────────────
    if (action === 'eval-project') {
      const projectTitle = body.projectTitle || 'Capstone Project';
      const requirements = Array.isArray(body.requirements) ? body.requirements : [];
      const code = body.code || '';

      if (!code.trim()) {
        res.status(400).json({ error: 'Please write code in the editor before verifying.' });
        return;
      }

      const prompt = `You are an automated grading engine for Java Capstone Projects in JavaQuest.
Project: "${projectTitle}"

Requirements to Verify:
${requirements.map((r, i) => `[Task ${i}]: ${r}`).join('\n')}

Student Code in Editor:
\`\`\`java
${code.slice(0, 4500)}
\`\`\`

Strict Grading Rules:
1. Carefully inspect the student's code to check if each requirement is genuinely implemented.
2. If a requirement is only partially done, contains placeholder comments without logic, or is completely missing, mark passed: false.
3. If properly implemented, mark passed: true with a short positive confirmation.
4. Output strict JSON array of objects:
[
  {
    "index": 0,
    "passed": true,
    "reason": "1 short sentence explaining status."
  }
]`;

      const geminiPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 1200
        }
      };

      const result = await callGeminiWithFallback(apiKey, geminiPayload);
      let rawText = extractCandidateText(result).trim();
      rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      let evaluations;
      try {
        evaluations = JSON.parse(rawText);
      } catch(e) {
        const match = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (match) evaluations = JSON.parse(match[0]);
        else throw new Error('Could not parse evaluations JSON from AI');
      }

      res.status(200).json({ success: true, evaluations });
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // 6. DYNAMIC CODING CHALLENGE GENERATOR
    // ─────────────────────────────────────────────────────────────────
    if (action === 'generate-coding-task') {
      const topic = body.topic || 'Java Programming';
      const level = body.level || 'intermediate';
      const seed = Math.floor(Math.random() * 1000000);

      const prompt = `You are a principal Java educator creating a fresh, dynamic Java coding task for a student studying:
Topic: "${topic}" (${level} level).
Seed: ${seed}.

Requirements:
1. Provide a clear, practical problem statement in Markdown.
2. DO NOT include the solved logic in the starterCode! Provide only a clean class skeleton with method signatures and "// TODO: Write your solution here" comments.
3. Define exact expected output.
4. Provide 2 unit test cases.
5. Provide 2 helpful hints.

STRICT JSON OUTPUT FORMAT:
{
  "title": "Short descriptive title",
  "prompt": "Clear task description with input/output rules in Markdown",
  "starterCode": "public class Main {\\n    public static void main(String[] args) {\\n        // TODO: implement your logic here\\n    }\\n}",
  "expectedOutput": "Exact expected terminal output",
  "testCases": [
    { "name": "Primary case", "expected": "Exact string" },
    { "name": "Edge case", "expected": "Exact string" }
  ],
  "hints": ["First actionable hint", "Second actionable hint"]
}`;

      const geminiPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.75,
          maxOutputTokens: 1600
        }
      };

      const result = await callGeminiWithFallback(apiKey, geminiPayload);
      let rawText = extractCandidateText(result).trim();
      rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      let task;
      try {
        task = JSON.parse(rawText);
      } catch(e) {
        const match = rawText.match(/\{\s*"title"[\s\S]*\}/);
        if (match) task = JSON.parse(match[0]);
        else throw new Error('Could not parse task JSON from AI');
      }

      res.status(200).json({ success: true, task });
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
