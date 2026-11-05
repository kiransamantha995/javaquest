// JavaQuest — ai-tutor.js
// Ultra-low token Gemini Flash-Lite AI Tutor for JavaQuest
// API keys are read securely from localStorage or config.js (never committed to git)

function getGeminiKey() {
  if (typeof window !== 'undefined') {
    // 1. User entered key from Settings (⚙️) or Chat prompt (saved in localStorage)
    var stored = localStorage.getItem('javaquest_gemini_key');
    if (stored && stored.trim()) return stored.trim();

    // 2. Runtime configuration from config.js (if present)
    if (window.CONFIG && window.CONFIG.GEMINI_API_KEY && window.CONFIG.GEMINI_API_KEY.trim()) {
      return window.CONFIG.GEMINI_API_KEY.trim();
    }
  }
  return '';
}

// Low-token Flash-Lite models with automatic fallback
var PRIMARY_MODEL = 'gemini-flash-lite-latest';
var FALLBACK_MODEL = 'gemini-3.5-flash-lite';

var AI_SYSTEM = 'You are JavaBot, an ultra-concise Java tutor inside JavaQuest. '
  + 'Greet warmly if greeted. Answer ONLY Java, object-oriented programming, and computer science questions in 2-3 short, clear sentences. '
  + 'Include 1 tiny code snippet only when helpful. '
  + 'Keep responses under 70 words to minimize token consumption. '
  + 'If asked about non-programming topics, politely reply: "I only teach Java! Ask me any Java question ☕"';

var chatHistory = [];

function getCurrentUserCodeContext() {
  var code = '';
  var contextTitle = '';

  var compilerScreen = document.getElementById('screen-compiler');
  var codingScreen = document.getElementById('screen-coding');

  if (compilerScreen && compilerScreen.classList.contains('active')) {
    var ed = document.getElementById('code-editor');
    if (ed && ed.value && ed.value.trim()) {
      code = ed.value.trim();
      var banner = document.getElementById('capstone-banner-title');
      var bannerEl = document.getElementById('capstone-editor-banner');
      contextTitle = (banner && bannerEl && !bannerEl.classList.contains('hidden'))
        ? 'Capstone: ' + banner.textContent.trim()
        : 'Java Playground';
    }
  } else if (codingScreen && codingScreen.classList.contains('active')) {
    var cdEd = document.getElementById('coding-editor');
    if (cdEd && cdEd.value && cdEd.value.trim()) {
      code = cdEd.value.trim();
      var titleEl = document.getElementById('coding-task-title');
      contextTitle = 'Coding Challenge' + (titleEl ? ': ' + titleEl.textContent.trim() : '');
    }
  } else {
    var ed2 = document.getElementById('code-editor');
    if (ed2 && ed2.value && ed2.value.trim()) {
      code = ed2.value.trim();
      contextTitle = 'Playground Code';
    } else {
      var cdEd2 = document.getElementById('coding-editor');
      if (cdEd2 && cdEd2.value && cdEd2.value.trim()) {
        code = cdEd2.value.trim();
        contextTitle = 'Challenge Code';
      }
    }
  }

  var recentErr = '';
  var outEl = document.getElementById('output-area');
  if (outEl && outEl.textContent && !outEl.textContent.includes('Click ▶ Run Code')) {
    var t = outEl.textContent.trim();
    if (t) recentErr = t.substring(0, 350);
  }

  if (code) {
    var snippet = code.length > 1400 ? code.substring(0, 1400) + '\n// ... [remaining code omitted]' : code;
    return {
      title: contextTitle || 'Code Editor',
      code: snippet,
      error: recentErr
    };
  }
  return null;
}

function updateChatContextPill() {
  var pill = document.getElementById('chat-context-pill');
  var label = document.getElementById('chat-context-label');
  if (!pill || !label) return;
  var ctx = getCurrentUserCodeContext();
  if (ctx && ctx.code) {
    pill.classList.remove('hidden');
    label.textContent = 'Watching ' + ctx.title;
  } else {
    pill.classList.add('hidden');
  }
}

