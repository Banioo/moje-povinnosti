// Service worker: aplikace funguje i bez internetu.
// Postup „nejdřív síť“: s internetem se vždy načte nejnovější verze z webu,
// uložená kopie se použije jen bez internetu. Nové verze se tak projeví hned.
const VERZE = 'moje-povinnosti-v17';
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
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((odpoved) => {
        if (odpoved.ok) {
          const kopie = odpoved.clone();
          caches.open(VERZE).then((c) => c.put(req, kopie));
        }
        return odpoved;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./')))
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((okna) =>
    okna.length ? okna[0].focus() : self.clients.openWindow('./')));
});
