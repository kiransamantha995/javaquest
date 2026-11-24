// JavaQuest — meowger.js
// Interactive Digital Pet Host & AI Companion "Meowger"
// Zero emojis — 100% pure inline SVG pixel-art architecture.
// Features: Autonomous roaming, mouse following, screen jumping, compiler reactions, and AI Tutor trigger.

(function() {
  'use strict';

  // ── 1. Pure SVG Sprite Definitions ──────────────────────────────────────────
  function getMeowgerSVG(state) {
    state = state || 'idle';
    return (
      '<svg class="meowger-svg meowger-' + state + '" viewBox="0 0 48 48" width="64" height="64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
      + '<!-- Drop shadow -->'
      + '<ellipse cx="24" cy="44" rx="14" ry="3.5" fill="rgba(0,0,0,0.22)" class="meowger-shadow"/>'
      
      + '<!-- Tail -->'
      + '<g class="meowger-tail">'
      + '  <rect x="36" y="30" width="4" height="4" fill="#A0522D"/>'
      + '  <rect x="40" y="26" width="4" height="5" fill="#CD853F"/>'
      + '  <rect x="42" y="21" width="4" height="6" fill="#A0522D"/>'
      + '  <rect x="40" y="17" width="4" height="5" fill="#FFE600"/>'
      + '</g>'

      + '<!-- Body / Black Hoodie -->'
      + '<g class="meowger-body">'
      + '  <rect x="14" y="26" width="20" height="13" rx="2" fill="#18191E"/>'
      + '  <!-- Hoodie Yellow Accent / Collar -->'
      + '  <rect x="20" y="26" width="8" height="3" fill="#FFE600"/>'
      + '  <rect x="23" y="29" width="2" height="4" fill="#FFE600"/>'
      + '</g>'

      + '<!-- Paws / Legs -->'
      + '<g class="meowger-paws">'
      + '  <rect x="16" y="39" width="5" height="4" fill="#FAF8F5" stroke="#18191E" stroke-width="1" class="paw-left"/>'
      + '  <rect x="27" y="39" width="5" height="4" fill="#FAF8F5" stroke="#18191E" stroke-width="1" class="paw-right"/>'
      + '</g>'

      + '<!-- Head Group (Caramel fur) -->'
      + '<g class="meowger-head">'
      + '  <!-- Left Ear -->'
      + '  <polygon points="12,18 16,8 21,18" fill="#A0522D"/>'
      + '  <polygon points="14,17 16,11 19,17" fill="#FFB6C1"/>'
      + '  <!-- Right Ear -->'
      + '  <polygon points="27,18 32,8 36,18" fill="#A0522D"/>'
      + '  <polygon points="29,17 32,11 34,17" fill="#FFB6C1"/>'

      + '  <!-- Head Base -->'
      + '  <rect x="11" y="14" width="26" height="15" rx="3" fill="#B87333"/>'
      + '  <rect x="13" y="13" width="22" height="3" fill="#CD853F"/>'

      + '  <!-- Fur Cheeks / Fluff -->'
      + '  <rect x="9" y="19" width="3" height="6" fill="#B87333"/>'
      + '  <rect x="36" y="19" width="3" height="6" fill="#B87333"/>'

      + '  <!-- White Muzzle -->'
      + '  <rect x="19" y="21" width="10" height="6" rx="2" fill="#FFF8DC"/>'
      + '  <!-- Dark Nose -->'
      + '  <polygon points="23,22 25,22 24,24" fill="#18191E"/>'
      + '  <!-- Whiskers (Crisp lines) -->'
      + '  <line x1="8" y1="21" x2="16" y2="22" stroke="#18191E" stroke-width="1.2"/>'
      + '  <line x1="8" y1="24" x2="16" y2="24" stroke="#18191E" stroke-width="1.2"/>'
      + '  <line x1="32" y1="22" x2="40" y2="21" stroke="#18191E" stroke-width="1.2"/>'
      + '  <line x1="32" y1="24" x2="40" y2="24" stroke="#18191E" stroke-width="1.2"/>'

      + '  <!-- Eyes Group -->'
      + '  <g class="meowger-eyes-group">'
      + '    <!-- Left Eye -->'
      + '    <rect x="15" y="17" width="5" height="5" rx="1" fill="#18191E" class="eye-left"/>'
      + '    <rect x="16" y="17" width="2" height="2" fill="#FFFFFF" class="pupil-left"/>'
      + '    <!-- Right Eye -->'
      + '    <rect x="28" y="17" width="5" height="5" rx="1" fill="#18191E" class="eye-right"/>'
      + '    <rect x="29" y="17" width="2" height="2" fill="#FFFFFF" class="pupil-right"/>'
      + '  </g>'
      + '</g>'

      + '<!-- Thinking / Particle Accents -->'
      + '<g class="meowger-fx">'
      + '  <!-- Spark / Lightbulb SVG (Zero Emoji) -->'
      + '  <g class="fx-idea" style="display:none">'
      + '    <circle cx="24" cy="4" r="3.5" fill="#FFE600" stroke="#18191E" stroke-width="1"/>'
      + '    <line x1="24" y1="0" x2="24" y2="2" stroke="#FFE600" stroke-width="1.5"/>'
      + '    <line x1="19" y1="4" x2="21" y2="4" stroke="#FFE600" stroke-width="1.5"/>'
      + '    <line x1="27" y1="4" x2="29" y2="4" stroke="#FFE600" stroke-width="1.5"/>'
      + '  </g>'
      + '  <!-- Celebration Heart SVG (Zero Emoji) -->'
      + '  <g class="fx-heart" style="display:none">'
      + '    <path d="M24,2 C22,0 19,0 19,3 C19,6 24,9 24,9 C24,9 29,6 29,3 C29,0 26,0 24,2 Z" fill="#EF4444" stroke="#18191E" stroke-width="0.8"/>'
      + '  </g>'
      + '</g>'
      + '</svg>'
    );
  }

  // ── 2. Pure SVG Dialog & Speech Bubble Icons (Zero Emoji) ───────────────────
  var SVG_ICONS = {
    chat: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h12v8H5l-3 3V3z"/></svg>',
    idea: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="6" r="4"/><path d="M6 10h4M7 13h2"/></svg>',
    code: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 4 1 8 5 12"/><polyline points="11 4 15 8 11 12"/></svg>',
    star: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><polygon points="8 1 10.2 5.5 15 6.2 11.5 9.6 12.3 14.5 8 12.2 3.7 14.5 4.5 9.6 1 6.2 5.8 5.5 8 1"/></svg>',
    check: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="3 8.5 6.5 12 13 4"/></svg>',
    close: '<svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>'
  };

  // ── 3. Meowger Pet Class ───────────────────────────────────────────────────
  function MeowgerCompanion() {
    this.el = null;
    this.bubbleEl = null;
    this.x = 80;
    this.y = 80;
    this.targetX = 80;
    this.targetY = 80;
    this.facing = 1; // 1 = right, -1 = left
    this.state = 'idle'; // idle, walk, curious, happy, thinking
    this.isNearMouse = false;
    this.lastWanderTime = Date.now();
    this.bubbleTimeout = null;
    this.activeScreen = 'home';
    this.enabled = true;
    this.dockedOnMobile = window.innerWidth <= 640;

    this.init();
  }

  MeowgerCompanion.prototype.init = function() {
    var self = this;

    // Check if container already exists
    if (document.getElementById('meowger-pet-wrap')) return;

    var wrap = document.createElement('div');
    wrap.id = 'meowger-pet-wrap';
    wrap.className = 'meowger-pet-wrap';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', 'Meowger the Java Pet. Click to ask AI Tutor.');

    // Speech bubble
    var bubble = document.createElement('div');
    bubble.className = 'meowger-speech-bubble hidden';
    bubble.id = 'meowger-speech-bubble';
    wrap.appendChild(bubble);

    // Sprite container
    var sprite = document.createElement('div');
    sprite.className = 'meowger-sprite-box';
    sprite.innerHTML = getMeowgerSVG('idle');
    wrap.appendChild(sprite);

    document.body.appendChild(wrap);

    this.el = wrap;
    this.bubbleEl = bubble;

    // Position initially at bottom right safe corner
    this.setInitialPosition();

    // Bind Interactions
    wrap.addEventListener('click', function(e) {
      e.stopPropagation();
      self.onPetClick();
    });

    wrap.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self.onPetClick();
      }
    });

    // Mouse proximity listener (throttle with requestAnimationFrame)
    var ticking = false;
    window.addEventListener('mousemove', function(e) {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          self.handleMouseMove(e.clientX, e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Handle window resize (mobile docking)
    window.addEventListener('resize', function() {
      self.dockedOnMobile = window.innerWidth <= 640;
      if (self.dockedOnMobile) {
        self.dockToMobileCorner();
      }
    }, { passive: true });

    // Start Main Pet Loop
    this.startLoop();

    // Greet user on first launch
    setTimeout(function() {
      self.say('Meow! I am Meowger, your Java coding pet. Click me anytime for AI tutoring!', 5000);
    }, 2500);
  };

  MeowgerCompanion.prototype.setInitialPosition = function() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    this.x = vw - 96;
    this.y = vh - 110;
    this.updateElementPosition();
  };

  MeowgerCompanion.prototype.dockToMobileCorner = function() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    this.x = vw - 76;
    this.y = vh - 86;
    this.updateElementPosition();
  };

  MeowgerCompanion.prototype.updateElementPosition = function() {
    if (!this.el) return;
    this.el.style.transform = 'translate3d(' + Math.round(this.x) + 'px, ' + Math.round(this.y) + 'px, 0) scaleX(' + this.facing + ')';
  };

  MeowgerCompanion.prototype.handleMouseMove = function(mx, my) {
    if (this.dockedOnMobile) return;
    if (this.state === 'jump' || this.state === 'happy') return;

    // Center coordinates of Meowger
    var cx = this.x + 32;
    var cy = this.y + 32;
    var dx = mx - cx;
    var dy = my - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Look towards cursor when within 160px
    if (dist < 160) {
      this.facing = dx >= 0 ? 1 : -1;
      this.isNearMouse = true;

      // Eye tracking reflection
      var pupilLeft = this.el.querySelector('.pupil-left');
      var pupilRight = this.el.querySelector('.pupil-right');
      if (pupilLeft && pupilRight) {
        var offsetX = Math.max(-1, Math.min(1, Math.round(dx / 40)));
        var offsetY = Math.max(-1, Math.min(1, Math.round(dy / 40)));
        pupilLeft.setAttribute('x', 16 + offsetX);
        pupilLeft.setAttribute('y', 17 + offsetY);
        pupilRight.setAttribute('x', 29 + offsetX);
        pupilRight.setAttribute('y', 17 + offsetY);
      }

      // If mouse is very close (40px - 90px), playfully inch towards or lean
      if (dist > 50 && dist < 100 && this.state !== 'walk') {
        this.targetX = this.x + (dx * 0.12);
        this.targetY = this.y + (dy * 0.12);
        this.clampBounds();
      }
    } else {
      if (this.isNearMouse) {
        this.isNearMouse = false;
        // Reset pupils
        var pl = this.el.querySelector('.pupil-left');
        var pr = this.el.querySelector('.pupil-right');
        if (pl) { pl.setAttribute('x', 16); pl.setAttribute('y', 17); }
        if (pr) { pr.setAttribute('x', 29); pr.setAttribute('y', 17); }
      }
    }
  };

  MeowgerCompanion.prototype.clampBounds = function() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var minX = 16;
    var maxX = vw - 80;
    var minY = 64; // Under top navbar
    var maxY = vh - 96;

    this.targetX = Math.max(minX, Math.min(maxX, this.targetX));
    this.targetY = Math.max(minY, Math.min(maxY, this.targetY));
  };

  MeowgerCompanion.prototype.startLoop = function() {
    var self = this;

    setInterval(function() {
      self.tick();
    }, 120);

    // Periodic roaming check every 4 seconds
    setInterval(function() {
      self.maybeWander();
    }, 4500);

    // Periodic tip bubble every 65 seconds
    setInterval(function() {
      self.maybeShareKnowledge();
    }, 65000);
  };

  MeowgerCompanion.prototype.tick = function() {
    if (this.dockedOnMobile) return;
    if (this.state === 'jump') return;

    var dx = this.targetX - this.x;
    var dy = this.targetY - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 3) {
      this.state = 'walk';
      this.facing = dx >= 0 ? 1 : -1;
      var speed = Math.min(6, Math.max(2, dist * 0.15));
      this.x += (dx / dist) * speed;
      this.y += (dy / dist) * speed;
      this.updateElementPosition();
      this.setVisualState('walk');
    } else {
      if (this.state === 'walk') {
        this.state = 'idle';
        this.setVisualState('idle');
      }
    }
  };

  MeowgerCompanion.prototype.maybeWander = function() {
    if (this.dockedOnMobile) return;
    if (this.isNearMouse || this.state === 'walk' || this.state === 'happy') return;
    var now = Date.now();
    if (now - this.lastWanderTime < 10000) return;

    // 40% probability to wander to a new edge spot
    if (Math.random() < 0.45) {
      this.lastWanderTime = now;
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      // Pick a smart safe anchor based on current screen
      if (this.activeScreen === 'map') {
        // Near the center path or bottom right
        this.targetX = (vw * 0.5) + (Math.random() > 0.5 ? 180 : -220);
        this.targetY = Math.random() * (vh - 240) + 120;
      } else if (this.activeScreen === 'lesson') {
        // Sits in bottom right near console
        this.targetX = vw - 88;
        this.targetY = vh - 100;
      } else {
        // Wanders safe bottom zone
        this.targetX = Math.random() * (vw - 160) + 80;
        this.targetY = vh - 96 - (Math.random() * 40);
      }
      this.clampBounds();
    }
  };

  MeowgerCompanion.prototype.setVisualState = function(stateName) {
    if (!this.el) return;
    var sprite = this.el.querySelector('.meowger-sprite-box');
    if (sprite) {
      sprite.innerHTML = getMeowgerSVG(stateName);
    }
  };

  MeowgerCompanion.prototype.say = function(messageHtml, durationMs) {
    var self = this;
    if (!this.bubbleEl) return;
    durationMs = durationMs || 4500;

    clearTimeout(this.bubbleTimeout);

    this.bubbleEl.innerHTML = (
      '<div class="bubble-inner">'
      + '<span class="bubble-icon">' + SVG_ICONS.chat + '</span>'
      + '<span class="bubble-text">' + messageHtml + '</span>'
      + '</div>'
    );
    this.bubbleEl.classList.remove('hidden');

    this.bubbleTimeout = setTimeout(function() {
      if (self.bubbleEl) self.bubbleEl.classList.add('hidden');
    }, durationMs);
  };

  MeowgerCompanion.prototype.onPetClick = function() {
    var self = this;
    // Play happy bounce
    this.triggerReaction('happy');

    // Trigger AI Chat Drawer (Replaces the old FAB)
    if (typeof window.toggleChat === 'function') {
      window.toggleChat(true);
    } else {
      this.say('How can I help you write Java today, Adventurer?', 4000);
    }
  };

  MeowgerCompanion.prototype.triggerReaction = function(type) {
    var self = this;
    if (!this.el) return;

    if (type === 'happy') {
      this.setVisualState('happy');
      var fx = this.el.querySelector('.fx-heart');
      if (fx) fx.style.display = 'block';

      this.el.classList.add('meowger-hop');
      setTimeout(function() {
        if (self.el) self.el.classList.remove('meowger-hop');
        self.setVisualState('idle');
        if (fx) fx.style.display = 'none';
      }, 900);
    } else if (type === 'thinking') {
      this.setVisualState('thinking');
      var idea = this.el.querySelector('.fx-idea');
      if (idea) idea.style.display = 'block';

      setTimeout(function() {
        self.setVisualState('idle');
        if (idea) idea.style.display = 'none';
      }, 1500);
    }
  };

  // Screen jumping mechanism
  MeowgerCompanion.prototype.onScreenChanged = function(screenName) {
    this.activeScreen = screenName;
    var self = this;

    // Disappear with puff effect
    if (this.el) {
      this.el.classList.add('meowger-teleport-out');
    }

    setTimeout(function() {
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      if (screenName === 'map') {
        // Jump onto map area
        self.x = Math.max(30, (vw * 0.5) + 160);
        self.y = 220;
        self.targetX = self.x;
        self.targetY = self.y;
        self.say('Welcome to the Adventure Map! Follow the trail to conquer Java.', 4000);
      } else if (screenName === 'lesson') {
        // Dock at bottom right corner of lesson interface
        self.x = vw - 84;
        self.y = vh - 96;
        self.targetX = self.x;
        self.targetY = self.y;
        self.say('I am watching your code editor! Tap me if you get stuck.', 3500);
      } else if (screenName === 'compiler') {
        self.x = vw - 88;
        self.y = 80;
        self.targetX = self.x;
        self.targetY = self.y;
        self.say('Ready to compile! Press Run Code to test your logic.', 3500);
      } else {
        self.x = vw - 96;
        self.y = vh - 110;
        self.targetX = self.x;
        self.targetY = self.y;
      }

      self.clampBounds();
      self.updateElementPosition();

      if (self.el) {
        self.el.classList.remove('meowger-teleport-out');
        self.el.classList.add('meowger-teleport-in');
        setTimeout(function() {
          if (self.el) self.el.classList.remove('meowger-teleport-in');
        }, 350);
      }
    }, 200);
  };

  // Knowledge bites (Zero emoji)
  MeowgerCompanion.prototype.maybeShareKnowledge = function() {
    var tips = [
      'Java 21 Virtual Threads let you run millions of lightweight tasks effortlessly.',
      'Remember: In Java, primitive types like int and boolean are passed by value.',
      'Always compare Strings using .equals() instead of == in Java.',
      'Stuck on an exception? Click me and ask JavaBot for a Socratic hint!',
      'Check the Adventure Trail on the Map to see what capstone awaits you!'
    ];
    var randomTip = tips[Math.floor(Math.random() * tips.length)];
    this.say(randomTip, 5500);
  };

  // ── 4. Global Singleton & Lifecycle Registration ─────────────────────────────
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

  // Hook into compiler events
  window.meowgerReactToRun = function(success, errorMsg) {
    if (!window.Meowger) return;
    if (success) {
      window.Meowger.triggerReaction('happy');
      window.Meowger.say('Clean execution! All tests passed.', 3500);
    } else {
      window.Meowger.triggerReaction('thinking');
      window.Meowger.say('Compiler spotted an issue. Tap me if you need an explanation.', 4500);
    }
  };

})();
