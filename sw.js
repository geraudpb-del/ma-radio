// Garde la page en cache pour qu'elle s'ouvre vite ; les flux radio passent toujours par le réseau.
const CACHE = "ma-radio-v1";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "icone-192.png", "icone-512.png", "apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => {
    const copie = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); return r;
  }).catch(() => caches.match(e.request)));
});
