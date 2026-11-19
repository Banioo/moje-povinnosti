// Service worker: aplikace funguje i bez internetu.
// Při každé změně souborů zvyšte číslo verze, aby si telefony stáhly novou verzi.
const VERZE = 'moje-povinnosti-v10';
const SOUBORY = ['./', 'index.html', 'style.css', 'app.js', 'manifest.json', 'zasady-ochrany-udaju.html',
  'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERZE).then((c) => c.addAll(SOUBORY)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((klice) => Promise.all(klice.filter((k) => k !== VERZE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((okna) =>
    okna.length ? okna[0].focus() : self.clients.openWindow('./')));
});
