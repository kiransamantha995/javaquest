// JavaQuest — adventure-trail.js
// W3Schools Adventure-inspired Winding RPG Trail Map
// 100% Pure Inline SVG Pixel-Art Architecture — Zero Unicode Emojis
// Full Day Mode & Night Mode High-Contrast Compatibility

(function() {
  'use strict';

  // ── 1. Pure SVG Scenery & Icon Generators (Zero Emoji) ──────────────────────
  var SVGS = {
    // Overworld Oak Tree
    treeOverworld: function() {
      return (
        '<svg class="scenery-svg scenery-tree" viewBox="0 0 40 50" width="52" height="65" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="20" cy="47" rx="14" ry="3" fill="rgba(0,0,0,0.18)"/>'
        + '<!-- Trunk -->'
        + '<rect x="16" y="28" width="8" height="18" fill="#5C3A21"/>'
        + '<rect x="18" y="32" width="3" height="12" fill="#7A4E2D"/>'
        + '<!-- Foliage Layers (Pixel Blocks) -->'
        + '<rect x="6" y="16" width="28" height="14" rx="2" fill="#2E6930"/>'
        + '<rect x="8" y="10" width="24" height="12" rx="2" fill="#3D8B40"/>'
        + '<rect x="11" y="4" width="18" height="10" rx="2" fill="#52B756"/>'
        + '<rect x="13" y="6" width="8" height="4" fill="#78D17B"/>'
        + '<rect x="23" y="12" width="6" height="4" fill="#78D17B"/>'
        + '</svg>'
      );
    },

    // Nether Crimson Fungi
    treeNether: function() {
      return (
        '<svg class="scenery-svg scenery-tree" viewBox="0 0 40 50" width="52" height="65" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="20" cy="47" rx="14" ry="3" fill="rgba(0,0,0,0.3)"/>'
        + '<rect x="16" y="24" width="8" height="22" fill="#3A1728"/>'
        + '<rect x="18" y="26" width="3" height="18" fill="#5C2541"/>'
        + '<path d="M5 24 C5 10 35 10 35 24 Z" fill="#8B0000"/>'
        + '<path d="M8 20 C8 11 32 11 32 20 Z" fill="#DC2626"/>'
        + '<rect x="12" y="14" width="4" height="4" fill="#FCA5A5"/>'
        + '<rect x="24" y="16" width="4" height="3" fill="#FCA5A5"/>'
        + '<circle cx="14" cy="28" r="2.5" fill="#FFE600" opacity="0.8"/>'
        + '</svg>'
      );
    },

    // The End Obsidian Obelisk
    treeEnd: function() {
      return (
        '<svg class="scenery-svg scenery-tree" viewBox="0 0 36 60" width="46" height="75" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="18" cy="56" rx="12" ry="3" fill="rgba(0,0,0,0.4)"/>'
        + '<polygon points="8,54 13,8 23,8 28,54" fill="#181324"/>'
        + '<polygon points="12,54 15,8 21,8 24,54" fill="#2E2445"/>'
        + '<circle cx="18" cy="6" r="3.5" fill="#C084FC"/>'
        + '<circle cx="18" cy="6" r="1.5" fill="#FAF5FF"/>'
        + '<rect x="14" y="22" width="2" height="6" fill="#A855F7" opacity="0.7"/>'
        + '<rect x="20" y="36" width="2" height="5" fill="#A855F7" opacity="0.7"/>'
        + '</svg>'
      );
    },

    // Cut Tree Stump
    stump: function() {
      return (
        '<svg class="scenery-svg scenery-stump" viewBox="0 0 32 26" width="36" height="30" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="16" cy="22" rx="12" ry="4" fill="rgba(0,0,0,0.18)"/>'
        + '<rect x="6" y="10" width="20" height="12" fill="#5C3A21"/>'
        + '<ellipse cx="16" cy="10" rx="10" ry="4.5" fill="#C49A6C" stroke="#5C3A21" stroke-width="1.5"/>'
        + '<ellipse cx="16" cy="10" rx="6" ry="2.8" fill="#A67C52"/>'
        + '<circle cx="16" cy="10" r="1.5" fill="#5C3A21"/>'
        + '</svg>'
      );
    },

    // Speckled Mushroom
    mushroom: function() {
      return (
        '<svg class="scenery-svg scenery-mushroom" viewBox="0 0 24 24" width="28" height="28" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="12" cy="22" rx="7" ry="2" fill="rgba(0,0,0,0.15)"/>'
        + '<rect x="10" y="14" width="4" height="8" fill="#E4E4E7"/>'
        + '<path d="M3 14 C3 6 21 6 21 14 Z" fill="#DC2626"/>'
        + '<circle cx="8" cy="10" r="2" fill="#FFFFFF"/>'
        + '<circle cx="16" cy="10" r="2" fill="#FFFFFF"/>'
        + '<circle cx="12" cy="8" r="1.5" fill="#FFFFFF"/>'
        + '</svg>'
      );
    },

    // Water Pond with Lily Pad
    pond: function() {
      return (
        '<svg class="scenery-svg scenery-pond" viewBox="0 0 60 40" width="70" height="46" fill="none">'
        + '<ellipse cx="30" cy="20" rx="27" ry="17" fill="#60A5FA" opacity="0.3"/>'
        + '<ellipse cx="30" cy="20" rx="24" ry="14" fill="#3B82F6"/>'
        + '<ellipse cx="28" cy="19" rx="20" ry="11" fill="#2563EB"/>'
        + '<!-- Lily Pad -->'
        + '<circle cx="20" cy="16" r="4.5" fill="#10B981"/>'
        + '<polygon points="20,16 25,14 24,18" fill="#2563EB"/>'
        + '<circle cx="36" cy="22" r="3" fill="#10B981"/>'
        + '</svg>'
      );
    },

    // River Boulders / Rocks
    rocks: function() {
      return (
        '<svg class="scenery-svg scenery-rocks" viewBox="0 0 32 20" width="34" height="22" fill="none" shape-rendering="crispEdges">'
        + '<ellipse cx="11" cy="13" rx="8" ry="5" fill="#52525B" stroke="#27272A" stroke-width="1.5"/>'
        + '<rect x="7" y="10" width="4" height="2" fill="#A1A1AA"/>'
        + '<ellipse cx="22" cy="14" rx="6" ry="4" fill="#71717A" stroke="#27272A" stroke-width="1.5"/>'
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
        + '<rect x="6" y="18" width="32" height="18" rx="2" fill="' + bodyColor + '" stroke="#18191E" stroke-width="2"/>'
        + '<rect x="9" y="20" width="26" height="4" fill="' + rimColor + '"/>'
        + '<!-- Chest Lid Curve -->'
        + '<rect x="6" y="8" width="32" height="10" rx="3" fill="' + bodyColor + '" stroke="#18191E" stroke-width="2"/>'
        + '<rect x="8" y="10" width="28" height="3" fill="' + (isUnlocked ? '#CD853F' : '#64748B') + '"/>'
        + '<!-- Gold Bands -->'
        + '<rect x="13" y="8" width="4" height="28" fill="' + goldColor + '" stroke="#18191E" stroke-width="1"/>'
        + '<rect x="27" y="8" width="4" height="28" fill="' + goldColor + '" stroke="#18191E" stroke-width="1"/>'
        + '<!-- Center Keyhole Clasp -->'
        + '<rect x="19" y="16" width="6" height="7" rx="1" fill="' + goldColor + '" stroke="#18191E" stroke-width="1.5"/>'
        + '<circle cx="22" cy="19" r="1" fill="#18191E"/>'
        + '<rect x="21.5" y="19" width="1" height="2.5" fill="#18191E"/>'
        + '</svg>'
      );
    },

    // Checkmark SVG
    check: '<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4"/></svg>',

    // Padlock SVG
    lock: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V4.5a3 3 0 0 1 6 0V7"/></svg>',

    // Star SVG
    star: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#18191E" stroke-width="1.2"><polygon points="8 1 10.2 5.5 15 6.2 11.5 9.6 12.3 14.5 8 12.2 3.7 14.5 4.5 9.6 1 6.2 5.8 5.5 8 1"/></svg>',

    // Coin SVG
    coin: '<svg viewBox="0 0 16 16" width="14" height="14" fill="#FFE600" stroke="#18191E" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3.5" fill="#F59E0B"/><line x1="8" y1="5.5" x2="8" y2="10.5" stroke="#18191E" stroke-width="1"/></svg>',

    // Close SVG
    close: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>',

    // Map Trail icon
    trailIcon: '<svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15 C3 11 9 11 9 7 C9 3 15 3 15 3"/><circle cx="3" cy="15" r="1.5" fill="currentColor"/><circle cx="15" cy="3" r="1.5" fill="currentColor"/></svg>',

    // List icon
    listIcon: '<svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="5" x2="15" y2="5"/><line x1="3" y1="9" x2="15" y2="9"/><line x1="3" y1="13" x2="15" y2="13"/></svg>'
  };

  // ── 2. View Mode State ──────────────────────────────────────────────────────
  var _mapViewMode = 'trail'; // 'trail' | 'list'
  try {
    var savedMode = localStorage.getItem('javaquest_map_view_mode');
    if (savedMode === 'trail' || savedMode === 'list') {
      _mapViewMode = savedMode;
    }
  } catch(e) {}

  function setMapViewMode(mode) {
    _mapViewMode = (mode === 'list') ? 'list' : 'trail';
    try { localStorage.setItem('javaquest_map_view_mode', _mapViewMode); } catch(e) {}

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

  // ── 3. Render Adventure Trail Map ──────────────────────────────────────────
  function renderAdventureTrail(container, filteredMods, activeTrackFilter) {
    if (!container) return;
    container.innerHTML = '';

    var player = (typeof getPlayerState === 'function') ? getPlayerState() : { completedLessons: [], completedModules: [] };
    var completedLessons = player.completedLessons || [];
    var firstActiveLocated = false;

    // Outer Trail Container
    var trailBoard = document.createElement('div');
    trailBoard.className = 'adventure-trail-board';

    // Track Biome Background Decorator
    var biomeName = 'overworld';
    if (activeTrackFilter === 'intermediate') biomeName = 'nether';
    if (activeTrackFilter === 'advanced') biomeName = 'end';
    trailBoard.setAttribute('data-biome', biomeName);

    // Winding path layout offsets
    var sCurveOffsets = [0, 48, 76, 42, -42, -76, -48, 0];
    var globalNodeIdx = 0;

    filteredMods.forEach(function(mod, modIdx) {
      var isModDone = (player.completedModules || []).indexOf(mod.id) !== -1;
      var isModUnlocked = (typeof isModUnlocked === 'function') ? isModUnlocked(mod.id) : true;

      // ── Chapter Pill Banner ──
      var chapBanner = document.createElement('div');
      chapBanner.className = 'trail-chapter-header ' + (isModUnlocked ? 'unlocked' : 'locked');
      chapBanner.innerHTML = (
        '<div class="trail-chap-pill-badge">'
        + '<span class="trail-chap-code">' + esc(mod.code || ('M' + (modIdx + 1))) + '</span>'
        + '</div>'
        + '<div class="trail-chap-info">'
        + '  <div class="trail-chap-title">' + esc(mod.title) + '</div>'
        + '  <div class="trail-chap-sub">' + esc(mod.lessons.length) + ' Quests • ' + esc(mod.biome || 'Kingdom') + '</div>'
        + '</div>'
        + '<div class="trail-chap-status-tag ' + (isModDone ? 'done' : (isModUnlocked ? 'active' : 'locked')) + '">'
        + (isModDone ? 'Completed' : (isModUnlocked ? 'In Progress' : 'Locked'))
        + '</div>'
      );
      trailBoard.appendChild(chapBanner);

      // ── Chapter Trail Path Segment ──
      var segment = document.createElement('div');
      segment.className = 'trail-chapter-segment';

      // Place lessons along winding curve
      mod.lessons.forEach(function(lesson, lIdx) {
        var isLessonDone = completedLessons.indexOf(lesson.id) !== -1;
        var isLessonUnlocked = (typeof isLessonUnlocked === 'function') ? isLessonUnlocked(mod.id, lesson.id) : true;
        var isActiveQuest = !isLessonDone && isLessonUnlocked && !firstActiveLocated;

        if (isActiveQuest) {
          firstActiveLocated = true;
        }

        var offsetIdx = globalNodeIdx % sCurveOffsets.length;
        var xOffset = sCurveOffsets[offsetIdx];
        globalNodeIdx++;

        // Node Row Container
        var row = document.createElement('div');
        row.className = 'trail-node-row';
        row.style.setProperty('--x-offset', xOffset + 'px');

        // Scenery element beside the node
        var sceneryHtml = '';
        var side = (xOffset >= 0) ? 'left' : 'right';
        if (lIdx % 2 === 0) {
          if (biomeName === 'nether') sceneryHtml = SVGS.treeNether();
          else if (biomeName === 'end') sceneryHtml = SVGS.treeEnd();
          else sceneryHtml = SVGS.treeOverworld();
        } else if (lIdx % 3 === 0) {
          sceneryHtml = (biomeName === 'overworld') ? SVGS.pond() : SVGS.rocks();
        } else if (lIdx % 4 === 1) {
          sceneryHtml = SVGS.stump();
        } else {
          sceneryHtml = SVGS.mushroom();
        }

        var decorEl = document.createElement('div');
        decorEl.className = 'trail-scenery-slot ' + side;
        decorEl.innerHTML = sceneryHtml;
        row.appendChild(decorEl);

        // Stepping Stone Node
        var node = document.createElement('button');
        node.type = 'button';
        node.className = 'trail-step-node ' + (isLessonDone ? 'node-done' : (isActiveQuest ? 'node-active' : (isLessonUnlocked ? 'node-unlocked' : 'node-locked')));
        node.setAttribute('aria-label', lesson.title + ' (' + (isLessonDone ? 'Completed' : (isLessonUnlocked ? 'Unlocked' : 'Locked')) + ')');

        // Inner node graphic (Zero Emoji)
        var innerGraphic = '';
        if (isLessonDone) {
          innerGraphic = '<span class="node-icon-check">' + SVGS.check + '</span>';
        } else if (isActiveQuest) {
          innerGraphic = '<span class="node-active-step">' + (lIdx + 1) + '/' + mod.lessons.length + '</span>'
                       + '<div class="node-pulse-ring"></div>';
        } else if (isLessonUnlocked) {
          innerGraphic = '<span class="node-num">' + (lIdx + 1) + '</span>';
        } else {
          innerGraphic = '<span class="node-icon-lock">' + SVGS.lock + '</span>';
        }

        node.innerHTML = innerGraphic;

        // Active Player / Meowger Perch Marker
        if (isActiveQuest) {
          var meowgerMarker = document.createElement('div');
          meowgerMarker.className = 'trail-meowger-marker';
          meowgerMarker.title = 'Meowger is waiting for you here!';
          meowgerMarker.innerHTML = (
            '<div class="marker-speech">Next Quest!</div>'
            + '<div class="marker-avatar">'
            + '  <svg viewBox="0 0 24 24" width="28" height="28" shape-rendering="crispEdges">'
            + '    <polygon points="6,9 8,3 11,9" fill="#A0522D"/>'
            + '    <polygon points="13,9 16,3 18,9" fill="#A0522D"/>'
            + '    <rect x="5" y="7" width="14" height="10" rx="2" fill="#B87333"/>'
            + '    <rect x="9" y="11" width="6" height="4" fill="#FFF8DC"/>'
            + '    <rect x="7" y="9" width="3" height="3" fill="#18191E"/>'
            + '    <rect x="14" y="9" width="3" height="3" fill="#18191E"/>'
            + '  </svg>'
            + '</div>'
          );
          node.appendChild(meowgerMarker);
        }

        // Click handler to open Lesson Modal
        node.onclick = function() {
          openTrailNodeModal(mod, lesson, isLessonDone, isLessonUnlocked);
        };

        row.appendChild(node);
        segment.appendChild(row);
      });

      // ── Milestone Treasure Chest at Chapter / Capstone End ──
      var chestRow = document.createElement('div');
      chestRow.className = 'trail-node-row trail-chest-row';
      var isChestUnlocked = isModDone || isModUnlocked;

      var chestBtn = document.createElement('button');
      chestBtn.type = 'button';
      chestBtn.className = 'trail-chest-node ' + (isChestUnlocked ? 'chest-unlocked' : 'chest-locked');
      chestBtn.setAttribute('aria-label', mod.title + ' Capstone Reward');
      chestBtn.innerHTML = SVGS.treasureChest(isChestUnlocked) + '<span class="chest-label">' + esc(mod.code || 'CH') + ' Capstone</span>';

      chestBtn.onclick = function() {
        if (isChestUnlocked) {
          if (typeof openCapstoneWorkbench === 'function') {
            openCapstoneWorkbench(mod.capstoneId || 'proj-beginner');
          } else {
            openTrailNodeModal(mod, mod.lessons[mod.lessons.length - 1], isModDone, true);
          }
        } else {
          if (typeof toast === 'function') toast('Complete earlier quests to unlock this Capstone Chest!');
        }
      };

      chestRow.appendChild(chestBtn);
      segment.appendChild(chestRow);

      trailBoard.appendChild(segment);
    });

    container.appendChild(trailBoard);
  }
  window.renderAdventureTrail = renderAdventureTrail;

  // ── 4. Trail Node Detail Popover (Neobrutalist Zero Emoji) ─────────────────
  function openTrailNodeModal(mod, lesson, isDone, isUnlocked) {
    var existing = document.getElementById('trail-node-popover-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'trail-node-popover-modal';
    modal.className = 'trail-modal-backdrop';

    var xpVal = lesson.xp || 30;
    var statusTitle = isDone ? 'Completed' : (isUnlocked ? 'Ready to Start' : 'Locked');
    var statusClass = isDone ? 'status-done' : (isUnlocked ? 'status-active' : 'status-locked');

    var card = document.createElement('div');
    card.className = 'trail-modal-card';
    card.innerHTML = (
      '<div class="trail-modal-header">'
      + '  <div class="trail-modal-badges">'
      + '    <span class="trail-modal-pill">' + esc(mod.code || 'QUEST') + '</span>'
      + '    <span class="trail-modal-status ' + statusClass + '">' + statusTitle + '</span>'
      + '  </div>'
      + '  <button class="trail-modal-close" id="btn-close-trail-modal" aria-label="Close">' + SVGS.close + '</button>'
      + '</div>'
      + '<h2 class="trail-modal-title">' + esc(lesson.title) + '</h2>'
      + '<p class="trail-modal-desc">' + esc(lesson.desc || ('Master ' + lesson.title + ' with interactive hands-on coding.')) + '</p>'
      + '<div class="trail-modal-meta">'
      + '  <div class="trail-meta-chip">' + SVGS.coin + ' <span>+' + xpVal + ' XP</span></div>'
      + '  <div class="trail-meta-chip">' + SVGS.star + ' <span>' + esc(mod.biome || 'Overworld') + '</span></div>'
      + '</div>'
      + '<div class="trail-modal-actions">'
      + (isUnlocked
          ? '<button class="btn-primary trail-btn-action" id="btn-trail-start">' + (isDone ? 'Review Quest' : 'Start Quest') + '</button>'
          : '<button class="btn-secondary trail-btn-action" disabled>Complete earlier quests to unlock</button>'
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

    var startBtn = card.querySelector('#btn-trail-start');
    if (startBtn) {
      startBtn.onclick = function() {
        modal.remove();
        if (typeof startLesson === 'function') {
          startLesson(mod.id, lesson.id);
        }
      };
    }
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
