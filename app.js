
function getPlayerState() {
  if (STATE && STATE.player) return STATE.player;
  return {
    name: 'JavaLearner',
    level: 1,
    xp: 0,
    hearts: 3,
    difficulty: 'beginner',
    completedModules: [],
    completedLessons: [],
    completedChallenges: [],
    completedCoding: []
  };
}

// JavaQuest — app.js (Supabase Edition)
// Pure addEventListener, no inline onclick, full Supabase sync

/* ═══════════════ XSS SAFETY UTILITY ════════════════════════════
   Use esc(str) anywhere text from user input or AI output is
   inserted into the DOM. For plain text prefer textContent.      */
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* Safe-text helper: sets textContent rather than innerHTML (defined below at original location) */

/* ═══════════════ DIFFICULTY CONFIG ═════════════════════════════ */
var DIFFICULTY_LIMITS = {
  beginner:     8,   // modules B1–B8 (8 modules + Capstone 1)
  intermediate: 16,  // modules B1–I8 (16 modules + Capstone 2)
  advanced:     24   // all 24 modules (B1–A8 + Capstone 3)
};
var DIFFICULTY_LABELS = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced'
};

/* ═══════════════ STATE ══════════════════════════════════════════ */
var STATE = null;

function sanitizeState(state) {
  if (!state || !state.player) state = { player: {} };
  var p = state.player;
  if (!p.name) p.name = 'JavaLearner';
  if (!p.difficulty || ['beginner','intermediate','advanced'].indexOf(p.difficulty) === -1) p.difficulty = 'beginner';
  if (!p.avatar || typeof p.avatar !== 'object') p.avatar = { skin: 0, hair: 0, hairColor: 0, outfit: 0, accessory: 0 };
  if (!p.minecraftSkin || p.minecraftSkin === 'steve') p.minecraftSkin = 'blockhead'; if (!p.avatarHat) p.avatarHat = 'none'; if (!p.avatarCape) p.avatarCape = 'none';
  if (!p.theme) p.theme = (typeof localStorage !== 'undefined' && localStorage.getItem('javaquest_theme')) || 'light';
  if (!Array.isArray(p.completedLessons)) p.completedLessons = [];
  if (!Array.isArray(p.completedModules)) p.completedModules = [];
  if (!Array.isArray(p.completedChallenges)) p.completedChallenges = [];
  if (!Array.isArray(p.completedCoding)) p.completedCoding = [];
  if (!p.codingAttempts || typeof p.codingAttempts !== 'object') p.codingAttempts = {};
  if (!Array.isArray(p.badges)) p.badges = [];
  if (!p.capstoneProjects || typeof p.capstoneProjects !== 'object') p.capstoneProjects = {};
  if (typeof p.xp !== 'number' || isNaN(p.xp)) p.xp = 0;
  if (typeof p.level !== 'number' || isNaN(p.level)) p.level = 1;
  if (typeof p.streak !== 'number' || isNaN(p.streak)) p.streak = 1;
  if (typeof p.hearts !== 'number' || isNaN(p.hearts)) p.hearts = 3;
  return state;
}

function freshState(name, diff, skin) {
  return sanitizeState({
    player: {
      name:          name || 'JavaLearner',
      difficulty:    diff || 'beginner',
      avatar:        { skin: skin || 0, hair: 0, hairColor: 0, outfit: 0, accessory: 0 },
      minecraftSkin: 'blockhead', avatarHat: 'none', avatarCape: 'none',
      theme:         (typeof localStorage !== 'undefined' && localStorage.getItem('javaquest_theme')) || 'light',
      xp: 0, level: 1, streak: 1, lastVisit: new Date().toDateString(),
      hearts: 3, heartRefillTime: null,
      badges: [], completedLessons: [], completedModules: [], completedChallenges: [],
      completedCoding: [], codingAttempts: {}, capstoneProjects: {}
    }
  });
}

function localSave() {
  if (!STATE) return;
  STATE = sanitizeState(STATE);
  // Local backup so app works offline briefly
  try { localStorage.setItem('jq_local', JSON.stringify(STATE)); } catch(e) {}
  // Sync to Supabase (debounced)
  sbSaveAll(STATE);
}

function localLoad() {
  try {
    var r = localStorage.getItem('jq_local');
    return r ? sanitizeState(JSON.parse(r)) : null;
  } catch(e) {
    return null;
  }
}

/* ═══════════════ HELPERS ════════════════════════════════════════ */
function ge(id)      { return document.getElementById(id); }
function qs(sel)     { return document.querySelector(sel); }
function qsa(sel)    { return document.querySelectorAll(sel); }
function setText(id,v){ var e=ge(id); if(e) e.textContent=String(v); }
function setHTML(id,v){ var e=ge(id); if(e) e.innerHTML=v; }
function setWidth(id,p){ var e=ge(id); if(e) e.style.width=p; }

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function fmt(s) {
  if (!s) return '';
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`]+)`/g,'<code style="background:rgba(108,99,255,.18);padding:.1rem .35rem;border-radius:4px;color:#C084FC;font-family:monospace;font-size:.9em">$1</code>')
    .replace(/\n/g,'<br>');
}

var _toastT = null;
function toast(msg) {
  var t = ge('jq-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'jq-toast';
    t.style.cssText = 'position:fixed;bottom:5.5rem;right:1.5rem;z-index:99999;background:rgba(14,14,36,.97);border:1px solid rgba(108,99,255,.5);color:#fff;padding:.65rem 1.2rem;border-radius:999px;font-size:.88rem;font-weight:600;box-shadow:0 4px 24px rgba(0,0,0,.5);pointer-events:none;transition:opacity .3s;opacity:0;font-family:Outfit,sans-serif';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(_toastT);
  _toastT = setTimeout(function(){ t.style.opacity='0'; }, 2800);
}
function showModal(id){ var e=ge(id); if(e) e.classList.remove('hidden'); }
function hideModal(id){ var e=ge(id); if(e) e.classList.add('hidden'); }

/* ── NIGHT / DARK MODE THEME SYSTEM ── */
var MOON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
var SUN_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

function getSavedTheme() {
  try {
    if (STATE && STATE.player && STATE.player.theme) return STATE.player.theme;
    if (typeof localStorage !== 'undefined') {
      var saved = localStorage.getItem('javaquest_theme');
      if (saved) return saved;
    }
  } catch(e) {}
  return 'light';
}

function applyTheme(theme) {
  var isDark = (theme === 'dark');
  if (isDark) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  if (STATE && STATE.player) {
    STATE.player.theme = theme;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('javaquest_theme', theme);
    }
  } catch(e) {}
  updateThemeUI(isDark);
}

function updateThemeUI(isDark) {
  var icon = ge('theme-toggle-icon');
  if (icon) icon.innerHTML = isDark ? SUN_SVG : MOON_SVG;
  var btn = ge('theme-toggle-btn');
  if (btn) {
    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Night Mode';
    btn.setAttribute('aria-label', btn.title);
  }
  var authIcon = ge('auth-theme-toggle-icon');
  if (authIcon) authIcon.innerHTML = isDark ? SUN_SVG : MOON_SVG;
  var authBtn = ge('auth-theme-toggle-btn');
  if (authBtn) {
    authBtn.title = isDark ? 'Switch to Light Mode' : 'Switch to Night Mode';
    authBtn.setAttribute('aria-label', authBtn.title);
  }
  var setBtn = ge('settings-theme-toggle-btn');
  if (setBtn) {
    setBtn.textContent = isDark ? 'Switch to Day Mode' : 'Switch to Night Mode';
  }
}

function toggleTheme() {
  var current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  var next = (current === 'dark') ? 'light' : 'dark';
  applyTheme(next);
  if (typeof localSave === 'function') localSave();
  toast(next === 'dark' ? 'Night mode activated!' : 'Day mode activated!');
}

function initTheme() {
  var theme = getSavedTheme();
  applyTheme(theme);
}

/* ═══════════════ SCREENS ════════════════════════════════════════ */
var ALL_SCREENS = ['auth','home','map','lesson','challenge','coding','compiler','avatar','badges','settings'];

function showScreen(name) {
  if (name !== 'auth' && (!STATE || !STATE.player)) {
    name = 'auth';
  }
  if (name !== 'compiler' && _activeCapstoneProj) {
    saveCapstoneCode();
  }
  for (var i=0; i<ALL_SCREENS.length; i++) {
    var el = ge('screen-'+ALL_SCREENS[i]);
    if (el) el.classList.toggle('active', ALL_SCREENS[i]===name);
  }
  var nav = ge('navbar');
  if (nav) nav.style.display = (name==='auth') ? 'none' : 'flex';
  var aiChat = ge('ai-chat-wrapper');
  if (aiChat) aiChat.style.display = (name==='auth') ? 'none' : 'flex';
  if (name==='auth') {
    var cp = ge('chat-panel');
    if (cp) cp.classList.add('hidden');
  }
  qsa('.nav-btn').forEach(function(b){ b.classList.remove('active'); });
  var nb = ge('nav-'+name); if (nb) nb.classList.add('active');
  try {
    if (name==='home')     renderHome();
    if (name==='map')      renderMap();
    if (name==='badges')   renderBadges();
    if (name==='compiler') initCompiler();
    if (name==='settings') renderSettings();
    if (name==='avatar') {
      _avDraft = Object.assign({}, (STATE && STATE.player ? STATE.player.avatar : {}));
      var ni = ge('avatar-name-input'); if(ni && STATE && STATE.player) ni.value = STATE.player.name;
      if (STATE && STATE.player) {
        setText('avatar-preview-name', STATE.player.name);
        setText('avatar-preview-level', 'Level '+STATE.player.level+' · '+getLv().name);
      }
      switchAvatarTab('skin');
      drawAvatar(ge('avatar-display-editor'), _avDraft);
    }
  } catch(e) {
    console.error('Error rendering screen ' + name + ':', e);
  }
}

/* ═══════════════ AUTH SCREENS ═══════════════════════════════════ */
var _signupDiff = 'beginner';
var _signupSkin = 0;
var _signupMinecraftSkin = 'blockhead';
var SKIN_COLORS = ['#FDBCB4','#EAA175','#D08B5B','#AE5D29','#3B1F1A'];

