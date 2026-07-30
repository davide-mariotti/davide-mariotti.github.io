// Service Worker for offline support
const CACHE_NAME = 'lupo-solitario-v2';
const urlsToCache = [
    './',
    './index.html',
    './src/styles/main.css',
    './src/styles/layout.css',
    './src/app.js',
    './src/firebase-config.js',
    './src/auth.js',
    './src/game-state.js',
    './src/save-manager.js',
    './src/book-loader.js',
    './src/utils/screen-manager.js',
    './src/utils/menu-manager.js',
    './src/utils/ui-helpers.js',
    './src/components/character-creator.js',
    './src/components/character-sheet.js',
    './src/components/story-reader.js',
    './src/components/combat-manager.js',
    './src/components/destiny-table.js',
    './src/components/book2-transition.js',
    './src/components/book3-transition.js',
    './src/components/book4-transition.js',
    './src/components/book5-transition.js',
    './manifest.json'
];

// Install event - cache resources and take control immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Cache opened:', CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
            .catch((error) => console.warn('⚠️ Error caching initial resources:', error))
    );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('🧹 Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network first for app code/resources, fallback to cache
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only process GET requests with http or https protocol (ignore chrome-extension://, etc.)
    if (request.method !== 'GET') return;
    if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) return;

    event.respondWith(
        fetch(request)
            .then((response) => {
                // If response is valid, update cache in background
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(request, responseToCache)
                                .catch((err) => console.warn('Cache put skipped:', err));
                        })
                        .catch(() => {});
                }
                return response;
            })
            .catch(() => {
                // Network failed or offline - return from cache
                return caches.match(request);
            })
    );
});
