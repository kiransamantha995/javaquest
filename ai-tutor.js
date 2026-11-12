// JavaQuest — ai-tutor.js
// JavaBot AI Coding Mentor v2 (Live Watching, Socratic Escalation, Error Translator, Code Review, Learner Memory)
// Zero client-side API keys. Authenticated calls proxy securely through /api/ai.

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Core State & Storage Keys
  // ─────────────────────────────────────────────────────────────────────────────
  var STORAGE_KEY_WATCHER_PAUSED = 'javaquest_watcher_paused';
  var STORAGE_KEY_LEARNER_MEMORY = 'javaquest_learner_memory';

  // Remove any obsolete legacy local key
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('javaquest_gemini_key');
    }
  } catch (e) {}

  var _isLiveWatchingPaused = false;
  try {
    _isLiveWatchingPaused = localStorage.getItem(STORAGE_KEY_WATCHER_PAUSED) === 'true';
  } catch (e) {
    _isLiveWatchingPaused = false;
  }

  var _lastUnpromptedSuggestionTime = 0;
  var _liveWatchDebounceTimer = null;
  var _currentSocraticTier = 1; // 1: Guiding question, 2: Syntax hint, 3: Diff fix
  var _activeDiffSuggestion = null; // { search: string, replace: string, lineNo?: number, explanation?: string }
  var _lastCompilerError = '';
  var _lastRuntimeError = '';
  var _lastRunOutput = '';
  var _lastTestResultSummary = '';

  var chatHistory = [];
  var _isSendingChat = false;
  var _lastChatSendTime = 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Network Caller (/api/ai)
  // ─────────────────────────────────────────────────────────────────────────────
  function callAI(action, payload) {
    var bodyData = Object.assign({ action: action }, payload || {});
    delete bodyData.apiKey; // Safety: Never send client apiKey

    var token = (window._sbSession && window._sbSession.access_token) ? window._sbSession.access_token : '';

    return fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? ('Bearer ' + token) : ''
      },
      body: JSON.stringify(bodyData)
    })
    .then(function (res) {
      if (res.status === 401) {
        return res.json().catch(function () { return {}; }).then(function (e) {
          throw new Error(e.error || 'Please sign in or continue as guest to use JavaBot.');
        });
      }
      if (res.status === 429) {
        return res.json().catch(function () { return {}; }).then(function (e) {
          throw new Error(e.error || 'Rate limit reached. Please wait a moment before trying again.');
        });
      }
      if (!res.ok) {
        return res.json().catch(function () { return {}; }).then(function (errObj) {
          throw new Error(errObj.error || ('AI service temporarily busy (HTTP ' + res.status + '). Please try again in a moment.'));
        });
      }
      return res.json();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Local Learner Memory (Viewable, Deletable)
  // ─────────────────────────────────────────────────────────────────────────────
  function getLearnerMemory() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_LEARNER_MEMORY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function recordLearnerMistake(concept) {
    if (!concept || typeof concept !== 'string') return;
    concept = concept.trim();
    if (!concept) return;

    try {
      var mem = getLearnerMemory();
      var existing = mem.find(function (m) {
        return m.concept.toLowerCase() === concept.toLowerCase();
      });

      if (existing) {
        existing.count = (existing.count || 1) + 1;
        existing.lastSeen = new Date().toISOString();
      } else {
        mem.push({
          concept: concept,
          count: 1,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString()
        });
      }

      // Sort by frequency descending and cap at 25 concepts
      mem.sort(function (a, b) { return (b.count || 1) - (a.count || 1); });
      if (mem.length > 25) mem = mem.slice(0, 25);

      localStorage.setItem(STORAGE_KEY_LEARNER_MEMORY, JSON.stringify(mem));
      renderLearnerMemoryUI();
    } catch (e) {}
  }

  function clearLearnerMemory() {
    try {
      localStorage.removeItem(STORAGE_KEY_LEARNER_MEMORY);
      renderLearnerMemoryUI();
      if (typeof toast === 'function') toast('Learner memory reset! Starting fresh.');
    } catch (e) {}
  }

  function renderLearnerMemoryUI() {
    var container = document.getElementById('learner-memory-full-list');
    if (!container) return;
    var mem = getLearnerMemory();
    if (mem.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:2rem 1rem;color:var(--text-secondary);font-size:0.9rem;">'
        + '<div style="font-size:2rem;margin-bottom:0.5rem">✨</div>'
        + 'No learning weak spots tracked yet! As you write and debug code, JavaBot remembers tricky concepts to help you master them.'
        + '</div>';
      return;
    }

    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:0.75rem;">';
    mem.forEach(function (m) {
      var dateStr = m.lastSeen ? new Date(m.lastSeen).toLocaleDateString() : 'Recently';
      html += '<div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:0.75rem 1rem;border-radius:12px;">'
        + '<div style="font-weight:700;font-size:0.88rem;color:var(--ink);">' + esc(m.concept) + '</div>'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.4rem;font-size:0.78rem;color:var(--text-secondary);">'
        + '<span>Encountered ' + m.count + '×</span>'
        + '<span>' + esc(dateStr) + '</span>'
        + '</div>'
        + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function openLearnerMemoryModal() {
    renderLearnerMemoryUI();
    var modal = document.getElementById('modal-learner-memory');
    if (modal) modal.classList.remove('hidden');
  }

  function closeLearnerMemoryModal() {
    var modal = document.getElementById('modal-learner-memory');
    if (modal) modal.classList.add('hidden');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Client-Side Static Analysis Linter (Instant & Free)
  // ─────────────────────────────────────────────────────────────────────────────
  function analyzeCodeLocally(code) {
    if (!code || typeof code !== 'string') return null;

    // 1. String compared with ==
    // Matches: name == "Bob", "Alice" == str, or s1 == s2 where declared as String
    var strEqMatch = code.match(/([a-zA-Z0-9_]+)\s*==\s*"([^"]*)"/) || code.match(/"([^"]*)"\s*==\s*([a-zA-Z0-9_]+)/);
    if (strEqMatch) {
      var varName = strEqMatch[1].startsWith('"') ? strEqMatch[2] : strEqMatch[1];
      var literal = strEqMatch[1].startsWith('"') ? strEqMatch[1] : strEqMatch[2];
      return {
        concept: 'String Equality (.equals)',
        tier1: 'How does Java compare object references in memory versus text content in the heap? Does == check value or address?',
        tier2: 'The == operator checks whether two variables refer to the exact same object in memory. To compare character contents, use ' + varName + '.equals(' + (literal.startsWith('"') ? literal : ('"' + literal + '"')) + ').',
        tier3: {
          search: strEqMatch[0],
          replace: varName + '.equals(' + (literal.startsWith('"') ? literal : ('"' + literal + '"')) + ')',
          explanation: 'Replaced reference equality (==) with value equality (.equals()). String instances in Java should always be compared using .equals() (Module 6: Arrays and Strings).'
        }
      };
    }

    // 2. Accidental assignment inside if condition (e.g. if (x = 5))
    var assignInIf = code.match(/if\s*\([^=]*[^!=<>]=[^=][^)]*\)/);
    if (assignInIf) {
      var wrongPart = assignInIf[0];
      var fixedPart = wrongPart.replace(/=([^=])/, '==$1');
      return {
        concept: 'Assignment vs Equality in Condition',
        tier1: 'Check the condition inside your if statement. Are you assigning a new value to a variable or testing equality?',
        tier2: 'In Java, a single = is the assignment operator. Conditional branches require a boolean comparison with ==, !=, <, or >.',
        tier3: {
          search: wrongPart,
          replace: fixedPart,
          explanation: 'Replaced assignment operator (=) with equality comparison (==).'
        }
      };
    }

    // 3. Unclosed Scanner on System.in
    var hasScanner = /Scanner\s+([a-zA-Z0-9_]+)\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)/.exec(code);
    if (hasScanner) {
      var scanVar = hasScanner[1];
      var hasClose = new RegExp('\\b' + scanVar + '\\.close\\s*\\(').test(code);
      var hasTryWithResources = /try\s*\(\s*Scanner/.test(code);
      if (!hasClose && !hasTryWithResources && code.length > 100) {
        return {
          concept: 'Resource Leak: Unclosed Scanner',
          tier1: 'When your program allocates system I/O resources like Scanner(System.in), what must you do when reading finishes?',
          tier2: 'Unclosed resources leak OS file handles. Remember to call ' + scanVar + '.close() at the end or wrap it in a try-with-resources block.',
          tier3: {
            search: hasScanner[0] + ';',
            replace: '// Recommended: Close ' + scanVar + ' with try-with-resources\ntry (' + hasScanner[0] + ') {',
            explanation: 'Modern Java (Effective Java Item 9) recommends try-with-resources over manual .close().'
          }
        };
      }
    }

    // 4. Mismatched Curly Braces
    var openBraces = (code.match(/\{/g) || []).length;
    var closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces && code.length > 40) {
      return {
        concept: 'Syntax: Mismatched Braces',
        tier1: 'Your code blocks appear structurally unbalanced. Take a close look at your class and method boundaries.',
        tier2: 'Found ' + openBraces + ' opening "{" brace(s) and ' + closeBraces + ' closing "}" brace(s). Every opening block must have a matching closing brace.',
        tier3: {
          search: openBraces > closeBraces ? '}' : '{',
          replace: openBraces > closeBraces ? '}\n}' : '{\n{',
          explanation: 'Ensure every method and class body is properly closed with a matching curly brace "}".'
        }
      };
    }

    // 5. Off-by-one array bound in loop (i <= arr.length)
    var offByOne = code.match(/for\s*\([^;]+;\s*([a-zA-Z0-9_]+)\s*<=\s*([a-zA-Z0-9_]+)\.(length|size\(\))\s*;/);
    if (offByOne) {
      var loopVar = offByOne[1];
      var collVar = offByOne[2];
      var lenProp = offByOne[3];
      var searchStr = offByOne[0];
      var fixedStr = searchStr.replace('<=', '<');
      return {
        concept: 'Off-by-One Array Bound',
        tier1: 'Remember zero-based indexing in Java. What is the index of the very last element in an array of size N?',
        tier2: 'Array indices range from 0 to length - 1. Iterating with <= ' + collVar + '.' + lenProp + ' will trigger an IndexOutOfBoundsException on the final pass. Use < instead of <=.',
        tier3: {
          search: searchStr,
          replace: fixedStr,
          explanation: 'Replaced <= with < to prevent accessing index ' + collVar + '.' + lenProp + ', which does not exist in a zero-indexed array.'
        }
      };
    }

    // 6. Missing Semicolon on Statement Lines
    var lines = code.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.startsWith('import ') || line.startsWith('package ')) continue;
      if (line.endsWith('{') || line.endsWith('}') || line.endsWith(';') || line.endsWith(':')) continue;
      // Typical statements that must end in semicolon
      if (/^(int|long|double|float|boolean|char|String|var|[A-Z][a-zA-Z0-9_]*)\s+[a-zA-Z0-9_]+\s*=/.test(line) ||
          /^System\.out\.(println|print|printf)\s*\(.*\)$/.test(line) ||
          /^return\s+.*$/.test(line) ||
          /^[a-zA-Z0-9_]+\s*=\s*.*$/.test(line)) {
        return {
          concept: 'Syntax: Missing Semicolon',
          tier1: 'Check the end of line ' + (i + 1) + '. How does the Java compiler know a statement has concluded?',
          tier2: 'In Java, every expression statement and variable declaration must terminate with a semicolon ";".',
          tier3: {
            search: line,
            replace: line + ';',
            explanation: 'Added missing semicolon ";" to terminate the statement on line ' + (i + 1) + '.'
          }
        };
      }
    }

    // 7. Missing Return in Non-Void Method
    var methodMatch = code.match(/(public|private|protected|static)\s+(int|long|double|float|boolean|char|String|[A-Z][a-zA-Z0-9_]*)\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{([\s\S]*?)\}/);
    if (methodMatch) {
      var retType = methodMatch[2];
      var mBody = methodMatch[4];
      if (retType !== 'void' && !/\breturn\b/.test(mBody) && mBody.trim().length > 10) {
        return {
          concept: 'Method: Missing Return Statement',
          tier1: 'Notice the return type declared in method ' + methodMatch[3] + '(). Does every execution path return a value of type ' + retType + '?',
          tier2: 'Methods with return type ' + retType + ' must provide a "return" statement supplying a valid ' + retType + ' value before reaching the end of the method body.',
          tier3: {
            search: mBody.trim().slice(-1),
            replace: '\n        return ' + (retType === 'boolean' ? 'false' : (retType === 'int' ? '0' : 'null')) + ';\n    }',
            explanation: 'Added return statement to fulfill the non-void return contract of method ' + methodMatch[3] + '().'
          }
        };
      }
    }

    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Live Watching State Machine & Indicator
  // ─────────────────────────────────────────────────────────────────────────────
  function toggleLiveWatching() {
    _isLiveWatchingPaused = !_isLiveWatchingPaused;
    try {
      localStorage.setItem(STORAGE_KEY_WATCHER_PAUSED, String(_isLiveWatchingPaused));
    } catch (e) {}

    updateWatcherUI();

    if (typeof toast === 'function') {
      toast(_isLiveWatchingPaused ? 'JavaBot live code watching paused.' : 'JavaBot is actively watching your code.');
    }
  }

  function updateWatcherUI() {
    var btns = document.querySelectorAll('#live-watch-toggle-btn, .live-watch-toggle-btn, #live-watch-pause-btn');
    btns.forEach(function (btn) {
      if (_isLiveWatchingPaused) {
        btn.innerHTML = '<svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="10" r="8"></circle><line x1="4" y1="4" x2="16" y2="16"></line></svg> Watching: Paused';
        btn.classList.add('paused');
        btn.style.opacity = '0.65';
        btn.setAttribute('title', 'JavaBot watching is paused. Click to resume.');
      } else {
        btn.innerHTML = '<svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 10c3-5.5 15-5.5 18 0-3 5.5-15 5.5-18 0z"/><circle cx="10" cy="10" r="2.5"/></svg> Watching: Active';
        btn.classList.remove('paused');
        btn.style.opacity = '1';
        btn.setAttribute('title', 'JavaBot is watching your code. Click to pause.');
      }
    });

    var indicatorDots = document.querySelectorAll('.live-watch-dot');
    indicatorDots.forEach(function (dot) {
      if (_isLiveWatchingPaused) {
        dot.style.background = '#9CA3AF';
        dot.classList.remove('active');
      } else {
        dot.style.background = '#10B981';
        dot.classList.add('active');
      }
    });
  }

  // Proactive watcher called on editor input
  function triggerLiveCodeWatcher(code) {
    if (_isLiveWatchingPaused) return; // Paused: Stop all sends and checks immediately

    clearTimeout(_liveWatchDebounceTimer);
    _liveWatchDebounceTimer = setTimeout(function () {
      if (_isLiveWatchingPaused) return;

      var now = Date.now();
      // At most one unprompted suggestion every 3 minutes (180s) to avoid interrupting learner
      if (now - _lastUnpromptedSuggestionTime < 180000) return;

      var finding = analyzeCodeLocally(code);
      if (finding) {
        _lastUnpromptedSuggestionTime = now;
        recordLearnerMistake(finding.concept);
        showJavaBotToast(finding.concept, finding.tier1);
      }
    }, 2800); // 2.8s debounce: never interrupt active typing
  }

  function showJavaBotToast(concept, message) {
    var toastEl = document.getElementById('javabot-suggestion-toast');
    if (!toastEl) return;
    var titleEl = document.getElementById('javabot-toast-title');
    var msgEl = document.getElementById('javabot-toast-msg');
    var btnEl = document.getElementById('javabot-toast-action-btn');

    if (titleEl) titleEl.textContent = 'JavaBot Tip: ' + concept;
    if (msgEl) msgEl.textContent = message;
    if (btnEl) {
      btnEl.onclick = function () {
        dismissJavaBotToast();
        openSocraticHintModal(1);
      };
    }

    toastEl.classList.remove('hidden');
    // Auto-dismiss after 12 seconds
    setTimeout(function () {
      dismissJavaBotToast();
    }, 12000);
  }

  function dismissJavaBotToast() {
    var toastEl = document.getElementById('javabot-suggestion-toast');
    if (toastEl) toastEl.classList.add('hidden');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. Socratic Escalation System (3 Progressive Tiers)
  // ─────────────────────────────────────────────────────────────────────────────
  function requestSocraticHint(targetTier) {
    if (typeof targetTier === 'number') {
      _currentSocraticTier = Math.min(Math.max(targetTier, 1), 3);
    } else {
      _currentSocraticTier = Math.min(_currentSocraticTier + 1, 3);
    }

    var codeCtx = getCurrentUserCodeContext();
    var code = codeCtx ? (codeCtx.code || '') : '';
    var lessonTitle = codeCtx ? (codeCtx.title || 'Java Lesson') : 'Java Lesson';

    // 1. Try local linter first (instant, free, reliable)
    var localIssue = analyzeCodeLocally(code);
    if (localIssue) {
      recordLearnerMistake(localIssue.concept);
      displaySocraticGuidance({
        tier: _currentSocraticTier,
        concept: localIssue.concept,
        message: _currentSocraticTier === 1 ? localIssue.tier1 : (_currentSocraticTier === 2 ? localIssue.tier2 : localIssue.tier3.explanation),
        diff: _currentSocraticTier === 3 ? localIssue.tier3 : null,
        lessonTopic: lessonTitle
      });
      return;
    }

    // 2. Fall back to /api/ai if code is nuanced or has compiler error
    var panel = document.getElementById('chat-panel');
    if (panel && panel.classList.contains('hidden')) toggleChat();

    appendChatMsg('user', 'Hint please (Tier ' + _currentSocraticTier + ') for ' + lessonTitle);
    var typing = document.getElementById('chat-typing');
    if (typing) typing.classList.remove('hidden');
    scrollChatToBottom();

    callAI('socratic-hint', {
      code: code,
      lessonTitle: lessonTitle,
      error: _lastCompilerError || _lastRuntimeError || '',
      tier: _currentSocraticTier
    })
    .then(function (res) {
      if (typing) typing.classList.add('hidden');
      if (res.concept) recordLearnerMistake(res.concept);
      displaySocraticGuidance(res);
    })
    .catch(function (err) {
      if (typing) typing.classList.add('hidden');
      appendChatMsg('bot', 'JavaBot encountered a hiccup: ' + esc(err.message) + '. Review your logic or try again in a moment!');
    });
  }

  function displaySocraticGuidance(data) {
    var tier = data.tier || _currentSocraticTier;
    var badgeName = tier === 1 ? 'Guiding Question' : (tier === 2 ? 'Syntax Hint' : 'Concrete Fix');
    var badgeColor = tier === 1 ? '#3B82F6' : (tier === 2 ? '#F59E0B' : '#10B981');

    var msgHtml = '<div style="margin-bottom:0.4rem;">'
      + '<span style="background:' + badgeColor + '22;color:' + badgeColor + ';border:1px solid ' + badgeColor + '44;font-size:0.7rem;font-weight:800;padding:0.15rem 0.5rem;border-radius:999px;text-transform:uppercase;">'
      + 'Tier ' + tier + ' • ' + badgeName + '</span>'
      + ' <span style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;">' + esc(data.concept || 'Java') + '</span>'
      + '</div>'
      + '<div>' + esc(data.message) + '</div>';

    if (tier < 3) {
      msgHtml += '<div style="margin-top:0.75rem;">'
        + '<button class="btn-xs btn-outline-gold" onclick="window.requestSocraticHint(' + (tier + 1) + ')">Need more help? (Tier ' + (tier + 1) + ')</button>'
        + '</div>';
    } else if (data.diff) {
      _activeDiffSuggestion = data.diff;
      msgHtml += '<div style="margin-top:0.75rem;">'
        + '<button class="btn-xs btn-primary" onclick="window.openDiffModal()">Inspect & Apply Fix</button>'
        + '</div>';
    }

    appendChatMsg('bot', msgHtml, true);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. Interactive Diff Preview & One-Click Apply Modal
  // ─────────────────────────────────────────────────────────────────────────────
  function openDiffModal(diffObj) {
    var diff = diffObj || _activeDiffSuggestion;
    if (!diff) {
      if (typeof toast === 'function') toast('No active suggestion diff available.');
      return;
    }
    _activeDiffSuggestion = diff;

    var modal = document.getElementById('modal-diff-preview');
    if (!modal) return;

    var oldEl = document.getElementById('diff-preview-old');
    var newEl = document.getElementById('diff-preview-new');
    var explEl = document.getElementById('diff-modal-explanation');

    if (oldEl) oldEl.textContent = diff.search || '(line to replace)';
    if (newEl) newEl.textContent = diff.replace || '(suggested fix)';
    if (explEl) explEl.textContent = diff.explanation || 'Review the suggested modification before applying it to your editor.';

    modal.classList.remove('hidden');
  }

  function closeDiffModal() {
    var modal = document.getElementById('modal-diff-preview');
    if (modal) modal.classList.add('hidden');
  }

  function applyDiffSuggestion() {
    if (!_activeDiffSuggestion) return;
    var searchStr = _activeDiffSuggestion.search;
    var replaceStr = _activeDiffSuggestion.replace;

    if (!searchStr || !replaceStr) {
      closeDiffModal();
      return;
    }

    var applied = false;

    // 1. Try lesson CodeMirror instance (_cmLesson)
    if (window._cmLesson && typeof window._cmLesson.getValue === 'function') {
      var currentVal = window._cmLesson.getValue();
      if (currentVal.includes(searchStr)) {
        var newVal = currentVal.replace(searchStr, replaceStr);
        window._cmLesson.setValue(newVal);
        applied = true;
      }
    }

    // 2. Try coding editor CodeMirror instance (_cmCoding)
    if (!applied && window._cmCoding && typeof window._cmCoding.getValue === 'function') {
      var cVal = window._cmCoding.getValue();
      if (cVal.includes(searchStr)) {
        window._cmCoding.setValue(cVal.replace(searchStr, replaceStr));
        applied = true;
      }
    }

    // 3. Try playground CodeMirror instance (_cmPlayground)
    if (!applied && window._cmPlayground && typeof window._cmPlayground.getValue === 'function') {
      var pVal = window._cmPlayground.getValue();
      if (pVal.includes(searchStr)) {
        window._cmPlayground.setValue(pVal.replace(searchStr, replaceStr));
        applied = true;
      }
    }

    // 4. Fall back to standard DOM textareas
    if (!applied) {
      var textareas = [
        document.getElementById('lesson-code-editor'),
        document.getElementById('coding-editor'),
        document.getElementById('code-editor')
      ];
      for (var i = 0; i < textareas.length; i++) {
        var ta = textareas[i];
        if (ta && ta.value && ta.value.includes(searchStr)) {
          ta.value = ta.value.replace(searchStr, replaceStr);
          applied = true;
          break;
        }
      }
    }

    closeDiffModal();

    if (applied) {
      if (typeof toast === 'function') toast('JavaBot suggestion applied to editor!');
      // Flash editor border to give tactile feedback
      var activeWrap = document.querySelector('.cm-editor-wrap:not(.hidden)');
      if (activeWrap) {
        activeWrap.style.boxShadow = '0 0 0 3px #10B981';
        setTimeout(function () { activeWrap.style.boxShadow = ''; }, 1200);
      }
    } else {
      if (typeof toast === 'function') toast('Target code line was modified. Please verify manually.');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. Error Translator (Javac & Runtime to Plain English)
  // ─────────────────────────────────────────────────────────────────────────────
  function translateErrorWithAI(errorText) {
    if (!errorText) {
      var codeCtx = getCurrentUserCodeContext();
      errorText = _lastCompilerError || _lastRuntimeError || (codeCtx ? codeCtx.error : '');
    }
    if (!errorText) {
      if (typeof toast === 'function') toast('No compiler or runtime errors found.');
      return;
    }

    var panel = document.getElementById('chat-panel');
    if (panel && panel.classList.contains('hidden')) toggleChat();

    appendChatMsg('user', 'Can you explain this compiler error in plain English?');
    var typing = document.getElementById('chat-typing');
    if (typing) typing.classList.remove('hidden');
    scrollChatToBottom();

    var codeCtx2 = getCurrentUserCodeContext();

    callAI('translate-error', {
      errorText: errorText,
      code: codeCtx2 ? codeCtx2.code : ''
    })
    .then(function (res) {
      if (typing) typing.classList.add('hidden');
      var html = '<div style="margin-bottom:0.4rem;">'
        + '<span style="background:rgba(239,68,68,0.15);color:#EF4444;border:1px solid rgba(239,68,68,0.3);font-size:0.7rem;font-weight:800;padding:0.15rem 0.5rem;border-radius:999px;">'
        + 'Error Diagnosis • Line ' + (res.lineNo || 1) + '</span>'
        + '</div>'
        + '<div>' + esc(res.plainEnglish) + '</div>';

      if (res.suggestedFix && res.searchLine) {
        _activeDiffSuggestion = {
          search: res.searchLine,
          replace: res.suggestedFix,
          explanation: res.plainEnglish
        };
        html += '<div style="margin-top:0.75rem;">'
          + '<button class="btn-xs btn-primary" onclick="window.openDiffModal()">Inspect & Apply Fix</button>'
          + '</div>';
      }

      appendChatMsg('bot', html, true);
    })
    .catch(function (err) {
      if (typing) typing.classList.add('hidden');
      appendChatMsg('bot', 'Could not diagnose error: ' + esc(err.message));
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. Automated Code Review Mode (Effective Java Best Practices)
  // ─────────────────────────────────────────────────────────────────────────────
  function reviewCodeWithAI() {
    var codeCtx = getCurrentUserCodeContext();
    var code = codeCtx ? codeCtx.code : '';
    var taskTitle = codeCtx ? codeCtx.title : 'Java Exercise';

    if (!code || code.trim().length < 15) {
      if (typeof toast === 'function') toast('Write code in the editor before requesting a review!');
      return;
    }

    var panel = document.getElementById('chat-panel');
    if (panel && panel.classList.contains('hidden')) toggleChat();

    appendChatMsg('user', 'Can you review my code for best practices and Effective Java tips?');
    var typing = document.getElementById('chat-typing');
    if (typing) typing.classList.remove('hidden');
    scrollChatToBottom();

    callAI('code-review', {
      code: code,
      taskTitle: taskTitle
    })
    .then(function (res) {
      if (typing) typing.classList.add('hidden');
      var html = '<div style="margin-bottom:0.4rem;">'
        + '<span style="background:rgba(16,185,129,0.15);color:#10B981;border:1px solid rgba(16,185,129,0.3);font-size:0.7rem;font-weight:800;padding:0.15rem 0.5rem;border-radius:999px;">'
        + 'Code Review • ' + esc(res.bookCitation || 'Effective Java') + '</span>'
        + '</div>'
        + '<div style="margin-bottom:0.5rem;"><strong>🌟 Strength:</strong> ' + esc(res.strength) + '</div>'
        + '<div style="margin-bottom:0.5rem;"><strong>💡 Clean Code Tip:</strong> ' + esc(res.improvement) + '</div>'
        + '<div><strong>☕ Effective Java:</strong> ' + esc(res.effectiveJavaTip) + '</div>';

      appendChatMsg('bot', html, true);
    })
    .catch(function (err) {
      if (typing) typing.classList.add('hidden');
      appendChatMsg('bot', 'Review temporarily unavailable: ' + esc(err.message));
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. Chat Panel & Message Handling
  // ─────────────────────────────────────────────────────────────────────────────
  function getCurrentUserCodeContext() {
    var code = '';
    var contextTitle = '';
    var compilerScreen = document.getElementById('screen-compiler');
    var codingScreen = document.getElementById('screen-coding');
    var lessonScreen = document.getElementById('screen-lesson');

    if (lessonScreen && lessonScreen.classList.contains('active')) {
      if (window._cmLesson && typeof window._cmLesson.getValue === 'function') {
        code = window._cmLesson.getValue();
      } else {
        var lEd = document.getElementById('lesson-code-editor');
        if (lEd) code = lEd.value;
      }
      var lTitle = document.getElementById('lesson-header-title');
      contextTitle = 'Lesson: ' + (lTitle ? lTitle.textContent.trim() : 'Java Exercise');
    } else if (codingScreen && codingScreen.classList.contains('active')) {
      if (window._cmCoding && typeof window._cmCoding.getValue === 'function') {
        code = window._cmCoding.getValue();
      } else {
        var cdEd = document.getElementById('coding-editor');
        if (cdEd) code = cdEd.value;
      }
      var cTitle = document.getElementById('coding-task-title');
      contextTitle = 'Coding Challenge: ' + (cTitle ? cTitle.textContent.trim() : 'Task');
    } else if (compilerScreen && compilerScreen.classList.contains('active')) {
      if (window._cmPlayground && typeof window._cmPlayground.getValue === 'function') {
        code = window._cmPlayground.getValue();
      } else {
        var ed = document.getElementById('code-editor');
        if (ed) code = ed.value;
      }
      var banner = document.getElementById('capstone-banner-title');
      var bannerEl = document.getElementById('capstone-editor-banner');
      contextTitle = (banner && bannerEl && !bannerEl.classList.contains('hidden'))
        ? 'Capstone: ' + banner.textContent.trim()
        : 'Java Playground';
    } else {
      if (window._cmLesson) code = window._cmLesson.getValue();
      else if (window._cmPlayground) code = window._cmPlayground.getValue();
      contextTitle = 'Active Workspace';
    }

    return {
      code: code ? code.trim() : '',
      title: contextTitle || 'Java',
      error: _lastCompilerError || _lastRuntimeError || ''
    };
  }

  var _lastToggleChatTime = 0;
  function toggleChat(forceState) {
    var now = Date.now();
    if (typeof forceState !== 'boolean' && (now - _lastToggleChatTime < 280)) {
      return;
    }
    _lastToggleChatTime = now;

    var panel = document.getElementById('chat-panel');
    var fab = document.getElementById('ai-chat-fab');
    if (!panel) return;

    var shouldOpen = (typeof forceState === 'boolean') ? forceState : panel.classList.contains('hidden');
    if (shouldOpen) {
      panel.classList.remove('hidden');
      if (fab) fab.classList.add('chat-open');
      updateChatContextPill();
      var input = document.getElementById('chat-input');
      if (input) setTimeout(function () { input.focus(); }, 150);
      scrollChatToBottom();
    } else {
      panel.classList.add('hidden');
      if (fab) fab.classList.remove('chat-open');
    }
  }

  function updateChatContextPill() {
    var pill = document.getElementById('chat-context-pill');
    var label = document.getElementById('chat-context-label');
    if (!pill || !label) return;
    var ctx = getCurrentUserCodeContext();
    if (ctx && ctx.code) {
      label.textContent = ctx.title;
      pill.classList.remove('hidden');
    } else {
      pill.classList.add('hidden');
    }
  }

  function sendChatMessage() {
    var now = Date.now();
    if (_isSendingChat || (now - _lastChatSendTime < 500)) return;

    var input = document.getElementById('chat-input');
    if (!input) return;
    var msg = input.value.trim();
    if (!msg) return;

    _isSendingChat = true;
    _lastChatSendTime = now;
    input.value = '';
    appendChatMsg('user', msg);

    var sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) sendBtn.disabled = true;

    function resetControls() {
      _isSendingChat = false;
      if (sendBtn) sendBtn.disabled = false;
    }

    updateChatContextPill();
    chatHistory.push({ role: 'user', text: msg });
    if (chatHistory.length > 8) chatHistory = chatHistory.slice(-8);

    var typing = document.getElementById('chat-typing');
    if (typing) typing.classList.remove('hidden');
    scrollChatToBottom();

    var codeCtx = getCurrentUserCodeContext();
    var enrichedMsg = msg;
    if (codeCtx && codeCtx.code) {
      enrichedMsg = '[Context: ' + codeCtx.title + ']\n'
        + '```java\n' + codeCtx.code.slice(0, 1400) + '\n```\n'
        + (codeCtx.error ? ('[Last Error: ' + codeCtx.error.slice(0, 250) + ']\n') : '')
        + 'Student Question: ' + msg;
    }

    callAI('chat', { message: enrichedMsg, messages: chatHistory })
      .then(function (res) {
        if (typing) typing.classList.add('hidden');
        var reply = res.reply || 'I am ready to help with your Java journey!';
        chatHistory.push({ role: 'model', text: reply });
        appendChatMsg('bot', reply);
        resetControls();
      })
      .catch(function (err) {
        if (typing) typing.classList.add('hidden');
        appendChatMsg('bot', 'JavaBot encountered an issue: ' + esc(err.message));
        resetControls();
      });
  }

  function clearChat() {
    chatHistory = [];
    var container = document.getElementById('chat-messages');
    if (container) {
      container.innerHTML = '<div class="chat-message bot"><div class="message-bubble">Chat cleared! What Java concept or coding challenge can I help you master?</div></div>';
    }
    _currentSocraticTier = 1;
    if (typeof toast === 'function') toast('Chat history reset.');
  }

  function appendChatMsg(role, text, isHtml) {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'chat-message ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      var formatted = String(text)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/```(?:java)?\n?([\s\S]*?)```/g, function (_, codeSnippet) {
          var unescaped = codeSnippet.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          return '<pre>' + (typeof highlightSyntax === 'function' ? highlightSyntax(unescaped.trim()) : unescaped.trim()) + '</pre>';
        })
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      bubble.innerHTML = formatted;
    }

    div.appendChild(bubble);
    container.appendChild(div);
    scrollChatToBottom();
  }

  function scrollChatToBottom() {
    var msgs = document.getElementById('chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. Practice Quizzes Enhanced by Learner Memory
  // ─────────────────────────────────────────────────────────────────────────────
  function generateAIQuiz(modId) {
    var mod = typeof getMod === 'function' ? getMod(modId) : null;
    var mem = getLearnerMemory();
    var topWeakSpot = (mem.length > 0 && mem[0].concept) ? mem[0].concept : '';

    var topic = mod ? (mod.title + (topWeakSpot ? ' focusing on ' + topWeakSpot : '')) : 'Java Fundamentals';
    if (typeof toast === 'function') toast('Generating AI practice quiz with personalized weak spots…');

    callAI('quiz', {
      topic: topic,
      level: mod ? (mod.level || 'intermediate') : 'intermediate',
      count: 3
    })
    .then(function (res) {
      var questions = res.questions;
      if (!Array.isArray(questions) || !questions.length) throw new Error('Empty quiz received');

      questions.forEach(function (q) {
        if (!q.type) q.type = 'mcq';
        if (typeof q.answer !== 'number') q.answer = 0;
        if (!Array.isArray(q.options) || q.options.length < 2) q.options = ['A', 'B', 'C', 'D'];
      });

      if (typeof window._cm !== 'undefined') {
        window._cm = {
          id: mod ? mod.id : 'ai_practice',
          title: (mod ? mod.title : 'AI Practice') + ' [Personalized]',
          lessons: mod ? (mod.lessons || []) : [],
          challenge: { id: 'ai_' + Date.now(), xp: 25, questions: questions }
        };
        window._qs = questions.slice();
        window._qi = 0;
        window._hits = 0;
        if (typeof renderHearts === 'function') renderHearts();
        if (typeof renderQuestion === 'function') renderQuestion();
        if (typeof showScreen === 'function') showScreen('challenge');
        if (typeof toast === 'function') toast('Personalized AI practice quiz ready! (+25 XP)');
      }
    })
    .catch(function (err) {
      if (typeof toast === 'function') toast('Quiz generation failed. Loading standard module quiz.');
      if (typeof startChallenge === 'function') startChallenge(modId);
    });
  }

  function startAIChallengeFromModal() {
    if (typeof hideModal === 'function') hideModal('modal-challenge-result');
    var modId = (window._cm && window._cm.id) ? window._cm.id.replace('module-', '').replace('ai_', '').split('_')[0] : 'b1';
    generateAIQuiz(modId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. Deep Dive & Mistake Explainer Modals
  // ─────────────────────────────────────────────────────────────────────────────
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
    if (subEl) subEl.textContent = 'Module: ' + mod.title + ' • JVM Architecture Deep Dive';
    modal.classList.remove('hidden');

    contentEl.innerHTML = '<div style="text-align:center;padding:3rem 1rem;">'
      + '<span class="run-spinner" style="width:28px;height:28px;margin-bottom:1.2rem;display:inline-block;"></span>'
      + '<div style="font-size:1.15rem;font-weight:800;color:var(--ink);">Analyzing HotSpot JIT & JVM Internals…</div>'
      + '<div style="font-size:0.86rem;color:var(--text-secondary);margin-top:0.35rem;">Consulting Java Language Specification and Effective Java best practices</div>'
      + '</div>';

    callAI('deep-dive', {
      topic: mod.title,
      lessonTitle: _curLesson.title,
      slideTitle: slide.title,
      slideContent: slide.content || ''
    })
    .then(function (res) {
      contentEl.innerHTML = '<div class="deep-dive-body">' + formatDeepDiveMarkdown(res.markdown) + '</div>';
    })
    .catch(function (err) {
      contentEl.innerHTML = '<div style="text-align:center;padding:2rem 1rem;">'
        + '<div style="font-size:2rem;font-weight:900;color:#DC2626;margin-bottom:0.5rem">!</div>'
        + '<h3 style="font-size:1.2rem;font-weight:800;color:var(--ink);margin-bottom:0.5rem">Deep Dive Unavailable</h3>'
        + '<p style="color:var(--text-secondary);font-size:0.92rem;max-width:440px;margin:0 auto 1.25rem;">' + esc(err.message) + '</p>'
        + '<button class="btn-primary" onclick="window.openDeepDive()">Try Again</button>'
        + '</div>';
    });
  }

  function closeDeepDive() {
    var modal = document.getElementById('modal-deep-dive');
    if (modal) modal.classList.add('hidden');
  }

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
    .then(function (res) {
      if (btn) btn.classList.add('hidden');
      aiBox.innerHTML = '<strong>JavaBot Insight:</strong> ' + esc(res.explanation);
    })
    .catch(function (e) {
      if (btn) { btn.disabled = false; btn.textContent = 'Explain My Mistake'; }
      aiBox.innerHTML = 'Could not analyze mistake: ' + esc(e.message);
    });
  }

  function formatDeepDiveMarkdown(md) {
    if (!md) return '';
    return md
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/```(?:java)?\n?([\s\S]*?)```/g, function (_, codeSnippet) {
        var unesc = codeSnippet.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. JavaBotWatcher Public Hooks (Called by app.js)
  // ─────────────────────────────────────────────────────────────────────────────
  var JavaBotWatcher = {
    isPaused: function () {
      return _isLiveWatchingPaused;
    },
    togglePause: toggleLiveWatching,
    onCodeChange: function (code) {
      triggerLiveCodeWatcher(code);
    },
    onExecutionResult: function (data) {
      if (!data) return;
      _lastCompilerError = data.compileError || '';
      _lastRuntimeError = data.runtimeError || '';
      _lastRunOutput = data.output || '';

      if (_isLiveWatchingPaused) return;

      if (_lastCompilerError) {
        var errMatch = _lastCompilerError.match(/:(\d+): error:\s*([^\n]+)/i);
        var hint = errMatch ? ('Line ' + errMatch[1] + ': ' + errMatch[2]) : 'Compilation error detected';
        showJavaBotToast('Compiler Error', hint);
      }
    },
    onTestFailure: function (data) {
      if (!data) return;
      _lastCompilerError = data.compileError || '';
      _lastTestResultSummary = data.summary || 'Tests did not pass';

      if (_isLiveWatchingPaused) return;

      // Reset socratic tier on new failure to allow tier 1 question first
      _currentSocraticTier = 1;
      showJavaBotToast('Test Case Failed', 'Would you like a Socratic hint to diagnose the issue?');
    },
    onTestSuccess: function (data) {
      _lastCompilerError = '';
      _lastRuntimeError = '';
      _currentSocraticTier = 1;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. Event Listeners & Global Attachments
  // ─────────────────────────────────────────────────────────────────────────────
  window.callAI = callAI;
  window.toggleChat = toggleChat;
  window.sendChatMessage = sendChatMessage;
  window.clearChat = clearChat;
  window.clearChatHistory = clearChat;
  window.toggleLiveWatching = toggleLiveWatching;
  window.triggerLiveCodeWatcher = triggerLiveCodeWatcher;
  window.requestSocraticHint = requestSocraticHint;
  window.translateErrorWithAI = translateErrorWithAI;
  window.reviewCodeWithAI = reviewCodeWithAI;
  window.openDiffModal = openDiffModal;
  window.closeDiffModal = closeDiffModal;
  window.applyDiffSuggestion = applyDiffSuggestion;
  window.openLearnerMemoryModal = openLearnerMemoryModal;
  window.closeLearnerMemoryModal = closeLearnerMemoryModal;
  window.clearLearnerMemory = clearLearnerMemory;
  window.renderLearnerMemoryUI = renderLearnerMemoryUI;
  window.dismissJavaBotToast = dismissJavaBotToast;
  window.generateAIQuiz = generateAIQuiz;
  window.startAIChallengeFromModal = startAIChallengeFromModal;
  window.openDeepDive = openDeepDive;
  window.closeDeepDive = closeDeepDive;
  window.explainMistakeWithAI = explainMistakeWithAI;
  window.JavaBotWatcher = JavaBotWatcher;

  // Initialize UI buttons once DOM is loaded
  function initTutorUI() {
    updateWatcherUI();

    var fab = document.getElementById('ai-chat-fab');
    if (fab && !fab._hasAiListener) {
      fab._hasAiListener = true;
      fab.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleChat();
      });
    }

    var closeBtn = document.getElementById('chat-close-btn');
    if (closeBtn && !closeBtn._hasAiListener) {
      closeBtn._hasAiListener = true;
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleChat(false);
      });
    }

    var clearBtn = document.getElementById('chat-clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearChat);

    var sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);

    var chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendChatMessage();
        }
      });
    }

    var chipReview = document.getElementById('chip-review-code');
    if (chipReview) chipReview.addEventListener('click', reviewCodeWithAI);

    var chipError = document.getElementById('chip-explain-error');
    if (chipError) chipError.addEventListener('click', function () { translateErrorWithAI(); });

    var chipNext = document.getElementById('chip-next-step');
    if (chipNext) chipNext.addEventListener('click', function () { requestSocraticHint(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTutorUI);
  } else {
    initTutorUI();
  }

})();
