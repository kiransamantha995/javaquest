// JavaQst — js/meowger.js
// Apple-Inspired Digital Pet Host & Interactive AI Companion "Meowger" 2.0
// Zero emojis — 100% pure inline layered SVG + 2D Spring-Damper Physics Engine.
// Features: Spring locomotion, squash-stretch, articulated tail/ears/eyelids, pointer eye-tracking,
// drag-and-toss physics, zero-click head-rub purring, Treat Feeding, Laser Chase, Tricks, Focus Nap,
// Bond progression, and direct AI Tutor integration.

(function() {
  'use strict';

  var STORAGE_KEY_BOND = 'javaqst_meowger_bond_v1';
  var BOND_THRESHOLDS = [0, 10, 25, 45, 70, 100, 140, 190, 250, 320];

  // ── 1. Security & Player Profile Helpers ────────────────────────────────────
  function escMeowgerText(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  function getMeowgerLearnerName() {
    var p = (typeof getPlayerState === 'function')
      ? getPlayerState()
      : ((window.STATE && window.STATE.player) ? window.STATE.player : null);
    var n = (p && p.name) ? String(p.name).trim() : '';
    return escMeowgerText((n && n.length > 0) ? n.slice(0, 32) : 'JavaLearner');
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function loadBondXP() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_BOND);
      if (!raw) return 0;
      var parsed = JSON.parse(raw);
      var n = parseInt(parsed && parsed.xp, 10);
      return (!isNaN(n) && n >= 0 && n <= 100000) ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function saveBondXP(xp) {
    try {
      localStorage.setItem(STORAGE_KEY_BOND, JSON.stringify({ xp: Math.max(0, Math.floor(xp)) }));
    } catch (e) {}
  }

  function getBondInfo(xp) {
    var level = 1;
    var curMin = 0;
    var nextMin = BOND_THRESHOLDS[1];
    for (var i = 0; i < BOND_THRESHOLDS.length; i++) {
      if (xp >= BOND_THRESHOLDS[i]) {
        level = i + 1;
        curMin = BOND_THRESHOLDS[i];
        nextMin = (i + 1 < BOND_THRESHOLDS.length) ? BOND_THRESHOLDS[i + 1] : (curMin + 100);
      }
    }
    var pct = clamp(Math.round(((xp - curMin) / Math.max(1, nextMin - curMin)) * 100), 0, 100);
    return { level: level, xp: xp, pct: pct, isMax: level >= BOND_THRESHOLDS.length };
  }

  // ── 2. Pure SVG Micro-Icons (Zero Emoji) ────────────────────────────────────
  var SVG_ICONS = {
    chat: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 3.5h11v7.5H6l-3.5 3V3.5z"/></svg>',
    heart: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.7S2.2 10 2.2 5.9A3.2 3.2 0 0 1 8 4a3.2 3.2 0 0 1 5.8 1.9C13.8 10 8 13.7 8 13.7z"/></svg>',
    treat: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8" cy="8" rx="5.2" ry="3.8" transform="rotate(-25 8 8)"/><path d="M5.2 10.6C7 9.4 7.5 6.8 10.8 5.4"/></svg>',
    play: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>',
    trick: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><polygon points="8 1.5 9.9 5.8 14.5 6.3 11 9.5 12 14.1 8 11.7 4 14.1 5 9.5 1.5 6.3 6.1 5.8"/></svg>',
    nap: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 10.2A5 5 0 0 1 5.8 3.5a5 5 0 1 0 6.7 6.7z"/></svg>',
    wake: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 1.8v1.4M8 12.8v1.4M1.8 8h1.4M12.8 8h1.4M3.6 3.6l1 1M11.4 11.4l1 1M12.4 3.6l-1 1M4.6 11.4l-1 1"/></svg>',
    close: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="11" y2="11"/><line x1="11" y1="3" x2="3" y2="11"/></svg>',
    spark: '<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M8 1L9.6 6.4L15 8L9.6 9.6L8 15L6.4 9.6L1 8L6.4 6.4L8 1Z"/></svg>'
  };

  function getTreatSVG() {
    return (
      '<svg viewBox="0 0 32 32" width="30" height="30" xmlns="http://www.w3.org/2000/svg">'
      + '<ellipse cx="16" cy="27" rx="9" ry="2.5" fill="rgba(0,0,0,0.2)"/>'
      + '<g class="treat-body">'
      + '  <ellipse cx="16" cy="16" rx="10" ry="7.5" transform="rotate(-24 16 16)" fill="#5C3418" stroke="#18191E" stroke-width="2"/>'
      + '  <ellipse cx="14.5" cy="13.5" rx="5.5" ry="2.4" transform="rotate(-24 14.5 13.5)" fill="#8B532A"/>'
      + '  <path d="M10 21 C14.5 18.5, 16.5 13.5, 22 11" fill="none" stroke="#241308" stroke-width="2.2" stroke-linecap="round"/>'
      + '  <polygon points="24,4 25,6.5 27.5,7.5 25,8.5 24,11 23,8.5 20.5,7.5 23,6.5" fill="#FFE600" stroke="#18191E" stroke-width="0.7"/>'
      + '</g>'
      + '</svg>'
    );
  }

  // ── 3. Hand-Crafted Articulated SVG Character ───────────────────────────────
  function getMeowgerSVG() {
    return (
      '<svg class="meowger-svg" viewBox="0 0 64 64" width="68" height="68" xmlns="http://www.w3.org/2000/svg">'
      + '<!-- Ground Contact Shadow (Stays planted on floor while pet leaps) -->'
      + '<ellipse cx="32" cy="57.5" rx="15" ry="3.6" fill="rgba(11,11,14,0.22)" class="meowger-shadow"/>'

      + '<!-- Physics Rig Root (Squash & Stretch anchored at paws y=56) -->'
      + '<g class="meowger-rig">'

      + '  <!-- Articulated 3-Segment Tabby Tail -->'
      + '  <g class="meowger-tail-base">'
      + '    <rect x="40" y="42" width="7" height="4.5" rx="2.2" fill="#9E5624" stroke="#18191E" stroke-width="1.1"/>'
      + '    <g class="meowger-tail-mid">'
      + '      <rect x="44" y="36.5" width="5.5" height="8" rx="2.7" fill="#BD6F36" stroke="#18191E" stroke-width="1.1"/>'
      + '      <rect x="45.2" y="39.5" width="3.2" height="2" rx="0.8" fill="#88461B"/>'
      + '      <g class="meowger-tail-tip">'
      + '        <rect x="43" y="29" width="5.2" height="9" rx="2.6" fill="#CF8545" stroke="#18191E" stroke-width="1.1"/>'
      + '        <rect x="43" y="28.6" width="5.2" height="4.2" rx="2.1" fill="#FFE600" stroke="#18191E" stroke-width="1"/>'
      + '      </g>'
      + '    </g>'
      + '  </g>'

      + '  <!-- Back / Front Articulated Paws -->'
      + '  <g class="meowger-paws">'
      + '    <g class="meowger-leg-l">'
      + '      <rect x="20" y="49" width="7.5" height="7" rx="3.2" fill="#FAF7EE" stroke="#18191E" stroke-width="1.3"/>'
      + '      <line x1="22.5" y1="53.5" x2="22.5" y2="55.8" stroke="#18191E" stroke-width="1" stroke-linecap="round"/>'
      + '      <line x1="25" y1="53.5" x2="25" y2="55.8" stroke="#18191E" stroke-width="1" stroke-linecap="round"/>'
      + '      <circle cx="23.8" cy="52" r="1.4" fill="#F4A4B8" class="paw-pad"/>'
      + '    </g>'
      + '    <g class="meowger-leg-r">'
      + '      <rect x="36.5" y="49" width="7.5" height="7" rx="3.2" fill="#FAF7EE" stroke="#18191E" stroke-width="1.3"/>'
      + '      <line x1="39" y1="53.5" x2="39" y2="55.8" stroke="#18191E" stroke-width="1" stroke-linecap="round"/>'
      + '      <line x1="41.5" y1="53.5" x2="41.5" y2="55.8" stroke="#18191E" stroke-width="1" stroke-linecap="round"/>'
      + '      <circle cx="40.2" cy="52" r="1.4" fill="#F4A4B8" class="paw-pad"/>'
      + '    </g>'
      + '  </g>'

      + '  <!-- Obsidian JavaQst Hoodie Torso -->'
      + '  <g class="meowger-torso">'
      + '    <rect x="18" y="34" width="28" height="17" rx="5.5" fill="#1A1C24" stroke="#0B0B0E" stroke-width="1.4"/>'
      + '    <!-- Subtle Apple-style edge sheen highlight -->'
      + '    <path d="M21 36.5 Q32 35 43 36.5" fill="none" stroke="#303443" stroke-width="1.5" stroke-linecap="round"/>'
      + '    <!-- Kangaroo Hoodie Pocket -->'
      + '    <path d="M23 44.5 H41 L42.5 49.5 H21.5 Z" fill="#232631" stroke="#0B0B0E" stroke-width="1"/>'
      + '    <!-- Bright JavaQst Collar & Chest Tag -->'
      + '    <rect x="25" y="34" width="14" height="3.2" rx="1.4" fill="#FFE600" stroke="#0B0B0E" stroke-width="1"/>'
      + '    <!-- Hoodie Drawstrings -->'
      + '    <g class="meowger-cords">'
      + '      <line x1="28.5" y1="37" x2="28" y2="42.5" stroke="#FFE600" stroke-width="1.5" stroke-linecap="round" class="cord-l"/>'
      + '      <line x1="35.5" y1="37" x2="36" y2="42.5" stroke="#FFE600" stroke-width="1.5" stroke-linecap="round" class="cord-r"/>'
      + '    </g>'
      + '    <!-- Micro < > Chest Emblem -->'
      + '    <polyline points="29.8,45.8 28,47.2 29.8,48.6" fill="none" stroke="#FFE600" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>'
      + '    <polyline points="34.2,45.8 36,47.2 34.2,48.6" fill="none" stroke="#FFE600" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>'
      + '  </g>'

      + '  <!-- Gesture Wave / Grooming Front Paw -->'
      + '  <g class="meowger-wave-paw" style="opacity:0">'
      + '    <rect x="13" y="31" width="7" height="9" rx="3.5" fill="#FAF7EE" stroke="#18191E" stroke-width="1.3"/>'
      + '    <circle cx="16.5" cy="34.2" r="1.5" fill="#F4A4B8"/>'
      + '  </g>'

      + '  <!-- Articulated Feline Head Group -->'
      + '  <g class="meowger-head">'
      + '    <!-- Left Ear (pivots around base) -->'
      + '    <g class="meowger-ear-l">'
      + '      <polygon points="15,23 18.5,8.5 27.5,19" fill="#9E5624" stroke="#18191E" stroke-width="1.3" stroke-linejoin="round"/>'
      + '      <polygon points="17.5,21 19.6,12.2 25,18.8" fill="#F7B2C4"/>'
      + '      <path d="M19 19 L21 16" stroke="#FFF8E3" stroke-width="1.1" stroke-linecap="round"/>'
      + '    </g>'
      + '    <!-- Right Ear (pivots around base) -->'
      + '    <g class="meowger-ear-r">'
      + '      <polygon points="36.5,19 45.5,8.5 49,23" fill="#9E5624" stroke="#18191E" stroke-width="1.3" stroke-linejoin="round"/>'
      + '      <polygon points="39,18.8 44.4,12.2 46.5,21" fill="#F7B2C4"/>'
      + '      <path d="M45 19 L43 16" stroke="#FFF8E3" stroke-width="1.1" stroke-linecap="round"/>'
      + '    </g>'

      + '    <!-- Cheek Fur Fluff -->'
      + '    <polygon points="12,26 16,23.5 16,32.5 11.5,30" fill="#B87333" stroke="#18191E" stroke-width="1.2" stroke-linejoin="round"/>'
      + '    <polygon points="52,26 48,23.5 48,32.5 52.5,30" fill="#B87333" stroke="#18191E" stroke-width="1.2" stroke-linejoin="round"/>'

      + '    <!-- Head Skull Base -->'
      + '    <rect x="14.5" y="16.5" width="35" height="20.5" rx="8.5" fill="#B87333" stroke="#18191E" stroke-width="1.4"/>'
      + '    <!-- Top Caramel Fur Crown Highlight -->'
      + '    <path d="M21 18.2 H43" stroke="#D38D4F" stroke-width="2.4" stroke-linecap="round"/>'
      + '    <!-- Forehead Tabby Stripes -->'
      + '    <rect x="31" y="17.2" width="2" height="4.2" rx="1" fill="#88461B"/>'
      + '    <rect x="27.2" y="17.5" width="1.8" height="3.2" rx="0.9" fill="#88461B"/>'
      + '    <rect x="35" y="17.5" width="1.8" height="3.2" rx="0.9" fill="#88461B"/>'

      + '    <!-- Cream Muzzle & Whiskers -->'
      + '    <rect x="24.5" y="26.5" width="15" height="8.5" rx="4.2" fill="#FFF8E3"/>'
      + '    <!-- Rosy Cheek Blush (fades in smoothly when petted/happy) -->'
      + '    <g class="meowger-blush" style="opacity:0">'
      + '      <ellipse cx="19.5" cy="29.2" rx="2.8" ry="1.6" fill="#FB7185"/>'
      + '      <ellipse cx="44.5" cy="29.2" rx="2.8" ry="1.6" fill="#FB7185"/>'
      + '    </g>'

      + '    <!-- Delicate Whisker Rig -->'
      + '    <g class="meowger-whiskers" stroke="#241914" stroke-width="1.15" stroke-linecap="round" opacity="0.72">'
      + '      <line x1="9" y1="27" x2="18.5" y2="28.2"/>'
      + '      <line x1="9.5" y1="30.5" x2="18.5" y2="30.2"/>'
      + '      <line x1="45.5" y1="28.2" x2="55" y2="27"/>'
      + '      <line x1="45.5" y1="30.2" x2="54.5" y2="30.5"/>'
      + '    </g>'

      + '    <!-- Coral Triangular Nose -->'
      + '    <polygon points="30.4,28 33.6,28 32,30.2" fill="#E87990" stroke="#18191E" stroke-width="0.7" stroke-linejoin="round"/>'

      + '    <!-- Expressive Mouth Variants -->'
      + '    <g class="meowger-mouth">'
      + '      <path class="mouth-smile" d="M29.2,31.2 Q30.6,32.7 32,31.1 Q33.4,32.7 34.8,31.2" fill="none" stroke="#18191E" stroke-width="1.25" stroke-linecap="round"/>'
      + '      <ellipse class="mouth-meow" cx="32" cy="32" rx="2" ry="1.7" fill="#991B1B" stroke="#18191E" stroke-width="1" style="display:none"/>'
      + '      <ellipse class="mouth-munch" cx="32" cy="31.8" rx="2.4" ry="1.4" fill="#F59E0B" stroke="#18191E" stroke-width="1" style="display:none"/>'
      + '      <path class="mouth-oops" d="M29.5,32.4 Q32,30.6 34.5,32.4" fill="none" stroke="#18191E" stroke-width="1.3" stroke-linecap="round" style="display:none"/>'
      + '    </g>'

      + '    <!-- Multi-Expression Eyes System -->'
      + '    <g class="meowger-eyes">'
      + '      <!-- Normal / Tracked Eyes + Eyelids -->'
      + '      <g class="eye-mode-normal">'
      + '        <rect x="19.5" y="21" width="6.4" height="6.8" rx="3" fill="#15161B" class="eye-bg-l"/>'
      + '        <rect x="20.6" y="25.8" width="4.2" height="1.3" rx="0.6" fill="#925429" opacity="0.65"/>'
      + '        <circle cx="23.4" cy="23.1" r="1.45" fill="#FFFFFF" class="pupil-main-l"/>'
      + '        <circle cx="21.4" cy="25.2" r="0.65" fill="#FFFFFF" opacity="0.8" class="pupil-sub-l"/>'
      + '        <rect x="19" y="20.5" width="7.4" height="0" rx="1.5" fill="#B87333" class="eyelid-l"/>'

      + '        <rect x="38.1" y="21" width="6.4" height="6.8" rx="3" fill="#15161B" class="eye-bg-r"/>'
      + '        <rect x="39.2" y="25.8" width="4.2" height="1.3" rx="0.6" fill="#925429" opacity="0.65"/>'
      + '        <circle cx="42.0" cy="23.1" r="1.45" fill="#FFFFFF" class="pupil-main-r"/>'
      + '        <circle cx="40.0" cy="25.2" r="0.65" fill="#FFFFFF" opacity="0.8" class="pupil-sub-r"/>'
      + '        <rect x="37.6" y="20.5" width="7.4" height="0" rx="1.5" fill="#B87333" class="eyelid-r"/>'
      + '      </g>'

      + '      <!-- Happy Purr Arches (^ ^) -->'
      + '      <g class="eye-mode-happy" style="display:none" stroke="#15161B" stroke-width="2.1" fill="none" stroke-linecap="round">'
      + '        <path d="M19.5,25.5 Q22.7,21 25.9,25.5"/>'
      + '        <path d="M38.1,25.5 Q41.3,21 44.5,25.5"/>'
      + '      </g>'

      + '      <!-- Peaceful Sleep Lids (U U) -->'
      + '      <g class="eye-mode-sleep" style="display:none" stroke="#15161B" stroke-width="1.9" fill="none" stroke-linecap="round">'
      + '        <path d="M19.5,24.5 Q22.7,27.5 25.9,24.5"/>'
      + '        <path d="M38.1,24.5 Q41.3,27.5 44.5,24.5"/>'
      + '      </g>'

      + '      <!-- Oops / Empathetic Squint (> <) -->'
      + '      <g class="eye-mode-oops" style="display:none" stroke="#15161B" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '        <polyline points="20.2,22 25.2,24.5 20.2,27"/>'
      + '        <polyline points="43.8,22 38.8,24.5 43.8,27"/>'
      + '      </g>'

      + '      <!-- Excited Wide Sparkle Eyes (Snack / Laser Chase) -->'
      + '      <g class="eye-mode-excited" style="display:none">'
      + '        <circle cx="22.7" cy="24.2" r="3.9" fill="#15161B"/>'
      + '        <circle cx="23.8" cy="22.7" r="1.55" fill="#FFFFFF"/>'
      + '        <circle cx="21.4" cy="25.6" r="0.8" fill="#FFE600"/>'
      + '        <circle cx="41.3" cy="24.2" r="3.9" fill="#15161B"/>'
      + '        <circle cx="42.4" cy="22.7" r="1.55" fill="#FFFFFF"/>'
      + '        <circle cx="40.0" cy="25.6" r="0.8" fill="#FFE600"/>'
      + '      </g>'
      + '    </g>'
      + '  </g>'
      + '</g>'

      + '<!-- Minimalist Vector FX Overlay Layer -->'
      + '<g class="meowger-fx">'
      + '  <!-- Heart Accent -->'
      + '  <g class="fx-heart" style="display:none">'
      + '    <path d="M32,10.5 C30,8 26.5,8.5 26.5,11.5 C26.5,14.5 32,17.8 32,17.8 C32,17.8 37.5,14.5 37.5,11.5 C37.5,8.5 34,8 32,10.5 Z" fill="#F43F5E" stroke="#18191E" stroke-width="0.9"/>'
      + '  </g>'
      + '  <!-- 4-Point Apple Sparkles -->'
      + '  <g class="fx-sparkles" style="display:none">'
      + '    <path d="M13,9 L14,12 L17,13 L14,14 L13,17 L12,14 L9,13 L12,12 Z" fill="#FFE600" stroke="#18191E" stroke-width="0.6"/>'
      + '    <path d="M51,10 L51.8,12.4 L54,13.2 L51.8,14 L51,16.4 L50.2,14 L48,13.2 L50.2,12.4 Z" fill="#10B981" stroke="#18191E" stroke-width="0.5"/>'
      + '  </g>'
      + '  <!-- Soft Acoustic Purr Arcs -->'
      + '  <g class="fx-purr-waves" style="display:none" fill="none" stroke="#F43F5E" stroke-width="1.3" stroke-linecap="round">'
      + '    <path d="M7.5,24 C6,26.5 6,29.5 7.5,32"/>'
      + '    <path d="M56.5,24 C58,26.5 58,29.5 56.5,32"/>'
      + '  </g>'
      + '  <!-- AI Thinking Orbit Dots -->'
      + '  <g class="fx-think-dots" style="display:none">'
      + '    <circle cx="25" cy="6.5" r="2.1" fill="#FFE600" stroke="#18191E" stroke-width="0.7" class="think-dot-1"/>'
      + '    <circle cx="32" cy="5.0" r="2.3" fill="#38BDF8" stroke="#18191E" stroke-width="0.7" class="think-dot-2"/>'
      + '    <circle cx="39" cy="6.5" r="2.1" fill="#10B981" stroke="#18191E" stroke-width="0.7" class="think-dot-3"/>'
      + '  </g>'
      + '  <!-- Vector Sleep Z Glyphs (Zero Emoji) -->'
      + '  <g class="fx-sleep-z" style="display:none" fill="none" stroke="#60A5FA" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
      + '    <polyline class="sleep-z-1" points="45,17 49.5,17 45,21.5 49.5,21.5"/>'
      + '    <polyline class="sleep-z-2" points="51,10 56.5,10 51,15.5 56.5,15.5"/>'
      + '  </g>'
      + '</g>'
      + '</svg>'
    );
  }

  // ── 4. Meowger Companion Class (2D Spring Engine + Interactive Pet) ─────────
  function MeowgerCompanion() {
    this.el = null;
    this.spriteBox = null;
    this.svg = null;
    this.bubbleEl = null;
    this.dockEl = null;

    // Spatial coordinates (top-left of 68x68 wrap)
    this.x = 80;
    this.y = 80;
    this.targetX = 80;
    this.targetY = 80;
    this.vx = 0;
    this.vy = 0;
    this.userPinnedPos = null;

    // Vertical Jump / Levitation physics (z >= 0 above floor)
    this.z = 0;
    this.vz = 0;
    this.targetZ = 0;

    // Volume-preserving Squash & Stretch Spring
    this.sx = 1;
    this.sy = 1;
    this.svx = 0;
    this.svy = 0;

    // Body velocity tilt & spin trick angle
    this.tilt = 0;
    this.spinAngle = 0;
    this.spinTarget = 0;

    // Articulation cycles
    this.facing = -1;
    this.walkPhase = 0;
    this.idleClock = 0;
    this.headTilt = 0;
    this.headTiltTarget = 0;
    this.earTwitchL = 0;
    this.earTwitchR = 0;
    this.tailFreq = 2.1;
    this.blushAlpha = 0;

    // States: 'idle' | 'walk' | 'purr' | 'excited' | 'oops' | 'nap' | 'thinking' | 'carried' | 'pounce'
    this.mood = 'idle';
    this.activeScreen = 'auth';
    this.dockOpen = false;
    this.isThinking = false;
    this.isSleeping = false;
    this.isChasingLaser = false;
    this.isDragging = false;
    this.justDragged = false;
    this.treatActive = null;

    // Pointer & Pet-Rub tracking
    this.pointerDown = false;
    this.dragMoved = false;
    this.dragStart = { px: 0, py: 0, ox: 0, oy: 0 };
    this.lastDragSamples = [];
    this.mousePos = { x: 0, y: 0, inside: false };
    this.rubTrack = { lastDir: 0, lastX: 0, reversals: 0, windowStart: 0 };

    // Timers & Bond progression
    this.bondXP = loadBondXP();
    this.lastInteractionTime = Date.now();
    this.nextBlinkAt = performance.now() + 2600;
    this.nextIdleActionAt = performance.now() + 4500;
    this.bubbleTimeout = null;
    this.moodResetTimeout = null;
    this.chaseTimeout = null;
    this.laserEl = null;
    this.laserPos = { x: 0, y: 0, lastMove: 0 };
    this.laserPounceCount = 0;

    this.dockedOnMobile = window.innerWidth <= 640;
    this.rafId = null;
    this.lastFrameTime = performance.now();
    this._lastWanderAt = Date.now();
    this.lastAutoGreeted = false;

    this.init();
  }

  MeowgerCompanion.prototype.init = function() {
    var self = this;
    if (document.getElementById('meowger-pet-wrap')) return;

    var wrap = document.createElement('div');
    wrap.id = 'meowger-pet-wrap';
    wrap.className = 'meowger-pet-wrap';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', 'Meowger Digital Pet. Click for Pet Menu, Double-Click for AI Tutor, or Drag to move.');

    // Speech Bubble
    var bubble = document.createElement('div');
    bubble.className = 'meowger-speech-bubble hidden';
    bubble.id = 'meowger-speech-bubble';
    wrap.appendChild(bubble);

    // Apple Frosted Companion Dock
    var dock = document.createElement('div');
    dock.className = 'meowger-dock hidden';
    dock.id = 'meowger-dock';
    dock.setAttribute('role', 'dialog');
    dock.setAttribute('aria-label', 'Meowger Interactive Actions');
    dock.innerHTML = self.buildDockHTML();
    wrap.appendChild(dock);

    // Articulated Sprite Stage
    var sprite = document.createElement('div');
    sprite.className = 'meowger-sprite-box facing-left';
    sprite.innerHTML = getMeowgerSVG();
    wrap.appendChild(sprite);

    document.body.appendChild(wrap);

    this.el = wrap;
    this.spriteBox = sprite;
    this.svg = sprite.querySelector('.meowger-svg');
    this.bubbleEl = bubble;
    this.dockEl = dock;

    // Respect auth screen visibility on initial boot before showScreen runs
    var authScreen = document.getElementById('screen-auth');
    if (!authScreen || authScreen.classList.contains('active')) {
      wrap.style.display = 'none';
      this.activeScreen = 'auth';
    } else {
      this.activeScreen = 'home';
    }

    this.setInitialPosition();
    this.cacheSVGNodes();
    this.bindEvents();
    this.refreshDockUI();
    this.startLoop();
  };

  MeowgerCompanion.prototype.cacheSVGNodes = function() {
    if (!this.svg) return;
    this.nodes = {
      shadow: this.svg.querySelector('.meowger-shadow'),
      rig: this.svg.querySelector('.meowger-rig'),
      tailBase: this.svg.querySelector('.meowger-tail-base'),
      tailMid: this.svg.querySelector('.meowger-tail-mid'),
      tailTip: this.svg.querySelector('.meowger-tail-tip'),
      legL: this.svg.querySelector('.meowger-leg-l'),
      legR: this.svg.querySelector('.meowger-leg-r'),
      cordL: this.svg.querySelector('.cord-l'),
      cordR: this.svg.querySelector('.cord-r'),
      wavePaw: this.svg.querySelector('.meowger-wave-paw'),
      head: this.svg.querySelector('.meowger-head'),
      earL: this.svg.querySelector('.meowger-ear-l'),
      earR: this.svg.querySelector('.meowger-ear-r'),
      blush: this.svg.querySelector('.meowger-blush'),
      pupilMainL: this.svg.querySelector('.pupil-main-l'),
      pupilMainR: this.svg.querySelector('.pupil-main-r'),
      pupilSubL: this.svg.querySelector('.pupil-sub-l'),
      pupilSubR: this.svg.querySelector('.pupil-sub-r'),
      eyelidL: this.svg.querySelector('.eyelid-l'),
      eyelidR: this.svg.querySelector('.eyelid-r'),
      eyeNormal: this.svg.querySelector('.eye-mode-normal'),
      eyeHappy: this.svg.querySelector('.eye-mode-happy'),
      eyeSleep: this.svg.querySelector('.eye-mode-sleep'),
      eyeOops: this.svg.querySelector('.eye-mode-oops'),
      eyeExcited: this.svg.querySelector('.eye-mode-excited'),
      mouthSmile: this.svg.querySelector('.mouth-smile'),
      mouthMeow: this.svg.querySelector('.mouth-meow'),
      mouthMunch: this.svg.querySelector('.mouth-munch'),
      mouthOops: this.svg.querySelector('.mouth-oops'),
      fxHeart: this.svg.querySelector('.fx-heart'),
      fxSparkles: this.svg.querySelector('.fx-sparkles'),
      fxPurrWaves: this.svg.querySelector('.fx-purr-waves'),
      fxThinkDots: this.svg.querySelector('.fx-think-dots'),
      fxSleepZ: this.svg.querySelector('.fx-sleep-z')
    };
  };

  MeowgerCompanion.prototype.buildDockHTML = function() {
    return (
      '<div class="meowger-dock-head">'
      + '  <div class="meowger-mood-row">'
      + '    <span class="meowger-status-dot" id="meowger-status-dot"></span>'
      + '    <span class="meowger-mood-label" id="meowger-mood-label">Curious</span>'
      + '  </div>'
      + '  <div class="meowger-bond-wrap" title="Bond Level grows as you care for Meowger and solve Java challenges">'
      + '    <span class="meowger-bond-lvl" id="meowger-bond-lvl">Bond 1</span>'
      + '    <span class="meowger-bond-track"><span class="meowger-bond-fill" id="meowger-bond-fill" style="width:0%"></span></span>'
      + '  </div>'
      + '</div>'
      + '<button type="button" class="meowger-primary-btn" data-action="chat">'
      + '  <span class="btn-svg">' + SVG_ICONS.chat + '</span>'
      + '  <span>Ask Meowger AI</span>'
      + '</button>'
      + '<div class="meowger-actions-grid">'
      + '  <button type="button" class="meowger-action-btn" data-action="pet" title="Pet Meowger">'
      + '    <span class="btn-svg">' + SVG_ICONS.heart + '</span><span>Pet</span>'
      + '  </button>'
      + '  <button type="button" class="meowger-action-btn" data-action="feed" title="Feed Roasted Java Bean">'
      + '    <span class="btn-svg">' + SVG_ICONS.treat + '</span><span>Treat</span>'
      + '  </button>'
      + '  <button type="button" class="meowger-action-btn" data-action="play" id="meowger-btn-play" title="Play Laser Chase">'
      + '    <span class="btn-svg">' + SVG_ICONS.play + '</span><span>Play</span>'
      + '  </button>'
      + '  <button type="button" class="meowger-action-btn" data-action="trick" title="Do a Playful Trick">'
      + '    <span class="btn-svg">' + SVG_ICONS.trick + '</span><span>Trick</span>'
      + '  </button>'
      + '  <button type="button" class="meowger-action-btn" data-action="nap" id="meowger-btn-nap" title="Toggle Quiet Nap Mode">'
      + '    <span class="btn-svg">' + SVG_ICONS.nap + '</span><span>Nap</span>'
      + '  </button>'
      + '</div>'
    );
  };

  MeowgerCompanion.prototype.bindEvents = function() {
    var self = this;

    // Dock action clicks
    this.dockEl.addEventListener('pointerdown', function(e) { e.stopPropagation(); });
    this.dockEl.addEventListener('click', function(e) {
      e.stopPropagation();
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      self.handleDockAction(btn.getAttribute('data-action'));
    });

    // Speech bubble stops accidental drags / handles interactive bubble buttons
    this.bubbleEl.addEventListener('pointerdown', function(e) { e.stopPropagation(); });
    this.bubbleEl.addEventListener('click', function(e) {
      e.stopPropagation();
      var actBtn = e.target.closest('[data-bubble-action]');
      if (actBtn) {
        var act = actBtn.getAttribute('data-bubble-action');
        self.hideBubble();
        if (act === 'explain-error' && typeof window.translateErrorWithAI === 'function') {
          window.translateErrorWithAI();
        } else if (act === 'hint' && typeof window.requestSocraticHint === 'function') {
          window.requestSocraticHint();
        } else if (act === 'open-chat' && typeof window.toggleChat === 'function') {
          window.toggleChat(true);
        }
        return;
      }
      if (e.target.closest('.bubble-close-x')) {
        self.hideBubble();
      }
    });

    // Pointer Drag & Toss on Sprite Box
    this.spriteBox.addEventListener('pointerdown', function(e) {
      if (e.button && e.button !== 0) return;
      e.stopPropagation();
      self.pointerDown = true;
      self.dragMoved = false;
      self.dragStart = {
        px: e.clientX,
        py: e.clientY,
        ox: self.x,
        oy: self.y
      };
      self.lastDragSamples = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      // Soft tactile press squish
      self.applySquash(1.12, 0.88);
    });

    window.addEventListener('pointermove', function(e) {
      self.mousePos.x = e.clientX;
      self.mousePos.y = e.clientY;
      self.mousePos.inside = true;

      if (self.isChasingLaser && self.laserEl) {
        self.updateLaserPosition(e.clientX, e.clientY);
      }

      if (self.pointerDown) {
        var dx = e.clientX - self.dragStart.px;
        var dy = e.clientY - self.dragStart.py;
        if (!self.dragMoved && Math.hypot(dx, dy) > 6) {
          self.dragMoved = true;
          self.isDragging = true;
          try { self.spriteBox.setPointerCapture(e.pointerId); } catch (err) {}
          self.hideDock();
          self.wakeFromNap(true);
          self.mood = 'carried';
          self.targetZ = 14;
          self.applySquash(0.92, 1.1);
        }
        if (self.isDragging) {
          var vw = Math.max(320, window.innerWidth || 800);
          var vh = Math.max(480, window.innerHeight || 600);
          var nx = clamp(self.dragStart.ox + dx, 12, vw - 78);
          var ny = clamp(self.dragStart.oy + dy, 60, vh - 82);
          self.vx = (nx - self.x) * 18;
          self.x = nx;
          self.y = ny;
          self.targetX = nx;
          self.targetY = ny;

          var now = performance.now();
          self.lastDragSamples.push({ x: e.clientX, y: e.clientY, t: now });
          if (self.lastDragSamples.length > 5) self.lastDragSamples.shift();
          self.updateWrapperTransform();
        }
        return;
      }

      self.checkHeadRubGesture(e.clientX, e.clientY);
    }, { passive: true });

    function finishDrag() {
      if (!self.pointerDown) return;
      self.pointerDown = false;

      if (self.isDragging) {
        self.isDragging = false;
        self.justDragged = true;
        setTimeout(function() { self.justDragged = false; }, 90);

        // Compute inertia velocity from last two pointer samples
        var samples = self.lastDragSamples;
        if (samples.length >= 2) {
          var first = samples[0];
          var last = samples[samples.length - 1];
          var dtMs = Math.max(16, last.t - first.t);
          var throwVx = ((last.x - first.x) / dtMs) * 1000 * 0.45;
          var throwVy = ((last.y - first.y) / dtMs) * 1000 * 0.45;
          self.vx = clamp(throwVx, -520, 520);
          self.vy = clamp(throwVy, -520, 520);
          self.targetX = clamp(self.x + self.vx * 0.22, 16, Math.max(320, window.innerWidth) - 82);
          self.targetY = clamp(self.y + self.vy * 0.22, 64, Math.max(480, window.innerHeight) - 84);
        }
        self.userPinnedPos = { x: self.targetX, y: self.targetY };
        self.targetZ = 0;
        self.vz = -40;
        self.mood = 'idle';
        self.refreshDockUI();
      }
    }

    window.addEventListener('pointerup', finishDrag, { passive: true });
    window.addEventListener('pointercancel', finishDrag, { passive: true });

    // Single Click toggles Companion Dock; Double Click directly opens AI Chat
    this.spriteBox.addEventListener('click', function(e) {
      e.stopPropagation();
      if (self.justDragged || self.dragMoved) return;
      self.touchInteraction();
      if (self.isSleeping) {
        self.wakeFromNap(false);
      }
      self.toggleDock();
    });

    this.spriteBox.addEventListener('dblclick', function(e) {
      e.stopPropagation();
      if (self.justDragged) return;
      self.hideDock();
      self.openAIChat();
    });

    // Keyboard Support
    this.el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self.toggleDock();
      } else if (e.key === 'Escape') {
        if (self.dockOpen) self.hideDock();
        if (self.isChasingLaser) self.stopLaserChase(false);
      }
    });

    // Outside click dismisses Companion Dock cleanly
    document.addEventListener('click', function(e) {
      if (self.dockOpen && self.el && !self.el.contains(e.target)) {
        self.hideDock();
      }
    });

    window.addEventListener('resize', function() {
      self.dockedOnMobile = window.innerWidth <= 640;
      if (self.dockedOnMobile) {
        self.dockToMobileCorner();
      } else {
        self.clampBounds();
      }
      if (self.dockOpen) self.positionDockAndBubble();
    }, { passive: true });
  };

  MeowgerCompanion.prototype.touchInteraction = function() {
    this.lastInteractionTime = Date.now();
  };

  MeowgerCompanion.prototype.checkHeadRubGesture = function(mx, my) {
    if (this.isDragging || this.isChasingLaser || this.treatActive) return;
    if (!this.el || this.el.style.display === 'none') return;

    var cx = this.x + 34;
    var cy = this.y + 26;
    if (Math.hypot(mx - cx, my - cy) > 46) {
      this.rubTrack.reversals = 0;
      this.rubTrack.lastDir = 0;
      return;
    }

    var now = performance.now();
    if (now - this.rubTrack.windowStart > 1400) {
      this.rubTrack.windowStart = now;
      this.rubTrack.reversals = 0;
      this.rubTrack.lastDir = 0;
      this.rubTrack.lastX = mx;
      return;
    }

    var dx = mx - this.rubTrack.lastX;
    if (Math.abs(dx) >= 6) {
      var dir = dx > 0 ? 1 : -1;
      if (this.rubTrack.lastDir !== 0 && dir !== this.rubTrack.lastDir) {
        this.rubTrack.reversals++;
        if (this.rubTrack.reversals >= 3) {
          this.rubTrack.reversals = 0;
          this.rubTrack.windowStart = now + 900; // cooldown inside gesture
          this.pet(true);
        }
      }
      this.rubTrack.lastDir = dir;
      this.rubTrack.lastX = mx;
    }
  };

  // ── 5. Interactive Pet Actions ──────────────────────────────────────────────
  MeowgerCompanion.prototype.handleDockAction = function(action) {
    this.touchInteraction();
    if (action === 'chat') {
      this.hideDock();
      this.openAIChat();
    } else if (action === 'pet') {
      this.pet(false);
    } else if (action === 'feed') {
      this.hideDock();
      this.dropTreat();
    } else if (action === 'play') {
      this.hideDock();
      if (this.isChasingLaser) this.stopLaserChase(true);
      else this.startLaserChase();
    } else if (action === 'trick') {
      this.hideDock();
      this.performTrick();
    } else if (action === 'nap') {
      this.hideDock();
      if (this.isSleeping) this.wakeFromNap(false);
      else this.enterNapMode(false);
    }
  };

  MeowgerCompanion.prototype.addBond = function(amount, silent) {
    var prev = getBondInfo(this.bondXP).level;
    this.bondXP += (amount || 1);
    saveBondXP(this.bondXP);
    var next = getBondInfo(this.bondXP);
    this.refreshDockUI();
    if (next.level > prev && !silent) {
      this.hop(170);
      if (window.GameFX && window.GameFX.playXpPop) window.GameFX.playXpPop();
      this.say('Our bond reached Lv.' + next.level + ', ' + getMeowgerLearnerName() + '!', 4200);
    }
  };

  MeowgerCompanion.prototype.pet = function(fromHeadRub) {
    var self = this;
    this.touchInteraction();
    this.wakeFromNap(true);
    this.setTemporaryMood('purr', 2200);
    this.applySquash(1.16, 0.85);
    this.blushAlpha = 1;
    if (this.nodes && this.nodes.blush) this.nodes.blush.style.opacity = '1.00';
    this.headTiltTarget = fromHeadRub ? -8 : 7;

    if (window.GameFX && window.GameFX.playPurr) window.GameFX.playPurr();
    this.addBond(1);

    if (!this.dockOpen && Math.random() < 0.55) {
      var uName = getMeowgerLearnerName();
      var lines = [
        'Purr... keep crushing those Java tests, ' + uName + '!',
        'Meow! That feels soothing, ' + uName + '.',
        'Purr~ Best coding partner ever!'
      ];
      this.say(lines[Math.floor(Math.random() * lines.length)], 3200);
    }

    clearTimeout(this._blushTimer);
    this._blushTimer = setTimeout(function() {
      self.headTiltTarget = 0;
    }, 1800);
  };

  MeowgerCompanion.prototype.dropTreat = function() {
    var self = this;
    if (this.treatActive && this.treatActive.el && this.treatActive.el.parentNode) {
      this.treatActive.el.parentNode.removeChild(this.treatActive.el);
    }
    this.wakeFromNap(true);
    if (this.isChasingLaser) this.stopLaserChase(false);

    var vw = Math.max(320, window.innerWidth || 800);
    var vh = Math.max(480, window.innerHeight || 600);
    var offsetX = (this.x > vw * 0.5 ? -1 : 1) * (this.dockedOnMobile ? 76 : (115 + Math.random() * 55));
    var offsetY = (Math.random() - 0.5) * 60;
    var tx = clamp(this.x + offsetX, 24, vw - 64);
    var ty = clamp(this.y + offsetY + 26, 90, vh - 66);

    var treatEl = document.createElement('div');
    treatEl.className = 'meowger-treat';
    treatEl.innerHTML = getTreatSVG();
    treatEl.style.left = Math.round(tx) + 'px';
    treatEl.style.top = Math.round(ty) + 'px';
    document.body.appendChild(treatEl);

    this.treatActive = { el: treatEl, x: tx - 14, y: ty - 26, eaten: false };
    this.targetX = this.treatActive.x;
    this.targetY = this.treatActive.y;
    this.userPinnedPos = null;
    this.mood = 'excited';
    this.refreshDockUI();
    this.hop(110);
    if (window.GameFX && window.GameFX.playMeowChirp) window.GameFX.playMeowChirp();

    // Safety fallback if somehow unreachable
    setTimeout(function() {
      if (self.treatActive && self.treatActive.el === treatEl && !self.treatActive.eaten) {
        if (treatEl.parentNode) treatEl.parentNode.removeChild(treatEl);
        self.treatActive = null;
        if (self.mood === 'excited') self.mood = 'idle';
      }
    }, 6000);
  };

  MeowgerCompanion.prototype.consumeTreat = function() {
    var self = this;
    if (!this.treatActive || this.treatActive.eaten) return;
    this.treatActive.eaten = true;
    var el = this.treatActive.el;

    this.vx *= 0.2;
    this.vy *= 0.2;
    this.applySquash(1.18, 0.84);
    this.setExpressionMouth('munch');
    if (window.GameFX && window.GameFX.playSnackCrunch) window.GameFX.playSnackCrunch();

    setTimeout(function() {
      if (el && el.parentNode) {
        el.classList.add('consumed');
        setTimeout(function() {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 260);
      }
      self.treatActive = null;
      self.setTemporaryMood('purr', 1700);
      self.blushAlpha = 0.85;
      self.addBond(2);
      self.say('Crunch! Roasted Java Bean boost, ' + getMeowgerLearnerName() + '!', 3200);
    }, 340);
  };

  MeowgerCompanion.prototype.startLaserChase = function() {
    var self = this;
    this.wakeFromNap(true);
    if (this.treatActive) {
      if (this.treatActive.el && this.treatActive.el.parentNode) {
        this.treatActive.el.parentNode.removeChild(this.treatActive.el);
      }
      this.treatActive = null;
    }

    this.isChasingLaser = true;
    this.laserPounceCount = 0;
    this.mood = 'pounce';
    this.refreshDockUI();

    if (!this.laserEl) {
      var dot = document.createElement('div');
      dot.className = 'meowger-laser-dot';
      document.body.appendChild(dot);
      this.laserEl = dot;
    }

    var initX = this.mousePos.inside ? this.mousePos.x : clamp(this.x - 110, 40, window.innerWidth - 40);
    var initY = this.mousePos.inside ? this.mousePos.y : clamp(this.y - 40, 80, window.innerHeight - 60);
    this.updateLaserPosition(initX, initY);
    this.say('Laser mode active! Move your cursor to play — press Esc to stop.', 3200);

    clearTimeout(this.chaseTimeout);
    this.chaseTimeout = setTimeout(function() {
      self.stopLaserChase(true);
    }, 10500);
  };

  MeowgerCompanion.prototype.updateLaserPosition = function(lx, ly) {
    this.laserPos.x = clamp(lx, 18, Math.max(320, window.innerWidth) - 18);
    this.laserPos.y = clamp(ly, 56, Math.max(480, window.innerHeight) - 18);
    this.laserPos.lastMove = performance.now();
    if (this.laserEl) {
      this.laserEl.style.transform = 'translate3d(' + Math.round(this.laserPos.x - 7) + 'px, ' + Math.round(this.laserPos.y - 7) + 'px, 0)';
    }
    this.targetX = clamp(this.laserPos.x - 34, 16, Math.max(320, window.innerWidth) - 82);
    this.targetY = clamp(this.laserPos.y - 46, 64, Math.max(480, window.innerHeight) - 82);
  };

  MeowgerCompanion.prototype.stopLaserChase = function(awardBond) {
    if (!this.isChasingLaser) return;
    this.isChasingLaser = false;
    clearTimeout(this.chaseTimeout);
    if (this.laserEl && this.laserEl.parentNode) {
      this.laserEl.parentNode.removeChild(this.laserEl);
    }
    this.laserEl = null;
    this.mood = 'idle';
    this.refreshDockUI();
    if (awardBond) {
      this.hop(150);
      this.addBond(3);
      this.setTemporaryMood('purr', 1600);
      this.say('Great agility training, ' + getMeowgerLearnerName() + '! Caught it ' + Math.max(1, this.laserPounceCount) + 'x.', 3600);
    }
  };

  MeowgerCompanion.prototype.performTrick = function() {
    var self = this;
    this.wakeFromNap(true);
    this.setTemporaryMood('excited', 1400);
    this.hop(260);
    this.spinTarget += (Math.random() > 0.35 ? 360 : -360);
    this.applySquash(0.84, 1.22);
    this.addBond(2);
    if (window.GameFX && window.GameFX.playMeowChirp) window.GameFX.playMeowChirp();

    setTimeout(function() {
      self.spinAngle = 0;
      self.spinTarget = 0;
    }, 950);
  };

  MeowgerCompanion.prototype.enterNapMode = function(auto) {
    this.isSleeping = true;
    this.mood = 'nap';
    this.vx = 0;
    this.vy = 0;
    this.stopLaserChase(false);
    var vw = Math.max(320, window.innerWidth || 800);
    var vh = Math.max(480, window.innerHeight || 600);
    if (!auto) {
      this.targetX = this.dockedOnMobile ? (vw - 78) : (vw - 92);
      this.targetY = vh - 86;
      this.say('Curled up for Quiet Focus Mode. Click me anytime to wake up!', 3200);
    }
    this.refreshDockUI();
  };

  MeowgerCompanion.prototype.wakeFromNap = function(silent) {
    if (!this.isSleeping) return;
    this.isSleeping = false;
    this.mood = 'idle';
    this.earTwitchL = -14;
    this.earTwitchR = 14;
    this.applySquash(0.92, 1.12);
    this.refreshDockUI();
    if (!silent) {
      this.hop(105);
      if (window.GameFX && window.GameFX.playMeowChirp) window.GameFX.playMeowChirp();
    }
  };

  MeowgerCompanion.prototype.openAIChat = function() {
    this.setTemporaryMood('purr', 1200);
    this.hop(110);
    if (typeof window.toggleChat === 'function') {
      var cp = document.getElementById('chat-panel');
      var shouldOpen = !cp || cp.classList.contains('hidden');
      window.toggleChat(shouldOpen);
    } else {
      this.say('How can I help you write Java today, ' + getMeowgerLearnerName() + '?', 4000);
    }
  };

  MeowgerCompanion.prototype.onChatToggle = function(isOpen) {
    if (!isOpen) return;
    this.hideDock();
    var vw = Math.max(320, window.innerWidth || 800);
    var vh = Math.max(480, window.innerHeight || 600);
    if (vw > 560) {
      this.targetX = clamp(vw - 495, 20, vw - 90);
      this.targetY = clamp(vh - 96, 80, vh - 86);
      this.facing = 1;
    } else {
      this.targetX = 16;
      this.targetY = 74;
    }
    this.userPinnedPos = null;
    this.clampBounds();
  };

  // ── 6. Companion Dock & Actionable Speech Bubble UI ─────────────────────────
  MeowgerCompanion.prototype.toggleDock = function() {
    if (this.dockOpen) this.hideDock();
    else this.showDock();
  };

  MeowgerCompanion.prototype.showDock = function() {
    if (!this.dockEl) return;
    this.hideBubble();
    this.refreshDockUI();
    this.dockOpen = true;
    this.positionDockAndBubble();
    this.dockEl.classList.remove('hidden');
    if (window.GameFX && window.GameFX.playClick) window.GameFX.playClick();
  };

  MeowgerCompanion.prototype.hideDock = function() {
    if (!this.dockEl || !this.dockOpen) return;
    this.dockOpen = false;
    this.dockEl.classList.add('hidden');
  };

  MeowgerCompanion.prototype.refreshDockUI = function() {
    if (!this.dockEl) return;
    var moodMap = {
      idle: 'Curious',
      walk: 'Exploring',
      purr: 'Purring',
      excited: 'Playful',
      oops: 'Checking Code',
      nap: 'Napping',
      thinking: 'Thinking...',
      carried: 'Wheee!',
      pounce: 'Laser Lock'
    };
    var moodLabel = this.dockEl.querySelector('#meowger-mood-label');
    var statusDot = this.dockEl.querySelector('#meowger-status-dot');
    if (moodLabel) moodLabel.textContent = moodMap[this.mood] || 'Curious';
    if (statusDot) {
      statusDot.className = 'meowger-status-dot state-' + this.mood;
    }

    var bond = getBondInfo(this.bondXP);
    var bondLvl = this.dockEl.querySelector('#meowger-bond-lvl');
    var bondFill = this.dockEl.querySelector('#meowger-bond-fill');
    if (bondLvl) bondLvl.textContent = bond.isMax ? 'Bond MAX' : ('Bond Lv.' + bond.level);
    if (bondFill) bondFill.style.width = bond.pct + '%';

    var napBtn = this.dockEl.querySelector('#meowger-btn-nap');
    if (napBtn) {
      napBtn.innerHTML = '<span class="btn-svg">' + (this.isSleeping ? SVG_ICONS.wake : SVG_ICONS.nap) + '</span><span>' + (this.isSleeping ? 'Wake' : 'Nap') + '</span>';
      napBtn.classList.toggle('is-active', this.isSleeping);
    }

    var playBtn = this.dockEl.querySelector('#meowger-btn-play');
    if (playBtn) {
      playBtn.classList.toggle('is-active', this.isChasingLaser);
    }
  };

  MeowgerCompanion.prototype.positionDockAndBubble = function() {
    var vw = Math.max(320, window.innerWidth || 800);
    var vh = Math.max(480, window.innerHeight || 600);

    // Position Dock intelligently inside screen bounds
    if (this.dockEl) {
      var dockW = Math.min(286, vw - 24);
      this.dockEl.style.width = dockW + 'px';

      var placeBelow = (this.y < 195);
      this.dockEl.classList.toggle('dock-below', placeBelow);

      var idealLeft = 34 - (dockW / 2);
      var absLeft = this.x + idealLeft;
      if (absLeft < 12) idealLeft += (12 - absLeft);
      if (absLeft + dockW > vw - 12) idealLeft -= ((absLeft + dockW) - (vw - 12));

      this.dockEl.style.left = Math.round(idealLeft) + 'px';
      this.dockEl.style.right = 'auto';
      this.dockEl.style.transformOrigin = placeBelow ? 'top center' : 'bottom center';
    }

    // Position Speech Bubble cleanly away from walls & top navbar
    if (this.bubbleEl) {
      var placeBubbleBelow = (this.y < 140);
      this.bubbleEl.classList.toggle('bubble-below', placeBubbleBelow);

      if (this.x < 120) {
        this.bubbleEl.style.left = '0px';
        this.bubbleEl.style.right = 'auto';
        this.bubbleEl.style.setProperty('--bx', '0%');
        this.bubbleEl.style.setProperty('--arrow-left', '26px');
      } else if (this.x > vw - 210) {
        this.bubbleEl.style.left = 'auto';
        this.bubbleEl.style.right = '0px';
        this.bubbleEl.style.setProperty('--bx', '0%');
        this.bubbleEl.style.setProperty('--arrow-left', 'calc(100% - 38px)');
      } else {
        this.bubbleEl.style.left = '50%';
        this.bubbleEl.style.right = 'auto';
        this.bubbleEl.style.setProperty('--bx', '-50%');
        this.bubbleEl.style.setProperty('--arrow-left', 'calc(50% - 6px)');
      }
    }
  };

  MeowgerCompanion.prototype.say = function(messageText, durationMs, options) {
    var self = this;
    if (!this.bubbleEl) return;
    if (this.activeScreen === 'auth') return;
    if (this.dockOpen) return;
    if (this.hasOpenModal()) return;

    durationMs = durationMs || 4200;
    clearTimeout(this.bubbleTimeout);
    this.positionDockAndBubble();

    var hasActions = options && Array.isArray(options.actions) && options.actions.length > 0;
    this.bubbleEl.classList.toggle('has-actions', !!hasActions);

    var actionsHtml = '';
    if (hasActions) {
      actionsHtml = '<div class="bubble-actions">'
        + options.actions.map(function(a) {
          return '<button type="button" class="bubble-action-btn" data-bubble-action="' + escMeowgerText(a.id) + '">' + escMeowgerText(a.label) + '</button>';
        }).join('')
        + '<button type="button" class="bubble-close-x" aria-label="Dismiss">' + SVG_ICONS.close + '</button>'
        + '</div>';
    }

    this.bubbleEl.innerHTML = (
      '<div class="bubble-inner">'
      + '<span class="bubble-icon">' + ((options && options.icon) || SVG_ICONS.spark) + '</span>'
      + '<span class="bubble-text">' + escMeowgerText(messageText) + '</span>'
      + '</div>'
      + actionsHtml
    );
    this.bubbleEl.classList.remove('hidden');

    this.bubbleTimeout = setTimeout(function() {
      self.hideBubble();
    }, durationMs);
  };

  MeowgerCompanion.prototype.hideBubble = function() {
    clearTimeout(this.bubbleTimeout);
    if (this.bubbleEl) {
      this.bubbleEl.classList.add('hidden');
      this.bubbleEl.classList.remove('has-actions');
    }
  };

  // ── 7. Spring Physics, Animation Loop & Choreography ────────────────────────
  MeowgerCompanion.prototype.setInitialPosition = function() {
    var vw = Math.max(320, window.innerWidth || 800);
    var vh = Math.max(480, window.innerHeight || 600);
    this.x = vw - 96;
    this.y = vh - 108;
    this.targetX = this.x;
    this.targetY = this.y;
    this.facing = -1;
    this.updateWrapperTransform();
  };

  MeowgerCompanion.prototype.dockToMobileCorner = function() {
    var vw = Math.max(320, window.innerWidth || 800);
    var vh = Math.max(480, window.innerHeight || 600);
    this.x = vw - 80;
    this.y = vh - 86;
    this.targetX = this.x;
    this.targetY = this.y;
    this.facing = -1;
    this.updateWrapperTransform();
  };

  MeowgerCompanion.prototype.clampBounds = function() {
    var vw = Math.max(320, window.innerWidth || 800);
    var vh = Math.max(480, window.innerHeight || 600);
    var minX = 14;
    var maxX = vw - 82;
    var minY = 64;
    var maxY = vh - 84;
    this.targetX = clamp(this.targetX, minX, maxX);
    this.targetY = clamp(this.targetY, minY, maxY);
    this.x = clamp(this.x, minX, maxX);
    this.y = clamp(this.y, minY, maxY);
  };

  MeowgerCompanion.prototype.updateWrapperTransform = function() {
    if (!this.el) return;
    this.el.style.transform = 'translate3d(' + this.x.toFixed(1) + 'px, ' + this.y.toFixed(1) + 'px, 0)';
    if (this.spriteBox) {
      this.spriteBox.classList.toggle('facing-left', this.facing === -1);
      this.spriteBox.classList.toggle('facing-right', this.facing !== -1);
    }
  };

  MeowgerCompanion.prototype.hop = function(velocity) {
    this.vz = Math.max(this.vz, velocity || 180);
    this.applySquash(1.18, 0.82); // Anticipation squash on push-off
  };

  MeowgerCompanion.prototype.applySquash = function(targetSX, targetSY) {
    this.sx = targetSX;
    this.sy = targetSY;
  };

  MeowgerCompanion.prototype.setTemporaryMood = function(moodName, ms) {
    var self = this;
    this.mood = moodName;
    this.refreshDockUI();
    clearTimeout(this.moodResetTimeout);
    this.moodResetTimeout = setTimeout(function() {
      if (self.mood === moodName && !self.isSleeping && !self.isThinking && !self.isChasingLaser) {
        self.mood = 'idle';
        self.refreshDockUI();
      }
    }, ms || 1800);
  };

  MeowgerCompanion.prototype.setExpressionMouth = function(mouthType) {
    if (!this.nodes) return;
    this.nodes.mouthSmile.style.display = (mouthType === 'smile') ? 'block' : 'none';
    this.nodes.mouthMeow.style.display = (mouthType === 'meow') ? 'block' : 'none';
    this.nodes.mouthMunch.style.display = (mouthType === 'munch') ? 'block' : 'none';
    this.nodes.mouthOops.style.display = (mouthType === 'oops') ? 'block' : 'none';
  };

  MeowgerCompanion.prototype.startLoop = function() {
    var self = this;
    this.lastFrameTime = performance.now();

    function frame(now) {
      var dt = (now - self.lastFrameTime) / 1000;
      self.lastFrameTime = now;
      if (dt > 0.06) dt = 0.06;
      if (dt > 0) self.tick(dt, now);
      self.rafId = requestAnimationFrame(frame);
    }
    this.rafId = requestAnimationFrame(frame);

    // Autonomous roaming & knowledge ticks
    setInterval(function() { self.maybeWander(); }, 5000);
    setInterval(function() { self.maybeShareKnowledge(); }, 65000);
  };

  MeowgerCompanion.prototype.hasOpenModal = function() {
    var els = document.querySelectorAll('.modal-overlay, .trail-modal-backdrop, .deep-dive-modal-bg, .learner-memory-modal-bg, .ai-diff-modal-bg');
    for (var i = 0; i < els.length; i++) {
      var st = els[i];
      if (!st.classList.contains('hidden') && st.style.display !== 'none') return true;
    }
    return false;
  };

  MeowgerCompanion.prototype.tick = function(dt, now) {
    if (!this.el || this.el.style.display === 'none' || this.activeScreen === 'auth') return;

    var modalOpen = this.hasOpenModal();
    if (modalOpen) {
      if (!this.el.classList.contains('meowger-modal-hidden')) {
        this.el.classList.add('meowger-modal-hidden');
        this.hideDock();
        this.hideBubble();
      }
      return;
    } else if (this.el.classList.contains('meowger-modal-hidden')) {
      this.el.classList.remove('meowger-modal-hidden');
    }

    this.idleClock += dt;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Horizontal & Vertical 2D Spring Locomotion
    if (!this.isDragging && !this.dockedOnMobile) {
      var dx = this.targetX - this.x;
      var dy = this.targetY - this.y;
      var dist = Math.hypot(dx, dy);

      var stiffness = (this.isChasingLaser || this.treatActive) ? 38 : 16;
      var damping = (this.isChasingLaser || this.treatActive) ? 8.2 : 6.8;
      var maxSpeed = this.isChasingLaser ? 360 : (this.treatActive ? 250 : 155);

      if (dist > 1.2 || Math.hypot(this.vx, this.vy) > 4) {
        var ax = dx * stiffness - this.vx * damping;
        var ay = dy * stiffness - this.vy * damping;
        this.vx += ax * dt;
        this.vy += ay * dt;

        var spd = Math.hypot(this.vx, this.vy);
        if (spd > maxSpeed) {
          this.vx = (this.vx / spd) * maxSpeed;
          this.vy = (this.vy / spd) * maxSpeed;
        }
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (Math.abs(this.vx) > 8) {
          this.facing = this.vx > 0 ? 1 : -1;
        }
      } else {
        this.x = this.targetX;
        this.y = this.targetY;
        this.vx = 0;
        this.vy = 0;
      }

      // Soft wall bounce during throw inertia
      var vw = Math.max(320, window.innerWidth || 800);
      var vh = Math.max(480, window.innerHeight || 600);
      if (this.x < 14) { this.x = 14; this.vx = Math.abs(this.vx) * 0.45; }
      if (this.x > vw - 82) { this.x = vw - 82; this.vx = -Math.abs(this.vx) * 0.45; }
      if (this.y < 64) { this.y = 64; this.vy = Math.abs(this.vy) * 0.45; }
      if (this.y > vh - 84) { this.y = vh - 84; this.vy = -Math.abs(this.vy) * 0.45; }
    } else if (!this.isDragging && this.dockedOnMobile) {
      this.vx = 0;
      this.vy = 0;
    }

    // Check Treat Arrival
    if (this.treatActive && !this.treatActive.eaten) {
      if (Math.hypot(this.treatActive.x - this.x, this.treatActive.y - this.y) < 18) {
        this.consumeTreat();
      }
    }

    // Check Laser Chase Pounce Arrival & Autonomous Figure-8 Tease
    if (this.isChasingLaser) {
      if (now - this.laserPos.lastMove > 1100) {
        var vwL = Math.max(320, window.innerWidth || 800);
        var vhL = Math.max(480, window.innerHeight || 600);
        var orbitX = (vwL * 0.5) + Math.sin(this.idleClock * 1.65) * Math.min(200, vwL * 0.34);
        var orbitY = (vhL * 0.52) + Math.sin(this.idleClock * 3.3) * Math.min(100, vhL * 0.18);
        this.laserPos.x = clamp(orbitX, 24, vwL - 24);
        this.laserPos.y = clamp(orbitY, 72, vhL - 36);
        if (this.laserEl) {
          this.laserEl.style.transform = 'translate3d(' + Math.round(this.laserPos.x - 7) + 'px, ' + Math.round(this.laserPos.y - 7) + 'px, 0)';
        }
        this.targetX = clamp(this.laserPos.x - 34, 16, vwL - 82);
        this.targetY = clamp(this.laserPos.y - 46, 64, vhL - 82);
      }
      var ldx = (this.laserPos.x - 34) - this.x;
      var ldy = (this.laserPos.y - 46) - this.y;
      var ldist = Math.hypot(ldx, ldy);
      if (ldist < 22 && this.z <= 2) {
        this.laserPounceCount++;
        this.hop(175);
        if (window.GameFX && window.GameFX.playMeowChirp) window.GameFX.playMeowChirp();
      }
    }

    // 2. Gravity & Jump Spring (Z axis)
    if (this.isDragging) {
      this.z += (this.targetZ - this.z) * Math.min(1, dt * 16);
      this.vz = 0;
    } else if (this.z > 0 || this.vz > 0) {
      this.z += this.vz * dt;
      this.vz -= 780 * dt; // Natural gravity
      if (this.z <= 0) {
        this.z = 0;
        if (this.vz < -75) {
          this.applySquash(1.19, 0.82); // Landing squash!
        }
        this.vz = 0;
      }
    }

    // 3. Volume-Preserving Squash & Stretch Spring (returns to 1,1)
    var sK = 260;
    var sD = 15;
    this.svx += ((1 - this.sx) * sK - this.svx * sD) * dt;
    this.svy += ((1 - this.sy) * sK - this.svy * sD) * dt;
    this.sx += this.svx * dt;
    this.sy += this.svy * dt;

    // 4. Velocity Tilt & Spin Trick Interpolation
    var moveSpeed = Math.hypot(this.vx, this.vy);
    var desiredTilt = this.isDragging
      ? clamp(this.vx * 0.035, -16, 16)
      : clamp(this.vx * this.facing * 0.035, -8, 8);
    this.tilt += (desiredTilt - this.tilt) * Math.min(1, dt * 14);
    this.spinAngle += (this.spinTarget - this.spinAngle) * Math.min(1, dt * 9);

    // Walk Gait Phase synced cleanly to velocity (zero foot sliding!)
    var isWalking = moveSpeed > 12 && !this.isDragging && this.z < 4;
    if (isWalking) {
      this.walkPhase += moveSpeed * dt * 0.14;
      if (this.mood === 'idle') this.mood = 'walk';
    } else {
      if (this.mood === 'walk') this.mood = 'idle';
    }

    // 5. Autonomous Idle Choreography (Blink, Ear Twitch, Curious Tilt, Auto-Nap)
    if (now >= this.nextBlinkAt) {
      this.triggerBlink(now);
    }
    if (now >= this.nextIdleActionAt) {
      this.triggerIdleAction(now);
    }
    this.headTilt += (this.headTiltTarget - this.headTilt) * Math.min(1, dt * 8);
    this.earTwitchL *= Math.pow(0.03, dt);
    this.earTwitchR *= Math.pow(0.03, dt);
    if (this.mood !== 'purr') {
      this.blushAlpha = Math.max(0, this.blushAlpha - dt * 1.1);
    }

    // Smoothly auto-nap after 55s inactivity when idle
    if (!this.isSleeping && !this.dockOpen && !this.isChasingLaser && !this.treatActive && !this.isThinking) {
      if (Date.now() - this.lastInteractionTime > 55000 && this.mood === 'idle') {
        this.enterNapMode(true);
      }
    }

    // 6. Apply Transforms to DOM & SVG Articulation Rig
    this.updateWrapperTransform();
    if (this.dockOpen) this.positionDockAndBubble();
    this.renderSVGArticulation(dt, isWalking, moveSpeed, reducedMotion);
  };

  MeowgerCompanion.prototype.triggerBlink = function(now) {
    var self = this;
    var n = this.nodes;
    if (n && n.eyelidL && n.eyelidR && !this.isSleeping && this.mood !== 'purr' && this.mood !== 'oops') {
      n.eyelidL.setAttribute('height', '7.6');
      n.eyelidR.setAttribute('height', '7.6');
      setTimeout(function() {
        if (n.eyelidL && n.eyelidR) {
          n.eyelidL.setAttribute('height', '0');
          n.eyelidR.setAttribute('height', '0');
        }
      }, 115);
    }
    var doubleBlink = Math.random() < 0.22;
    this.nextBlinkAt = now + (doubleBlink ? 260 : (2800 + Math.random() * 2800));
  };

  MeowgerCompanion.prototype.triggerIdleAction = function(now) {
    var self = this;
    this.nextIdleActionAt = now + 3800 + Math.random() * 4200;
    if (this.isSleeping || this.isDragging || this.isChasingLaser || this.mood === 'walk') return;

    var roll = Math.random();
    if (roll < 0.42) {
      // Independent feline ear flick
      if (Math.random() < 0.5) this.earTwitchL = -16;
      else this.earTwitchR = 16;
    } else if (roll < 0.72) {
      // Curious subtle head tilt & look around
      this.headTiltTarget = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 4);
      setTimeout(function() { self.headTiltTarget = 0; }, 1600);
    } else if (roll < 0.9 && this.nodes && this.nodes.wavePaw) {
      // Soft friendly paw wave / whisker wash
      this.nodes.wavePaw.style.opacity = '1';
      this.nodes.wavePaw.setAttribute('transform', 'rotate(-16 17 39)');
      setTimeout(function() {
        if (self.nodes && self.nodes.wavePaw) {
          self.nodes.wavePaw.setAttribute('transform', 'rotate(4 17 39)');
          setTimeout(function() {
            if (self.nodes && self.nodes.wavePaw) self.nodes.wavePaw.style.opacity = '0';
          }, 260);
        }
      }, 360);
    }
  };

  MeowgerCompanion.prototype.renderSVGArticulation = function(dt, isWalking, moveSpeed, reducedMotion) {
    var n = this.nodes;
    if (!n) return;

    // Ground contact shadow responds inversely to vertical altitude `z`
    if (n.shadow) {
      var shadowScale = clamp(1 - (this.z / 70), 0.45, 1);
      var shadowOpacity = clamp(0.24 - (this.z / 90), 0.08, 0.24);
      n.shadow.setAttribute('transform', 'translate(32,57.5) scale(' + shadowScale.toFixed(3) + ') translate(-32,-57.5)');
      n.shadow.setAttribute('fill', 'rgba(11,11,14,' + shadowOpacity.toFixed(2) + ')');
    }

    // Rig transform (Jump altitude + spin + tilt + squash/stretch anchored at feet y=56)
    var walkBob = isWalking ? Math.abs(Math.sin(this.walkPhase)) * 1.8 : 0;
    var breathScaleY = this.isSleeping
      ? (1 + Math.sin(this.idleClock * 1.7) * 0.025)
      : (1 + Math.sin(this.idleClock * 2.5) * 0.015);
    var effSX = reducedMotion ? 1 : this.sx;
    var effSY = reducedMotion ? 1 : (this.sy * breathScaleY);
    var totalTilt = reducedMotion ? 0 : (this.tilt + this.spinAngle);

    if (n.rig) {
      var purrJiggle = (this.mood === 'purr' && !reducedMotion) ? Math.sin(this.idleClock * 42) * 0.45 : 0;
      n.rig.setAttribute('transform',
        'translate(' + purrJiggle.toFixed(2) + ',' + (-(this.z + walkBob)).toFixed(2) + ') '
        + 'translate(32,56) rotate(' + totalTilt.toFixed(2) + ',0,-18) scale(' + effSX.toFixed(3) + ',' + effSY.toFixed(3) + ') translate(-32,-56)'
      );
    }

    // Articulated Multi-Segment Tail Cascade
    var tailSpeed = (this.mood === 'purr' || this.mood === 'excited' || this.isChasingLaser) ? 5.8 : (isWalking ? 4.4 : (this.isSleeping ? 0.9 : 2.1));
    var tailAmp = this.isSleeping ? 4 : ((this.mood === 'purr' || this.isChasingLaser) ? 14 : 9);
    var tA = Math.sin(this.idleClock * tailSpeed) * tailAmp;
    var tB = Math.sin(this.idleClock * tailSpeed - 0.85) * (tailAmp * 0.75);
    var tC = Math.sin(this.idleClock * tailSpeed - 1.65) * (tailAmp * 0.65);
    if (n.tailBase) n.tailBase.setAttribute('transform', 'rotate(' + tA.toFixed(2) + ' 41 44)');
    if (n.tailMid) n.tailMid.setAttribute('transform', 'rotate(' + tB.toFixed(2) + ' 46 43)');
    if (n.tailTip) n.tailTip.setAttribute('transform', 'rotate(' + tC.toFixed(2) + ' 45.5 36)');

    // Articulated Paws (Walk stride OR dangling carry pendulum OR tucked sleep)
    if (n.legL && n.legR) {
      if (this.isDragging) {
        var dangle = clamp(-this.vx * 0.045, -24, 24);
        n.legL.setAttribute('transform', 'translate(0,2) rotate(' + dangle.toFixed(1) + ' 23 49)');
        n.legR.setAttribute('transform', 'translate(0,2) rotate(' + (dangle * 0.85).toFixed(1) + ' 40 49)');
      } else if (isWalking) {
        var lY = Math.max(0, Math.sin(this.walkPhase)) * -3.5;
        var rY = Math.max(0, -Math.sin(this.walkPhase)) * -3.5;
        var lRot = Math.cos(this.walkPhase) * 9;
        var rRot = -Math.cos(this.walkPhase) * 9;
        n.legL.setAttribute('transform', 'translate(0,' + lY.toFixed(2) + ') rotate(' + lRot.toFixed(1) + ' 23 50)');
        n.legR.setAttribute('transform', 'translate(0,' + rY.toFixed(2) + ') rotate(' + rRot.toFixed(1) + ' 40 50)');
      } else if (this.isSleeping) {
        n.legL.setAttribute('transform', 'translate(2,-1.5) scale(0.92)');
        n.legR.setAttribute('transform', 'translate(-2,-1.5) scale(0.92)');
      } else {
        n.legL.setAttribute('transform', '');
        n.legR.setAttribute('transform', '');
      }
    }

    // Hoodie Drawstrings subtle sway
    var cordSway = clamp(-this.vx * 0.025, -14, 14) + Math.sin(this.idleClock * 2.2) * 2;
    if (n.cordL) n.cordL.setAttribute('transform', 'rotate(' + cordSway.toFixed(1) + ' 28.5 37)');
    if (n.cordR) n.cordR.setAttribute('transform', 'rotate(' + cordSway.toFixed(1) + ' 35.5 37)');

    // Head Bob, Curious Tilt & Lowered Nap Posture
    var headY = this.isSleeping ? 4.2 : (Math.sin(this.idleClock * 2.5 - 0.4) * 0.65);
    if (n.head) {
      n.head.setAttribute('transform', 'translate(0,' + headY.toFixed(2) + ') rotate(' + this.headTilt.toFixed(2) + ' 32 34)');
    }

    // Independent Ear Posture (drooped on sleep/oops, perked on carried, flattened on pounce, twitched randomly)
    var baseEarL = this.isSleeping ? -14 : (this.mood === 'oops' ? -18 : (this.mood === 'pounce' ? -22 : (this.isDragging ? 6 : 0)));
    var baseEarR = this.isSleeping ? 14 : (this.mood === 'oops' ? 18 : (this.mood === 'pounce' ? 22 : (this.isDragging ? -6 : 0)));
    if (n.earL) n.earL.setAttribute('transform', 'rotate(' + (baseEarL + this.earTwitchL).toFixed(1) + ' 21 20)');
    if (n.earR) n.earR.setAttribute('transform', 'rotate(' + (baseEarR + this.earTwitchR).toFixed(1) + ' 43 20)');

    // Blush alpha
    if (n.blush) {
      n.blush.style.opacity = this.blushAlpha.toFixed(2);
    }

    // Eye Mode Switching & Smooth Cursor Iris Tracking
    var eyeMode = 'normal';
    if (this.isSleeping) eyeMode = 'sleep';
    else if (this.mood === 'purr') eyeMode = 'happy';
    else if (this.mood === 'oops') eyeMode = 'oops';
    else if (this.mood === 'excited' || this.mood === 'pounce' || this.isChasingLaser) eyeMode = 'excited';

    n.eyeNormal.style.display = (eyeMode === 'normal') ? 'block' : 'none';
    n.eyeHappy.style.display = (eyeMode === 'happy') ? 'block' : 'none';
    n.eyeSleep.style.display = (eyeMode === 'sleep') ? 'block' : 'none';
    n.eyeOops.style.display = (eyeMode === 'oops') ? 'block' : 'none';
    n.eyeExcited.style.display = (eyeMode === 'excited') ? 'block' : 'none';

    if (eyeMode === 'normal' && this.mousePos.inside) {
      var cx = this.x + 34;
      var cy = this.y + 24;
      var mdx = this.mousePos.x - cx;
      var mdy = this.mousePos.y - cy;
      var mdist = Math.hypot(mdx, mdy);
      var px = 0;
      var py = 0;
      if (mdist < 260 && mdist > 4) {
        // Flip horizontal pupil tracking when SVG sprite is mirrored (`facing === -1`)
        px = clamp((mdx / 90) * this.facing, -1.35, 1.35);
        py = clamp(mdy / 90, -1.25, 1.45);
      }
      if (n.pupilMainL) { n.pupilMainL.setAttribute('cx', (23.4 + px).toFixed(2)); n.pupilMainL.setAttribute('cy', (23.1 + py).toFixed(2)); }
      if (n.pupilMainR) { n.pupilMainR.setAttribute('cx', (42.0 + px).toFixed(2)); n.pupilMainR.setAttribute('cy', (23.1 + py).toFixed(2)); }
      if (n.pupilSubL) { n.pupilSubL.setAttribute('cx', (21.4 + px * 0.7).toFixed(2)); n.pupilSubL.setAttribute('cy', (25.2 + py * 0.7).toFixed(2)); }
      if (n.pupilSubR) { n.pupilSubR.setAttribute('cx', (40.0 + px * 0.7).toFixed(2)); n.pupilSubR.setAttribute('cy', (25.2 + py * 0.7).toFixed(2)); }

      // Subtle curious head look when cursor hovers close without dragging
      if (!this.dockOpen && !this.isSleeping && !this.isDragging && mdist < 180 && mdist > 34 && !isWalking) {
        this.facing = mdx >= 0 ? 1 : -1;
      }
    }

    // Mouth state (unless actively munching)
    if (!this.treatActive || !this.treatActive.eaten) {
      if (this.mood === 'oops') this.setExpressionMouth('oops');
      else if (this.mood === 'purr' || this.mood === 'excited') this.setExpressionMouth('meow');
      else this.setExpressionMouth('smile');
    }

    // Minimalist Floating Vector FX Layers
    if (n.fxHeart) n.fxHeart.style.display = (this.mood === 'purr') ? 'block' : 'none';
    if (n.fxSparkles) n.fxSparkles.style.display = (this.mood === 'excited') ? 'block' : 'none';
    if (n.fxPurrWaves) n.fxPurrWaves.style.display = (this.mood === 'purr') ? 'block' : 'none';
    if (n.fxThinkDots) n.fxThinkDots.style.display = this.isThinking ? 'block' : 'none';
    if (n.fxSleepZ) n.fxSleepZ.style.display = this.isSleeping ? 'block' : 'none';
  };

  // ── 8. Autonomous Roaming & Platform Lifecycle Hooks ────────────────────────
  MeowgerCompanion.prototype.maybeWander = function() {
    if (this.dockedOnMobile || this.isDragging || this.isSleeping || this.dockOpen || this.isChasingLaser || this.treatActive || this.isThinking) return;
    if (this.activeScreen === 'auth' || this.userPinnedPos) return;

    var cp = document.getElementById('chat-panel');
    if (cp && !cp.classList.contains('hidden')) return;
    if (Math.hypot(this.vx, this.vy) > 5) return;

    var now = Date.now();
    if (now - this._lastWanderAt < 14000) return;
    if (Math.random() < 0.36) {
      this._lastWanderAt = now;
      var vw = Math.max(320, window.innerWidth || 800);
      var vh = Math.max(480, window.innerHeight || 600);

      if (this.activeScreen === 'map') {
        this.targetX = (vw * 0.5) + (Math.random() > 0.5 ? 190 : -240);
        this.targetY = clamp(Math.random() * (vh - 280) + 140, 90, vh - 100);
      } else if (this.activeScreen === 'lesson' || this.activeScreen === 'compiler') {
        // Keep safely at peripheral corners during coding
        this.targetX = vw - 94;
        this.targetY = vh - 112;
      } else {
        this.targetX = Math.random() * (vw - 200) + 100;
        this.targetY = vh - 104 - (Math.random() * 28);
      }
      this.clampBounds();
    }
  };

  MeowgerCompanion.prototype.maybeShareKnowledge = function() {
    if (this.isSleeping || this.dockOpen || this.isChasingLaser || this.activeScreen === 'auth') return;
    var uName = getMeowgerLearnerName();
    var tips = [
      'Java 21 Virtual Threads scale cleanly for I/O tasks, ' + uName + '!',
      'Quick tip, ' + uName + ': always compare Strings using .equals(), never ==.',
      'Try dragging me anywhere on screen, or drop me a roasted Java bean treat!',
      'Stuck on an error, ' + uName + '? Double-click me anytime for Meowger AI.'
    ];
    this.say(tips[Math.floor(Math.random() * tips.length)], 5200);
  };

  MeowgerCompanion.prototype.setThinking = function(active, didSucceed) {
    this.isThinking = !!active;
    if (active) {
      this.wakeFromNap(true);
      this.mood = 'thinking';
      this.headTiltTarget = -6;
      this.refreshDockUI();
    } else {
      this.headTiltTarget = 0;
      if (didSucceed) {
        this.setTemporaryMood('purr', 1200);
        this.hop(120);
      } else {
        this.mood = 'idle';
        this.refreshDockUI();
      }
    }
  };

  MeowgerCompanion.prototype.onUserCoding = function() {
    this.touchInteraction();
    if (this.isSleeping) this.wakeFromNap(true);
  };

  MeowgerCompanion.prototype.reactFromFX = function(type) {
    this.touchInteraction();
    this.wakeFromNap(true);
    if (type === 'bounce' || type === 'happy') {
      this.setTemporaryMood('excited', 1600);
      this.hop(215);
      this.addBond(1, true);
    } else if (type === 'oops' || type === 'shake') {
      this.setTemporaryMood('oops', 1500);
      this.applySquash(1.12, 0.88);
    }
  };

  MeowgerCompanion.prototype.celebrateEvent = function(kind, label) {
    this.touchInteraction();
    this.wakeFromNap(true);
    this.setTemporaryMood('excited', 2400);
    this.hop(245);
    this.spinTarget += 360;
    this.addBond(kind === 'levelup' ? 3 : 2, true);
    var uName = getMeowgerLearnerName();
    var self = this;
    setTimeout(function() { self.spinAngle = 0; self.spinTarget = 0; }, 900);

    if (kind === 'levelup') {
      this.say('Meow! Congratulations on reaching ' + (label || 'a new level') + ', ' + uName + '!', 4500);
    } else if (kind === 'badge') {
      this.say('Shiny new medal unlocked: ' + (label || 'Achievement') + '! Proud of you, ' + uName + '!', 4500);
    }
  };

  // Backwards-compatible triggerReaction method
  MeowgerCompanion.prototype.triggerReaction = function(type) {
    if (type === 'happy') {
      this.wakeFromNap(true);
      this.setTemporaryMood('excited', 1500);
      this.hop(210);
    } else if (type === 'thinking') {
      this.wakeFromNap(true);
      this.setTemporaryMood('oops', 1600);
      this.applySquash(1.1, 0.9);
    }
  };

  // Smooth Apple Spring Portal on Screen Navigation
  MeowgerCompanion.prototype.onScreenChanged = function(screenName) {
    this.activeScreen = screenName;
    this.hideDock();
    this.stopLaserChase(false);
    this.userPinnedPos = null;

    if (screenName === 'auth') {
      this.hideBubble();
      if (this.el) this.el.style.display = 'none';
      return;
    }
    if (this.el) this.el.style.display = 'block';

    var self = this;
    this.touchInteraction();
    this.wakeFromNap(true);

    if (this.el) {
      this.el.classList.add('meowger-teleport-out');
    }

    setTimeout(function() {
      var vw = Math.max(320, window.innerWidth || 800);
      var vh = Math.max(480, window.innerHeight || 600);
      var uName = getMeowgerLearnerName();

      if (screenName === 'map') {
        self.x = clamp((vw * 0.5) + 170, 30, vw - 90);
        self.y = clamp(vh * 0.34, 90, 260);
        self.say('Adventure Map ready, ' + uName + '! Tap me to play, feed, or ask AI.', 4000);
      } else if (screenName === 'lesson') {
        self.x = vw - 92;
        self.y = vh - 104;
        self.say('I am coding alongside you, ' + uName + '. Double-click me for fast AI help!', 3600);
      } else if (screenName === 'compiler') {
        self.x = vw - 92;
        self.y = 84;
        self.say('Playground live, ' + uName + '! Hit Run Code anytime.', 3400);
      } else if (screenName === 'avatar') {
        self.x = clamp(vw * 0.18, 20, vw - 90);
        self.y = clamp(vh * 0.3, 90, 250);
        self.say('Looking crisp, ' + uName + '! Customize your pixel hero.', 3400);
      } else if (screenName === 'badges') {
        self.x = vw - 92;
        self.y = 120;
        self.say('Look at those voxel trophies, ' + uName + '!', 3400);
      } else {
        self.x = vw - 96;
        self.y = vh - 108;
        if (!self.lastAutoGreeted) {
          self.lastAutoGreeted = true;
          setTimeout(function() {
            self.say('Meow, ' + getMeowgerLearnerName() + '! Tap me to pet, feed treats, play laser chase, or open AI Tutor.', 5000);
          }, 800);
        }
      }

      self.targetX = self.x;
      self.targetY = self.y;
      self.vx = 0;
      self.vy = 0;
      self.clampBounds();
      self.updateWrapperTransform();

      if (self.el) {
        self.el.classList.remove('meowger-teleport-out');
        self.el.classList.add('meowger-teleport-in');
        self.applySquash(1.12, 0.88);
        setTimeout(function() {
          if (self.el) self.el.classList.remove('meowger-teleport-in');
        }, 380);
      }
    }, 170);
  };

  // ── 9. Global Registration & Compiler Hook ──────────────────────────────────
  window.Meowger = null;

  function initMeowger() {
    if (!window.Meowger) {
      window.Meowger = new MeowgerCompanion();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeowger);
  } else {
    initMeowger();
  }

  window.meowgerReactToRun = function(success, errorMsg) {
    if (!window.Meowger) return;
    window.Meowger.touchInteraction();
    window.Meowger.wakeFromNap(true);
    var uName = getMeowgerLearnerName();
    if (success) {
      window.Meowger.setTemporaryMood('excited', 2000);
      window.Meowger.hop(220);
      window.Meowger.addBond(1, true);
      window.Meowger.say('Clean execution, ' + uName + '! All systems green.', 3500);
    } else {
      window.Meowger.setTemporaryMood('oops', 2200);
      window.Meowger.applySquash(1.13, 0.87);
      window.Meowger.say(
        'Spotted an issue in that run, ' + uName + '. Want me to diagnose it?',
        6000,
        {
          actions: [
            { id: 'explain-error', label: 'Explain Error' },
            { id: 'hint', label: 'Socratic Hint' }
          ]
        }
      );
    }
  };
})();