function toggleChat() {
  var panel = document.getElementById('chat-panel');
  if (!panel) return;
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    updateChatContextPill();
    var inp = document.getElementById('chat-input');
    if (inp) inp.focus();
    scrollChatToBottom();
  } else {
    panel.classList.add('hidden');
  }
}

function sendPromptToChat(promptText) {
  var panel = document.getElementById('chat-panel');
  if (panel && panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    updateChatContextPill();
  }
  var input = document.getElementById('chat-input');
  if (input) {
    input.value = promptText;
  }
  scrollChatToBottom();
  sendChatMessage();
}

function clearChatHistory() {
  chatHistory = [];
  var container = document.getElementById('chat-messages');
  if (container) {
    container.innerHTML = '<div class="chat-message bot"><div class="message-bubble">Hi! I\'m JavaBot 🤖 Ask me anything about Java or your code! (History cleared to save tokens ⚡)</div></div>';
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

function callGemini(modelName, apiKey, payload) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + apiKey;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); });
}

function sendChatMessage() {
  var input = document.getElementById('chat-input');
  if (!input) return;
  var msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendChatMsg('user', msg);

  var apiKey = getGeminiKey();
  if (!apiKey) {
    appendChatMsg('bot', '🔑 **Gemini API Key Required**\n\nTo chat with JavaBot, enter your free Gemini API key below (or set it in Settings ⚙️):');
    renderChatKeyPrompt();
    return;
  }

  // Update context pill
  updateChatContextPill();

  // Add to history and prune to max 4 items (2 user questions + 2 bot replies)
  chatHistory.push({ role: 'user', parts: [{ text: msg }] });
  if (chatHistory.length > 4) {
    chatHistory = chatHistory.slice(-4);
  }

  var typing = document.getElementById('chat-typing');
  if (typing) typing.classList.remove('hidden');
  scrollChatToBottom();

  var codeCtx = getCurrentUserCodeContext();
  var dynamicSystem = AI_SYSTEM;
  if (codeCtx && codeCtx.code) {
    dynamicSystem += '\n\n[USER CURRENT WORKSPACE]\nActive Screen/Project: ' + codeCtx.title
      + '\nUser\'s Exact Code in Editor:\n```java\n' + codeCtx.code + '\n```';
    if (codeCtx.error) {
      dynamicSystem += '\nRecent Compiler Output / Error:\n' + codeCtx.error;
    }
    dynamicSystem += '\n\nIMPORTANT: You have direct visibility into the user\'s editor code above. When they ask questions, reference their specific code, variables, and logic. If they ask for a code review or error explanation, point out issues clearly with small code tips under 70 words.';
  }

  var payload = {
    system_instruction: { parts: [{ text: dynamicSystem }] },
    contents: chatHistory,
    generationConfig: { maxOutputTokens: 200, temperature: 0.3 }
  };

  // Try primary model (gemini-3.5-flash-lite), fallback to gemini-flash-lite-latest
  callGemini('gemini-3.5-flash-lite', apiKey, payload)
    .then(function(data){
      if (data.error && (data.error.code === 404 || data.error.code === 503)) {
        return callGemini('gemini-flash-lite-latest', apiKey, payload);
      }
      return data;
    })
    .then(function(data){
      if (typing) typing.classList.add('hidden');
      if (data.error) {
        var errCode = data.error.code;
        var errMsg = data.error.message || 'API error';
        if (errCode === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('exhausted')) {
          appendChatMsg('bot', '⚠️ Free tier rate limit reached. Please wait 30 seconds before asking again! ☕');
        } else {
          appendChatMsg('bot', '⚠️ ' + errMsg);
        }
        return;
      }

      var text = '';
      try {
        text = data.candidates[0].content.parts[0].text;
      } catch(e) {
        text = 'Welcome! I specialize in Java programming. What Java concept can I help explain? ☕';
      }

      chatHistory.push({ role: 'model', parts: [{ text: text }] });
      appendChatMsg('bot', text);
    })
    .catch(function(err){
      if (typing) typing.classList.add('hidden');
      appendChatMsg('bot', '⚠️ Network error: ' + err.message + '. Please check your connection or API key ☕');
    });
}