function initAuthUI() {
  // Skin buttons (Minecraft character previews)
  var row = ge('login-skin-row');
  if (row) {
    row.innerHTML = '';
    var skinKeys = ['blockhead', 'scout', 'crystal_knight', 'hisser', 'void_coder', 'circuit_mage', 'cyber_crafter', 'gilded_monarch'];
    skinKeys.forEach(function(key, i){
      var s = MINECRAFT_SKINS[key];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'login-skin-btn minecraft-login-skin' + (i===0 ? ' selected' : '');
      btn.setAttribute('data-skin', key);
      btn.title = s.name;
      btn.innerHTML = renderMinecraftSVG(s.grid);
      row.appendChild(btn);
    });
    row.addEventListener('click', function(e){
      var btn = e.target.closest('.login-skin-btn'); if(!btn) return;
      _signupMinecraftSkin = btn.getAttribute('data-skin') || 'blockhead';
      qsa('.login-skin-btn').forEach(function(b){ b.classList.remove('selected'); });
      btn.classList.add('selected');
    });
  }

  // Difficulty cards (signup)
  var dc = ge('diff-cards');
  if (dc) {
    dc.addEventListener('click', function(e){
      var card = e.target.closest('.diff-card'); if(!card) return;
      _signupDiff = card.getAttribute('data-diff');
      dc.querySelectorAll('.diff-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
    });
  }

  // Tab switching
  var tabSI = ge('tab-signin'), tabSU = ge('tab-signup');
  var formSI = ge('form-signin'), formSU = ge('form-signup');
  var authTitle = ge('auth-title'), authSub = ge('auth-subtitle');

  function setAuthMode(mode) {
    if (mode === 'signup') {
      if (tabSU) tabSU.classList.add('active');
      if (tabSI) tabSI.classList.remove('active');
      if (formSU) formSU.classList.remove('hidden');
      if (formSI) formSI.classList.add('hidden');
      if (authTitle) authTitle.innerHTML = 'Create an account to save your progress :)';
      if (authSub) authSub.textContent = 'Join thousands of questers learning Java from zero to hero!';
    } else {
      if (tabSI) tabSI.classList.add('active');
      if (tabSU) tabSU.classList.remove('active');
      if (formSI) formSI.classList.remove('hidden');
      if (formSU) formSU.classList.add('hidden');
      if (authTitle) authTitle.innerHTML = 'Welcome back to <span class="logo-accent">JavaQuest</span>';
      if (authSub) authSub.textContent = 'Sign in to continue your coding adventure :)';
    }
    hideAuthError();
  }

  if (tabSI) tabSI.addEventListener('click', function(){ setAuthMode('signin'); });
  if (tabSU) tabSU.addEventListener('click', function(){ setAuthMode('signup'); });

  var linkToSI = ge('link-to-si');
  if (linkToSI) linkToSI.addEventListener('click', function(){ setAuthMode('signin'); });
  var linkToSU = ge('link-to-su');
  if (linkToSU) linkToSU.addEventListener('click', function(){ setAuthMode('signup'); });

  // Enter key
  [ge('si-email'), ge('si-password')].forEach(function(el){
    if(el) el.addEventListener('keydown', function(e){ if(e.key==='Enter') doSignIn(); });
  });
  [ge('su-name'), ge('su-email'), ge('su-password')].forEach(function(el){
    if(el) el.addEventListener('keydown', function(e){ if(e.key==='Enter') doSignUp(); });
  });

  var sib = ge('si-btn'); if(sib) sib.addEventListener('click', doSignIn);
  var sub = ge('su-btn'); if(sub) sub.addEventListener('click', doSignUp);
  var gb  = ge('guest-btn'); if(gb) gb.addEventListener('click', doGuestLogin);
  var gbs = ge('guest-btn-su'); if(gbs) gbs.addEventListener('click', doGuestLogin);
}

function doGuestLogin() {
  var enteredName = (ge('su-name') || {}).value;
  var name = (enteredName && enteredName.trim()) ? enteredName.trim() : 'JavaLearner';
  var diff = _signupDiff || 'beginner';
  var skin = _signupSkin || 0;

  var local = localLoad();
  if (local && local.player) {
    STATE = local;
    if (name !== 'JavaLearner' && STATE.player.name === 'JavaLearner') STATE.player.name = name;
  } else {
    STATE = freshState(name, diff, skin);
  }
  if (_signupMinecraftSkin) STATE.player.minecraftSkin = _signupMinecraftSkin;
  localSave();
  checkStreak();
  renderAllAvatars();
  updateNav();
  showScreen('home');
  setTimeout(function(){ toast('Playing in Guest Mode (Progress saved locally)'); }, 400);
}

function showAuthLoading(show) {
  var l=ge('auth-loading'), fs=ge('form-signin'), fu=ge('form-signup');
  if(show){
    if(l) l.classList.remove('hidden');
    if(fs) fs.classList.add('hidden');
    if(fu) fu.classList.add('hidden');
  } else {
    if(l) l.classList.add('hidden');
    var tabSU = ge('tab-signup');
    if (tabSU && tabSU.classList.contains('active')) {
      if(fu) fu.classList.remove('hidden');
      if(fs) fs.classList.add('hidden');
    } else {
      if(fs) fs.classList.remove('hidden');
      if(fu) fu.classList.add('hidden');
    }
  }
}

function showAuthError(form, msg) {
  var id = form==='si' ? 'si-error' : 'su-error';
  var el = ge(id); if(!el) return;
  el.className = 'auth-error';
  el.textContent = msg; el.classList.remove('hidden');
}
function showAuthSuccess(form, msg) {
  var id = form==='si' ? 'si-error' : 'su-error';
  var el = ge(id); if(!el) return;
  el.className = 'auth-success';
  el.textContent = msg; el.classList.remove('hidden');
}
function hideAuthError(){
  ['si-error','su-error'].forEach(function(id){ var e=ge(id); if(e){ e.textContent=''; e.classList.add('hidden'); } });
}

function validateEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function doSignIn() {
  var email = (ge('si-email')||{}).value.trim();
  var pass  = (ge('si-password')||{}).value;
  if (!validateEmail(email)) { showAuthError('si','Please enter a valid email address.'); return; }
  if (!pass) { showAuthError('si','Password is required.'); return; }
  hideAuthError();
  showAuthLoading(true);
  sbSignIn(email, pass)
    .then(function(data){
      if (data.access_token) return loadUserAndEnter();
      throw new Error(data.error_description || data.msg || 'Sign in failed');
    })
    .catch(function(e){
      showAuthLoading(false);
      var msg = (e && e.message) || '';
      if (msg.toLowerCase().includes('invalid login credentials') || msg.toLowerCase().includes('invalid grant')) {
        showAuthError('si', 'Invalid email or password. Please try again or create an account.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        showAuthError('si', 'Your email is not confirmed yet. Check your inbox to confirm, or play in Guest Mode below!');
      } else {
        showAuthError('si', msg || 'Sign in failed. Check your internet connection or play in Guest Mode.');
      }
    });
}

function doSignUp() {
  var name  = (ge('su-name')||{}).value.trim() || 'JavaLearner';
  var email = (ge('su-email')||{}).value.trim();
  var pass  = (ge('su-password')||{}).value;
  if (!validateEmail(email))  { showAuthError('su','Please enter a valid email address.'); return; }
  if (pass.length < 6)        { showAuthError('su','Password must be at least 6 characters.'); return; }
  hideAuthError();
  showAuthLoading(true);

  sbSignUp(email, pass, { username: name, difficulty: _signupDiff, avatar_skin: _signupSkin })
    .then(function(data){
      // Supabase raw REST API can return user object directly { id, email, ... } OR { user, session }
      var user = (data && data.user) || (data && data.id ? data : null);
      if (!user) {
        throw new Error((data && (data.error_description || data.msg || data.error)) || 'Sign up failed');
      }

      var session = (data && data.session) || (data && data.access_token ? data : null);

      if (session) {
        window._sbSession = session;
        sbPersistSession(session);
        return sbUpsertProfile({
          username:   name,
          difficulty: _signupDiff,
          avatar_skin: _signupSkin,
          xp: 0, level: 1, streak: 1, hearts: 3,
          last_visit: new Date().toDateString()
        }).then(function(){ return loadUserAndEnter(); });
      } else {
        // Try sign-in in case auto-confirmation occurred
        return sbSignIn(email, pass)
          .then(function(siData){
            if (siData && siData.access_token) {
              return sbUpsertProfile({
                username:   name,
                difficulty: _signupDiff,
                avatar_skin: _signupSkin,
                xp: 0, level: 1, streak: 1, hearts: 3,
                last_visit: new Date().toDateString()
              }).then(function(){ return loadUserAndEnter(); });
            }
            var siEmail = ge('si-email'); if (siEmail) siEmail.value = email;
            var siPass = ge('si-password'); if (siPass) siPass.value = pass;
            showAuthLoading(false);
            showAuthSuccess('su', 'Account created! A confirmation email was sent to ' + email + '. Check your inbox to confirm, then click "Sign In" above. Or click "Play as Guest" below to start immediately!');
            toast('Confirmation email sent to ' + email);
          })
          .catch(function(siErr){
            var siEmail = ge('si-email'); if (siEmail) siEmail.value = email;
            var siPass = ge('si-password'); if (siPass) siPass.value = pass;
            showAuthLoading(false);
            showAuthSuccess('su', 'Account created! A confirmation email was sent to ' + email + '. Please check your inbox (or spam) to confirm, then click "Sign In" above. Or play in Guest Mode below!');
            toast('Confirmation email sent to ' + email);
          });
      }
    })
    .catch(function(e){
      showAuthLoading(false);
      var msg = (e && e.message) || 'Could not create account.';
      if (msg.toLowerCase().includes('already registered')) {
        showAuthError('su', 'This email is already registered! Please click "Sign In" above to log in.');
      } else if (msg.toLowerCase().includes('confirm') || msg.toLowerCase().includes('email link')) {
        showAuthSuccess('su', 'Account created! Please check your email to confirm, then click "Sign In" above.');
      } else if (msg.toLowerCase().includes('rate limit')) {
        showAuthError('su', 'Too many attempts. Please wait a moment or click "Play as Guest" below.');
      } else {
        showAuthError('su', msg);
      }
    });
}

function loadUserAndEnter() {
  return Promise.all([sbGetProfile(), sbGetProgress(), sbGetBadges()])
    .then(function(results){
      var profile  = results[0] || {};
      var progress = results[1] || {};
      var badges   = results[2] || [];
      STATE = {
        player: {
          name:       profile.username || 'JavaLearner',
          difficulty: profile.difficulty || 'beginner',
          avatar: {
            skin:      profile.avatar_skin       || 0,
            hair:      profile.avatar_hair        || 0,
            hairColor: profile.avatar_hair_color  || 0,
            outfit:    profile.avatar_outfit      || 0,
            accessory: profile.avatar_accessory   || 0
          },
          xp:          profile.xp     || 0,
          level:       profile.level  || 1,
          streak:      profile.streak || 0,
          lastVisit:   profile.last_visit || null,
          hearts:      profile.hearts || 3,
          heartRefillTime: profile.heart_refill_at ? new Date(profile.heart_refill_at).getTime() : null,
          badges:               badges,
          completedLessons:     progress.completed_lessons    || [],
          completedModules:     progress.completed_modules    || [],
          completedChallenges:  progress.completed_challenges || [],
          completedCoding:      progress.completed_coding     || [],
          codingAttempts:       progress.coding_attempts      || {},
          capstoneProjects:     progress.capstone_projects    || {}
        }
      };
      STATE = sanitizeState(STATE);
      // Also save locally as backup
      try { localStorage.setItem('jq_local', JSON.stringify(STATE)); } catch(e) {}
      checkStreak();
      renderAllAvatars();
      updateNav();
      showScreen('home');
      setTimeout(function(){ toast('Welcome, '+STATE.player.name+'!'); }, 500);
    })
    .catch(function(e){
      // Fallback: try local backup
      var local = localLoad();
      if (local) {
        STATE = local;
        checkStreak(); renderAllAvatars(); updateNav(); showScreen('home');
        toast('Loaded local backup (offline mode)');
      } else {
        // Create minimal state from auth user
        var u = sbCurrentUser();
        STATE = freshState(u ? u.email.split('@')[0] : 'JavaLearner', 'beginner', 0);
        showScreen('home');
      }
    });
}

function doSignOut() {
  sbSignOut().finally(function(){
    STATE = null;
    try { localStorage.removeItem('jq_local'); localStorage.removeItem('javaquest_session'); } catch(e){}
    showScreen('auth');
    toast('Signed out. See you next time!');
  });
}

/* ═══════════════ AVATAR ════════════════════════════════════════ */
var AV_SKIN   = ['#FDBCB4','#EAA175','#D08B5B','#AE5D29','#3B1F1A'];
var AV_HAIRC  = ['#1a1a1a','#8B4513','#F5C518','#FF6B9D','#9B59B6','#E74C3C'];
var AV_OUTFIT = ['#6C63FF','#FF6584','#43D8C9','#FFD166','#06D6A0','#F4845F','#4CC9F0','#E63946'];
var AV_HAIR   = ['Bald','Short','Long','Curly','Spiky','Buns'];
var AV_ACC_E = ['','','','','',''];
var AV_ACC_N  = ['None','Glasses','Grad Cap','Top Hat','Crown','Headphones'];
var _avDraft  = null;
var _avTab    = 'skin';

function mkEl(tag,css){ var e=document.createElement(tag); if(css) e.style.cssText=css; return e; }

var MINECRAFT_SKINS = {
  blockhead: {
    id: 'blockhead',
    name: 'Blockhead • OG Crafter',
    tag: 'Classic',
    grid: [
      ['#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18'],
      ['#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#4A2E18'],
      ['#4A2E18','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#4A2E18'],
      ['#C68B59','#FFFFFF','#2C3E82','#C68B59','#C68B59','#FFFFFF','#2C3E82','#C68B59'],
      ['#C68B59','#C68B59','#C68B59','#A36637','#A36637','#C68B59','#C68B59','#C68B59'],
      ['#C68B59','#C68B59','#512818','#512818','#512818','#512818','#C68B59','#C68B59'],
      ['#4A2E18','#512818','#512818','#512818','#512818','#512818','#512818','#4A2E18'],
      ['#4A2E18','#4A2E18','#512818','#512818','#512818','#512818','#4A2E18','#4A2E18']
    ]
  },
  scout: {
    id: 'scout',
    name: 'Scout • Code Explorer',
    tag: 'Adventurer',
    grid: [
      ['#AF5623','#AF5623','#AF5623','#AF5623','#AF5623','#AF5623','#AF5623','#AF5623'],
      ['#AF5623','#AF5623','#AF5623','#AF5623','#AF5623','#AF5623','#AF5623','#AF5623'],
      ['#AF5623','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#AF5623'],
      ['#AF5623','#FFFFFF','#4C7837','#E5B28B','#E5B28B','#FFFFFF','#4C7837','#AF5623'],
      ['#AF5623','#E5B28B','#E5B28B','#D99C74','#D99C74','#E5B28B','#E5B28B','#AF5623'],
      ['#E5B28B','#E5B28B','#E5B28B','#BC7656','#BC7656','#E5B28B','#E5B28B','#E5B28B'],
      ['#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B'],
      ['#AF5623','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#AF5623']
    ]
  },
  crystal_knight: {
    id: 'crystal_knight',
    name: 'Crystal Knight • Full Armor',
    tag: 'Hero',
    grid: [
      ['#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8'],
      ['#36B3A8','#4ECCC0','#4ECCC0','#36B3A8','#36B3A8','#4ECCC0','#4ECCC0','#36B3A8'],
      ['#36B3A8','#4ECCC0','#1E1E24','#1E1E24','#1E1E24','#1E1E24','#4ECCC0','#36B3A8'],
      ['#36B3A8','#26968D','#00F0FF','#1E1E24','#1E1E24','#00F0FF','#26968D','#36B3A8'],
      ['#36B3A8','#4ECCC0','#C68B59','#C68B59','#C68B59','#C68B59','#4ECCC0','#36B3A8'],
      ['#36B3A8','#36B3A8','#C68B59','#A36637','#A36637','#C68B59','#36B3A8','#36B3A8'],
      ['#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8'],
      ['#26968D','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#36B3A8','#26968D']
    ]
  },
  hisser: {
    id: 'hisser',
    name: 'Hisser Dev • Pixel Mascot',
    tag: 'Mascot',
    grid: [
      ['#45A03A','#5EBA43','#45A03A','#5EBA43','#45A03A','#5EBA43','#45A03A','#5EBA43'],
      ['#5EBA43','#45A03A','#5EBA43','#45A03A','#5EBA43','#45A03A','#5EBA43','#45A03A'],
      ['#45A03A','#1E1E24','#1E1E24','#5EBA43','#5EBA43','#1E1E24','#1E1E24','#45A03A'],
      ['#5EBA43','#1E1E24','#1E1E24','#45A03A','#45A03A','#1E1E24','#1E1E24','#5EBA43'],
      ['#45A03A','#5EBA43','#45A03A','#1E1E24','#1E1E24','#45A03A','#5EBA43','#45A03A'],
      ['#5EBA43','#45A03A','#1E1E24','#1E1E24','#1E1E24','#1E1E24','#45A03A','#5EBA43'],
      ['#45A03A','#5EBA43','#1E1E24','#1E1E24','#1E1E24','#1E1E24','#5EBA43','#45A03A'],
      ['#5EBA43','#45A03A','#1E1E24','#45A03A','#45A03A','#1E1E24','#45A03A','#5EBA43']
    ]
  },
  void_coder: {
    id: 'void_coder',
    name: 'Void Coder • Portal Master',
    tag: 'Mystic',
    grid: [
      ['#181424','#181424','#181424','#181424','#181424','#181424','#181424','#181424'],
      ['#181424','#241D35','#241D35','#181424','#181424','#241D35','#241D35','#181424'],
      ['#181424','#241D35','#181424','#181424','#181424','#181424','#241D35','#181424'],
      ['#181424','#D634EB','#FA7DFF','#181424','#181424','#D634EB','#FA7DFF','#181424'],
      ['#181424','#181424','#181424','#241D35','#241D35','#181424','#181424','#181424'],
      ['#181424','#241D35','#181424','#181424','#181424','#181424','#241D35','#181424'],
      ['#181424','#181424','#181424','#181424','#181424','#181424','#181424','#181424'],
      ['#241D35','#181424','#181424','#181424','#181424','#181424','#181424','#241D35']
    ]
  },
  circuit_mage: {
    id: 'circuit_mage',
    name: 'Circuit Mage • Logic Architect',
    tag: 'Engineer',
    grid: [
      ['#595959','#7F7F7F','#FFE600','#FFE600','#7F7F7F','#595959','#595959','#7F7F7F'],
      ['#38210F','#38210F','#38210F','#38210F','#38210F','#38210F','#38210F','#38210F'],
      ['#38210F','#E63946','#FF6B6B','#C68B59','#C68B59','#E63946','#FF6B6B','#38210F'],
      ['#38210F','#E63946','#FFFFFF','#C68B59','#C68B59','#E63946','#FFFFFF','#38210F'],
      ['#C68B59','#C68B59','#C68B59','#A36637','#A36637','#C68B59','#C68B59','#C68B59'],
      ['#C68B59','#C68B59','#512818','#512818','#512818','#512818','#C68B59','#C68B59'],
      ['#38210F','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#38210F'],
      ['#38210F','#38210F','#38210F','#C68B59','#C68B59','#38210F','#38210F','#38210F']
    ]
  },
  cyber_crafter: {
    id: 'cyber_crafter',
    name: 'Cyber Crafter • Neon Visor',
    tag: 'Cyber',
    grid: [
      ['#111116','#1E1E24','#111116','#1E1E24','#1E1E24','#111116','#1E1E24','#111116'],
      ['#1E1E24','#111116','#1E1E24','#111116','#111116','#1E1E24','#111116','#1E1E24'],
      ['#1E1E24','#00F0FF','#00F0FF','#00F0FF','#00F0FF','#00F0FF','#00F0FF','#1E1E24'],
      ['#111116','#00B4D8','#00F0FF','#00F0FF','#00F0FF','#00F0FF','#00B4D8','#111116'],
      ['#E5B28B','#E5B28B','#E5B28B','#D99C74','#D99C74','#E5B28B','#E5B28B','#E5B28B'],
      ['#E5B28B','#E5B28B','#512818','#512818','#512818','#512818','#E5B28B','#E5B28B'],
      ['#1E1E24','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#1E1E24'],
      ['#111116','#1E1E24','#E5B28B','#E5B28B','#E5B28B','#E5B28B','#1E1E24','#111116']
    ]
  },
  gilded_monarch: {
    id: 'gilded_monarch',
    name: 'Gilded Monarch • Java Master',
    tag: 'Master',
    grid: [
      ['#FFD700','#FFD700','#05D380','#FFD700','#FFD700','#05D380','#FFD700','#FFD700'],
      ['#FFB703','#FFD700','#FFD700','#FFD700','#FFD700','#FFD700','#FFD700','#FFB703'],
      ['#2B1E16','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#2B1E16'],
      ['#C68B59','#FFFFFF','#3A86FF','#C68B59','#C68B59','#FFFFFF','#3A86FF','#C68B59'],
      ['#C68B59','#C68B59','#C68B59','#A36637','#A36637','#C68B59','#C68B59','#C68B59'],
      ['#C68B59','#C68B59','#512818','#512818','#512818','#512818','#C68B59','#C68B59'],
      ['#2B1E16','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#C68B59','#2B1E16'],
      ['#FFD700','#2B1E16','#2B1E16','#2B1E16','#2B1E16','#2B1E16','#2B1E16','#FFD700']
    ]
  }
};

// Aliases for backwards compatibility with user profiles
MINECRAFT_SKINS.steve = MINECRAFT_SKINS.blockhead;
MINECRAFT_SKINS.alex = MINECRAFT_SKINS.scout;
MINECRAFT_SKINS.diamond_knight = MINECRAFT_SKINS.crystal_knight;
MINECRAFT_SKINS.creeper = MINECRAFT_SKINS.hisser;
MINECRAFT_SKINS.ender_coder = MINECRAFT_SKINS.void_coder;
MINECRAFT_SKINS.redstone = MINECRAFT_SKINS.circuit_mage;
MINECRAFT_SKINS.cyber_steve = MINECRAFT_SKINS.cyber_crafter;
MINECRAFT_SKINS.golden_king = MINECRAFT_SKINS.gilded_monarch;

var MINECRAFT_HATS = {
  none: { id: 'none', name: 'No Hat', tag: 'Standard', grid: null },
  miner_helm: {
    id: 'miner_helm',
    name: 'Miner Helmet',
    tag: 'Explorer',
    grid: [
      ['#F59E0B','#F59E0B','#F59E0B','#FFE600','#FFE600','#F59E0B','#F59E0B','#F59E0B'],
      ['#D97706','#F59E0B','#F59E0B','#FFE600','#FFE600','#F59E0B','#F59E0B','#D97706'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent']
    ]
  },
  wizard_hat: {
    id: 'wizard_hat',
    name: 'Void Wizard Hat',
    tag: 'Mystic',
    grid: [
      ['transparent','transparent','transparent','#8B5CF6','#8B5CF6','transparent','transparent','transparent'],
      ['transparent','transparent','#7C3AED','#8B5CF6','#8B5CF6','#7C3AED','transparent','transparent'],
      ['#6D28D9','#7C3AED','#FFE600','#FFE600','#FFE600','#FFE600','#7C3AED','#6D28D9'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent']
    ]
  },
  scholar_cap: {
    id: 'scholar_cap',
    name: 'Scholar Mortarboard',
    tag: 'Academic',
    grid: [
      ['#1E293B','#1E293B','#1E293B','#1E293B','#1E293B','#1E293B','#1E293B','#FFE600'],
      ['transparent','#1E293B','#1E293B','#1E293B','#1E293B','#1E293B','#1E293B','#FFE600'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','#FFE600'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent']
    ]
  }
};

var MINECRAFT_CAPES = {
  none: { id: 'none', name: 'No Cape', tag: 'Standard', color: 'transparent' },
  emerald_cape: { id: 'emerald_cape', name: 'Emerald Crest', tag: 'Hero', color: '#10B981' },
  obsidian_cloak: { id: 'obsidian_cloak', name: 'Obsidian Void', tag: 'Mystic', color: '#8B5CF6' },
  lava_banner: { id: 'lava_banner', name: 'Nether Forge', tag: 'Master', color: '#F59E0B' },
  cyber_matrix: { id: 'cyber_matrix', name: 'Cyber Grid', tag: 'Cyber', color: '#38BDF8' }
};

function renderMinecraftSVG(grid, hatGrid) {
  var svg = '<svg viewBox="0 0 8 8" class="minecraft-pixel-face" style="width:100%;height:100%;shape-rendering:crispEdges;image-rendering:pixelated;display:block;">';
  for (var r = 0; r < 8; r++) {
    for (var c = 0; c < 8; c++) {
      var color = (hatGrid && hatGrid[r] && hatGrid[r][c] && hatGrid[r][c] !== 'transparent') 
        ? hatGrid[r][c] 
        : ((grid && grid[r] && grid[r][c]) || '');
      if (color && color !== 'transparent') {
        svg += '<rect x="' + c + '" y="' + r + '" width="1" height="1" fill="' + color + '"/>';
      }
    }
  }
  svg += '</svg>';
  return svg;
}

var MINECRAFT_BADGES = {
  wooden_pickaxe: {
    id: 'wooden_pickaxe',
    name: 'Wooden Pickaxe',
    rarity: 'COMMON',
    rarityColor: '#10B981',
    grid: [
      ['transparent', '#8B5A2B', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#8B5A2B', 'transparent'],
      ['#8B5A2B', '#CD853F', 'transparent', 'transparent', '#5C3A21', 'transparent', 'transparent', '#8B5A2B'],
      ['transparent', 'transparent', 'transparent', '#6E4720', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#6E4720', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#6E4720', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['#5C3A21', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  crafting_table: {
    id: 'crafting_table',
    name: 'Crafting Table',
    rarity: 'COMMON',
    rarityColor: '#10B981',
    grid: [
      ['#4A2E18','#A06535','#C68B59','#A06535','#A06535','#C68B59','#A06535','#4A2E18'],
      ['#A06535','#C68B59','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#C68B59','#A06535'],
      ['#C68B59','#4A2E18','#8B5A2B','#8B5A2B','#8B5A2B','#8B5A2B','#4A2E18','#C68B59'],
      ['#A06535','#4A2E18','#8B5A2B','#A06535','#A06535','#8B5A2B','#4A2E18','#A06535'],
      ['#A06535','#4A2E18','#8B5A2B','#A06535','#A06535','#8B5A2B','#4A2E18','#A06535'],
      ['#C68B59','#4A2E18','#8B5A2B','#8B5A2B','#8B5A2B','#8B5A2B','#4A2E18','#C68B59'],
      ['#A06535','#C68B59','#4A2E18','#4A2E18','#4A2E18','#4A2E18','#C68B59','#A06535'],
      ['#4A2E18','#A06535','#C68B59','#A06535','#A06535','#C68B59','#A06535','#4A2E18']
    ]
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', '#FFFFFF', '#D1D5DB'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', '#FFFFFF', '#D1D5DB', '#9CA3AF'],
      ['transparent', 'transparent', 'transparent', 'transparent', '#FFFFFF', '#D1D5DB', '#9CA3AF', 'transparent'],
      ['transparent', 'transparent', 'transparent', '#FFFFFF', '#D1D5DB', '#9CA3AF', 'transparent', 'transparent'],
      ['transparent', '#374151', '#4B5563', '#9CA3AF', '#374151', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#6E4720', '#374151', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['#5C3A21', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  bow_arrow: {
    id: 'bow_arrow',
    name: 'Target Bow',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['transparent', 'transparent', '#6E4720', '#8B5A2B', '#8B5A2B', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#6E4720', 'transparent', 'transparent', 'transparent', '#E5E7EB', 'transparent', 'transparent'],
      ['#6E4720', 'transparent', 'transparent', '#9CA3AF', 'transparent', 'transparent', '#E5E7EB', 'transparent'],
      ['#8B5A2B', 'transparent', '#8B5A2B', '#E5E7EB', '#9CA3AF', 'transparent', 'transparent', '#E5E7EB'],
      ['#8B5A2B', 'transparent', 'transparent', '#E5E7EB', 'transparent', '#8B5A2B', 'transparent', '#E5E7EB'],
      ['#6E4720', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', '#E5E7EB', 'transparent'],
      ['transparent', '#6E4720', 'transparent', 'transparent', 'transparent', '#E5E7EB', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#6E4720', '#8B5A2B', '#8B5A2B', 'transparent', 'transparent', 'transparent']
    ]
  },
  chest: {
    id: 'chest',
    name: 'Storage Chest',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['#38210F', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#38210F'],
      ['#8B5A2B', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#8B5A2B'],
      ['#8B5A2B', '#CD853F', '#CD853F', '#D1D5DB', '#D1D5DB', '#CD853F', '#CD853F', '#8B5A2B'],
      ['#38210F', '#38210F', '#38210F', '#9CA3AF', '#9CA3AF', '#38210F', '#38210F', '#38210F'],
      ['#8B5A2B', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#8B5A2B'],
      ['#8B5A2B', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#8B5A2B'],
      ['#8B5A2B', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#CD853F', '#8B5A2B'],
      ['#38210F', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#8B5A2B', '#38210F']
    ]
  },
  enchanted_book: {
    id: 'enchanted_book',
    name: 'Enchanted Book',
    rarity: 'EPIC',
    rarityColor: '#A855F7',
    grid: [
      ['transparent', '#7E22CE', '#9333EA', '#A855F7', '#A855F7', '#9333EA', '#7E22CE', 'transparent'],
      ['#7E22CE', '#9333EA', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#FF0055', '#7E22CE'],
      ['#9333EA', '#F5F5DC', '#00F0FF', '#F5F5DC', '#F5F5DC', '#00F0FF', '#FF0055', '#9333EA'],
      ['#9333EA', '#F5F5DC', '#F5F5DC', '#00F0FF', '#00F0FF', '#F5F5DC', '#FF0055', '#9333EA'],
      ['#9333EA', '#F5F5DC', '#00F0FF', '#F5F5DC', '#F5F5DC', '#00F0FF', '#FF0055', '#9333EA'],
      ['#7E22CE', '#9333EA', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#FF0055', '#7E22CE'],
      ['transparent', '#7E22CE', '#9333EA', '#A855F7', '#A855F7', '#9333EA', '#7E22CE', 'transparent'],
      ['transparent', 'transparent', '#581C87', '#581C87', '#581C87', '#581C87', 'transparent', 'transparent']
    ]
  },
  beacon: {
    id: 'beacon',
    name: 'Beacon of Power',
    rarity: 'LEGENDARY',
    rarityColor: '#F59E0B',
    grid: [
      ['transparent', '#A5F3FC', '#67E8F9', '#67E8F9', '#67E8F9', '#67E8F9', '#A5F3FC', 'transparent'],
      ['#A5F3FC', '#FFFFFF', '#06B6D4', '#0891B2', '#0891B2', '#06B6D4', '#FFFFFF', '#A5F3FC'],
      ['#67E8F9', '#06B6D4', '#FFFFFF', '#22D3EE', '#22D3EE', '#FFFFFF', '#06B6D4', '#67E8F9'],
      ['#67E8F9', '#0891B2', '#22D3EE', '#FFFFFF', '#FFFFFF', '#22D3EE', '#0891B2', '#67E8F9'],
      ['#67E8F9', '#0891B2', '#22D3EE', '#FFFFFF', '#FFFFFF', '#22D3EE', '#0891B2', '#67E8F9'],
      ['#67E8F9', '#06B6D4', '#FFFFFF', '#22D3EE', '#22D3EE', '#FFFFFF', '#06B6D4', '#67E8F9'],
      ['#18181B', '#27272A', '#3F3F46', '#3F3F46', '#3F3F46', '#3F3F46', '#27272A', '#18181B'],
      ['#09090B', '#18181B', '#27272A', '#27272A', '#27272A', '#27272A', '#18181B', '#09090B']
    ]
  },
  redstone_torch: {
    id: 'redstone_torch',
    name: 'Redstone Torch',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['transparent', 'transparent', 'transparent', '#FFAAA5', '#FF3B30', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#FF3B30', '#FF1744', '#FF5252', '#FF3B30', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#D50000', '#FF1744', '#FF1744', '#D50000', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', '#8B5A2B', '#6E4720', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', '#8B5A2B', '#6E4720', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', '#8B5A2B', '#6E4720', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', '#5C3A21', '#5C3A21', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  blaze_rod: {
    id: 'blaze_rod',
    name: 'Blaze Rod',
    rarity: 'EPIC',
    rarityColor: '#A855F7',
    grid: [
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', '#FFFBEB', '#FDE047', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', '#FFFBEB', '#FDE047', '#EAB308', 'transparent'],
      ['transparent', 'transparent', 'transparent', '#FFFBEB', '#FDE047', '#EAB308', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#FFFBEB', '#FDE047', '#EAB308', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#FFFBEB', '#FDE047', '#EAB308', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['#FFFBEB', '#FDE047', '#EAB308', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['#FDE047', '#CA8A04', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  golden_apple: {
    id: 'golden_apple',
    name: 'Golden Apple',
    rarity: 'EPIC',
    rarityColor: '#A855F7',
    grid: [
      ['transparent', 'transparent', 'transparent', '#6E4720', '#4A2E18', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#FDE047', '#FACC15', '#6E4720', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#CA8A04', 'transparent'],
      ['#FEF08A', '#FFFFFF', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207'],
      ['#FEF08A', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#A16207'],
      ['#FDE047', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#A16207', '#713F12'],
      ['transparent', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#713F12', '#713F12', 'transparent'],
      ['transparent', 'transparent', '#CA8A04', '#A16207', '#713F12', 'transparent', 'transparent', 'transparent']
    ]
  },
  redstone_dust: {
    id: 'redstone_dust',
    name: 'Redstone Dust',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['transparent', 'transparent', '#FF3B30', 'transparent', 'transparent', '#FF1744', 'transparent', 'transparent'],
      ['transparent', '#FF1744', '#FF5252', '#FF1744', 'transparent', '#FF5252', '#D50000', 'transparent'],
      ['#D50000', '#FF3B30', '#FFFFFF', '#FF1744', '#D50000', '#FF1744', '#FF3B30', '#B71C1C'],
      ['transparent', '#D50000', '#FF1744', '#B71C1C', '#FF3B30', '#D50000', '#B71C1C', 'transparent'],
      ['transparent', 'transparent', '#B71C1C', '#FF1744', '#FF5252', '#D50000', 'transparent', 'transparent'],
      ['transparent', '#D50000', '#FF5252', '#FFFFFF', '#FF1744', '#B71C1C', '#D50000', 'transparent'],
      ['#B71C1C', '#FF1744', '#D50000', '#B71C1C', '#D50000', '#FF1744', '#B71C1C', 'transparent'],
      ['transparent', 'transparent', '#B71C1C', 'transparent', 'transparent', '#B71C1C', 'transparent', 'transparent']
    ]
  },
  diamond_pickaxe: {
    id: 'diamond_pickaxe',
    name: 'Diamond Pickaxe',
    rarity: 'LEGENDARY',
    rarityColor: '#F59E0B',
    grid: [
      ['transparent', '#00F0FF', '#38BDF8', '#38BDF8', '#38BDF8', '#38BDF8', '#00F0FF', 'transparent'],
      ['#00F0FF', '#38BDF8', 'transparent', 'transparent', '#6E4720', 'transparent', 'transparent', '#00F0FF'],
      ['transparent', 'transparent', 'transparent', '#8B5A2B', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#8B5A2B', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#8B5A2B', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['#5C3A21', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  iron_ingot: {
    id: 'iron_ingot',
    name: 'Iron Ingot',
    rarity: 'COMMON',
    rarityColor: '#10B981',
    grid: [
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#FFFFFF', '#F3F4F6', '#E5E7EB', '#E5E7EB', '#D1D5DB', 'transparent', 'transparent'],
      ['#FFFFFF', '#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', 'transparent'],
      ['#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', 'transparent'],
      ['transparent', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  diamond_sword: {
    id: 'diamond_sword',
    name: 'Diamond Sword',
    rarity: 'LEGENDARY',
    rarityColor: '#F59E0B',
    grid: [
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', '#E0F2FE', '#38BDF8'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', '#E0F2FE', '#38BDF8', '#0284C7'],
      ['transparent', 'transparent', 'transparent', 'transparent', '#E0F2FE', '#38BDF8', '#0284C7', 'transparent'],
      ['transparent', 'transparent', 'transparent', '#E0F2FE', '#38BDF8', '#0284C7', 'transparent', 'transparent'],
      ['transparent', '#0369A1', '#0284C7', '#38BDF8', '#0369A1', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#6E4720', '#0369A1', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['#5C3A21', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  netherite_ingot: {
    id: 'netherite_ingot',
    name: 'Netherite Ingot',
    rarity: 'LEGENDARY',
    rarityColor: '#F59E0B',
    grid: [
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', '#645E5E', '#4A4444', '#3D3838', '#3D3838', '#2D2828', 'transparent', 'transparent'],
      ['#645E5E', '#78716C', '#4A4444', '#3D3838', '#2D2828', '#1C1917', '#171413', 'transparent'],
      ['#4A4444', '#3D3838', '#2D2828', '#1C1917', '#171413', '#0C0A09', '#78350F', 'transparent'],
      ['transparent', '#2D2828', '#1C1917', '#171413', '#78350F', '#451A03', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
      ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
    ]
  },
  totem_undying: {
    id: 'totem_undying',
    name: 'Totem of Undying',
    rarity: 'MYTHIC',
    rarityColor: '#EC4899',
    grid: [
      ['transparent', 'transparent', '#FDE047', '#FDE047', '#FDE047', '#FDE047', 'transparent', 'transparent'],
      ['transparent', '#FDE047', '#10B981', '#FACC15', '#FACC15', '#10B981', '#FDE047', 'transparent'],
      ['#FDE047', '#FACC15', '#FACC15', '#CA8A04', '#CA8A04', '#FACC15', '#FACC15', '#FDE047'],
      ['#FDE047', '#FDE047', '#EAB308', '#F59E0B', '#F59E0B', '#EAB308', '#FDE047', '#FDE047'],
      ['transparent', 'transparent', '#F59E0B', '#B45309', '#B45309', '#F59E0B', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#FBBF24', '#D97706', '#D97706', '#FBBF24', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#F59E0B', '#B45309', '#B45309', '#F59E0B', 'transparent', 'transparent'],
      ['transparent', 'transparent', '#D97706', 'transparent', 'transparent', '#D97706', 'transparent', 'transparent']
    ]
  },
  bedrock_locked: {
    id: 'bedrock_locked',
    name: 'Locked Bedrock',
    rarity: 'LOCKED',
    rarityColor: '#71717A',
    grid: [
      ['#18181B', '#3F3F46', '#27272A', '#18181B', '#52525B', '#27272A', '#18181B', '#3F3F46'],
      ['#27272A', '#18181B', '#52525B', '#3F3F46', '#18181B', '#3F3F46', '#52525B', '#18181B'],
      ['#52525B', '#3F3F46', '#18181B', '#27272A', '#3F3F46', '#18181B', '#27272A', '#3F3F46'],
      ['#18181B', '#27272A', '#3F3F46', '#52525B', '#18181B', '#52525B', '#3F3F46', '#18181B'],
      ['#3F3F46', '#52525B', '#18181B', '#27272A', '#3F3F46', '#27272A', '#18181B', '#27272A'],
      ['#27272A', '#18181B', '#3F3F46', '#18181B', '#52525B', '#18181B', '#3F3F46', '#52525B'],
      ['#18181B', '#3F3F46', '#52525B', '#27272A', '#18181B', '#27272A', '#52525B', '#18181B'],
      ['#3F3F46', '#27272A', '#18181B', '#3F3F46', '#27272A', '#3F3F46', '#18181B', '#27272A']
    ]
  },
  oak_sign: {
    id: 'oak_sign',
    name: 'Oak Sign',
    rarity: 'COMMON',
    rarityColor: '#10B981',
    grid: [
      ['#8B5A2B','#CD853F','#CD853F','#CD853F','#CD853F','#CD853F','#CD853F','#8B5A2B'],
      ['#CD853F','#8B5A2B','#5C3A21','#5C3A21','#5C3A21','#5C3A21','#8B5A2B','#CD853F'],
      ['#CD853F','#CD853F','#CD853F','#CD853F','#CD853F','#CD853F','#CD853F','#CD853F'],
      ['#CD853F','#8B5A2B','#5C3A21','#5C3A21','#5C3A21','#8B5A2B','#CD853F','#CD853F'],
      ['#8B5A2B','#CD853F','#CD853F','#CD853F','#CD853F','#CD853F','#CD853F','#8B5A2B'],
      ['transparent','transparent','transparent','#5C3A21','#8B5A2B','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','#5C3A21','#8B5A2B','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','#5C3A21','#8B5A2B','transparent','transparent','transparent']
    ]
  },
  stone_pickaxe: {
    id: 'stone_pickaxe',
    name: 'Stone Pickaxe',
    rarity: 'COMMON',
    rarityColor: '#10B981',
    grid: [
      ['transparent','#4B5563','#9CA3AF','#9CA3AF','#9CA3AF','#9CA3AF','#4B5563','transparent'],
      ['#4B5563','#9CA3AF','transparent','transparent','#5C3A21','transparent','transparent','#4B5563'],
      ['transparent','transparent','transparent','#6E4720','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','#6E4720','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','#6E4720','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['#5C3A21','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent']
    ]
  },
  redstone_block: {
    id: 'redstone_block',
    name: 'Redstone Repeater',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['#7F1D1D','#DC2626','#EF4444','#EF4444','#DC2626','#EF4444','#DC2626','#7F1D1D'],
      ['#DC2626','#EF4444','#B91C1C','#DC2626','#EF4444','#B91C1C','#EF4444','#DC2626'],
      ['#EF4444','#B91C1C','#EF4444','#EF4444','#DC2626','#EF4444','#DC2626','#EF4444'],
      ['#EF4444','#DC2626','#EF4444','#7F1D1D','#B91C1C','#DC2626','#EF4444','#EF4444'],
      ['#DC2626','#EF4444','#DC2626','#B91C1C','#EF4444','#EF4444','#DC2626','#DC2626'],
      ['#EF4444','#B91C1C','#EF4444','#EF4444','#DC2626','#B91C1C','#EF4444','#EF4444'],
      ['#DC2626','#EF4444','#DC2626','#B91C1C','#EF4444','#EF4444','#B91C1C','#DC2626'],
      ['#7F1D1D','#DC2626','#EF4444','#DC2626','#DC2626','#EF4444','#DC2626','#7F1D1D']
    ]
  },
  minecart: {
    id: 'minecart',
    name: 'Iron Minecart',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent'],
      ['transparent','#4B5563','transparent','transparent','transparent','transparent','#4B5563','transparent'],
      ['#4B5563','#9CA3AF','#9CA3AF','#9CA3AF','#9CA3AF','#9CA3AF','#9CA3AF','#4B5563'],
      ['#4B5563','#D1D5DB','#4B5563','#4B5563','#4B5563','#4B5563','#D1D5DB','#4B5563'],
      ['#374151','#9CA3AF','#9CA3AF','#9CA3AF','#9CA3AF','#9CA3AF','#9CA3AF','#374151'],
      ['transparent','#4B5563','#4B5563','#4B5563','#4B5563','#4B5563','#4B5563','transparent'],
      ['transparent','#111827','#374151','transparent','transparent','#111827','#374151','transparent'],
      ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent']
    ]
  },
  iron_shield: {
    id: 'iron_shield',
    name: 'Iron Shield',
    rarity: 'RARE',
    rarityColor: '#3B82F6',
    grid: [
      ['#374151','#9CA3AF','#D1D5DB','#D1D5DB','#D1D5DB','#D1D5DB','#9CA3AF','#374151'],
      ['#9CA3AF','#CD853F','#8B5A2B','#D1D5DB','#D1D5DB','#8B5A2B','#CD853F','#9CA3AF'],
      ['#9CA3AF','#CD853F','#8B5A2B','#D1D5DB','#D1D5DB','#8B5A2B','#CD853F','#9CA3AF'],
      ['#9CA3AF','#8B5A2B','#8B5A2B','#D1D5DB','#D1D5DB','#8B5A2B','#8B5A2B','#9CA3AF'],
      ['#4B5563','#CD853F','#8B5A2B','#8B5A2B','#8B5A2B','#8B5A2B','#CD853F','#4B5563'],
      ['transparent','#4B5563','#CD853F','#8B5A2B','#8B5A2B','#CD853F','#4B5563','transparent'],
      ['transparent','transparent','#374151','#4B5563','#4B5563','#374151','transparent','transparent'],
      ['transparent','transparent','transparent','#1F2937','#1F2937','transparent','transparent','transparent']
    ]
  },
  golden_clock: {
    id: 'golden_clock',
    name: 'Golden Clock',
    rarity: 'EPIC',
    rarityColor: '#A855F7',
    grid: [
      ['transparent','transparent','#D97706','#F59E0B','#F59E0B','#D97706','transparent','transparent'],
      ['transparent','#D97706','#FEF3C7','#FBBF24','#FBBF24','#FEF3C7','#D97706','transparent'],
      ['#D97706','#FEF3C7','#38BDF8','#60A5FA','#1E3A8A','#1E293B','#FEF3C7','#D97706'],
      ['#F59E0B','#FBBF24','#60A5FA','#FCD34D','#1F2937','#0F172A','#FBBF24','#F59E0B'],
      ['#F59E0B','#FBBF24','#1E3A8A','#0F172A','#FCD34D','#38BDF8','#FBBF24','#F59E0B'],
      ['#D97706','#FEF3C7','#0F172A','#0F172A','#60A5FA','#38BDF8','#FEF3C7','#D97706'],
      ['transparent','#D97706','#FEF3C7','#FBBF24','#FBBF24','#FEF3C7','#D97706','transparent'],
      ['transparent','transparent','#D97706','#F59E0B','#F59E0B','#D97706','transparent','transparent']
    ]
  },
  brewing_stand: {
    id: 'brewing_stand',
    name: 'Brewing Stand',
    rarity: 'EPIC',
    rarityColor: '#A855F7',
    grid: [
      ['transparent','transparent','transparent','#F59E0B','#F59E0B','transparent','transparent','transparent'],
      ['transparent','transparent','transparent','#D97706','#D97706','transparent','transparent','transparent'],
      ['transparent','#EF4444','transparent','#B45309','#B45309','transparent','#A855F7','transparent'],
      ['transparent','#FCA5A5','#EF4444','#78350F','#78350F','#C084FC','#A855F7','transparent'],
      ['transparent','transparent','#4B5563','#6B7280','#6B7280','#4B5563','transparent','transparent'],
      ['transparent','#374151','#6B7280','#9CA3AF','#9CA3AF','#6B7280','#374151','transparent'],
      ['#374151','#4B5563','#6B7280','#6B7280','#6B7280','#6B7280','#4B5563','#374151'],
      ['#1F2937','#374151','#374151','#374151','#374151','#374151','#374151','#1F2937']
    ]
  },
  dragon_egg: {
    id: 'dragon_egg',
    name: 'Ender Dragon Egg',
    rarity: 'LEGENDARY',
    rarityColor: '#F59E0B',
    grid: [
      ['transparent','transparent','transparent','#111827','#111827','transparent','transparent','transparent'],
      ['transparent','transparent','#111827','#1F2937','#C084FC','#111827','transparent','transparent'],
      ['transparent','#111827','#1F2937','#111827','#1F2937','#111827','#111827','transparent'],
      ['#111827','#1F2937','#A855F7','#1F2937','#1F2937','#A855F7','#1F2937','#111827'],
      ['#111827','#1F2937','#1F2937','#C084FC','#1F2937','#1F2937','#1F2937','#111827'],
      ['#111827','#111827','#1F2937','#1F2937','#1F2937','#111827','#111827','#111827'],
      ['transparent','#111827','#111827','#A855F7','#111827','#111827','#111827','transparent'],
      ['transparent','transparent','#111827','#111827','#111827','#111827','transparent','transparent']
    ]
  }
};

var BADGE_MINECRAFT_MAP = {
  'first-lesson': 'wooden_pickaxe',
  'first-module': 'crafting_table',
  'first-code': 'iron_sword',
  'perfect-code': 'bow_arrow',
  'capstone-beginner': 'chest',
  'capstone-intermediate': 'enchanted_book',
  'capstone-advanced': 'beacon',
  'streak-3': 'redstone_torch',
  'streak-7': 'blaze_rod',
  'perfect': 'golden_apple',
  'level-5': 'redstone_dust',
  'level-10': 'diamond_pickaxe',
  'beginner-done': 'iron_ingot',
  'inter-done': 'diamond_sword',
  'advanced-done': 'netherite_ingot',
  'all-modules': 'totem_undying',
  'hello-world': 'oak_sign',
  'syntax-miner': 'stone_pickaxe',
  'redstone-logician': 'redstone_block',
  'loop-runner': 'minecart',
  'shield-bearer': 'iron_shield',
  'clockwork-coder': 'golden_clock',
  'brewing-master': 'brewing_stand',
  'totem-undying': 'dragon_egg'
};

function drawAvatar(el, av) {
  if (!el) return;
  var p = (STATE && STATE.player) || {};
  var draft = av || {};
  var rawSkin = draft.minecraftSkin || draft.avatarSkin || p.minecraftSkin || p.avatarSkin || 'blockhead';
  
  if (rawSkin === 'steve') rawSkin = 'blockhead';
  else if (rawSkin === 'alex') rawSkin = 'scout';
  else if (rawSkin === 'creeper') rawSkin = 'hisser';
  else if (rawSkin === 'diamond_knight') rawSkin = 'crystal_knight';
  else if (rawSkin === 'ender_coder') rawSkin = 'void_coder';
  else if (rawSkin === 'redstone') rawSkin = 'circuit_mage';
  else if (rawSkin === 'cyber_steve') rawSkin = 'cyber_crafter';
  else if (rawSkin === 'golden_king') rawSkin = 'gilded_monarch';

  var skinData = MINECRAFT_SKINS[rawSkin] || MINECRAFT_SKINS.blockhead;
  var hatKey = draft.avatarHat || p.avatarHat || 'none';
  var hatData = (MINECRAFT_HATS && MINECRAFT_HATS[hatKey]) || null;
  var capeKey = draft.avatarCape || p.avatarCape || 'none';
  var capeData = (MINECRAFT_CAPES && MINECRAFT_CAPES[capeKey]) || null;

  var capeStyle = (capeData && capeData.color && capeData.color !== 'transparent')
    ? 'border: 3px solid ' + capeData.color + '; box-shadow: 0 0 10px ' + capeData.color + ';'
    : 'border: 2px solid var(--ink);';

  el.style.position = 'relative';
  el.innerHTML = '<div class="minecraft-avatar-box" style="' + capeStyle + '; border-radius: 4px; overflow: hidden;">' 
    + renderMinecraftSVG(skinData.grid, hatData ? hatData.grid : null) 
    + '</div>';
}

function renderAllAvatars() {
  drawAvatar(ge('avatar-display-home'),   STATE && STATE.player);
  drawAvatar(ge('avatar-display-hud'),    STATE && STATE.player);
  drawAvatar(ge('avatar-display-editor'), _avDraft || (STATE && STATE.player));
}

var _avTab = 'skin';

function switchAvatarTab(tab) {
  _avTab = tab || 'skin';
  var grid = ge('avatar-options-grid'); if(!grid) return;
  grid.innerHTML = '';
  
  if (_avTab === 'skin' || _avTab === 'champions') {
    var currentSkin = (_avDraft && _avDraft.minecraftSkin) || (STATE && STATE.player && STATE.player.minecraftSkin) || 'blockhead';
    if (currentSkin === 'steve') currentSkin = 'blockhead';

    var primaryKeys = ['blockhead', 'scout', 'crystal_knight', 'hisser', 'void_coder', 'circuit_mage', 'cyber_crafter', 'gilded_monarch'];
    primaryKeys.forEach(function(key){
      var skin = MINECRAFT_SKINS[key];
      var card = document.createElement('div');
      var isSel = (currentSkin === key);
      card.className = 'minecraft-char-card' + (isSel ? ' selected' : '');
      card.setAttribute('data-skin', key);
      card.innerHTML = '<div class="minecraft-char-thumb">' + renderMinecraftSVG(skin.grid) + '</div>'
        + '<span class="minecraft-char-tag">' + esc(skin.tag) + '</span>'
        + '<div class="minecraft-char-name">' + esc(skin.name) + '</div>';
      card.addEventListener('click', function(){
        if (!_avDraft) _avDraft = {};
        _avDraft.minecraftSkin = key;
        qsa('.minecraft-char-card').forEach(function(c){ c.classList.remove('selected'); });
        card.classList.add('selected');
        drawAvatar(ge('avatar-display-editor'), _avDraft);
      });
      grid.appendChild(card);
    });
  } else if (_avTab === 'hats') {
    var currentHat = (_avDraft && _avDraft.avatarHat) || (STATE && STATE.player && STATE.player.avatarHat) || 'none';
    Object.keys(MINECRAFT_HATS).forEach(function(key){
      var hat = MINECRAFT_HATS[key];
      var card = document.createElement('div');
      var isSel = (currentHat === key);
      card.className = 'minecraft-char-card' + (isSel ? ' selected' : '');
      card.setAttribute('data-hat', key);
      var thumbHtml = hat.grid ? renderMinecraftSVG(MINECRAFT_SKINS.blockhead.grid, hat.grid) : '<div style="font-size:24px;text-align:center;line-height:48px;">✕</div>';
      card.innerHTML = '<div class="minecraft-char-thumb">' + thumbHtml + '</div>'
        + '<span class="minecraft-char-tag">' + esc(hat.tag) + '</span>'
        + '<div class="minecraft-char-name">' + esc(hat.name) + '</div>';
      card.addEventListener('click', function(){
        if (!_avDraft) _avDraft = {};
        _avDraft.avatarHat = key;
        qsa('.minecraft-char-card').forEach(function(c){ c.classList.remove('selected'); });
        card.classList.add('selected');
        drawAvatar(ge('avatar-display-editor'), _avDraft);
      });
      grid.appendChild(card);
    });
  } else if (_avTab === 'capes') {
    var currentCape = (_avDraft && _avDraft.avatarCape) || (STATE && STATE.player && STATE.player.avatarCape) || 'none';
    Object.keys(MINECRAFT_CAPES).forEach(function(key){
      var cape = MINECRAFT_CAPES[key];
      var card = document.createElement('div');
      var isSel = (currentCape === key);
      card.className = 'minecraft-char-card' + (isSel ? ' selected' : '');
      card.setAttribute('data-cape', key);
      var capeBox = '<div style="width:48px;height:48px;background:' + (cape.color === 'transparent' ? '#E2E8F0' : cape.color) + ';border:2px solid var(--ink);border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#FFFFFF;">' + (cape.id === 'none' ? 'None' : '✦') + '</div>';
      card.innerHTML = '<div class="minecraft-char-thumb">' + capeBox + '</div>'
        + '<span class="minecraft-char-tag">' + esc(cape.tag) + '</span>'
        + '<div class="minecraft-char-name">' + esc(cape.name) + '</div>';
      card.addEventListener('click', function(){
        if (!_avDraft) _avDraft = {};
        _avDraft.avatarCape = key;
        qsa('.minecraft-char-card').forEach(function(c){ c.classList.remove('selected'); });
        card.classList.add('selected');
        drawAvatar(ge('avatar-display-editor'), _avDraft);
      });
      grid.appendChild(card);
    });
  }
}

// Wire avatar category tabs
document.addEventListener('DOMContentLoaded', function() {
  qsa('.avatar-tab').forEach(function(b) {
    b.onclick = function() {
      qsa('.avatar-tab').forEach(function(t) { t.classList.remove('active'); });
      b.classList.add('active');
      switchAvatarTab(b.getAttribute('data-tab'));
    };
  });
});

function saveAvatar() {
  var inp = ge('avatar-name-input');
  if (inp && inp.value.trim()) STATE.player.name = inp.value.trim();
  if (_avDraft) {
    if (_avDraft.minecraftSkin) STATE.player.minecraftSkin = _avDraft.minecraftSkin;
    if (_avDraft.avatarHat) STATE.player.avatarHat = _avDraft.avatarHat;
    if (_avDraft.avatarCape) STATE.player.avatarCape = _avDraft.avatarCape;
  }
  localSave(); renderAllAvatars(); updateNav();
  showScreen('home'); toast('Pixel avatar & cosmetics saved!');
}

/* ═══════════════ HOME ═══════════════════════════════════════════ */
function renderHome() {
  var p=STATE.player, lv=getLv(), nx=getNextLv();
  var xs=lv.xpRequired, xe=nx?nx.xpRequired:xs+1000;
  var pct=Math.min(100,Math.round((p.xp-xs)/(xe-xs)*100));
  setText('hero-greeting','Welcome back, '+p.name+'!');
  setText('diff-badge-home', (p.difficulty || 'beginner').toUpperCase() + ' TRACK');
  setText('home-level-label','Level '+p.level+' — '+lv.name);
  setText('home-xp-label',(p.xp-xs)+' / '+(xe-xs)+' XP');
  setWidth('xp-fill-home',pct+'%'); setWidth('xp-fill-mini',pct+'%');
  setText('home-streak',p.streak); setText('home-xp',p.xp);
  setText('home-lessons',p.completedLessons.length); setText('home-badges',p.badges.length);
  renderContinueCard(); renderAllAvatars();
}

function getModulesForDifficulty() {
  var list = window.CURRICULUM || (typeof CURRICULUM !== 'undefined' ? CURRICULUM : []);
  if (!list || !list.length) return [];
  var diff = (STATE && STATE.player && STATE.player.difficulty) || 'beginner';
  var limits = (typeof DIFFICULTY_LIMITS !== 'undefined') ? DIFFICULTY_LIMITS : { beginner: 8, intermediate: 16, advanced: 24 };
  var limit = limits[diff] || list.length;
  return list.slice(0, limit);
}

function renderContinueCard() {
  var mods = getModulesForDifficulty();
  for (var i=0; i<mods.length; i++) {
    var mod=mods[i];
    if (getPlayerState().completedModules.indexOf(mod.id)===-1) {
      var badgeEl = ge('continue-badge');
      if (badgeEl) badgeEl.style.backgroundColor = mod.color || '#FFE600';
      setText('continue-badge-code', (mod.code || mod.id).toUpperCase());
      setText('continue-title', mod.title);
      var done=0;
      for(var j=0;j<mod.lessons.length;j++) if(getPlayerState().completedLessons.indexOf(mod.lessons[j].id)!==-1) done++;
      var total=mod.lessons.length, pct2=Math.round(done/total*100);
      setText('continue-subtitle', done+' / '+total+' lessons complete');
      setWidth('continue-progress-fill', pct2+'%'); setText('continue-progress-label', pct2+'%');
      return;
    }
  }
  setText('continue-title', 'All Modules Complete!');
  setText('continue-subtitle', 'You have mastered this track.');
  setWidth('continue-progress-fill', '100%'); setText('continue-progress-label', '100%');
}

function startDailyQuest() {
  var mods = getModulesForDifficulty();
  for (var i = 0; i < mods.length; i++) {
    var mod = mods[i];
    if (!isModUnlocked(mod.id)) continue;
    // Check lessons
    for (var j = 0; j < mod.lessons.length; j++) {
      if (getPlayerState().completedLessons.indexOf(mod.lessons[j].id) === -1) {
        startLesson(mod.id, mod.lessons[j].id);
        return;
      }
    }
    // Check quiz challenge
    if (mod.challenge && getPlayerState().completedChallenges.indexOf(mod.challenge.id) === -1) {
      startChallenge(mod.id);
      return;
    }
    // Check coding challenge
    if (mod.codingTask && (getPlayerState().completedCoding || []).indexOf(mod.id) === -1) {
      startCodingChallenge(mod.id);
      return;
    }
  }
  toast('All content complete! You are a Java master!');
}

/* ═══════════════ MAP & MODULE PROGRESS ═════════════════════════ */
function isModUnlocked(modId) {
  var mods = getModulesForDifficulty();
  if (!mods.length) return false;
  // Check if first module overall (always unlocked)
  var allMods = window.CURRICULUM || (typeof CURRICULUM !== 'undefined' ? CURRICULUM : []);
  if (allMods.length && allMods[0].id === modId) return true;
  // Check within difficulty-limited list
  if (mods[0].id === modId) return true;
  for (var i = 1; i < mods.length; i++) {
    if (mods[i].id === modId) {
      return (getPlayerState().completedModules || []).indexOf(mods[i - 1].id) !== -1;
    }
  }
  // For tracks beyond current difficulty, check sequentially in full curriculum
  for (var i = 1; i < allMods.length; i++) {
    if (allMods[i].id === modId) {
      return (getPlayerState().completedModules || []).indexOf(allMods[i - 1].id) !== -1;
    }
  }
  return false;
}

function isLessonUnlocked(modId, lessonId) {
  if (!isModUnlocked(modId)) return false;
  var mod = getMod(modId);
  if (!mod) return false;
  if (mod.lessons[0].id === lessonId) return true;
  for (var i = 1; i < mod.lessons.length; i++) {
    if (mod.lessons[i].id === lessonId) {
      return (getPlayerState().completedLessons || []).indexOf(mod.lessons[i - 1].id) !== -1;
    }
  }
  return false;
}

function getMod(id) {
  var list = window.CURRICULUM || (typeof CURRICULUM !== 'undefined' ? CURRICULUM : []);
  if (!list) return null;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
}

function markModuleCompleteIfReady(mod) {
  if (!mod) return;
  var allLessonsDone = true;
  for (var i = 0; i < mod.lessons.length; i++) {
    if ((getPlayerState().completedLessons || []).indexOf(mod.lessons[i].id) === -1) {
      allLessonsDone = false;
      break;
    }
  }
  var quizDone = !mod.challenge || (getPlayerState().completedChallenges || []).indexOf(mod.challenge.id) !== -1;
  var codeDone = !mod.codingTask || (getPlayerState().completedCoding || []).indexOf(mod.id) !== -1;

  if (allLessonsDone && (quizDone || codeDone)) {
    if ((getPlayerState().completedModules || []).indexOf(mod.id) === -1) {
      getPlayerState().completedModules.push(mod.id);
      checkBadge('first_module');
      checkBadge('module_' + mod.id.replace('module-', ''));
      var allM = true;
      var mods = getModulesForDifficulty();
      for (var j = 0; j < mods.length; j++) {
        if (getPlayerState().completedModules.indexOf(mods[j].id) === -1) { allM = false; break; }
      }
      if (allM) checkBadge('all_modules');
      localSave();
      renderMap();
    }
  }
}

var _activeTrackFilter = 'all';

function setTrackFilter(trackKey) {
  _activeTrackFilter = trackKey;
  qsa('.track-tab-btn').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-track') === trackKey);
  });
  renderMap();
}

function startNextExerciseInMod(mod) {
  if (!mod || !mod.lessons || !mod.lessons.length) return;
  for (var i = 0; i < mod.lessons.length; i++) {
    var l = mod.lessons[i];
    if ((getPlayerState().completedLessons || []).indexOf(l.id) === -1) {
      startLesson(mod.id, l.id);
      return;
    }
  }
  if (mod.challenge && (getPlayerState().completedChallenges || []).indexOf(mod.challenge.id) === -1) {
    startChallenge(mod.id);
    return;
  }
  if (mod.codingTask && (getPlayerState().completedCoding || []).indexOf(mod.id) === -1) {
    startCodingChallenge(mod.id);
    return;
  }
  startLesson(mod.id, mod.lessons[0].id);
}


function computeCurriculumStats() {
  var mods = window.CURRICULUM || (typeof CURRICULUM !== 'undefined' ? CURRICULUM : []);
  var totalLessons = 0;
  var totalExercises = 0;
  var totalXP = 0;
  var totalMinutes = 0;
  var countsByTrack = { all: mods.length, beginner: 0, intermediate: 0, advanced: 0 };

  mods.forEach(function(m){
    var track = m.level || 'beginner';
    if (countsByTrack[track] !== undefined) countsByTrack[track]++;
    var lCount = (m.lessons || []).length;
    totalLessons += lCount;
    var hasQuiz = !!(m.challenge || (m.quizBank && m.quizBank.length));
    var hasCoding = !!m.codingTask;
    totalExercises += lCount + (hasQuiz ? 1 : 0) + (hasCoding ? 1 : 0);
    
    (m.lessons || []).forEach(function(l){
      totalXP += (l.xp || 25);
      totalMinutes += (l.estimatedMinutes || 12);
    });
    if (hasQuiz) totalXP += (m.challenge ? (m.challenge.xp || 50) : 50);
    if (hasCoding) totalXP += (m.codingTask ? (m.codingTask.xp || 75) : 75);
  });

  if (window.PROJECTS && Array.isArray(PROJECTS)) {
    PROJECTS.forEach(function(p){ totalXP += (p.xpReward || 100); totalExercises += 1; });
  }

  var hours = Math.max(1, Math.round(totalMinutes / 60));
  var totalBadges = (window.BADGES && BADGES.length) || 24;

  return {
    moduleCount: mods.length,
    countsByTrack: countsByTrack,
    lessonCount: totalLessons,
    exerciseCount: totalExercises,
    totalXP: totalXP,
    estimatedHours: hours,
    badgeCount: totalBadges
  };
}
window.computeCurriculumStats = computeCurriculumStats;

function renderMap() {
  var container = ge('chapters-accordion');
  if (!container) return;

  var allMods = window.CURRICULUM || (typeof CURRICULUM !== 'undefined' ? CURRICULUM : []);
  if (!allMods.length) {
    container.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,.4);padding:2rem">Loading curriculum…</p>';
    return;
  }

  
  // Update Hero & Track Tab Counts dynamically from single source of truth
  var stats = computeCurriculumStats();
  setText('hero-time-estimate', '~' + stats.estimatedHours + 'h of learning');
  setText('hero-modules-count', stats.moduleCount + ' Modules');
  setText('track-count-all', stats.countsByTrack.all);
  setText('track-count-beginner', stats.countsByTrack.beginner);
  setText('track-count-intermediate', stats.countsByTrack.intermediate);
  setText('track-count-advanced', stats.countsByTrack.advanced);

  // Update Hero Banner Tag & Resume Button
  var trackTag = ge('hero-track-tag');
  if (trackTag) {
    if (_activeTrackFilter === 'all') trackTag.textContent = 'ALL TRACKS (OVERWORLD • NETHER • END)';
    else if (_activeTrackFilter === 'beginner') trackTag.textContent = 'TRACK 1 • OVERWORLD (BEGINNER)';
    else if (_activeTrackFilter === 'intermediate') trackTag.textContent = 'TRACK 2 • THE NETHER (INTERMEDIATE)';
    else if (_activeTrackFilter === 'advanced') trackTag.textContent = 'TRACK 3 • THE END (ADVANCED)';
  }

  // Wire Resume Learning Button to jump to last active lesson or next unfinished lesson
  var resumeBtn = ge('btn-resume-quest');
  if (resumeBtn) {
    resumeBtn.onclick = function() {
      try {
        var last = localStorage.getItem('javaquest_last_lesson');
        if (last) {
          var parsed = JSON.parse(last);
          if (parsed && parsed.modId && parsed.lessonId) {
            startLesson(parsed.modId, parsed.lessonId, parsed.stepIdx || 0);
            return;
          }
        }
      } catch(e) {}

      for (var i = 0; i < allMods.length; i++) {
        var m = allMods[i];
        if (!isModUnlocked(m.id)) continue;
        for (var j = 0; j < m.lessons.length; j++) {
          if ((getPlayerState().completedLessons || []).indexOf(m.lessons[j].id) === -1) {
            startLesson(m.id, m.lessons[j].id);
            return;
          }
        }
        if (m.challenge && (getPlayerState().completedChallenges || []).indexOf(m.challenge.id) === -1) {
          startChallenge(m.id);
          return;
        }
        if (m.codingTask && (getPlayerState().completedCoding || []).indexOf(m.id) === -1) {
          startCodingChallenge(m.id);
          return;
        }
      }
      toast('All available curriculum completed! Awesome job!');
    };
  }

  // Update Track Switcher Tabs click handlers
  qsa('.track-tab-btn').forEach(function(b){
    b.onclick = function() {
      setTrackFilter(this.getAttribute('data-track'));
    };
  });

  // Filter modules by track
  var filteredMods = allMods;
  if (_activeTrackFilter !== 'all') {
    filteredMods = allMods.filter(function(m){ return m.level === _activeTrackFilter; });
  }

  container.innerHTML = '';

  var trackMeta = {
    beginner: { name: 'Track 1: Overworld', sub: 'Foundations, Syntax, Control Flow & Core OOP', icon: '<svg viewBox="0 0 16 16" width="20" height="20" fill="none"><rect x="2" y="6" width="12" height="10" fill="#5a8c3c"/><rect x="2" y="2" width="12" height="4" fill="#8B6914"/><rect x="4" y="8" width="2" height="2" fill="#3a6a28"/><rect x="10" y="8" width="2" height="2" fill="#3a6a28"/><rect x="7" y="6" width="2" height="2" fill="#3a6a28"/></svg>', color: '#10B981', capstoneId: 'proj-beginner' },
    intermediate: { name: 'Track 2: The Nether', sub: 'Deep OOP, Collections, Streams, I/O & Concurrency', icon: '<svg viewBox="0 0 16 16" width="20" height="20" fill="none"><rect x="1" y="1" width="14" height="14" fill="#8B0000"/><rect x="3" y="3" width="4" height="4" fill="#FF4500"/><rect x="9" y="3" width="4" height="4" fill="#FF4500"/><rect x="6" y="8" width="4" height="4" fill="#FF6600"/><rect x="2" y="10" width="2" height="4" fill="#C0392B"/><rect x="12" y="10" width="2" height="4" fill="#C0392B"/></svg>', color: '#F59E0B', capstoneId: 'proj-intermediate' },
    advanced: { name: 'Track 3: The End', sub: 'JVM Internals, Virtual Threads, Spring Boot & Cloud', icon: '<svg viewBox="0 0 16 16" width="20" height="20" fill="none"><rect x="1" y="1" width="14" height="14" fill="#1a0a2e"/><circle cx="4" cy="4" r="1" fill="#fff" opacity=".9"/><circle cx="12" cy="6" r="0.8" fill="#fff" opacity=".7"/><circle cx="7" cy="11" r="1.2" fill="#fff" opacity=".8"/><circle cx="13" cy="13" r="0.6" fill="#fff" opacity=".6"/><circle cx="2" cy="12" r="0.7" fill="#a855f7" opacity=".9"/></svg>', color: '#8B5CF6', capstoneId: 'proj-advanced' }
  };

  var currentTrack = null;
  var foundFirstActive = false;

  filteredMods.forEach(function(mod, modIdx){
    // Track transition banner when viewing All Tracks
    if (_activeTrackFilter === 'all' && mod.level !== currentTrack) {
      currentTrack = mod.level;
      var tm = trackMeta[currentTrack];
      if (tm) {
        var trHeader = document.createElement('div');
        trHeader.className = 'track-divider-banner';
        trHeader.style.setProperty('--track-accent', tm.color);
        trHeader.innerHTML = '<div class="track-divider-left">'
          + '<span class="track-divider-icon">' + tm.icon + '</span>'
          + '<div>'
          + '<div class="track-divider-title">' + tm.name + '</div>'
          + '<div class="track-divider-sub">' + tm.sub + '</div>'
          + '</div>'
          + '</div>'
          + '<span class="track-divider-pill">8 CHAPTERS</span>';
        container.appendChild(trHeader);
      }
    }

    var player = getPlayerState();
    var isCompleted = (player.completedModules || []).indexOf(mod.id) !== -1;
    var isUnlocked = isModUnlocked(mod.id);
    var statusKey = isCompleted ? 'completed' : (isUnlocked ? 'available' : 'locked');

    var totalEx = mod.lessons.length + (mod.challenge ? 1 : 0) + (mod.codingTask ? 1 : 0);
    var doneEx = 0;
    mod.lessons.forEach(function(l){
      if ((getPlayerState().completedLessons || []).indexOf(l.id) !== -1) doneEx++;
    });
    if (mod.challenge && (getPlayerState().completedChallenges || []).indexOf(mod.challenge.id) !== -1) doneEx++;
    if (mod.codingTask && (getPlayerState().completedCoding || []).indexOf(mod.id) !== -1) doneEx++;

    var shouldExpand = false;
    if (isUnlocked && !isCompleted && !foundFirstActive) {
      shouldExpand = true;
      foundFirstActive = true;
    }

    var card = document.createElement('div');
    card.className = 'chapter-accordion-card ' + statusKey + (!isUnlocked ? ' chunk-fogged' : '') + (shouldExpand ? ' open expanded' : '');
    card.id = 'chapter-card-' + mod.id;

    var statusIconHtml = '';
    if (isCompleted) {
      statusIconHtml = '<div class="chapter-status-dot completed" title="Chapter Completed">'
        + '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        + '</div>';
    } else if (isUnlocked) {
      statusIconHtml = '<div class="chapter-status-dot active" title="In Progress">'
        + '<span class="chapter-dot-num">' + (mod.code || (modIdx + 1)) + '</span>'
        + '</div>';
    } else {
      statusIconHtml = '<div class="chapter-status-dot locked" title="Locked">'
        + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#71717A" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        + '</div>';
    }

    var actionBtnHtml = '';
    if (isCompleted) {
      actionBtnHtml = '<button class="btn-chapter-action chapter-btn-review" data-mid="' + mod.id + '" title="Review chapter">Review</button>';
    } else if (isUnlocked) {
      actionBtnHtml = '<button class="btn-chapter-action chapter-btn-start" data-mid="' + mod.id + '" title="Start next lesson in this chapter">Start</button>';
    } else {
      actionBtnHtml = '<span class="chapter-lock-badge" title="Complete earlier chapters to unlock"><svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:3px;vertical-align:-1px"><rect x="2" y="6" width="10" height="7" rx="1"/><path d="M4 6V4a3 3 0 0 1 6 0v2"/></svg>Locked</span>';
    }

    var headerHtml = '<div class="chapter-header" data-modid="' + mod.id + '">'
      + '<div class="chapter-header-left">'
      + statusIconHtml
      + '<div class="chapter-title-group">'
      + '<div class="chapter-heading-row">'
      + '<span class="chapter-code-badge">' + (mod.code || mod.id).toUpperCase() + '</span>'
      + '<h3 class="chapter-title">' + esc(mod.title) + '</h3>' + (mod.biome ? '<span class="biome-badge">◆ ' + esc(mod.biome) + '</span>' : '')
      + '</div>'
      + '<p class="chapter-desc">' + esc(mod.subtitle || '') + (mod.conceptMetaphor ? ' <span style="display:block;margin-top:4px;color:var(--pixel-mint);font-weight:600;">💡 ' + esc(mod.conceptMetaphor) + '</span>' : '') + '</p>'
      + '</div>'
      + '</div>'
      + '<div class="chapter-header-right">'
      + actionBtnHtml
      + '<span class="chapter-progress-pill ' + (isCompleted ? 'pill-done' : '') + '">' + doneEx + ' / ' + totalEx + ' Done</span>'
      + '<span class="chapter-chevron"><svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 4 6 8 10 4"/></svg></span>'
      + '</div>'
      + '</div>';

    var bodyHtml = '<div class="chapter-body">';
    bodyHtml += '<div class="exercise-table">';

    // Lessons
    mod.lessons.forEach(function(lesson, lIdx){
      var lDone = (getPlayerState().completedLessons || []).indexOf(lesson.id) !== -1;
      var lUnlocked = isLessonUnlocked(mod.id, lesson.id);

      var btnHtml = '';
      if (lDone) {
        btnHtml = '<button class="exercise-btn btn-done" data-mid="' + mod.id + '" data-lid="' + lesson.id + '">Done!</button>';
      } else if (lUnlocked) {
        btnHtml = '<button class="exercise-btn btn-start" data-mid="' + mod.id + '" data-lid="' + lesson.id + '">Start</button>';
      } else {
        btnHtml = '<button class="exercise-btn btn-locked" disabled>Locked</button>';
      }

      bodyHtml += '<div class="exercise-row ' + (lDone ? 'status-done row-done' : (lUnlocked ? 'status-available row-active' : 'status-locked row-locked')) + '" data-mid="' + mod.id + '" data-lid="' + lesson.id + '">'
        + '<div class="exercise-col-num">Exercise ' + (lIdx + 1) + '</div>'
        + '<div class="exercise-col-title">'
        + '<span class="exercise-name">' + esc(lesson.title) + '</span>'
        + '<span class="exercise-type-tag tag-lesson">Lesson (+' + lesson.xp + ' XP)</span>'
        + '</div>'
        + '<div class="exercise-col-action">' + btnHtml + '</div>'
        + '</div>';
    });

    // Quiz Challenge
    if (mod.challenge) {
      var qDone = (getPlayerState().completedChallenges || []).indexOf(mod.challenge.id) !== -1;
      var qUnlocked = isUnlocked && doneEx >= mod.lessons.length;
      var qBtn = '';
      if (qDone) {
        qBtn = '<button class="exercise-btn btn-done" data-mid="' + mod.id + '" data-type="quiz">Done!</button>';
      } else if (qUnlocked) {
        qBtn = '<button class="exercise-btn btn-quiz" data-mid="' + mod.id + '" data-type="quiz">Quiz (+' + mod.challenge.xp + ' XP)</button>';
      } else {
        qBtn = '<button class="exercise-btn btn-locked" disabled>Locked</button>';
      }

      bodyHtml += '<div class="exercise-row ' + (qDone ? 'status-done row-done' : (qUnlocked ? 'status-available row-active' : 'status-locked row-locked')) + '" data-mid="' + mod.id + '" data-type="quiz">'
        + '<div class="exercise-col-num">Quiz Challenge</div>'
        + '<div class="exercise-col-title">'
        + '<span class="exercise-name">Knowledge Check: ' + esc(mod.title) + '</span>'
        + '<span class="exercise-type-tag tag-quiz">Evaluation (+' + mod.challenge.xp + ' XP)</span>'
        + '</div>'
        + '<div class="exercise-col-action">' + qBtn + '</div>'
        + '</div>';
    }

    // Coding Workbench
    if (mod.codingTask) {
      var cDone = (getPlayerState().completedCoding || []).indexOf(mod.id) !== -1;
      var cUnlocked = isUnlocked && doneEx >= mod.lessons.length;
      var cBtn = '';
      if (cDone) {
        cBtn = '<button class="exercise-btn btn-done" data-mid="' + mod.id + '" data-type="code">Solved!</button>';
      } else if (cUnlocked) {
        cBtn = '<button class="exercise-btn btn-code" data-mid="' + mod.id + '" data-type="code">Code (+' + (mod.codingTask.xp || 75) + ' XP)</button>';
      } else {
        cBtn = '<button class="exercise-btn btn-locked" disabled>Locked</button>';
      }

      bodyHtml += '<div class="exercise-row ' + (cDone ? 'status-done row-done' : (cUnlocked ? 'status-available row-active' : 'status-locked row-locked')) + '" data-mid="' + mod.id + '" data-type="code">'
        + '<div class="exercise-col-num">Coding Lab</div>'
        + '<div class="exercise-col-title">'
        + '<span class="exercise-name">' + esc(mod.codingTask.title) + '</span>'
        + '<span class="exercise-type-tag tag-code">Live Java Workbench</span>'
        + '</div>'
        + '<div class="exercise-col-action">' + cBtn + '</div>'
        + '</div>';
    }

    bodyHtml += '</div>';
    bodyHtml += '</div>';

    card.innerHTML = headerHtml + bodyHtml;

    var hdr = card.querySelector('.chapter-header');
    if (hdr) {
      hdr.addEventListener('click', function(e){
        if (e.target && e.target.closest('.btn-chapter-action')) return;
        var isOpen = card.classList.contains('open') || card.classList.contains('expanded');
        if (isOpen) {
          card.classList.remove('open');
          card.classList.remove('expanded');
        } else {
          card.classList.add('open');
          card.classList.add('expanded');
        }
      });
    }

    var actBtn = card.querySelector('.btn-chapter-action');
    if (actBtn) {
      actBtn.addEventListener('click', function(e){
        e.stopPropagation();
        if (isUnlocked) {
          startNextExerciseInMod(mod);
        } else {
          toast('Complete earlier chapters to unlock this module!');
        }
      });
    }

    card.querySelectorAll('.exercise-row').forEach(function(row){
      row.addEventListener('click', function(e){
        var mid = this.getAttribute('data-mid');
        var lid = this.getAttribute('data-lid');
        var type = this.getAttribute('data-type');
        if (lid) {
          if (isLessonUnlocked(mid, lid) || (getPlayerState().completedLessons || []).indexOf(lid) !== -1) {
            startLesson(mid, lid);
          } else {
            toast('Complete earlier lessons to unlock this exercise!');
          }
        } else if (type === 'quiz') {
          if (isUnlocked) {
            startChallenge(mid);
          } else {
            toast('Complete earlier modules to unlock this quiz!');
          }
        } else if (type === 'code') {
          if (isUnlocked) {
            startCodingChallenge(mid);
          } else {
            toast('Complete earlier modules to unlock this coding lab!');
          }
        }
      });
    });

    card.querySelectorAll('.exercise-btn').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var row = this.closest('.exercise-row');
        if (!row) return;
        var mid = row.getAttribute('data-mid');
        var lid = row.getAttribute('data-lid');
        var type = row.getAttribute('data-type');
        if (lid) {
          if (isLessonUnlocked(mid, lid) || (getPlayerState().completedLessons || []).indexOf(lid) !== -1) {
            startLesson(mid, lid);
          } else {
            toast('Complete earlier lessons to unlock this exercise!');
          }
        } else if (type === 'quiz') {
          if (isUnlocked) {
            startChallenge(mid);
          } else {
            toast('Complete earlier modules to unlock this quiz!');
          }
        } else if (type === 'code') {
          if (isUnlocked) {
            startCodingChallenge(mid);
          } else {
            toast('Complete earlier modules to unlock this coding lab!');
          }
        }
      });
    });

    container.appendChild(card);

    // Track Capstone Card at the end of each track
    var isLastInTrack = (modIdx === filteredMods.length - 1) || (filteredMods[modIdx + 1] && filteredMods[modIdx + 1].level !== mod.level);
    if (isLastInTrack) {
      var tmObj = trackMeta[mod.level];
      if (tmObj && tmObj.capstoneId) {
        var capProj = (window.PROJECTS || []).find(function(p){ return p.id === tmObj.capstoneId; });
        if (capProj) {
          var pState = (STATE && STATE.player && STATE.player.capstoneProjects) ? STATE.player.capstoneProjects[capProj.id] : null;
          var isCapDone = pState && pState.completed;
          var capCard = document.createElement('div');
          capCard.className = 'capstone-hub-banner' + (isCapDone ? ' completed' : '');
          capCard.innerHTML = '<div class="capstone-hub-content">'
            + '<div class="capstone-hub-header">'
            + '<span class="capstone-hub-pill">' + mod.level.toUpperCase() + ' CAPSTONE PROJECT</span>'
            + (isCapDone ? '<span class="capstone-verified-badge">Verified & Claimed</span>' : '<span class="capstone-xp-badge">+' + (capProj.xpReward || 250) + ' XP</span>')
            + '</div>'
            + '<h3 class="capstone-hub-title">' + esc(capProj.title) + '</h3>'
            + '<p class="capstone-hub-desc">' + esc(capProj.description) + '</p>'
            + '<button class="btn-capstone-hub">' + (isCapDone ? 'Review Project IDE' : 'Launch Capstone Workbench') + '</button>'
            + '</div>';
          capCard.onclick = function() { openProjectModal(capProj.id); };
          container.appendChild(capCard);
        }
      }
    }
  });

  // Render Right Sidebar
  renderStudentHUD(allMods);
}

function renderStudentHUD(allMods) {
  if (!STATE || !STATE.player) return;
  var p = STATE.player;
  if (!allMods || !allMods.length) allMods = window.CURRICULUM || (typeof CURRICULUM !== 'undefined' ? CURRICULUM : []);

  // 1. Profile
  drawAvatar(ge('avatar-display-hud'));
  setText('hud-player-name', p.name || 'JavaLearner');
  var lv = getLv();
  setText('hud-player-rank', 'Level ' + p.level + ' • ' + lv.name);
  var editBtn = ge('btn-hud-edit-avatar');
  if (editBtn) editBtn.onclick = function() { showScreen('avatar'); };
  var frame = ge('hud-avatar-frame');
  if (frame) frame.onclick = function() { showScreen('avatar'); };

  // 2. Course Progress
  var totalExercises = 0;
  var completedExercises = 0;
  allMods.forEach(function(m){
    totalExercises += m.lessons.length + (m.challenge ? 1 : 0) + (m.codingTask ? 1 : 0);
    m.lessons.forEach(function(l){
      if ((p.completedLessons || []).indexOf(l.id) !== -1) completedExercises++;
    });
    if (m.challenge && (p.completedChallenges || []).indexOf(m.challenge.id) !== -1) completedExercises++;
    if (m.codingTask && (p.completedCoding || []).indexOf(m.id) !== -1) completedExercises++;
  });

  var pct = totalExercises > 0 ? Math.round(completedExercises / totalExercises * 100) : 0;
  setText('hud-progress-percent', pct + '%');
  setText('hud-exercises-val', completedExercises + ' / ' + totalExercises);
  setWidth('hud-exercises-bar', pct + '%');

  var stats = computeCurriculumStats();
  var totalTrackXP = stats.totalXP;
  var xpPct = Math.min(100, Math.round(p.xp / totalTrackXP * 100));
  setText('hud-xp-val', p.xp.toLocaleString() + ' / ' + totalTrackXP.toLocaleString());
  setWidth('hud-xp-bar', xpPct + '%');

  // 3. Badges Mini-Grid (Shelf)
  var shelf = ge('hud-badges-mini-grid');
  if (shelf && window.BADGES) {
    shelf.innerHTML = '';
    setText('hud-badge-count', p.badges.length + ' / ' + BADGES.length);

    // Show first 8 prominent badges
    var showcaseBadges = BADGES.slice(0, 8);
    showcaseBadges.forEach(function(badge){
      var isUnlocked = (p.badges || []).indexOf(badge.id) !== -1;
      var itemKey = BADGE_MINECRAFT_MAP[badge.id] || 'wooden_pickaxe';
      var item = MINECRAFT_BADGES[itemKey] || MINECRAFT_BADGES.wooden_pickaxe;

      var slot = document.createElement('div');
      slot.className = 'hud-badge-slot ' + (isUnlocked ? 'unlocked' : 'locked');
      slot.title = isUnlocked ? (badge.name + ' (' + item.name + ')') : 'Locked Medal';

      var svgContent = isUnlocked 
        ? renderMinecraftSVG(item.grid)
        : '<div class="slot-lock-icon"><svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="10" height="8" rx="1.5"/><path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6"/></svg></div>';

      slot.innerHTML = svgContent;
      slot.onclick = function() { showScreen('badges'); };
      shelf.appendChild(slot);
    });
  }

  var viewBadgesBtn = ge('btn-hud-view-badges');
  if (viewBadgesBtn) viewBadgesBtn.onclick = function() { showScreen('badges'); };

  // 4. Quick References
  qsa('.hud-ref-item').forEach(function(item){
    item.onclick = function() {
      openCheatsheet(this.getAttribute('data-ref'));
    };
  });
}

var JAVA_CHEATSHEETS = {
  jvm: {
    title: 'JVM Architecture & Memory Internals',
    content: '<div class="cheatsheet-section">'
      + '<h4>1. ClassLoader Subsystem</h4>'
      + '<p><strong>Loading:</strong> Bootstrap → Platform (Extension) → Application ClassLoader.<br/>'
      + '<strong>Linking:</strong> Verification (checks bytecode integrity), Preparation (allocates static fields with defaults), Resolution (replaces symbolic references with direct memory addresses).<br/>'
      + '<strong>Initialization:</strong> Executes static blocks <code>&lt;clinit&gt;</code> and assigns initial static values.</p>'
      + '<h4>2. JVM Runtime Data Areas</h4>'
      + '<p>• <strong>Method Area / Metaspace:</strong> Per-JVM off-heap storage for class metadata, runtime constant pool, and static variables.<br/>'
      + '• <strong>Heap Memory:</strong> Shared among all threads. Contains all class instances and arrays. Divided into Young Gen (Eden + S0/S1) and Old Gen (Tenured).<br/>'
      + '• <strong>JVM Stacks:</strong> Thread-private. Each method call creates a Stack Frame containing Local Variable Array, Operand Stack, and Frame Data.<br/>'
      + '• <strong>PC Register:</strong> Holds current execution instruction address per thread.<br/>'
      + '• <strong>Native Method Stack:</strong> Executes JNI C/C++ native code.</p>'
      + '<h4>3. Execution Engine & JIT Tiered Compilation</h4>'
      + '<p>Bytecode interpreter starts instantly. Hot code paths are identified by method invocation counters and compiled by Tier 1 (C1 Client Compiler, quick optimizations) and Tier 2 (C2 Server Compiler, deep aggressive inlining and escape analysis).</p>'
      + '</div>'
  },
  types: {
    title: 'Java Primitives & Memory Layout',
    content: '<div class="cheatsheet-section">'
      + '<h4>Primitive Types & Bit Widths</h4>'
      + '<table class="cheatsheet-table">'
      + '<tr><th>Type</th><th>Size</th><th>Default</th><th>Range / Description</th></tr>'
      + '<tr><td><code>byte</code></td><td>8-bit</td><td>0</td><td>-128 to 127</td></tr>'
      + '<tr><td><code>short</code></td><td>16-bit</td><td>0</td><td>-32,768 to 32,767</td></tr>'
      + '<tr><td><code>int</code></td><td>32-bit</td><td>0</td><td>-2,147,483,648 to 2,147,483,647</td></tr>'
      + '<tr><td><code>long</code></td><td>64-bit</td><td>0L</td><td>-2<sup>63</sup> to 2<sup>63</sup>-1 (use L suffix)</td></tr>'
      + '<tr><td><code>float</code></td><td>32-bit IEEE 754</td><td>0.0f</td><td>~6-7 decimal digits precision</td></tr>'
      + '<tr><td><code>double</code></td><td>64-bit IEEE 754</td><td>0.0d</td><td>~15-16 decimal digits precision (default floating)</td></tr>'
      + '<tr><td><code>boolean</code></td><td>JVM Dependent (1-bit logical)</td><td>false</td><td>true or false</td></tr>'
      + '<tr><td><code>char</code></td><td>16-bit Unicode</td><td>\\u0000</td><td>0 to 65,535 (UTF-16 code units)</td></tr>'
      + '</table>'
      + '<h4>Reference Types & Compressed OOPs</h4>'
      + '<p>Reference variables store 32-bit or 64-bit addresses pointing to Heap objects. In 64-bit JVMs with heaps under 32GB, <strong>Compressed OOPs</strong> (Ordinary Object Pointers) compress 64-bit pointers into 32-bit representations, saving ~20% heap footprint.</p>'
      + '</div>'
  },
  collections: {
    title: 'Java Collections Framework & Complexity Matrix',
    content: '<div class="cheatsheet-section">'
      + '<table class="cheatsheet-table">'
      + '<tr><th>Data Structure</th><th>Access</th><th>Search</th><th>Insertion</th><th>Deletion</th><th>Key Properties</th></tr>'
      + '<tr><td><code>ArrayList</code></td><td>O(1)</td><td>O(n)</td><td>O(1) amortized</td><td>O(n)</td><td>Dynamic array, fast index access, slow middle shifts.</td></tr>'
      + '<tr><td><code>LinkedList</code></td><td>O(n)</td><td>O(n)</td><td>O(1) at head/tail</td><td>O(1)</td><td>Doubly linked nodes, higher memory overhead per node.</td></tr>'
      + '<tr><td><code>HashMap</code></td><td>N/A</td><td>O(1) avg</td><td>O(1) avg</td><td>O(1) avg</td><td>Hash bucket table, turns into Red-Black Tree at 8 items per bucket.</td></tr>'
      + '<tr><td><code>TreeMap</code></td><td>N/A</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>Self-balancing Red-Black Tree, sorted order by Comparable.</td></tr>'
      + '<tr><td><code>HashSet</code></td><td>N/A</td><td>O(1) avg</td><td>O(1) avg</td><td>O(1) avg</td><td>Backed by HashMap keys, rejects duplicate elements.</td></tr>'
      + '<tr><td><code>ConcurrentHashMap</code></td><td>N/A</td><td>O(1) avg</td><td>O(1) avg</td><td>O(1) avg</td><td>Thread-safe lock striping / synchronized CAS bucket nodes.</td></tr>'
      + '</table>'
      + '</div>'
  },
  streams: {
    title: 'Modern Java Stream API Cheatsheet',
    content: '<div class="cheatsheet-section">'
      + '<h4>1. Intermediate Operations (Lazy)</h4>'
      + '<p>• <code>filter(Predicate&lt;T&gt;)</code>: Discards elements not matching test.<br/>'
      + '• <code>map(Function&lt;T, R&gt;)</code>: Transforms element of type T into type R.<br/>'
      + '• <code>flatMap(Function&lt;T, Stream&lt;R&gt;&gt;)</code>: Flattens nested streams/collections into a single stream.<br/>'
      + '• <code>distinct()</code>: Removes duplicates via <code>equals()</code> / <code>hashCode()</code>.<br/>'
      + '• <code>sorted(Comparator&lt;T&gt;)</code>: Sorts elements in natural or custom order.<br/>'
      + '• <code>peek(Consumer&lt;T&gt;)</code>: Inspects elements for debugging without mutating.</p>'
      + '<h4>2. Terminal Operations (Eager & Trigger Execution)</h4>'
      + '<p>• <code>collect(Collectors.toList())</code> or <code>.toList()</code> (Java 16+): Collects into immutable list.<br/>'
      + '• <code>reduce(identity, accumulator)</code>: Combines elements into a single accumulated result.<br/>'
      + '• <code>count()</code>: Returns total element count.<br/>'
      + '• <code>anyMatch() / allMatch() / noneMatch()</code>: Short-circuiting boolean verification.<br/>'
      + '• <code>findFirst() / findAny()</code>: Returns an <code>Optional&lt;T&gt;</code>.<br/>'
      + '• <code>forEach(Consumer&lt;T&gt;)</code>: Iterates each element.</p>'
      + '<h4>3. Code Example</h4>'
      + '<pre class="code-preview"><code>List&lt;String&gt; topCoders = users.stream()\n    .filter(u -&gt; u.getXp() &gt;= 1000)\n    .sorted(Comparator.comparingInt(User::getXp).reversed())\n    .map(User::getHandle)\n    .limit(10)\n    .toList();</code></pre>'
      + '</div>'
  }
};

function openCheatsheet(refKey) {
  var sheet = JAVA_CHEATSHEETS[refKey];
  if (!sheet) return;
  setText('cheatsheet-title', sheet.title);
  var body = ge('cheatsheet-content');
  if (body) body.innerHTML = sheet.content;
  showModal('modal-cheatsheet');
}

function closeCheatsheet() {
  hideModal('modal-cheatsheet');
}

var _activeCapstoneProj = null;
var _capstoneAutoSaveTimer = null;

function saveCapstoneCode() {
  if (!_activeCapstoneProj || !STATE || !STATE.player) return;
  if (!STATE.player.capstoneProjects) STATE.player.capstoneProjects = {};
  if (!STATE.player.capstoneProjects[_activeCapstoneProj]) {
    STATE.player.capstoneProjects[_activeCapstoneProj] = { completed: false, tasks: {}, code: '' };
  }
  var ed = ge('code-editor');
  if (ed) {
    STATE.player.capstoneProjects[_activeCapstoneProj].code = ed.value;
    STATE.player.capstoneProjects[_activeCapstoneProj].lastSavedAt = new Date().toISOString();
    localSave();
    setText('capstone-save-status', 'Saved ' + new Date().toLocaleTimeString());
    toast('Project code saved to cloud!');
  }
}

function handleEditorInput() {
  if (!_activeCapstoneProj || !STATE || !STATE.player) return;
  setText('capstone-save-status', 'Editing…');
  clearTimeout(_capstoneAutoSaveTimer);
  _capstoneAutoSaveTimer = setTimeout(function(){
    var ed = ge('code-editor');
    if (ed && _activeCapstoneProj && STATE.player && STATE.player.capstoneProjects) {
      if (!STATE.player.capstoneProjects[_activeCapstoneProj]) {
        STATE.player.capstoneProjects[_activeCapstoneProj] = { completed: false, tasks: {}, code: '' };
      }
      STATE.player.capstoneProjects[_activeCapstoneProj].code = ed.value;
      STATE.player.capstoneProjects[_activeCapstoneProj].lastSavedAt = new Date().toISOString();
      localSave();
      setText('capstone-save-status', 'Auto-saved ' + new Date().toLocaleTimeString());
    }
  }, 1200);
}

function loadCapstoneCodeIntoPlayground(proj) {
  _activeCapstoneProj = proj.id;
  var ed = ge('code-editor');
  var pState = STATE.player.capstoneProjects && STATE.player.capstoneProjects[proj.id];
  var codeToLoad = (pState && pState.code && pState.code.trim()) ? pState.code : (proj.starterCode || '');
  if (ed) {
    ed.value = codeToLoad;
    ed.focus();
    clearOutput();
  }

  var banner = ge('capstone-editor-banner');
  if (banner) {
    banner.classList.remove('hidden');
    setText('capstone-banner-title', proj.title);
    setText('capstone-save-status', (pState && pState.lastSavedAt) ? 'Saved ' + new Date(pState.lastSavedAt).toLocaleTimeString() : 'Ready');
  }

  toast('Loaded ' + proj.title + ' in Playground!');
}

function openProjectModal(projId) {
  var proj = (window.PROJECTS || []).find(function(p){ return p.id === projId; });
  if (!proj) return;
  _activeCapstoneProj = proj.id;

  if (!STATE.player.capstoneProjects) STATE.player.capstoneProjects = {};
  if (!STATE.player.capstoneProjects[proj.id]) {
    STATE.player.capstoneProjects[proj.id] = { completed: false, tasks: {}, code: '' };
  }
  var pState = STATE.player.capstoneProjects[proj.id];
  if (!pState.tasks || typeof pState.tasks !== 'object') pState.tasks = {};

  setText('project-level-badge', (proj.level || 'Java').toUpperCase() + ' CAPSTONE');
  setText('project-modal-title', proj.title);
  setText('project-modal-desc', proj.description);
  setText('project-modal-rubric', proj.rubric || 'Clean architecture, methods, error handling & tests.');

  var statusPill = ge('project-status-pill');
  var banner = ge('project-completion-banner');
  var completeBtn = ge('project-complete-btn');

  function updateStatusUI() {
    var reqs = proj.requirements || [];
    var checked = 0;
    reqs.forEach(function(_, i){ if (pState.tasks[i]) checked++; });
    var pct = reqs.length ? Math.round((checked / reqs.length) * 100) : 0;

    setText('project-progress-badge', checked + '/' + reqs.length + ' Done (' + pct + '%)');
    var fill = ge('project-progress-bar-fill');
    if (fill) fill.style.width = pct + '%';

    if (pState.completed) {
      if (statusPill) {
        statusPill.className = 'project-status-pill completed';
        statusPill.textContent = 'Completed (+' + (proj.xpReward || 250) + ' XP)';
      }
      if (banner) {
        banner.classList.remove('hidden');
        var dStr = pState.completedAt ? new Date(pState.completedAt).toLocaleDateString() : 'recently';
        setText('project-completion-sub', 'Progress saved to cloud. Completed ' + dStr + ' • +' + (proj.xpReward || 250) + ' XP claimed & badge unlocked!');
      }
      if (completeBtn) {
        completeBtn.textContent = 'Project Completed (XP Claimed)';
        completeBtn.classList.remove('btn-primary');
        completeBtn.classList.add('btn-secondary');
      }
    } else {
      if (banner) banner.classList.add('hidden');
      if (completeBtn) {
        completeBtn.textContent = (pct === 100) ? 'Complete Project & Claim ' + (proj.xpReward || 250) + ' XP!' : 'Mark Project Complete (+' + (proj.xpReward || 250) + ' XP)';
        completeBtn.classList.remove('btn-secondary');
        completeBtn.classList.add('btn-primary');
      }
      if (statusPill) {
        if (checked > 0) {
          statusPill.className = 'project-status-pill in-progress';
          statusPill.textContent = 'In Progress (' + checked + '/' + reqs.length + ')';
        } else {
          statusPill.className = 'project-status-pill not-started';
          statusPill.textContent = 'Not Started';
        }
      }
    }
  }

  // Render Automated Task Checklist (Read-Only to prevent cheating; Verified by AI)
  var tasksContainer = ge('project-modal-tasks');
  function renderTaskList() {
    if (!tasksContainer) return;
    tasksContainer.innerHTML = '';
    (proj.requirements || []).forEach(function(reqText, idx){
      var isChecked = !!pState.tasks[idx];
      var reason = (pState.evalFeedback && pState.evalFeedback[idx]) ? pState.evalFeedback[idx] : '';
      var item = document.createElement('div');
      item.className = 'project-task-item' + (isChecked ? ' checked' : '');
      item.setAttribute('data-idx', idx);
      item.style.cursor = 'default';
      item.innerHTML = '<div class="task-check-circle">' + (isChecked ? '<svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#00c060" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1.5 7 5.5 11 12.5 3"/></svg>' : '') + '</div>'
        + '<div style="flex:1;"><div class="task-text">' + esc(reqText) + '</div>'
        + (reason ? '<div class="task-eval-reason ' + (isChecked ? 'reason-pass' : 'reason-fail') + '">' + (isChecked ? 'Passed: ' : 'Notice: ') + esc(reason) + '</div>' : '')
        + '</div>'
        + '<span class="task-badge-pill ' + (isChecked ? 'pill-done' : 'pill-pending') + '">' + (isChecked ? 'Verified' : 'Needs Code') + '</span>';

      item.addEventListener('click', function(){
        toast('Milestones are verified automatically by AI! Write code in the editor and click "AI Verify Tasks".');
      });
      tasksContainer.appendChild(item);
    });
  }
  renderTaskList();

  // Wire Automated AI Code Evaluation
  function evaluateProjectWithAI() {
    var ed = ge('code-editor');
    var code = (ed && ed.value && ed.value.trim()) ? ed.value.trim() : (pState.code || '');
    if (!code || code.length < 35 || code.includes('// Starter skeleton with milestones')) {
      toast('Please open the Code Playground and write your Java implementation first before verifying!');
      return;
    }

    var evalBtns = [ge('project-ai-eval-btn'), ge('project-ai-eval-btn-main')];
    evalBtns.forEach(function(b){ if(b) { b.disabled = true; b.textContent = 'AI Evaluating…'; } });
    toast('JavaBot is analyzing your code against all milestones…');

    callAI('eval-project', {
      projectTitle: proj.title,
      requirements: proj.requirements || [],
      code: code
    })
    .then(function(res) {
      evalBtns.forEach(function(b){ if(b) { b.disabled = false; b.textContent = 'AI Verify Tasks'; } });
      if (!res || !Array.isArray(res.evaluations)) throw new Error('Invalid evaluation result from AI');

      pState.evalFeedback = pState.evalFeedback || {};
      var passCount = 0;
      res.evaluations.forEach(function(ev) {
        pState.tasks[ev.index] = !!ev.passed;
        pState.evalFeedback[ev.index] = ev.reason || '';
        if (ev.passed) passCount++;
      });

      pState.code = code;
      localSave();
      renderTaskList();
      updateStatusUI();

      var total = (proj.requirements || []).length;
      if (passCount === total) {
        toast('All ' + total + ' milestones verified by AI! You can now complete the project and claim your XP!');
      } else {
        toast('AI Evaluation: ' + passCount + '/' + total + ' milestones passed. Check notes above for what is missing.');
      }
    })
    .catch(function(err) {
      evalBtns.forEach(function(b){ if(b) { b.disabled = false; b.textContent = 'AI Verify Tasks'; } });
      toast('AI Evaluation error: ' + (err.message || 'Please retry in a moment'));
    });
  }

  var evalBtn1 = ge('project-ai-eval-btn');
  if (evalBtn1) evalBtn1.onclick = evaluateProjectWithAI;
  var evalBtn2 = ge('project-ai-eval-btn-main');
  if (evalBtn2) evalBtn2.onclick = evaluateProjectWithAI;

  // Render Feature Ideas Section
  var ideasContainer = ge('project-modal-ideas');
  if (ideasContainer) {
    ideasContainer.innerHTML = '';
    var ideas = proj.featureIdeas || [];
    ideas.forEach(function(idea){
      var card = document.createElement('div');
      card.className = 'project-idea-card';
      card.innerHTML = '<div class="idea-card-header">'
        + '<span class="idea-card-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>'
        + '<span class="idea-card-title">' + esc(idea.title) + '</span>'
        + '</div>'
        + '<div class="idea-card-concepts">' + esc(idea.concepts || '') + '</div>'
        + '<p class="idea-card-desc">' + esc(idea.description) + '</p>';
      ideasContainer.appendChild(card);
    });
  }

  // Wire "Ask JavaBot for More Ideas" Button
  var askAiBtn = ge('project-ask-ai-btn');
  if (askAiBtn) {
    askAiBtn.onclick = function(){
      hideModal('modal-project');
      if (typeof sendPromptToChat === 'function') {
        sendPromptToChat("I'm building the " + proj.title + " Capstone project in JavaQuest! Based on what I've learned in the " + proj.level + " Java track, what are 3 creative next features I should add with implementation advice?");
      } else {
        toggleChat();
      }
    };
  }

  // Strict Anti-Skip & Point Protection
  if (completeBtn) {
    completeBtn.onclick = function(){
      if (pState.completed) {
        toast('Project already completed!');
        return;
      }
      var reqs = proj.requirements || [];
      var allVerified = reqs.every(function(_, i){ return !!pState.tasks[i]; });
      if (!allVerified) {
        toast('Anti-Skip: All ' + reqs.length + ' milestones must be verified by AI before claiming completion! Write code and click "AI Verify Tasks".');
        if (pState.completed) {
          pState.completed = false;
          localSave();
        }
        return;
      }

      pState.completed = true;
      pState.completedAt = new Date().toISOString();
      addXP(proj.xpReward || 250);
      if (proj.badgeId) awardBadgeDirect(proj.badgeId);
      burstParticles('home-particles');
      localSave();
      updateStatusUI();
      renderMap();
      toast('Capstone Verified & Completed! +' + (proj.xpReward || 250) + ' XP & Badge Awarded!');
    };
  }

  // Wire "Open Code Playground to Build" Button
  var openBtn = ge('project-open-compiler-btn');
  if (openBtn) {
    openBtn.onclick = function() {
      hideModal('modal-project');
      showScreen('compiler');
      loadCapstoneCodeIntoPlayground(proj);
    };
  }

  updateStatusUI();
  showModal('modal-project');
}

function openModulePopup(modId) {
  var mod = getMod(modId);
  if (!mod) return;
  setText('mod-popup-icon', mod.icon);
  setText('mod-popup-title', (mod.code ? mod.code.toUpperCase() + ': ' : '') + mod.title);
  setText('mod-popup-sub', mod.subtitle || '');

  var lessDiv = ge('mod-popup-lessons');
  if (!lessDiv) return;
  lessDiv.innerHTML = '';
  mod.lessons.forEach(function(lesson){
    var done = (getPlayerState().completedLessons || []).indexOf(lesson.id) !== -1;
    var unlocked = isLessonUnlocked(mod.id, lesson.id);
    var item = document.createElement('div');
    item.className = 'popup-lesson-item' + (done ? ' completed' : '') + (!unlocked && !done ? ' locked-item' : '');
    item.innerHTML = '<span class="lesson-check">' + (done ? '<svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#00c060" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1.5 6 4.5 9.5 10.5 2.5"/></svg>' : unlocked ? '•' : '') + '</span>'
      + '<span class="lesson-item-name">' + esc(lesson.title) + '</span>'
      + '<span class="lesson-item-xp">+' + lesson.xp + ' XP</span>';
    if (unlocked || done) {
      item.style.cursor = 'pointer';
      item.setAttribute('data-mid', mod.id);
      item.setAttribute('data-lid', lesson.id);
      item.addEventListener('click', function(){
        closeModulePopup();
        startLesson(this.getAttribute('data-mid'), this.getAttribute('data-lid'));
      });
    }
    lessDiv.appendChild(item);
  });

  var actDiv = ge('mod-popup-actions');
  if (!actDiv) return;
  actDiv.innerHTML = '';

  var allDone = true;
  for (var i = 0; i < mod.lessons.length; i++) {
    if ((getPlayerState().completedLessons || []).indexOf(mod.lessons[i].id) === -1) {
      allDone = false;
      break;
    }
  }

  // Quiz Challenge Button
  if (mod.challenge) {
    var challDone = (getPlayerState().completedChallenges || []).indexOf(mod.challenge.id) !== -1;
    if (allDone || challDone) {
      var cbtn = document.createElement('button');
      cbtn.className = challDone ? 'btn-secondary' : 'btn-primary';
      cbtn.textContent = challDone ? ('Quiz Done (+' + mod.challenge.xp + ' XP)') : ('Take Quiz Challenge (+' + mod.challenge.xp + ' XP)');
      cbtn.setAttribute('data-mid', mod.id);
      cbtn.addEventListener('click', function(){
        closeModulePopup();
        startChallenge(this.getAttribute('data-mid'));
      });
      actDiv.appendChild(cbtn);

      var aiBtn = document.createElement('button');
      aiBtn.className = 'btn-secondary btn-ai-practice';
      aiBtn.style.marginTop = '0.5rem';
      aiBtn.innerHTML = 'Infinite Practice (AI Quiz)';
      aiBtn.setAttribute('data-mid', mod.id);
      aiBtn.addEventListener('click', function(){
        closeModulePopup();
        generateAIQuiz(this.getAttribute('data-mid'));
      });
      actDiv.appendChild(aiBtn);
    } else {
      var hint = document.createElement('p');
      hint.style.cssText = 'color:rgba(255,255,255,.5);font-size:.82rem;text-align:center;margin:.4rem 0';
      hint.textContent = 'Finish all lessons to unlock the Quiz Challenge!';
      actDiv.appendChild(hint);
    }
  }

  // Interactive Coding Challenge Button
  if (mod.codingTask) {
    var codeDone = (getPlayerState().completedCoding || []).indexOf(mod.id) !== -1;
    var attempts = (STATE.player.codingAttempts && STATE.player.codingAttempts[mod.id]) || 0;
    var cdBtn = document.createElement('button');
    cdBtn.className = codeDone ? 'btn-secondary btn-coding-popup' : 'btn-primary btn-coding-popup';
    cdBtn.style.marginTop = '0.5rem';

    cdBtn.innerHTML = '' + (codeDone ? 'Coding Task Complete' : 'Coding Challenge');
    cdBtn.setAttribute('data-mid', mod.id);
    cdBtn.addEventListener('click', function(){
      closeModulePopup();
      startCodingChallenge(this.getAttribute('data-mid'));
    });
    actDiv.appendChild(cdBtn);
  }

  ge('mod-popup-bg').classList.remove('hidden');
  ge('mod-popup-box').classList.remove('hidden');
}

function closeModulePopup() {
  ge('mod-popup-bg').classList.add('hidden');
  ge('mod-popup-box').classList.add('hidden');
}

/* ═══════════════ CODING CHALLENGE ENGINE ════════════════════════ */
var _curCodingMod = null;
var _codingAttempt = 1;
var _isExecutingTests = false;

function getCodingXP(attempts) {
  return 0; // Points removed from code section
}

function updateScoringRibbon(attempt) {
  setText('coding-attempt-label', 'Attempt ' + attempt);
  var pill = ge('coding-points-pill');
  if (pill) pill.style.display = 'none';
  var rib = qs('.scoring-ribbon');
  if (rib) rib.style.display = 'none';
}

function startCodingChallenge(modId) {
  var mod = getMod(modId);
  if (!mod || !mod.codingTask) {
    toast('No coding challenge found for this module!');
    return;
  }
  _curCodingMod = mod;
  var task = mod.codingTask;

  STATE.player.codingAttempts = STATE.player.codingAttempts || {};
  var prevAttempts = STATE.player.codingAttempts[mod.id] || 0;
  _codingAttempt = prevAttempts + 1;

  setText('coding-module-tag', (mod.code || mod.id).toUpperCase() + ' • Coding Challenge');
  setText('coding-task-title', task.title);

  var promptEl = ge('coding-prompt');
  if (promptEl) promptEl.innerHTML = fmt(task.prompt);

  var expectedEl = ge('coding-expected-output');
  if (expectedEl) expectedEl.textContent = task.expectedOutput || '(Matches test case rules)';

  var hintBox = ge('coding-hint-box');
  if (hintBox) {
    hintBox.classList.add('hidden');
    hintBox.innerHTML = (task.hints && task.hints.length)
      ? task.hints.map(function(h, i){ return '<div class="hint-item"><strong>Hint ' + (i + 1) + ':</strong> ' + fmt(h) + '</div>'; }).join('')
      : '<div>Follow standard Java conventions and test each case thoroughly.</div>';
  }

  var editor = ge('coding-editor');
  if (editor) {
    editor.value = task.starterCode || '// Write your Java solution here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}\n';
  }

  updateScoringRibbon(_codingAttempt);

  var overall = ge('test-overall-status');
  if (overall) {
    overall.className = 'test-status-pill';
    var isDone = (getPlayerState().completedCoding || []).indexOf(mod.id) !== -1;
    overall.textContent = isDone ? 'Solved' : 'Not submitted';
  }

  renderTestCasesList(task.testCases || []);

  var fb = ge('test-feedback-box');
  if (fb) fb.classList.add('hidden');

  showScreen('coding');
}

function generateNewCodingChallenge() {
  if (!_curCodingMod) {
    toast('No active module found!');
    return;
  }
  var btn = ge('coding-new-ai-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generating Challenge…'; }
  toast('Asking Gemini to craft a brand new Java coding challenge for ' + _curCodingMod.title + '…');

  callAI('generate-coding-task', {
    topic: _curCodingMod.title,
    level: _curCodingMod.level || 'intermediate'
  })
  .then(function(res) {
    if (btn) { btn.disabled = false; btn.textContent = 'New Challenge (AI)'; }
    if (!res || !res.task) throw new Error('No task generated by AI');
    var task = res.task;

    _curCodingMod.codingTask = task;
    setText('coding-task-title', task.title);

    var promptEl = ge('coding-prompt');
    if (promptEl) promptEl.innerHTML = fmt(task.prompt);

    var expectedEl = ge('coding-expected-output');
    if (expectedEl) expectedEl.textContent = task.expectedOutput || '(Matches test cases)';

    var hintBox = ge('coding-hint-box');
    if (hintBox) {
      hintBox.innerHTML = (task.hints && task.hints.length)
        ? task.hints.map(function(h, i){ return '<div class="hint-item"><strong>Hint ' + (i + 1) + ':</strong> ' + fmt(h) + '</div>'; }).join('')
        : '<div>Follow standard Java conventions and test each case thoroughly.</div>';
    }

    var editor = ge('coding-editor');
    if (editor) {
      editor.value = task.starterCode || 'public class Main {\n    public static void main(String[] args) {\n        // TODO: Write your solution here\n    }\n}\n';
      editor.focus();
    }

    renderTestCasesList(task.testCases || []);
    var overall = ge('test-overall-status');
    if (overall) {
      overall.className = 'test-status-pill';
      overall.textContent = 'Not submitted';
    }
    toast('Fresh Dynamic Coding Challenge Loaded! (+50 XP)');
  })
  .catch(function(err) {
    if (btn) { btn.disabled = false; btn.textContent = 'New Challenge (AI)'; }
    toast('AI Challenge generation error: ' + (err.message || 'Please try again'));
  });
}

function renderTestCasesList(testCases) {
  var list = ge('test-cases-list');
  if (!list) return;
  list.innerHTML = '';
  testCases.forEach(function(tc, idx){
    var div = document.createElement('div');
    div.className = 'test-case-row';
    div.id = 'tc-row-' + idx;
    div.innerHTML = '<div class="tc-header">'
      + '<span class="tc-title">Test Case ' + (idx + 1) + '</span>'
      + '<span class="tc-badge pending" id="tc-badge-' + idx + '">Ready</span>'
      + '</div>'
      + '<div class="tc-details">'
      + (tc.input ? ('<div><strong>Input:</strong> <code>' + esc(tc.input) + '</code></div>') : '')
      + '<div><strong>Expected Output:</strong> <code>' + esc(tc.expected) + '</code></div>'
      + '<div class="tc-actual hidden" id="tc-act-' + idx + '"><strong>Actual Output:</strong> <pre class="tc-got" id="tc-got-' + idx + '"></pre></div>'
      + '</div>';
    list.appendChild(div);
  });
}

function executeJava(code, stdin) {
  // Authenticated serverless OpenJDK 22 runner (/api/run)
  var token = (window._sbSession && window._sbSession.access_token) ? window._sbSession.access_token : '';
  return fetch('/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? ('Bearer ' + token) : ''
    },
    body: JSON.stringify({ code: code, stdin: stdin || '' })
  })
  .then(function(res){
    if (res.status === 401) throw new Error('Sign in to use the Java compiler.');
    if (res.status === 429) return res.json().then(function(e){ throw new Error(e.error || 'Too many runs. Please wait a minute.'); });
    if (res.status === 503) return res.json().then(function(e){ throw new Error(e.error || 'Compiler is temporarily unavailable. Please try again.'); });
    if (!res.ok) throw new Error('Compiler error (HTTP ' + res.status + ')');
    return res.json();
  })
  .catch(function(err){
    // Network failure — try Wandbox directly as fallback (no AI simulation)
    console.warn('/api/run failed:', err.message, '— trying Wandbox direct...');
    return executeWandboxDirect(code, stdin)
      .catch(function(wErr){
        console.warn('Wandbox direct also failed:', wErr.message);
        return runClientJavaInterpreter(code, stdin);
      });
  });
}

function executeWandboxDirect(code, stdin) {
  var prepared = code.replace(/^[ \t]*port[ \t]+/gm, 'import ');
  prepared = prepared.replace(/\bpublic\s+(class|interface|record|enum)\b/g, '$1');
  var userStdin = stdin != null ? String(stdin) : '';
  return fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'openjdk-jdk-22+36',
      code: prepared,
      stdin: userStdin
    })
  })
  .then(function(res){
    if (!res.ok) throw new Error('Wandbox HTTP ' + res.status);
    return res.json();
  })
  .then(function(data){
    var statusCode = parseInt(data.status || '0', 10);
    var compilerErr = (data.compiler_error || data.compiler_message || '').trim();
    var programOut = (data.program_output || '').replace(/\r\n/g, '\n');
    var programErr = (data.program_error || '').replace(/\r\n/g, '\n').trim();

    if (statusCode !== 0 && compilerErr) {
      return {
        compile: { code: statusCode, stderr: compilerErr },
        run: { stdout: '', stderr: compilerErr, code: statusCode }
      };
    }

    if (statusCode !== 0 && programErr.indexOf('NoSuchElementException') !== -1) {
      return {
        compile: null,
        run: {
          stdout: programOut,
          stderr: '',
          code: 0,
          waitingForInput: true
        }
      };
    }

    return {
      compile: null,
      run: {
        stdout: programOut,
        stderr: programErr,
        code: statusCode
      }
    };
  });
}

function runClientJavaInterpreter(code, stdin) {
  // Strip comments first so comments can never be mistaken for code or output
  var stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim();

  // Validate class and main method
  if (!/class\s+\w+/.test(stripped)) {
    return Promise.resolve({
      compile: {
        code: 1,
        stderr: 'Main.java: error: class, interface, enum, or record expected'
      }
    });
  }
  if (!/public\s+static\s+void\s+main/.test(stripped)) {
    return Promise.resolve({
      compile: {
        code: 1,
        stderr: 'Main.java: error: Main method not found in class Main'
      }
    });
  }

  // Check balanced braces
  var openB = (stripped.match(/\{/g) || []).length;
  var closeB = (stripped.match(/\}/g) || []).length;
  if (openB !== closeB || openB < 2) {
    return Promise.resolve({
      compile: {
        code: 1,
        stderr: 'Main.java: error: Syntax error on tokens, misplaced or unbalanced braces { }'
      }
    });
  }

  // Extract body of main
  var mainMatch = stripped.match(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}\s*\}\s*$/);
  var body = mainMatch ? mainMatch[1] : stripped;

  var stdout = [];
  var currentLine = '';

  function __println(val) {
    var s = (val !== undefined && val !== null) ? String(val) : '';
    stdout.push(currentLine + s);
    currentLine = '';
  }
  function __print(val) {
    var s = (val !== undefined && val !== null) ? String(val) : '';
    currentLine += s;
  }

  // Transpile basic Java body to safe JS execution
  var jsBody = body
    .replace(/System\.out\.println\s*\(/g, '__println(')
    .replace(/System\.out\.print\s*\(/g, '__print(')
    .replace(/\b(?:int|double|float|long|short|byte|boolean|char|String|var)\s+(\w+)/g, 'let $1')
    .replace(/\btrue\b/g, 'true')
    .replace(/\bfalse\b/g, 'false');

  try {
    var runner = new Function('__println', '__print', jsBody);
    runner(__println, __print);
    if (currentLine) stdout.push(currentLine);
    return Promise.resolve({
      run: {
        stdout: stdout.join('\n'),
        stderr: '',
        code: 0
      }
    });
  } catch(e) {
    return Promise.resolve({
      compile: {
        code: 1,
        stderr: 'Compilation / Runtime Error: ' + e.message
      }
    });
  }
}

function runCodingTests() {
  if (_isExecutingTests || !_curCodingMod || !_curCodingMod.codingTask) return;
  var editor = ge('coding-editor');
  if (!editor) return;
  var code = editor.value.trim();
  if (!code) {
    toast('Please write some Java code first!');
    return;
  }

  var btn = ge('coding-submit-btn');
  var overall = ge('test-overall-status');
  var task = _curCodingMod.codingTask;
  var testCases = task.testCases || [{ input: '', expected: task.expectedOutput || '' }];

  _isExecutingTests = true;
  if (btn) { btn.disabled = true; btn.textContent = 'Running Tests…'; }
  if (overall) { overall.className = 'test-status-pill running'; overall.textContent = 'Evaluating…'; }

  var testPanel = ge('test-results-panel');
  if (testPanel && testPanel.classList.contains('collapsed')) {
    testPanel.classList.remove('collapsed');
    var icon = ge('test-collapse-icon');
    if (icon) icon.innerHTML = '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 4 6 8 10 4"/></svg>';
  }

  var fb = ge('test-feedback-box');
  if (fb) fb.classList.add('hidden');

  var currentIdx = 0;
  var allPassed = true;
  var firstFailReason = '';

  function runNextTest() {
    if (currentIdx >= testCases.length) {
      finalizeCodingResults(allPassed, firstFailReason);
      return;
    }

    var tc = testCases[currentIdx];
    var badge = ge('tc-badge-' + currentIdx);
    var actDiv = ge('tc-act-' + currentIdx);
    var gotEl = ge('tc-got-' + currentIdx);
    var row = ge('tc-row-' + currentIdx);

    if (badge) { badge.className = 'tc-badge running'; badge.textContent = 'Running…'; }

    executeJava(code, tc.input)
      .then(function(res){
        var stdout = '';
        var stderr = '';
        if (res.compile && res.compile.stderr) {
          stderr = '[Compilation Error]\n' + res.compile.stderr;
        } else if (res.run) {
          stdout = (res.run.stdout || '').replace(/\r\n/g, '\n').trim();
          stderr = (res.run.stderr || '').replace(/\r\n/g, '\n').trim();
        }

        var actual = stdout || stderr || '(No output)';
        var exp = (tc.expected || '').replace(/\r\n/g, '\n').trim();

        // STRICT REAL CHECK:
        // No compile/run error, and stdout must strictly match the expected output
        var isPass = false;
        if (!stderr && stdout) {
          var actualLines = stdout.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
          var expLines = exp.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);

          if (stdout === exp) {
            isPass = true;
          } else if (actualLines.join('\n') === expLines.join('\n')) {
            isPass = true;
          } else if (actualLines.indexOf(exp) !== -1) {
            isPass = true;
          }
        }

        if (actDiv) actDiv.classList.remove('hidden');
        if (gotEl) gotEl.textContent = actual;

        if (isPass) {
          if (badge) { badge.className = 'tc-badge passed'; badge.textContent = 'Passed'; }
          if (row) { row.classList.remove('failed-row'); row.classList.add('passed-row'); }
        } else {
          allPassed = false;
          if (badge) { badge.className = 'tc-badge failed'; badge.textContent = 'Failed'; }
          if (row) { row.classList.remove('passed-row'); row.classList.add('failed-row'); }
          if (!firstFailReason) {
            firstFailReason = stderr ? stderr : ('Expected "' + exp + '" but got "' + (stdout || '(No output)') + '"');
          }
        }

        currentIdx++;
        runNextTest();
      })
      .catch(function(err){
        allPassed = false;
        if (badge) { badge.className = 'tc-badge failed'; badge.textContent = 'Failed'; }
        if (row) { row.classList.remove('passed-row'); row.classList.add('failed-row'); }
        if (actDiv) actDiv.classList.remove('hidden');
        if (gotEl) gotEl.textContent = 'Error: ' + err.message;
        if (!firstFailReason) firstFailReason = err.message;
        currentIdx++;
        runNextTest();
      });
  }

  runNextTest();
}

function finalizeCodingResults(passed, reason) {
  _isExecutingTests = false;
  var btn = ge('coding-submit-btn');
  if (btn) { btn.disabled = false; btn.textContent = 'Submit & Run Tests'; }

  var overall = ge('test-overall-status');
  var fb = ge('test-feedback-box');
  var titleEl = ge('test-result-title');
  var descEl = ge('test-result-desc');
  var contBtn = ge('coding-continue-btn');

  if (passed) {
    if (overall) { overall.className = 'test-status-pill passed'; overall.textContent = 'All Tests Passed!'; }

    var isNew = (getPlayerState().completedCoding || []).indexOf(_curCodingMod.id) === -1;
    if (isNew) {
      getPlayerState().completedCoding.push(_curCodingMod.id);
      checkBadge('first_challenge');
      markModuleCompleteIfReady(_curCodingMod);
      localSave();
    }

    if (fb) {
      fb.classList.remove('hidden', 'feedback-error');
      fb.classList.add('feedback-success');
    }
    if (titleEl) {
      titleEl.textContent = 'Solved in ' + _codingAttempt + ' ' + (_codingAttempt === 1 ? 'try' : 'tries') + '!';
    }
    if (descEl) {
      descEl.textContent = 'All test cases matched! Challenge complete.';
    }
    if (contBtn) {
      contBtn.textContent = 'Back to Map';
      contBtn.onclick = function(){ showScreen('map'); };
    }

    burstParticles('levelup-particles');
    toast('Coding Challenge Complete!');
  } else {
    if (overall) { overall.className = 'test-status-pill failed'; overall.textContent = 'Tests Failed'; }

    // Increment attempt counter
    _codingAttempt++;
    STATE.player.codingAttempts = STATE.player.codingAttempts || {};
    STATE.player.codingAttempts[_curCodingMod.id] = _codingAttempt;
    updateScoringRibbon(_codingAttempt);
    localSave();

    if (fb) {
      fb.classList.remove('hidden', 'feedback-success');
      fb.classList.add('feedback-error');
    }
    if (titleEl) {
      titleEl.textContent = 'Test Not Passed (Attempt ' + (_codingAttempt - 1) + ')';
    }
    if (descEl) {
      descEl.innerHTML = esc(reason || 'Output did not match expected test case.')
        + '<br><span style="color:#FFD166;font-weight:600;margin-top:.4rem;display:inline-block">Hint: Review your code and submit again.</span>';
    }
    if (contBtn) {
      contBtn.textContent = 'View Hint';
      contBtn.onclick = function(){
        var hb = ge('coding-hint-box');
        if (hb) hb.classList.remove('hidden');
      };
    }
  }
}

/* ═══════════════ DIFFICULTY MODAL ══════════════════════════════ */
var _pendingDiff = null;

function openDiffModal() {
  _pendingDiff = STATE.player.difficulty;
  var cards = qsa('#modal-diff-cards .diff-card');
  cards.forEach(function(c){
    c.classList.toggle('selected', c.getAttribute('data-diff')===_pendingDiff);
  });
  showModal('modal-diff');
}

function initDiffModal() {
  var dc = ge('modal-diff-cards');
  if(dc) dc.addEventListener('click',function(e){
    var card=e.target.closest('.diff-card'); if(!card) return;
    _pendingDiff=card.getAttribute('data-diff');
    dc.querySelectorAll('.diff-card').forEach(function(c){c.classList.remove('selected');});
    card.classList.add('selected');
  });
  var cancel=ge('diff-cancel-btn');  if(cancel)  cancel.addEventListener('click',function(){ hideModal('modal-diff'); });
  var confirm=ge('diff-confirm-btn'); if(confirm) confirm.addEventListener('click',function(){
    if(_pendingDiff && _pendingDiff!==STATE.player.difficulty){
      STATE.player.difficulty=_pendingDiff;
      localSave();
      renderMap(); renderSettings(); updateNav();
      toast('Difficulty changed to '+DIFFICULTY_LABELS[_pendingDiff]+'!');
    }
    hideModal('modal-diff');
  });
}

/* ═══════════════ LESSON ENGINE ═════════════════════════════════ */
var _curMod=null, _curLesson=null, _slideIdx=0;

function startLesson(modId, lessonId) {
  var mod=getMod(modId); if(!mod){toast('Module not found!');return;}
  var lesson=null;
  for(var i=0;i<mod.lessons.length;i++) if(mod.lessons[i].id===lessonId){lesson=mod.lessons[i];break;}
  if(!lesson){toast('Lesson not found!');return;}
  _curMod=mod; _curLesson=lesson; _slideIdx=0;
  setText('lesson-module-tag',mod.title); setText('lesson-title',lesson.title); setText('lesson-xp-badge','+'+lesson.xp+' XP');
  if(typeof updateChatContext==='function') updateChatContext(mod.title);
  renderSlide(); showScreen('lesson');
}

function renderSlide() {
  var slide=_curLesson.slides[_slideIdx], total=_curLesson.slides.length;
  if(!slide) return;
  setText('slide-counter',(_slideIdx+1)+' / '+total);
  setWidth('lesson-progress-fill',Math.round((_slideIdx+1)/total*100)+'%');
  var dots=ge('slide-dots');
  if(dots){dots.innerHTML='';for(var d=0;d<total;d++){var dot=document.createElement('div');dot.className='slide-dot'+(d===_slideIdx?' active':'');dots.appendChild(dot);}}
  var prev=ge('btn-prev-slide'),next=ge('btn-next-slide');
  if(prev) prev.style.visibility=(_slideIdx===0?'hidden':'visible');
  if(next) next.textContent=(_slideIdx===total-1?'Finish Lesson':'Next →');
  var area=ge('slide-area'); if(!area) return;
  var typeLabel={intro:'Introduction',code:'Code Example',tip:'Pro Tip',visual:'Visualizer'}[slide.type]||'Lesson';
  var html='<div class="slide slide-type-'+(slide.type||'intro')+'">'
    +'<div class="slide-inner">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">'
    +'<span class="slide-type-badge">'+typeLabel+'</span>'
    +'<button class="btn-deep-dive" onclick="openDeepDive()">AI Deep Dive</button>'
    +'</div>'
    +'<h2 class="slide-title">'+esc(slide.title)+'</h2>'
    +'<div class="slide-content">'+fmt(slide.content)+'</div>';
  if(slide.code) html+=buildCodeBlock(slide.code);
  if(slide.type==='tip') html+='<div class="tip-box"><span class="tip-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path></svg></span><div class="tip-text">'+fmt(slide.content)+'</div></div>';
  html+='</div>';
  if(slide.visual) html+='<div class="visual-area" id="vis-now"></div>';
  html+='</div>';
  area.innerHTML=html;
  if(slide.visual) setTimeout(function(){ renderVis(slide); },80);
}

function renderVis(slide) {
  var c = ge('vis-now'); if (!c) return;
  if (typeof renderVisualizer === 'function') {
    renderVisualizer(c, slide.visual, slide.visualData || {});
  } else if (slide.visual==='memory'&&slide.visualData) renderMemoryDiagram(c,slide.visualData);
  else if (slide.visual==='loop'&&slide.visualData) renderLoopTracer(c,slide.visualData);
  else if (slide.visual==='flowchart') renderFlowchart(c,slide.visualData||{});
  else if (slide.visual==='class-diagram'&&slide.visualData) renderClassDiagram(c,slide.visualData);
  else {
    c.innerHTML = '<div style="text-align:center;padding:1.5rem;font-weight:700;color:var(--text-secondary)">Interactive Diagram</div>';
  }
}

function nextSlide(){ if(_slideIdx<_curLesson.slides.length-1){_slideIdx++;renderSlide();addXP(5);}else finishLesson(); }
function prevSlide(){ if(_slideIdx>0){_slideIdx--;renderSlide();} }

function finishLesson() {
  var isNew=getPlayerState().completedLessons.indexOf(_curLesson.id)===-1;
  if(isNew){
    getPlayerState().completedLessons.push(_curLesson.id);
    addXP(_curLesson.xp); checkBadge('first_lesson');
    var allDone=true;
    for(var i=0;i<_curMod.lessons.length;i++) if(getPlayerState().completedLessons.indexOf(_curMod.lessons[i].id)===-1){allDone=false;break;}
    localSave();
    if(allDone){
      var mt=_curMod.title,lx=_curLesson.xp;
      setTimeout(function(){setText('complete-module-name',mt);setText('complete-xp-earned','+'+lx+' XP earned!');showModal('modal-complete');},600);
    } else {
      toast('Lesson complete! +'+_curLesson.xp+' XP');
      setTimeout(function(){showScreen('map');},700);
    }
  } else { toast('Already completed '); showScreen('map'); }
}

/* ═══════════════ CHALLENGE ENGINE ══════════════════════════════ */
var _cm=null,_qs=[],_qi=0,_hits=0;
var _selMCQ=-1,_selTF=null,_blanks=[],_activeB=-1,_mSel=null,_mPairs={},_selBug=-1;

function shuffleQuestionOptions(q) {
  if (!q) return q;
  if (Array.isArray(q.options) && q.options.length >= 2 && typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.options.length) {
    var items = q.options.map(function(opt, idx) {
      return { text: opt, isCorrect: idx === q.answer };
    });
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    q.options = items.map(function(x) { return x.text; });
    q.answer = items.findIndex(function(x) { return x.isCorrect; });
  }
  return q;
}

function startChallenge(modId, forceAI) {
  var mod = getMod(modId); if(!mod){toast('Module not found!');return;}
  _cm = mod;

  // If user has already completed the module or explicitly requests fresh questions, generate with AI!
  var isDone = (getPlayerState().completedChallenges || []).indexOf(mod.challenge ? mod.challenge.id : '') !== -1;
  if (forceAI || isDone) {
    if (typeof generateAIQuiz === 'function') {
      generateAIQuiz(modId);
      return;
    }
  }

  // Clone questions and randomize options so the answer is never fixed to C
  var rawQs = (mod.challenge && Array.isArray(mod.challenge.questions)) ? mod.challenge.questions : [];
  _qs = rawQs.map(function(q){
    var clone = JSON.parse(JSON.stringify(q));
    return shuffleQuestionOptions(clone);
  });

  // Fisher-Yates shuffle the question order
  for (var i = _qs.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = _qs[i];
    _qs[i] = _qs[j];
    _qs[j] = tmp;
  }

  _qi = 0; _hits = 0;
  var p = STATE.player;
  if (p.hearts < 3 && p.heartRefillTime && Date.now() > p.heartRefillTime) {
    p.hearts = 3; p.heartRefillTime = null; localSave();
  }
  setText('challenge-module-title', mod.title + ' — Challenge');
  renderHearts(); renderQuestion(); showScreen('challenge');
}

function startAIChallengeFromHeader() {
  if (!_cm) return;
  var mid = (_cm.id || '').replace('module-', '').replace('ai_', '').split('_')[0] || 'b1';
  if (typeof generateAIQuiz === 'function') {
    generateAIQuiz(mid);
  }
}

function renderQuestion() {
  var q=_qs[_qi]; if(!q) return;
  _selMCQ=-1;_selTF=null;_blanks=[];_activeB=-1;_mSel=null;_mPairs={};_selBug=-1;
  setText('question-counter',(_qi+1)+' / '+_qs.length);
  setWidth('challenge-progress-fill',Math.round(_qi/_qs.length*100)+'%');
  var fb=ge('answer-feedback'),ca=ge('challenge-actions');
  if(fb)fb.classList.add('hidden'); if(ca)ca.classList.remove('hidden');
  var chk=ge('btn-check-answer');if(chk){chk.disabled=false;chk.textContent='Check Answer';}
  var labels={mcq:'Multiple Choice','true-false':'True or False',output:'Output Prediction','fill-blank':'Fill in the Blank',arrange:'Arrange the Code',bug:'Spot the Bug',match:'Match Pairs'};
  var area=ge('question-area'); if(!area) return;
  area.innerHTML='<span class="question-type-tag">'+(labels[q.type]||q.type)+'</span><div class="question-text">'+esc(q.question)+'</div>';
  if(q.code&&q.type!=='fill-blank'&&q.type!=='bug') area.innerHTML+=buildCodeBlock(q.code);
  if(q.type==='mcq'||q.type==='output') rMCQ(q,area);
  else if(q.type==='true-false') rTF(q,area);
  else if(q.type==='fill-blank') rFill(q,area);
  else if(q.type==='arrange') rArrange(q,area);
  else if(q.type==='bug') rBug(q,area);
  else if(q.type==='match') rMatch(q,area);
}

function rMCQ(q,area){var opts=document.createElement('div');opts.className='mcq-options';q.options.forEach(function(opt,i){var d=document.createElement('div');d.className='mcq-option';var l=document.createElement('span');l.className='mcq-letter';l.textContent='ABCD'[i];var t=document.createElement('span');t.className='mcq-text';t.textContent=opt;d.appendChild(l);d.appendChild(t);d.setAttribute('data-i',i);d.addEventListener('click',function(){_selMCQ=parseInt(this.getAttribute('data-i'));qsa('.mcq-option').forEach(function(o){o.classList.remove('selected');});this.classList.add('selected');});opts.appendChild(d);});area.appendChild(opts);}
function rTF(q,area){if(q.code){var cd=document.createElement('div');cd.innerHTML=buildCodeBlock(q.code);area.appendChild(cd);}var c=document.createElement('div');c.className='tf-container';['True','False'].forEach(function(label,i){var b=document.createElement('button');b.className='tf-btn '+(i===0?'true-btn':'false-btn');b.id='tf-b-'+i;b.textContent=label;b.setAttribute('data-v',i===0?'true':'false');b.addEventListener('click',function(){_selTF=(this.getAttribute('data-v')==='true');qsa('.tf-btn').forEach(function(x){x.classList.remove('selected');});this.classList.add('selected');});c.appendChild(b);});area.appendChild(c);}
function rFill(q,area){var parts=q.codeTemplate.split('___');_blanks=[];for(var x=0;x<parts.length-1;x++)_blanks.push(null);_activeB=0;var wrap=document.createElement('div');wrap.className='code-block';var hdr=document.createElement('div');hdr.className='code-block-header';hdr.innerHTML='<span class="code-lang-tag">Java</span>';wrap.appendChild(hdr);var pre=document.createElement('pre');parts.forEach(function(part,i){var sp=document.createElement('span');sp.innerHTML=highlightSyntax(part);pre.appendChild(sp);if(i<parts.length-1){var blank=document.createElement('span');blank.className='blank-input';blank.id='bl-'+i;blank.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;';blank.setAttribute('data-i',i);blank.addEventListener('click',function(){activateBlank(parseInt(this.getAttribute('data-i')));});pre.appendChild(blank);}});wrap.appendChild(pre);area.appendChild(wrap);var bank=document.createElement('div');bank.className='blank-word-bank';bank.innerHTML='<div style="font-size:.78rem;color:rgba(255,255,255,.4);width:100%;margin-bottom:.4rem;font-weight:600">Word Bank — click word then click blank:</div>';q.options.forEach(function(word){var chip=document.createElement('div');chip.className='word-bank-chip';chip.textContent=word;chip.setAttribute('data-word',word);chip.addEventListener('click',function(){fillBlank(this.getAttribute('data-word'));});bank.appendChild(chip);});area.appendChild(bank);setTimeout(function(){activateBlank(0);},50);}
function activateBlank(idx){_activeB=idx;qsa('.blank-input').forEach(function(el,i){el.style.boxShadow=(i===idx)?'0 0 0 2px #6C63FF':'none';});}
function fillBlank(word){if(_activeB<0)return;_blanks[_activeB]=word;var el=ge('bl-'+_activeB);if(el){el.textContent=word;el.classList.add('filled');}var next=-1;for(var i=_activeB+1;i<_blanks.length;i++)if(_blanks[i]===null){next=i;break;}if(next>=0)activateBlank(next);else _activeB=-1;}
function rArrange(q,area){var c=document.createElement('div');c.className='arrange-container';c.id='arr-c';q.blocks.forEach(function(block,i){var d=document.createElement('div');d.className='arrange-block';d.draggable=true;d.setAttribute('data-i',i);var h=document.createElement('span');h.className='drag-handle';h.textContent='⠿';d.appendChild(h);var code=document.createElement('span');code.innerHTML=highlightSyntax(block);d.appendChild(code);c.appendChild(d);});area.appendChild(c);initDragAndDrop(c);}
function rBug(q,area){var wrap=document.createElement('div');wrap.className='bug-code-wrap';q.code.split('\n').forEach(function(line,i){var lineDiv=document.createElement('div');lineDiv.className='bug-line';lineDiv.id='bl-line-'+i;var num=document.createElement('span');num.className='bug-line-num';num.textContent=i+1;lineDiv.appendChild(num);var code=document.createElement('span');code.innerHTML=highlightSyntax(line);lineDiv.appendChild(code);lineDiv.setAttribute('data-i',i);lineDiv.addEventListener('click',function(){_selBug=parseInt(this.getAttribute('data-i'));qsa('.bug-line').forEach(function(l){l.classList.remove('selected');});this.classList.add('selected');});wrap.appendChild(lineDiv);});area.appendChild(wrap);if(q.options){var opts=document.createElement('div');opts.className='bug-options';q.options.forEach(function(opt,i){var d=document.createElement('div');d.className='mcq-option';d.setAttribute('data-i',i);var l=document.createElement('span');l.className='mcq-letter';l.textContent='ABCD'[i];var t=document.createElement('span');t.className='mcq-text';t.textContent=opt;d.appendChild(l);d.appendChild(t);d.addEventListener('click',function(){_selBug=parseInt(this.getAttribute('data-i'));qsa('.mcq-option').forEach(function(o){o.classList.remove('selected');});this.classList.add('selected');});opts.appendChild(d);});area.appendChild(opts);}}
function rMatch(q,area){var c=document.createElement('div');c.className='match-container';var tc=document.createElement('div');tc.className='match-col';tc.innerHTML='<div class="match-col-label">Terms</div>';var dc2=document.createElement('div');dc2.className='match-col';dc2.innerHTML='<div class="match-col-label">Definitions</div>';var dOrder=[];for(var z=0;z<q.pairs.length;z++)dOrder.push(z);dOrder.sort(function(){return Math.random()-.5;});q.pairs.forEach(function(pair,ti){var el=document.createElement('div');el.className='match-item';el.id='mt-'+ti;el.textContent=pair[0];el.setAttribute('data-side','term');el.setAttribute('data-i',ti);el.addEventListener('click',function(){doMatchClick('term',parseInt(this.getAttribute('data-i')));});tc.appendChild(el);});dOrder.forEach(function(di){var el=document.createElement('div');el.className='match-item';el.id='md-'+di;el.textContent=q.pairs[di][1];el.setAttribute('data-side','def');el.setAttribute('data-i',di);el.addEventListener('click',function(){doMatchClick('def',parseInt(this.getAttribute('data-i')));});dc2.appendChild(el);});c.appendChild(tc);c.appendChild(dc2);area.appendChild(c);}
function doMatchClick(side,idx){var mc=['matched-0','matched-1','matched-2','matched-3','matched-4'];if(!_mSel){_mSel={side:side,idx:idx};var el=ge(side==='term'?'mt-'+idx:'md-'+idx);if(el)el.classList.add('selected');return;}if(_mSel.side===side){qsa('.match-item').forEach(function(e){e.classList.remove('selected');});_mSel={side:side,idx:idx};var el2=ge(side==='term'?'mt-'+idx:'md-'+idx);if(el2)el2.classList.add('selected');return;}var ti=(side==='term')?idx:_mSel.idx,di=(side==='def')?idx:_mSel.idx;var ci=Object.keys(_mPairs).length%5;if(_mPairs[ti]!==undefined){var old=_mPairs[ti];['mt-'+ti,'md-'+old].forEach(function(eid){var e=ge(eid);if(e)mc.forEach(function(c){e.classList.remove(c);});});}_mPairs[ti]=di;['mt-'+ti,'md-'+di].forEach(function(eid){var e=ge(eid);if(e){e.classList.remove('selected');e.classList.add('matched-'+ci);}});_mSel=null;}

function checkAnswer() {
  var q=_qs[_qi]; var correct=false;
  if(q.type==='mcq'||q.type==='output'){if(_selMCQ<0){toast('Choose an option first!');return;}correct=(_selMCQ===q.answer);qsa('.mcq-option').forEach(function(el,i){if(i===q.answer)el.classList.add('correct');else if(i===_selMCQ&&!correct)el.classList.add('wrong');});}
  else if(q.type==='true-false'){if(_selTF===null){toast('Choose True or False!');return;}correct=(_selTF===q.answer);var tb=ge('tf-b-0'),fb2=ge('tf-b-1');if(q.answer===true){if(tb)tb.classList.add('correct');if(!correct&&fb2)fb2.classList.add('wrong');}else{if(fb2)fb2.classList.add('correct');if(!correct&&tb)tb.classList.add('wrong');}}
  else if(q.type==='fill-blank'){var hasNull=false;for(var i=0;i<_blanks.length;i++)if(_blanks[i]===null){hasNull=true;break;}if(hasNull){toast('Fill all blanks first!');return;}correct=true;for(var j=0;j<q.answer.length;j++)if((_blanks[j]||'').toLowerCase()!==q.answer[j].toLowerCase()){correct=false;break;}}
  else if(q.type==='arrange'){var blocks=qsa('#arr-c .arrange-block');var order=[];blocks.forEach(function(b){order.push(parseInt(b.getAttribute('data-i')));});correct=JSON.stringify(order)===JSON.stringify(q.answer);}
  else if(q.type==='bug'){if(_selBug<0){toast('Select an option first!');return;}correct=(_selBug===q.answer);if(q.options){qsa('.mcq-option').forEach(function(el,i){if(i===q.answer)el.classList.add('correct');else if(i===_selBug&&!correct)el.classList.add('wrong');});}}
  else if(q.type==='match'){if(Object.keys(_mPairs).length<q.pairs.length){toast('Match all pairs first!');return;}correct=true;for(var k=0;k<q.pairs.length;k++)if(_mPairs[k]!==k){correct=false;break;}}
  if(correct){_hits++;addXP(12);}
  else{var p=STATE.player;if(p.hearts>0){p.hearts--;p.heartRefillTime=Date.now()+30*60*1000;renderHearts();localSave();}if(p.hearts===0)toast('No hearts! They refill in 30 min');}
  var fb=ge('answer-feedback'),ca=ge('challenge-actions');
  if(fb){
    fb.classList.remove('hidden','correct-fb','wrong-fb');
    fb.classList.add(correct?'correct-fb':'wrong-fb');
    var fbi = ge('feedback-icon');
    if (fbi) fbi.innerHTML = correct ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#05D380" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    setText('feedback-result',correct?'Correct!':'Not quite...');
    setText('feedback-explanation',q.explanation||'');
    var aiBox = ge('feedback-ai-box');
    if (aiBox) { aiBox.innerHTML = ''; aiBox.classList.add('hidden'); }
    var explainBtn = ge('btn-explain-mistake');
    if (explainBtn) {
      if (!correct && typeof explainMistakeWithAI === 'function') {
        explainBtn.classList.remove('hidden');
        explainBtn.disabled = false;
        explainBtn.textContent = 'Explain My Mistake';
      } else {
        explainBtn.classList.add('hidden');
      }
    }
  }
  if(ca)ca.classList.add('hidden');
}

function nextQuestion(){_qi++;if(_qi<_qs.length)renderQuestion();else finishChallenge();}

function finishChallenge() {
  var total=_qs.length,pct=Math.round(_hits/total*100),perfect=(_hits===total);
  var xp=_cm.challenge.xp+(perfect?25:0);
  if(getPlayerState().completedChallenges.indexOf(_cm.challenge.id)===-1){
    getPlayerState().completedChallenges.push(_cm.challenge.id);
    addXP(xp);
    if(_cm.lessons && Array.isArray(_cm.lessons)){
      var allL=true;for(var i=0;i<_cm.lessons.length;i++)if(getPlayerState().completedLessons.indexOf(_cm.lessons[i].id)===-1){allL=false;break;}
      if(allL&&getPlayerState().completedModules.indexOf(_cm.id)===-1){
        getPlayerState().completedModules.push(_cm.id);
        checkBadge('first_module'); checkBadge('module_'+_cm.id.replace('module-',''));
        var allM=true;var mods=getModulesForDifficulty();for(var j=0;j<mods.length;j++)if(getPlayerState().completedModules.indexOf(mods[j].id)===-1){allM=false;break;}
        if(allM) checkBadge('all_modules');
      }
    }
    if(perfect) checkBadge('perfect_challenge');
    localSave();
  }
  setText('score-text',_hits+'/'+total);
  setText('challenge-result-title',perfect?'Perfect Score!':pct>=70?'Great Job!':'Keep Practicing!');
  setText('challenge-xp-earned','+'+xp+' XP Earned!');
  setText('result-message',perfect?'Flawless! Bonus XP earned!':pct+'% correct!');
  var sc=ge('score-circle');if(sc)sc.style.borderColor=perfect?'#06D6A0':pct>=70?'#FFD166':'#E63946';
  setTimeout(function(){showModal('modal-challenge-result');},400);
  if(perfect)setTimeout(function(){burstParticles('levelup-particles');},600);
}

function renderPixelHeartSvg(filled) {
  var color = filled ? '#E11D48' : '#64748B';
  var highlight = filled ? '#FDA4AF' : 'transparent';
  return '<svg viewBox="0 0 9 8" width="16" height="14" class="pixel-heart' + (filled ? ' filled' : ' empty') + '" shape-rendering="crispEdges" style="margin:0 1px;vertical-align:middle;">'
    + '<rect x="1" y="0" width="3" height="2" fill="' + color + '"/>'
    + '<rect x="5" y="0" width="3" height="2" fill="' + color + '"/>'
    + '<rect x="0" y="1" width="9" height="3" fill="' + color + '"/>'
    + '<rect x="1" y="4" width="7" height="1" fill="' + color + '"/>'
    + '<rect x="2" y="5" width="5" height="1" fill="' + color + '"/>'
    + '<rect x="3" y="6" width="3" height="1" fill="' + color + '"/>'
    + '<rect x="4" y="7" width="1" height="1" fill="' + color + '"/>'
    + '<rect x="2" y="1" width="1" height="1" fill="' + highlight + '"/>'
    + '</svg>';
}

function renderHearts(){
  var h = (STATE && STATE.player) ? STATE.player.hearts : 3;
  for(var i=1;i<=3;i++){
    var e=ge('heart-'+i);
    if(e) {
      e.classList.toggle('lost', i>h);
      e.innerHTML = renderPixelHeartSvg(i <= h);
    }
  }
  var container = ge('nav-hearts');
  if (container) {
    var svgHearts = '';
    for (var a = 0; a < 3; a++) {
      svgHearts += renderPixelHeartSvg(a < h);
    }
    container.innerHTML = svgHearts;
  }
}

/* ═══════════════ COMPILER ═══════════════════════════════════════ */
var TEMPLATES = {
  hello:'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("I am learning Java with JavaQuest!");\n    }\n}',
  variables:'public class Main {\n    public static void main(String[] args) {\n        int age = 20;\n        double price = 9.99;\n        boolean isLearning = true;\n        String name = "JavaLearner";\n        char grade = \'A\';\n        System.out.println("Name: " + name);\n        System.out.println("Age: " + age);\n        System.out.println("Learning: " + isLearning);\n    }\n}',
  ifelse:'public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 90) System.out.println("Grade: A");\n        else if (score >= 80) System.out.println("Grade: B");\n        else System.out.println("Grade: C or below");\n        String status = score >= 60 ? "Passed" : "Failed";\n        System.out.println("Status: " + status);\n    }\n}',
  loops:'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) System.out.println("Step " + i);\n        int count = 0;\n        while (count < 3) { System.out.println("Count: " + count); count++; }\n        int[] nums = {10, 20, 30};\n        for (int num : nums) System.out.println(num);\n    }\n}',
  arrays:'public class Main {\n    public static void main(String[] args) {\n        int[] scores = {95, 87, 76, 92, 88};\n        int sum = 0;\n        for (int s : scores) sum += s;\n        System.out.println("Average: " + (double)sum / scores.length);\n    }\n}',
  methods:'public class Main {\n    static int add(int a, int b) { return a + b; }\n    static boolean isEven(int n) { return n % 2 == 0; }\n    static int factorial(int n) { return n <= 1 ? 1 : n * factorial(n-1); }\n    public static void main(String[] args) {\n        System.out.println("5+3 = " + add(5,3));\n        System.out.println("4 even? " + isEven(4));\n        System.out.println("5! = " + factorial(5));\n    }\n}',
  oop:'public class Main {\n    static class Animal {\n        String name, sound;\n        Animal(String n, String s) { name=n; sound=s; }\n        void speak() { System.out.println(name+" says "+sound+"!"); }\n    }\n    public static void main(String[] args) {\n        Animal dog = new Animal("Dog","Woof");\n        Animal cat = new Animal("Cat","Meow");\n        dog.speak(); cat.speak();\n    }\n}',
  scanner:'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println("=== JavaQuest Interactive Scanner Demo ===");\n        System.out.print("Enter your adventurer name: ");\n        String name = sc.nextLine();\n\n        System.out.print("Enter your level: ");\n        int level = Integer.parseInt(sc.nextLine());\n\n        System.out.println("\\nWelcome to JavaQuest, " + name + "! (Level " + level + ")");\n        System.out.println(level >= 10 ? "Status: Master Coder!" : "Status: Rising Apprentice!");\n        sc.close();\n    }\n}'
};

var _compilerReady=false;
function initCompiler(){ if(_compilerReady)return; _compilerReady=true; var ed=ge('code-editor'); if(ed&&!ed.value) ed.value=TEMPLATES.hello; }
function loadTemplate(name){
  var ed=ge('code-editor');
  if(ed&&TEMPLATES[name]){
    ed.value=TEMPLATES[name];
    ed.focus();
    clearOutput();
  }
}

var _interactiveSession = {
  active: false,
  code: '',
  inputs: [],
  history: [],
  lastRawStdout: '',
  lastPrompt: '',
  isExecuting: false
};

function clearOutput() {
  _interactiveSession.active = false;
  _interactiveSession.isExecuting = false;
  _interactiveSession.inputs = [];
  _interactiveSession.history = [];
  _interactiveSession.lastRawStdout = '';
  _interactiveSession.lastPrompt = '';
  var bar = ge('terminal-interactive-bar');
  if (bar) bar.style.display = 'none';
  var o = ge('output-area');
  if (o) {
    o.innerHTML = '<div class="terminal-idle-state" id="terminal-idle-prompt">'
      + '<span class="terminal-idle-icon">❯</span> '
      + '<span class="terminal-idle-text">Java Terminal Ready. Click <button class="terminal-run-pill" onclick="runCode()">▶ Run Code</button> (or press <strong>Ctrl+Enter</strong>) to execute!</span>'
      + '</div>';
  }
}

function runCode() {
  var code = getEditorCode('playground').trim();
  if (!code) {
    var ed = ge('code-editor');
    if (ed) code = ed.value.trim();
  }
  if (!code) { toast('Write some code first!'); return; }
  if (_activeCapstoneProj) saveCapstoneCode();
  var outEl = ge('output-area'); if (!outEl) return;
  var bar = ge('terminal-interactive-bar'); if (bar) bar.style.display = 'none';

  if (_cmPlayground) _cmPlayground.clearErrors();

  _interactiveSession.active = true;
  _interactiveSession.code = code;
  _interactiveSession.inputs = [];
  _interactiveSession.history = [];
  _interactiveSession.lastRawStdout = '';
  _interactiveSession.lastPrompt = '';

  // Only use batch inputs if the user explicitly opened the batch drawer
  var batchBox = ge('compiler-stdin-box');
  var isBatchOpen = batchBox && !batchBox.classList.contains('collapsed');
  var batchEl = ge('compiler-stdin');
  var batchVal = (isBatchOpen && batchEl && batchEl.value.trim()) ? batchEl.value : '';
  if (batchVal) {
    _interactiveSession.inputs = batchVal.split(/\r?\n/);
  }

  outEl.innerHTML = '<div class="output-running"><span class="run-spinner"></span>Compiling with OpenJDK 22 and running…</div>';
  executeInteractiveStep();
}

function executeInteractiveStep() {
  var runBtn = ge('run-btn');
  if (runBtn) { runBtn.disabled = true; runBtn.textContent = 'Running…'; }
  _interactiveSession.isExecuting = true;

  var stdinPayload = _interactiveSession.inputs.join('\n');
  if (_interactiveSession.inputs.length > 0) stdinPayload += '\n';

  executeJava(_interactiveSession.code, stdinPayload)
    .then(function(data){
      if (runBtn) { runBtn.disabled = false; runBtn.textContent = 'Run Code'; }
      _interactiveSession.isExecuting = false;

      var outEl = ge('output-area');
      var bar = ge('terminal-interactive-bar');
      if (bar) bar.style.display = 'none';

      // 1. Compilation Error
      if (data.compile && data.compile.stderr) {
        _interactiveSession.active = false;
        if (outEl) {
          outEl.innerHTML = '<pre class="output-error" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">[Compilation Error]\n' + esc(data.compile.stderr) + '</pre>';
        }
        var lineMatch = data.compile.stderr.match(/:(\d+): error:/i) || data.compile.stderr.match(/\.java:(\d+):/i);
        if (lineMatch && _cmPlayground) {
          _cmPlayground.setLineError(parseInt(lineMatch[1], 10), data.compile.stderr.split('\n')[0]);
        }
        return;
      }

      // 2. Execution / Service Error
      if (data.error) {
        _interactiveSession.active = false;
        if (outEl) {
          outEl.innerHTML = '<pre class="output-error" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">[Execution Error]\n' + esc(data.error) + '</pre>';
        }
        return;
      }

      var runData = data.run || {};
      var rawStdout = runData.stdout || '';
      var rawStderr = runData.stderr || '';
      var isWaiting = !!runData.waitingForInput;
      var exitCode = typeof runData.code === 'number' ? runData.code : 0;

      _interactiveSession.lastRawStdout = rawStdout;

      renderInterleavedConsole(rawStdout, rawStderr, isWaiting, exitCode);

      if (!isWaiting) {
        _interactiveSession.active = false;
      }

      if (outEl) outEl.scrollTop = outEl.scrollHeight;
    })
    .catch(function(err){
      if (runBtn) { runBtn.disabled = false; runBtn.textContent = 'Run Code'; }
      _interactiveSession.isExecuting = false;
      _interactiveSession.active = false;
      var bar = ge('terminal-interactive-bar');
      if (bar) bar.style.display = 'none';
      var outEl = ge('output-area');
      if (outEl) {
        outEl.innerHTML = '<div class="output-error"><pre style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">[Execution Error]\n' + esc(err.message) + '</pre></div>';
      }
    });
}

function renderInterleavedConsole(rawStdout, rawStderr, isWaiting, exitCode) {
  var outEl = ge('output-area');
  if (!outEl) return;

  var history = _interactiveSession.history;
  var segments = [];
  var lastPos = 0;

  for (var i = 0; i < history.length; i++) {
    var item = history[i];
    var len = item.prefixLen;
    if (len <= rawStdout.length) {
      segments.push({ type: 'output', text: rawStdout.substring(lastPos, len) });
      segments.push({ type: 'input', text: item.input });
      lastPos = len;
    }
  }

  var remaining = rawStdout.substring(lastPos);

  if (isWaiting) {
    var lastNl = remaining.lastIndexOf('\n');
    var body = '';
    var prompt = '';
    if (lastNl !== -1) {
      body = remaining.substring(0, lastNl + 1);
      prompt = remaining.substring(lastNl + 1);
    } else {
      prompt = remaining;
    }
    if (body) segments.push({ type: 'output', text: body });
    _interactiveSession.lastPrompt = prompt;

    var html = '';
    for (var j = 0; j < segments.length; j++) {
      var seg = segments[j];
      if (seg.type === 'output') {
        html += esc(seg.text);
      } else if (seg.type === 'input') {
        html += '<span class="terminal-user-echo">' + esc(seg.text) + '</span>\n';
      }
    }

    var activeLineHtml = '<div class="terminal-active-line" id="terminal-active-line">'
      + '<span class="terminal-active-prompt">' + esc(prompt || '❯ ') + '</span>'
      + '<input type="text" id="terminal-inline-input" class="terminal-inline-input" autofocus autocomplete="off" spellcheck="false" placeholder="Type here and press Enter ↵..." />'
      + '<button id="terminal-inline-btn" class="terminal-inline-btn" title="Send Input (Enter)">↵ Send</button>'
      + '</div>';

    outEl.innerHTML = (html ? '<pre class="output-success" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">' + html + '</pre>' : '')
      + activeLineHtml;

    var inlineInp = ge('terminal-inline-input');
    if (inlineInp) {
      inlineInp.addEventListener('keydown', function(e){
        if (e.key === 'Enter') {
          e.preventDefault();
          submitTerminalInput(this.value);
        }
      });
      inlineInp.focus();
      setTimeout(function(){ if (inlineInp) inlineInp.focus(); }, 15);
      setTimeout(function(){ if (inlineInp) inlineInp.focus(); }, 60);
      setTimeout(function(){ if (inlineInp) inlineInp.focus(); }, 180);
    }

    var inlineBtn = ge('terminal-inline-btn');
    if (inlineBtn) {
      inlineBtn.addEventListener('click', function(e){
        e.preventDefault();
        var inp = ge('terminal-inline-input');
        submitTerminalInput(inp ? inp.value : '');
      });
    }

  } else {
    if (remaining) segments.push({ type: 'output', text: remaining });

    var html = '';
    for (var k = 0; k < segments.length; k++) {
      var s = segments[k];
      if (s.type === 'output') {
        html += esc(s.text);
      } else if (s.type === 'input') {
        html += '<span class="terminal-user-echo">' + esc(s.text) + '</span>\n';
      }
    }

    if (rawStderr) {
      html += (html ? '\n' : '') + '<span class="output-error">' + esc(rawStderr) + '</span>';
    }

    if (!rawStdout.trim() && !rawStderr.trim()) {
      html = '(Program executed successfully with no output.\nUse System.out.println() to print results.)';
    } else {
      html += '\n<span style="color:#71717A;font-style:italic;">\n[Program finished with exit code ' + exitCode + ']</span>';
    }

    var hasErr = !!rawStderr && exitCode !== 0;
    outEl.innerHTML = '<pre class="' + (hasErr ? 'output-error' : 'output-success') + '" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">' + html + '</pre>';
  }

  outEl.scrollTop = outEl.scrollHeight;
}

function submitTerminalInput(overrideVal) {
  if (!_interactiveSession.active || _interactiveSession.isExecuting) return;
  var inlineInp = ge('terminal-inline-input');
  var bottomInp = ge('terminal-input');
  var val = (overrideVal !== undefined) ? overrideVal : (inlineInp ? inlineInp.value : (bottomInp ? bottomInp.value : ''));

  var currentStdout = _interactiveSession.lastRawStdout || '';
  _interactiveSession.history.push({
    prefixLen: currentStdout.length,
    input: val
  });
  _interactiveSession.inputs.push(val);

  if (inlineInp) { inlineInp.value = ''; inlineInp.disabled = true; }
  if (bottomInp) { bottomInp.value = ''; bottomInp.disabled = true; }

  var activeLine = ge('terminal-active-line');
  if (activeLine) {
    activeLine.innerHTML = '<span class="terminal-active-prompt">' + esc(_interactiveSession.lastPrompt || '❯ ') + '</span> '
      + '<span class="terminal-user-echo">' + esc(val) + '</span> '
      + '<span class="run-spinner" style="margin-left:0.5rem"></span>';
  }

  var outEl = ge('output-area');
  if (outEl) outEl.scrollTop = outEl.scrollHeight;

  executeInteractiveStep();
}

/* ═══════════════ XP / LEVELS ════════════════════════════════════ */
function addXP(amount, lessonId) {
  if(!amount) return;
  STATE.player.xp+=amount; showXpFloat(amount);
  var before=STATE.player.level, nx;
  while((nx=getNextLv())&&STATE.player.xp>=nx.xpRequired) STATE.player.level=nx.level;
  if(STATE.player.level>before) triggerLevelUp();
  updateNav(); localSave();
  if (typeof sbAwardXP === 'function') {
    sbAwardXP(lessonId || (_curLesson ? _curLesson.id : 'activity'), amount);
  }
}
function triggerLevelUp(){
  if (window.GameFX) window.GameFX.playLevelUp();var lv=getLv();setText('levelup-new-level','Level '+STATE.player.level);setText('levelup-rank',lv.name);setText('levelup-rank-icon',lv.icon);checkBadge('level_5');checkBadge('level_10');burstParticles('levelup-particles');setTimeout(function(){showModal('modal-levelup');},300);}
function getLv(){if(!window.LEVELS)return{level:1,name:'Novice',xpRequired:0,icon:''};var r=LEVELS[0];for(var i=0;i<LEVELS.length;i++)if(STATE.player.xp>=LEVELS[i].xpRequired)r=LEVELS[i];return r;}
function getNextLv(){if(!window.LEVELS)return null;var cur=getLv();for(var i=0;i<LEVELS.length;i++)if(LEVELS[i].level===cur.level+1)return LEVELS[i];return null;}

function updateNav() {
  if (!STATE || !STATE.player) return;
  var p=STATE.player,lv=getLv(),nx=getNextLv();
  var xs=lv.xpRequired,xe=nx?nx.xpRequired:xs+999;
  var pct=Math.min(100,Math.round((p.xp-xs)/(xe-xs)*100));
  setText('nav-level','Lv.'+p.level);
  setText('nav-xp',p.xp+' XP');setWidth('xp-fill-mini',pct+'%');
  setText('nav-streak',p.streak);renderHearts();
  // Difficulty chip
  var dc=ge('nav-diff-chip');
  if(dc) dc.textContent=(p.difficulty || 'beginner').toUpperCase();
}

/* ═══════════════ STREAK ══════════════════════════════════════════ */
function checkStreak(){
  var today=new Date().toDateString(),p=STATE.player;
  if(!p.lastVisit){p.streak=1;}
  else{var last=new Date(p.lastVisit).toDateString(),yest=new Date();yest.setDate(yest.getDate()-1);
    if(last===today){}
    else if(last===yest.toDateString()){p.streak++;checkBadge('streak_3');checkBadge('streak_7');setTimeout(function(){toast('Day '+p.streak+' streak!');},800);}
    else p.streak=1;}
  p.lastVisit=today; localSave(); updateNav();
}

/* ═══════════════ BADGES (Minecraft Themed) ══════════════════════ */
function checkBadge(condition){
  if(!window.BADGES) return;
  var badge=null; for(var i=0;i<BADGES.length;i++) if(BADGES[i].condition===condition){badge=BADGES[i];break;}
  if(!badge||STATE.player.badges.indexOf(badge.id)!==-1) return;
  STATE.player.badges.push(badge.id);
  sbQueueBadge(badge.id);
  localSave();
  var b=badge;
  var itemKey = BADGE_MINECRAFT_MAP[b.id] || 'wooden_pickaxe';
  var item = MINECRAFT_BADGES[itemKey];
  setTimeout(function(){
    var iconEl = ge('badge-unlocked-icon');
    if (iconEl && item) {
      iconEl.innerHTML = '<div class="modal-minecraft-badge-wrap">' + renderMinecraftSVG(item.grid) + '</div>';
    }
    setText('badge-unlocked-name', b.name + ' • ' + (item ? item.name : ''));
    setText('badge-unlocked-desc', b.description);
    showModal('modal-badge');
  }, 900);
}

function awardBadgeDirect(badgeId){
  if(!window.BADGES || !STATE || !STATE.player) return;
  var badge=null; for(var i=0;i<BADGES.length;i++) if(BADGES[i].id===badgeId){badge=BADGES[i];break;}
  if(!badge||STATE.player.badges.indexOf(badge.id)!==-1) return;
  STATE.player.badges.push(badge.id);
  sbQueueBadge(badge.id);
  localSave();
  var b=badge;
  var itemKey = BADGE_MINECRAFT_MAP[b.id] || 'wooden_pickaxe';
  var item = MINECRAFT_BADGES[itemKey];
  setTimeout(function(){
    var iconEl = ge('badge-unlocked-icon');
    if (iconEl && item) {
      iconEl.innerHTML = '<div class="modal-minecraft-badge-wrap">' + renderMinecraftSVG(item.grid) + '</div>';
    }
    setText('badge-unlocked-name', b.name + ' • ' + (item ? item.name : ''));
    setText('badge-unlocked-desc', b.description);
    showModal('modal-badge');
  }, 600);
}

var _activeBadgeFilter = 'all';

function setBadgeFilter(filter) {
  _activeBadgeFilter = filter || 'all';
  var btns = qsa('.badge-filter-btn');
  btns.forEach(function(b) {
    b.classList.toggle('active', (b.getAttribute('data-filter') || 'all') === _activeBadgeFilter);
  });
  renderBadges();
}

function renderBadges(){
  if(!window.BADGES) return;
  var grid=ge('badges-grid'); if(!grid) return;
  grid.innerHTML=''; 
  var totalCount = BADGES.length;
  var unlockedCount = (STATE && STATE.player && STATE.player.badges) ? STATE.player.badges.length : 0;
  setText('badges-earned-count', unlockedCount + ' / ' + totalCount + ' Medals Unlocked');

  // Wire filter buttons
  var filterBtns = qsa('.badge-filter-btn');
  filterBtns.forEach(function(b) {
    b.onclick = function() {
      setBadgeFilter(this.getAttribute('data-filter'));
    };
  });

  var filteredList = BADGES.filter(function(badge) {
    if (!_activeBadgeFilter || _activeBadgeFilter === 'all') return true;
    var itemKey = BADGE_MINECRAFT_MAP[badge.id] || 'wooden_pickaxe';
    var item = MINECRAFT_BADGES[itemKey] || MINECRAFT_BADGES.wooden_pickaxe;
    return (item.rarity || '').toLowerCase() === _activeBadgeFilter.toLowerCase();
  });

  if (filteredList.length === 0) {
    grid.innerHTML = '<div class="empty-filter-state" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-muted); font-size: 15px;">No medals found in this category.</div>';
    return;
  }

  filteredList.forEach(function(badge){
    var unlocked = STATE.player.badges.indexOf(badge.id) !== -1;
    var itemKey = BADGE_MINECRAFT_MAP[badge.id] || 'wooden_pickaxe';
    var item = MINECRAFT_BADGES[itemKey] || MINECRAFT_BADGES.wooden_pickaxe;
    
    var card = document.createElement('div');
    card.className = 'badge-card ' + (unlocked ? 'unlocked' : 'locked') + ' rarity-' + (item.rarity || 'common').toLowerCase();
    
    var iconInner = unlocked 
      ? renderMinecraftSVG(item.grid) 
      : (window.GameFX 
          ? window.GameFX.renderBadgeSilhouette(renderMinecraftSVG(item.grid), badge.desc)
          : '<div class="minecraft-bedrock-lock">' + renderMinecraftSVG(item.grid) + '</div>');
        
    var rarityHtml = unlocked
      ? '<span class="badge-rarity-pill pill-' + item.rarity.toLowerCase() + '">' + item.rarity + '</span>'
      : '<span class="badge-rarity-pill locked">LOCKED</span>';
      
    card.innerHTML = '<div class="badge-card-top">' + rarityHtml + '</div>'
      + '<div class="badge-icon-box ' + (unlocked ? 'unlocked' : 'locked') + '">'
      + '<div class="badge-minecraft-pixel-wrap">' + iconInner + '</div>'
      + '</div>'
      + '<div class="badge-name">' + (unlocked ? esc(badge.name) : 'Locked Item') + '</div>'
      + '<div class="badge-item-sub">' + (unlocked ? '<span style="color:#FFE600">◆</span> ' + esc(item.name) : 'Mystery Block') + '</div>'
      + '<div class="badge-desc">' + (unlocked ? esc(badge.description) : 'Complete milestone to unlock medal.') + '</div>';
      
    grid.appendChild(card);
  });
}

/* ═══════════════ SETTINGS ════════════════════════════════════════ */
function renderSettings(){
  if(!STATE) return;
  var u=sbCurrentUser();
  setText('settings-email', u?u.email:'—');
  setText('settings-player-name',STATE.player.name);
  setText('settings-difficulty',DIFFICULTY_LABELS[STATE.player.difficulty]||'Beginner');
  updateThemeUI(document.body.classList.contains('dark-theme'));
  updateRefillBtn();
  var sndToggle = ge("settings-sound-toggle"); if (sndToggle && window.GameFX) sndToggle.checked = window.GameFX.isSoundEnabled();
}

// Hearts refill via cooldown (4 hours) — not a free button.
// The refill-hearts-btn in Settings now shows time remaining instead.
var HEART_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
function refillHearts(){
  var p = STATE.player;
  if (p.hearts >= 3) { toast('Your hearts are already full!'); return; }
  var now = Date.now();
  if (p.heartRefillTime && now < p.heartRefillTime) {
    var remaining = Math.ceil((p.heartRefillTime - now) / 60000);
    toast('Hearts refill in ' + remaining + ' min. Complete a practice to earn one back!');
    return;
  }
  // Cooldown elapsed or no cooldown — allow refill
  p.hearts = 3; p.heartRefillTime = null;
  localSave(); renderHearts();
  toast('Hearts refilled!');
}
function updateRefillBtn(){
  var btn = ge('refill-hearts-btn');
  if (!btn) return;
  var p = STATE && STATE.player;
  if (!p) return;
  if (p.hearts >= 3) {
    btn.innerHTML = 'Hearts Full <svg viewBox="0 0 16 16" width="14" height="14" fill="#EF4444" style="vertical-align:-1px;margin-left:4px;"><path d="M8 14s-5.5-3.5-5.5-7.5A3.5 3.5 0 0 1 8 4.2 3.5 3.5 0 0 1 13.5 6.5C13.5 10.5 8 14 8 14z"/></svg>'; btn.disabled = true;
  } else {
    var now = Date.now();
    if (p.heartRefillTime && now < p.heartRefillTime) {
      var mins = Math.ceil((p.heartRefillTime - now) / 60000);
      btn.textContent = 'Refill in ' + mins + ' min'; btn.disabled = true;
    } else {
      btn.innerHTML = 'Claim Refill <svg viewBox="0 0 16 16" width="14" height="14" fill="#EF4444" style="vertical-align:-1px;margin-left:4px;"><path d="M8 14s-5.5-3.5-5.5-7.5A3.5 3.5 0 0 1 8 4.2 3.5 3.5 0 0 1 13.5 6.5C13.5 10.5 8 14 8 14z"/></svg>'; btn.disabled = false;
    }
  }
}

function resetProgress(){
  var name=STATE.player.name, diff=STATE.player.difficulty;
  STATE=freshState(name,diff,0);
  localSave();hideModal('modal-reset');renderAllAvatars();updateNav();showScreen('home');
  toast('Progress reset. Fresh start!');
}

function deleteAccount() {
  var confirmBtn = ge('delete-account-confirm-btn');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting Account...';
  }

  var deleteCloudPromise = (typeof sbDeleteAccount === 'function') ? sbDeleteAccount() : Promise.resolve();

  deleteCloudPromise
    .then(function() {
      try {
        localStorage.removeItem('javaquest_state');
        localStorage.removeItem('javaquest_session');
        localStorage.removeItem('javaquest_guest');
        localStorage.removeItem('javaquest_active_capstone');
        localStorage.removeItem('jq_last_skin');
      } catch(e) {}

      if (typeof freshState === 'function') {
        STATE = freshState('JavaLearner', 'beginner', 0);
      } else {
        STATE = {
          player: {
            name: 'JavaLearner',
            difficulty: 'beginner',
            level: 1,
            xp: 0,
            hearts: 3,
            streak: 1,
            lastVisit: new Date().toDateString(),
            avatar: { skin: 0, hair: 0, hairColor: 0, outfit: 0, accessory: 0 },
            completedLessons: [],
            completedChallenges: [],
            completedModules: [],
            completedCoding: [],
            codingAttempts: {},
            badges: [],
            capstoneProjects: {}
          }
        };
      }

      hideModal('modal-delete-account');
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Yes, Permanently Delete';
      }

      toast('Your account and all progress have been permanently deleted.');

      var suName = ge('su-name'); if (suName) suName.value = '';
      var suEmail = ge('su-email'); if (suEmail) suEmail.value = '';
      var suPass = ge('su-password'); if (suPass) suPass.value = '';
      var siEmail = ge('si-email'); if (siEmail) siEmail.value = '';
      var siPass = ge('si-password'); if (siPass) siPass.value = '';

      var suTab = ge('tab-signup');
      if (suTab) suTab.click();
      showScreen('auth');
      updateNav();
    })
    .catch(function(err) {
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Yes, Permanently Delete';
      }
      toast('Error deleting account: ' + ((err && err.message) || 'Please try again'));
    });
}

/* ═══════════════ RESIZABLE WORKSPACES (LEETCODE / IDE STYLE) ════ */
function initResizableWorkspaces() {
  // ── 1. Coding Workspace: Horizontal Split (Instructions vs Editor) ──
  var codingGutterH = ge('coding-resizer-h');
  var codingWorkspace = ge('coding-workspace');
  var codingInstructions = ge('coding-instructions');

  if (codingGutterH && codingWorkspace && codingInstructions) {
    var savedH = localStorage.getItem('jq_coding_split_w');
    if (savedH && window.innerWidth > 900) {
      var pct = parseFloat(savedH);
      if (pct >= 20 && pct <= 75) {
        codingInstructions.style.flex = '0 0 ' + pct + '%';
      }
    }

    function startDragH(clientX) {
      document.body.classList.add('is-resizing', 'is-resizing-h');
      codingGutterH.classList.add('dragging');

      function onMove(cx) {
        var rect = codingWorkspace.getBoundingClientRect();
        if (rect.width <= 0) return;
        var offset = cx - rect.left;
        var percent = (offset / rect.width) * 100;
        if (percent < 20) percent = 20;
        if (percent > 75) percent = 75;
        codingInstructions.style.flex = '0 0 ' + percent + '%';
        try { localStorage.setItem('jq_coding_split_w', percent.toFixed(1)); } catch(e){}
      }

      function onMouseMove(ev) { onMove(ev.clientX); }
      function onMouseUp() {
        document.body.classList.remove('is-resizing', 'is-resizing-h');
        codingGutterH.classList.remove('dragging');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      function onTouchMove(ev) {
        if (ev.touches && ev.touches[0]) onMove(ev.touches[0].clientX);
      }
      function onTouchEnd() {
        document.body.classList.remove('is-resizing', 'is-resizing-h');
        codingGutterH.classList.remove('dragging');
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', onTouchEnd);
    }

    codingGutterH.addEventListener('mousedown', function(e){
      if (window.innerWidth <= 900) return;
      e.preventDefault();
      startDragH(e.clientX);
    });
    codingGutterH.addEventListener('touchstart', function(e){
      if (window.innerWidth <= 900 || !e.touches || !e.touches[0]) return;
      startDragH(e.touches[0].clientX);
    });
  }

  // ── 2. Coding Workspace: Vertical Split (Editor vs Test Results) ──
  var codingGutterV = ge('coding-resizer-v');
  var codingEditor = ge('coding-editor');
  var codingExpandBtn = ge('coding-expand-btn');
  var testToggleHeader = ge('test-results-toggle-header');
  var testPanel = ge('test-results-panel');
  var testCollapseIcon = ge('test-collapse-icon');

  if (codingExpandBtn && codingEditor) {
    var isTall = localStorage.getItem('jq_coding_editor_tall') === 'true';
    if (isTall) {
      codingEditor.classList.add('editor-tall');
      codingExpandBtn.textContent = 'Standard View';
    }

    codingExpandBtn.addEventListener('click', function(){
      var nowTall = codingEditor.classList.toggle('editor-tall');
      codingExpandBtn.textContent = nowTall ? 'Standard View' : 'Expand Editor';
      try { localStorage.setItem('jq_coding_editor_tall', nowTall); } catch(e){}
    });
  }

  if (testToggleHeader && testPanel) {
    testToggleHeader.addEventListener('click', function(e){
      if (e.target.closest('button')) return;
      var isCollapsed = testPanel.classList.toggle('collapsed');
      if (testCollapseIcon) testCollapseIcon.innerHTML = isCollapsed ? '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="2 8 6 4 10 8"/></svg>' : '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="2 4 6 8 10 4"/></svg>';
    });
  }

  if (codingGutterV && codingEditor) {
    var savedV = localStorage.getItem('jq_coding_editor_h');
    if (!codingEditor.classList.contains('editor-tall')) {
      if (savedV) {
        var h = parseInt(savedV, 10);
        codingEditor.style.height = (h >= 300 && h <= 900 ? h : 440) + 'px';
      } else {
        codingEditor.style.height = '440px';
      }
    }

    function startDragV(clientY) {
      document.body.classList.add('is-resizing', 'is-resizing-v');
      codingGutterV.classList.add('dragging');
      if (codingEditor.classList.contains('editor-tall')) {
        codingEditor.classList.remove('editor-tall');
        if (codingExpandBtn) codingExpandBtn.textContent = 'Expand Editor';
        try { localStorage.setItem('jq_coding_editor_tall', false); } catch(e){}
      }
      var startY = clientY;
      var startH = codingEditor.getBoundingClientRect().height;

      function onMove(cy) {
        var delta = cy - startY;
        var newH = startH + delta;
        if (newH < 280) newH = 280;
        if (newH > 880) newH = 880;
        codingEditor.style.height = newH + 'px';
        try { localStorage.setItem('jq_coding_editor_h', newH); } catch(e){}
      }

      function onMouseMove(ev) { onMove(ev.clientY); }
      function onMouseUp() {
        document.body.classList.remove('is-resizing', 'is-resizing-v');
        codingGutterV.classList.remove('dragging');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      function onTouchMove(ev) {
        if (ev.touches && ev.touches[0]) onMove(ev.touches[0].clientY);
      }
      function onTouchEnd() {
        document.body.classList.remove('is-resizing', 'is-resizing-v');
        codingGutterV.classList.remove('dragging');
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', onTouchEnd);
    }

    codingGutterV.addEventListener('mousedown', function(e){
      e.preventDefault();
      startDragV(e.clientY);
    });
    codingGutterV.addEventListener('touchstart', function(e){
      if (!e.touches || !e.touches[0]) return;
      startDragV(e.touches[0].clientY);
    });
  }

  // ── 3. Playground / Compiler: Horizontal Split (Editor vs Output) ──
  var compilerGutterH = ge('compiler-resizer-h');
  var compilerLayout = ge('compiler-layout');
  var compilerEditorPanel = ge('compiler-editor-panel');

  if (compilerGutterH && compilerLayout && compilerEditorPanel) {
    var savedCompH = localStorage.getItem('jq_compiler_split_w');
    if (savedCompH && window.innerWidth > 900) {
      var pctComp = parseFloat(savedCompH);
      if (pctComp >= 25 && pctComp <= 75) {
        compilerEditorPanel.style.flex = '0 0 ' + pctComp + '%';
      }
    }

    function startDragCompH(clientX) {
      document.body.classList.add('is-resizing', 'is-resizing-h');
      compilerGutterH.classList.add('dragging');

      function onMove(cx) {
        var rect = compilerLayout.getBoundingClientRect();
        if (rect.width <= 0) return;
        var offset = cx - rect.left;
        var percent = (offset / rect.width) * 100;
        if (percent < 25) percent = 25;
        if (percent > 75) percent = 75;
        compilerEditorPanel.style.flex = '0 0 ' + percent + '%';
        try { localStorage.setItem('jq_compiler_split_w', percent.toFixed(1)); } catch(e){}
      }

      function onMouseMove(ev) { onMove(ev.clientX); }
      function onMouseUp() {
        document.body.classList.remove('is-resizing', 'is-resizing-h');
        compilerGutterH.classList.remove('dragging');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      function onTouchMove(ev) {
        if (ev.touches && ev.touches[0]) onMove(ev.touches[0].clientX);
      }
      function onTouchEnd() {
        document.body.classList.remove('is-resizing', 'is-resizing-h');
        compilerGutterH.classList.remove('dragging');
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', onTouchEnd);
    }

    compilerGutterH.addEventListener('mousedown', function(e){
      if (window.innerWidth <= 900) return;
      e.preventDefault();
      startDragCompH(e.clientX);
    });
    compilerGutterH.addEventListener('touchstart', function(e){
      if (window.innerWidth <= 900 || !e.touches || !e.touches[0]) return;
      startDragCompH(e.touches[0].clientX);
    });
  }
}

/* ═══════════════ WIRE ALL EVENTS ════════════════════════════════ */

/* ═════════════════════════════════════════════════════════════════
   PHASE 2: CODÉDEX SPLIT-SCREEN LESSON & CODEMIRROR 6 ENGINE
   ═════════════════════════════════════════════════════════════════ */

var _cmPlayground = null;
var _cmCoding = null;
var _cmLesson = null;
var _activeConsoleTab = 'terminal';
var _activeMobileTab = 'guide';
var _unlockedHints = [false, false, false];
var _lessonAttempts = 0;

function initCodeMirrorEditors() {
  if (typeof window.JavaEditor === 'undefined') {
    console.warn('[Editor] window.JavaEditor bundle not loaded yet.');
    return;
  }

  var isDark = document.body.classList.contains('dark-theme');

  // 1. Code Playground Editor
  var cmPlayMount = ge('cm-code-editor');
  var origPlayArea = ge('code-editor');
  if (cmPlayMount && !_cmPlayground) {
    var initialCode = origPlayArea ? origPlayArea.value : '';
    if (!initialCode.trim()) {
      initialCode = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, JavaQuest!");\n    }\n}';
    }
    _cmPlayground = window.JavaEditor.create(cmPlayMount, {
      initialCode: initialCode,
      isDark: isDark,
      onChange: function(val) {
        if (origPlayArea) origPlayArea.value = val;
      },
      onRun: function() {
        runCode();
      }
    });
    if (origPlayArea) origPlayArea.value = initialCode;
  }

  // 2. Coding Challenge Editor
  var cmCodingMount = ge('cm-coding-editor');
  var origCodingArea = ge('coding-editor');
  if (cmCodingMount && !_cmCoding) {
    _cmCoding = window.JavaEditor.create(cmCodingMount, {
      initialCode: origCodingArea ? origCodingArea.value : '',
      isDark: isDark,
      onChange: function(val) {
        if (origCodingArea) origCodingArea.value = val;
      },
      onRun: function() {
        var submitBtn = ge('coding-submit-btn');
        if (submitBtn) submitBtn.click();
      }
    });
  }

  // 3. Split-Screen Lesson Editor
  var cmLessonMount = ge('cm-lesson-editor');
  var origLessonArea = ge('lesson-code-editor');
  if (cmLessonMount && !_cmLesson) {
    _cmLesson = window.JavaEditor.create(cmLessonMount, {
      initialCode: origLessonArea ? origLessonArea.value : '',
      isDark: isDark,
      onChange: function(val) {
        if (origLessonArea) origLessonArea.value = val;
      },
      onRun: function() {
        runLessonCode();
      }
    });
  }
}
window.initCodeMirrorEditors = initCodeMirrorEditors;

// Synchronize dark/light theme across all active CodeMirror instances
function syncEditorThemes(isDark) {
  if (_cmPlayground) _cmPlayground.setTheme(isDark);
  if (_cmCoding) _cmCoding.setTheme(isDark);
  if (_cmLesson) _cmLesson.setTheme(isDark);
}
window.syncEditorThemes = syncEditorThemes;

// ── Helpers to get/set code cleanly across editors ─────────────────────────
function getEditorCode(editorType) {
  if (editorType === 'playground') {
    return _cmPlayground ? _cmPlayground.getValue() : (ge('code-editor') ? ge('code-editor').value : '');
  }
  if (editorType === 'coding') {
    return _cmCoding ? _cmCoding.getValue() : (ge('coding-editor') ? ge('coding-editor').value : '');
  }
  if (editorType === 'lesson') {
    return _cmLesson ? _cmLesson.getValue() : (ge('lesson-code-editor') ? ge('lesson-code-editor').value : '');
  }
  return '';
}

function setEditorCode(editorType, code) {
  var str = String(code || '');
  if (editorType === 'playground') {
    if (_cmPlayground) _cmPlayground.setValue(str);
    var el = ge('code-editor'); if (el) el.value = str;
  } else if (editorType === 'coding') {
    if (_cmCoding) _cmCoding.setValue(str);
    var el2 = ge('coding-editor'); if (el2) el2.value = str;
  } else if (editorType === 'lesson') {
    if (_cmLesson) _cmLesson.setValue(str);
    var el3 = ge('lesson-code-editor'); if (el3) el3.value = str;
  }
}

// ── Codédex Split-Screen Lesson Engine ────────────────────────────────────
var _maxUnlockedStep = 0;
var _stepCheckpointsPassed = {};
var _stepTestsPassed = {};

function startLesson(modId, lessonId, initialStep) {
  var mod = getMod(modId);
  if (!mod) { toast('Module not found!'); return; }
  var lesson = null;
  for (var i = 0; i < mod.lessons.length; i++) {
    if (mod.lessons[i].id === lessonId) { lesson = mod.lessons[i]; break; }
  }
  if (!lesson) { toast('Lesson not found!'); return; }

  _curMod = mod;
  _curLesson = lesson;
  _slideIdx = (typeof initialStep === 'number' && initialStep >= 0 && initialStep < lesson.slides.length) ? initialStep : 0;
  _unlockedHints = [false, false, false];
  _lessonAttempts = 0;
  _stepCheckpointsPassed = {};
  _stepTestsPassed = {};

  var isCompleted = (getPlayerState().completedLessons || []).indexOf(lesson.id) !== -1;
  _maxUnlockedStep = isCompleted ? (lesson.slides.length - 1) : Math.max(_slideIdx, 0);

  // Persist session to resume later
  try {
    localStorage.setItem('javaquest_last_lesson', JSON.stringify({
      modId: modId,
      lessonId: lessonId,
      stepIdx: _slideIdx,
      timestamp: Date.now()
    }));
  } catch(e) {}

  // Deep link hash update
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', '#lesson/' + modId + '/' + lessonId + '/' + (_slideIdx + 1));
  }

  // Header meta tags
  var biomeNames = {
    beginner: 'Overworld',
    intermediate: 'The Nether',
    advanced: 'The End'
  };
  setText('lesson-biome-tag', biomeNames[mod.level] || 'Overworld');
  setText('lesson-module-tag', mod.title);
  setText('lesson-title', lesson.title);
  setText('lesson-xp-badge', '+' + lesson.xp + ' XP');

  if (typeof updateChatContext === 'function') updateChatContext(mod.title);

  renderSplitLesson();
  showScreen('lesson');

  // Ensure CodeMirror is initialized and sized properly
  setTimeout(function() {
    initCodeMirrorEditors();
    if (_cmLesson) _cmLesson.focus();
  }, 100);
}

function updateStepPills() {
  if (!_curMod || !_curLesson) return;
  var strip = ge('lesson-steps-strip');
  if (!strip) return;
  var total = _curLesson.slides.length;
  strip.innerHTML = '';

  for (var s = 0; s < total; s++) {
    var stepPill = document.createElement('button');
    var isDone = (getPlayerState().completedLessons || []).indexOf(_curLesson.id) !== -1 || _stepTestsPassed[s] || s < _slideIdx;
    var isUnlocked = isDone || s <= _maxUnlockedStep;

    var cls = 'step-pill';
    if (s === _slideIdx) cls += ' active';
    else if (isDone) cls += ' completed';
    else if (!isUnlocked) cls += ' locked';

    stepPill.className = cls;
    stepPill.textContent = (s + 1);
    stepPill.setAttribute('type', 'button');
    stepPill.setAttribute('data-step', s);
    stepPill.setAttribute('aria-label', 'Step ' + (s + 1) + ': ' + (_curLesson.slides[s].title || '') + (isUnlocked ? '' : ' (Locked)'));

    if (isUnlocked) {
      stepPill.title = 'Step ' + (s + 1) + ': ' + (_curLesson.slides[s].title || '');
      stepPill.onclick = function() {
        var targetStep = parseInt(this.getAttribute('data-step'), 10);
        _slideIdx = targetStep;
        renderSplitLesson();
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#lesson/' + _curMod.id + '/' + _curLesson.id + '/' + (_slideIdx + 1));
        }
      };
    } else {
      stepPill.disabled = true;
      stepPill.title = 'Complete previous steps to unlock Step ' + (s + 1);
    }
    strip.appendChild(stepPill);
  }
}

function renderSplitLesson() {
  if (!_curMod || !_curLesson) return;
  var slide = _curLesson.slides[_slideIdx];
  var total = _curLesson.slides.length;
  if (!slide) return;

  // 1. Top Steps Strip
  updateStepPills();

  // 2. Story Hook
  var storyCard = ge('lesson-story-card');
  var storyText = ge('story-text');
  if (storyCard && storyText) {
    var story = _curLesson.story || (_curMod.title + ' • Step ' + (_slideIdx + 1));
    storyText.textContent = story;
  }

  // 3. Explanation Slide Area
  var slideArea = ge('slide-area');
  if (slideArea) {
    var typeLabel = { intro: 'Concept Overview', code: 'Code Walkthrough', tip: 'Expert Tip', visual: 'Architecture' }[slide.type] || 'Concept';
    var html = '<div class="slide slide-type-' + (slide.type || 'intro') + '">'
      + '<div class="slide-inner">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">'
      + '<span class="slide-type-badge">' + typeLabel + '</span>'
      + '<button class="btn-deep-dive" onclick="openDeepDive()" aria-label="Open AI Deep Dive modal">AI Deep Dive</button>'
      + '</div>'
      + '<h2 class="slide-title">' + esc(slide.title) + '</h2>'
      + '<div class="slide-content">' + fmt(slide.content) + '</div>';
    if (slide.code) html += buildCodeBlock(slide.code);
    if (slide.type === 'tip') {
      html += '<div class="tip-box"><span class="tip-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path></svg></span><div class="tip-text">' + fmt(slide.content) + '</div></div>';
    }
    html += '</div>';
    if (slide.visual) html += '<div class="visual-area" id="vis-now"></div>';
    html += '</div>';
    slideArea.innerHTML = html;
    if (slide.visual) setTimeout(function() { renderVis(slide); }, 80);
  }

  // 4. Inline Checkpoint (Concept check before code)
  var checkpointCard = ge('lesson-checkpoint-card');
  var checkpointQuestion = ge('checkpoint-question');
  var checkpointOptions = ge('checkpoint-options');
  var checkpointFeedback = ge('checkpoint-feedback');

  var currentCheckpoint = null;
  if (_curLesson.checkpoint && _curLesson.checkpoint.length > 0) {
    if (_curLesson.checkpoint[_slideIdx]) {
      currentCheckpoint = _curLesson.checkpoint[_slideIdx];
    } else if (_slideIdx === 0 && _curLesson.checkpoint[0]) {
      currentCheckpoint = _curLesson.checkpoint[0];
    }
  }

  if (currentCheckpoint && checkpointCard && checkpointQuestion && checkpointOptions) {
    checkpointCard.classList.remove('hidden');
    checkpointQuestion.textContent = currentCheckpoint.question;
    checkpointOptions.innerHTML = '';
    if (checkpointFeedback) {
      checkpointFeedback.classList.add('hidden');
      checkpointFeedback.textContent = '';
      checkpointFeedback.className = 'checkpoint-feedback hidden';
    }

    var answered = _stepCheckpointsPassed[_slideIdx];

    currentCheckpoint.options.forEach(function(optText, optIdx) {
      var btn = document.createElement('button');
      btn.className = 'checkpoint-option-btn';
      btn.setAttribute('data-idx', optIdx);
      btn.setAttribute('type', 'button');
      btn.innerHTML = '<strong>' + 'ABCD'[optIdx] + '.</strong> ' + esc(optText);

      if (answered) {
        if (optIdx === currentCheckpoint.answer) {
          btn.classList.add('correct');
        }
        btn.disabled = true;
      } else {
        btn.onclick = function() {
          var chosen = parseInt(this.getAttribute('data-idx'), 10);
          var isCorrect = chosen === currentCheckpoint.answer;
          qsa('.checkpoint-option-btn').forEach(function(b) { b.disabled = true; });

          if (isCorrect) {
            this.classList.add('correct');
            _stepCheckpointsPassed[_slideIdx] = true;
            _maxUnlockedStep = Math.max(_maxUnlockedStep, _slideIdx + 1);
            if (checkpointFeedback) {
              checkpointFeedback.textContent = '✓ Correct! Great job understanding this concept.';
              checkpointFeedback.className = 'checkpoint-feedback correct';
              checkpointFeedback.classList.remove('hidden');
            }
            if (window.GameFX && window.GameFX.playBlockBreak) window.GameFX.playBlockBreak();
            updateStepPills();
          } else {
            this.classList.add('wrong');
            var correctBtn = qsa('.checkpoint-option-btn')[currentCheckpoint.answer];
            if (correctBtn) correctBtn.classList.add('correct');
            if (checkpointFeedback) {
              checkpointFeedback.textContent = '✗ Not quite. The correct answer is ' + 'ABCD'[currentCheckpoint.answer] + '. Review the concept above!';
              checkpointFeedback.className = 'checkpoint-feedback wrong';
              checkpointFeedback.classList.remove('hidden');
            }
            if (window.GameFX && window.GameFX.playGentleOops) window.GameFX.playGentleOops();
          }
        };
      }
      checkpointOptions.appendChild(btn);
    });

    if (answered && checkpointFeedback) {
      checkpointFeedback.textContent = '✓ Checkpoint passed!';
      checkpointFeedback.className = 'checkpoint-feedback correct';
      checkpointFeedback.classList.remove('hidden');
    }
  } else if (checkpointCard) {
    checkpointCard.classList.add('hidden');
  }

  // 5. Exercise Prompt & Starter Code
  var exerciseBox = ge('lesson-exercise-box');
  var exerciseInstructions = ge('exercise-instructions');
  var starterCode = slide.code || _curLesson.starterCode || 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}';

  if (exerciseBox && exerciseInstructions) {
    var taskDesc = slide.instructions || ('Practice writing the Java code for **' + esc(slide.title) + '**. Run your code or submit to verify tests!');
    exerciseInstructions.innerHTML = fmt(taskDesc);
  }

  // Populate editor with starter code if empty or step changed
  setEditorCode('lesson', starterCode);

  // 6. 3-Tier Progressive Hints Setup
  setupLessonHints(slide);

  // 7. Navigation Buttons
  var prevBtn = ge('btn-prev-slide');
  var nextBtn = ge('btn-next-slide');
  if (prevBtn) {
    prevBtn.style.visibility = (_slideIdx === 0 ? 'hidden' : 'visible');
    prevBtn.onclick = function() {
      if (_slideIdx > 0) {
        _slideIdx--;
        renderSplitLesson();
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#lesson/' + _curMod.id + '/' + _curLesson.id + '/' + (_slideIdx + 1));
        }
      }
    };
  }
  if (nextBtn) {
    var isLast = _slideIdx === total - 1;
    nextBtn.textContent = isLast ? 'Finish Lesson' : 'Next Step →';
    nextBtn.onclick = function() {
      if (isLast) {
        var isDone = (getPlayerState().completedLessons || []).indexOf(_curLesson.id) !== -1 || _stepTestsPassed[_slideIdx];
        if (isDone) {
          finishLesson();
        } else {
          toast('Run "Submit & Test" to pass verification before finishing!');
        }
        return;
      }

      var hasTests = slide.tests && slide.tests.length > 0;
      var hasPassed = _stepTestsPassed[_slideIdx] || (getPlayerState().completedLessons || []).indexOf(_curLesson.id) !== -1;
      var hasCheckpoint = _curLesson.checkpoint && _curLesson.checkpoint[_slideIdx];
      var checkpointPassed = _stepCheckpointsPassed[_slideIdx];

      if (hasCheckpoint && !checkpointPassed && !hasPassed) {
        toast('Answer the Quick Concept Check above to advance!');
        return;
      }

      if (hasTests && !hasPassed) {
        toast('Run "Submit & Test" to pass the test cases before advancing!');
        return;
      }

      _slideIdx++;
      _maxUnlockedStep = Math.max(_maxUnlockedStep, _slideIdx);
      renderSplitLesson();
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#lesson/' + _curMod.id + '/' + _curLesson.id + '/' + (_slideIdx + 1));
      }
    };
  }
}

function setupLessonHints(slide) {
  _unlockedHints = [false, false, false];
  var rawHints = slide.hints || [
    'Think about the types involved. Does your method signature match?',
    'Double check standard syntax: semicolon at the end of statements and matching braces { }.',
    'Review the code example above — notice how variables and methods are declared.'
  ];

  for (var i = 1; i <= 3; i++) {
    var contentEl = ge('hint-tier-' + i + '-content');
    var btn = ge('hint-tier-' + i + '-btn');
    if (contentEl) {
      contentEl.textContent = rawHints[i - 1] || 'Review the lesson explanation carefully.';
      contentEl.classList.add('hidden');
    }
    if (btn) {
      btn.disabled = (i > 1);
      btn.classList.remove('unlocked');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  var counter = ge('hints-counter');
  if (counter) counter.textContent = '0/3 Hints Unlocked';

  var unlockSolBtn = ge('btn-unlock-solution');
  if (unlockSolBtn) unlockSolBtn.classList.add('hidden');
  var solBox = ge('solution-revealed-box');
  if (solBox) solBox.classList.add('hidden');
}

function revealLessonHint(tier) {
  var contentEl = ge('hint-tier-' + tier + '-content');
  var btn = ge('hint-tier-' + tier + '-btn');
  if (!contentEl) return;

  var isHidden = contentEl.classList.contains('hidden');
  if (isHidden) {
    contentEl.classList.remove('hidden');
    _unlockedHints[tier - 1] = true;
    if (btn) {
      btn.classList.add('unlocked');
      btn.setAttribute('aria-expanded', 'true');
    }

    // Unlock next tier button
    if (tier < 3) {
      var nextBtn = ge('hint-tier-' + (tier + 1) + '-btn');
      if (nextBtn) nextBtn.disabled = false;
    } else {
      // All 3 hints unlocked — show solution unlock button
      var unlockSolBtn = ge('btn-unlock-solution');
      if (unlockSolBtn) unlockSolBtn.classList.remove('hidden');
    }

    var count = _unlockedHints.filter(Boolean).length;
    var counter = ge('hints-counter');
    if (counter) counter.textContent = count + '/3 Hints Unlocked';
  } else {
    contentEl.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}
window.revealLessonHint = revealLessonHint;

function unlockLessonSolution() {
  var p = STATE.player;
  if (_lessonAttempts < 1) {
    toast('Make at least 1 real attempt with "Run Code" before unlocking the full solution!');
    return;
  }

  if (p.xp < 25 && p.hearts < 1) {
    toast('Not enough XP or hearts to unlock solution!');
    return;
  }

  if (p.xp >= 25) {
    p.xp -= 25;
    toast('Solution unlocked (-25 XP)');
  } else {
    p.hearts--;
    toast('Solution unlocked (-1 Heart)');
  }
  localSave();
  updateNav();

  var solBox = ge('solution-revealed-box');
  var solPre = ge('solution-code-pre');
  var slide = _curLesson.slides[_slideIdx];
  var solution = slide.solution || slide.code || '// Solution matches the code example provided in the lesson';
  if (solBox && solPre) {
    solPre.textContent = solution;
    solBox.classList.remove('hidden');
  }
}
window.unlockLessonSolution = unlockLessonSolution;

function resetLessonCode() {
  if (!_curLesson) return;
  var slide = _curLesson.slides[_slideIdx];
  var starterCode = slide.code || _curLesson.starterCode || 'public class Main {\n    public static void main(String[] args) {\n    }\n}';
  setEditorCode('lesson', starterCode);
  toast('Code reset to starter template.');
}
window.resetLessonCode = resetLessonCode;

// ── Running Lesson Code & Interactive Terminal ────────────────────────────

function runLessonCode() {
  var code = getEditorCode('lesson').trim();
  if (!code) { toast('Please write some Java code first!'); return; }
  _lessonAttempts++;

  switchConsoleTab('terminal');
  var outEl = ge('lesson-terminal-out');
  var bar = ge('lesson-terminal-bar');
  if (bar) bar.style.display = 'none';

  if (outEl) {
    outEl.innerHTML = '<div class="output-running"><span class="run-spinner"></span>Compiling with OpenJDK 22 and running…</div>';
  }

  if (_cmLesson) _cmLesson.clearErrors();

  executeJava(code, '')
    .then(function(data) {
      if (!outEl) return;
      // 1. Compilation Error
      if (data.compile && data.compile.stderr) {
        outEl.innerHTML = '<pre class="output-error" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">[Compilation Error]\n' + esc(data.compile.stderr) + '</pre>';
        // Parse line error for editor squiggle
        var lineMatch = data.compile.stderr.match(/:(\d+): error:/i) || data.compile.stderr.match(/\.java:(\d+):/i);
        if (lineMatch && _cmLesson) {
          _cmLesson.setLineError(parseInt(lineMatch[1], 10), data.compile.stderr.split('\n')[0]);
        }
        return;
      }

      // 2. Waiting for Scanner input
      if (data.run && data.run.waitingForInput) {
        outEl.innerHTML = '<pre class="output-success" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">' + esc(data.run.stdout || '') + '</pre>';
        if (bar) {
          bar.style.display = 'flex';
          var input = ge('lesson-terminal-input');
          if (input) { input.value = ''; input.focus(); }
        }
        return;
      }

      // 3. Normal Execution output
      var hasErr = (data.run && data.run.code !== 0 && data.run.stderr);
      outEl.innerHTML = '<pre class="' + (hasErr ? 'output-error' : 'output-success') + '" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">'
        + esc(data.run.stdout || '')
        + (hasErr ? ('\n[Runtime Error]\n' + esc(data.run.stderr)) : '')
        + '</pre>';
    })
    .catch(function(err) {
      if (outEl) outEl.innerHTML = '<pre class="output-error">[Execution Failed]\n' + esc(err.message) + '</pre>';
    });
}
window.runLessonCode = runLessonCode;

function sendLessonTerminalInput() {
  var input = ge('lesson-terminal-input');
  if (!input) return;
  var val = input.value;
  var code = getEditorCode('lesson');
  var outEl = ge('lesson-terminal-out');
  var bar = ge('lesson-terminal-bar');
  if (bar) bar.style.display = 'none';

  if (outEl) {
    outEl.innerHTML += '<div style="color:#FFE600;font-weight:bold;">❯ ' + esc(val) + '</div>';
  }

  executeJava(code, val + '\n')
    .then(function(data) {
      if (!outEl) return;
      var outText = (data.run ? data.run.stdout : '') || '';
      outEl.innerHTML = '<pre class="output-success" style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">' + esc(outText) + '</pre>';
    });
}
window.sendLessonTerminalInput = sendLessonTerminalInput;

function clearLessonConsole() {
  var outEl = ge('lesson-terminal-out');
  if (outEl) {
    outEl.innerHTML = '<div class="terminal-idle-state" onclick="runLessonCode()"><span class="terminal-idle-icon">❯</span><span class="terminal-idle-text">Console cleared.</span></div>';
  }
}
window.clearLessonConsole = clearLessonConsole;

// ── Deterministic Test Runner & Diff Viewer ───────────────────────────────

function submitLessonTests() {
  var code = getEditorCode('lesson').trim();
  if (!code) { toast('Write your solution before submitting!'); return; }
  _lessonAttempts++;

  switchConsoleTab('tests');
  var diffList = ge('lesson-test-diff-list');
  if (!diffList) return;
  diffList.innerHTML = '<div class="test-placeholder"><span class="run-spinner"></span>Running deterministic test cases against OpenJDK 22…</div>';

  var slide = _curLesson.slides[_slideIdx];
  var tests = (slide && slide.tests && slide.tests.length) ? slide.tests : [
    { name: 'Output Verification', stdin: '', expected: (slide && slide.expected) || '' }
  ];

  if (_cmLesson) _cmLesson.clearErrors();

  var results = [];
  var promiseChain = Promise.resolve();

  tests.forEach(function(t) {
    promiseChain = promiseChain.then(function() {
      return executeJava(code, (t.stdin != null ? String(t.stdin) : '')).then(function(res) {
        results.push({ test: t, res: res });
      });
    });
  });

  promiseChain.then(function() {
    var firstCompileErr = null;
    for (var i = 0; i < results.length; i++) {
      if (results[i].res.compile && results[i].res.compile.stderr) {
        firstCompileErr = results[i].res.compile.stderr;
        break;
      }
    }

    if (firstCompileErr) {
      diffList.innerHTML = '<div class="diff-card fail">'
        + '<div class="diff-card-header"><span class="diff-test-name">Compilation Check</span><span class="diff-test-status">FAILED</span></div>'
        + '<pre class="output-error" style="margin:0;font-size:0.8rem;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;">' + esc(firstCompileErr) + '</pre>'
        + '</div>';
      var lineMatch = firstCompileErr.match(/:(\d+): error:/i) || firstCompileErr.match(/\.java:(\d+):/i);
      if (lineMatch && _cmLesson) {
        _cmLesson.setLineError(parseInt(lineMatch[1], 10), firstCompileErr.split('\n')[0]);
      }
      return;
    }

    var allPassed = true;
    var cardsHtml = '';
    var passCount = 0;

    results.forEach(function(r, idx) {
      var t = r.test;
      var stdout = (r.res.run ? r.res.run.stdout : '').trim();
      var expected = String(t.expected || '').trim();
      var isPass = (!expected) || (stdout === expected) || (stdout.includes(expected));
      if (isPass) passCount++;
      else allPassed = false;

      cardsHtml += '<div class="diff-card ' + (isPass ? 'pass' : 'fail') + '">'
        + '<div class="diff-card-header">'
        + '<span class="diff-test-name">Test ' + (idx + 1) + ': ' + esc(t.name || 'Output Verification') + '</span>'
        + '<span class="diff-test-status">' + (isPass ? 'PASSED' : 'FAILED') + '</span>'
        + '</div>'
        + '<div class="diff-comparison-grid">'
        + '<div class="diff-box"><div class="diff-box-label">Expected:</div><pre>' + esc(expected || '(Non-empty output)') + '</pre></div>'
        + '<div class="diff-box"><div class="diff-box-label">Your Output:</div><pre>' + esc(stdout || '(empty)') + '</pre></div>'
        + '</div>'
        + '</div>';
    });

    diffList.innerHTML = cardsHtml;
    var passCountEl = ge('test-pass-count');
    if (passCountEl) passCountEl.textContent = passCount + '/' + tests.length;

    if (allPassed) {
      _stepTestsPassed[_slideIdx] = true;
      _maxUnlockedStep = Math.max(_maxUnlockedStep, _slideIdx + 1);
      updateStepPills();
      if (window.GameFX) {
        if (window.GameFX.playBlockBreak) window.GameFX.playBlockBreak();
        if (window.GameFX.flyXpOrbs) window.GameFX.flyXpOrbs();
        if (window.GameFX.mascotReact) window.GameFX.mascotReact("bounce");
      }
      showRecapOverlay();
    } else {
      if (window.GameFX) {
        if (window.GameFX.playGentleOops) window.GameFX.playGentleOops();
        if (window.GameFX.mascotReact) window.GameFX.mascotReact("shake");
      }
    }
  }).catch(function(err) {
    diffList.innerHTML = '<div class="diff-card fail"><div class="diff-card-header"><span class="diff-test-name">System Error</span><span class="diff-test-status">ERROR</span></div><pre class="output-error">' + esc(err.message) + '</pre></div>';
  });
}
window.submitLessonTests = submitLessonTests;

function switchConsoleTab(tab) {
  _activeConsoleTab = tab;
  var termBtn = ge('tab-btn-terminal');
  var testBtn = ge('tab-btn-tests');
  var termView = ge('console-view-terminal');
  var testView = ge('console-view-tests');

  if (tab === 'terminal') {
    if (termBtn) { termBtn.classList.add('active'); termBtn.setAttribute('aria-selected', 'true'); }
    if (testBtn) { testBtn.classList.remove('active'); testBtn.setAttribute('aria-selected', 'false'); }
    if (termView) termView.classList.remove('hidden');
    if (testView) testView.classList.add('hidden');
  } else {
    if (testBtn) { testBtn.classList.add('active'); testBtn.setAttribute('aria-selected', 'true'); }
    if (termBtn) { termBtn.classList.remove('active'); termBtn.setAttribute('aria-selected', 'false'); }
    if (testView) testView.classList.remove('hidden');
    if (termView) termView.classList.add('hidden');
  }
}
window.switchConsoleTab = switchConsoleTab;

function switchMobileTab(tab) {
  _activeMobileTab = tab;
  qsa('.mobile-tab-btn').forEach(function(b) {
    var isActive = b.getAttribute('data-tab') === tab;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  var workspace = ge('split-lesson-workspace');
  if (workspace) {
    workspace.classList.remove('mobile-tab-guide', 'mobile-tab-editor', 'mobile-tab-console');
    workspace.classList.add('mobile-tab-' + tab);
  }

  var guideCol = ge('lesson-guide-col');
  var editorCol = ge('lesson-editor-col');
  var consolePanel = ge('lesson-console-panel');

  if (guideCol && editorCol) {
    guideCol.classList.toggle('mobile-hidden', tab !== 'guide');
    editorCol.classList.toggle('mobile-hidden', tab === 'guide');
  }
  if (consolePanel) {
    if (tab === 'console') {
      consolePanel.style.height = '100%';
    } else {
      consolePanel.style.height = '';
    }
  }

  if (tab === 'editor' && _cmLesson) {
    setTimeout(function() { _cmLesson.focus(); }, 50);
  }
}
window.switchMobileTab = switchMobileTab;

function showRecapOverlay() {
  var overlay = ge('lesson-recap-overlay');
  if (!overlay || !_curLesson) return;
  var slide = _curLesson.slides[_slideIdx];
  var total = _curLesson.slides.length;
  var isLastStep = _slideIdx >= total - 1;

  setText('recap-title', isLastStep ? 'Lesson Quest Mastered!' : 'Quest Step Complete!');
  setText('recap-summary', isLastStep ? ('Congratulations! You completed all steps for ' + _curLesson.title + '.') : ('Step ' + (_slideIdx + 1) + ' passed with flying colors!'));

  var learnedText = (slide && (slide.title || _curLesson.title)) || 'Java fundamentals and logic';
  var reviewText = (slide && slide.hints && slide.hints[0]) || 'Verify syntax structure and edge cases.';
  setText('recap-learned-text', learnedText);
  setText('recap-review-text', reviewText);

  var xpVal = ge('recap-xp-awarded');
  if (xpVal) xpVal.textContent = isLastStep ? ('+' + (_curLesson.xp || 25) + ' XP') : '+10 XP';

  var contBtn = ge('btn-recap-continue');
  if (contBtn) {
    contBtn.textContent = isLastStep ? 'Complete Lesson & Next Quest →' : 'Next Step →';
    contBtn.focus();
  }

  overlay.classList.remove('hidden');
  if (typeof burstParticles === 'function') burstParticles('lesson-recap-overlay');
}
window.showRecapOverlay = showRecapOverlay;

function hideRecapOverlay() {
  var overlay = ge('lesson-recap-overlay');
  if (overlay) overlay.classList.add('hidden');
}
window.hideRecapOverlay = hideRecapOverlay;

function continueToNextStep() {
  hideRecapOverlay();
  if (_slideIdx < _curLesson.slides.length - 1) {
    _slideIdx++;
    _maxUnlockedStep = Math.max(_maxUnlockedStep, _slideIdx);
    renderSplitLesson();
    addXP(10);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#lesson/' + _curMod.id + '/' + _curLesson.id + '/' + (_slideIdx + 1));
    }
  } else {
    finishLesson();
  }
}
window.continueToNextStep = continueToNextStep;

// ── Deep Linking Router ──────────────────────────────────────────────────
function checkHashRoute() {
  if (typeof window === 'undefined' || !window.location || !window.location.hash) return;
  var hash = window.location.hash.substring(1);
  if (hash.startsWith('lesson/')) {
    var parts = hash.split('/');
    if (parts.length >= 3) {
      var modId = parts[1];
      var lessonId = parts[2];
      var stepIdx = parts.length >= 4 ? (parseInt(parts[3], 10) - 1) : 0;
      setTimeout(function() {
        startLesson(modId, lessonId, stepIdx);
      }, 150);
    }
  }
}
window.addEventListener('hashchange', checkHashRoute);

// Keyboard accessibility: Escape dismisses modal/recap
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var recap = ge('lesson-recap-overlay');
    if (recap && !recap.classList.contains('hidden')) {
      hideRecapOverlay();
    }
  }
});


document.addEventListener('DOMContentLoaded', function(){
  initAuthUI();
  initDiffModal();
  initResizableWorkspaces();
  initTheme();

  // ── THEME TOGGLES ──
  var ttb=ge('theme-toggle-btn');          if(ttb)ttb.addEventListener('click',toggleTheme);
  var stb=ge('settings-theme-toggle-btn'); if(stb)stb.addEventListener('click',toggleTheme);

  // ── NAV ───────────────────────────────────────────────────────
  var nll=ge('nav-logo-btn');   if(nll) nll.addEventListener('click', function(){showScreen('home');});
  var nh=ge('nav-home');        if(nh)  nh.addEventListener('click',  function(){showScreen('home');});
  var nm=ge('nav-map');         if(nm)  nm.addEventListener('click',  function(){showScreen('map');});
  var nc=ge('nav-compiler');    if(nc)  nc.addEventListener('click',  function(){showScreen('compiler');});
  var nbd=ge('nav-badges');     if(nbd) nbd.addEventListener('click', function(){showScreen('badges');});
  var nav2=ge('nav-avatar');    if(nav2)nav2.addEventListener('click', function(){showScreen('avatar');});
  var ns=ge('nav-settings');    if(ns)  ns.addEventListener('click',  function(){showScreen('settings');});

  // ── HOME ──────────────────────────────────────────────────────
  var dqb=ge('daily-quest-btn'); if(dqb)dqb.addEventListener('click',startDailyQuest);
  var ccrd=ge('continue-card');  if(ccrd)ccrd.addEventListener('click',startDailyQuest);
  var qcm=ge('qc-map');       if(qcm)qcm.addEventListener('click',function(){showScreen('map');});
  var qcc=ge('qc-compiler');  if(qcc)qcc.addEventListener('click',function(){showScreen('compiler');});
  var qcb=ge('qc-badges');    if(qcb)qcb.addEventListener('click',function(){showScreen('badges');});
  var qca=ge('qc-avatar');    if(qca)qca.addEventListener('click',function(){showScreen('avatar');});
  var haw=ge('hero-avatar-wrap');if(haw)haw.addEventListener('click',function(){showScreen('avatar');});

  // ── LESSON ────────────────────────────────────────────────────
  var lb=ge('lesson-back-btn'); if(lb)lb.addEventListener('click',function(){showScreen('map');});
  var bp=ge('btn-prev-slide');   if(bp)bp.addEventListener('click',prevSlide);
  var bn=ge('btn-next-slide');   if(bn)bn.addEventListener('click',nextSlide);

  // ── CHALLENGE ─────────────────────────────────────────────────
  var cb=ge('challenge-back-btn'); if(cb)cb.addEventListener('click',function(){showScreen('map');});
  var bca=ge('btn-check-answer');  if(bca)bca.addEventListener('click',checkAnswer);
  var bnq=ge('btn-next-question'); if(bnq)bnq.addEventListener('click',nextQuestion);

  // ── MODULE POPUP ──────────────────────────────────────────────
  var pbg=ge('mod-popup-bg');   if(pbg)pbg.addEventListener('click',closeModulePopup);
  var pbc=ge('popup-close-btn');if(pbc)pbc.addEventListener('click',closeModulePopup);

  // ── COMPILER ──────────────────────────────────────────────────
  var rb=ge('run-btn');     if(rb)rb.addEventListener('click',runCode);
  var clb=ge('clear-output-btn');if(clb)clb.addEventListener('click',clearOutput);
  var tsb=ge('toggle-stdin-btn');
  if(tsb){
    tsb.addEventListener('click',function(){
      var sbox = ge('compiler-stdin-box');
      if(sbox){
        sbox.classList.toggle('collapsed');
        tsb.classList.toggle('active', !sbox.classList.contains('collapsed'));
        if(!sbox.classList.contains('collapsed')){
          var sin = ge('compiler-stdin');
          if(sin) sin.focus();
        }
      }
    });
  }
  var ce=ge('code-editor');
  if(ce){
    ce.addEventListener('keydown',function(e){if(e.key==='Tab'){e.preventDefault();var s=this.selectionStart,end=this.selectionEnd;this.value=this.value.substring(0,s)+'    '+this.value.substring(end);this.selectionStart=this.selectionEnd=s+4;}if(e.ctrlKey&&e.key==='Enter'){e.preventDefault();runCode();}});
  }
  var tplMap={'tpl-hello':'hello','tpl-variables':'variables','tpl-ifelse':'ifelse','tpl-loops':'loops','tpl-arrays':'arrays','tpl-methods':'methods','tpl-oop':'oop','tpl-scanner':'scanner'};
  Object.keys(tplMap).forEach(function(id){var b=ge(id);if(b){b.setAttribute('data-tpl',tplMap[id]);b.addEventListener('click',function(){loadTemplate(this.getAttribute('data-tpl'));});}});

  // Live Interactive Console Terminal Listeners
  var termInp = ge('terminal-input');
  if (termInp) {
    termInp.addEventListener('keydown', function(e){
      if (e.key === 'Enter') {
        e.preventDefault();
        submitTerminalInput(this.value);
      }
    });
  }
  var termBtn = ge('terminal-submit-btn');
  if (termBtn) {
    termBtn.addEventListener('click', function(e){
      e.preventDefault();
      var inp = ge('terminal-input');
      submitTerminalInput(inp ? inp.value : '');
    });
  }

  var outPanel = ge('compiler-output-panel');
  if (outPanel) {
    outPanel.addEventListener('click', function(e){
      if (e.target && (e.target.id === 'clear-output-btn' || e.target.id === 'toggle-stdin-btn')) return;
      var inlineInp = ge('terminal-inline-input');
      if (inlineInp && !inlineInp.disabled) {
        inlineInp.focus();
      }
    });
  }

  var outArea = ge('output-area');
  if (outArea) {
    outArea.addEventListener('click', function(){
      var inlineInp = ge('terminal-inline-input');
      if (inlineInp && !inlineInp.disabled) {
        inlineInp.focus();
        return;
      }
      if (!_interactiveSession.active && !_interactiveSession.isExecuting) {
        runCode();
      }
    });
  }

  // Global keydown handler to route keystrokes directly to the terminal input
  document.addEventListener('keydown', function(e) {
    var screen = document.querySelector('.screen.active');
    if (!screen || screen.id !== 'screen-compiler') return;

    var tag = (document.activeElement && document.activeElement.tagName) ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'textarea' || (tag === 'input' && document.activeElement.id !== 'terminal-inline-input')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    var inlineInp = ge('terminal-inline-input');
    if (inlineInp && !inlineInp.disabled) {
      if (document.activeElement !== inlineInp) {
        inlineInp.focus();
      }
    } else if (!_interactiveSession.active && !_interactiveSession.isExecuting) {
      if (e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    }
  });

  // ── AVATAR ────────────────────────────────────────────────────
  qsa('.avatar-tab').forEach(function(t){t.addEventListener('click',function(){switchAvatarTab(this.getAttribute('data-tab'));});});
  var ani=ge('avatar-name-input');
  if(ani)ani.addEventListener('input',function(){var p=ge('avatar-preview-name');if(p)p.textContent=this.value||'JavaLearner';});
  var sab=ge('save-avatar-btn');if(sab)sab.addEventListener('click',saveAvatar);

  // ── SETTINGS ──────────────────────────────────────────────────
  var rhb=ge('refill-hearts-btn');  if(rhb)rhb.addEventListener('click',refillHearts);
  var eab=ge('edit-avatar-btn');    if(eab)eab.addEventListener('click',function(){showScreen('avatar');});
  var cdb=ge('change-diff-btn');    if(cdb)cdb.addEventListener('click',openDiffModal);
  var sob=ge('signout-btn');        if(sob)sob.addEventListener('click',doSignOut);
  var rpb=ge('reset-progress-btn'); if(rpb)rpb.addEventListener('click',function(){showModal('modal-reset');});
  var dab=ge('delete-account-btn'); if(dab)dab.addEventListener('click',function(){showModal('modal-delete-account');});
  var ddab=ge('danger-delete-account-btn'); if(ddab)ddab.addEventListener('click',function(){showModal('modal-delete-account');});


  // ── MODALS ────────────────────────────────────────────────────
  var lvok=ge('levelup-ok-btn');         if(lvok)lvok.addEventListener('click',function(){hideModal('modal-levelup');});
  var bok=ge('badge-ok-btn');            if(bok)bok.addEventListener('click',function(){hideModal('modal-badge');});
  var cok=ge('complete-ok-btn');         if(cok)cok.addEventListener('click',function(){hideModal('modal-complete');showScreen('map');});
  var crok=ge('challenge-result-ok-btn');if(crok)crok.addEventListener('click',function(){hideModal('modal-challenge-result');showScreen('map');});
  var rcnl=ge('reset-cancel-btn');       if(rcnl)rcnl.addEventListener('click',function(){hideModal('modal-reset');});
  var rcon=ge('reset-confirm-btn');      if(rcon)rcon.addEventListener('click',resetProgress);
  var dacnl=ge('delete-account-cancel-btn');  if(dacnl)dacnl.addEventListener('click',function(){hideModal('modal-delete-account');});
  var dacon=ge('delete-account-confirm-btn'); if(dacon)dacon.addEventListener('click',deleteAccount);
  var csClose=ge('btn-close-cheatsheet')||ge('cheatsheet-close-btn'); if(csClose)csClose.addEventListener('click',closeCheatsheet);
  var csOk=ge('btn-ok-cheatsheet')||ge('cheatsheet-ok-btn');           if(csOk)csOk.addEventListener('click',closeCheatsheet);
  var csBg=ge('modal-cheatsheet');                                    if(csBg)csBg.addEventListener('click',function(e){if(e.target===csBg)closeCheatsheet();});

  // ── CODING CHALLENGE ─────────────────────────────────────────
  var cbb=ge('coding-back-btn');    if(cbb)cbb.addEventListener('click',function(){showScreen('map');});
  var chb=ge('coding-hint-btn');    if(chb)chb.addEventListener('click',function(){
    var hb=ge('coding-hint-box'); if(hb) hb.classList.toggle('hidden');
  });
  var crb=ge('coding-reset-btn');   if(crb)crb.addEventListener('click',function(){
    if(_curCodingMod && _curCodingMod.codingTask){
      var ed=ge('coding-editor');
      if(ed){ ed.value = _curCodingMod.codingTask.starterCode || ''; ed.focus(); toast('Reset to starter code ↺'); }
    }
  });
  var csb=ge('coding-submit-btn');  if(csb)csb.addEventListener('click',runCodingTests);
  var ccb=ge('coding-continue-btn');if(ccb)ccb.addEventListener('click',function(){showScreen('map');});
  var cded=ge('coding-editor');
  if(cded){
    cded.addEventListener('keydown',function(e){
      if(e.key==='Tab'){
        e.preventDefault();
        var s=this.selectionStart, end=this.selectionEnd;
        this.value=this.value.substring(0,s)+'    '+this.value.substring(end);
        this.selectionStart=this.selectionEnd=s+4;
      }
      if(e.ctrlKey && e.key==='Enter'){
        e.preventDefault();
        runCodingTests();
      }
    });
  }

  // ── CAPSTONE PROJECT MODAL & PLAYGROUND ────────────────────────
  var pcb=ge('project-close-btn');        if(pcb)pcb.addEventListener('click',function(){hideModal('modal-project');});
  var pcab=ge('project-close-action-btn');if(pcab)pcab.addEventListener('click',function(){hideModal('modal-project');});
  var capViewBtn=ge('capstone-view-checklist-btn');
  if(capViewBtn)capViewBtn.addEventListener('click',function(){
    if(_activeCapstoneProj) openProjectModal(_activeCapstoneProj);
  });
  var capResetBtn=ge('capstone-reset-template-btn');
  if(capResetBtn)capResetBtn.addEventListener('click',function(){
    if(!_activeCapstoneProj) return;
    var proj = (window.PROJECTS || []).find(function(p){ return p.id === _activeCapstoneProj; });
    if(!proj) return;
    if(confirm('Reset editor to clean starter skeleton with TODOs?')) {
      var ed = ge('code-editor');
      if (ed) {
        ed.value = proj.starterCode || '';
        ed.focus();
        clearOutput();
      }
      if (STATE && STATE.player && STATE.player.capstoneProjects && STATE.player.capstoneProjects[_activeCapstoneProj]) {
        STATE.player.capstoneProjects[_activeCapstoneProj].code = proj.starterCode || '';
        STATE.player.capstoneProjects[_activeCapstoneProj].lastSavedAt = new Date().toISOString();
        localSave();
      }
      setText('capstone-save-status', 'Reset to starter skeleton');
      toast('Reset editor to starter skeleton! ↺');
    }
  });
  var capSaveBtn=ge('capstone-save-code-btn');
  if(capSaveBtn)capSaveBtn.addEventListener('click',saveCapstoneCode);
  var codeEd=ge('code-editor');
  if(codeEd){
    codeEd.addEventListener('input',handleEditorInput);
  }

  // ── AI CHAT ───────────────────────────────────────────────────
  var fab=ge('ai-chat-fab');     if(fab)fab.addEventListener('click',function(){ if(typeof toggleChat==='function') toggleChat(); });
  var chc=ge('chat-close-btn'); if(chc)chc.addEventListener('click',function(){ if(typeof toggleChat==='function') toggleChat(); });
  var clr=ge('chat-clear-btn'); if(clr)clr.addEventListener('click',function(){ if(typeof clearChat==='function') clearChat(); else if(typeof clearChatHistory==='function') clearChatHistory(); });
  var chs=ge('chat-send-btn');  if(chs)chs.addEventListener('click',function(e){ e.preventDefault(); if(typeof sendChatMessage==='function') sendChatMessage(); });
  var chi=ge('chat-input');
  if(chi){
    chi.addEventListener('keydown',function(e){
      if(e.key==='Enter'&&!e.shiftKey){
        e.preventDefault();
        if(typeof sendChatMessage==='function') sendChatMessage();
      }
    });
  }

  var chipReview = ge('chip-review-code');
  if (chipReview) chipReview.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    sendPromptToChat("Can you review the code I wrote in the editor? Check for errors, syntax issues, or bad practices and tell me how to improve it!");
  });
  var chipError = ge('chip-explain-error');
  if (chipError) chipError.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    sendPromptToChat("I am getting an error or unexpected output with my current code. Can you explain what went wrong and how to fix it?");
  });
  var chipNext = ge('chip-next-step');
  if (chipNext) chipNext.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    sendPromptToChat("Based on my current code and TODOs, what should I implement next? Give me a helpful hint to get started!");
  });

  // ── BOOT ──────────────────────────────────────────────────────
  try {
    var session = sbRestoreSession();
    if (window._sbHashError) {
      showAuthError('si', window._sbHashError + '. Please sign in with your password or click Play as Guest below!');
    }
    if (session) {
      // Existing session — load from DB
      loadUserAndEnter().catch(function(err){
        console.warn('loadUserAndEnter failed, showing auth:', err);
        showAuthLoading(false);
        showScreen('auth');
      });
    } else {
      showScreen('auth');
    }
  } catch(e) {
    console.error('Boot initialization error:', e);
    showScreen('auth');
  }
});

// Immediate theme initialization to prevent theme flicker on page load
try {
  initTheme();
} catch(e) {}
