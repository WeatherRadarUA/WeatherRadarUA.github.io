// Service Worker для Погода UA
// Версія 2.0

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
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
];

// Встановлення Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
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
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обробка запитів
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Повертаємо кешований ресурс, якщо він є
                if (response) {
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
                );
            })
    );
});

// Обробка push-сповіщень
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title || 'Погода UA';
    const options = {
        body: data.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: data.url ? { url: data.url } : {}
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Обробка кліку по сповіщенню
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.notification.data.url) {
        clients.openWindow(event.notification.data.url);
    } else {
        clients.openWindow('/');
    }
});

// Обробка закриття сповіщення
self.addEventListener('notificationclose', (event) => {
    // Можна відправити аналітику
});

// Обробка помилок
self.addEventListener('error', (error) => {
    console.error('Service Worker error:', error);
});

// Обробка синхронізації в фоновому режимі
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-weather') {
        event.waitUntil(
            // Можна синхронізувати дані
            Promise.resolve()
        );
    }
});

// Обробка періодичної синхронізації
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'weather-update') {
        event.waitUntil(
            // Оновлюємо погоду в фоновому режимі
            Promise.resolve()
        );
    }
});