function appendChatMsg(role, text) {
  var container = document.getElementById('chat-messages');
  if (!container) return;
  var div = document.createElement('div');
  div.className = 'chat-message ' + role;
  var bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  var html = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```(?:java)?\n?([\s\S]*?)```/g, function (_, code) {
      var raw = code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      return '<pre>' + (typeof highlightSyntax === 'function' ? highlightSyntax(raw.trim()) : raw.trim()) + '</pre>';
    })
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#43D8C9">$1</a>')
    .replace(/\n/g, '<br>');
  bubble.innerHTML = html;
  div.appendChild(bubble);
  container.appendChild(div);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  var c = document.getElementById('chat-messages');
  if (c) setTimeout(function () { c.scrollTop = c.scrollHeight; }, 60);
}

function updateChatContext(name) {
  var el = document.getElementById('chat-bot-status');
  if (el) el.textContent = name ? 'Studying: ' + name : 'Your AI Java Tutor';
}

function renderChatKeyPrompt() {
  var container = document.getElementById('chat-messages');
  if (!container || document.getElementById('chat-key-prompt-row')) return;
  var wrap = document.createElement('div');
  wrap.id = 'chat-key-prompt-row';
  wrap.style.cssText = 'background:#FFFFFF;border:2px solid var(--ink);border-radius:12px;padding:0.75rem;box-shadow:2px 2px 0px var(--ink);margin:0.5rem 0;';
  wrap.innerHTML = '<div style="font-size:0.8rem;font-weight:700;color:var(--ink);margin-bottom:0.4rem">Paste Gemini API Key:</div>'
    + '<div style="display:flex;gap:6px">'
    + '<input type="password" id="chat-key-input" class="login-input" style="flex:1;padding:0.45rem 0.65rem;font-size:0.85rem;" placeholder="AIzaSy..." autocomplete="off"/>'
    + '<button class="btn-primary btn-xs" id="chat-save-key-btn">Save</button>'
    + '</div>'
    + '<div style="font-size:0.72rem;color:var(--text-secondary);margin-top:0.35rem">Free from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style="color:var(--ink);font-weight:800">Google AI Studio</a>. Saved in localStorage.</div>';
  container.appendChild(wrap);
  scrollChatToBottom();

  var saveBtn = document.getElementById('chat-save-key-btn');
  if (saveBtn) {
    saveBtn.onclick = function() {
      var inp = document.getElementById('chat-key-input');
      var val = (inp && inp.value) ? inp.value.trim() : '';
      if (!val) return;
      localStorage.setItem('javaquest_gemini_key', val);
      wrap.remove();
      appendChatMsg('bot', 'Awesome! 🎉 Your Gemini API key is saved. Ask me anything about Java or your code!');
    };
  }
}

