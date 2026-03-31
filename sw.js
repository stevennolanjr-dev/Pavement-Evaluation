const CACHE = ‘c17-pavt-v1’;
const ASSETS = [
‘/Pavement-Evaluation/’,
‘/Pavement-Evaluation/index.html’,
‘/Pavement-Evaluation/manifest.json’,
‘/Pavement-Evaluation/icon.svg’,
‘https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;500;600;700;800&family=Barlow:wght@300;400;500&display=swap’
];

self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE).then(c => {
// Cache what we can; don’t fail install if Google Fonts is unavailable
return Promise.allSettled(ASSETS.map(a => c.add(a).catch(() => {})));
})
);
self.skipWaiting();
});

self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
)
);
self.clients.claim();
});

self.addEventListener(‘fetch’, e => {
e.respondWith(
caches.match(e.request).then(cached => {
if (cached) return cached;
return fetch(e.request).then(res => {
if (res && res.status === 200 && res.type !== ‘opaque’) {
const clone = res.clone();
caches.open(CACHE).then(c => c.put(e.request, clone));
}
return res;
}).catch(() => caches.match(’/Pavement-Evaluation/index.html’));
})
);
});