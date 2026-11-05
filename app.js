// JavaQuest — app.js (Supabase Edition)
// Pure addEventListener, no inline onclick, full Supabase sync

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
  if (!p.minecraftSkin) p.minecraftSkin = 'steve';
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
      minecraftSkin: 'steve',
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
var _signupMinecraftSkin = 'steve';
var SKIN_COLORS = ['#FDBCB4','#EAA175','#D08B5B','#AE5D29','#3B1F1A'];

function initAuthUI() {
  // Skin buttons (Minecraft character previews)
  var row = ge('login-skin-row');
  if (row) {
    row.innerHTML = '';
    var skinKeys = ['steve', 'alex', 'diamond_knight', 'creeper', 'ender_coder', 'redstone', 'cyber_steve', 'golden_king'];
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
      _signupMinecraftSkin = btn.getAttribute('data-skin') || 'steve';
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
            showAuthLoading(false);
            showAuthSuccess('su', 'Account created! A confirmation email was sent to ' + email + '. Check your inbox to confirm, then click "Sign In" above. Or click "Play as Guest" below to start immediately!');
            toast('Confirmation email sent to ' + email + '');
          })
          .catch(function(siErr){
            showAuthLoading(false);
            showAuthSuccess('su', 'Account created! A confirmation email was sent to ' + email + '. Please check your inbox (or spam) to confirm, then click "Sign In" above. Or play in Guest Mode below!');
            toast('Confirmation email sent to ' + email + '');
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
  steve: {
    id: 'steve',
    name: 'Steve • OG Crafter',
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
  alex: {
    id: 'alex',
    name: 'Alex • Code Explorer',
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
  diamond_knight: {
    id: 'diamond_knight',
    name: 'Diamond Knight • Full Armor',
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
  creeper: {
    id: 'creeper',
    name: 'Creeper Dev • Pixel Mascot',
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
  ender_coder: {
    id: 'ender_coder',
    name: 'Ender Wizard • Void Coder',
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
  redstone: {
    id: 'redstone',
    name: 'Redstone • Logic Architect',
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
  cyber_steve: {
    id: 'cyber_steve',
    name: 'Cyber Coder • Neon Visor',
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
  golden_king: {
    id: 'golden_king',
    name: 'Golden King • Java Master',
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

function renderMinecraftSVG(grid) {
  var svg = '<svg viewBox="0 0 8 8" class="minecraft-pixel-face" style="width:100%;height:100%;shape-rendering:crispEdges;image-rendering:pixelated;display:block;">';
  for (var r = 0; r < 8; r++) {
    for (var c = 0; c < 8; c++) {
      svg += '<rect x="' + c + '" y="' + r + '" width="1" height="1" fill="' + (grid[r][c] || '#000000') + '"/>';
    }
  }
  svg += '</svg>';
  return svg;
}

function drawAvatar(el, av) {
  if (!el) return;
  var skinId = (STATE && STATE.player && (STATE.player.minecraftSkin || STATE.player.avatarSkin)) || (av && (av.minecraftSkin || av.avatarSkin)) || 'steve';
  var skinData = MINECRAFT_SKINS[skinId] || MINECRAFT_SKINS.steve;
  el.style.position = 'relative';
  el.innerHTML = '<div class="minecraft-avatar-box">' + renderMinecraftSVG(skinData.grid) + '</div>';
}

function renderAllAvatars() {
  drawAvatar(ge('avatar-display-home'),   STATE && STATE.player && STATE.player.avatar);
  drawAvatar(ge('avatar-display-editor'), _avDraft || (STATE && STATE.player && STATE.player.avatar));
}

function switchAvatarTab(tab) {
  _avTab = 'skin';
  var grid = ge('avatar-options-grid'); if(!grid) return;
  grid.innerHTML = '';
  var currentSkin = (STATE && STATE.player && (STATE.player.minecraftSkin || STATE.player.avatarSkin)) || (_avDraft && _avDraft.minecraftSkin) || 'steve';
  
  Object.keys(MINECRAFT_SKINS).forEach(function(key){
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
      if (STATE && STATE.player) {
        STATE.player.minecraftSkin = key;
        STATE.player.avatarSkin = key;
      }
      qsa('.minecraft-char-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      drawAvatar(ge('avatar-display-editor'), _avDraft);
    });
    grid.appendChild(card);
  });
}

function saveAvatar() {
  var inp = ge('avatar-name-input');
  if (inp && inp.value.trim()) STATE.player.name = inp.value.trim();
  if (_avDraft && _avDraft.minecraftSkin) {
    STATE.player.minecraftSkin = _avDraft.minecraftSkin;
    STATE.player.avatarSkin = _avDraft.minecraftSkin;
  }
  localSave(); renderAllAvatars(); updateNav();
  showScreen('home'); toast('Minecraft avatar saved!');
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
    if (STATE.player.completedModules.indexOf(mod.id)===-1) {
      var badgeEl = ge('continue-badge');
      if (badgeEl) badgeEl.style.backgroundColor = mod.color || '#FFE600';
      setText('continue-badge-code', (mod.code || mod.id).toUpperCase());
      setText('continue-title', mod.title);
      var done=0;
      for(var j=0;j<mod.lessons.length;j++) if(STATE.player.completedLessons.indexOf(mod.lessons[j].id)!==-1) done++;
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
      if (STATE.player.completedLessons.indexOf(mod.lessons[j].id) === -1) {
        startLesson(mod.id, mod.lessons[j].id);
        return;
      }
    }
    // Check quiz challenge
    if (mod.challenge && STATE.player.completedChallenges.indexOf(mod.challenge.id) === -1) {
      startChallenge(mod.id);
      return;
    }
    // Check coding challenge
    if (mod.codingTask && (STATE.player.completedCoding || []).indexOf(mod.id) === -1) {
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
  if (mods[0].id === modId) return true;
  for (var i = 1; i < mods.length; i++) {
    if (mods[i].id === modId) {
      return (STATE.player.completedModules || []).indexOf(mods[i - 1].id) !== -1;
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
      return (STATE.player.completedLessons || []).indexOf(mod.lessons[i - 1].id) !== -1;
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
    if ((STATE.player.completedLessons || []).indexOf(mod.lessons[i].id) === -1) {
      allLessonsDone = false;
      break;
    }
  }
  var quizDone = !mod.challenge || (STATE.player.completedChallenges || []).indexOf(mod.challenge.id) !== -1;
  var codeDone = !mod.codingTask || (STATE.player.completedCoding || []).indexOf(mod.id) !== -1;

  if (allLessonsDone && (quizDone || codeDone)) {
    if ((STATE.player.completedModules || []).indexOf(mod.id) === -1) {
      STATE.player.completedModules.push(mod.id);
      checkBadge('first_module');
      checkBadge('module_' + mod.id.replace('module-', ''));
      var allM = true;
      var mods = getModulesForDifficulty();
      for (var j = 0; j < mods.length; j++) {
        if (STATE.player.completedModules.indexOf(mods[j].id) === -1) { allM = false; break; }
      }
      if (allM) checkBadge('all_modules');
      localSave();
      renderMap();
    }
  }
}

function renderMap() {
  var path = ge('module-path');
  if (!path) return;
  var allMods = getModulesForDifficulty();
  if (!allMods.length) {
    path.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,.4);padding:2rem">Loading curriculum…</p>';
    return;
  }

  // Update banner
  var banner = ge('diff-path-banner');
  if (banner) {
    var p = STATE.player;
    banner.innerHTML = '<span class="diff-banner-tag">' + (DIFFICULTY_LABELS[p.difficulty] || 'Beginner') + '</span> '
      + '<span class="diff-banner-info">' + allMods.length + ' modules available</span> — '
      + '<a class="diff-banner-link" id="map-change-diff">Change difficulty</a>';
    var cd = ge('map-change-diff');
    if (cd) cd.addEventListener('click', function(e){ e.preventDefault(); openDiffModal(); });
  }

  path.innerHTML = '';

  var tracks = [
    { key: 'beginner', title: 'Beginner Track — Foundations & Core Java', desc: 'Modules B1–B8 • Java syntax, control flow, methods, arrays & OOP fundamentals', projId: 'proj-beginner', badge: 'TRACK 1 • BEGINNER' },
    { key: 'intermediate', title: 'Intermediate Track — OOP, Streams & Architecture', desc: 'Modules I1–I8 • Streams, Lambdas, JDBC, Concurrency, JUnit & Collections', projId: 'proj-intermediate', badge: 'TRACK 2 • INTERMEDIATE' },
    { key: 'advanced', title: 'Advanced Track — JVM Internals & Cloud Enterprise', desc: 'Modules A1–A8 • Virtual Threads, Spring Boot, Security & Microservices', projId: 'proj-advanced', badge: 'TRACK 3 • ADVANCED' }
  ];

  tracks.forEach(function(tr){
    var modsInTrack = allMods.filter(function(m){ return m.level === tr.key; });
    if (!modsInTrack.length) return;

    // Track Section Header Card (Neobrutalist, clean, NO photo)
    var header = document.createElement('div');
    header.className = 'track-section-header';
    header.innerHTML = '<div class="track-header-card">'
      + '<span class="track-header-badge">' + tr.badge + '</span>'
      + '<div class="track-header-title">' + esc(tr.title) + '</div>'
      + '<div class="track-header-desc">' + esc(tr.desc) + '</div>'
      + '</div>';
    path.appendChild(header);

    // Track Nodes Path Container
    var trackNodes = document.createElement('div');
    trackNodes.className = 'track-nodes-row';

    modsInTrack.forEach(function(mod){
      var completed = (STATE.player.completedModules || []).indexOf(mod.id) !== -1;
      var unlocked = isModUnlocked(mod.id);
      var st = completed ? 'completed' : unlocked ? 'available' : 'locked';

      var wrap = document.createElement('div');
      wrap.className = 'module-node-wrap';

      var node = document.createElement('div');
      node.className = 'module-node ' + st;
      node.style.setProperty('--node-color', mod.color || '#6C63FF');

      var codeBadge = document.createElement('div');
      codeBadge.className = 'module-code-pill';
      codeBadge.textContent = (mod.code || mod.id).toUpperCase();

      var btn = document.createElement('div');
      btn.className = 'module-node-btn';

      if (st === 'locked') {
        btn.innerHTML = '<span class="lock-overlay"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>';
      } else {
        btn.innerHTML = '<span class="node-code-text">' + esc((mod.code || mod.id).toUpperCase()) + '</span>';
        if (completed) {
          var ck = document.createElement('div');
          ck.className = 'check-overlay';
          ck.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          btn.appendChild(ck);
        }
        btn.setAttribute('data-modid', mod.id);
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          openModulePopup(this.getAttribute('data-modid'));
        });
      }

      var label = document.createElement('div');
      label.className = 'module-node-label';
      label.textContent = mod.title;

      node.appendChild(codeBadge);
      node.appendChild(btn);
      node.appendChild(label);
      wrap.appendChild(node);
      trackNodes.appendChild(wrap);
    });

    path.appendChild(trackNodes);

    // Capstone Project Card at the end of each track (NO photo banner)
    var proj = (window.PROJECTS || []).find(function(p){ return p.id === tr.projId; });
    if (proj) {
      var pState = (STATE && STATE.player && STATE.player.capstoneProjects) ? STATE.player.capstoneProjects[proj.id] : null;
      var isCompleted = pState && pState.completed;
      var checkedCount = 0;
      if (pState && pState.tasks) {
        checkedCount = Object.keys(pState.tasks).filter(function(k){ return pState.tasks[k]; }).length;
      }
      var totalReqs = (proj.requirements || []).length;

      var pCard = document.createElement('div');
      var cardClasses = 'capstone-project-card glass-card';
      if (isCompleted) cardClasses += ' capstone-card-completed';
      else if (checkedCount > 0) cardClasses += ' capstone-card-in-progress';
      pCard.className = cardClasses;
      pCard.setAttribute('data-projid', proj.id);

      var pillText = tr.key.toUpperCase() + ' CAPSTONE PROJECT';
      var actionBtnText = 'View Project';
      var descText = proj.description;

      if (isCompleted) {
        pillText = tr.key.toUpperCase() + ' CAPSTONE • COMPLETED (+' + (proj.xpReward || 250) + ' XP)';
        actionBtnText = 'Review Project';
        descText = 'Milestone requirements verified! ' + (pState.completedAt ? 'Completed on ' + new Date(pState.completedAt).toLocaleDateString() : 'Claimed!');
      } else if (checkedCount > 0) {
        pillText = tr.key.toUpperCase() + ' CAPSTONE • IN PROGRESS (' + checkedCount + '/' + totalReqs + ' Tasks)';
        actionBtnText = 'Continue Project';
      }

      pCard.innerHTML = '<div class="capstone-header-row">'
        + '<span class="capstone-tag-pill">' + pillText + '</span>'
        + '<span class="capstone-badge-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg></span>'
        + '</div>'
        + '<h3 class="capstone-card-title">' + esc(proj.title) + '</h3>'
        + '<p class="capstone-card-desc">' + esc(descText) + '</p>'
        + '<div class="capstone-progress-row">'
        + '<div class="capstone-prog-bar"><div class="capstone-prog-fill" style="width:' + (totalReqs ? Math.round(checkedCount/totalReqs*100) : 0) + '%"></div></div>'
        + '<span class="capstone-prog-label">' + checkedCount + '/' + totalReqs + ' Verified</span>'
        + '</div>'
        + '<div class="capstone-action">'
        + '<button class="btn-primary btn-sm capstone-view-btn" data-projid="' + proj.id + '">' + actionBtnText + '</button>'
        + '</div>';

      pCard.addEventListener('click', function(e){
        var pid = this.getAttribute('data-projid');
        openProjectModal(pid);
      });
      path.appendChild(pCard);
    }
  });
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
      item.innerHTML = '<div class="task-check-circle">' + (isChecked ? '✓' : '') + '</div>'
        + '<div style="flex:1;"><div class="task-text">' + esc(reqText) + '</div>'
        + (reason ? '<div class="task-eval-reason ' + (isChecked ? 'reason-pass' : 'reason-fail') + '">' + (isChecked ? '✓ ' : 'Notice: ') + esc(reason) + '</div>' : '')
        + '</div>'
        + '<span class="task-badge-pill ' + (isChecked ? 'pill-done' : 'pill-pending') + '">' + (isChecked ? 'Verified ✓' : 'Needs Code') + '</span>';

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
    var done = (STATE.player.completedLessons || []).indexOf(lesson.id) !== -1;
    var unlocked = isLessonUnlocked(mod.id, lesson.id);
    var item = document.createElement('div');
    item.className = 'popup-lesson-item' + (done ? ' completed' : '') + (!unlocked && !done ? ' locked-item' : '');
    item.innerHTML = '<span class="lesson-check">' + (done ? '✓' : unlocked ? '•' : '') + '</span>'
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
    if ((STATE.player.completedLessons || []).indexOf(mod.lessons[i].id) === -1) {
      allDone = false;
      break;
    }
  }

  // Quiz Challenge Button
  if (mod.challenge) {
    var challDone = (STATE.player.completedChallenges || []).indexOf(mod.challenge.id) !== -1;
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
    var codeDone = (STATE.player.completedCoding || []).indexOf(mod.id) !== -1;
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
    var isDone = (STATE.player.completedCoding || []).indexOf(mod.id) !== -1;
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
  // 1. First priority: Local OpenJDK 24 compiler endpoint (/api/run)
  return fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code, stdin: stdin || '' })
  })
  .then(function(res){
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  })
  .catch(function(err){
    // 2. Second priority: Online deployment (e.g. Vercel) — run via ultra-fast Gemini Flash-Lite compiler engine
    var apiKey = (typeof getGeminiKey === 'function') ? getGeminiKey() : null;
    if (apiKey) {
      return executeJavaWithAI(code, stdin, apiKey).catch(function(aiErr){
        console.warn('AI compilation fallback failed, trying client interpreter:', aiErr);
        return runClientJavaInterpreter(code, stdin);
      });
    }
    // 3. Client-side fallback interpreter
    return runClientJavaInterpreter(code, stdin);
  });
}

function executeJavaWithAI(code, stdin, apiKey) {
  var prompt = 'Act as an OpenJDK Java compiler and runtime simulator. '
    + 'Simulate execution of the following Java program accurately. '
    + (stdin ? 'Provide standard input: ' + JSON.stringify(stdin) + '. ' : '')
    + 'Return ONLY a raw JSON object matching this schema without markdown or formatting: '
    + '{"stdout": "<full standard output string>", "stderr": "<compile or runtime error message, or empty string>", "code": 0}. '
    + 'If compilation or syntax error occurs, set code to 1 and put error in stderr.\\n\\nJava Code:\\n' + code;

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=' + apiKey;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000
      }
    })
  })
  .then(function(res){
    if (!res.ok) throw new Error('AI Compiler HTTP ' + res.status);
    return res.json();
  })
  .then(function(data){
    var text = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    if (!text) throw new Error('No output from AI compiler');
    var clean = text.replace(/```json\\s*/gi, '').replace(/```\\s*/g, '').trim();
    var parsed = JSON.parse(clean);
    return {
      run: {
        stdout: parsed.stdout || '',
        stderr: parsed.stderr || '',
        code: (typeof parsed.code === 'number') ? parsed.code : 0
      },
      compile: (parsed.code !== 0 && parsed.stderr) ? { stderr: parsed.stderr, code: parsed.code } : null
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
    if (icon) icon.textContent = '▼';
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
          if (badge) { badge.className = 'tc-badge passed'; badge.textContent = 'Passed ✓'; }
          if (row) { row.classList.remove('failed-row'); row.classList.add('passed-row'); }
        } else {
          allPassed = false;
          if (badge) { badge.className = 'tc-badge failed'; badge.textContent = 'Failed ✗'; }
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
        if (badge) { badge.className = 'tc-badge failed'; badge.textContent = 'Failed ✗'; }
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

    var isNew = (STATE.player.completedCoding || []).indexOf(_curCodingMod.id) === -1;
    if (isNew) {
      STATE.player.completedCoding.push(_curCodingMod.id);
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
  if(next) next.textContent=(_slideIdx===total-1?'Finish Lesson ✓':'Next →');
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
  var isNew=STATE.player.completedLessons.indexOf(_curLesson.id)===-1;
  if(isNew){
    STATE.player.completedLessons.push(_curLesson.id);
    addXP(_curLesson.xp); checkBadge('first_lesson');
    var allDone=true;
    for(var i=0;i<_curMod.lessons.length;i++) if(STATE.player.completedLessons.indexOf(_curMod.lessons[i].id)===-1){allDone=false;break;}
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
  var isDone = (STATE.player.completedChallenges || []).indexOf(mod.challenge ? mod.challenge.id : '') !== -1;
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
  var chk=ge('btn-check-answer');if(chk){chk.disabled=false;chk.textContent='Check Answer ✓';}
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
    setText('feedback-icon',correct?'✓':'✕');
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
  if(STATE.player.completedChallenges.indexOf(_cm.challenge.id)===-1){
    STATE.player.completedChallenges.push(_cm.challenge.id);
    addXP(xp);
    if(_cm.lessons && Array.isArray(_cm.lessons)){
      var allL=true;for(var i=0;i<_cm.lessons.length;i++)if(STATE.player.completedLessons.indexOf(_cm.lessons[i].id)===-1){allL=false;break;}
      if(allL&&STATE.player.completedModules.indexOf(_cm.id)===-1){
        STATE.player.completedModules.push(_cm.id);
        checkBadge('first_module'); checkBadge('module_'+_cm.id.replace('module-',''));
        var allM=true;var mods=getModulesForDifficulty();for(var j=0;j<mods.length;j++)if(STATE.player.completedModules.indexOf(mods[j].id)===-1){allM=false;break;}
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

function renderHearts(){
  var h = (STATE && STATE.player) ? STATE.player.hearts : 3;
  for(var i=1;i<=3;i++){
    var e=ge('heart-'+i);
    if(e) {
      e.classList.toggle('lost', i>h);
      e.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="' + (i<=h ? '#E63946' : '#D1D5DB') + '"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    }
  }
  var container = ge('nav-hearts');
  if (container) {
    var svgHearts = '';
    for (var a = 0; a < 3; a++) {
      var filled = (a < h);
      svgHearts += '<svg class="heart-svg" viewBox="0 0 24 24" width="16" height="16" fill="' + (filled ? '#E63946' : '#9CA3AF') + '"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
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
  scanner:'public class Main {\n    public static void main(String[] args) {\n        // Simulated input (Scanner needs live terminal)\n        String name = "JavaLearner";\n        int age = 20;\n        System.out.println("Name: " + name + ", Age: " + age);\n        System.out.println(age >= 18 ? "Adult!" : "Minor!");\n    }\n}'
};

var _compilerReady=false;
function initCompiler(){ if(_compilerReady)return; _compilerReady=true; var ed=ge('code-editor'); if(ed&&!ed.value) ed.value=TEMPLATES.hello; }
function loadTemplate(name){ var ed=ge('code-editor'); if(ed&&TEMPLATES[name]){ed.value=TEMPLATES[name];ed.focus();clearOutput();} }

function runCode() {
  var ed = ge('code-editor'); if (!ed) return;
  var code = ed.value.trim(); if (!code) { toast('Write some code first!'); return; }
  if (_activeCapstoneProj) saveCapstoneCode();
  var outEl = ge('output-area'); if (!outEl) return;
  var runBtn = ge('run-btn'); if (runBtn) { runBtn.disabled = true; runBtn.textContent = 'Running…'; }
  outEl.innerHTML = '<div class="output-running"><span class="run-spinner"></span>Compiling and running Java…</div>';

  executeJava(code, '')
    .then(function(data){
      if (runBtn) { runBtn.disabled = false; runBtn.textContent = 'Run Code'; }
      var out = '', hasErr = false;
      if (data.compile && data.compile.stderr) {
        out = '[Compilation Error]\n' + data.compile.stderr;
        hasErr = true;
      } else if (data.run) {
        if (data.run.stdout) out += data.run.stdout;
        if (data.run.stderr) { out += (out ? '\n' : '') + data.run.stderr; hasErr = true; }
        if (!data.run.stdout && !data.run.stderr) {
          out = '(Program executed successfully with no output.\nUse System.out.println() to print results.)';
        }
      } else if (data.error) {
        out = '[Error]\n' + data.error;
        hasErr = true;
      } else {
        out = '(No output)';
      }
      outEl.innerHTML = '<pre class="' + (hasErr ? 'output-error' : 'output-success') + '">' + esc(out) + '</pre>';
    })
    .catch(function(err){
      if (runBtn) { runBtn.disabled = false; runBtn.textContent = 'Run Code'; }
      outEl.innerHTML = '<div class="output-error"><pre>[Execution Error]\n' + esc(err.message) + '</pre></div>';
    });
}
function clearOutput(){ var o=ge('output-area'); if(o)o.innerHTML='<div class="output-placeholder">Click Run Code to execute your Java program</div>'; }

/* ═══════════════ XP / LEVELS ════════════════════════════════════ */
function addXP(amount) {
  if(!amount) return;
  STATE.player.xp+=amount; showXpFloat(amount);
  var before=STATE.player.level, nx;
  while((nx=getNextLv())&&STATE.player.xp>=nx.xpRequired) STATE.player.level=nx.level;
  if(STATE.player.level>before) triggerLevelUp();
  updateNav(); localSave();
}
function triggerLevelUp(){var lv=getLv();setText('levelup-new-level','Level '+STATE.player.level);setText('levelup-rank',lv.name);setText('levelup-rank-icon',lv.icon);checkBadge('level_5');checkBadge('level_10');burstParticles('levelup-particles');setTimeout(function(){showModal('modal-levelup');},300);}
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

/* ═══════════════ BADGES ══════════════════════════════════════════ */
function checkBadge(condition){
  if(!window.BADGES)return;
  var badge=null;for(var i=0;i<BADGES.length;i++)if(BADGES[i].condition===condition){badge=BADGES[i];break;}
  if(!badge||STATE.player.badges.indexOf(badge.id)!==-1)return;
  STATE.player.badges.push(badge.id);
  sbQueueBadge(badge.id);
  localSave();
  var b=badge;
  setTimeout(function(){setText('badge-unlocked-icon',b.icon);setText('badge-unlocked-name',b.name);setText('badge-unlocked-desc',b.description);showModal('modal-badge');},900);
}

function awardBadgeDirect(badgeId){
  if(!window.BADGES || !STATE || !STATE.player) return;
  var badge=null;for(var i=0;i<BADGES.length;i++)if(BADGES[i].id===badgeId){badge=BADGES[i];break;}
  if(!badge||STATE.player.badges.indexOf(badge.id)!==-1) return;
  STATE.player.badges.push(badge.id);
  sbQueueBadge(badge.id);
  localSave();
  var b=badge;
  setTimeout(function(){setText('badge-unlocked-icon',b.icon);setText('badge-unlocked-name',b.name);setText('badge-unlocked-desc',b.description);showModal('modal-badge');},600);
}

function renderBadges(){
  if(!window.BADGES) return;
  var grid=ge('badges-grid'); if(!grid) return;
  grid.innerHTML=''; setText('badges-earned-count', STATE.player.badges.length+' / '+BADGES.length+' badges earned');
  BADGES.forEach(function(badge){
    var unlocked = STATE.player.badges.indexOf(badge.id) !== -1;
    var card = document.createElement('div');
    card.className = 'badge-card ' + (unlocked ? 'unlocked' : 'locked');
    card.innerHTML = '<div class="badge-icon-box ' + (unlocked ? 'unlocked' : 'locked') + '">'
      + (unlocked 
          ? '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>'
          : '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>')
      + '</div>'
      + '<div class="badge-name">' + (unlocked ? esc(badge.name) : 'Locked Badge') + '</div>'
      + '<div class="badge-desc">' + (unlocked ? esc(badge.description) : 'Complete curriculum milestones to unlock.') + '</div>';
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
}

function refillHearts(){STATE.player.hearts=3;STATE.player.heartRefillTime=null;localSave();renderHearts();toast('Hearts refilled!');}

function resetProgress(){
  var name=STATE.player.name, diff=STATE.player.difficulty;
  STATE=freshState(name,diff,0);
  localSave();hideModal('modal-reset');renderAllAvatars();updateNav();showScreen('home');
  toast('Progress reset. Fresh start!');
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
      if (testCollapseIcon) testCollapseIcon.textContent = isCollapsed ? '▲' : '▼';
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
  var ce=ge('code-editor');
  if(ce){ce.addEventListener('keydown',function(e){if(e.key==='Tab'){e.preventDefault();var s=this.selectionStart,end=this.selectionEnd;this.value=this.value.substring(0,s)+'    '+this.value.substring(end);this.selectionStart=this.selectionEnd=s+4;}if(e.ctrlKey&&e.key==='Enter'){e.preventDefault();runCode();}});}
  var tplMap={'tpl-hello':'hello','tpl-variables':'variables','tpl-ifelse':'ifelse','tpl-loops':'loops','tpl-arrays':'arrays','tpl-methods':'methods','tpl-oop':'oop','tpl-scanner':'scanner'};
  Object.keys(tplMap).forEach(function(id){var b=ge(id);if(b){b.setAttribute('data-tpl',tplMap[id]);b.addEventListener('click',function(){loadTemplate(this.getAttribute('data-tpl'));});}});

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

  var geminiKeyInput = ge('gemini-key-input');
  var saveGeminiKeyBtn = ge('save-gemini-key-btn');
  var clearGeminiKeyBtn = ge('clear-gemini-key-btn');
  if (geminiKeyInput && typeof getGeminiKey === 'function') {
    geminiKeyInput.value = getGeminiKey();
  }
  if (saveGeminiKeyBtn) {
    saveGeminiKeyBtn.addEventListener('click', function(){
      var val = geminiKeyInput ? geminiKeyInput.value.trim() : '';
      if (!val) {
        toast('Please enter a valid Gemini API key');
        return;
      }
      localStorage.setItem('javaquest_gemini_key', val);
      toast('Gemini API key saved!');
    });
  }
  if (clearGeminiKeyBtn) {
    clearGeminiKeyBtn.addEventListener('click', function(){
      localStorage.removeItem('javaquest_gemini_key');
      if (geminiKeyInput) geminiKeyInput.value = '';
      toast('Gemini API key removed.');
    });
  }

  // ── MODALS ────────────────────────────────────────────────────
  var lvok=ge('levelup-ok-btn');         if(lvok)lvok.addEventListener('click',function(){hideModal('modal-levelup');});
  var bok=ge('badge-ok-btn');            if(bok)bok.addEventListener('click',function(){hideModal('modal-badge');});
  var cok=ge('complete-ok-btn');         if(cok)cok.addEventListener('click',function(){hideModal('modal-complete');showScreen('map');});
  var crok=ge('challenge-result-ok-btn');if(crok)crok.addEventListener('click',function(){hideModal('modal-challenge-result');showScreen('map');});
  var rcnl=ge('reset-cancel-btn');       if(rcnl)rcnl.addEventListener('click',function(){hideModal('modal-reset');});
  var rcon=ge('reset-confirm-btn');      if(rcon)rcon.addEventListener('click',resetProgress);

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
  var chs=ge('chat-send-btn');  if(chs)chs.addEventListener('click',function(){ if(typeof sendChatMessage==='function') sendChatMessage(); });
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
  if (chipReview) chipReview.addEventListener('click', function(){
    sendPromptToChat("Can you review the code I wrote in the editor? Check for errors, syntax issues, or bad practices and tell me how to improve it!");
  });
  var chipError = ge('chip-explain-error');
  if (chipError) chipError.addEventListener('click', function(){
    sendPromptToChat("I am getting an error or unexpected output with my current code. Can you explain what went wrong and how to fix it?");
  });
  var chipNext = ge('chip-next-step');
  if (chipNext) chipNext.addEventListener('click', function(){
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