// ═════════════════════════════════════════════════════════════════════
//  AI DYNAMIC QUIZ GENERATOR ("INFINITE PRACTICE")
// ═════════════════════════════════════════════════════════════════════
function generateAIQuiz(modId) {
  var mod = typeof getMod === 'function' ? getMod(modId) : null;
  if (!mod) {
    if (typeof toast === 'function') toast('Module not found!');
    return;
  }

  var apiKey = getGeminiKey();
  if (!apiKey) {
    if (typeof toast === 'function') toast('🔑 Gemini API Key required in Settings (⚙️) for AI Practice!');
    if (typeof showScreen === 'function') showScreen('settings');
    return;
  }

  if (typeof toast === 'function') toast('✨ Generating fresh AI questions for ' + mod.title + '…');

  var prompt = 'You are a principal Java educator. Generate exactly 3 fresh, challenging, high-quality quiz questions for a Java learner studying the module: "'
    + mod.title + ' - ' + (mod.subtitle || '') + '" at ' + (mod.level || 'beginner') + ' difficulty.\n'
    + 'Question types MUST be one of: "mcq" (Multiple choice with 4 distinct options) or "output" (Predict output of a realistic Java code snippet with 4 options).\n'
    + 'STRICT JSON OUTPUT FORMAT ONLY: Return a raw JSON array of objects with these exact keys:\n'
    + '[\n'
    + '  {\n'
    + '    "type": "mcq",\n'
    + '    "question": "Clear, precise question text?",\n'
    + '    "code": "Optional Java code snippet (use \\n for linebreaks) or empty string",\n'
    + '    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],\n'
    + '    "answer": 0,\n'
    + '    "explanation": "Clear 1-2 sentence explanation of why the answer is correct."\n'
    + '  }\n'
    + ']\n'
    + 'Do not include any text outside the JSON. Do not wrap in markdown fences.';

  var payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1400
    }
  };

  callGemini('gemini-flash-lite-latest', apiKey, payload)
    .then(function(res) {
      var raw = '';
      try {
        raw = res.candidates[0].content.parts[0].text;
      } catch(e) {
        throw new Error('No content returned from AI');
      }

      // Strip markdown code fences if present
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      var questions = JSON.parse(raw);
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('AI returned an empty question list');
      }

      questions.forEach(function(q, idx) {
        if (!q.type) q.type = 'mcq';
        if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= (q.options ? q.options.length : 4)) q.answer = 0;
        if (!Array.isArray(q.options) || q.options.length < 2) {
          q.options = ['Option A', 'Option B', 'Option C', 'Option D'];
        }
      });

      _cm = {
        id: mod.id,
        title: mod.title + ' [AI Practice]',
        lessons: mod.lessons || [],
        challenge: {
          id: 'ai_' + mod.id + '_' + Date.now(),
          xp: 25,
          questions: questions
        }
      };
      _qs = questions.slice();
      _qi = 0;
      _hits = 0;

      if (typeof renderHearts === 'function') renderHearts();
      if (typeof renderQuestion === 'function') renderQuestion();
      if (typeof showScreen === 'function') showScreen('challenge');
      if (typeof toast === 'function') toast('🎯 AI Practice Quiz Ready! (+25 XP)');
    })
    .catch(function(err) {
      console.warn('AI Quiz generation fallback:', err);
      if (typeof toast === 'function') toast('⚠️ AI Generation failed. Loading standard module quiz.');
      if (typeof startChallenge === 'function') startChallenge(modId);
    });
}

function startAIChallengeFromModal() {
  if (typeof hideModal === 'function') hideModal('modal-challenge-result');
  var modId = (_cm && _cm.id) ? _cm.id.replace('module-', '') : 'b1';
  generateAIQuiz(modId);
}

