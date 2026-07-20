// Service Worker для Погода UA
// Версія 2.0 - Оптимізований для GitHub Pages

const CACHE_NAME = 'weatherua-v2.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/map.html',
    '/style.css',
    '/app.js',
    '/map.js',
    '/i18n.js',
    '/weather-icons.js',
    '/favicon.ico',
    '/manifest.json'
];

// Встановлення Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => {
                console.log('Service Worker: Cache failed', error);
            })
    );
});

// Активація Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обробка запитів - НЕ кешувати зовнішні ресурси (CDN)
self.addEventListener('fetch', (event) => {
    // Не кешувати API запити
    if (event.request.url.includes('open-meteo.com') ||
        event.request.url.includes('geocoding-api.open-meteo.com') ||
        event.request.url.includes('air-quality-api.open-meteo.com') ||
        event.request.url.includes('overpass-api.de') ||
        event.request.url.includes('ventusky.com') ||
        event.request.url.includes('unpkg.com') ||
        event.request.url.includes('cdnjs.cloudflare.com') ||
        event.request.url.includes('fonts.googleapis.com') ||
        event.request.url.includes('fonts.gstatic.com')) {
        
        // Для API - просто пропускаємо запит до мережі
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Для статичних файлів - спробуємо кеш, потім мережа
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Повертаємо кешований ресурс, якщо він є
                if (response) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return response;
                }
                
                // Клонуємо запит
                const fetchRequest = event.request.clone();
                
                // Робимо запит до мережі
                return fetch(fetchRequest).then(
                    (response) => {
                        // Не кешуємо POST запити
                        if (!event.request.method || event.request.method === 'GET') {
                            // Клонуємо відповідь
                            const responseToCache = response.clone();
                            
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        
                        return response;
                    }
                ).catch((error) => {
                    console.log('Service Worker: Fetch failed', error);
                    // Якщо не вдалося завантажити - повертаємо пусту відповідь
                    return new Response('', { status: 404 });
                });
            })
    );
});

// Обробка помилок
self.addEventListener('error', (error) => {
    console.error('Service Worker error:', error);
});
