// JavaQst — adventure-trail.js
// Isometric Mountain Trail & Floating Island Map (Tamed Neobrutalist Theme)
// 100% Pure Inline SVG Pixel-Art Architecture — Zero Unicode Emojis
// Full Day Mode & Night Mode High-Contrast Compatibility

(function() {
  'use strict';

  // ── 1. Pure SVG Scenery, Blocks & Icon Generators (Zero Emoji) ──────────────
  var SVGS = {
    // 3D Isometric Grass Block (Overworld)
    grassBlock: function() {
      return (
        '<svg class="biome-cube-svg" viewBox="0 0 36 36" width="34" height="34" shape-rendering="crispEdges">'
        + '<!-- Top Face (Lush Green Grass) -->'
        + '<polygon points="18,3 33,11 18,20 3,11" fill="#52B756"/>'
        + '<polygon points="18,3 33,11 18,20 3,11" fill="none" stroke="#2E7D32" stroke-width="1"/>'
        + '<!-- Left Face (Dirt with Grass Overhang) -->'
        + '<polygon points="3,11 18,20 18,33 3,24" fill="#6D4321"/>'
        + '<polygon points="3,11 18,20 18,23 3,14" fill="#3D8B40"/>'
        + '<!-- Right Face (Lighter Dirt with Grass Overhang) -->'
        + '<polygon points="18,20 33,11 33,24 18,33" fill="#8B5A2B"/>'
        + '<polygon points="18,20 33,11 33,14 18,23" fill="#52B756"/>'
        + '<!-- Neobrutalist Ink Outlines -->'
        + '<polygon points="18,3 33,11 33,24 18,33 3,24 3,11" fill="none" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<line x1="18" y1="20" x2="18" y2="33" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '</svg>'
      );
    },

    // 3D Isometric Netherrack Block (The Nether)
    netherrackBlock: function() {
      return (
        '<svg class="biome-cube-svg" viewBox="0 0 36 36" width="34" height="34" shape-rendering="crispEdges">'
        + '<polygon points="18,3 33,11 18,20 3,11" fill="#8B1E2B"/>'
        + '<polygon points="3,11 18,20 18,33 3,24" fill="#54121A"/>'
        + '<polygon points="18,20 33,11 33,24 18,33" fill="#6B1822"/>'
        + '<rect x="16" y="9" width="3" height="3" fill="#FF4500"/>'
        + '<rect x="8" y="19" width="3" height="3" fill="#FF4500"/>'
        + '<rect x="24" y="21" width="3" height="3" fill="#FF8C00"/>'
        + '<polygon points="18,3 33,11 33,24 18,33 3,24 3,11" fill="none" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<line x1="18" y1="20" x2="18" y2="33" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '</svg>'
      );
    },

    // 3D Isometric End Stone Block (The End)
    endStoneBlock: function() {
      return (
        '<svg class="biome-cube-svg" viewBox="0 0 36 36" width="34" height="34" shape-rendering="crispEdges">'
        + '<polygon points="18,3 33,11 18,20 3,11" fill="#E6E4A8"/>'
        + '<polygon points="3,11 18,20 18,33 3,24" fill="#B0AE74"/>'
        + '<polygon points="18,20 33,11 33,24 18,33" fill="#C9C78A"/>'
        + '<rect x="15" y="8" width="2" height="2" fill="#7C3AED"/>'
        + '<rect x="24" y="18" width="2" height="2" fill="#7C3AED"/>'
        + '<polygon points="18,3 33,11 33,24 18,33 3,24 3,11" fill="none" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '<line x1="18" y1="20" x2="18" y2="33" stroke="#0B0B0E" stroke-width="1.8"/>'
        + '</svg>'
      );
    },

    // Overworld Oak Tree (Crisp Pixel Art)
    treeOverworld: function() {
      return (
        '<svg class="scenery-svg scenery-tree" viewBox="0 0 44 54" width="48" height="58" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="22" cy="50" rx="14" ry="3" fill="rgba(0,0,0,0.18)"/>'
        + '<rect x="18" y="30" width="8" height="18" fill="#5C3A21" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<rect x="20" y="34" width="3" height="12" fill="#7A4E2D"/>'
        + '<!-- Foliage Layers -->'
        + '<rect x="6" y="18" width="32" height="14" rx="2" fill="#2E6930" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<rect x="9" y="11" width="26" height="12" rx="2" fill="#3D8B40" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<rect x="13" y="4" width="18" height="10" rx="2" fill="#52B756" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<rect x="15" y="6" width="6" height="3" fill="#78D17B"/>'
        + '<rect x="25" y="13" width="5" height="3" fill="#78D17B"/>'
        + '</svg>'
      );
    },

    // Nether Crimson Fungi
    treeNether: function() {
      return (
        '<svg class="scenery-svg scenery-tree" viewBox="0 0 44 54" width="48" height="58" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="22" cy="50" rx="14" ry="3" fill="rgba(0,0,0,0.3)"/>'
        + '<rect x="18" y="26" width="8" height="22" fill="#3A1728" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<path d="M5 26 C5 10 39 10 39 26 Z" fill="#8B0000" stroke="#0B0B0E" stroke-width="1.5"/>'
        + '<path d="M9 22 C9 12 35 12 35 22 Z" fill="#DC2626"/>'
        + '<rect x="13" y="14" width="4" height="4" fill="#FCA5A5"/>'
        + '<rect x="26" y="16" width="4" height="3" fill="#FCA5A5"/>'
        + '<circle cx="15" cy="30" r="2.5" fill="#FFE600" opacity="0.9"/>'
        + '</svg>'
      );
    },

    // The End Obsidian Obelisk
    treeEnd: function() {
      return (
        '<svg class="scenery-svg scenery-tree" viewBox="0 0 38 64" width="42" height="70" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="19" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.4)"/>'
        + '<polygon points="8,58 13,8 25,8 30,58" fill="#181324" stroke="#0B0B0E" stroke-width="1.5"/>'
        + '<polygon points="12,58 15,8 23,8 26,58" fill="#2E2445"/>'
        + '<circle cx="19" cy="6" r="4.5" fill="#C084FC"/>'
        + '<circle cx="19" cy="6" r="2" fill="#FAF5FF"/>'
        + '<rect x="15" y="24" width="2" height="6" fill="#A855F7" opacity="0.8"/>'
        + '<rect x="22" y="38" width="2" height="5" fill="#A855F7" opacity="0.8"/>'
        + '</svg>'
      );
    },

    // Pixel Wooden Wall Torch (Animated Flame)
    torch: function() {
      return (
        '<svg class="scenery-svg scenery-torch" viewBox="0 0 16 26" width="20" height="32" fill="none" shape-rendering="crispEdges">'
        + '<rect x="6" y="10" width="4" height="15" fill="#6B4226" stroke="#0B0B0E" stroke-width="1"/>'
        + '<rect x="5" y="7" width="6" height="4" fill="#3F3F46"/>'
        + '<!-- Flame Layers -->'
        + '<rect class="torch-flame-outer" x="4" y="1" width="8" height="7" rx="1" fill="#FF4500"/>'
        + '<rect class="torch-flame-inner" x="5" y="2" width="6" height="5" rx="1" fill="#FFE600"/>'
        + '<rect x="6" y="3" width="4" height="3" fill="#FFFFFF"/>'
        + '</svg>'
      );
    },

    // Scenic Wooden Bridge & Mountain Waterfall Section
    bridgeAndWaterfall: function(biome) {
      if (biome === 'nether') {
        return (
          '<div class="island-feature-section island-nether-rift">'
          + '  <div class="feature-stream lava-stream"></div>'
          + '  <div class="feature-bridge blackstone-bridge">'
          + '    <div class="bridge-railing top"></div>'
          + '    <div class="bridge-planks">'
          + '      <span></span><span></span><span></span><span></span><span></span>'
          + '    </div>'
          + '    <div class="bridge-railing bottom"></div>'
          + '  </div>'
          + '  <span class="feature-tag">Soul Sand Crossing</span>'
          + '</div>'
        );
      }
      if (biome === 'end') {
        return (
          '<div class="island-feature-section island-end-rift">'
          + '  <div class="feature-stream void-stream"></div>'
          + '  <div class="feature-bridge purpur-bridge">'
          + '    <div class="bridge-railing top"></div>'
          + '    <div class="bridge-planks">'
          + '      <span></span><span></span><span></span><span></span><span></span>'
          + '    </div>'
          + '    <div class="bridge-railing bottom"></div>'
          + '  </div>'
          + '  <span class="feature-tag">Void Gateway Bridge</span>'
          + '</div>'
        );
      }
      // Overworld Default
      return (
        '<div class="island-feature-section island-overworld-river">'
        + '  <div class="feature-stream river-stream">'
        + '    <div class="water-foam f1"></div>'
        + '    <div class="water-foam f2"></div>'
        + '  </div>'
        + '  <div class="feature-bridge oak-bridge">'
        + '    <div class="bridge-railing top"></div>'
        + '    <div class="bridge-planks">'
        + '      <span></span><span></span><span></span><span></span><span></span>'
        + '    </div>'
        + '    <div class="bridge-railing bottom"></div>'
        + '  </div>'
        + '  <span class="feature-tag">Whispering Falls Bridge</span>'
        + '</div>'
      );
    },

    // Cut Tree Stump
    stump: function() {
      return (
        '<svg class="scenery-svg scenery-stump" viewBox="0 0 32 26" width="34" height="28" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="16" cy="22" rx="12" ry="4" fill="rgba(0,0,0,0.18)"/>'
        + '<rect x="6" y="10" width="20" height="12" fill="#5C3A21" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<ellipse cx="16" cy="10" rx="10" ry="4.5" fill="#C49A6C" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<ellipse cx="16" cy="10" rx="6" ry="2.8" fill="#A67C52"/>'
        + '<circle cx="16" cy="10" r="1.5" fill="#5C3A21"/>'
        + '</svg>'
      );
    },

    // Speckled Red Mushroom
    mushroom: function() {
      return (
        '<svg class="scenery-svg scenery-mushroom" viewBox="0 0 24 24" width="26" height="26" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="12" cy="22" rx="7" ry="2" fill="rgba(0,0,0,0.15)"/>'
        + '<rect x="10" y="14" width="4" height="8" fill="#E4E4E7" stroke="#0B0B0E" stroke-width="1"/>'
        + '<path d="M3 14 C3 6 21 6 21 14 Z" fill="#DC2626" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<circle cx="8" cy="10" r="1.8" fill="#FFFFFF"/>'
        + '<circle cx="16" cy="10" r="1.8" fill="#FFFFFF"/>'
        + '<circle cx="12" cy="8" r="1.3" fill="#FFFFFF"/>'
        + '</svg>'
      );
    },

    // Pixel Wildflowers Clump
    wildflowers: function() {
      return (
        '<svg class="scenery-svg scenery-wildflowers" viewBox="0 0 28 20" width="28" height="20" fill="none" shape-rendering="crispEdges">'
        + '<rect x="5" y="12" width="2" height="6" fill="#15803D"/>'
        + '<rect x="13" y="9" width="2" height="9" fill="#15803D"/>'
        + '<rect x="21" y="11" width="2" height="7" fill="#15803D"/>'
        + '<rect x="4" y="9" width="4" height="4" fill="#EF4444"/>'
        + '<circle cx="6" cy="11" r="1" fill="#FFFFFF"/>'
        + '<rect x="12" y="6" width="4" height="4" fill="#FFE600"/>'
        + '<circle cx="14" cy="8" r="1" fill="#FFFFFF"/>'
        + '<rect x="20" y="8" width="4" height="4" fill="#38BDF8"/>'
        + '<circle cx="22" cy="10" r="1" fill="#FFFFFF"/>'
        + '</svg>'
      );
    },

    // Milestone Treasure Chest (Zero Emoji)
    treasureChest: function(isUnlocked) {
      var goldColor = isUnlocked ? '#FFE600' : '#A1A1AA';
      var bodyColor = isUnlocked ? '#8B4513' : '#4A4A55';
      var rimColor  = isUnlocked ? '#D97706' : '#27272A';

      return (
        '<svg class="scenery-svg scenery-chest" viewBox="0 0 44 40" width="56" height="50" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="22" cy="37" rx="16" ry="3.5" fill="rgba(0,0,0,0.25)"/>'
        + '<!-- Chest Base -->'
        + '<rect x="6" y="18" width="32" height="18" rx="2" fill="' + bodyColor + '" stroke="#0B0B0E" stroke-width="2"/>'
        + '<rect x="9" y="20" width="26" height="4" fill="' + rimColor + '"/>'
        + '<!-- Chest Lid -->'
        + '<rect x="6" y="8" width="32" height="10" rx="3" fill="' + bodyColor + '" stroke="#0B0B0E" stroke-width="2"/>'
        + '<rect x="8" y="10" width="28" height="3" fill="' + (isUnlocked ? '#CD853F' : '#64748B') + '"/>'
        + '<!-- Gold Bands -->'
        + '<rect x="13" y="8" width="4" height="28" fill="' + goldColor + '" stroke="#0B0B0E" stroke-width="1"/>'
        + '<rect x="27" y="8" width="4" height="28" fill="' + goldColor + '" stroke="#0B0B0E" stroke-width="1"/>'
        + '<!-- Center Keyhole Clasp -->'
        + '<rect x="19" y="16" width="6" height="7" rx="1" fill="' + goldColor + '" stroke="#0B0B0E" stroke-width="1.5"/>'
        + '<circle cx="22" cy="19" r="1" fill="#0B0B0E"/>'
        + '<rect x="21.5" y="19" width="1" height="2.5" fill="#0B0B0E"/>'
        + '</svg>'
      );
    },

    // Stepping Stone Pedestal Graphics
    pedestalTopActive: function() {
      return (
        '<svg viewBox="0 0 72 48" width="72" height="48" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="36" cy="40" rx="30" ry="7" fill="rgba(0,0,0,0.25)"/>'
        + '<!-- Stone Base Side Rim -->'
        + '<polygon points="8,22 64,22 64,30 8,30" fill="#3F3F46" stroke="#0B0B0E" stroke-width="2"/>'
        + '<!-- Glowing Top Portal Platform -->'
        + '<ellipse cx="36" cy="22" rx="28" ry="11" fill="#7C3AED" stroke="#0B0B0E" stroke-width="2"/>'
        + '<ellipse cx="36" cy="22" rx="22" ry="8" fill="#A855F7"/>'
        + '<ellipse cx="36" cy="22" rx="15" ry="5" fill="#C084FC"/>'
        + '<ellipse cx="36" cy="22" rx="8" ry="3" fill="#FFFFFF"/>'
        + '</svg>'
      );
    },

    pedestalTopCompleted: function() {
      return (
        '<svg viewBox="0 0 72 44" width="72" height="44" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="36" cy="38" rx="28" ry="6" fill="rgba(0,0,0,0.2)"/>'
        + '<polygon points="8,18 64,18 64,26 8,26" fill="#374151" stroke="#0B0B0E" stroke-width="2"/>'
        + '<ellipse cx="36" cy="18" rx="28" ry="10" fill="#10B981" stroke="#0B0B0E" stroke-width="2"/>'
        + '<ellipse cx="36" cy="18" rx="22" ry="7" fill="#059669"/>'
        + '<polyline points="30,17 34,21 43,14" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'
        + '</svg>'
      );
    },

    pedestalTopLocked: function() {
      return (
        '<svg viewBox="0 0 72 44" width="72" height="44" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="36" cy="38" rx="28" ry="6" fill="rgba(0,0,0,0.18)"/>'
        + '<polygon points="8,18 64,18 64,26 8,26" fill="#27272A" stroke="#0B0B0E" stroke-width="2"/>'
        + '<ellipse cx="36" cy="18" rx="28" ry="10" fill="#52525B" stroke="#0B0B0E" stroke-width="2"/>'
        + '<ellipse cx="36" cy="18" rx="22" ry="7" fill="#3F3F46"/>'
        + '<!-- Silver Padlock Inlay -->'
        + '<rect x="32" y="16" width="8" height="6" rx="1" fill="#E4E4E7" stroke="#0B0B0E" stroke-width="1.2"/>'
        + '<path d="M34,16 V13 a2,2 0 0 1 4,0 V16" fill="none" stroke="#E4E4E7" stroke-width="1.4"/>'
        + '</svg>'
      );
    },

    // UI Utility SVGs
    check: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4"/></svg>',
    lock: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V4.5a3 3 0 0 1 6 0V7"/></svg>',
    star: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#0B0B0E" stroke-width="1.2"><polygon points="8 1 10.2 5.5 15 6.2 11.5 9.6 12.3 14.5 8 12.2 3.7 14.5 4.5 9.6 1 6.2 5.8 5.5 8 1"/></svg>',
    coin: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#0B0B0E" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3.5" fill="#F59E0B"/><line x1="8" y1="5.5" x2="8" y2="10.5" stroke="#0B0B0E" stroke-width="1"/></svg>',
    close: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>',
    chevronRight: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 2 10 7 5 12"/></svg>'
  };

  // ── 2. View Mode State ──────────────────────────────────────────────────────
  var _mapViewMode = 'trail'; // 'trail' | 'list'
  try {
    var savedMode = localStorage.getItem('javaqst_map_view_mode') || localStorage.getItem('javaquest_map_view_mode');
    if (savedMode === 'trail' || savedMode === 'list') {
      _mapViewMode = savedMode;
    }
  } catch(e) {}

  function setMapViewMode(mode) {
    if (mode) _mapViewMode = (mode === 'list') ? 'list' : 'trail';
    try {
      localStorage.setItem('javaqst_map_view_mode', _mapViewMode);
      localStorage.setItem('javaquest_map_view_mode', _mapViewMode);
    } catch(e) {}

    var btnTrail = document.getElementById('btn-map-view-trail');
    var btnList  = document.getElementById('btn-map-view-list');
    var trailWrap = document.getElementById('adventure-trail-wrap');
    var listWrap  = document.getElementById('chapters-accordion');

    if (btnTrail && btnList) {
      btnTrail.classList.toggle('active', _mapViewMode === 'trail');
      btnList.classList.toggle('active', _mapViewMode === 'list');
    }

    if (trailWrap && listWrap) {
      if (_mapViewMode === 'trail') {
        trailWrap.classList.remove('hidden');
        listWrap.classList.add('hidden');
      } else {
        trailWrap.classList.add('hidden');
        listWrap.classList.remove('hidden');
      }
    }
  }
  window.setMapViewMode = setMapViewMode;

  // ── 3. Render Chosen Voxel Pixel Champion on Active Map Pedestal ─────────
  function renderPlayerMapSprite(player) {
    var p = player || (window.STATE && window.STATE.player) || (typeof window.getPlayerState === 'function' ? window.getPlayerState() : {});
    var rawSkin = p.minecraftSkin || (p.avatar && p.avatar.skin) || p.avatarSkin || 'blockhead';
    if (rawSkin === 'steve') rawSkin = 'blockhead';
    else if (rawSkin === 'alex') rawSkin = 'scout';
    else if (rawSkin === 'creeper') rawSkin = 'hisser';
    else if (rawSkin === 'diamond_knight') rawSkin = 'crystal_knight';
    else if (rawSkin === 'ender_coder') rawSkin = 'void_coder';
    else if (rawSkin === 'redstone') rawSkin = 'circuit_mage';
    else if (rawSkin === 'cyber_steve') rawSkin = 'cyber_crafter';
    else if (rawSkin === 'golden_king') rawSkin = 'gilded_monarch';

    var skins = window.MINECRAFT_SKINS || (typeof MINECRAFT_SKINS !== 'undefined' ? MINECRAFT_SKINS : {});
    var skinData = skins[rawSkin] || skins.blockhead;
    var hatKey = p.avatarHat || (p.avatar && p.avatar.hat) || 'none';
    var hats = window.MINECRAFT_HATS || (typeof MINECRAFT_HATS !== 'undefined' ? MINECRAFT_HATS : {});
    var hatData = hats[hatKey] || null;

    var capeKey = p.avatarCape || (p.avatar && p.avatar.cape) || 'none';
    var capes = window.MINECRAFT_CAPES || (typeof MINECRAFT_CAPES !== 'undefined' ? MINECRAFT_CAPES : {});
    var capeData = capes[capeKey] || null;

    var renderFn = window.renderMinecraftSVG || (typeof renderMinecraftSVG === 'function' ? renderMinecraftSVG : null);
    var faceSvg = '';
    if (renderFn && skinData) {
      faceSvg = renderFn(skinData.grid, hatData ? hatData.grid : null);
    } else {
      faceSvg = '<div style="width:100%;height:100%;background:#C68B59;"></div>';
    }

    // Colors matching player skin champion
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
      '<div class="station-character-sprite player-character-sprite">'
      + '  <div class="station-speech-bubble">Next Quest!</div>'
      + '  <div class="player-voxel-body">'
      +      capeAccent
      + '    <!-- Head Frame (Chosen Profile Avatar) -->'
      + '    <div class="player-voxel-head">' + faceSvg + '</div>'
      + '    <!-- Torso & Arms -->'
      + '    <div class="player-voxel-torso" style="background:' + colors.shirt + '">'
      + '      <div class="player-arm arm-left" style="background:' + colors.shirt + '"></div>'
      + '      <div class="player-arm arm-right" style="background:' + colors.shirt + '"></div>'
      + '      <div class="player-belt" style="background:' + colors.belt + '"></div>'
      + '    </div>'
      + '    <!-- Legs & Boots -->'
      + '    <div class="player-voxel-legs">'
      + '      <div class="player-leg leg-left" style="background:' + colors.pants + '"></div>'
      + '      <div class="player-leg leg-right" style="background:' + colors.pants + '"></div>'
      + '    </div>'
      + '  </div>'
      + '</div>'
    );
  }

  // ── 4. Render Isometric Mountain Trail Map ─────────────────────────────────
  function renderAdventureTrail(container, filteredMods, activeTrackFilter) {
    if (!container) return;
    container.innerHTML = '';

    var player = (typeof getPlayerState === 'function') ? getPlayerState() : { completedLessons: [], completedModules: [] };
    var completedModules = player.completedModules || [];
    var allCurriculum = window.CURRICULUM || [];

    // Determine which track is displayed
    var currentTrack = 'beginner';
    if (activeTrackFilter === 'intermediate') currentTrack = 'intermediate';
    else if (activeTrackFilter === 'advanced') currentTrack = 'advanced';
    else if (activeTrackFilter === 'all') {
      // Find highest unlocked active track for the player
      var hasIntermediate = completedModules.some(function(id) { return id.startsWith('b8') || id.startsWith('i'); });
      var hasAdvanced = completedModules.some(function(id) { return id.startsWith('i8') || id.startsWith('a'); });
      if (hasAdvanced) currentTrack = 'advanced';
      else if (hasIntermediate) currentTrack = 'intermediate';
      else currentTrack = 'beginner';
    }

    // Filter to the 8 modules for this track
    var trackMods = allCurriculum.filter(function(m) { return m.level === currentTrack; });
    if (!trackMods.length && filteredMods && filteredMods.length) {
      trackMods = filteredMods.slice(0, 8);
    }

    var trackTitles = {
      beginner: {
        badge: 'TRACK 1 • BEGINNER OVERWORLD',
        title: 'Beginner Overworld',
        sub: 'Your Java adventure begins here! Master syntax, control flow & core OOP.',
        cube: SVGS.grassBlock(),
        biomeName: 'overworld',
        capstoneId: 'proj-beginner',
        capstoneTitle: 'Personal Expense Tracker'
      },
      intermediate: {
        badge: 'TRACK 2 • INTERMEDIATE THE NETHER',
        title: 'The Nether Realm',
        sub: 'Conquer OOP, Collections, Streams, File I/O & Multithreading!',
        cube: SVGS.netherrackBlock(),
        biomeName: 'nether',
        capstoneId: 'proj-intermediate',
        capstoneTitle: 'Library Management System'
      },
      advanced: {
        badge: 'TRACK 3 • ADVANCED THE END',
        title: 'The End Gateway',
        sub: 'Master JVM Internals, Virtual Threads, Spring Boot Microservices & Cloud Architecture!',
        cube: SVGS.endStoneBlock(),
        biomeName: 'end',
        capstoneId: 'proj-advanced',
        capstoneTitle: 'Cloud Banking Core Engine'
      }
    };

    var meta = trackTitles[currentTrack] || trackTitles.beginner;

    // Calculate completion count
    var doneModCount = 0;
    trackMods.forEach(function(m) {
      if (completedModules.indexOf(m.id) !== -1) doneModCount++;
    });

    // ── Outer Board Container ──
    var board = document.createElement('div');
    board.className = 'adventure-trail-board island-mountain-board';
    board.setAttribute('data-biome', meta.biomeName);

    // ── Floating Clouds Background Decor ──
    var skyDecor = document.createElement('div');
    skyDecor.className = 'island-sky-decor';
    skyDecor.innerHTML = (
      '<div class="pixel-cloud c1"></div>'
      + '<div class="pixel-cloud c2"></div>'
      + '<div class="pixel-cloud c3"></div>'
      + '<div class="pixel-sparkles"></div>'
    );
    board.appendChild(skyDecor);

    // ── Top Island Biome Header Bar (Matches User Reference Image) ──
    var headerBar = document.createElement('div');
    headerBar.className = 'island-header-bar';
    headerBar.innerHTML = (
      '<div class="island-header-left">'
      + '  <div class="island-biome-cube">' + meta.cube + '</div>'
      + '  <div class="island-title-group">'
      + '    <div class="island-badge-pill">' + esc(meta.badge) + '</div>'
      + '    <h2 class="island-heading">' + esc(meta.title) + '</h2>'
      + '    <p class="island-sub">' + esc(meta.sub) + '</p>'
      + '  </div>'
      + '</div>'
      + '<div class="island-header-right">'
      + '  <div class="island-stat-chip">'
      + '    <span class="chip-label">Progress:</span>'
      + '    <span class="chip-val">' + doneModCount + '/' + trackMods.length + ' Chapters</span>'
      + '    <div class="island-mini-bar"><div class="mini-bar-fill" style="width:' + (doneModCount / (trackMods.length || 1) * 100) + '%"></div></div>'
      + '  </div>'
      + '  <div class="island-track-tabs">'
      + '    <button class="track-pill-btn ' + (currentTrack === 'beginner' ? 'active' : '') + '" data-track="beginner" title="Track 1: Overworld">Beginner</button>'
      + '    <button class="track-pill-btn ' + (currentTrack === 'intermediate' ? 'active' : '') + '" data-track="intermediate" title="Track 2: The Nether">Intermediate</button>'
      + '    <button class="track-pill-btn ' + (currentTrack === 'advanced' ? 'active' : '') + '" data-track="advanced" title="Track 3: The End">Advanced</button>'
      + '  </div>'
      + '</div>'
    );
    board.appendChild(headerBar);

    // Track tab button click event listener
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

    // ── The Mountain Island Canvas & Trail Diorama ──
    var canvas = document.createElement('div');
    canvas.className = 'island-canvas';

    // Mountain Terraced Cliff Layers Decoration
    var cliffBase = document.createElement('div');
    cliffBase.className = 'island-cliff-base';
    cliffBase.innerHTML = (
      '<div class="cliff-terrace t1"></div>'
      + '<div class="cliff-terrace t2"></div>'
      + '<div class="cliff-terrace t3"></div>'
    );
    canvas.appendChild(cliffBase);

    // S-Curve Offsets (alternating positions across the mountain path)
    var offsets = [
      { x: -90, align: 'pill-right' },
      { x: 30,  align: 'pill-left' },
      { x: 100, align: 'pill-left' },
      { x: -50, align: 'pill-right' },
      { x: 80,  align: 'pill-left' },
      { x: -70, align: 'pill-right' },
      { x: 40,  align: 'pill-left' },
      { x: 0,   align: 'pill-right' }
    ];

    var firstActiveFound = false;

    // Render the 8 Stepping Stone Stations
    trackMods.forEach(function(mod, modIdx) {
      var isModDone = completedModules.indexOf(mod.id) !== -1;
      var isModUnlocked = (typeof window.isModUnlocked === 'function') ? window.isModUnlocked(mod.id) : true;
      var isActiveStation = !isModDone && isModUnlocked && !firstActiveFound;

      if (isActiveStation) {
        firstActiveFound = true;
      }

      // Insert Scenic Bridge & Waterfall between Module 3 and Module 4
      if (modIdx === 3) {
        var bridgeWrap = document.createElement('div');
        bridgeWrap.className = 'island-feature-wrap';
        bridgeWrap.innerHTML = SVGS.bridgeAndWaterfall(meta.biomeName);
        canvas.appendChild(bridgeWrap);
      }

      var pos = offsets[modIdx % offsets.length];
      var station = document.createElement('div');
      station.className = 'island-node-station ' + (pos.align === 'pill-left' ? 'layout-pill-left' : 'layout-pill-right');
      station.style.setProperty('--node-x', pos.x + 'px');

      // ── Scenery prop beside station ──
      var sceneryEl = document.createElement('div');
      sceneryEl.className = 'station-scenery';
      if (modIdx === 0) {
        sceneryEl.innerHTML = (meta.biomeName === 'nether') ? SVGS.treeNether() : ((meta.biomeName === 'end') ? SVGS.treeEnd() : SVGS.treeOverworld());
      } else if (modIdx === 1) {
        sceneryEl.innerHTML = SVGS.torch();
      } else if (modIdx === 4) {
        sceneryEl.innerHTML = SVGS.mushroom();
      } else if (modIdx === 6) {
        sceneryEl.innerHTML = (meta.biomeName === 'overworld') ? SVGS.wildflowers() : SVGS.stump();
      }
      station.appendChild(sceneryEl);

      // ── 3D Stepping Stone Pedestal Button ──
      var pedestal = document.createElement('button');
      pedestal.type = 'button';
      pedestal.className = 'island-pedestal ' + (isModDone ? 'pedestal-done' : (isActiveStation ? 'pedestal-active' : (isModUnlocked ? 'pedestal-unlocked' : 'pedestal-locked')));
      pedestal.setAttribute('aria-label', mod.title + ' (Module ' + (modIdx + 1) + ')');

      if (isModDone) {
        pedestal.innerHTML = SVGS.pedestalTopCompleted();
      } else if (isActiveStation) {
        // Glowing portal with player's chosen pixel champion avatar standing on top!
        pedestal.innerHTML = SVGS.pedestalTopActive()
          + '<div class="pedestal-active-glow"></div>'
          + renderPlayerMapSprite(player);
      } else if (isModUnlocked) {
        pedestal.innerHTML = SVGS.pedestalTopCompleted().replace('#10B981', '#F59E0B').replace('#059669', '#D97706');
      } else {
        pedestal.innerHTML = SVGS.pedestalTopLocked();
      }

      // ── Quest Label Pill (Exact Match to User Reference Image) ──
      var pill = document.createElement('div');
      pill.className = 'island-quest-pill ' + (isModDone ? 'pill-done' : (isActiveStation ? 'pill-active' : (isModUnlocked ? 'pill-unlocked' : 'pill-locked')));
      
      var modCode = (mod.code || ('M' + (modIdx + 1))).toUpperCase();
      var numPrefix = (modIdx + 1 < 10) ? ('0' + (modIdx + 1)) : (modIdx + 1);

      pill.innerHTML = (
        '<div class="pill-code-badge">' + numPrefix + '</div>'
        + '<div class="pill-text-col">'
        + '  <div class="pill-title">' + esc(mod.title) + '</div>'
        + '  <div class="pill-sub">' + (mod.lessons ? mod.lessons.length : 8) + ' Quests • ' + esc(mod.biome || 'Kingdom') + '</div>'
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

      // Click on pedestal or pill opens Chapter Popover
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

    // ── Milestone Capstone Summit Dais (At Bottom of Island) ──
    var capstoneStation = document.createElement('div');
    capstoneStation.className = 'island-capstone-station';
    var isCapstoneReady = doneModCount >= trackMods.length;

    var chestBtn = document.createElement('button');
    chestBtn.type = 'button';
    chestBtn.className = 'capstone-chest-btn ' + (isCapstoneReady ? 'chest-ready' : 'chest-locked');
    chestBtn.setAttribute('aria-label', meta.capstoneTitle + ' Capstone Reward');
    chestBtn.innerHTML = (
      '<div class="capstone-pedestal-platform"></div>'
      + SVGS.treasureChest(isCapstoneReady)
      + '<div class="capstone-label-pill">'
      + '  <span class="capstone-code-tag">' + (meta.biomeName.toUpperCase()) + ' CAPSTONE</span>'
      + '  <span class="capstone-name">' + esc(meta.capstoneTitle) + '</span>'
      + '  <span class="capstone-xp-chip">+250 XP</span>'
      + '</div>'
    );

    chestBtn.onclick = function() {
      if (typeof window.openCapstoneWorkbench === 'function') {
        window.openCapstoneWorkbench(meta.capstoneId);
      } else if (typeof window.toast === 'function') {
        window.toast(isCapstoneReady ? 'Launching ' + meta.capstoneTitle + ' Workbench!' : 'Complete all 8 modules to unlock this Capstone Chest!');
      }
    };

    capstoneStation.appendChild(chestBtn);
    canvas.appendChild(capstoneStation);

    board.appendChild(canvas);
    container.appendChild(board);
  }
  window.renderAdventureTrail = renderAdventureTrail;

  // ── 4. Chapter Popover Modal (Full Lesson Inspection & Direct Launch) ────────
  function openChapterNodeModal(mod, isModDone, isModUnlocked) {
    var existing = document.getElementById('trail-node-popover-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'trail-node-popover-modal';
    modal.className = 'trail-modal-backdrop';

    var player = (typeof getPlayerState === 'function') ? getPlayerState() : { completedLessons: [] };
    var completedLessons = player.completedLessons || [];
    var lessons = mod.lessons || [];

    // Find next uncompleted lesson
    var nextLesson = null;
    for (var i = 0; i < lessons.length; i++) {
      if (completedLessons.indexOf(lessons[i].id) === -1) {
        nextLesson = lessons[i];
        break;
      }
    }
    if (!nextLesson && lessons.length) {
      nextLesson = lessons[0];
    }

    var card = document.createElement('div');
    card.className = 'trail-modal-card chapter-diorama-modal';

    var lessonItemsHtml = '';
    lessons.forEach(function(l, idx) {
      var done = completedLessons.indexOf(l.id) !== -1;
      lessonItemsHtml += (
        '<div class="modal-lesson-row ' + (done ? 'lesson-done' : '') + '">'
        + '  <div class="modal-lesson-idx">' + (done ? SVGS.check : (idx + 1)) + '</div>'
        + '  <div class="modal-lesson-info">'
        + '    <div class="modal-lesson-title">' + esc(l.title) + '</div>'
        + '    <div class="modal-lesson-xp">+' + (l.xp || 30) + ' XP</div>'
        + '  </div>'
        + '  <button class="btn-xs modal-lesson-launch-btn" data-lid="' + l.id + '">'
        + (done ? 'Review' : 'Play')
        + '  </button>'
        + '</div>'
      );
    });

    card.innerHTML = (
      '<div class="trail-modal-header">'
      + '  <div class="trail-modal-badges">'
      + '    <span class="trail-modal-pill">' + esc(mod.code || 'CHAPTER') + '</span>'
      + '    <span class="trail-modal-status ' + (isModDone ? 'status-done' : (isModUnlocked ? 'status-active' : 'status-locked')) + '">'
      + (isModDone ? 'Completed' : (isModUnlocked ? 'In Progress' : 'Locked'))
      + '    </span>'
      + '  </div>'
      + '  <button class="trail-modal-close" id="btn-close-trail-modal" aria-label="Close">' + SVGS.close + '</button>'
      + '</div>'
      + '<h2 class="trail-modal-title">' + esc(mod.title) + '</h2>'
      + '<p class="trail-modal-desc">' + esc(mod.desc || ('Master ' + mod.title + ' with interactive coding quests and openJDK compilation.')) + '</p>'
      + '<div class="trail-modal-meta">'
      + '  <div class="trail-meta-chip">' + SVGS.coin + ' <span>' + (lessons.length * 30) + ' XP Available</span></div>'
      + '  <div class="trail-meta-chip">' + SVGS.star + ' <span>' + esc(mod.biome || 'Overworld') + '</span></div>'
      + '</div>'
      + '<div class="modal-lesson-list">'
      + lessonItemsHtml
      + '</div>'
      + '<div class="trail-modal-actions">'
      + (isModUnlocked
          ? ('<button class="btn-primary trail-btn-action" id="btn-modal-start-quest">'
             + (isModDone ? 'Review Chapter Lessons' : ('Start Next Quest: ' + esc(nextLesson ? nextLesson.title : 'First Lesson')))
             + '</button>')
          : '<button class="btn-secondary trail-btn-action" disabled>Complete earlier chapters to unlock</button>'
        )
      + '</div>'
    );

    modal.appendChild(card);
    document.body.appendChild(modal);

    // Event listeners
    var closeBtn = card.querySelector('#btn-close-trail-modal');
    if (closeBtn) closeBtn.onclick = function() { modal.remove(); };

    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };

    var startBtn = card.querySelector('#btn-modal-start-quest');
    if (startBtn && nextLesson) {
      startBtn.onclick = function() {
        modal.remove();
        if (typeof window.startLesson === 'function') {
          window.startLesson(mod.id, nextLesson.id);
        }
      };
    }

    card.querySelectorAll('.modal-lesson-launch-btn').forEach(function(b) {
      b.onclick = function() {
        var lid = b.getAttribute('data-lid');
        modal.remove();
        if (typeof window.startLesson === 'function') {
          window.startLesson(mod.id, lid);
        }
      };
    });
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
