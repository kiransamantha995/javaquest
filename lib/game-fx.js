// JavaQuest — lib/game-fx.js
// Game-feel feedback: Web Audio API synthesis, XP Orbs particle physics,
// Block-break debris, gentle oops puff, block confetti, and Byte Pixel Companion.
// 100% original pixel art, 0 external asset files.

(function() {
  'use strict';

  // ── 1. Web Audio API Synthesizer (Off by default) ───────────────────────────
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
    if (enabled) playClick();
  }

  // Tactile button click (soft subtle tap)
  function playClick() {
    if (!isSoundEnabled()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
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
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.07, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.2);
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
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Gentle Oops (Soft filtered puff, never harsh)
  function playGentleOops() {
    if (!isSoundEnabled()) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.18);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Level Up Fanfare (Retro square arpeggio)
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
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.05, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.28);
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ── 2. XP Orbs Arc Animation ────────────────────────────────────────────────
  function flyXpOrbs(sourceEl, count) {
    if (prefersReducedMotion()) return;
    var orbCount = count || 6;
    var startX = window.innerWidth / 2;
    var startY = window.innerHeight / 2;

    if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
      var rect = sourceEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    var targetEl = document.getElementById('nav-xp') || document.getElementById('hud-xp-val');
    var targetX = 140;
    var targetY = 30;
    if (targetEl) {
      var tRect = targetEl.getBoundingClientRect();
      targetX = tRect.left + tRect.width / 2;
      targetY = tRect.top + tRect.height / 2;
    }

    for (var i = 0; i < orbCount; i++) {
      createSingleOrb(startX, startY, targetX, targetY, i * 65);
    }
  }

  function createSingleOrb(x1, y1, x2, y2, delay) {
    setTimeout(function() {
      var orb = document.createElement('div');
      orb.className = 'game-xp-orb';
      orb.style.left = x1 + 'px';
      orb.style.top = y1 + 'px';

      var angle = Math.random() * Math.PI * 2;
      var dist = 25 + Math.random() * 45;
      var midX = x1 + Math.cos(angle) * dist;
      var midY = y1 + Math.sin(angle) * dist - 25;

      document.body.appendChild(orb);

      if (orb.animate) {
        orb.animate([
          { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
          { transform: 'translate(' + (midX - x1) + 'px, ' + (midY - y1) + 'px) scale(1.3)', opacity: 1, offset: 0.35 },
          { transform: 'translate(' + (x2 - x1) + 'px, ' + (y2 - y1) + 'px) scale(0.4)', opacity: 0 }
        ], {
          duration: 750,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
        }).onfinish = function() {
          if (orb.parentNode) orb.parentNode.removeChild(orb);
          playXpPop();
        };
      } else {
        setTimeout(function() {
          if (orb.parentNode) orb.parentNode.removeChild(orb);
        }, 750);
      }
    }, delay);
  }

  // ── 3. Block-Break Particle Burst (On Step Completion) ───────────────────────
  function triggerBlockBreak(sourceEl) {
    playBlockBreak();
    if (prefersReducedMotion()) return;

    var startX = window.innerWidth / 2;
    var startY = window.innerHeight / 2;
    if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
      var rect = sourceEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    var colors = ['#10B981', '#059669', '#34D399', '#FFE600', '#F59E0B', '#A7F3D0'];
    var count = 14;

    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'game-pixel-debris';
      p.style.backgroundColor = colors[i % colors.length];
      p.style.left = startX + 'px';
      p.style.top = startY + 'px';
      document.body.appendChild(p);

      var vx = (Math.random() - 0.5) * 160;
      var vy = - (40 + Math.random() * 120);
      var rot = (Math.random() - 0.5) * 360;

      if (p.animate) {
        p.animate([
          { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + vx + 'px, ' + vy + 'px) scale(0.9) rotate(' + (rot * 0.5) + 'deg)', opacity: 0.9, offset: 0.4 },
          { transform: 'translate(' + (vx * 1.3) + 'px, ' + (vy + 180) + 'px) scale(0.2) rotate(' + rot + 'deg)', opacity: 0 }
        ], {
          duration: 650 + Math.random() * 200,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = (function(el) {
          return function() {
            if (el.parentNode) el.parentNode.removeChild(el);
          };
        })(p);
      } else {
        setTimeout((function(el) {
          return function() { if (el.parentNode) el.parentNode.removeChild(el); };
        })(p), 800);
      }
    }
  }

  // ── 4. Gentle Oops Wobble & Smoke Puff (On Test Failure) ─────────────────────
  function triggerOopsFeedback(targetEl) {
    playGentleOops();
    if (mascotScratchHead) mascotScratchHead();

    if (targetEl) {
      targetEl.classList.remove('game-oops-wobble');
      void targetEl.offsetWidth; // trigger reflow
      targetEl.classList.add('game-oops-wobble');
      setTimeout(function() {
        targetEl.classList.remove('game-oops-wobble');
      }, 500);
    }

    if (prefersReducedMotion()) return;

    var startX = window.innerWidth / 2;
    var startY = window.innerHeight / 2;
    if (targetEl && typeof targetEl.getBoundingClientRect === 'function') {
      var rect = targetEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 3;
    }

    // 4 small soft smoke puffs
    for (var i = 0; i < 4; i++) {
      var puff = document.createElement('div');
      puff.className = 'game-smoke-puff';
      puff.style.left = (startX + (i - 1.5) * 16) + 'px';
      puff.style.top = startY + 'px';
      document.body.appendChild(puff);

      if (puff.animate) {
        var dx = (Math.random() - 0.5) * 30;
        var dy = - (30 + Math.random() * 40);
        puff.animate([
          { transform: 'translate(0, 0) scale(0.4)', opacity: 0.7 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(1.4)', opacity: 0 }
        ], {
          duration: 500 + i * 80,
          easing: 'ease-out'
        }).onfinish = (function(el) {
          return function() {
            if (el.parentNode) el.parentNode.removeChild(el);
          };
        })(puff);
      } else {
        setTimeout((function(el) {
          return function() { if (el.parentNode) el.parentNode.removeChild(el); };
        })(puff), 600);
      }
    }
  }

  // ── 5. Block Confetti on Module Completion ──────────────────────────────────
  function triggerBlockConfetti() {
    playLevelUp();
    if (prefersReducedMotion()) return;

    var count = 40;
    var colors = ['#FFE600', '#10B981', '#38BDF8', '#8B5CF6', '#F59E0B', '#EF4444'];
    var width = window.innerWidth;

    for (var i = 0; i < count; i++) {
      var c = document.createElement('div');
      c.className = 'game-block-confetti';
      c.style.backgroundColor = colors[i % colors.length];
      var startX = Math.random() * width;
      c.style.left = startX + 'px';
      c.style.top = '-20px';
      document.body.appendChild(c);

      var drift = (Math.random() - 0.5) * 200;
      var rot = (Math.random() - 0.5) * 720;
      var fallDist = window.innerHeight + 40;

      if (c.animate) {
        c.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + drift + 'px, ' + fallDist + 'px) rotate(' + rot + 'deg)', opacity: 0.8 }
        ], {
          duration: 1800 + Math.random() * 1200,
          delay: Math.random() * 400,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = (function(el) {
          return function() {
            if (el.parentNode) el.parentNode.removeChild(el);
          };
        })(c);
      } else {
        setTimeout((function(el) {
          return function() { if (el.parentNode) el.parentNode.removeChild(el); };
        })(c), 3000);
      }
    }
  }

  // ── 6. Mascot Companion Removed (Per user request: clean floating UI) ──
  function initJavaBotMascot() {}
  function mascotReact() {}
  function mascotSay() {}
  function mascotCelebrate() {}
  function mascotScratchHead() {}

  // ── 7. Trophy Room Silhouette & Hints ────────────────────────────────────────
  function renderBadgeSilhouette(badgeSvg, hintText) {
    return '<div class="trophy-silhouette-wrap" title="' + (hintText || 'Locked Medal') + '">'
      + '<div class="badge-silhouette">' + badgeSvg + '</div>'
      + '<div class="badge-lock-overlay">'
      + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFE600" stroke-width="2.2">'
      + '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>'
      + '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
      + '</svg>'
      + '</div>'
      + '<div class="badge-unlock-hint">' + (hintText || 'Complete milestone to unlock') + '</div>'
      + '</div>';
  }

  // Export to window
  window.GameFX = {
    isSoundEnabled: isSoundEnabled,
    toggleSoundEffects: toggleSoundEffects,
    playClick: playClick,
    playXpPop: playXpPop,
    playBlockBreak: playBlockBreak,
    playGentleOops: playGentleOops,
    playLevelUp: playLevelUp,
    flyXpOrbs: flyXpOrbs,
    triggerBlockBreak: triggerBlockBreak,
    triggerOopsFeedback: triggerOopsFeedback,
    triggerBlockConfetti: triggerBlockConfetti,
    initJavaBotMascot: initJavaBotMascot,
    mascotReact: mascotReact,
    mascotSay: mascotSay,
    mascotCelebrate: mascotCelebrate,
    mascotScratchHead: mascotScratchHead,
    renderBadgeSilhouette: renderBadgeSilhouette
  };

  
})();
