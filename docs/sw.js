// Service worker – wersja 0f8b3749df
const CACHE = 'odkryj-0f8b3749df';
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "data/at.js?v=0f8b3749df", "data/cz.js?v=0f8b3749df", "data/it.js?v=0f8b3749df", "data/nl.js?v=0f8b3749df", "data/sk.js?v=0f8b3749df", "data/si.js?v=0f8b3749df", "data/de.js?v=0f8b3749df"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // najpierw sieć (świeża wersja), potem pamięć podręczna
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; }).catch(() => caches.match(req).then((r) => r || caches.match('index.html'))));
  } else if (url.host.includes('fonts.')) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return res; })));
  }
});
