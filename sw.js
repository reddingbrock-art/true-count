// Offline support. Same-origin files: network first, so a new deploy shows up
// on the next open, with the cached copy as the offline fallback. Fonts: cache first.
// Requests to the sync backend are not touched.
const CACHE = 'true-count-v1';
const SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const put = res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; };
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(put).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
  } else if (isFont) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(put)));
  }
});
