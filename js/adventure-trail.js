// JavaQst — js/adventure-trail.js
// Rebuilt Ground-Up 2.5D Isometric Voxel Diorama Map Engine
// Apple-Crafted HiDPI Canvas Terrain + Dynamic Lighting + Interactive Biome Props + Frosted Glass Pin Overlay
// Zero External Dependencies, Zero Emojis, 100% Day/Night & Mobile Responsive.

(function() {
  'use strict';

  var STORAGE_KEY_RELICS = 'javaqst_map_relics_v1';
  var STORAGE_KEY_ATMOS = 'javaqst_map_atmos_v1';
  var _activeCleanup = null;

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

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
  }

  function mixRgbStr(c1, c2, t, alpha) {
    var a = hexToRgb(c1);
    var b = hexToRgb(c2);
    var r = Math.round(lerp(a[0], b[0], clamp(t, 0, 1)));
    var g = Math.round(lerp(a[1], b[1], clamp(t, 0, 1)));
    var bl = Math.round(lerp(a[2], b[2], clamp(t, 0, 1)));
    if (typeof alpha === 'number') {
      return 'rgba(' + r + ',' + g + ',' + bl + ',' + alpha + ')';
    }
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  // ── 1. Persistent Relics & View Mode Storage ──────────────────────────────
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

  function getAtmospherePref() {
    try {
      return localStorage.getItem(STORAGE_KEY_ATMOS) !== '0';
    } catch (e) {
      return true;
    }
  }

  function setAtmospherePref(on) {
    try {
      localStorage.setItem(STORAGE_KEY_ATMOS, on ? '1' : '0');
    } catch (e) {}
  }

  var _mapViewMode = 'trail';
  try {
    var savedMode = localStorage.getItem('javaqst_map_view_mode') || localStorage.getItem('javaquest_map_view_mode');
    if (savedMode === 'trail' || savedMode === 'list') _mapViewMode = savedMode;
  } catch (e) {}

  function setMapViewMode(mode) {
    if (mode) _mapViewMode = (mode === 'list') ? 'list' : 'trail';
    try {
      localStorage.setItem('javaqst_map_view_mode', _mapViewMode);
      localStorage.setItem('javaquest_map_view_mode', _mapViewMode);
    } catch (e) {}

    var btnTrail = document.getElementById('btn-map-view-trail');
    var btnList = document.getElementById('btn-map-view-list');
    var trailWrap = document.getElementById('adventure-trail-wrap');
    var listWrap = document.getElementById('chapters-accordion');

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

  // ── 2. Inline SVG UI Icons (Zero Unicode Emojis) ──────────────────────────
  var SVGS = {
    grassCube: '<svg viewBox="0 0 32 32" width="28" height="28"><polygon points="16,3 29,10 16,17 3,10" fill="#6CBF5B"/><polygon points="3,10 16,17 16,28 3,21" fill="#7D5337"/><polygon points="3,10 16,17 16,20.2 3,13.2" fill="#4E9440"/><polygon points="16,17 29,10 29,21 16,28" fill="#563824"/><polygon points="16,17 29,10 29,13.2 16,20.2" fill="#6CBF5B"/><polygon points="16,3 29,10 29,21 16,28 3,21 3,10" fill="none" stroke="rgba(11,11,14,0.65)" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    netherCube: '<svg viewBox="0 0 32 32" width="28" height="28"><polygon points="16,3 29,10 16,17 3,10" fill="#991B1B"/><polygon points="3,10 16,17 16,28 3,21" fill="#450A0A"/><polygon points="16,17 29,10 29,21 16,28" fill="#6B141A"/><rect x="14" y="8" width="3" height="2.5" rx="0.5" fill="#F97316"/><rect x="8" y="17" width="3" height="2.5" rx="0.5" fill="#FBBF24"/><polygon points="16,3 29,10 29,21 16,28 3,21 3,10" fill="none" stroke="rgba(0,0,0,0.65)" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    endCube: '<svg viewBox="0 0 32 32" width="28" height="28"><polygon points="16,3 29,10 16,17 3,10" fill="#DCD89E"/><polygon points="3,10 16,17 16,28 3,21" fill="#3D325C"/><polygon points="16,17 29,10 29,21 16,28" fill="#241C3A"/><circle cx="15" cy="9" r="1.5" fill="#7C3AED"/><circle cx="22" cy="18" r="1.4" fill="#C084FC"/><polygon points="16,3 29,10 29,21 16,28 3,21 3,10" fill="none" stroke="rgba(0,0,0,0.65)" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    gem: '<svg viewBox="0 0 16 16" width="13" height="13" fill="#38BDF8" stroke="rgba(11,11,14,0.7)" stroke-width="1.1"><polygon points="4,2 12,2 15,6 8,14 1,6"/></svg>',
    compass: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="6"/><polygon points="10.5,5.5 9,9.5 5.5,10.5 7,6.5" fill="currentColor"/></svg>',
    sparkles: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 1.5V4M8 12v2.5M1.5 8H4M12 8h2.5M3.5 3.5l1.8 1.8M10.7 10.7l1.8 1.8M12.5 3.5l-1.8 1.8M5.3 10.7l-1.8 1.8"/></svg>',
    check: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4"/></svg>',
    lock: '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V4.5a3 3 0 0 1 6 0V7"/></svg>',
    star: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#0B0B0E" stroke-width="1.2"><polygon points="8 1 10.2 5.5 15 6.2 11.5 9.6 12.3 14.5 8 12.2 3.7 14.5 4.5 9.6 1 6.2 5.8 5.5 8 1"/></svg>',
    coin: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#0B0B0E" stroke-width="1.4"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3.2" fill="#F59E0B"/></svg>',
    close: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>'
  };

  // ── 3. Tamed Biome Palettes (Day & Night Seamless) ────────────────────────
  var BIOME_PALETTES = {
    overworld: {
      day: {
        topA: '#70C15F', topB: '#61B451', topTrim: '#8AD97A',
        wallLeft: '#7B5336', wallRight: '#573924', subLeft: '#4E443C', subRight: '#38302A',
        bedrock: '#28221E', edge: 'rgba(11,11,14,0.16)',
        roadA: '#E5DCC5', roadB: '#D8CEB3', roadLeft: '#B0A386', roadRight: '#8E8267',
        waterTop: '#38BDF8', waterDeep: '#0284C7', waterLeft: '#0369A1', waterRight: '#075985', foam: '#F0F9FF',
        bridgeTop: '#9A6334', bridgeRail: '#754822', bridgeDark: '#523015',
        treeLeavesA: '#439E46', treeLeavesB: '#2E7D34', treeTopHi: '#6CD46F', trunkL: '#7B4F2B', trunkR: '#56361D',
        litGlow: '#10B981', hoverGlow: '#FFE600', fireGlow: '#F59E0B', mote: '#FBBF24',
        skyTop: 'rgba(224, 242, 254, 0.42)', skyBottom: 'rgba(247, 245, 238, 0.05)'
      },
      night: {
        topA: '#2D604E', topB: '#255040', topTrim: '#3E826A',
        wallLeft: '#3E2D24', wallRight: '#291D17', subLeft: '#282C38', subRight: '#1A1E28',
        bedrock: '#10131A', edge: 'rgba(255,255,255,0.08)',
        roadA: '#4A5568', roadB: '#3B4557', roadLeft: '#2D3748', roadRight: '#1E2533',
        waterTop: '#0EA5E9', waterDeep: '#0369A1', waterLeft: '#075985', waterRight: '#0C4A6E', foam: '#BAE6FD',
        bridgeTop: '#784A26', bridgeRail: '#59351A', bridgeDark: '#3B2210',
        treeLeavesA: '#1E6141', treeLeavesB: '#154730', treeTopHi: '#2E8B57', trunkL: '#593920', trunkR: '#3D2614',
        litGlow: '#34D399', hoverGlow: '#FFE600', fireGlow: '#FB923C', mote: '#FDE047',
        skyTop: 'rgba(15, 23, 42, 0.55)', skyBottom: 'rgba(13, 17, 23, 0.0)'
      }
    },
    nether: {
      day: {
        topA: '#7F232D', topB: '#6B1C25', topTrim: '#9F323E',
        wallLeft: '#461C24', wallRight: '#2B1016', subLeft: '#292226', subRight: '#1A1518',
        bedrock: '#110C0F', edge: 'rgba(255,140,80,0.14)',
        roadA: '#54353D', roadB: '#442930', roadLeft: '#2E1A1F', roadRight: '#1E1014',
        waterTop: '#F97316', waterDeep: '#EA580C', waterLeft: '#C2410C', waterRight: '#9A3412', foam: '#FEF08A',
        bridgeTop: '#4A3238', bridgeRail: '#332025', bridgeDark: '#1F1216',
        treeLeavesA: '#B91C1C', treeLeavesB: '#991B1B', treeTopHi: '#F59E0B', trunkL: '#4B2335', trunkR: '#311522',
        litGlow: '#F59E0B', hoverGlow: '#FFE600', fireGlow: '#FB923C', mote: '#FB923C',
        skyTop: 'rgba(69, 10, 10, 0.35)', skyBottom: 'rgba(24, 9, 13, 0.1)'
      },
      night: {
        topA: '#6E1E28', topB: '#5B1720', topTrim: '#8C2A36',
        wallLeft: '#3B161E', wallRight: '#240C12', subLeft: '#221C22', subRight: '#151115',
        bedrock: '#0C080B', edge: 'rgba(255,140,80,0.12)',
        roadA: '#462A32', roadB: '#382027', roadLeft: '#261419', roadRight: '#180B0F',
        waterTop: '#FB923C', waterDeep: '#EA580C', waterLeft: '#C2410C', waterRight: '#7C2D12', foam: '#FEF08A',
        bridgeTop: '#3E282E', bridgeRail: '#2B1B20', bridgeDark: '#1A0F13',
        treeLeavesA: '#991B1B', treeLeavesB: '#7F1D1D', treeTopHi: '#FB923C', trunkL: '#3F1C2C', trunkR: '#29101C',
        litGlow: '#FBBF24', hoverGlow: '#FFE600', fireGlow: '#F97316', mote: '#FDBA74',
        skyTop: 'rgba(42, 10, 14, 0.5)', skyBottom: 'rgba(13, 7, 10, 0.05)'
      }
    },
    end: {
      day: {
        topA: '#DEDAA0', topB: '#CEC98B', topTrim: '#ECE8B8',
        wallLeft: '#4C3D6E', wallRight: '#31264A', subLeft: '#271E3E', subRight: '#19122B',
        bedrock: '#0F0A1B', edge: 'rgba(168,85,247,0.18)',
        roadA: '#6A529B', roadB: '#5A4486', roadLeft: '#3E2D60', roadRight: '#2B1E45',
        waterTop: '#8B5CF6', waterDeep: '#6D28D9', waterLeft: '#5B21B6', waterRight: '#4C1D95', foam: '#F3E8FF',
        bridgeTop: '#58447D', bridgeRail: '#3F2F5E', bridgeDark: '#2A1E42',
        treeLeavesA: '#A855F7', treeLeavesB: '#7E22CE', treeTopHi: '#E9D5FF', trunkL: '#2D2148', trunkR: '#1D1432',
        litGlow: '#C084FC', hoverGlow: '#FFE600', fireGlow: '#A855F7', mote: '#E9D5FF',
        skyTop: 'rgba(46, 16, 101, 0.35)', skyBottom: 'rgba(15, 7, 32, 0.08)'
      },
      night: {
        topA: '#ABA679', topB: '#999469', topTrim: '#C7C291',
        wallLeft: '#3B2E59', wallRight: '#241B3B', subLeft: '#1D1530', subRight: '#120D20',
        bedrock: '#090612', edge: 'rgba(192,132,252,0.15)',
        roadA: '#55417D', roadB: '#46346A', roadLeft: '#31234E', roadRight: '#211637',
        waterTop: '#9333EA', waterDeep: '#6B21A8', waterLeft: '#581C87', waterRight: '#3B0764', foam: '#F5D0FE',
        bridgeTop: '#473669', bridgeRail: '#32244D', bridgeDark: '#1F1533',
        treeLeavesA: '#9333EA', treeLeavesB: '#6B21A8', treeTopHi: '#E9D5FF', trunkL: '#23183A', trunkR: '#160E26',
        litGlow: '#D8B4FE', hoverGlow: '#FFE600', fireGlow: '#C084FC', mote: '#C084FC',
        skyTop: 'rgba(24, 10, 54, 0.52)', skyBottom: 'rgba(9, 4, 20, 0.05)'
      }
    }
  };

  // ── 4. Player Voxel Skin Helper ───────────────────────────────────────────
  function getPlayerSpriteMeta(player) {
    var p = player || (window.STATE && window.STATE.player) || {};
    var rawSkin = p.minecraftSkin || (p.avatar && p.avatar.skin) || p.avatarSkin || 'blockhead';
    var skinAlias = {
      steve: 'blockhead', alex: 'scout', creeper: 'hisser', diamond_knight: 'crystal_knight',
      ender_coder: 'void_coder', redstone: 'circuit_mage', cyber_steve: 'cyber_crafter', golden_king: 'gilded_monarch'
    };
    if (skinAlias[rawSkin]) rawSkin = skinAlias[rawSkin];

    var skins = window.MINECRAFT_SKINS || (typeof MINECRAFT_SKINS !== 'undefined' ? MINECRAFT_SKINS : {});
    var skinData = skins[rawSkin] || skins.blockhead || null;
    var hatKey = p.avatarHat || (p.avatar && p.avatar.hat) || 'none';
    var hats = window.MINECRAFT_HATS || (typeof MINECRAFT_HATS !== 'undefined' ? MINECRAFT_HATS : {});
    var hatData = hats[hatKey] || null;
    var capeKey = p.avatarCape || (p.avatar && p.avatar.cape) || 'none';
    var capes = window.MINECRAFT_CAPES || (typeof MINECRAFT_CAPES !== 'undefined' ? MINECRAFT_CAPES : {});
    var capeData = capes[capeKey] || null;

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

    return {
      skinData: skinData,
      hatData: hatData,
      capeColor: (capeData && capeData.color && capeData.color !== 'transparent') ? capeData.color : null,
      colors: bodyColors[rawSkin] || bodyColors.blockhead
    };
  }

  // ── 5. Terrain & Waypoint Sculptor ────────────────────────────────────────
  function buildStationCoords(isCompact) {
    var ux = isCompact ? 2.1 : 3.0;
    var uxS = isCompact ? 1.6 : 2.3;
    return [
      { u: -uxS, v: 6,    labelSide: 'right' }, // 01
      { u: ux,   v: 11,   labelSide: 'left'  }, // 02
      { u: -uxS, v: 15.5, labelSide: 'right' }, // 03 (pre-river overlook)
      { u: ux,   v: 26.5, labelSide: 'left'  }, // 04 (post-bridge riverbank)
      { u: -ux,  v: 31,   labelSide: 'right' }, // 05
      { u: ux,   v: 35.5, labelSide: 'left'  }, // 06
      { u: -uxS, v: 40,   labelSide: 'right' }, // 07
      { u: uxS,  v: 44,   labelSide: 'left'  }, // 08
      { u: 0,    v: 48.5, labelSide: 'bottom', isCapstone: true } // Capstone Vault
    ];
  }

  function buildRoadSplinePoints(stationCoords) {
    // Route cleanly through stations and across center wooden bridge (u=0, v=19..23)
    var pts = [
      { u: stationCoords[0].u, v: stationCoords[0].v },
      { u: stationCoords[1].u, v: stationCoords[1].v },
      { u: stationCoords[2].u, v: stationCoords[2].v },
      { u: 0, v: 18.5 },
      { u: 0, v: 23.0 },
      { u: stationCoords[3].u, v: stationCoords[3].v },
      { u: stationCoords[4].u, v: stationCoords[4].v },
      { u: stationCoords[5].u, v: stationCoords[5].v },
      { u: stationCoords[6].u, v: stationCoords[6].v },
      { u: stationCoords[7].u, v: stationCoords[7].v },
      { u: stationCoords[8].u, v: stationCoords[8].v }
    ];
    return pts;
  }

  function pointToSegmentDistSq(u, v, a, b) {
    var dx = b.u - a.u;
    var dy = b.v - a.v;
    var len2 = dx * dx + dy * dy;
    if (len2 === 0) return (u - a.u) * (u - a.u) + (v - a.v) * (v - a.v);
    var t = clamp(((u - a.u) * dx + (v - a.v) * dy) / len2, 0, 1);
    var px = a.u + t * dx;
    var py = a.v + t * dy;
    return (u - px) * (u - px) + (v - py) * (v - py);
  }

  function buildIslandVoxels(isCompact, stationCoords) {
    var vMax = 53;
    var maxHalfW = isCompact ? 6.2 : 8.4;
    var roadPts = buildRoadSplinePoints(stationCoords);
    var tiles = [];
    var tileMap = Object.create(null);

    function islandHalfW(v) {
      if (v < 3 || v > 51) return 0;
      if (v < 7) return lerp(2.2, maxHalfW * 0.85, (v - 3) / 4);
      if (v >= 18 && v <= 23.5) {
        // Gorge canyon narrowing subtly + waterfall mouth notch on left
        return maxHalfW * 0.96;
      }
      if (v > 43) return lerp(maxHalfW * 0.88, 2.8, (v - 43) / 8);
      return maxHalfW * (0.9 + 0.1 * Math.sin(v * 0.35));
    }

    function baseElevAt(u, v) {
      var elev = 2.6;
      // Upper northern bluff peak
      if (v < 18) {
        elev += Math.max(0, 1.4 * (1 - v / 18));
        if (u < -2) elev += 0.55;
        if (u > 3 && v < 14) elev += 0.35;
      } else if (v > 23) {
        // Lower southern rising ridge toward capstone temple
        elev += 0.3 * Math.sin((v - 23) * 0.25);
        if (v >= 45 && Math.abs(u) <= 2.5) elev = 3.5;
        else if (v >= 43 && Math.abs(u) <= 3.5) elev = 3.1;
      }
      // Quantize gently to crisp half-block isometric terraces!
      return Math.round(elev * 2) / 2;
    }

    for (var v = 2; v <= vMax; v++) {
      var hw = islandHalfW(v);
      if (hw <= 0) continue;

      var uStart = Math.ceil(-hw);
      var uEnd = Math.floor(hw);
      for (var u = uStart; u <= uEnd; u++) {
        // Isometric staggered diamond lattice parity: (u + v) must be even
        if (((u + v) & 1) !== 0) continue;

        // Waterfall notch cut cleanly into upper-left rock face (u <= -4, v 12..19)
        var inRiverChannel = (v >= 19 && v <= 23);
        var isWaterfallLedge = (v >= 13 && v <= 18 && u <= -4 && u >= -6);

        var topZ = baseElevAt(u, v);
        var botZ = -1.6 - Math.max(0, 1.4 * (1 - Math.abs(u) / (hw + 0.5)));
        // Taper jagged hanging bedrock at extreme bottom point & flanks
        if (v > 44) botZ += 0.6;
        if (Math.abs(u) >= hw - 1.2) botZ += 1.0;

        var kind = 'grass';
        if (inRiverChannel) {
          kind = 'water';
          topZ = 1.45;
          // Recessed canyon rock frame on outermost bank tip
          if (Math.abs(u) >= hw - 0.8 && u > 0) {
            kind = 'cliff';
            topZ = 2.3;
          }
        } else if (isWaterfallLedge) {
          kind = 'waterfall';
          topZ = (v <= 15) ? 3.2 : (v <= 17 ? 2.55 : 1.75);
        } else {
          // Check proximity to road or bridge deck or stations
          var onBridge = (v >= 18 && v <= 24 && Math.abs(u) <= 1.2);
          if (onBridge) {
            kind = 'bridge';
            topZ = 2.6;
          } else {
            var minD2 = 99;
            for (var s = 0; s < roadPts.length - 1; s++) {
              var d2 = pointToSegmentDistSq(u, v, roadPts[s], roadPts[s + 1]);
              if (d2 < minD2) minD2 = d2;
            }
            if (minD2 <= 1.05) {
              kind = 'road';
            }
            // Level stations evenly on sculpted pedestals
            for (var stIdx = 0; stIdx < stationCoords.length; stIdx++) {
              var st = stationCoords[stIdx];
              var sd2 = (u - st.u) * (u - st.u) + (v - st.v) * (v - st.v);
              if (sd2 <= 2.3) {
                topZ = baseElevAt(st.u, st.v);
                if (sd2 <= 1.1) kind = 'road';
              }
            }
          }
        }

        var tile = {
          u: u,
          v: v,
          topZ: topZ,
          botZ: botZ,
          kind: kind,
          shadeSeed: (((u * 13 + v * 7) & 3) === 0) ? 1 : 0,
          hasFlower: (kind === 'grass' && ((u * 29 + v * 17) & 15) === 3)
        };
        tiles.push(tile);
        tileMap[u + ',' + v] = tile;
      }
    }

    // Flatten road elevations slightly at bridge approaches
    for (var ti = 0; ti < tiles.length; ti++) {
      var tl = tiles[ti];
      if (tl.kind === 'road' && tl.v >= 16 && tl.v <= 25) {
        tl.topZ = 2.6;
      }
    }

    return { tiles: tiles, tileMap: tileMap, roadPts: roadPts };
  }

  // ── 6. Main Interactive 2.5D Voxel Map Renderer ───────────────────────────
  function renderAdventureTrail(container, filteredMods, activeTrackFilter) {
    if (!container) return;
    if (typeof _activeCleanup === 'function') {
      _activeCleanup();
      _activeCleanup = null;
    }
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
    }

    var trackMods = allCurriculum.filter(function(m) { return m.level === currentTrack; });
    if (!trackMods.length && filteredMods && filteredMods.length) {
      trackMods = filteredMods.slice(0, 8);
    }

    var trackMeta = {
      beginner: {
        title: 'Beginner Overworld',
        sub: 'Tap quests, mine cliff crystals, stoke campfires, or steer the skiff!',
        cubeSvg: SVGS.grassCube,
        biomeName: 'overworld',
        capstoneId: 'proj-beginner',
        capstoneTitle: 'Personal Expense Tracker',
        lore: {
          tree: 'Oak Canopy: In Java, every object inherits java.lang.Object.',
          campfire: 'Hearth stoked! HotSpot JIT warms hot loops dynamically.',
          ore1: 'Crystal Vein mined! Java 21 brings Virtual Threads.',
          ore2: 'Emerald Pocket unlocked! Prefer immutable records where safe.',
          boat: 'River Skiff launched across Whispering Falls Gorge!',
          water: 'Ripple! Streams evaluate lazily only at terminal ops.',
          ground: 'Waypoint tapped! Click any stone pedestal to enter.'
        }
      },
      intermediate: {
        title: 'The Nether Realm',
        sub: 'Master OOP, Collections, Streams & I/O across basalt terraces!',
        cubeSvg: SVGS.netherCube,
        biomeName: 'nether',
        capstoneId: 'proj-intermediate',
        capstoneTitle: 'Library Management System',
        lore: {
          tree: 'Crimson Shroom: Polymorphism dispatches at runtime.',
          campfire: 'Soul Brazier blazing! try-with-resources closes streams safely.',
          ore1: 'Nether Gold mined! HashMap lookup averages O(1).',
          ore2: 'Quartz Seam discovered! Generics enforce compile-time safety.',
          boat: 'Magma Skiff surging through Basalt Gorge!',
          water: 'Magma ripple! CompletableFuture chains async work cleanly.',
          ground: 'Obsidian path active — choose your next chapter!'
        }
      },
      advanced: {
        title: 'The End Gateway',
        sub: 'Conquer JVM Memory, Virtual Threads & Spring Cloud spires!',
        cubeSvg: SVGS.endCube,
        biomeName: 'end',
        capstoneId: 'proj-advanced',
        capstoneTitle: 'Cloud Banking Core Engine',
        lore: {
          tree: 'Chorus Spire hums: G1 & ZGC keep tail latency tiny.',
          campfire: 'Void Beacon ignited! Structured concurrency prevents leaks.',
          ore1: 'Amethyst Geode mined! Escape analysis scalar-replaces objects.',
          ore2: 'Ender Shard extracted! Spring Actuator exposes live health.',
          boat: 'Astral Skiff gliding across Void Rift Rapids!',
          water: 'Void ripple! Reactive backpressure regulates throughput.',
          ground: 'Endstone dais ready — tap a portal stone!'
        }
      }
    }[currentTrack];

    var doneModCount = 0;
    var firstActiveFound = false;
    var activeStationIdx = 0;

    var stationData = trackMods.slice(0, 8).map(function(mod, idx) {
      var isDone = completedModules.indexOf(mod.id) !== -1;
      var isUnlocked = (typeof window.isModUnlocked === 'function') ? window.isModUnlocked(mod.id) : true;
      var isActive = !isDone && isUnlocked && !firstActiveFound;
      if (isActive) {
        firstActiveFound = true;
        activeStationIdx = idx;
      } else if (isDone) {
        activeStationIdx = Math.max(activeStationIdx, idx + 1);
      }

      var pCompletedLessons = player.completedLessons || [];
      var lessonsList = mod.lessons || [];
      var modDoneEx = 0;
      var modTotalEx = lessonsList.length + (mod.challenge ? 1 : 0) + (mod.codingTask ? 1 : 0);
      lessonsList.forEach(function(l) { if (pCompletedLessons.indexOf(l.id) !== -1) modDoneEx++; });
      if (mod.challenge && (player.completedChallenges || []).indexOf(mod.challenge.id) !== -1) modDoneEx++;
      if (mod.codingTask && (player.completedCoding || []).indexOf(mod.id) !== -1) modDoneEx++;

      if (isDone) doneModCount++;
      return {
        idx: idx,
        mod: mod,
        isDone: isDone,
        isUnlocked: isUnlocked,
        isActive: isActive,
        doneEx: modDoneEx,
        totalEx: modTotalEx,
        pct: modTotalEx > 0 ? Math.round((modDoneEx / modTotalEx) * 100) : 0
      };
    });

    var isCapstoneReady = doneModCount >= trackMods.length && trackMods.length > 0;
    var relicKeys = [
      trackMeta.biomeName + '_campfire',
      trackMeta.biomeName + '_ore_1',
      trackMeta.biomeName + '_ore_2',
      trackMeta.biomeName + '_boat'
    ];
    function countBiomeRelics() {
      var r = loadCollectedRelics();
      var cnt = 0;
      relicKeys.forEach(function(k) { if (r[k]) cnt++; });
      return cnt;
    }

    // ── Build Diorama Frame DOM ───────────────────────────────────────────
    var board = document.createElement('div');
    board.className = 'diorama-board';
    board.setAttribute('data-biome', trackMeta.biomeName);

    var atmosphereOn = getAtmospherePref();
    var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    board.innerHTML = (
      '<div class="diorama-hud-top">'
      + '  <div class="diorama-hud-pill diorama-title-pill">'
      + '    <span class="diorama-cube-badge">' + trackMeta.cubeSvg + '</span>'
      + '    <div class="diorama-title-copy">'
      + '      <div class="diorama-realm-title">' + esc(trackMeta.title) + '</div>'
      + '      <div class="diorama-realm-sub">' + esc(trackMeta.sub) + '</div>'
      + '    </div>'
      + '  </div>'
      + '  <div class="diorama-hud-actions">'
      + '    <button type="button" class="diorama-hud-btn" id="btn-diorama-relics" title="Tap campfire, river boat, and 2 cliff crystal veins on the island">'
      +        SVGS.gem + ' <span id="island-relic-count">' + countBiomeRelics() + '/4</span>'
      + '    </button>'
      + '    <button type="button" class="diorama-hud-btn ' + (atmosphereOn ? 'is-on' : '') + '" id="btn-diorama-atmos" title="Toggle fireflies & floating sparks">'
      +        SVGS.sparkles + ' <span>Glow</span>'
      + '    </button>'
      + '    <button type="button" class="diorama-hud-btn diorama-locate-btn" id="btn-locate-champion" title="Locate active quest pedestal">'
      +        SVGS.compass + ' <span>Locate</span>'
      + '    </button>'
      + '  </div>'
      + '</div>'
      + '<div class="diorama-viewport" id="diorama-viewport">'
      + '  <canvas class="diorama-canvas" id="diorama-canvas"></canvas>'
      + '  <svg class="diorama-leader-svg" aria-hidden="true"></svg>'
      + '  <div class="diorama-pins-layer"></div>'
      + '  <div class="diorama-hover-hint hidden" id="diorama-hover-hint"></div>'
      + '</div>'
    );
    container.appendChild(board);

    var viewport = board.querySelector('#diorama-viewport');
    var canvas = board.querySelector('#diorama-canvas');
    var leaderSvg = board.querySelector('.diorama-leader-svg');
    var pinsLayer = board.querySelector('.diorama-pins-layer');
    var hoverHint = board.querySelector('#diorama-hover-hint');
    var ctx = canvas.getContext('2d');

    var spriteMeta = getPlayerSpriteMeta(player);

    // ── Interactive Diorama World State ───────────────────────────────────
    var worldState = {
      width: 740,
      height: 1180,
      isCompact: false,
      ox: 370,
      oy: 88,
      tw: 36,
      th: 18,
      bh: 15,
      dpr: Math.min(window.devicePixelRatio || 1, 2.5),
      mx: 0,
      my: 0,
      pointerX: 0,
      pointerY: 0,
      hoveredTarget: null,
      hoveredStationIdx: -1,
      campfireLevel: loadCollectedRelics()[trackMeta.biomeName + '_campfire'] ? 2 : 1,
      oreHits: {
        ore1: loadCollectedRelics()[trackMeta.biomeName + '_ore_1'] ? 3 : 0,
        ore2: loadCollectedRelics()[trackMeta.biomeName + '_ore_2'] ? 3 : 0
      },
      boatSurge: 0,
      boatDir: 1,
      boatU: -4.2,
      heroHopY: 0,
      heroHopVel: 0,
      heroFacingIdx: activeStationIdx,
      beaconPulseT: 0,
      hintSecretsTimer: 0,
      treeSprings: {
        t1: { angle: 0, vel: 0 },
        t2: { angle: 0, vel: 0 },
        t3: { angle: 0, vel: 0 },
        t4: { angle: 0, vel: 0 }
      },
      pedestalLifts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      particles: [],
      ripples: [],
      motes: [],
      stationCoords: [],
      terrain: null,
      hitTargets: []
    };

    for (var m = 0; m < 18; m++) {
      worldState.motes.push({
        x: Math.random(),
        y: Math.random(),
        r: 1.4 + Math.random() * 2.2,
        speedY: 0.008 + Math.random() * 0.014,
        phase: Math.random() * Math.PI * 2
      });
    }

    function refreshRelicCounter() {
      var el = board.querySelector('#island-relic-count');
      if (el) el.textContent = countBiomeRelics() + '/4';
    }

    function showMapCallout(px, py, text) {
      if (!viewport || !text) return;
      var old = viewport.querySelector('.diorama-callout');
      if (old) old.remove();

      var pop = document.createElement('div');
      pop.className = 'diorama-callout';
      pop.textContent = text;
      var left = clamp(px, 118, Math.max(122, worldState.width - 118));
      var top = clamp(py - 18, 22, worldState.height - 60);
      pop.style.left = Math.round(left) + 'px';
      pop.style.top = Math.round(top) + 'px';
      viewport.appendChild(pop);

      setTimeout(function() {
        pop.classList.add('fading-out');
        setTimeout(function() { if (pop.parentNode) pop.remove(); }, 220);
      }, 2500);
    }

    function emitCanvasParticles(x, y, colors, count, spread) {
      if (reducedMotion) return;
      var n = count || 10;
      var sp = spread || 36;
      for (var i = 0; i < n; i++) {
        var ang = (Math.PI * 2 * i / n) + (Math.random() - 0.5) * 0.45;
        var spd = sp * (0.5 + Math.random() * 0.8);
        worldState.particles.push({
          x: x,
          y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 45,
          size: 3 + Math.random() * 3.5,
          color: colors[i % colors.length],
          life: 0,
          maxLife: 0.55 + Math.random() * 0.35
        });
      }
    }

    // ── Project Voxel Coordinates to Canvas Screen Space ──────────────────
    function proj(u, v, z) {
      var pxOff = worldState.mx * 4.5;
      var pyOff = worldState.my * 2.5;
      return {
        x: worldState.ox + u * worldState.tw + pxOff,
        y: worldState.oy + v * worldState.th - (z || 0) * worldState.bh + pyOff
      };
    }

    // ── Build Frosted Pin Overlay Cards (Zero Truncation & Clean Alignment)
    var pinRefs = [];
    var capstonePinEl = null;

    function createPinOverlay() {
      pinsLayer.innerHTML = '';
      pinRefs = [];

      stationData.forEach(function(st) {
        var numPrefix = (st.idx + 1 < 10) ? ('0' + (st.idx + 1)) : String(st.idx + 1);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'diorama-pin-card '
          + (st.isDone ? 'pin-done' : (st.isActive ? 'pin-active' : (st.isUnlocked ? 'pin-unlocked' : 'pin-locked')));
        btn.setAttribute('data-station-idx', String(st.idx));

        btn.innerHTML = (
          '<span class="dpin-badge">' + numPrefix + '</span>'
          + '<span class="dpin-copy">'
          + '  <span class="dpin-title">' + esc(st.mod.title) + '</span>'
          + '  <span class="dpin-meta">'
          + '    <span class="dpin-sub">' + st.doneEx + '/' + st.totalEx + ' Quests • ' + esc(st.mod.biome || 'Realm') + '</span>'
          + '    <span class="dpin-bar"><span class="dpin-bar-fill" style="width:' + st.pct + '%"></span></span>'
          + '  </span>'
          + '</span>'
          + '<span class="dpin-status">'
          + (st.isDone
              ? '<span class="st-pill st-done">' + SVGS.check + ' Done</span>'
              : (st.isActive
                  ? '<span class="st-pill st-active">Start</span>'
                  : (st.isUnlocked ? '<span class="st-pill st-ready">Ready</span>' : '<span class="st-pill st-lock">' + SVGS.lock + '</span>')
                )
            )
          + '</span>'
        );

        btn.onpointerenter = function() {
          worldState.hoveredStationIdx = st.idx;
          worldState.heroFacingIdx = st.idx;
          if (reducedMotion) requestAnimationFrame(renderFrame);
        };
        btn.onpointerleave = function() {
          if (worldState.hoveredStationIdx === st.idx) {
            worldState.hoveredStationIdx = -1;
            worldState.heroFacingIdx = activeStationIdx;
            if (reducedMotion) requestAnimationFrame(renderFrame);
          }
        };
        btn.onclick = function() {
          openChapterNodeModal(st.mod, st.isDone, st.isUnlocked);
        };

        pinsLayer.appendChild(btn);
        pinRefs.push({ btn: btn, data: st });
      });

      // Hero speech badge anchored above active pedestal
      var heroBadge = document.createElement('div');
      heroBadge.className = 'diorama-hero-tag';
      heroBadge.textContent = 'Next Quest';
      pinsLayer.appendChild(heroBadge);
      worldState.heroBadgeEl = heroBadge;

      // Capstone Card pinned cleanly beneath summit chest
      capstonePinEl = document.createElement('button');
      capstonePinEl.type = 'button';
      capstonePinEl.className = 'diorama-capstone-card ' + (isCapstoneReady ? 'cap-ready' : 'cap-locked');
      capstonePinEl.innerHTML = (
        '<div class="dcap-tag">' + esc(trackMeta.biomeName.toUpperCase()) + ' CAPSTONE • ' + doneModCount + '/' + trackMods.length + '</div>'
        + '<div class="dcap-title">' + esc(trackMeta.capstoneTitle) + '</div>'
        + '<div class="dcap-xp">' + (isCapstoneReady ? 'Open Workbench (+250 XP)' : '+250 XP Reward') + '</div>'
      );
      capstonePinEl.onclick = function() {
        var stCap = worldState.stationCoords[8];
        if (stCap) {
          var pt = proj(stCap.u, stCap.v, 3.6);
          emitCanvasParticles(pt.x, pt.y - 24, ['#FFE600', '#10B981', '#F59E0B'], 14, 48);
        }
        if (typeof window.openProjectModal === 'function') {
          window.openProjectModal(trackMeta.capstoneId);
        } else if (typeof openProjectModal === 'function') {
          openProjectModal(trackMeta.capstoneId);
        }
      };
      pinsLayer.appendChild(capstonePinEl);
    }

    // ── Layout Calculator on Init / Container Resize ──────────────────────
    function computeLayoutGeometry() {
      var cw = viewport.clientWidth || container.clientWidth || 720;
      worldState.isCompact = cw < 560;
      worldState.width = cw;
      worldState.dpr = Math.min(window.devicePixelRatio || 1, 2.5);

      if (worldState.isCompact) {
        worldState.tw = Math.max(22, cw * 0.056);
        worldState.th = worldState.tw * 0.58;
        worldState.bh = worldState.tw * 0.44;
        worldState.oy = 78;
        worldState.height = Math.round(worldState.oy + 54 * worldState.th + 135);
      } else {
        worldState.tw = clamp(cw * 0.048, 28, 39);
        worldState.th = worldState.tw * 0.5;
        worldState.bh = worldState.tw * 0.42;
        worldState.oy = 88;
        worldState.height = Math.round(worldState.oy + 54 * worldState.th + 135);
      }

      worldState.ox = Math.round(cw * 0.5);
      viewport.style.height = worldState.height + 'px';
      canvas.width = Math.round(worldState.width * worldState.dpr);
      canvas.height = Math.round(worldState.height * worldState.dpr);
      canvas.style.width = worldState.width + 'px';
      canvas.style.height = worldState.height + 'px';

      leaderSvg.setAttribute('viewBox', '0 0 ' + worldState.width + ' ' + worldState.height);
      leaderSvg.setAttribute('width', worldState.width);
      leaderSvg.setAttribute('height', worldState.height);

      worldState.stationCoords = buildStationCoords(worldState.isCompact);
      worldState.terrain = buildIslandVoxels(worldState.isCompact, worldState.stationCoords);
      syncOverlayPositions();
    }

    function syncOverlayPositions() {
      var leaderHtml = '';
      var isDark = document.body.classList.contains('dark-theme');
      var leaderStroke = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(11,11,14,0.22)';
      var activeLeaderStroke = '#F59E0B';

      pinRefs.forEach(function(item) {
        var stCoord = worldState.stationCoords[item.data.idx];
        var tile = worldState.terrain.tileMap[Math.round(stCoord.u) + ',' + Math.round(stCoord.v)]
          || { topZ: 2.8 };
        var pPt = proj(stCoord.u, stCoord.v, tile.topZ);

        var cardW = worldState.isCompact ? Math.min(162, Math.floor(worldState.width * 0.48)) : Math.min(285, Math.floor(worldState.width * 0.41));
        item.btn.style.width = cardW + 'px';

        var gap = worldState.isCompact ? 22 : 44;
        var leftPx;
        var anchorX;
        if (stCoord.labelSide === 'right') {
          leftPx = worldState.isCompact ? (worldState.width - cardW - 6) : clamp(pPt.x + gap, 8, worldState.width - cardW - 10);
          anchorX = leftPx;
        } else {
          leftPx = worldState.isCompact ? 6 : clamp(pPt.x - gap - cardW, 10, worldState.width - cardW - 8);
          anchorX = leftPx + cardW;
        }

        var topPx = clamp(pPt.y - (worldState.isCompact ? 2 : 0), 46, worldState.height - 150);
        item.btn.style.left = Math.round(leftPx) + 'px';
        item.btn.style.top = Math.round(topPx) + 'px';

        var strokeColor = item.data.isActive ? activeLeaderStroke : leaderStroke;
        var pedEdgeX = pPt.x + (stCoord.labelSide === 'right' ? 18 : -18);
        leaderHtml += '<line x1="' + pedEdgeX.toFixed(1) + '" y1="' + pPt.y.toFixed(1) + '" x2="' + anchorX.toFixed(1) + '" y2="' + topPx.toFixed(1) + '" stroke="' + strokeColor + '" stroke-width="1.5" stroke-dasharray="' + (item.data.isActive ? 'none' : '3 3') + '" />';
        leaderHtml += '<circle cx="' + anchorX.toFixed(1) + '" cy="' + topPx.toFixed(1) + '" r="3" fill="' + (item.data.isActive ? '#FFE600' : strokeColor) + '" />';
      });

      leaderSvg.innerHTML = leaderHtml;

      // Active hero floating speech tag positioned cleanly above avatar head
      if (worldState.heroBadgeEl && worldState.stationCoords[activeStationIdx]) {
        var hc = worldState.stationCoords[activeStationIdx];
        var hTile = worldState.terrain.tileMap[Math.round(hc.u) + ',' + Math.round(hc.v)] || { topZ: 3.0 };
        var hp = proj(hc.u, hc.v, hTile.topZ);
        worldState.heroBadgeEl.style.left = Math.round(hp.x) + 'px';
        worldState.heroBadgeEl.style.top = Math.round(hp.y - (worldState.isCompact ? 78 : 92)) + 'px';
      }

      // Capstone card anchored beneath 3D treasure chest
      if (capstonePinEl && worldState.stationCoords[8]) {
        var capC = worldState.stationCoords[8];
        var capP = proj(capC.u, capC.v, 3.5);
        capstonePinEl.style.left = Math.round(capP.x) + 'px';
        capstonePinEl.style.top = Math.round(capP.y + 18) + 'px';
      }
    }

    // ── Canvas Low-Level Isometric Block & Entity Drawing Primitives ────────
    function drawDiamondTile(px, py, tw, th, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(px, py - th);
      ctx.lineTo(px + tw, py);
      ctx.lineTo(px, py + th);
      ctx.lineTo(px - tw, py);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }
    }

    function drawIsoPrism(u, v, botZ, topZ, topFill, leftFill, rightFill, edgeStroke, trimTopFill) {
      var tw = worldState.tw;
      var th = worldState.th;
      var pTop = proj(u, v, topZ);
      var pBot = proj(u, v, botZ);

      if (topZ > botZ + 0.02) {
        // Left shaded wall
        ctx.beginPath();
        ctx.moveTo(pTop.x - tw, pTop.y);
        ctx.lineTo(pTop.x, pTop.y + th);
        ctx.lineTo(pBot.x, pBot.y + th);
        ctx.lineTo(pBot.x - tw, pBot.y);
        ctx.closePath();
        ctx.fillStyle = leftFill;
        ctx.fill();

        // Right deep-shaded wall
        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y + th);
        ctx.lineTo(pTop.x + tw, pTop.y);
        ctx.lineTo(pBot.x + tw, pBot.y);
        ctx.lineTo(pBot.x, pBot.y + th);
        ctx.closePath();
        ctx.fillStyle = rightFill;
        ctx.fill();

        // Turf lip overhang on upper rim of exposed cliffs
        if (trimTopFill) {
          var lipD = Math.min(worldState.bh * 0.34, (pBot.y - pTop.y) * 0.45);
          ctx.beginPath();
          ctx.moveTo(pTop.x - tw, pTop.y);
          ctx.lineTo(pTop.x, pTop.y + th);
          ctx.lineTo(pTop.x, pTop.y + th + lipD);
          ctx.lineTo(pTop.x - tw, pTop.y + lipD);
          ctx.closePath();
          ctx.fillStyle = trimTopFill;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(pTop.x, pTop.y + th);
          ctx.lineTo(pTop.x + tw, pTop.y);
          ctx.lineTo(pTop.x + tw, pTop.y + lipD);
          ctx.lineTo(pTop.x, pTop.y + th + lipD);
          ctx.closePath();
          ctx.fillStyle = leftFill;
          ctx.globalAlpha = 0.25;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      drawDiamondTile(pTop.x, pTop.y, tw, th, topFill, edgeStroke);
      return pTop;
    }

    function drawMiniIsoBox(cx, cy, rX, rY, heightPx, topCol, leftCol, rightCol, outline) {
      ctx.beginPath();
      ctx.moveTo(cx - rX, cy);
      ctx.lineTo(cx, cy + rY);
      ctx.lineTo(cx, cy + rY + heightPx);
      ctx.lineTo(cx - rX, cy + heightPx);
      ctx.closePath();
      ctx.fillStyle = leftCol;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy + rY);
      ctx.lineTo(cx + rX, cy);
      ctx.lineTo(cx + rX, cy + heightPx);
      ctx.lineTo(cx, cy + rY + heightPx);
      ctx.closePath();
      ctx.fillStyle = rightCol;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy - rY);
      ctx.lineTo(cx + rX, cy);
      ctx.lineTo(cx, cy + rY);
      ctx.lineTo(cx - rX, cy);
      ctx.closePath();
      ctx.fillStyle = topCol;
      ctx.fill();

      if (outline) {
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    }

    function draw3DPedestal(pt, stData, t, pal) {
      var idx = stData.idx;
      var isHovered = (worldState.hoveredStationIdx === idx) || (worldState.hoveredTarget && worldState.hoveredTarget.id === 'station_' + idx);
      var targetLift = isHovered ? 5 : (stData.isActive ? 2.5 : 0);
      worldState.pedestalLifts[idx] += (targetLift - worldState.pedestalLifts[idx]) * 0.2;
      var lift = worldState.pedestalLifts[idx];

      var rx = worldState.tw * 0.72;
      var ry = worldState.th * 0.68;
      var depth = 8;
      var cy = pt.y - lift;

      // Ground shadow
      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y + 4, rx * 1.06, ry * 1.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fill();

      // Active portal aura ring
      if (stData.isActive || isHovered) {
        var pulse = 0.85 + 0.15 * Math.sin(t * 3.4);
        ctx.beginPath();
        ctx.ellipse(pt.x, cy - 1, rx * 1.24 * pulse, ry * 1.28 * pulse, 0, 0, Math.PI * 2);
        ctx.strokeStyle = stData.isActive ? 'rgba(192,132,252,0.75)' : 'rgba(255,230,0,0.85)';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      // Stone pedestal skirt
      var skirtCol = stData.isDone ? '#065F46' : (stData.isActive ? '#4C1D95' : (stData.isUnlocked ? '#92400E' : '#27272A'));
      var topCol = stData.isDone ? '#10B981' : (stData.isActive ? '#8B5CF6' : (stData.isUnlocked ? '#FBBF24' : '#52525B'));
      var innerCol = stData.isDone ? '#059669' : (stData.isActive ? '#C084FC' : (stData.isUnlocked ? '#F59E0B' : '#3F3F46'));

      ctx.beginPath();
      ctx.ellipse(pt.x, cy + depth, rx, ry, 0, 0, Math.PI);
      ctx.lineTo(pt.x - rx, cy);
      ctx.ellipse(pt.x, cy, rx, ry, 0, Math.PI, 0, true);
      ctx.closePath();
      ctx.fillStyle = skirtCol;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Top disc
      ctx.beginPath();
      ctx.ellipse(pt.x, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = topCol;
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#FFE600' : 'rgba(0,0,0,0.6)';
      ctx.lineWidth = isHovered ? 2 : 1.3;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(pt.x, cy, rx * 0.72, ry * 0.72, 0, 0, Math.PI * 2);
      ctx.fillStyle = innerCol;
      ctx.fill();

      // Emblem on pedestal center
      ctx.save();
      ctx.strokeStyle = '#FFFFFF';
      ctx.fillStyle = '#FFFFFF';
      ctx.lineWidth = 2.1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (stData.isDone) {
        ctx.beginPath();
        ctx.moveTo(pt.x - 5, cy);
        ctx.lineTo(pt.x - 1, cy + 3);
        ctx.lineTo(pt.x + 6, cy - 4);
        ctx.stroke();
      } else if (stData.isActive) {
        ctx.beginPath();
        ctx.ellipse(pt.x, cy, rx * 0.36, ry * 0.36, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (stData.isUnlocked) {
        ctx.beginPath();
        ctx.arc(pt.x, cy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#E4E4E7';
        ctx.fillRect(pt.x - 4, cy - 1, 8, 5);
        ctx.beginPath();
        ctx.arc(pt.x, cy - 2, 2.5, Math.PI, 0);
        ctx.strokeStyle = '#E4E4E7';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      ctx.restore();

      // Vertical beacon light on active station
      if (stData.isActive) {
        var beamG = ctx.createLinearGradient(pt.x, cy - 88, pt.x, cy);
        beamG.addColorStop(0, 'rgba(192,132,252,0)');
        beamG.addColorStop(1, 'rgba(168,85,247,0.32)');
        ctx.fillStyle = beamG;
        ctx.fillRect(pt.x - rx * 0.65, cy - 88, rx * 1.3, 88);
      }

      worldState.hitTargets.push({
        id: 'station_' + idx,
        type: 'station',
        idx: idx,
        x: pt.x,
        y: cy,
        rx: rx + 6,
        ry: ry + 8,
        hint: 'Ch ' + (idx + 1) + ' • ' + stData.mod.title
      });
    }

    function draw3DChampion(pt, t) {
      var bob = reducedMotion ? 0 : Math.sin(t * 3.1) * 3;
      // Spring jump physics
      var cy = pt.y - 6 + bob - worldState.heroHopY;
      var sScale = worldState.isCompact ? 0.85 : 1.04;

      // Soft contact shadow + pulsing enchanted portal ring on pedestal
      var shAlpha = clamp(0.38 - worldState.heroHopY * 0.008, 0.1, 0.38);
      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y - 2, 13 * sScale, 6 * sScale, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,' + shAlpha + ')';
      ctx.fill();

      if (!reducedMotion) {
        for (var spIdx = 0; spIdx < 3; spIdx++) {
          var orbAng = t * 2.2 + spIdx * ((Math.PI * 2) / 3);
          var oxOrb = pt.x + Math.cos(orbAng) * 19 * sScale;
          var oyOrb = pt.y - 8 - ((t * 16 + spIdx * 9) % 28);
          ctx.fillStyle = spIdx === 0 ? '#FFE600' : '#E9D5FF';
          ctx.globalAlpha = 0.72;
          ctx.beginPath();
          ctx.arc(oxOrb, oyOrb, 1.8 * sScale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Isometric 3D cuboid helper anchored at front-bottom vertex (fx, fy)
      function isoPart(fx, fy, wL, wR, h, colTop, colLeft, colRight, lineW) {
        var sl = 0.44;
        var lB = { x: fx - wL, y: fy - wL * sl };
        var rB = { x: fx + wR, y: fy - wR * sl };
        var fT = { x: fx, y: fy - h };
        var lT = { x: fx - wL, y: fy - h - wL * sl };
        var rT = { x: fx + wR, y: fy - h - wR * sl };
        var bT = { x: fx - wL + wR, y: fy - h - (wL + wR) * sl };

        // Left-front face
        ctx.beginPath();
        ctx.moveTo(lB.x, lB.y); ctx.lineTo(fx, fy); ctx.lineTo(fT.x, fT.y); ctx.lineTo(lT.x, lT.y);
        ctx.closePath();
        ctx.fillStyle = colLeft; ctx.fill();

        // Right-side face
        ctx.beginPath();
        ctx.moveTo(fx, fy); ctx.lineTo(rB.x, rB.y); ctx.lineTo(rT.x, rT.y); ctx.lineTo(fT.x, fT.y);
        ctx.closePath();
        ctx.fillStyle = colRight; ctx.fill();

        // Top crown face
        ctx.beginPath();
        ctx.moveTo(lT.x, lT.y); ctx.lineTo(fT.x, fT.y); ctx.lineTo(rT.x, rT.y); ctx.lineTo(bT.x, bT.y);
        ctx.closePath();
        ctx.fillStyle = colTop; ctx.fill();

        if (lineW) {
          ctx.strokeStyle = 'rgba(11,11,14,0.85)';
          ctx.lineWidth = lineW;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(lB.x, lB.y); ctx.lineTo(fx, fy); ctx.lineTo(rB.x, rB.y);
          ctx.lineTo(rT.x, rT.y); ctx.lineTo(bT.x, bT.y); ctx.lineTo(lT.x, lT.y);
          ctx.closePath();
          ctx.stroke();
        }
        return { lT: lT, fT: fT, rT: rT, bT: bT };
      }

      ctx.save();
      ctx.translate(pt.x, cy);
      ctx.scale(sScale, sScale);

      var walkBob = reducedMotion ? 0 : Math.sin(t * 3.1) * 1.6;
      var cShirt = spriteMeta.colors.shirt;
      var cShirtHi = mixRgbStr(cShirt, '#FFFFFF', 0.22);
      var cShirtSh = mixRgbStr(cShirt, '#000000', 0.34);
      var cPants = spriteMeta.colors.pants;
      var cPantsSh = mixRgbStr(cPants, '#000000', 0.36);

      // Extract matching top & side head tones from user's chosen skin/hat palette
      var topSkinColor = '#4A3121';
      var sideSkinColor = '#8E5F3D';
      if (spriteMeta.hatData && Array.isArray(spriteMeta.hatData.grid) && spriteMeta.hatData.grid[0]) {
        var hSample = spriteMeta.hatData.grid[0][3] || spriteMeta.hatData.grid[1][3];
        if (hSample && hSample !== 'transparent') topSkinColor = hSample;
      } else if (spriteMeta.skinData && Array.isArray(spriteMeta.skinData.grid) && spriteMeta.skinData.grid[0]) {
        topSkinColor = spriteMeta.skinData.grid[0][3] || topSkinColor;
      }
      if (spriteMeta.skinData && Array.isArray(spriteMeta.skinData.grid) && spriteMeta.skinData.grid[4]) {
        sideSkinColor = mixRgbStr(spriteMeta.skinData.grid[4][0] || '#C68B59', '#000000', 0.28);
      }

      // 1. Optional 3D Flowing Cape tucked behind shoulder/torso
      if (spriteMeta.capeColor) {
        var capeSway = reducedMotion ? 0 : Math.sin(t * 4.2) * 2.5;
        ctx.beginPath();
        ctx.moveTo(4, -30);
        ctx.lineTo(13, -34);
        ctx.lineTo(17 + capeSway, -12);
        ctx.lineTo(6 + capeSway, -8);
        ctx.closePath();
        ctx.fillStyle = spriteMeta.capeColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(11,11,14,0.85)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Right-back & Left-front 3D Voxel Legs / Boots
      isoPart(5, -3 + walkBob * 0.35, 6, 5.5, 13, cPants, cPants, cPantsSh, 1.15);
      isoPart(-1, -0.5 - walkBob * 0.35, 6, 5.5, 13, cPants, cPants, cPantsSh, 1.15);

      // 3. Back-right Arm (recessed behind torso)
      isoPart(7.5, -16 - walkBob * 0.6, 4.5, 4.5, 14, cShirtHi, cShirt, cShirtSh, 1.15);

      // 4. 3D Sculpted Iso Torso + Belt Buckle
      isoPart(2.5, -13.5, 13.5, 8.5, 17, cShirtHi, cShirt, cShirtSh, 1.25);
      // Isometric belt trim
      isoPart(2.5, -13.5, 13.5, 8.5, 3.6, spriteMeta.colors.belt, spriteMeta.colors.belt, mixRgbStr(spriteMeta.colors.belt, '#000000', 0.3), 0.9);

      // 5. Front-left Swinging 3D Arm
      isoPart(-8.5, -15 + walkBob * 0.6, 5, 4.5, 14, cShirtHi, cShirt, cShirtSh, 1.15);

      // 6. 3D Isometric Voxel Head Cube (with user's chosen 8x8 pixel face & hat mapped in perspective!)
      var hFx = 3.5;
      var hFy = -30.5;
      var hWL = 16.5;
      var hWR = 11.5;
      var hH = 17.5;
      var headGeo = isoPart(hFx, hFy, hWL, hWR, hH, topSkinColor, '#C68B59', sideSkinColor, 1.4);

      // Map exact 8x8 skin grid + hat grid cleanly onto the isometric front-left cube face
      ctx.save();
      ctx.translate(headGeo.lT.x, headGeo.lT.y);
      ctx.transform(1, 0.44, 0, 1, 0, 0);
      var pw = hWL / 8;
      var ph = hH / 8;
      if (spriteMeta.skinData && Array.isArray(spriteMeta.skinData.grid)) {
        for (var gy = 0; gy < 8; gy++) {
          var rowStr = spriteMeta.skinData.grid[gy] || [];
          for (var gx = 0; gx < 8; gx++) {
            ctx.fillStyle = rowStr[gx] || '#C68B59';
            ctx.fillRect(gx * pw, gy * ph, pw + 0.3, ph + 0.3);
          }
        }
      }
      if (spriteMeta.hatData && Array.isArray(spriteMeta.hatData.grid)) {
        for (var hgy = 0; hgy < 8; hgy++) {
          var hrow = spriteMeta.hatData.grid[hgy] || [];
          for (var hgx = 0; hgx < 8; hgx++) {
            var hc = hrow[hgx];
            if (hc && hc !== 'transparent') {
              ctx.fillStyle = hc;
              ctx.fillRect(hgx * pw, hgy * ph, pw + 0.3, ph + 0.3);
            }
          }
        }
      }
      ctx.strokeStyle = 'rgba(11,11,14,0.85)';
      ctx.lineWidth = 1.25;
      ctx.strokeRect(0, 0, hWL, hH);
      ctx.restore();

      ctx.restore();

      worldState.hitTargets.push({
        id: 'hero',
        type: 'hero',
        x: pt.x,
        y: cy - 28 * sScale,
        rx: 20,
        ry: 34,
        hint: 'Tap Champion to cheer!'
      });
    }

    function draw3DTree(id, u, v, tile, pal, biome, t) {
      var sp = worldState.treeSprings[id];
      var basePt = proj(u, v, tile.topZ);
      var idleSway = reducedMotion ? 0 : Math.sin(t * 1.4 + u) * 0.025;
      var swayAngle = idleSway + sp.angle;

      // Ground shadow
      ctx.beginPath();
      ctx.ellipse(basePt.x + 2, basePt.y + 3, 18, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fill();

      ctx.save();
      ctx.translate(basePt.x, basePt.y);

      // Trunk
      drawMiniIsoBox(0, -18, 5.5, 3, 18, pal.trunkL, pal.trunkL, pal.trunkR, 'rgba(0,0,0,0.45)');

      ctx.rotate(swayAngle);
      if (biome === 'end') {
        // Crystal Chorus Spire
        drawMiniIsoBox(0, -40, 12, 6, 18, pal.treeLeavesA, pal.treeLeavesA, pal.treeLeavesB, 'rgba(0,0,0,0.5)');
        drawMiniIsoBox(0, -55, 7, 3.5, 14, pal.treeTopHi, pal.treeLeavesA, pal.treeLeavesB, 'rgba(0,0,0,0.45)');
      } else if (biome === 'nether') {
        // Layered Crimson Shroom Canopy
        drawMiniIsoBox(0, -34, 17, 9, 12, pal.treeLeavesA, pal.treeLeavesA, pal.treeLeavesB, 'rgba(0,0,0,0.5)');
        drawMiniIsoBox(-6, -32, 3.5, 2, 4, pal.treeTopHi, pal.treeTopHi, '#D97706', null);
        drawMiniIsoBox(6, -30, 3, 1.8, 3, pal.treeTopHi, pal.treeTopHi, '#D97706', null);
      } else {
        // Tiered Overworld Voxel Oak/Pine
        drawMiniIsoBox(0, -34, 17, 9, 13, pal.treeTopHi, pal.treeLeavesA, pal.treeLeavesB, 'rgba(0,0,0,0.45)');
        drawMiniIsoBox(0, -46, 12, 6.5, 11, pal.treeTopHi, pal.treeLeavesA, pal.treeLeavesB, 'rgba(0,0,0,0.4)');
      }
      ctx.restore();

      worldState.hitTargets.push({
        id: id,
        type: 'tree',
        u: u,
        v: v,
        x: basePt.x,
        y: basePt.y - 26,
        rx: 20,
        ry: 28,
        hint: 'Tap foliage to shake'
      });
    }

    function draw3DCampfire(u, v, tile, pal, t) {
      var pt = proj(u, v, tile.topZ);
      var lvl = worldState.campfireLevel;
      var flicker = reducedMotion ? 0 : Math.sin(t * 11) * 1.8 + Math.cos(t * 7) * 1.1;

      // Dynamic warm radial halo baked over hearth ground
      var haloR = 32 + lvl * 14;
      var g = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, haloR);
      g.addColorStop(0, mixRgbStr(pal.fireGlow, '#FFE600', 0.4, 0.35 + lvl * 0.08));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y, haloR, haloR * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crossed voxel logs (anchored at pt.x!)
      drawMiniIsoBox(pt.x - 3, pt.y - 4, 8, 3.5, 4, '#78350F', '#5C290B', '#3E1B07', '#0B0B0E');
      drawMiniIsoBox(pt.x + 3, pt.y - 3, 7, 3.5, 4, '#92400E', '#6D300B', '#451D06', '#0B0B0E');

      // Multi-layered animated flame cone
      var fh = 13 + lvl * 4.5 + flicker;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y - 6 - fh);
      ctx.quadraticCurveTo(pt.x + 8 + lvl, pt.y - 8, pt.x + 5, pt.y - 2);
      ctx.lineTo(pt.x - 5, pt.y - 2);
      ctx.quadraticCurveTo(pt.x - 8 - lvl, pt.y - 8, pt.x, pt.y - 6 - fh);
      ctx.closePath();
      ctx.fillStyle = pal.fireGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y - 5 - fh * 0.62);
      ctx.quadraticCurveTo(pt.x + 4, pt.y - 6, pt.x + 2.5, pt.y - 3);
      ctx.lineTo(pt.x - 2.5, pt.y - 3);
      ctx.quadraticCurveTo(pt.x - 4, pt.y - 6, pt.x, pt.y - 5 - fh * 0.62);
      ctx.closePath();
      ctx.fillStyle = '#FEF08A';
      ctx.fill();

      worldState.hitTargets.push({
        id: 'campfire',
        type: 'campfire',
        u: u,
        v: v,
        x: pt.x,
        y: pt.y - 10,
        rx: 18,
        ry: 18,
        hint: 'Tap campfire to stoke'
      });
    }

    function draw3DOreVein(id, u, v, tile, biome, t) {
      var hits = worldState.oreHits[id];
      var depleted = hits >= 3;
      var pt = proj(u, v, tile.topZ);

      var crystal = depleted ? '#64748B' : (biome === 'nether' ? '#FBBF24' : (biome === 'end' ? '#D8B4FE' : '#38BDF8'));
      var crystalHi = depleted ? '#94A3B8' : (biome === 'nether' ? '#FEF08A' : (biome === 'end' ? '#F5D0FE' : '#E0F2FE'));

      // Rocky boulder base (anchored at pt.x!)
      drawMiniIsoBox(pt.x, pt.y - 12, 13, 7.5, 11, '#71717A', '#52525B', '#3F3F46', '#0B0B0E');

      if (!depleted) {
        var glint = Math.sin(t * 4 + u) * 0.25 + 0.75;
        ctx.save();
        ctx.globalAlpha = glint;
        drawMiniIsoBox(pt.x - 4, pt.y - 20, 4.5, 2.5, 8, crystalHi, crystal, crystal, '#0B0B0E');
        drawMiniIsoBox(pt.x + 4, pt.y - 18, 4, 2.2, 6, crystalHi, crystal, crystal, '#0B0B0E');
        drawMiniIsoBox(pt.x, pt.y - 24, 3.8, 2.2, 7, '#FFFFFF', crystalHi, crystal, '#0B0B0E');
        ctx.restore();

        // Fracture lines after partial hits
        if (hits > 0) {
          ctx.strokeStyle = '#0B0B0E';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(pt.x - 4, pt.y - 11);
          ctx.lineTo(pt.x, pt.y - 7);
          if (hits >= 2) {
            ctx.lineTo(pt.x + 5, pt.y - 10);
          }
          ctx.stroke();
        }
      }

      worldState.hitTargets.push({
        id: id,
        type: 'ore',
        u: u,
        v: v,
        x: pt.x,
        y: pt.y - 14,
        rx: 18,
        ry: 18,
        hint: depleted ? 'Crystal vein harvested' : ('Mine crystal (' + (3 - hits) + ' hits left)')
      });
    }

    function draw3DBoat(t, biome, pal) {
      // Drifts gently along recessed canyon river (v = 21.2)
      var bob = reducedMotion ? 0 : Math.sin(t * 2.5) * 1.8;
      var u = worldState.boatU;
      var pt = proj(u, 21.3, 1.55);
      var bx = pt.x;
      var by = pt.y + bob;

      // Water wake chevron when surging
      if (worldState.boatSurge > 0.05) {
        ctx.strokeStyle = 'rgba(255,255,255,' + (worldState.boatSurge * 0.7).toFixed(2) + ')';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(bx - 18 * worldState.boatDir, by - 2);
        ctx.lineTo(bx - 4 * worldState.boatDir, by + 3);
        ctx.lineTo(bx - 16 * worldState.boatDir, by + 8);
        ctx.stroke();
      }

      var hullTop = biome === 'end' ? '#6D28D9' : (biome === 'nether' ? '#991B1B' : '#92400E');
      var sailCol = biome === 'end' ? '#E9D5FF' : (biome === 'nether' ? '#FBBF24' : '#FEF3C7');
      drawMiniIsoBox(bx, by - 5, 13, 6.5, 5, hullTop, '#5C290B', '#3E1B07', '#0B0B0E');

      // Mast & sail
      ctx.fillStyle = '#451A03';
      ctx.fillRect(bx - 1, by - 22, 2.2, 17);
      ctx.beginPath();
      ctx.moveTo(bx + 1, by - 21);
      ctx.lineTo(bx + 12, by - 13);
      ctx.lineTo(bx + 1, by - 10);
      ctx.closePath();
      ctx.fillStyle = sailCol;
      ctx.fill();
      ctx.strokeStyle = '#0B0B0E';
      ctx.lineWidth = 1;
      ctx.stroke();

      worldState.hitTargets.push({
        id: 'boat',
        type: 'boat',
        x: bx,
        y: by - 10,
        rx: 18,
        ry: 16,
        hint: 'Tap skiff to sail the rapids'
      });
    }

    function draw3DCapstoneChest(pt, t) {
      var hoverChest = worldState.hoveredTarget && worldState.hoveredTarget.id === 'capstone';
      var bob = (isCapstoneReady && !reducedMotion) ? Math.sin(t * 2.6) * 2.5 : 0;
      var cy = pt.y - 6 + bob - (hoverChest ? 3 : 0);

      // Golden plinth aura
      if (isCapstoneReady || hoverChest) {
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y + 1, 28, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,230,0,0.24)';
        ctx.fill();
      }

      // Shadow
      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y + 3, 20, 9.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.32)';
      ctx.fill();

      var bodyA = isCapstoneReady ? '#B45309' : '#52525B';
      var bodyB = isCapstoneReady ? '#78350F' : '#3F3F46';
      var gold = isCapstoneReady ? '#FFE600' : '#94A3B8';

      // Chest lower body
      drawMiniIsoBox(pt.x, cy - 11, 16, 8.5, 11, bodyA, bodyA, bodyB, '#0B0B0E');
      // Chest lid
      drawMiniIsoBox(pt.x, cy - 18, 16.5, 8.8, 6.5, '#D97706', bodyA, bodyB, '#0B0B0E');
      // Gold clasp front
      ctx.fillStyle = gold;
      ctx.fillRect(pt.x + 4, cy - 13, 4.5, 6);
      ctx.strokeStyle = '#0B0B0E';
      ctx.lineWidth = 1.1;
      ctx.strokeRect(pt.x + 4, cy - 13, 4.5, 6);

      worldState.hitTargets.push({
        id: 'capstone',
        type: 'capstone',
        x: pt.x,
        y: cy - 10,
        rx: 24,
        ry: 20,
        hint: trackMeta.capstoneTitle + ' (Capstone)'
      });
    }

    function drawBridgeDeckAndRails(uStart, uEnd, vBridge, pal, t) {
      var pL = proj(uStart - 0.6, vBridge, 2.75);
      var pR = proj(uEnd + 0.6, vBridge, 2.75);
      // Warm glowing lantern posts at corners
      var posts = [
        { u: uStart - 0.8, v: 18.8 },
        { u: uEnd + 0.8, v: 18.8 },
        { u: uStart - 0.8, v: 22.8 },
        { u: uEnd + 0.8, v: 22.8 }
      ];
      posts.forEach(function(po) {
        var pp = proj(po.u, po.v, 2.65);
        ctx.fillStyle = pal.bridgeDark;
        ctx.fillRect(pp.x - 2, pp.y - 16, 4, 16);
        // Tiny warm lantern bulb
        var flk = 0.75 + 0.25 * Math.sin(t * 7 + po.u);
        ctx.fillStyle = 'rgba(255,230,0,' + flk + ')';
        ctx.beginPath();
        ctx.arc(pp.x, pp.y - 17, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });
      // Plank seams across deck
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 1.2;
      for (var pv = 18.5; pv <= 23.2; pv += 0.85) {
        var sL = proj(-1.2, pv, 2.62);
        var sR = proj(1.2, pv, 2.62);
        ctx.beginPath();
        ctx.moveTo(sL.x, sL.y);
        ctx.lineTo(sR.x, sR.y);
        ctx.stroke();
      }
      void pL; void pR;
    }

    // ── Main Frame Render Loop ────────────────────────────────────────────
    var lastTime = performance.now();
    var rafId = null;

    function renderFrame(now) {
      var dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      var t = now / 1000;

      var isDark = document.body.classList.contains('dark-theme');
      var pal = BIOME_PALETTES[trackMeta.biomeName][isDark ? 'night' : 'day'];

      // Physics updates
      ['t1', 't2', 't3', 't4'].forEach(function(k) {
        var sp = worldState.treeSprings[k];
        if (!sp) return;
        sp.vel += (-85 * sp.angle - 6.5 * sp.vel) * dt;
        sp.angle += sp.vel * dt;
      });
      if (worldState.heroHopY > 0 || worldState.heroHopVel !== 0) {
        worldState.heroHopVel -= 380 * dt;
        worldState.heroHopY += worldState.heroHopVel * dt;
        if (worldState.heroHopY <= 0) {
          worldState.heroHopY = 0;
          worldState.heroHopVel = 0;
        }
      }
      if (worldState.boatSurge > 0.01) {
        worldState.boatU += worldState.boatDir * worldState.boatSurge * 3.8 * dt;
        worldState.boatSurge *= Math.pow(0.28, dt);
        if (worldState.boatU > 4.2) worldState.boatDir = -1;
        if (worldState.boatU < -5.2) worldState.boatDir = 1;
      } else {
        worldState.boatU = lerp(worldState.boatU, -4.0 + Math.sin(t * 0.45) * 0.85, dt * 1.5);
      }

      if (worldState.beaconPulseT > 0) worldState.beaconPulseT = Math.max(0, worldState.beaconPulseT - dt);
      if (worldState.hintSecretsTimer > 0) worldState.hintSecretsTimer = Math.max(0, worldState.hintSecretsTimer - dt);

      // Draw frame
      ctx.save();
      ctx.setTransform(worldState.dpr, 0, 0, worldState.dpr, 0, 0);
      ctx.clearRect(0, 0, worldState.width, worldState.height);

      // Subtle atmospheric sky wash behind floating island
      var skyGrad = ctx.createLinearGradient(0, 0, 0, worldState.height);
      skyGrad.addColorStop(0, pal.skyTop);
      skyGrad.addColorStop(1, pal.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, worldState.width, worldState.height);

      // Floating soft drifting cloud silhouettes under & behind island flanks
      var cloudShift = reducedMotion ? 0 : Math.sin(t * 0.25) * 14;
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.68)';
      [
        { x: worldState.width * 0.16 + cloudShift * 0.7, y: worldState.height * 0.28, w: 94, h: 24 },
        { x: worldState.width * 0.84 - cloudShift * 0.9, y: worldState.height * 0.56, w: 112, h: 28 },
        { x: worldState.width * 0.22 + cloudShift * 0.5, y: worldState.height * 0.85, w: 120, h: 26 }
      ].forEach(function(cl) {
        ctx.beginPath();
        ctx.roundRect(cl.x - cl.w * 0.5, cl.y - cl.h * 0.5, cl.w, cl.h, cl.h * 0.5);
        ctx.fill();
      });

      worldState.hitTargets = [];
      var terrain = worldState.terrain;
      if (!terrain) { ctx.restore(); return; }

      // Valid integer even-parity prop placements cleanly clear of glass pin cards ((u + v) % 2 === 0)
      var propTree1 = { id: 't1', u: worldState.isCompact ? -4 : -6, v: 8 };
      var propTree2 = { id: 't2', u: worldState.isCompact ? 4 : 6, v: 28 };
      var propTree3 = { id: 't3', u: worldState.isCompact ? -4 : -6, v: 24 };
      var propTree4 = { id: 't4', u: worldState.isCompact ? 4 : 6, v: 14 };
      var propCamp = { u: worldState.isCompact ? -2 : -4, v: worldState.isCompact ? 48 : 6 };
      var propOre1 = { id: 'ore1', u: worldState.isCompact ? 2 : 4, v: 24 };
      var propOre2 = { id: 'ore2', u: worldState.isCompact ? 3 : 4, v: worldState.isCompact ? 47 : 46 };
      var drawnMist = false;

      var drawnStations = {};
      var drawnHero = false;
      var drawnBoat = false;
      var drawnBridgeDetail = false;
      var drawnCapstone = false;

      // Strict Painter's Algorithm back-to-front pass (v ascending)
      for (var i = 0; i < terrain.tiles.length; i++) {
        var tile = terrain.tiles[i];

        if (tile.kind === 'water') {
          var wave = reducedMotion ? 0 : Math.sin(t * 2.8 + tile.u * 0.7 + tile.v * 0.5) * 0.06;
          drawIsoPrism(tile.u, tile.v, tile.botZ, tile.topZ + wave,
            tile.shadeSeed ? pal.waterTop : pal.waterDeep,
            pal.waterLeft, pal.waterRight, 'rgba(255,255,255,0.1)', null
          );
          // Animated shimmer streaks on river water
          if (!reducedMotion && ((tile.u + tile.v + Math.floor(t * 2)) % 4 === 0)) {
            var wp = proj(tile.u, tile.v, tile.topZ + wave + 0.03);
            ctx.fillStyle = pal.foam;
            ctx.globalAlpha = 0.25;
            ctx.fillRect(wp.x - 6, wp.y - 1, 12, 2);
            ctx.globalAlpha = 1;
          }
        } else if (tile.kind === 'waterfall') {
          var wDrop = reducedMotion ? 0 : Math.sin(t * 6 + tile.v) * 0.05;
          drawIsoPrism(tile.u, tile.v, 0.8, tile.topZ + wDrop,
            pal.waterTop, pal.waterDeep, pal.waterLeft, 'rgba(255,255,255,0.2)', null
          );
          // Cascading animated vertical foam ribbons down waterfall wall
          var fp = proj(tile.u, tile.v, tile.topZ);
          ctx.strokeStyle = pal.foam;
          ctx.lineWidth = 2.2;
          ctx.setLineDash([6, 8]);
          ctx.lineDashOffset = -(t * 42);
          ctx.globalAlpha = 0.78;
          ctx.beginPath();
          ctx.moveTo(fp.x - 4, fp.y);
          ctx.lineTo(fp.x - 4, fp.y + 18);
          ctx.moveTo(fp.x + 5, fp.y - 2);
          ctx.lineTo(fp.x + 5, fp.y + 16);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        } else if (tile.kind === 'bridge') {
          // Under-bridge water bed first!
          drawIsoPrism(tile.u, tile.v, tile.botZ, 1.4,
            pal.waterDeep, pal.waterLeft, pal.waterRight, null, null
          );
          // Hovering 3D wooden bridge deck slab above water
          drawIsoPrism(tile.u, tile.v, 2.28, tile.topZ,
            pal.bridgeTop, pal.bridgeRail, pal.bridgeDark, 'rgba(0,0,0,0.35)', null
          );
        } else if (tile.kind === 'road') {
          drawIsoPrism(tile.u, tile.v, tile.botZ, tile.topZ,
            tile.shadeSeed ? pal.roadA : pal.roadB,
            pal.roadLeft, pal.roadRight, pal.edge, null
          );
        } else {
          // Terraced Grass / Netherrack / Endstone Cliff Column
          var isDeepCliff = (tile.topZ - tile.botZ) > 2.2;
          drawIsoPrism(tile.u, tile.v, tile.botZ, tile.topZ,
            tile.shadeSeed ? pal.topA : pal.topB,
            isDeepCliff ? pal.subLeft : pal.wallLeft,
            isDeepCliff ? pal.subRight : pal.wallRight,
            pal.edge, pal.topTrim
          );
          if (tile.hasFlower) {
            var flP = proj(tile.u, tile.v, tile.topZ);
            ctx.fillStyle = trackMeta.biomeName === 'nether' ? '#FB923C' : (trackMeta.biomeName === 'end' ? '#C084FC' : '#FFE600');
            ctx.beginPath();
            ctx.arc(flP.x + (tile.u % 2 ? 4 : -4), flP.y + 1, 2.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw entities cleanly in exact (u, v) depth order right after ground tile!
        if (tile.u === propCamp.u && tile.v === propCamp.v) {
          draw3DCampfire(propCamp.u, propCamp.v, tile, pal, t);
        }
        if (tile.u === propTree1.u && tile.v === propTree1.v) {
          draw3DTree('t1', propTree1.u, propTree1.v, tile, pal, trackMeta.biomeName, t);
        }
        if (tile.u === propTree2.u && tile.v === propTree2.v) {
          draw3DTree('t2', propTree2.u, propTree2.v, tile, pal, trackMeta.biomeName, t);
        }
        if (tile.u === propTree3.u && tile.v === propTree3.v) {
          draw3DTree('t3', propTree3.u, propTree3.v, tile, pal, trackMeta.biomeName, t);
        }
        if (tile.u === propTree4.u && tile.v === propTree4.v) {
          draw3DTree('t4', propTree4.u, propTree4.v, tile, pal, trackMeta.biomeName, t);
        }
        if (tile.u === propOre1.u && tile.v === propOre1.v) {
          draw3DOreVein('ore1', propOre1.u, propOre1.v, tile, trackMeta.biomeName, t);
        }
        if (tile.u === propOre2.u && tile.v === propOre2.v) {
          draw3DOreVein('ore2', propOre2.u, propOre2.v, tile, trackMeta.biomeName, t);
        }

        // Waterfall splash mist puff where cascade enters canyon pool
        if (!drawnMist && tile.v >= 19) {
          var mp = proj(worldState.isCompact ? -4 : -5, 19.2, 1.55);
          var mistPulse = reducedMotion ? 0.45 : (0.35 + 0.2 * Math.sin(t * 5));
          ctx.fillStyle = pal.foam;
          ctx.globalAlpha = mistPulse;
          ctx.beginPath();
          ctx.ellipse(mp.x, mp.y, 24, 9, 0, 0, Math.PI * 2);
          ctx.ellipse(mp.x + 12, mp.y - 3, 14, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          drawnMist = true;
        }

        if (!drawnBoat && tile.v >= 22) {
          draw3DBoat(t, trackMeta.biomeName, pal);
          drawnBoat = true;
        }
        if (!drawnBridgeDetail && tile.v >= 23) {
          drawBridgeDeckAndRails(-1, 1, 20.5, pal, t);
          drawnBridgeDetail = true;
        }

        // Stations & Hero depth check
        for (var si = 0; si < 8; si++) {
          if (!drawnStations[si] && stationData[si]) {
            var sc = worldState.stationCoords[si];
            if (Math.round(sc.v) === tile.v && Math.abs(sc.u - tile.u) <= 1.2) {
              var sTile = terrain.tileMap[Math.round(sc.u) + ',' + Math.round(sc.v)] || tile;
              var sp = proj(sc.u, sc.v, sTile.topZ);
              draw3DPedestal(sp, stationData[si], t, pal);
              if (stationData[si].isActive && !drawnHero) {
                draw3DChampion(sp, t);
                drawnHero = true;
              }
              drawnStations[si] = true;
            }
          }
        }

        // Capstone Chest at Summit
        if (!drawnCapstone && tile.v >= 48 && Math.abs(tile.u) <= 1) {
          var cp = proj(0, 48.5, tile.topZ);
          draw3DCapstoneChest(cp, t);
          drawnCapstone = true;
        }
      }

      // Draw Illuminated Progress Spine over Road Pavers
      var activeLimit = clamp(worldState.hoveredStationIdx >= 0 ? worldState.hoveredStationIdx : activeStationIdx, 0, 8);
      if (terrain.roadPts && terrain.roadPts.length > 1) {
        ctx.save();
        ctx.beginPath();
        for (var rpi = 0; rpi <= Math.min(activeLimit + (activeLimit >= 3 ? 2 : 0), terrain.roadPts.length - 1); rpi++) {
          var rp = terrain.roadPts[rpi];
          var rt = terrain.tileMap[Math.round(rp.u) + ',' + Math.round(rp.v)] || { topZ: 2.65 };
          var screenR = proj(rp.u, rp.v, rt.topZ + 0.08);
          if (rpi === 0) ctx.moveTo(screenR.x, screenR.y);
          else ctx.lineTo(screenR.x, screenR.y);
        }
        ctx.strokeStyle = worldState.hoveredStationIdx >= 0 ? pal.hoverGlow : pal.litGlow;
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = -(t * 28);
        ctx.globalAlpha = 0.72;
        ctx.stroke();
        ctx.restore();
      }

      // River & Terrain Interactive Tap Ripples
      for (var ri = worldState.ripples.length - 1; ri >= 0; ri--) {
        var rpObj = worldState.ripples[ri];
        rpObj.life += dt;
        if (rpObj.life >= rpObj.maxLife) {
          worldState.ripples.splice(ri, 1);
          continue;
        }
        var pFrac = rpObj.life / rpObj.maxLife;
        var rad = 6 + pFrac * 28;
        ctx.beginPath();
        ctx.ellipse(rpObj.x, rpObj.y, rad, rad * 0.52, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rpObj.color;
        ctx.lineWidth = 2 * (1 - pFrac);
        ctx.globalAlpha = 1 - pFrac;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Rising Biome Atmospheric Fireflies / Embers / Stardust
      if (atmosphereOn && !reducedMotion) {
        for (var mi = 0; mi < worldState.motes.length; mi++) {
          var mt = worldState.motes[mi];
          var mxP = mt.x * worldState.width + Math.sin(t * 1.4 + mt.phase) * 14;
          var myP = ((mt.y - t * mt.speedY) % 1);
          if (myP < 0) myP += 1;
          var mAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.5 + mt.phase));
          ctx.fillStyle = pal.mote;
          ctx.globalAlpha = mAlpha;
          ctx.beginPath();
          ctx.arc(mxP, myP * worldState.height, mt.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Secret Relic Pulse Hints when Relics Pill is clicked
      if (worldState.hintSecretsTimer > 0) {
        var pulseA = 0.4 + 0.4 * Math.sin(t * 8);
        var collectedMap = loadCollectedRelics();
        worldState.hitTargets.forEach(function(ht) {
          var rKey = null;
          if (ht.id === 'campfire') rKey = trackMeta.biomeName + '_campfire';
          else if (ht.id === 'ore1') rKey = trackMeta.biomeName + '_ore_1';
          else if (ht.id === 'ore2') rKey = trackMeta.biomeName + '_ore_2';
          else if (ht.id === 'boat') rKey = trackMeta.biomeName + '_boat';
          if (rKey && !collectedMap[rKey]) {
            ctx.beginPath();
            ctx.arc(ht.x, ht.y, 24 + Math.sin(t * 6) * 4, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(56,189,248,' + pulseA + ')';
            ctx.lineWidth = 2.4;
            ctx.stroke();
          }
        });
      }

      // Locate Champion Sonar Beacon
      if (worldState.beaconPulseT > 0 && worldState.stationCoords[activeStationIdx]) {
        var ac = worldState.stationCoords[activeStationIdx];
        var at = terrain.tileMap[Math.round(ac.u) + ',' + Math.round(ac.v)] || { topZ: 2.8 };
        var ap = proj(ac.u, ac.v, at.topZ);
        var bFrac = 1 - (worldState.beaconPulseT / 1.4);
        ctx.beginPath();
        ctx.ellipse(ap.x, ap.y, 20 + bFrac * 70, (20 + bFrac * 70) * 0.52, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,230,0,' + (1 - bFrac) + ')';
        ctx.lineWidth = 3 * (1 - bFrac);
        ctx.stroke();
      }

      // Dynamic Burst Particles with Gravity
      for (var pi = worldState.particles.length - 1; pi >= 0; pi--) {
        var ptc = worldState.particles[pi];
        ptc.life += dt;
        if (ptc.life >= ptc.maxLife) {
          worldState.particles.splice(pi, 1);
          continue;
        }
        ptc.vy += 180 * dt;
        ptc.x += ptc.vx * dt;
        ptc.y += ptc.vy * dt;
        var pOp = 1 - (ptc.life / ptc.maxLife);
        ctx.fillStyle = ptc.color;
        ctx.globalAlpha = pOp;
        ctx.fillRect(ptc.x - ptc.size * 0.5, ptc.y - ptc.size * 0.5, ptc.size, ptc.size);
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      if (!reducedMotion) {
        rafId = requestAnimationFrame(renderFrame);
      }
    }

    // ── Pointer Hit-Testing & Rich Interactivity on Canvas ────────────────
    function findHitTarget(cx, cy) {
      for (var i = worldState.hitTargets.length - 1; i >= 0; i--) {
        var ht = worldState.hitTargets[i];
        var dx = (cx - ht.x) / ht.rx;
        var dy = (cy - ht.y) / ht.ry;
        if (dx * dx + dy * dy <= 1.0) return ht;
      }
      return null;
    }

    function onCanvasPointerMove(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      worldState.pointerX = cx;
      worldState.pointerY = cy;

      if (!reducedMotion) {
        worldState.mx = clamp(((cx / rect.width) - 0.5) * 2, -1, 1);
        worldState.my = clamp(((cy / rect.height) - 0.5) * 2, -1, 1);
      }

      var hit = findHitTarget(cx, cy);
      worldState.hoveredTarget = hit;
      worldState.hoveredStationIdx = (hit && hit.type === 'station') ? hit.idx : -1;
      canvas.style.cursor = hit ? 'pointer' : 'default';

      if (hoverHint) {
        if (hit && hit.hint) {
          hoverHint.textContent = hit.hint;
          hoverHint.classList.remove('hidden');
        } else {
          hoverHint.classList.add('hidden');
        }
      }
      if (reducedMotion) requestAnimationFrame(renderFrame);
    }

    function onCanvasPointerLeave() {
      worldState.mx = 0;
      worldState.my = 0;
      worldState.hoveredTarget = null;
      worldState.hoveredStationIdx = -1;
      canvas.style.cursor = 'default';
      if (hoverHint) hoverHint.classList.add('hidden');
      if (reducedMotion) requestAnimationFrame(renderFrame);
    }

    function onCanvasClick(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      var hit = findHitTarget(cx, cy);

      if (hit) {
        if (hit.type === 'station' && stationData[hit.idx]) {
          var st = stationData[hit.idx];
          openChapterNodeModal(st.mod, st.isDone, st.isUnlocked);
          return;
        }
        if (hit.type === 'capstone') {
          capstonePinEl && capstonePinEl.click();
          return;
        }
        if (hit.type === 'hero') {
          worldState.heroHopVel = 145;
          emitCanvasParticles(hit.x, hit.y, ['#FFE600', '#A855F7', '#10B981'], 12, 42);
          if (window.GameFX && window.GameFX.playXpPop) window.GameFX.playXpPop();
          var name = (player && player.name) ? String(player.name).slice(0, 18) : 'Hero';
          var quips = ['Let\'s code, ' + name + '!', 'Ready for Quest ' + (activeStationIdx + 1) + '!', 'Full JVM speed ahead!'];
          showMapCallout(hit.x, hit.y - 24, quips[Math.floor(Math.random() * quips.length)]);
          return;
        }
        if (hit.type === 'tree') {
          var sp = worldState.treeSprings[hit.id];
          sp.vel = (Math.random() > 0.5 ? 1 : -1) * 4.5;
          var pCol = trackMeta.biomeName === 'nether' ? ['#DC2626', '#F97316', '#FDE047'] : (trackMeta.biomeName === 'end' ? ['#A855F7', '#E9D5FF'] : ['#52B756', '#8AE48F', '#FFE600']);
          emitCanvasParticles(hit.x, hit.y - 12, pCol, 9, 34);
          if (window.GameFX && window.GameFX.playClick) window.GameFX.playClick();
          showMapCallout(hit.x, hit.y - 20, trackMeta.lore.tree);
          return;
        }
        if (hit.type === 'campfire') {
          worldState.campfireLevel = (worldState.campfireLevel % 3) + 1;
          emitCanvasParticles(hit.x, hit.y - 8, ['#F97316', '#FFE600', '#FFFFFF'], 11, 38);
          if (window.GameFX && window.GameFX.playXpPop) window.GameFX.playXpPop();
          saveCollectedRelic(trackMeta.biomeName + '_campfire');
          refreshRelicCounter();
          showMapCallout(hit.x, hit.y - 18, trackMeta.lore.campfire);
          return;
        }
        if (hit.type === 'ore') {
          var hCount = worldState.oreHits[hit.id];
          if (hCount < 3) {
            worldState.oreHits[hit.id] = hCount + 1;
            emitCanvasParticles(hit.x, hit.y - 6, ['#38BDF8', '#FFE600', '#FFFFFF'], 10, 42);
            if (window.GameFX && window.GameFX.playBlockBreak) window.GameFX.playBlockBreak();
            if (worldState.oreHits[hit.id] >= 3) {
              var keySuffix = hit.id === 'ore1' ? '_ore_1' : '_ore_2';
              saveCollectedRelic(trackMeta.biomeName + keySuffix);
              refreshRelicCounter();
              showMapCallout(hit.x, hit.y - 18, trackMeta.lore[hit.id]);
            } else {
              showMapCallout(hit.x, hit.y - 18, 'Mining... ' + (3 - worldState.oreHits[hit.id]) + ' more!');
            }
          } else {
            showMapCallout(hit.x, hit.y - 18, 'Crystal Relic already mined!');
          }
          return;
        }
        if (hit.type === 'boat') {
          worldState.boatSurge = 1.0;
          emitCanvasParticles(hit.x, hit.y, ['#38BDF8', '#FFFFFF', '#FFE600'], 10, 32);
          if (window.GameFX && window.GameFX.playMeowChirp) window.GameFX.playMeowChirp();
          saveCollectedRelic(trackMeta.biomeName + '_boat');
          refreshRelicCounter();
          showMapCallout(hit.x, hit.y - 18, trackMeta.lore.boat);
          return;
        }
      }

      // Click anywhere on open terrain or water -> isometric water/ground sonar ripple!
      var approxV = (cy - worldState.oy) / worldState.th;
      var inWaterZone = approxV >= 17.5 && approxV <= 24.5;
      worldState.ripples.push({
        x: cx,
        y: cy,
        life: 0,
        maxLife: 0.75,
        color: inWaterZone ? '#7DD3FC' : '#FFE600'
      });
      if (reducedMotion) requestAnimationFrame(renderFrame);
    }

    canvas.addEventListener('pointermove', onCanvasPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onCanvasPointerLeave);
    canvas.addEventListener('click', onCanvasClick);

    // ── Header HUD Control Wiring ─────────────────────────────────────────
    var locateBtn = board.querySelector('#btn-locate-champion');
    if (locateBtn) {
      locateBtn.onclick = function() {
        var ac = worldState.stationCoords[activeStationIdx];
        if (ac) {
          var at = (worldState.terrain && worldState.terrain.tileMap[Math.round(ac.u) + ',' + Math.round(ac.v)]) || { topZ: 2.8 };
          var ap = proj(ac.u, ac.v, at.topZ);
          var rect = viewport.getBoundingClientRect();
          window.scrollTo({ top: Math.max(0, window.scrollY + rect.top + ap.y - window.innerHeight * 0.45), behavior: 'smooth' });
        }
        worldState.beaconPulseT = 1.4;
        if (reducedMotion) requestAnimationFrame(renderFrame);
      };
    }

    var atmosBtn = board.querySelector('#btn-diorama-atmos');
    if (atmosBtn) {
      atmosBtn.onclick = function() {
        atmosphereOn = !atmosphereOn;
        setAtmospherePref(atmosphereOn);
        atmosBtn.classList.toggle('is-on', atmosphereOn);
        showMapCallout(worldState.width - 110, 42, atmosphereOn ? 'Biome ambient glow ON' : 'Biome ambient glow OFF');
      };
    }

    var relicsBtn = board.querySelector('#btn-diorama-relics');
    if (relicsBtn) {
      relicsBtn.onclick = function() {
        worldState.hintSecretsTimer = 3.0;
        var cnt = countBiomeRelics();
        if (cnt >= 4) {
          showMapCallout(worldState.width - 130, 42, 'All 4 Realm Relics discovered!');
        } else {
          showMapCallout(worldState.width - 130, 42, 'Find: Campfire, Boat & 2 Cliff Ores (' + cnt + '/4)');
        }
      };
    }

    createPinOverlay();
    computeLayoutGeometry();

    if (reducedMotion) {
      renderFrame(performance.now());
    } else {
      rafId = requestAnimationFrame(renderFrame);
    }

    var ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(function() {
        computeLayoutGeometry();
        if (reducedMotion) renderFrame(performance.now());
      });
      ro.observe(viewport);
    }

    window.relayoutAdventurePaths = function() {
      computeLayoutGeometry();
    };

    _activeCleanup = function() {
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      canvas.removeEventListener('pointermove', onCanvasPointerMove);
      canvas.removeEventListener('pointerleave', onCanvasPointerLeave);
      canvas.removeEventListener('click', onCanvasClick);
    };
  }
  window.renderAdventureTrail = renderAdventureTrail;

  // ── 7. Apple-Crafted Chapter Inspection Sheet Modal ───────────────────────
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
