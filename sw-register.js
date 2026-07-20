// Реєстрація Service Worker

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Чекаємо, поки сторінка повністю завантажиться
        setTimeout(function() {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                    
                    // Перевірка оновлень
                    registration.onupdatefound = function() {
                        const installingWorker = registration.installing;
                        
                        installingWorker.onstatechange = function() {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // Нова версія доступна
                                    console.log('New ServiceWorker version available');
                                    showUpdateNotification();
                                }
                            }
                        };
                    };
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        }, 1000);
    });
}

// Показ сповіщення про оновлення
function showUpdateNotification() {
    // Можна показати toast або модальне вікно
    if (window.weatherApp && window.weatherApp.showToast) {
        window.weatherApp.showToast('Доступна нова версія! Оновіть сторінку', 'info');
    }
}

// Перевірка оновлень при завантаженні
function checkForUpdates() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'check-for-updates' });
    }
}

// Оновлення сторінки
function refreshPage() {
    window.location.reload(true);
}
