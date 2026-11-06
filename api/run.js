// JavaQuest Serverless Java Compiler & Execution Engine — api/run.js
// Runs on Vercel Serverless Function
// High-performance OpenJDK 22 compilation with intelligent fallback

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
  'gemini-flash-latest'
];

function sanitizeJavaCode(code) {
  // 1. Auto-repair common copy-paste typo: "port java..." -> "import java..."
  let prepared = code.replace(/^[ \t]*port[ \t]+/gm, 'import ');

  // 2. In OpenJDK single-file execution, top-level classes cannot conflict with the runner filename.
  // Stripping 'public' from class/interface/record/enum declarations makes them
  // package-private so multi-class, records, and OOP programs compile cleanly without restriction.
  prepared = prepared.replace(/\bpublic\s+(class|interface|record|enum)\b/g, '$1');

  return prepared;
}

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
    signal: AbortSignal.timeout(25000)
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
      compile: {
        code: statusCode,
        stderr: compilerErr
      },
      run: {
        stdout: '',
        stderr: compilerErr,
        code: statusCode
      }
    };
  }

  // Live Interactive Scanner Detection:
  // When programErr contains NoSuchElementException, the Java code reached a Scanner input statement
  // and is waiting for the user to provide standard input in the console!
  if (statusCode !== 0 && (programErr.includes('NoSuchElementException') || programErr.includes('No line found') || programErr.includes('NoSuchElement'))) {
    return {
      compile: null,
      run: {
        stdout: programOut,
        stderr: '',
        code: 0,
        waitingForInput: true
      }
    };
  }

  return {
    compile: null,
    run: {
      stdout: programOut,
      stderr: programErr,
      code: statusCode,
      waitingForInput: false
    }
  };
}

async function runWithGemini(code, stdin, apiKey) {
  const prepared = sanitizeJavaCode(code);
  const prompt = `Act as an official OpenJDK 22 Java compiler and JVM runtime.
Execute the following Java code strictly according to standard Java language specifications.
${stdin ? `Standard Input (stdin):\n${stdin}\n` : ''}

Java Code:
\`\`\`java
${prepared}
\`\`\`

Interactive Scanner Rules:
If the Java code reads from System.in (via Scanner, BufferedReader, System.console, etc.) and the provided Standard Input (stdin) is empty or does NOT have enough lines for the next input statement:
1. STOP program execution at that exact point where input is expected.
2. Return only the stdout printed up to that exact prompt.
3. Set waitingForInput to true!
4. Do NOT fake or simulate future user inputs. Do NOT run the rest of the program.

Evaluate compilation and execution. Return ONLY a single raw JSON object matching this schema with NO markdown ticks or extra prose:
{
  "compile": {
    "code": 0,
    "stderr": ""
  },
  "run": {
    "stdout": "exact standard output printed up to this moment",
    "stderr": "runtime exceptions or empty string",
    "code": 0,
    "waitingForInput": false
  }
}
If there are genuine compilation errors (syntax error, type mismatch, missing semicolon, undeclared identifier, etc.), set compile.code to 1, compile.stderr to the realistic javac error message, run.stdout to "", and waitingForInput to false.`;

  let lastErr = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.0,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from model');

      const clean = text.replace(/```(?:json)?/g, '').trim();
      const parsed = JSON.parse(clean);
      if (parsed.run && parsed.waitingForInput !== undefined && parsed.run.waitingForInput === undefined) {
        parsed.run.waitingForInput = !!parsed.waitingForInput;
      }
      return parsed;
    } catch(e) {
      lastErr = e;
      continue;
    }
  }

  throw lastErr || new Error('AI Compiler fallback unavailable');
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

    const code = (body.code || '').trim();
    const stdin = body.stdin || '';

    if (!code) {
      res.status(400).json({ error: 'No Java code provided to compile.' });
      return;
    }

    // 1. Primary: Real OpenJDK 22 Cloud Engine (Wandbox)
    try {
      const result = await runWandbox(code, stdin);
      res.status(200).json(result);
      return;
    } catch(wandboxErr) {
      console.warn('[Compiler] OpenJDK Wandbox failed:', wandboxErr.message, 'Falling back to AI engine...');
    }

    // 2. Secondary: Cloud AI OpenJDK 22 Simulator (Gemini with process.env.GEMINI_API_KEY)
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const aiResult = await runWithGemini(code, stdin, apiKey);
        res.status(200).json(aiResult);
        return;
      } catch(aiErr) {
        console.warn('[Compiler] AI Engine fallback failed:', aiErr.message);
      }
    }

    res.status(503).json({
      error: 'Compiler service temporarily unavailable. Please retry in a moment.'
    });

  } catch(err) {
    console.error('Compiler handler error:', err);
    res.status(500).json({ error: err.message || 'Server error during Java execution' });
  }
};
