// JavaQuest — ai-tutor.js
// Ultra-low token Gemini AI Integration with Secure Serverless Backend Proxy (/api/ai)
// No API keys are leaked to client browsers or git. Seamless guest access out of the box!

function getGeminiKey() {
  if (typeof window !== 'undefined') {
    var stored = localStorage.getItem('javaquest_gemini_key');
    if (stored && stored.trim()) return stored.trim();
    if (window.CONFIG && window.CONFIG.GEMINI_API_KEY && window.CONFIG.GEMINI_API_KEY.trim()) {
      return window.CONFIG.GEMINI_API_KEY.trim();
    }
  }
  return '';
}

// Universal AI Caller: Prefers secure serverless /api/ai, falls back to direct client API call
function callAI(action, payload) {
  var bodyData = Object.assign({ action: action }, payload || {});
  var clientKey = getGeminiKey();
  if (clientKey) {
    bodyData.apiKey = clientKey;
  }

  return fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData)
  })
  .then(function(res) {
    if (!res.ok) {
      return res.json().then(function(errObj) {
        throw new Error(errObj.error || ('Server returned HTTP ' + res.status));
      });
    }
    return res.json();
  })
  .catch(function(err) {
    // If /api/ai is not available (e.g., viewing as raw static file:// without a server)
    if (clientKey && typeof callGeminiDirect === 'function') {
      return callGeminiDirect(action, payload, clientKey);
    }
    throw err;
  });
}

function callGeminiDirect(action, payload, apiKey) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=' + apiKey;
  var prompt = '';
  if (action === 'quiz') {
    prompt = 'Generate 3 diverse quiz questions for: ' + (payload.topic || 'Java') + ' in strict JSON array format.';
  } else if (action === 'deep-dive') {
    prompt = 'Provide a deep technical JVM and memory architecture deep dive for: ' + (payload.topic || '') + ' - ' + (payload.slideTitle || '');
  } else if (action === 'explain-mistake') {
    prompt = 'Diagnose mistake for question: ' + (payload.question || '') + ' Correct: ' + (payload.correctAns || '') + ' Chosen: ' + (payload.chosenAns || '');
  } else {
    prompt = payload.message || 'Help me with Java.';
  }

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var text = (data.candidates && data.candidates[0].content.parts[0].text) || '';
    if (action === 'quiz') {
      var clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      return { success: true, questions: JSON.parse(clean) };
    } else if (action === 'deep-dive') {
      return { success: true, markdown: text };
    } else if (action === 'explain-mistake') {
      return { success: true, explanation: text };
    } else {
      return { success: true, reply: text };
    }
  });
}

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
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    updateChatContextPill();
    var inp = document.getElementById('chat-input');
    if (inp) inp.focus();
    scrollChatToBottom();
  }
}

function closeChat() {
  var panel = document.getElementById('chat-panel');
  if (panel) panel.classList.add('hidden');
}

function clearChat() {
  chatHistory = [];
  var msgs = document.getElementById('chat-messages');
  if (msgs) {
    msgs.innerHTML = '<div class="chat-message bot"><div class="message-bubble">Chat cleared! What Java concept or code snippet can I help you understand? ☕</div></div>';
  }
}

