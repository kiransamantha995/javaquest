// JavaQuest — lib/game-fx.js
// Game-feel feedback: Web Audio API synthesis, XP Orbs particle physics,
// JavaBot Mascot Companion, and Trophy Room Silhouette generator.
// 100% original pixel art, 0 external asset files.

(function() {
  'use strict';

  // ── 1. Web Audio API Synthesizer (Optional, Off by default) ─────────────────
  var _audioCtx = null;
  function getAudioContext() {
    if (!_audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      _audioCtx = new AudioContextClass();
    }
    if (_audioCtx && _audioCtx.state === 'suspended') {
      _audioCtx.resume();
    }
    return _audioCtx;
  }

  function isSoundEnabled() {
    try {
      return localStorage.getItem('jq_sound_enabled') === 'true';
    } catch (e) {
      return false;
    }
  }

  function toggleSoundEffects(enabled) {
    try {
      localStorage.setItem('jq_sound_enabled', enabled ? 'true' : 'false');
    } catch (e) {}
    if (enabled) playXpPop();
  }

  // XP Pop (Sweet ascending chime)
  function playXpPop() {
    if (!isSoundEnabled()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.22);
    });
  }

  // Block Break (Passing punchy test thud)
  function playBlockBreak() {
    if (!isSoundEnabled()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Gentle Oops (Soft filtered puff)
  function playGentleOops() {
    if (!isSoundEnabled()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.18);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Level Up Fanfare (Arpeggiated retro square)
  function playLevelUp() {
    if (!isSoundEnabled()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    var now = ctx.currentTime;
    notes.forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gain.gain.setValueAtTime(0.05, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.3);
    });
  }

  // ── 2. XP Orbs Arc Animation ────────────────────────────────────────────────
  function flyXpOrbs(sourceEl, count) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    var orbCount = count || 5;
    var startX = window.innerWidth / 2;
    var startY = window.innerHeight / 2;

    if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
      var rect = sourceEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    var targetEl = document.getElementById('nav-xp') || document.getElementById('hud-xp-val');
    var targetX = 120;
    var targetY = 30;
    if (targetEl) {
      var tRect = targetEl.getBoundingClientRect();
      targetX = tRect.left + tRect.width / 2;
      targetY = tRect.top + tRect.height / 2;
    }

    for (var i = 0; i < orbCount; i++) {
      createSingleOrb(startX, startY, targetX, targetY, i * 60);
    }
  }

  function createSingleOrb(x1, y1, x2, y2, delay) {
    setTimeout(function() {
      var orb = document.createElement('div');
      orb.className = 'game-xp-orb';
      orb.style.left = x1 + 'px';
      orb.style.top = y1 + 'px';

      // Random jitter burst before flying
      var angle = Math.random() * Math.PI * 2;
      var dist = 30 + Math.random() * 40;
      var midX = x1 + Math.cos(angle) * dist;
      var midY = y1 + Math.sin(angle) * dist - 20;

      document.body.appendChild(orb);

      orb.animate([
        { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
        { transform: 'translate(' + (midX - x1) + 'px, ' + (midY - y1) + 'px) scale(1.2)', opacity: 1, offset: 0.3 },
        { transform: 'translate(' + (x2 - x1) + 'px, ' + (y2 - y1) + 'px) scale(0.4)', opacity: 0 }
      ], {
        duration: 750,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      }).onfinish = function() {
        if (orb.parentNode) orb.parentNode.removeChild(orb);
        playXpPop();
      };
    }, delay);
  }

  // ── 3. Original JavaBot Mascot Companion ────────────────────────────────────
  var _mascotEl = null;
  var _mascotIdleTimer = null;

  function initJavaBotMascot() {
    if (document.getElementById('javabot-mascot')) return;

    var wrap = document.createElement('div');
    wrap.id = 'javabot-mascot';
    wrap.className = 'javabot-mascot';
    wrap.title = 'JavaBot Companion (Click for tips)';

    wrap.innerHTML = '<div class="mascot-bubble hidden" id="mascot-bubble">Hello Adventurer! Ready to code?</div>'
      + '<div class="mascot-avatar" id="mascot-avatar">'
      + '<svg viewBox="0 0 32 32" width="48" height="48" class="mascot-svg">'
      + '<!-- Original Robot Head -->'
      + '<rect x="6" y="8" width="20" height="18" fill="#18181B" rx="3"/>'
      + '<rect x="8" y="10" width="16" height="14" fill="#FFE600" rx="2"/>'
      + '<!-- Screen Eyes -->'
      + '<rect x="10" y="13" width="4" height="4" fill="#18181B" class="mascot-eye-l"/>'
      + '<rect x="18" y="13" width="4" height="4" fill="#18181B" class="mascot-eye-r"/>'
      + '<!-- Smile -->'
      + '<rect x="13" y="19" width="6" height="2" fill="#18181B"/>'
      + '<!-- Coffee Mug Antenna -->'
      + '<rect x="15" y="3" width="2" height="5" fill="#38BDF8"/>'
      + '<rect x="12" y="1" width="8" height="3" fill="#10B981" rx="1"/>'
      + '<path d="M20 2 h2 v2 h-2 z" fill="#10B981"/>'
      + '</svg>'
      + '</div>';

    document.body.appendChild(wrap);
    _mascotEl = wrap;

    wrap.onclick = function() {
      mascotSay('Keep exploring! Every bug is a chance to learn how the JVM thinks!');
      mascotReact('bounce');
    };

    resetMascotIdleTimer();
    document.addEventListener('mousemove', resetMascotIdleTimer, { passive: true });
    document.addEventListener('keydown', resetMascotIdleTimer, { passive: true });
  }

  function mascotReact(action) {
    if (!_mascotEl) return;
    var av = document.getElementById('mascot-avatar');
    if (!av) return;
    av.classList.remove('bounce', 'shake', 'nod');
    void av.offsetWidth; // trigger reflow
    av.classList.add(action || 'bounce');
  }

  function mascotSay(text, duration) {
    var bubble = document.getElementById('mascot-bubble');
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.remove('hidden');
    clearTimeout(bubble._timer);
    bubble._timer = setTimeout(function() {
      bubble.classList.add('hidden');
    }, duration || 4500);
  }

  function resetMascotIdleTimer() {
    clearTimeout(_mascotIdleTimer);
    _mascotIdleTimer = setTimeout(function() {
      mascotSay('Taking a breather? Review your notes or run your code to see what happens!');
      mascotReact('nod');
    }, 180000); // 3 minutes
  }

  // ── 4. Trophy Room Silhouette & Hints ────────────────────────────────────────
  function renderBadgeSilhouette(badgeSvg, hintText) {
    return '<div class="trophy-silhouette-wrap" title="' + (hintText || 'Locked Medal') + '">'
      + '<div class="badge-silhouette">' + badgeSvg + '</div>'
      + '<div class="badge-lock-overlay">'
      + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFE600" stroke-width="2.2">'
      + '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>'
      + '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
      + '</svg>'
      + '</div>'
      + '<div class="badge-unlock-hint">' + (hintText || 'Complete milestone') + '</div>'
      + '</div>';
  }

  // Export to window
  window.GameFX = {
    isSoundEnabled: isSoundEnabled,
    toggleSoundEffects: toggleSoundEffects,
    playXpPop: playXpPop,
    playBlockBreak: playBlockBreak,
    playGentleOops: playGentleOops,
    playLevelUp: playLevelUp,
    flyXpOrbs: flyXpOrbs,
    initJavaBotMascot: initJavaBotMascot,
    mascotReact: mascotReact,
    mascotSay: mascotSay,
    renderBadgeSilhouette: renderBadgeSilhouette
  };

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initJavaBotMascot, 500);
  });
})();
