// Cho phép app mở được khi mất mạng (ảnh/GIF/video vẫn cần mạng).
const VERSION = 'hnn-v2';
const SHELL = [
  './', 'index.html', 'css/style.css', 'firebase-config.js', 'manifest.webmanifest',
  'js/app.js', 'js/langs.js', 'js/audio.js', 'js/store.js', 'js/media.js', 'js/sync.js',
  'js/data/lessons.js', 'js/data/scripts.js', 'icons/icon.svg', 'icons/icon-192.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    // mạng trước, lỗi mạng thì dùng bản đã lưu -> luôn có bản mới nhất khi online
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else if (/upload\.wikimedia\.org/.test(url.host) && e.request.destination === 'image') {
    // ảnh Wikimedia: lưu lại để lần sau xem không cần mạng
    e.respondWith(caches.open(VERSION + '-img').then(async c => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok || res.type === 'opaque') c.put(e.request, res.clone());
      return res;
    }).catch(() => fetch(e.request)));
  }
});