function sendChatMessage() {
  var input = document.getElementById('chat-input');
  if (!input) return;
  var msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendChatMsg('user', msg);

  updateChatContextPill();
  chatHistory.push({ role: 'user', text: msg });
  if (chatHistory.length > 6) {
    chatHistory = chatHistory.slice(-6);
  }

  var typing = document.getElementById('chat-typing');
  if (typing) typing.classList.remove('hidden');
  scrollChatToBottom();

  var codeCtx = getCurrentUserCodeContext();
  var enrichedMsg = msg;
  if (codeCtx && codeCtx.code) {
    enrichedMsg = '[Code Context: ' + codeCtx.title + ']\n```java\n' + codeCtx.code + '\n```\n'
      + (codeCtx.error ? '[Recent Error: ' + codeCtx.error + ']\n' : '')
      + 'User Question: ' + msg;
  }

  callAI('chat', { message: enrichedMsg, messages: chatHistory })
    .then(function(res) {
      if (typing) typing.classList.add('hidden');
      var reply = res.reply || 'I am ready to help with your Java questions!';
      chatHistory.push({ role: 'model', text: reply });
      appendChatMsg('bot', reply);
    })
    .catch(function(err) {
      if (typing) typing.classList.add('hidden');
      appendChatMsg('bot', '⚠️ ' + err.message + '. You can also enter a custom Gemini key in Settings (⚙️).');
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
  var msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
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

  if (typeof toast === 'function') toast('✨ Generating fresh AI questions for ' + mod.title + '…');

  callAI('quiz', {
    topic: mod.title + ' (' + (mod.subtitle || '') + ')',
    level: mod.level || 'intermediate',
    count: 3
  })
  .then(function(res) {
    var questions = res.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('AI returned an empty question list');
    }

    questions.forEach(function(q) {
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
    if (typeof toast === 'function') toast('🎯 Fresh AI Practice Quiz Ready! (+25 XP)');
  })
  .catch(function(err) {
    console.warn('AI Quiz generation fallback:', err);
    if (typeof toast === 'function') toast('⚠️ AI Generation failed. Loading standard module quiz.');
    if (typeof startChallenge === 'function') startChallenge(modId);
  });
}

function startAIChallengeFromModal() {
  if (typeof hideModal === 'function') hideModal('modal-challenge-result');
  var modId = (_cm && _cm.id) ? _cm.id.replace('module-', '').replace('ai_', '').split('_')[0] : 'b1';
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

  contentEl.innerHTML = '<div style="text-align:center;padding:3rem 1rem;">'
    + '<span class="run-spinner" style="width:28px;height:28px;margin-bottom:1.2rem;display:inline-block;"></span>'
    + '<div style="font-size:1.15rem;font-weight:800;color:var(--ink);">Analyzing JVM Internals & Memory Architecture…</div>'
    + '<div style="font-size:0.86rem;color:var(--text-secondary);margin-top:0.35rem;">Consulting Java Language Specification, HotSpot JIT & Effective Java rules</div>'
    + '</div>';

  callAI('deep-dive', {
    topic: mod.title,
    lessonTitle: _curLesson.title,
    slideTitle: slide.title,
    slideContent: slide.content || ''
  })
  .then(function(res) {
    var formattedHtml = formatDeepDiveMarkdown(res.markdown);
    contentEl.innerHTML = '<div class="deep-dive-body">' + formattedHtml + '</div>';
  })
  .catch(function(err) {
    contentEl.innerHTML = '<div style="text-align:center;padding:2rem 1rem;">'
      + '<div style="font-size:2.5rem;margin-bottom:0.5rem">⚠️</div>'
      + '<h3 style="font-size:1.2rem;font-weight:800;color:var(--ink);margin-bottom:0.5rem">Deep Dive Unavailable</h3>'
      + '<p style="color:var(--text-secondary);font-size:0.92rem;max-width:440px;margin:0 auto 1.25rem;">' + esc(err.message) + '</p>'
      + '<div style="display:flex;gap:8px;max-width:380px;margin:0 auto;">'
      + '<input type="password" id="deep-dive-key-inp" class="login-input" placeholder="Paste optional custom key" style="flex:1;padding:0.6rem 0.85rem;" />'
      + '<button class="btn-primary" onclick="saveKeyFromDeepDive()">Save Key</button>'
      + '</div>'
      + '</div>';
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

  if (btn) { btn.disabled = true; btn.textContent = 'Diagnosing…'; }
  aiBox.classList.remove('hidden');
  aiBox.innerHTML = '<span class="run-spinner" style="width:14px;height:14px;margin-right:8px;display:inline-block;"></span> JavaBot is diagnosing why that answer was tempting…';

  callAI('explain-mistake', {
    question: q.question,
    code: q.code || '',
    correctAns: correctAns,
    chosenAns: chosen
  })
  .then(function(res) {
    if (btn) btn.classList.add('hidden');
    aiBox.innerHTML = '<strong>🤖 JavaBot Insight:</strong> ' + esc(res.explanation);
  })
  .catch(function(e) {
    if (btn) { btn.disabled = false; btn.textContent = '🤖 Explain My Mistake'; }
    aiBox.innerHTML = '⚠️ Could not analyze mistake: ' + esc(e.message);
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