// ═════════════════════════════════════════════════════════════════════
//  AI LESSON DEEP DIVE ("UNDER THE HOOD")
// ═════════════════════════════════════════════════════════════════════
function openDeepDive() {
  if (typeof _curLesson === 'undefined' || !_curLesson || !_curLesson.slides || !_curLesson.slides[_slideIdx]) {
    if (typeof toast === 'function') toast('No active slide to analyze!');
    return;
  }
  var slide = _curLesson.slides[_slideIdx];
  var mod = (typeof _curMod !== 'undefined' && _curMod) ? _curMod : { title: 'Java' };

  var modal = document.getElementById('modal-deep-dive');
  var titleEl = document.getElementById('deep-dive-title');
  var subEl = document.getElementById('deep-dive-subtitle');
  var contentEl = document.getElementById('deep-dive-content');
  if (!modal || !titleEl || !contentEl) return;

  titleEl.textContent = slide.title;
  if (subEl) subEl.textContent = 'Module: ' + mod.title + ' • Deep technical breakdown';
  modal.classList.remove('hidden');

  var apiKey = getGeminiKey();
  if (!apiKey) {
    contentEl.innerHTML = '<div style="text-align:center;padding:1.75rem 1rem;">'
      + '<div style="font-size:2.8rem;margin-bottom:0.6rem">🔑</div>'
      + '<h3 style="font-size:1.25rem;font-weight:800;color:var(--ink);margin-bottom:0.5rem">Gemini API Key Required</h3>'
      + '<p style="color:var(--text-secondary);font-size:0.92rem;max-width:440px;margin:0 auto 1.25rem;">Deep Dives break down JVM memory allocation, bytecode execution, and production gotchas on-demand using Gemini Flash-Lite.</p>'
      + '<div style="display:flex;gap:8px;max-width:380px;margin:0 auto;">'
      + '<input type="password" id="deep-dive-key-inp" class="login-input" placeholder="Paste AIzaSy... key" style="flex:1;padding:0.6rem 0.85rem;" />'
      + '<button class="btn-primary" onclick="saveKeyFromDeepDive()">Save Key</button>'
      + '</div>'
      + '<div style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.75rem">Get your free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style="color:var(--ink);font-weight:800">Google AI Studio</a>.</div>'
      + '</div>';
    return;
  }

  contentEl.innerHTML = '<div style="text-align:center;padding:3rem 1rem;">'
    + '<span class="run-spinner" style="width:28px;height:28px;margin-bottom:1.2rem;display:inline-block;"></span>'
    + '<div style="font-size:1.1rem;font-weight:800;color:var(--ink);">Analyzing JVM Internals & Memory Architecture…</div>'
    + '<div style="font-size:0.86rem;color:var(--text-secondary);margin-top:0.35rem;">Synthesizing HotSpot execution, bytecode behavior & production gotchas</div>'
    + '</div>';

  var prompt = 'You are a Principal JVM Engineer and Java Systems Architect.\n'
    + 'Provide a rigorous, deep-dive technical breakdown for a learner studying this Java topic:\n'
    + 'Topic: "' + slide.title + '" (Module: ' + mod.title + ')\n'
    + 'Lesson Content: "' + slide.content + '"\n\n'
    + 'Structure your response into these 3 distinct sections using markdown:\n'
    + '### ⚙️ 1. Under The Hood (JVM & Memory Model)\n'
    + 'Explain what happens at runtime: HotSpot, bytecode, stack frames vs heap, JIT compiler, or thread execution.\n\n'
    + '### ⚠️ 2. Production Gotchas & Pitfalls\n'
    + 'Explain 1-2 real-world bugs, performance bottlenecks, or concurrency edge cases senior engineers avoid.\n\n'
    + '### 💡 3. The Senior Dev Mental Model\n'
    + 'Give 1 high-signal rule of thumb or architectural intuition for writing clean, resilient code.\n\n'
    + 'Include short, focused Java code snippets if helpful. Keep the entire response under 280 words, punchy, and highly informative.';

  var payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 650
    }
  };

  callGemini('gemini-flash-lite-latest', apiKey, payload)
    .then(function(res) {
      var text = '';
      try {
        text = res.candidates[0].content.parts[0].text;
      } catch(e) {
        text = 'Deep dive unavailable at this moment. Please try again!';
      }
      contentEl.innerHTML = '<div class="deep-dive-body">' + formatDeepDiveMarkdown(text) + '</div>';
    })
    .catch(function(err) {
      contentEl.innerHTML = '<div style="color:#991B1B;padding:1.25rem;background:#FEE2E2;border:2px solid var(--ink);border-radius:12px;font-weight:700;">'
        + '⚠️ Connection Error: ' + (err.message || 'Could not reach Gemini API') + '</div>';
    });
}

function closeDeepDive() {
  var modal = document.getElementById('modal-deep-dive');
  if (modal) modal.classList.add('hidden');
}

