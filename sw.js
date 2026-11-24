// JavaQst Service Worker — Offline Shell & Mobile PWA / TWA Support
const CACHE_NAME = 'javaqst-cache-v1.4';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/curriculum.js',
  '/animations.js',
  '/supabase.js',
  '/ai-tutor.js',
  '/adventure-trail.js',
  '/meowger.js',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/lib/editor.bundle.js',
  '/lib/game-fx.js'
];

// Install: Cache app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching partial failure:', err);
      });
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for shell/pages, Network-only for API endpoints
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never intercept or cache API calls (compiler runs, AI chat, auth)
  if (url.pathname.startsWith('/api/') || req.method !== 'GET') {
    return;
  }

  // Network-First with Cache Fallback for HTML/CSS/JS shell
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      })
      .catch(() => {
        return caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (req.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
