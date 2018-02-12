const cacheName = 'users'
const dataCacheName = 'usersData-v1';
const dataPath = '/api/user'

const filesToCache = [
    '/',
    '/dist/app.js',
    '/dist/font/material-icons.woff2',
    '/dist/font/material-icons.woff',
    '/images/demo.jpg',
]

self.addEventListener('install', e => {
    console.log('[service worker] install')
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('[service worker] caching app shell')
            return cache.addAll(filesToCache)
        })
    )
})

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key)
                }
            }))
        })
    )
    return self.clients.claim()
});

self.addEventListener('fetch', e => {
    console.log('[ServiceWorker] Fetch', e.request.url);
    if (e.request.url.indexOf(dataPath) > -1) {
        e.respondWith(
            caches.open(dataCacheName).then(cache => {
                return fetch(e.request).then(response => {
                    cache.put(e.request.url, response.clone())
                    return response
                })
            })
        )
    } else {
        e.respondWith(
            caches.match(e.request).then(response => {
                return response || fetch(e.request);
            })
        );
    }
});