function saveKeyFromDeepDive() {
  var inp = document.getElementById('deep-dive-key-inp');
  if (inp && inp.value && inp.value.trim()) {
    localStorage.setItem('javaquest_gemini_key', inp.value.trim());
    if (typeof toast === 'function') toast('Gemini Key saved! 🚀');
    openDeepDive();
  }
}

// ═════════════════════════════════════════════════════════════════════
//  AI MISTAKE EXPLAINER (CHALLENGE FEEDBACK)
// ═════════════════════════════════════════════════════════════════════
function explainMistakeWithAI() {
  if (typeof _qs === 'undefined' || !_qs || typeof _qi === 'undefined' || !_qs[_qi]) return;
  var q = _qs[_qi];
  var btn = document.getElementById('btn-explain-mistake');
  var aiBox = document.getElementById('feedback-ai-box');
  if (!aiBox) return;

  var chosen = '';
  if (q.type === 'mcq' || q.type === 'output') {
    chosen = (q.options && typeof _selMCQ !== 'undefined' && q.options[_selMCQ]) ? q.options[_selMCQ] : 'Option ' + _selMCQ;
  } else if (q.type === 'true-false') {
    chosen = String(typeof _selTF !== 'undefined' ? _selTF : '');
  } else if (q.type === 'bug') {
    chosen = 'Line ' + ((typeof _selBug !== 'undefined' ? _selBug : 0) + 1);
  }

  var correctAns = '';
  if (q.type === 'mcq' || q.type === 'output') {
    correctAns = (q.options && q.options[q.answer]) ? q.options[q.answer] : 'Option ' + q.answer;
  } else if (q.type === 'true-false') {
    correctAns = String(q.answer);
  } else if (q.type === 'bug') {
    correctAns = 'Line ' + (q.answer + 1);
  }

  var apiKey = getGeminiKey();
  if (!apiKey) {
    if (typeof toast === 'function') toast('🔑 Gemini key needed to explain mistakes');
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Diagnosing…'; }
  aiBox.classList.remove('hidden');
  aiBox.innerHTML = '<span class="run-spinner" style="width:14px;height:14px;margin-right:8px;display:inline-block;"></span> JavaBot is diagnosing why that answer was tempting…';

  var prompt = 'A Java student answered a quiz question incorrectly.\n'
    + 'Question: "' + q.question + '"\n'
    + (q.code ? 'Code:\n```java\n' + q.code + '\n```\n' : '')
    + 'Correct Answer: "' + correctAns + '"\n'
    + 'Student Chose: "' + chosen + '"\n\n'
    + 'In 2 friendly, highly educational sentences, explain why the student\'s choice is a common misconception in Java, and provide an intuitive rule of thumb to remember the correct concept. Keep response under 55 words.';

  var payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 130, temperature: 0.3 }
  };

  callGemini('gemini-flash-lite-latest', apiKey, payload)
    .then(function(res) {
      if (btn) btn.classList.add('hidden');
      var reply = res.candidates[0].content.parts[0].text;
      aiBox.innerHTML = '<strong>🤖 JavaBot Insight:</strong> ' + esc(reply);
    })
    .catch(function(e) {
      if (btn) { btn.disabled = false; btn.textContent = '🤖 Explain My Mistake'; }
      aiBox.innerHTML = '⚠️ Could not analyze mistake right now.';
    });
}

// ═════════════════════════════════════════════════════════════════════
//  MARKDOWN FORMATTER FOR DEEP DIVES
// ═════════════════════════════════════════════════════════════════════
function formatDeepDiveMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```(?:java)?\n?([\s\S]*?)```/g, function(_, code) {
      var unesc = code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      return '<div class="code-block" style="margin:1rem 0;"><div class="code-block-header"><span class="code-lang-tag">Java</span></div><pre>'
        + (typeof highlightSyntax === 'function' ? highlightSyntax(unesc.trim()) : unesc.trim())
        + '</pre></div>';
    })
    .replace(/^### (.*$)/gim, '<h3 class="deep-dive-h3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h3 class="deep-dive-h3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<p></p>');
}
