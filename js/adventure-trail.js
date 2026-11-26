// JavaQst — js/adventure-trail.js
// Living Isometric Biome Diorama Map (Apple Design & Motion Craftsmanship)
// 100% Pure Inline SVG Architecture — Zero Unicode Emojis
// Features: Synced SVG Terrain & Glowing Cubic-Bezier Path, Animated Waterfall & River Boat,
// Interactive Campfires, Swaying Trees, Mineable Biome Relics, Clickable Pixel Champion,
// Spatial Pointer Parallax, Tactile Spring Modals, & Full Day/Night High-Contrast Support.

(function() {
  'use strict';

  var STORAGE_KEY_RELICS = 'javaqst_map_relics_v1';

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // ── 1. Persistent Map Relic Collector (Cosmetic Exploration Discovery) ──────
  function loadCollectedRelics() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_RELICS);
      var parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveCollectedRelic(key) {
    try {
      var map = loadCollectedRelics();
      map[String(key)] = true;
      localStorage.setItem(STORAGE_KEY_RELICS, JSON.stringify(map));
    } catch (e) {}
  }

  // ── 2. Ephemeral Floating Particle & Map Callout Utilities ──────────────────
  function spawnMapParticles(anchorEl, colors, count) {
    if (!anchorEl || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var board = anchorEl.closest('.island-mountain-board') || anchorEl.offsetParent;
    if (!board) return;

    var aRect = anchorEl.getBoundingClientRect();
    var bRect = board.getBoundingClientRect();
    var cx = (aRect.left - bRect.left) + (aRect.width * 0.5);
    var cy = (aRect.top - bRect.top) + (aRect.height * 0.45);
    var palette = colors || ['#FFE600', '#10B981', '#38BDF8', '#FFFFFF'];
    var total = count || 8;

    for (var i = 0; i < total; i++) {
      var p = document.createElement('span');
      p.className = 'map-fx-particle';
      var angle = (Math.PI * 2 * i / total) + (Math.random() - 0.5) * 0.5;
      var dist = 22 + Math.random() * 28;
      p.style.left = Math.round(cx) + 'px';
      p.style.top = Math.round(cy) + 'px';
      p.style.background = palette[i % palette.length];
      p.style.setProperty('--dx', Math.round(Math.cos(angle) * dist) + 'px');
      p.style.setProperty('--dy', Math.round(Math.sin(angle) * dist - 16) + 'px');
      p.style.setProperty('--rot', Math.round((Math.random() - 0.5) * 180) + 'deg');
      board.appendChild(p);
      setTimeout((function(node) {
        return function() { if (node.parentNode) node.parentNode.removeChild(node); };
      })(p), 720);
    }
  }

  function showPropPopCallout(anchorEl, text) {
    if (!anchorEl) return;
    var board = anchorEl.closest('.island-mountain-board');
    if (!board) return;

    // Remove previous callout
    var old = board.querySelector('.map-prop-callout');
    if (old) old.remove();

    var tip = document.createElement('div');
    tip.className = 'map-prop-callout';
    tip.textContent = text;

    var aRect = anchorEl.getBoundingClientRect();
    var bRect = board.getBoundingClientRect();
    var left = clamp((aRect.left - bRect.left) + (aRect.width * 0.5), 115, Math.max(120, bRect.width - 115));
    var top = Math.max(16, (aRect.top - bRect.top) - 14);
    tip.style.left = Math.round(left) + 'px';
    tip.style.top = Math.round(top) + 'px';

    board.appendChild(tip);
    setTimeout(function() {
      tip.classList.add('fading-out');
      setTimeout(function() { if (tip.parentNode) tip.remove(); }, 240);
    }, 2400);
  }

  // ── 3. Pure SVG Generators (Zero Emojis — Crafted Diorama Assets) ────────────
  var SVGS = {
    grassBlock: function() {
      return (
        '<svg class="biome-cube-svg" viewBox="0 0 36 36" width="36" height="36">'
        + '<polygon points="18,3 33,11 18,20 3,11" fill="#52B756"/>'
        + '<polygon points="3,11 18,20 18,33 3,24" fill="#6D4321"/>'
        + '<polygon points="3,11 18,20 18,23.5 3,14.5" fill="#3D8B40"/>'
        + '<polygon points="18,20 33,11 33,24 18,33" fill="#8B5A2B"/>'
        + '<polygon points="18,20 33,11 33,14.5 18,23.5" fill="#52B756"/>'
        + '<polygon points="18,3 33,11 33,24 18,33 3,24 3,11" fill="none" stroke="#0B0B0E" stroke-width="1.6" stroke-linejoin="round"/>'
        + '<line x1="18" y1="20" x2="18" y2="33" stroke="#0B0B0E" stroke-width="1.6"/>'
        + '</svg>'
      );
    },

    netherrackBlock: function() {
      return (
        '<svg class="biome-cube-svg" viewBox="0 0 36 36" width="36" height="36">'
        + '<polygon points="18,3 33,11 18,20 3,11" fill="#991B1B"/>'
        + '<polygon points="3,11 18,20 18,33 3,24" fill="#450A0A"/>'
        + '<polygon points="18,20 33,11 33,24 18,33" fill="#7F1D1D"/>'
        + '<rect x="16" y="9" width="3" height="3" rx="0.5" fill="#F97316"/>'
        + '<rect x="8" y="19" width="3" height="3" rx="0.5" fill="#FB923C"/>'
        + '<rect x="24" y="21" width="3" height="3" rx="0.5" fill="#FBBF24"/>'
        + '<polygon points="18,3 33,11 33,24 18,33 3,24 3,11" fill="none" stroke="#0B0B0E" stroke-width="1.6" stroke-linejoin="round"/>'
        + '<line x1="18" y1="20" x2="18" y2="33" stroke="#0B0B0E" stroke-width="1.6"/>'
        + '</svg>'
      );
    },

    endStoneBlock: function() {
      return (
        '<svg class="biome-cube-svg" viewBox="0 0 36 36" width="36" height="36">'
        + '<polygon points="18,3 33,11 18,20 3,11" fill="#E6E4A8"/>'
        + '<polygon points="3,11 18,20 18,33 3,24" fill="#A3A06A"/>'
        + '<polygon points="18,20 33,11 33,24 18,33" fill="#C4C184"/>'
        + '<circle cx="17" cy="10" r="1.6" fill="#7C3AED"/>'
        + '<circle cx="25" cy="20" r="1.6" fill="#A855F7"/>'
        + '<polygon points="18,3 33,11 33,24 18,33 3,24 3,11" fill="none" stroke="#0B0B0E" stroke-width="1.6" stroke-linejoin="round"/>'
        + '<line x1="18" y1="20" x2="18" y2="33" stroke="#0B0B0E" stroke-width="1.6"/>'
        + '</svg>'
      );
    },

    treeProp: function(biome) {
      if (biome === 'nether') {
        return (
          '<svg class="prop-svg" viewBox="0 0 48 58" width="46" height="56">'
          + '<ellipse cx="24" cy="53" rx="14" ry="3.5" fill="rgba(0,0,0,0.28)"/>'
          + '<rect x="19" y="28" width="10" height="24" rx="2" fill="#3B1526" stroke="#0B0B0E" stroke-width="1.4"/>'
          + '<g class="prop-canopy">'
          + '  <path d="M6 28 C6 10 42 10 42 28 Z" fill="#991B1B" stroke="#0B0B0E" stroke-width="1.5"/>'
          + '  <path d="M10 24 C10 13 38 13 38 24 Z" fill="#DC2626"/>'
          + '  <circle cx="16" cy="18" r="2.3" fill="#FCA5A5"/><circle cx="30" cy="19" r="2.2" fill="#FCA5A5"/>'
          + '  <circle cx="23" cy="14" r="1.8" fill="#FDE047"/>'
          + '</g>'
          + '</svg>'
        );
      }
      if (biome === 'end') {
        return (
          '<svg class="prop-svg" viewBox="0 0 44 64" width="42" height="62">'
          + '<ellipse cx="22" cy="59" rx="14" ry="3.5" fill="rgba(0,0,0,0.35)"/>'
          + '<g class="prop-canopy">'
          + '  <polygon points="11,57 16,12 28,12 33,57" fill="#1C142B" stroke="#0B0B0E" stroke-width="1.5" stroke-linejoin="round"/>'
          + '  <polygon points="15,57 18,12 26,12 29,57" fill="#31244E"/>'
          + '  <circle cx="22" cy="8" r="4.8" fill="#C084FC" stroke="#0B0B0E" stroke-width="1.2"/>'
          + '  <circle cx="22" cy="8" r="2.2" fill="#FFFFFF"/>'
          + '  <rect x="18" y="25" width="2.5" height="6" rx="1" fill="#A855F7"/>'
          + '  <rect x="24" y="38" width="2.5" height="5" rx="1" fill="#A855F7"/>'
          + '</g>'
          + '</svg>'
        );
      }
      return (
        '<svg class="prop-svg" viewBox="0 0 48 58" width="46" height="56">'
        + '<ellipse cx="24" cy="53" rx="14" ry="3.5" fill="rgba(0,0,0,0.18)"/>'
        + '<rect x="19" y="31" width="10" height="21" rx="2" fill="#5C3A21" stroke="#0B0B0E" stroke-width="1.4"/>'
        + '<rect x="22" y="35" width="3" height="13" fill="#7D502E"/>'
        + '<g class="prop-canopy">'
        + '  <rect x="6" y="19" width="36" height="15" rx="4" fill="#2E6F34" stroke="#0B0B0E" stroke-width="1.4"/>'
        + '  <rect x="9" y="11" width="30" height="13" rx="4" fill="#439B48" stroke="#0B0B0E" stroke-width="1.4"/>'
        + '  <rect x="14" y="4" width="20" height="10" rx="3.5" fill="#5CCB62" stroke="#0B0B0E" stroke-width="1.3"/>'
        + '  <rect x="16" y="6.5" width="7" height="3" rx="1" fill="#8AE48F"/>'
        + '  <rect x="26" y="13.5" width="6" height="3" rx="1" fill="#8AE48F"/>'
        + '</g>'
        + '</svg>'
      );
    },

    campfireProp: function(biome) {
      var glow = biome === 'end' ? '#A855F7' : (biome === 'nether' ? '#FB923C' : '#F97316');
      var core = biome === 'end' ? '#F3E8FF' : '#FEF08A';
      return (
        '<svg class="prop-svg" viewBox="0 0 38 40" width="36" height="38">'
        + '<ellipse cx="19" cy="35" rx="14" ry="4" fill="rgba(0,0,0,0.22)"/>'
        + '<circle class="prop-flame-halo" cx="19" cy="21" r="14" fill="' + glow + '" opacity="0.22"/>'
        + '<rect x="9" y="29" width="20" height="5" rx="2" fill="#5C3A21" stroke="#0B0B0E" stroke-width="1.2" transform="rotate(-12 19 31.5)"/>'
        + '<rect x="9" y="29" width="20" height="5" rx="2" fill="#7A4E2D" stroke="#0B0B0E" stroke-width="1.2" transform="rotate(14 19 31.5)"/>'
        + '<g class="prop-flame-group">'
        + '  <path d="M19 8 C24 14 27 20 24 27 C22 30 16 30 14 27 C11 20 14 14 19 8 Z" fill="' + glow + '" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '  <path d="M19 15 C22 19 22.5 23 21 26 C19.8 28 18.2 28 17 26 C15.5 23 16 19 19 15 Z" fill="' + core + '"/>'
        + '</g>'
        + '</svg>'
      );
    },

    oreRelicProp: function(biome, isCollected) {
      var crystal = isCollected ? '#94A3B8' : (biome === 'nether' ? '#FBBF24' : (biome === 'end' ? '#C084FC' : '#38BDF8'));
      var crystalHi = isCollected ? '#CBD5E1' : (biome === 'nether' ? '#FEF08A' : (biome === 'end' ? '#F3E8FF' : '#BAE6FD'));
      return (
        '<svg class="prop-svg" viewBox="0 0 38 36" width="36" height="34">'
        + '<ellipse cx="19" cy="32" rx="14" ry="3.5" fill="rgba(0,0,0,0.22)"/>'
        + '<polygon points="6,29 10,17 20,14 31,19 33,29" fill="#52525B" stroke="#0B0B0E" stroke-width="1.4" stroke-linejoin="round"/>'
        + '<polygon points="9,29 12,19 20,17 27,21 29,29" fill="#71717A"/>'
        + '<g class="prop-crystal">'
        + '  <polygon points="15,21 19,8 23,21 19,25" fill="' + crystal + '" stroke="#0B0B0E" stroke-width="1.2" stroke-linejoin="round"/>'
        + '  <polygon points="12,24 11,14 16,20" fill="' + crystal + '" stroke="#0B0B0E" stroke-width="1.1"/>'
        + '  <polygon points="22,22 27,13 26,24" fill="' + crystalHi + '" stroke="#0B0B0E" stroke-width="1.1"/>'
        + '  <line x1="19" y1="11" x2="19" y2="18" stroke="' + crystalHi + '" stroke-width="1.5" stroke-linecap="round"/>'
        + '</g>'
        + '</svg>'
      );
    },

    lanternSignProp: function(lit) {
      return (
        '<svg class="prop-svg" viewBox="0 0 34 42" width="32" height="40">'
        + '<ellipse cx="17" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/>'
        + '<rect x="15" y="13" width="4" height="24" rx="1.2" fill="#5C3A21" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<rect x="14" y="11" width="13" height="3" rx="1" fill="#7A4E2D" stroke="#0B0B0E" stroke-width="1.2"/>'
        + (lit ? '<circle class="prop-lantern-halo" cx="24" cy="21" r="10" fill="#FFE600" opacity="0.32"/>' : '')
        + '<rect x="20" y="15" width="8" height="10" rx="2" fill="' + (lit ? '#FFE600' : '#475569') + '" stroke="#0B0B0E" stroke-width="1.3"/>'
        + '<rect x="22" y="17" width="4" height="6" rx="1" fill="' + (lit ? '#FFFFFF' : '#94A3B8') + '"/>'
        + '</svg>'
      );
    },

    boatProp: function(biome) {
      var hull = biome === 'end' ? '#6D28D9' : (biome === 'nether' ? '#7F1D1D' : '#92400E');
      var trim = biome === 'end' ? '#C084FC' : (biome === 'nether' ? '#F59E0B' : '#FDE68A');
      return (
        '<svg class="prop-svg" viewBox="0 0 42 28" width="40" height="26">'
        + '<ellipse cx="21" cy="24" rx="16" ry="3" fill="rgba(255,255,255,0.28)"/>'
        + '<polygon points="4,15 38,15 32,23 10,23" fill="' + hull + '" stroke="#0B0B0E" stroke-width="1.4" stroke-linejoin="round"/>'
        + '<rect x="19.5" y="4" width="2.4" height="11" fill="#5C3A21" stroke="#0B0B0E" stroke-width="0.9"/>'
        + '<polygon points="22,5 33,10 22,13" fill="' + trim + '" stroke="#0B0B0E" stroke-width="1.1" stroke-linejoin="round"/>'
        + '</svg>'
      );
    },

    bridgeAndWaterfall: function(biome) {
      var label = biome === 'nether' ? 'Magma Gorge Crossing' : (biome === 'end' ? 'Void Rift Bridge' : 'Whispering Falls Bridge');
      var cls = biome === 'nether' ? 'island-nether-rift' : (biome === 'end' ? 'island-end-rift' : 'island-overworld-river');
      var streamCls = biome === 'nether' ? 'lava-stream' : (biome === 'end' ? 'void-stream' : 'river-stream');
      return (
        '<div class="island-feature-section ' + cls + '">'
        + '  <div class="feature-stream ' + streamCls + '">'
        + '    <div class="water-foam f1"></div>'
        + '    <div class="water-foam f2"></div>'
        + '    <div class="water-foam f3"></div>'
        + '  </div>'
        + '  <button type="button" class="map-boat-btn" title="Sail across!">' + SVGS.boatProp(biome) + '</button>'
        + '  <div class="feature-bridge">'
        + '    <div class="bridge-planks">'
        + '      <span></span><span></span><span></span><span></span><span></span>'
        + '    </div>'
        + '  </div>'
        + '  <span class="feature-tag">' + label + '</span>'
        + '</div>'
      );
    },

    treasureChest: function(isUnlocked) {
      var goldColor = isUnlocked ? '#FFE600' : '#A1A1AA';
      var bodyColor = isUnlocked ? '#8B4513' : '#4A4A55';
      var rimColor  = isUnlocked ? '#D97706' : '#27272A';
      return (
        '<svg class="scenery-svg scenery-chest" viewBox="0 0 46 42" width="56" height="52">'
        + '<ellipse cx="23" cy="38" rx="17" ry="4" fill="rgba(0,0,0,0.24)"/>'
        + (isUnlocked ? '<circle cx="23" cy="20" r="19" fill="#FFE600" opacity="0.16" class="chest-aura"/>' : '')
        + '<rect x="6" y="19" width="34" height="18" rx="3" fill="' + bodyColor + '" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<rect x="9" y="21" width="28" height="4" fill="' + rimColor + '"/>'
        + '<rect x="6" y="9" width="34" height="10" rx="3.5" fill="' + bodyColor + '" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<rect x="9" y="11" width="28" height="3" rx="1" fill="' + (isUnlocked ? '#CD853F' : '#64748B') + '"/>'
        + '<rect x="13.5" y="9" width="4" height="28" fill="' + goldColor + '" stroke="#0B0B0E" stroke-width="1.1"/>'
        + '<rect x="28.5" y="9" width="4" height="28" fill="' + goldColor + '" stroke="#0B0B0E" stroke-width="1.1"/>'
        + '<rect x="19.5" y="16" width="7" height="8" rx="1.5" fill="' + goldColor + '" stroke="#0B0B0E" stroke-width="1.4"/>'
        + '<circle cx="23" cy="19.5" r="1.2" fill="#0B0B0E"/>'
        + '</svg>'
      );
    },

    pedestalTopActive: function() {
      return (
        '<svg viewBox="0 0 76 50" width="76" height="50">'
        + '<ellipse cx="38" cy="41" rx="31" ry="8" fill="rgba(0,0,0,0.28)"/>'
        + '<path d="M9,23 A29,11 0 0 0 67,23 L67,31 A29,11 0 0 1 9,31 Z" fill="#3B3B45" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<ellipse cx="38" cy="23" rx="29" ry="11.5" fill="#7C3AED" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<ellipse cx="38" cy="23" rx="22" ry="8.5" fill="#A855F7"/>'
        + '<ellipse cx="38" cy="23" rx="14" ry="5" fill="#C084FC"/>'
        + '<ellipse cx="38" cy="23" rx="7" ry="2.6" fill="#FFFFFF"/>'
        + '</svg>'
      );
    },

    pedestalTopCompleted: function() {
      return (
        '<svg viewBox="0 0 76 46" width="76" height="46">'
        + '<ellipse cx="38" cy="39" rx="29" ry="6.8" fill="rgba(0,0,0,0.2)"/>'
        + '<path d="M9,19 A29,10.5 0 0 0 67,19 L67,27 A29,10.5 0 0 1 9,27 Z" fill="#1F2937" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<ellipse cx="38" cy="19" rx="29" ry="10.5" fill="#10B981" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<ellipse cx="38" cy="19" rx="22" ry="7.4" fill="#059669"/>'
        + '<polyline points="31,18.5 35.5,22.5 45,15" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'
        + '</svg>'
      );
    },

    pedestalTopReady: function() {
      return (
        '<svg viewBox="0 0 76 46" width="76" height="46">'
        + '<ellipse cx="38" cy="39" rx="29" ry="6.8" fill="rgba(0,0,0,0.2)"/>'
        + '<path d="M9,19 A29,10.5 0 0 0 67,19 L67,27 A29,10.5 0 0 1 9,27 Z" fill="#78350F" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<ellipse cx="38" cy="19" rx="29" ry="10.5" fill="#FBBF24" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<ellipse cx="38" cy="19" rx="22" ry="7.4" fill="#F59E0B"/>'
        + '<polygon points="38,13 39.8,17 44,17.5 40.8,20.2 41.6,24.2 38,22.1 34.4,24.2 35.2,20.2 32,17.5 36.2,17" fill="#FFFFFF"/>'
        + '</svg>'
      );
    },

    pedestalTopLocked: function() {
      return (
        '<svg viewBox="0 0 76 46" width="76" height="46">'
        + '<ellipse cx="38" cy="39" rx="29" ry="6.5" fill="rgba(0,0,0,0.16)"/>'
        + '<path d="M9,19 A29,10.5 0 0 0 67,19 L67,27 A29,10.5 0 0 1 9,27 Z" fill="#27272A" stroke="#0B0B0E" stroke-width="1.6"/>'
        + '<ellipse cx="38" cy="19" rx="29" ry="10.5" fill="#52525B" stroke="#0B0B0E" stroke-width="1.6"/>'
        + '<ellipse cx="38" cy="19" rx="22" ry="7.2" fill="#3F3F46"/>'
        + '<rect x="33.5" y="16.5" width="9" height="6.8" rx="1.4" fill="#E4E4E7" stroke="#0B0B0E" stroke-width="1.1"/>'
        + '<path d="M35.8,16.5 V13.8 a2.2,2.2 0 0 1 4.4,0 V16.5" fill="none" stroke="#E4E4E7" stroke-width="1.4"/>'
        + '</svg>'
      );
    },

    check: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4"/></svg>',
    lock: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V4.5a3 3 0 0 1 6 0V7"/></svg>',
    star: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#0B0B0E" stroke-width="1.2"><polygon points="8 1 10.2 5.5 15 6.2 11.5 9.6 12.3 14.5 8 12.2 3.7 14.5 4.5 9.6 1 6.2 5.8 5.5 8 1"/></svg>',
    coin: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#0B0B0E" stroke-width="1.4"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3.2" fill="#F59E0B"/></svg>',
    compass: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="6"/><polygon points="10.5,5.5 9,9.5 5.5,10.5 7,6.5" fill="currentColor"/></svg>',
    gem: '<svg viewBox="0 0 16 16" width="13" height="13" fill="#38BDF8" stroke="#0B0B0E" stroke-width="1.1"><polygon points="4,2 12,2 15,6 8,14 1,6"/></svg>',
    close: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>'
  };

  // ── 4. View Mode Toggle ─────────────────────────────────────────────────────
  var _mapViewMode = 'trail';
  try {
    var savedMode = localStorage.getItem('javaqst_map_view_mode') || localStorage.getItem('javaquest_map_view_mode');
    if (savedMode === 'trail' || savedMode === 'list') {
      _mapViewMode = savedMode;
    }
  } catch (e) {}

  function setMapViewMode(mode) {
    if (mode) _mapViewMode = (mode === 'list') ? 'list' : 'trail';
    try {
      localStorage.setItem('javaqst_map_view_mode', _mapViewMode);
      localStorage.setItem('javaquest_map_view_mode', _mapViewMode);
    } catch (e) {}

    var btnTrail = document.getElementById('btn-map-view-trail');
    var btnList  = document.getElementById('btn-map-view-list');
    var trailWrap = document.getElementById('adventure-trail-wrap');
    var listWrap  = document.getElementById('chapters-accordion');

    if (btnTrail && btnList) {
      btnTrail.classList.toggle('active', _mapViewMode === 'trail');
      btnList.classList.toggle('active', _mapViewMode === 'list');
    }
    if (trailWrap && listWrap) {
      trailWrap.classList.toggle('hidden', _mapViewMode !== 'trail');
      listWrap.classList.toggle('hidden', _mapViewMode === 'trail');
    }
    if (_mapViewMode === 'trail' && typeof window.relayoutAdventurePaths === 'function') {
      requestAnimationFrame(window.relayoutAdventurePaths);
    }
  }
  window.setMapViewMode = setMapViewMode;

  // ── 5. Player Voxel Avatar Sprite (Interactive Click-to-Cheer!) ─────────────
  function renderPlayerMapSprite(player, modTitle) {
    var p = player || (window.STATE && window.STATE.player) || (typeof window.getPlayerState === 'function' ? window.getPlayerState() : {});
    var rawSkin = p.minecraftSkin || (p.avatar && p.avatar.skin) || p.avatarSkin || 'blockhead';
    var skinAlias = {
      steve: 'blockhead', alex: 'scout', creeper: 'hisser', diamond_knight: 'crystal_knight',
      ender_coder: 'void_coder', redstone: 'circuit_mage', cyber_steve: 'cyber_crafter', golden_king: 'gilded_monarch'
    };
    if (skinAlias[rawSkin]) rawSkin = skinAlias[rawSkin];

    var skins = window.MINECRAFT_SKINS || (typeof MINECRAFT_SKINS !== 'undefined' ? MINECRAFT_SKINS : {});
    var skinData = skins[rawSkin] || skins.blockhead;
    var hatKey = p.avatarHat || (p.avatar && p.avatar.hat) || 'none';
    var hats = window.MINECRAFT_HATS || (typeof MINECRAFT_HATS !== 'undefined' ? MINECRAFT_HATS : {});
    var hatData = hats[hatKey] || null;
    var capeKey = p.avatarCape || (p.avatar && p.avatar.cape) || 'none';
    var capes = window.MINECRAFT_CAPES || (typeof MINECRAFT_CAPES !== 'undefined' ? MINECRAFT_CAPES : {});
    var capeData = capes[capeKey] || null;

    var renderFn = window.renderMinecraftSVG || (typeof renderMinecraftSVG === 'function' ? renderMinecraftSVG : null);
    var faceSvg = (renderFn && skinData)
      ? renderFn(skinData.grid, hatData ? hatData.grid : null)
      : '<div style="width:100%;height:100%;background:#C68B59;"></div>';

    var bodyColors = {
      blockhead:      { shirt: '#00B4D8', belt: '#5C3A21', pants: '#2C3E82' },
      scout:          { shirt: '#4C7837', belt: '#3E2723', pants: '#795548' },
      crystal_knight: { shirt: '#36B3A8', belt: '#26968D', pants: '#1E1E24' },
      hisser:         { shirt: '#45A03A', belt: '#388E3C', pants: '#1E1E24' },
      void_coder:     { shirt: '#241D35', belt: '#181424', pants: '#181424' },
      circuit_mage:   { shirt: '#E63946', belt: '#7F7F7F', pants: '#38210F' },
      cyber_crafter:  { shirt: '#1E1E24', belt: '#00F0FF', pants: '#111116' },
      gilded_monarch: { shirt: '#FFD700', belt: '#B45309', pants: '#2B1E16' }
    };

    var colors = bodyColors[rawSkin] || bodyColors.blockhead;
    var capeAccent = (capeData && capeData.color && capeData.color !== 'transparent')
      ? '<div class="player-cape-back" style="background:' + capeData.color + '"></div>'
      : '';

    return (
      '<div class="station-character-sprite player-character-sprite" role="button" tabindex="0" title="Tap champion to cheer!" data-mod-title="' + esc(modTitle || 'Next Quest') + '">'
      + '  <div class="station-speech-bubble">Next Quest</div>'
      + '  <div class="player-voxel-body">'
      +      capeAccent
      + '    <div class="player-voxel-head">' + faceSvg + '</div>'
      + '    <div class="player-voxel-torso" style="background:' + colors.shirt + '">'
      + '      <div class="player-arm arm-left" style="background:' + colors.shirt + '"></div>'
      + '      <div class="player-arm arm-right" style="background:' + colors.shirt + '"></div>'
      + '      <div class="player-belt" style="background:' + colors.belt + '"></div>'
      + '    </div>'
      + '    <div class="player-voxel-legs">'
      + '      <div class="player-leg leg-left" style="background:' + colors.pants + '"></div>'
      + '      <div class="player-leg leg-right" style="background:' + colors.pants + '"></div>'
      + '    </div>'
      + '  </div>'
      + '</div>'
    );
  }

  // ── 6. Measure Stations & Draw Winding Cobblestone SVG Path + Terrain ───────
  function buildTrailPathsSVG(canvas, biome, activeIdx) {
    if (!canvas) return;
    var svg = canvas.querySelector('.trail-world-svg');
    if (!svg) return;

    var w = canvas.clientWidth || 720;
    var h = canvas.scrollHeight || canvas.clientHeight || 960;
    if (w < 10 || h < 10) return;

    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    var pedestals = canvas.querySelectorAll('.island-pedestal');
    var chestBtn = canvas.querySelector('.capstone-chest-btn');
    var cRect = canvas.getBoundingClientRect();

    var points = [];
    pedestals.forEach(function(p) {
      var r = p.getBoundingClientRect();
      points.push({
        x: (r.left - cRect.left) + (r.width * 0.5),
        y: (r.top - cRect.top) + (r.height * 0.65)
      });
    });
    if (chestBtn) {
      var cr = chestBtn.getBoundingClientRect();
      points.push({
        x: (cr.left - cRect.left) + (cr.width * 0.5),
        y: (cr.top - cRect.top) + 32
      });
    }

    if (points.length < 2) return;

    // Terrain Biome Palettes
    var isDark = document.body.classList.contains('dark-theme');
    var terrainTheme = {
      overworld: isDark ? {
        plateauTop: '#162822', plateauRim: '#0F1C18', plateauBorder: 'rgba(110, 231, 183, 0.16)',
        roadOuter: '#1F2937', roadInner: '#334155', cobble: '#475569',
        litGlow: '#10B981', water: '#0284C7', foam: '#7DD3FC'
      } : {
        plateauTop: '#E4F3D8', plateauRim: '#C5DFB3', plateauBorder: 'rgba(22, 101, 52, 0.22)',
        roadOuter: '#9A7B56', roadInner: '#E7D8BE', cobble: '#B89F7D',
        litGlow: '#10B981', water: '#38BDF8', foam: '#FFFFFF'
      },
      nether: {
        plateauTop: '#2A1116', plateauRim: '#1A080C', plateauBorder: 'rgba(249, 115, 22, 0.25)',
        roadOuter: '#18181B', roadInner: '#3F1D24', cobble: '#5C262E',
        litGlow: '#F59E0B', water: '#EA580C', foam: '#FDBA74'
      },
      end: {
        plateauTop: '#1A112C', plateauRim: '#110920', plateauBorder: 'rgba(192, 132, 252, 0.26)',
        roadOuter: '#1E1B2E', roadInner: '#2E234B', cobble: '#4C3B78',
        litGlow: '#A855F7', water: '#6D28D9', foam: '#E9D5FF'
      }
    }[biome || 'overworld'];

    // Measure exact river bridge crossing height so plateaus & waterfall meet it cleanly
    var featureEl = canvas.querySelector('.island-feature-section');
    var bridgeRect = featureEl ? featureEl.getBoundingClientRect() : null;
    var riverTop = bridgeRect ? Math.round(bridgeRect.top - cRect.top) : Math.round(h * 0.45);
    var riverBottom = bridgeRect ? Math.round(bridgeRect.bottom - cRect.top) : Math.round(h * 0.52);

    var pLeft = Math.max(22, Math.round(w * 0.045));
    var pRight = Math.min(w - 14, Math.round(w * 0.96));
    var p1Bottom = Math.max(160, riverTop - 10);
    var p2Top = Math.min(h - 160, riverBottom + 10);

    var plateau1 = 'M ' + (pLeft + 18) + ' 26 L ' + (pRight - 22) + ' 26 Q ' + pRight + ' 26 ' + pRight + ' 54 L ' + (pRight - 6) + ' ' + (p1Bottom - 20) + ' Q ' + (pRight - 8) + ' ' + p1Bottom + ' ' + (pRight - 36) + ' ' + p1Bottom + ' L ' + (pLeft + 26) + ' ' + p1Bottom + ' Q ' + pLeft + ' ' + p1Bottom + ' ' + pLeft + ' ' + (p1Bottom - 24) + ' L ' + (pLeft + 4) + ' 54 Q ' + (pLeft + 6) + ' 26 ' + (pLeft + 18) + ' 26 Z';
    var plateau2 = 'M ' + (pLeft + 24) + ' ' + p2Top + ' L ' + (pRight - 20) + ' ' + p2Top + ' Q ' + pRight + ' ' + p2Top + ' ' + pRight + ' ' + (p2Top + 26) + ' L ' + (pRight - 14) + ' ' + (h - 28) + ' Q ' + (pRight - 18) + ' ' + (h - 8) + ' ' + (w * 0.5 + 90) + ' ' + (h - 8) + ' L ' + (w * 0.5 - 90) + ' ' + (h - 8) + ' Q ' + (pLeft + 22) + ' ' + (h - 8) + ' ' + (pLeft + 14) + ' ' + (h - 32) + ' L ' + (pLeft + 6) + ' ' + (p2Top + 26) + ' Q ' + (pLeft + 8) + ' ' + p2Top + ' ' + (pLeft + 24) + ' ' + p2Top + ' Z';

    // Cascading Waterfall Column anchored on far-left outer cliff bank, draining right into river bank
    var wfX = 4;
    var wfEndY = Math.max(120, riverTop + 14);
    var waterfallSVG = ''
      + '<g class="trail-waterfall">'
      + '  <rect x="' + wfX + '" y="46" width="13" height="' + (wfEndY - 46) + '" rx="6" fill="' + terrainTheme.water + '" opacity="0.9"/>'
      + '  <line class="wf-stream-line" x1="' + (wfX + 4) + '" y1="54" x2="' + (wfX + 4) + '" y2="' + (wfEndY - 6) + '" stroke="' + terrainTheme.foam + '" stroke-width="1.8" stroke-dasharray="10 12" stroke-linecap="round"/>'
      + '  <line class="wf-stream-line wf-delay" x1="' + (wfX + 9) + '" y1="62" x2="' + (wfX + 9) + '" y2="' + (wfEndY - 6) + '" stroke="' + terrainTheme.foam + '" stroke-width="1.4" stroke-dasharray="7 14" stroke-linecap="round"/>'
      + '  <ellipse cx="' + (wfX + 7) + '" cy="' + wfEndY + '" rx="12" ry="4.5" fill="' + terrainTheme.foam + '" opacity="0.5" class="wf-mist"/>'
      + '</g>';

    // Build smooth Cubic Bezier segments between consecutive waypoints
    var fullPathD = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
    var litIdx = clamp(typeof activeIdx === 'number' ? activeIdx : 0, 0, points.length - 1);
    var litPathD = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
    var segPathsHtml = '';

    for (var i = 0; i < points.length - 1; i++) {
      var a = points[i];
      var b = points[i + 1];
      var cpY1 = a.y + (b.y - a.y) * 0.55;
      var cpY2 = a.y + (b.y - a.y) * 0.45;
      var seg = ' C ' + a.x.toFixed(1) + ' ' + cpY1.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + cpY2.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      fullPathD += seg;
      if (i < litIdx) {
        litPathD += seg;
      }
      segPathsHtml += '<path class="trail-segment-hover" data-seg-idx="' + (i + 1) + '" d="M ' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + seg + '" fill="none" stroke="' + terrainTheme.litGlow + '" stroke-width="20" stroke-linecap="round" opacity="0"/>';
    }

    svg.innerHTML = (
      '<!-- Upper & Lower Sculpted Island Plateaus -->'
      + '<g class="terrain-plateaus">'
      + '  <path d="' + plateau1 + '" transform="translate(0, 10)" fill="' + terrainTheme.plateauRim + '"/>'
      + '  <path d="' + plateau1 + '" fill="' + terrainTheme.plateauTop + '" stroke="' + terrainTheme.plateauBorder + '" stroke-width="2"/>'
      + '  <path d="' + plateau2 + '" transform="translate(0, 10)" fill="' + terrainTheme.plateauRim + '"/>'
      + '  <path d="' + plateau2 + '" fill="' + terrainTheme.plateauTop + '" stroke="' + terrainTheme.plateauBorder + '" stroke-width="2"/>'
      + '</g>'
      + waterfallSVG
      + '<!-- Layered Winding Cobblestone Trail -->'
      + '<g class="terrain-road">'
      + '  <path d="' + fullPathD + '" fill="none" stroke="' + terrainTheme.roadOuter + '" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>'
      + '  <path d="' + fullPathD + '" fill="none" stroke="' + terrainTheme.roadInner + '" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>'
      + '  <path d="' + fullPathD + '" fill="none" stroke="' + terrainTheme.cobble + '" stroke-width="10" stroke-dasharray="2 16" stroke-linecap="round" opacity="0.85"/>'
      +    segPathsHtml
      + (litIdx > 0
          ? ('<path class="trail-progress-glow" d="' + litPathD + '" fill="none" stroke="' + terrainTheme.litGlow + '" stroke-width="5" stroke-dasharray="10 10" stroke-linecap="round"/>')
          : '')
      + '</g>'
    );
  }

  window.relayoutAdventurePaths = function() {
    var activeBoard = document.querySelector('#adventure-trail-wrap .island-canvas');
    if (!activeBoard) return;
    var biome = activeBoard.getAttribute('data-biome') || 'overworld';
    var activeIdx = parseInt(activeBoard.getAttribute('data-active-idx') || '0', 10);
    buildTrailPathsSVG(activeBoard, biome, activeIdx);
  };

  var _trailResizeObserver = null;

  // ── 7. Render Living Interactive Diorama Trail Map ──────────────────────────
  function renderAdventureTrail(container, filteredMods, activeTrackFilter) {
    if (!container) return;
    container.innerHTML = '';

    var player = (typeof getPlayerState === 'function') ? getPlayerState() : { completedLessons: [], completedModules: [] };
    var completedModules = player.completedModules || [];
    var allCurriculum = window.CURRICULUM || [];

    var currentTrack = 'beginner';
    if (activeTrackFilter === 'intermediate') currentTrack = 'intermediate';
    else if (activeTrackFilter === 'advanced') currentTrack = 'advanced';
    else if (activeTrackFilter === 'all') {
      var hasIntermediate = completedModules.some(function(id) { return id.startsWith('b8') || id.startsWith('i'); });
      var hasAdvanced = completedModules.some(function(id) { return id.startsWith('i8') || id.startsWith('a'); });
      if (hasAdvanced) currentTrack = 'advanced';
      else if (hasIntermediate) currentTrack = 'intermediate';
      else currentTrack = 'beginner';
    }

    var trackMods = allCurriculum.filter(function(m) { return m.level === currentTrack; });
    if (!trackMods.length && filteredMods && filteredMods.length) {
      trackMods = filteredMods.slice(0, 8);
    }

    var trackTitles = {
      beginner: {
        badge: 'TRACK 1 • BEGINNER OVERWORLD',
        title: 'Beginner Overworld',
        sub: 'Tap quests, poke trees & campfires, mine glowing crystals, or sail the river bridge!',
        cube: SVGS.grassBlock(),
        biomeName: 'overworld',
        capstoneId: 'proj-beginner',
        capstoneTitle: 'Personal Expense Tracker',
        lore: ['Oak leaves whisper: Everything extends Object.', 'Campfire JVM warms bytecode cleanly!', 'Crystal Vein: Java 21 brings Virtual Threads!', 'Lantern Note: Prefer final fields where safe.']
      },
      intermediate: {
        badge: 'TRACK 2 • INTERMEDIATE THE NETHER',
        title: 'The Nether Realm',
        sub: 'Master OOP, Collections, Streams & I/O across volcanic basalt ridges!',
        cube: SVGS.netherrackBlock(),
        biomeName: 'nether',
        capstoneId: 'proj-intermediate',
        capstoneTitle: 'Library Management System',
        lore: ['Crimson Shroom: Streams evaluate lazily!', 'Soul Brazier stoked: Try-with-resources guards I/O!', 'Gold Ore: HashMap lookup averages O(1)!', 'Nether Sign: Records make immutable DTOs effortless.']
      },
      advanced: {
        badge: 'TRACK 3 • ADVANCED THE END',
        title: 'The End Gateway',
        sub: 'Conquer JVM Memory, Virtual Threads & Spring Cloud across obsidian spires!',
        cube: SVGS.endStoneBlock(),
        biomeName: 'end',
        capstoneId: 'proj-advanced',
        capstoneTitle: 'Cloud Banking Core Engine',
        lore: ['Obsidian Obelisk hums with JIT C2 compilation!', 'End Crystal charged: G1GC balances low pauses!', 'Ender Shard: StructuredTaskScope prevents leaks!', 'Void Sign: Spring Boot Actuator monitors health cleanly.']
      }
    };

    var meta = trackTitles[currentTrack] || trackTitles.beginner;
    var doneModCount = 0;
    trackMods.forEach(function(m) {
      if (completedModules.indexOf(m.id) !== -1) doneModCount++;
    });

    // Relic count for current realm (2 mineable ore nodes + 1 lantern/lore discovery + 1 crossing voyage = trackable fun relics!)
    var collectedRelics = loadCollectedRelics();
    var biomeRelicKeys = [
      meta.biomeName + '_ore_1',
      meta.biomeName + '_ore_2',
      meta.biomeName + '_campfire',
      meta.biomeName + '_boat'
    ];
    function countBiomeRelics() {
      var c = loadCollectedRelics();
      var total = 0;
      biomeRelicKeys.forEach(function(k) { if (c[k]) total++; });
      return total;
    }

    // ── Outer Interactive Diorama Board ──
    var board = document.createElement('div');
    board.className = 'adventure-trail-board island-mountain-board';
    board.setAttribute('data-biome', meta.biomeName);

    // Spatial Apple Parallax Depth on Pointer Move
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      var parallaxQueued = false;
      board.addEventListener('pointermove', function(e) {
        if (parallaxQueued) return;
        parallaxQueued = true;
        requestAnimationFrame(function() {
          var rect = board.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            var nx = (((e.clientX - rect.left) / rect.width) - 0.5) * 2;
            var ny = (((e.clientY - rect.top) / rect.height) - 0.5) * 2;
            board.style.setProperty('--mx', clamp(nx, -1, 1).toFixed(3));
            board.style.setProperty('--my', clamp(ny, -1, 1).toFixed(3));
          }
          parallaxQueued = false;
        });
      }, { passive: true });
      board.addEventListener('pointerleave', function() {
        board.style.setProperty('--mx', '0');
        board.style.setProperty('--my', '0');
      });
    }

    // Atmospheric Floating Sky Clouds & Ambient Fireflies/Embers
    var skyDecor = document.createElement('div');
    skyDecor.className = 'island-sky-decor';
    skyDecor.innerHTML = (
      '<div class="pixel-cloud c1"></div>'
      + '<div class="pixel-cloud c2"></div>'
      + '<div class="pixel-cloud c3"></div>'
      + '<div class="ambient-mote m1"></div>'
      + '<div class="ambient-mote m2"></div>'
      + '<div class="ambient-mote m3"></div>'
      + '<div class="ambient-mote m4"></div>'
    );
    board.appendChild(skyDecor);

    // ── Top Frosted Apple-Styled Biome HUD Bar ──
    var headerBar = document.createElement('div');
    headerBar.className = 'island-header-bar';
    var relicCount = countBiomeRelics();
    headerBar.innerHTML = (
      '<div class="island-header-left">'
      + '  <div class="island-biome-cube" title="Interactive Realm Block">' + meta.cube + '</div>'
      + '  <div class="island-title-group">'
      + '    <div class="island-badge-pill">' + esc(meta.badge) + '</div>'
      + '    <h2 class="island-heading">' + esc(meta.title) + '</h2>'
      + '    <p class="island-sub">' + esc(meta.sub) + '</p>'
      + '  </div>'
      + '</div>'
      + '<div class="island-header-right">'
      + '  <div class="island-stats-row">'
      + '    <div class="island-stat-chip" title="Realm exploration discoveries (tap glowing crystals, campfire, & boat!)">'
      + '      <span class="chip-icon">' + SVGS.gem + '</span>'
      + '      <span class="chip-val" id="island-relic-count">' + relicCount + '/4</span>'
      + '    </div>'
      + '    <div class="island-stat-chip">'
      + '      <span class="chip-val">' + doneModCount + '/' + trackMods.length + '</span>'
      + '      <div class="island-mini-bar"><div class="mini-bar-fill" style="width:' + (doneModCount / (trackMods.length || 1) * 100) + '%"></div></div>'
      + '    </div>'
      + '    <button type="button" class="island-locate-btn" id="btn-locate-champion" title="Scroll to your active quest pedestal">'
      +        SVGS.compass + '<span>Locate</span>'
      + '    </button>'
      + '  </div>'
      + '  <div class="island-track-tabs">'
      + '    <button type="button" class="track-pill-btn ' + (currentTrack === 'beginner' ? 'active' : '') + '" data-track="beginner">Beginner</button>'
      + '    <button type="button" class="track-pill-btn ' + (currentTrack === 'intermediate' ? 'active' : '') + '" data-track="intermediate">Intermediate</button>'
      + '    <button type="button" class="track-pill-btn ' + (currentTrack === 'advanced' ? 'active' : '') + '" data-track="advanced">Advanced</button>'
      + '  </div>'
      + '</div>'
    );
    board.appendChild(headerBar);

    headerBar.querySelectorAll('.track-pill-btn').forEach(function(btn) {
      btn.onclick = function() {
        var trk = btn.getAttribute('data-track');
        if (typeof window.setTrackFilter === 'function') {
          window.setTrackFilter(trk);
        } else {
          renderAdventureTrail(container, filteredMods, trk);
        }
      };
    });

    // ── Island Canvas & Synced Terrain Layer ──
    var canvas = document.createElement('div');
    canvas.className = 'island-canvas';
    canvas.setAttribute('data-biome', meta.biomeName);

    var terrainSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    terrainSvg.setAttribute('class', 'trail-world-svg');
    terrainSvg.setAttribute('aria-hidden', 'true');
    canvas.appendChild(terrainSvg);

    var offsets = [
      { x: -58, align: 'pill-right' },
      { x: 34,  align: 'pill-left' },
      { x: 72,  align: 'pill-left' },
      { x: -46, align: 'pill-right' },
      { x: 64,  align: 'pill-left' },
      { x: -54, align: 'pill-right' },
      { x: 36,  align: 'pill-left' },
      { x: 0,   align: 'pill-right' }
    ];

    var firstActiveFound = false;
    var activeStationIdx = 0;

    function refreshRelicCounter() {
      var el = headerBar.querySelector('#island-relic-count');
      if (el) el.textContent = countBiomeRelics() + '/4';
    }

    // Helper for Interactive Map Props
    function attachInteractiveProp(station, sideClass, propType, relicKey, loreText, html) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'station-scenery interactive-prop prop-' + propType + ' ' + sideClass;
      if (relicKey && collectedRelics[relicKey]) btn.classList.add('prop-discovered');
      btn.setAttribute('aria-label', loreText || 'Interactive biome prop');
      btn.innerHTML = html;

      btn.onclick = function(e) {
        e.stopPropagation();
        btn.classList.remove('prop-bouncing');
        void btn.offsetWidth;
        btn.classList.add('prop-bouncing');
        setTimeout(function() { btn.classList.remove('prop-bouncing'); }, 520);

        if (propType === 'campfire') {
          btn.classList.toggle('fire-stoked');
          spawnMapParticles(btn, ['#F97316', '#FFE600', '#FFFFFF'], 9);
          if (window.GameFX && window.GameFX.playXpPop) window.GameFX.playXpPop();
        } else if (propType === 'tree') {
          var pColors = meta.biomeName === 'nether' ? ['#DC2626', '#FCA5A5', '#FFE600'] : (meta.biomeName === 'end' ? ['#A855F7', '#E9D5FF', '#FFFFFF'] : ['#52B756', '#8AE48F', '#FDE047']);
          spawnMapParticles(btn, pColors, 8);
          if (window.GameFX && window.GameFX.playClick) window.GameFX.playClick();
        } else if (propType === 'ore') {
          spawnMapParticles(btn, ['#38BDF8', '#FFE600', '#FFFFFF'], 11);
          if (window.GameFX && window.GameFX.playBlockBreak) window.GameFX.playBlockBreak();
          btn.classList.add('prop-discovered');
          btn.innerHTML = SVGS.oreRelicProp(meta.biomeName, true);
        } else if (propType === 'lantern') {
          var nowLit = !btn.classList.contains('lantern-lit');
          btn.classList.toggle('lantern-lit', nowLit);
          btn.innerHTML = SVGS.lanternSignProp(nowLit);
          spawnMapParticles(btn, ['#FFE600', '#FEF08A'], 6);
          if (window.GameFX && window.GameFX.playClick) window.GameFX.playClick();
        }

        if (relicKey) {
          saveCollectedRelic(relicKey);
          refreshRelicCounter();
        }
        if (loreText) showPropPopCallout(btn, loreText);
      };
      station.appendChild(btn);
    }

    // Render 8 Stepping Stone Stations
    trackMods.forEach(function(mod, modIdx) {
      var isModDone = completedModules.indexOf(mod.id) !== -1;
      var isModUnlocked = (typeof window.isModUnlocked === 'function') ? window.isModUnlocked(mod.id) : true;
      var isActiveStation = !isModDone && isModUnlocked && !firstActiveFound;

      if (isActiveStation) {
        firstActiveFound = true;
        activeStationIdx = modIdx;
      } else if (isModDone) {
        activeStationIdx = Math.max(activeStationIdx, modIdx + 1);
      }

      // Scenic River & Sailboat Crossing between Ch 03 & Ch 04
      if (modIdx === 3) {
        var bridgeWrap = document.createElement('div');
        bridgeWrap.className = 'island-feature-wrap';
        bridgeWrap.innerHTML = SVGS.bridgeAndWaterfall(meta.biomeName);
        var boatBtn = bridgeWrap.querySelector('.map-boat-btn');
        if (boatBtn) {
          boatBtn.onclick = function(e) {
            e.stopPropagation();
            boatBtn.classList.remove('boat-sailing');
            void boatBtn.offsetWidth;
            boatBtn.classList.add('boat-sailing');
            spawnMapParticles(boatBtn, ['#38BDF8', '#FFFFFF', '#FFE600'], 8);
            if (window.GameFX && window.GameFX.playMeowChirp) window.GameFX.playMeowChirp();
            saveCollectedRelic(meta.biomeName + '_boat');
            refreshRelicCounter();
            showPropPopCallout(boatBtn, 'Bon voyage! Crossing the midpoint rapids!');
            setTimeout(function() { boatBtn.classList.remove('boat-sailing'); }, 1500);
          };
        }
        canvas.appendChild(bridgeWrap);
      }

      var pos = offsets[modIdx % offsets.length];
      var station = document.createElement('div');
      station.className = 'island-node-station ' + (pos.align === 'pill-left' ? 'layout-pill-left' : 'layout-pill-right') + (isActiveStation ? ' is-active-station' : '');
      station.style.setProperty('--node-x', pos.x + 'px');
      station.style.setProperty('--stagger-i', modIdx);
      station.setAttribute('data-station-idx', modIdx);

      // Attach Interactive World Props cleanly on the wide Pill-side outer flank (never overlaps pedestal/champion!)
      var propSide = (pos.align === 'pill-left') ? 'prop-side-left' : 'prop-side-right';
      if (modIdx === 0) {
        attachInteractiveProp(station, propSide, 'campfire', meta.biomeName + '_campfire', meta.lore[1], SVGS.campfireProp(meta.biomeName));
      } else if (modIdx === 1) {
        attachInteractiveProp(station, propSide, 'tree', null, meta.lore[0], SVGS.treeProp(meta.biomeName));
      } else if (modIdx === 2) {
        var ore1Key = meta.biomeName + '_ore_1';
        attachInteractiveProp(station, propSide, 'ore', ore1Key, meta.lore[2], SVGS.oreRelicProp(meta.biomeName, !!collectedRelics[ore1Key]));
      } else if (modIdx === 4) {
        attachInteractiveProp(station, propSide, 'lantern', null, meta.lore[3], SVGS.lanternSignProp(false));
      } else if (modIdx === 6) {
        var ore2Key = meta.biomeName + '_ore_2';
        attachInteractiveProp(station, propSide, 'ore', ore2Key, 'Rare Relic Discovered! Check your Capstone ahead.', SVGS.oreRelicProp(meta.biomeName, !!collectedRelics[ore2Key]));
      }

      // Compute module completion ratio for progress pill bar
      var pCompletedLessons = player.completedLessons || [];
      var lessonsList = mod.lessons || [];
      var modDoneEx = 0;
      var modTotalEx = lessonsList.length + (mod.challenge ? 1 : 0) + (mod.codingTask ? 1 : 0);
      lessonsList.forEach(function(l) { if (pCompletedLessons.indexOf(l.id) !== -1) modDoneEx++; });
      if (mod.challenge && (player.completedChallenges || []).indexOf(mod.challenge.id) !== -1) modDoneEx++;
      if (mod.codingTask && (player.completedCoding || []).indexOf(mod.id) !== -1) modDoneEx++;
      var modPct = modTotalEx > 0 ? Math.round((modDoneEx / modTotalEx) * 100) : 0;

      // ── 3D Stepping Stone Pedestal Button ──
      var pedestal = document.createElement('button');
      pedestal.type = 'button';
      pedestal.className = 'island-pedestal ' + (isModDone ? 'pedestal-done' : (isActiveStation ? 'pedestal-active' : (isModUnlocked ? 'pedestal-unlocked' : 'pedestal-locked')));
      pedestal.setAttribute('aria-label', mod.title + ' (Chapter ' + (modIdx + 1) + ')');

      if (isModDone) {
        pedestal.innerHTML = SVGS.pedestalTopCompleted();
      } else if (isActiveStation) {
        pedestal.innerHTML = SVGS.pedestalTopActive()
          + '<div class="pedestal-active-ring"></div>'
          + '<div class="pedestal-active-glow"></div>'
          + renderPlayerMapSprite(player, mod.title);
      } else if (isModUnlocked) {
        pedestal.innerHTML = SVGS.pedestalTopReady();
      } else {
        pedestal.innerHTML = SVGS.pedestalTopLocked();
      }

      // Clickable Voxel Avatar Cheer interaction
      var heroSprite = pedestal.querySelector('.player-character-sprite');
      if (heroSprite) {
        heroSprite.onclick = function(e) {
          e.stopPropagation();
          heroSprite.classList.remove('hero-cheering');
          void heroSprite.offsetWidth;
          heroSprite.classList.add('hero-cheering');
          spawnMapParticles(pedestal, ['#FFE600', '#A855F7', '#10B981'], 10);
          if (window.GameFX && window.GameFX.playXpPop) window.GameFX.playXpPop();
          var bubble = heroSprite.querySelector('.station-speech-bubble');
          if (bubble) {
            var name = (player && player.name) ? String(player.name).slice(0, 18) : 'Hero';
            var phrases = ['Let\'s go, ' + name + '!', 'Ready to code!', 'Next Quest!'];
            bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
          }
          setTimeout(function() { heroSprite.classList.remove('hero-cheering'); }, 650);
        };
      }

      // ── Tactile Quest Label Pill ──
      var pill = document.createElement('div');
      pill.className = 'island-quest-pill ' + (isModDone ? 'pill-done' : (isActiveStation ? 'pill-active' : (isModUnlocked ? 'pill-unlocked' : 'pill-locked')));
      var numPrefix = (modIdx + 1 < 10) ? ('0' + (modIdx + 1)) : (modIdx + 1);

      pill.innerHTML = (
        '<div class="pill-code-badge">' + numPrefix + '</div>'
        + '<div class="pill-text-col">'
        + '  <div class="pill-title">' + esc(mod.title) + '</div>'
        + '  <div class="pill-sub">' + modDoneEx + '/' + modTotalEx + ' Quests • ' + esc(mod.biome || 'Kingdom') + '</div>'
        + '  <div class="pill-micro-track"><div class="pill-micro-fill" style="width:' + modPct + '%"></div></div>'
        + '</div>'
        + '<div class="pill-status-badge">'
        + (isModDone
            ? ('<span class="status-done-badge">' + SVGS.check + ' DONE</span>')
            : (isActiveStation
                ? '<span class="status-active-badge">START</span>'
                : (isModUnlocked ? '<span class="status-ready-badge">READY</span>' : '<span class="status-locked-badge">' + SVGS.lock + '</span>')
              )
          )
        + '</div>'
      );

      // Highlight connecting SVG path segment on hover
      function highlightSeg(on) {
        var seg = canvas.querySelector('.trail-segment-hover[data-seg-idx="' + modIdx + '"]');
        if (seg) seg.style.opacity = on ? '0.32' : '0';
      }
      station.addEventListener('pointerenter', function() { highlightSeg(true); });
      station.addEventListener('pointerleave', function() { highlightSeg(false); });

      pedestal.onclick = function() {
        openChapterNodeModal(mod, isModDone, isModUnlocked);
      };
      pill.onclick = function() {
        openChapterNodeModal(mod, isModDone, isModUnlocked);
      };

      station.appendChild(pedestal);
      station.appendChild(pill);
      canvas.appendChild(station);
    });

    // ── Capstone Summit Dais ──
    var capstoneStation = document.createElement('div');
    capstoneStation.className = 'island-capstone-station';
    var isCapstoneReady = doneModCount >= trackMods.length;

    var chestBtn = document.createElement('button');
    chestBtn.type = 'button';
    chestBtn.className = 'capstone-chest-btn ' + (isCapstoneReady ? 'chest-ready' : 'chest-locked');
    chestBtn.setAttribute('aria-label', meta.capstoneTitle + ' Capstone Reward');
    chestBtn.innerHTML = (
      SVGS.treasureChest(isCapstoneReady)
      + '<div class="capstone-label-pill">'
      + '  <span class="capstone-code-tag">' + (meta.biomeName.toUpperCase()) + ' CAPSTONE • ' + doneModCount + '/' + trackMods.length + ' CHAPTERS</span>'
      + '  <span class="capstone-name">' + esc(meta.capstoneTitle) + '</span>'
      + '  <span class="capstone-xp-chip">' + (isCapstoneReady ? 'OPEN WORKBENCH (+250 XP)' : '+250 XP REWARD') + '</span>'
      + '</div>'
    );

    chestBtn.onclick = function() {
      spawnMapParticles(chestBtn, ['#FFE600', '#10B981', '#F59E0B'], 12);
      if (typeof window.openProjectModal === 'function') {
        window.openProjectModal(meta.capstoneId);
      } else if (typeof openProjectModal === 'function') {
        openProjectModal(meta.capstoneId);
      } else if (typeof window.toast === 'function') {
        window.toast(meta.capstoneTitle + ' Workbench');
      }
    };

    capstoneStation.appendChild(chestBtn);
    canvas.appendChild(capstoneStation);
    canvas.setAttribute('data-active-idx', String(activeStationIdx));

    // Locate Current Champion Button
    var locateBtn = headerBar.querySelector('#btn-locate-champion');
    if (locateBtn) {
      locateBtn.onclick = function() {
        var targetStation = canvas.querySelector('.is-active-station') || canvas.querySelector('.island-node-station');
        if (targetStation && typeof targetStation.scrollIntoView === 'function') {
          targetStation.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetStation.classList.remove('station-pulse-highlight');
          void targetStation.offsetWidth;
          targetStation.classList.add('station-pulse-highlight');
          setTimeout(function() { targetStation.classList.remove('station-pulse-highlight'); }, 1200);
        }
      };
    }

    board.appendChild(canvas);
    container.appendChild(board);

    // Measure coordinates on next frame to draw exact connecting SVG terrain + road
    requestAnimationFrame(function() {
      buildTrailPathsSVG(canvas, meta.biomeName, activeStationIdx);
    });

    if (typeof ResizeObserver !== 'undefined') {
      if (_trailResizeObserver) _trailResizeObserver.disconnect();
      _trailResizeObserver = new ResizeObserver(function() {
        buildTrailPathsSVG(canvas, meta.biomeName, activeStationIdx);
      });
      _trailResizeObserver.observe(canvas);
    }
  }
  window.renderAdventureTrail = renderAdventureTrail;

  // ── 8. Apple-Crafted Chapter Sheet Modal (Lessons + Quiz + Coding Lab) ──────
  function openChapterNodeModal(mod, isModDone, isModUnlocked) {
    var existing = document.getElementById('trail-node-popover-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'trail-node-popover-modal';
    modal.className = 'trail-modal-backdrop';

    var player = (typeof getPlayerState === 'function') ? getPlayerState() : { completedLessons: [], completedChallenges: [], completedCoding: [] };
    var completedLessons = player.completedLessons || [];
    var completedChallenges = player.completedChallenges || [];
    var completedCoding = player.completedCoding || [];
    var lessons = mod.lessons || [];

    var nextLesson = null;
    var doneCount = 0;
    for (var i = 0; i < lessons.length; i++) {
      if (completedLessons.indexOf(lessons[i].id) !== -1) doneCount++;
      else if (!nextLesson) nextLesson = lessons[i];
    }
    if (!nextLesson && lessons.length) nextLesson = lessons[0];

    var totalItems = lessons.length + (mod.challenge ? 1 : 0) + (mod.codingTask ? 1 : 0);
    var doneItems = doneCount
      + (mod.challenge && completedChallenges.indexOf(mod.challenge.id) !== -1 ? 1 : 0)
      + (mod.codingTask && completedCoding.indexOf(mod.id) !== -1 ? 1 : 0);
    var pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    var card = document.createElement('div');
    card.className = 'trail-modal-card chapter-diorama-modal';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');

    var lessonItemsHtml = '';
    lessons.forEach(function(l, idx) {
      var done = completedLessons.indexOf(l.id) !== -1;
      var lUnlocked = isModUnlocked && (idx === 0 || completedLessons.indexOf(lessons[idx - 1].id) !== -1 || done);
      lessonItemsHtml += (
        '<div class="modal-lesson-row ' + (done ? 'lesson-done' : (!lUnlocked ? 'lesson-locked' : '')) + '">'
        + '  <div class="modal-lesson-idx">' + (done ? SVGS.check : (idx + 1)) + '</div>'
        + '  <div class="modal-lesson-info">'
        + '    <div class="modal-lesson-title">' + esc(l.title) + '</div>'
        + '    <div class="modal-lesson-xp">Interactive Lesson • +' + (l.xp || 30) + ' XP</div>'
        + '  </div>'
        + '  <button type="button" class="btn-xs modal-lesson-launch-btn" data-launch-type="lesson" data-lid="' + esc(l.id) + '" ' + (!lUnlocked ? 'disabled' : '') + '>'
        + (!lUnlocked ? 'Locked' : (done ? 'Review' : 'Play'))
        + '  </button>'
        + '</div>'
      );
    });

    // Include Quiz Challenge & Coding Workbench directly in the Chapter Modal
    var extrasUnlocked = isModUnlocked && doneCount >= lessons.length;
    if (mod.challenge) {
      var qDone = completedChallenges.indexOf(mod.challenge.id) !== -1;
      lessonItemsHtml += (
        '<div class="modal-lesson-row modal-extra-quiz ' + (qDone ? 'lesson-done' : (!extrasUnlocked ? 'lesson-locked' : '')) + '">'
        + '  <div class="modal-lesson-idx">' + (qDone ? SVGS.check : 'Q') + '</div>'
        + '  <div class="modal-lesson-info">'
        + '    <div class="modal-lesson-title">Quiz Challenge: ' + esc(mod.title) + '</div>'
        + '    <div class="modal-lesson-xp">Evaluation • +' + (mod.challenge.xp || 50) + ' XP</div>'
        + '  </div>'
        + '  <button type="button" class="btn-xs modal-lesson-launch-btn btn-quiz-pill" data-launch-type="quiz" ' + (!extrasUnlocked ? 'disabled' : '') + '>'
        + (!extrasUnlocked ? 'Locked' : (qDone ? 'Retake' : 'Start Quiz'))
        + '  </button>'
        + '</div>'
      );
    }

    if (mod.codingTask) {
      var cDone = completedCoding.indexOf(mod.id) !== -1;
      lessonItemsHtml += (
        '<div class="modal-lesson-row modal-extra-code ' + (cDone ? 'lesson-done' : (!extrasUnlocked ? 'lesson-locked' : '')) + '">'
        + '  <div class="modal-lesson-idx">' + (cDone ? SVGS.check : '&lt;&gt;') + '</div>'
        + '  <div class="modal-lesson-info">'
        + '    <div class="modal-lesson-title">' + esc(mod.codingTask.title || 'Coding Lab') + '</div>'
        + '    <div class="modal-lesson-xp">Live Java Workbench • +' + (mod.codingTask.xp || 75) + ' XP</div>'
        + '  </div>'
        + '  <button type="button" class="btn-xs modal-lesson-launch-btn btn-code-pill" data-launch-type="code" ' + (!extrasUnlocked ? 'disabled' : '') + '>'
        + (!extrasUnlocked ? 'Locked' : (cDone ? 'Solved' : 'Solve'))
        + '  </button>'
        + '</div>'
      );
    }

    card.innerHTML = (
      '<div class="trail-modal-header">'
      + '  <div class="trail-modal-badges">'
      + '    <span class="trail-modal-pill">' + esc((mod.code || 'CHAPTER').toUpperCase()) + '</span>'
      + '    <span class="trail-modal-status ' + (isModDone ? 'status-done' : (isModUnlocked ? 'status-active' : 'status-locked')) + '">'
      + (isModDone ? 'Completed' : (isModUnlocked ? 'Unlocked' : 'Locked'))
      + '    </span>'
      + '  </div>'
      + '  <button type="button" class="trail-modal-close" id="btn-close-trail-modal" aria-label="Close">' + SVGS.close + '</button>'
      + '</div>'
      + '<h2 class="trail-modal-title">' + esc(mod.title) + '</h2>'
      + '<p class="trail-modal-desc">' + esc(mod.subtitle || mod.desc || ('Master ' + mod.title + ' with OpenJDK execution.')) + '</p>'
      + '<div class="trail-modal-progress-wrap">'
      + '  <div class="trail-modal-prog-row"><span>Chapter Completion</span><strong>' + doneItems + ' / ' + totalItems + ' (' + pct + '%)</strong></div>'
      + '  <div class="trail-modal-prog-track"><div class="trail-modal-prog-fill" style="width:' + pct + '%"></div></div>'
      + '</div>'
      + '<div class="trail-modal-meta">'
      + '  <div class="trail-meta-chip">' + SVGS.coin + ' <span>' + (lessons.length * 30) + '+ XP</span></div>'
      + '  <div class="trail-meta-chip">' + SVGS.star + ' <span>' + esc(mod.biome || 'Overworld') + '</span></div>'
      + '</div>'
      + '<div class="modal-lesson-list">' + lessonItemsHtml + '</div>'
      + '<div class="trail-modal-actions">'
      + (isModUnlocked
          ? ('<button type="button" class="btn-primary trail-btn-action" id="btn-modal-start-quest">'
             + (isModDone ? 'Review Chapter Lessons' : ('Continue: ' + esc(nextLesson ? nextLesson.title : mod.title)))
             + '</button>')
          : '<button type="button" class="btn-secondary trail-btn-action" disabled>Complete earlier chapters to unlock</button>'
        )
      + '</div>'
    );

    modal.appendChild(card);
    document.body.appendChild(modal);

    function closeModal() {
      document.removeEventListener('keydown', onEsc);
      modal.remove();
    }
    function onEsc(e) {
      if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', onEsc);

    var closeBtn = card.querySelector('#btn-close-trail-modal');
    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = function(e) { if (e.target === modal) closeModal(); };

    var startBtn = card.querySelector('#btn-modal-start-quest');
    if (startBtn && nextLesson) {
      startBtn.onclick = function() {
        closeModal();
        if (typeof window.startLesson === 'function') window.startLesson(mod.id, nextLesson.id);
      };
    }

    card.querySelectorAll('.modal-lesson-launch-btn').forEach(function(b) {
      b.onclick = function() {
        if (b.disabled) return;
        var launchType = b.getAttribute('data-launch-type');
        var lid = b.getAttribute('data-lid');
        closeModal();
        if (launchType === 'lesson' && typeof window.startLesson === 'function') {
          window.startLesson(mod.id, lid);
        } else if (launchType === 'quiz' && typeof window.startChallenge === 'function') {
          window.startChallenge(mod.id);
        } else if (launchType === 'code' && typeof window.startCodingChallenge === 'function') {
          window.startCodingChallenge(mod.id);
        }
      };
    });
  }
})();
