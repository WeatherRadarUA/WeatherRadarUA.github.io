// ============================================
// Погода UA - Головний JavaScript файл
// ============================================

// Глобальні змінні
var lastData = null;
var activeDayIndex = 0;
var currentPlace = null;
var favorites = [];
var recentSearches = [];
var currentTheme = "light";
var weatherSound = null;

// Fallback функція перекладу, якщо i18n.js не завантажився
function t(key) {
    // Спробуємо використати глобальну функцію з i18n.js
    if (typeof window.t === 'function') {
        return window.t(key);
    }
    // Fallback переклади
    var fallbackTranslations = {
        loading: "Завантаження...",
        searching: "Шукаємо...",
        noResults: "Нічого не знайдено",
        loadingWeather: "Завантажуємо прогноз...",
        errorWeather: "Не вдалося завантажити погоду",
        errorLocation: "Не вдалося визначити місцезнаходження",
        errorGeolocation: "Увімкніть геолокацію в браузері",
        feelsLike: "Відчувається як",
        maxTemp: "Макс:",
        minTemp: "Мін:",
        humidity: "Вологість:",
        wind: "Вітер:",
        sunrise: "Схід сонця:",
        sunset: "Захід сонця:",
        dayLength: "Тривалість дня:",
        uvIndex: "УФ-індекс",
        airQuality: "Якість повітря",
        visibility: "Видимість:",
        precipitation: "Опади:",
        next24h: "Погодинний прогноз на 24 години",
        dayParts: "Прогноз за частинами дня",
        forecast14: "Прогноз на 14 днів",
        recentSearches: "Останні пошуки:",
        noFavorites: "У вас поки що немає улюблених місць",
        addToFavorites: "Додати в улюблені",
        removeFromFavorites: "Видалити з улюблених",
        useCurrentLocation: "Використано ваше місцезнаходження",
        voiceNotSupported: "Голосовий пошук не підтримується",
        voiceError: "Помилка розпізнавання голосу",
        zoomHint: "Наближте карту, щоб побачити більше населених пунктів",
        loadingVillages: "Завантажуємо населені пункти...",
        radarTitle: "Радар опадів",
        radarInfo: "Радар показує опади в реальному часі",
        warningsTitle: "Попередження про погоду",
        warningExample: "Наразі попереджень немає",
        warningExampleText: "Попередження про небезпечну погоду з'являться тут",
        siteName: "Погода UA",
        navSearch: "Пошук",
        navMap: "Карта",
        navRadar: "Радар",
        navWarnings: "Попередження",
        heroTitle: "Сучасний прогноз погоди для України",
        heroSubtitle: "Точні дані, інтерактивна карта, радар опадів",
        feature1: "25+ тис. населених пунктів",
        feature2: "Радар опадів в реальному часі",
        feature3: "Попередження про небезпеку",
        searchPlaceholder: "Введіть назву міста або села...",
        today: "Сьогодні",
        tomorrow: "Завтра",
        morning: "Ранок",
        day: "День",
        evening: "Вечір",
        night: "Ніч",
        kmh: "км/г",
        mm: "мм",
        ukraine: "Україна",
        dataSources: "Джерела даних",
        dataSourcesText: "Дані надаються Open-Meteo, OpenStreetMap та іншими відкритими джерелами",
        about: "Про нас",
        feedback: "Зворотний зв'язок",
        footerData: "Дані: Open-Meteo · OpenStreetMap · Ventusky"
    };
    return fallbackTranslations[key] || key;
}

// Ініціалізація при завантаженні сторінки
document.addEventListener("DOMContentLoaded", function () {
    // Приховуємо екран завантаження відразу
    hideLoadingScreen();
    
    // Застосовуємо переклади
    applyTranslations();
    
    // Рендеримо перемикач мов
    renderLangSwitch("langSwitch", function () {
        applyTranslations();
        if (currentPlace) {
            showWeatherFor(currentPlace);
        }
    });
    
    // Завантажуємо збережені дані
    loadSavedData();
    
    // Визначення теми
    initTheme();
    
    // Ініціалізація пошуку
    initSearch();
    
    // Ініціалізація геолокації
    initGeolocation();
    
    // Ініціалізація улюблених
    initFavorites();
    
    // Ініціалізація модальних вікон
    initModals();
    
    // Ініціалізація скролів
    initScroll();
    
    // Ініціалізація звуків
    initSounds();
    
    // Ініціалізація сповіщень
    initNotifications();
    
    // Реєстрація Service Worker
    registerServiceWorker();
    
    // Перевірка оновлень
    checkForUpdates();
});

// Функція для приховування екрану завантаження
function hideLoadingScreen() {
    var loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
        loadingScreen.classList.add("hidden");
    }
}

// Реєстрація Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        setTimeout(function () {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        }, 2000);
    }
}

// ============================================
// Завантаження збережених даних
// ============================================
function loadSavedData() {
    // Улюблені місця
    var savedFavorites = localStorage.getItem("weatherua_favorites");
    if (savedFavorites) {
        try {
            favorites = JSON.parse(savedFavorites);
        } catch (e) {
            favorites = [];
        }
    }
    
    // Останні пошуки
    var savedRecent = localStorage.getItem("weatherua_recent");
    if (savedRecent) {
        try {
            recentSearches = JSON.parse(savedRecent);
        } catch (e) {
            recentSearches = [];
        }
    }
    
    // Останнє вибране місце
    var savedPlace = localStorage.getItem("weatherua_lastPlace");
    if (savedPlace) {
        try {
            currentPlace = JSON.parse(savedPlace);
        } catch (e) {
            currentPlace = null;
        }
    }
    
    // Оновлюємо лічильник улюблених
    updateFavCount();
    
    // Рендеримо останні пошуки
    renderRecentSearches();
    
    // Якщо є збережене місце, показуємо погоду для нього
    if (currentPlace) {
        showWeatherFor(currentPlace);
    }
}

// ============================================
// Тема
// ============================================
function initTheme() {
    var savedTheme = localStorage.getItem("weatherua_theme");
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // Визначення мови браузера
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = "dark";
        }
    }
    
    applyTheme();
    
    // Додаємо слухач для зміни системної теми
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (currentTheme === "auto") {
                applyTheme();
            }
        });
    }
    
    // Кнопка перемикання теми
    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentTheme === "light") {
                currentTheme = "dark";
            } else if (currentTheme === "dark") {
                currentTheme = "auto";
            } else {
                currentTheme = "light";
            }
            localStorage.setItem("weatherua_theme", currentTheme);
            applyTheme();
            showToast(t("theme" + currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)));
        });
    }
}

function applyTheme() {
    var html = document.documentElement;
    
    if (currentTheme === "dark") {
        html.setAttribute("data-theme", "dark");
    } else if (currentTheme === "light") {
        html.removeAttribute("data-theme");
    } else {
        // Auto - використовуємо системну тему
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.setAttribute("data-theme", "dark");
        } else {
            html.removeAttribute("data-theme");
        }
    }
    
    // Оновлюємо іконку кнопки теми
    var themeIcon = document.querySelector(".theme-toggle i");
    if (themeIcon) {
        if (currentTheme === "dark") {
            themeIcon.className = "fas fa-sun";
        } else if (currentTheme === "light") {
            themeIcon.className = "fas fa-moon";
        } else {
            themeIcon.className = "fas fa-adjust";
        }
    }
}

// ============================================
// Пошук
// ============================================
function initSearch() {
    var input = document.getElementById("cityInput");
    var suggestionsBox = document.getElementById("suggestions");
    var clearBtn = document.getElementById("clearSearch");
    var voiceBtn = document.getElementById("voiceBtn");
    
    if (!input) return;
    
    var debounceTimer = null;
    
    input.addEventListener("input", function () {
        var query = input.value.trim();
        clearTimeout(debounceTimer);
        
        if (query.length < 2) {
            if (suggestionsBox) {
                suggestionsBox.classList.remove("show");
                suggestionsBox.innerHTML = "";
            }
            if (clearBtn) clearBtn.classList.remove("show");
            return;
        }
        
        if (clearBtn) clearBtn.classList.add("show");
        
        debounceTimer = setTimeout(function () {
            searchCities(query);
        }, 400);
    });
    
    input.addEventListener("focus", function () {
        if (input.value.trim().length >= 2) {
            searchCities(input.value.trim());
        }
        renderRecentSearches(true);
    });
    
    input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (suggestionsBox) suggestionsBox.classList.remove("show");
            input.blur();
        }
        if (e.key === "Enter" && input.value.trim().length >= 2) {
            // Автоматичний пошук при натисканні Enter
            var query = input.value.trim();
            if (suggestionsBox) {
                suggestionsBox.classList.remove("show");
                suggestionsBox.innerHTML = "";
            }
            // Шукаємо перше місто з цим ім'ям
            searchCitiesAndSelectFirst(query);
        }
    });
    
    // Очищення пошуку
    if (clearBtn) {
        clearBtn.addEventListener("click", function (e) {
            e.preventDefault();
            input.value = "";
            input.focus();
            if (suggestionsBox) {
                suggestionsBox.classList.remove("show");
                suggestionsBox.innerHTML = "";
            }
            if (clearBtn) clearBtn.classList.remove("show");
        });
    }
    
    // Голосовий пошук
    if (voiceBtn) {
        voiceBtn.addEventListener("click", function (e) {
            e.preventDefault();
            startVoiceSearch();
        });
    }
    
    // Клік поза межами
    document.addEventListener("click", function (e) {
        if (suggestionsBox && !suggestionsBox.contains(e.target) && e.target !== input) {
            suggestionsBox.classList.remove("show");
        }
    });
}

function searchCities(query) {
    var lang = getCurrentLang();
    var url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(query) + "&count=8&language=" + lang + "&format=json";
    
    var suggestionsBox = document.getElementById("suggestions");
    if (suggestionsBox) {
        suggestionsBox.innerHTML = "<div class='suggestion-item'><i class='fas fa-spinner fa-spin'></i> " + t("searching") + "</div>";
        suggestionsBox.classList.add("show");
    }
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            renderSuggestions(data.results || []);
        })
        .catch(function () {
            if (suggestionsBox) {
                suggestionsBox.innerHTML = "<div class='suggestion-item'><i class='fas fa-exclamation-triangle'></i> " + t("noResults") + "</div>";
            }
        });
}

function searchCitiesAndSelectFirst(query) {
    var lang = getCurrentLang();
    var url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(query) + "&count=1&language=" + lang + "&format=json";
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.results && data.results.length > 0) {
                var place = data.results[0];
                currentPlace = place;
                activeDayIndex = 0;
                showWeatherFor(place);
                addToRecentSearches(place);
            } else {
                showToast(t("noResults"), "error");
            }
        })
        .catch(function () {
            showToast(t("errorWeather"), "error");
        });
}

function renderSuggestions(results) {
    var suggestionsBox = document.getElementById("suggestions");
    if (!suggestionsBox) return;
    
    if (!results.length) {
        suggestionsBox.innerHTML = "<div class='suggestion-item'><i class='fas fa-exclamation-triangle'></i> " + t("noResults") + "</div>";
        return;
    }
    
    suggestionsBox.innerHTML = "";
    
    results.forEach(function (place) {
        var item = document.createElement("div");
        item.className = "suggestion-item";
        
        var subParts = [];
        if (place.admin1) subParts.push(place.admin1);
        if (place.country) subParts.push(place.country);
        
        var isFavorite = isPlaceInFavorites(place);
        
        item.innerHTML = "<div>" + 
            (isFavorite ? "<i class='fas fa-heart' style='color: var(--danger); margin-right: 8px;'></i>" : "") +
            place.name + "</div>" +
            "<div class='sub'>" + subParts.join(", ") + "</div>";
        
        item.addEventListener("click", function () {
            var input = document.getElementById("cityInput");
            if (input) input.value = place.name;
            suggestionsBox.classList.remove("show");
            currentPlace = place;
            activeDayIndex = 0;
            showWeatherFor(place);
            addToRecentSearches(place);
        });
        
        suggestionsBox.appendChild(item);
    });
}

// ============================================
// Останні пошуки
// ============================================
function renderRecentSearches(showEmpty = false) {
    var recentContainer = document.getElementById("recentSearches");
    var recentList = document.getElementById("recentList");
    
    if (!recentContainer || !recentList) return;
    
    if (recentSearches.length === 0) {
        if (showEmpty) {
            recentContainer.classList.add("show");
            recentList.innerHTML = "<div class='empty-state'>" + t("noFavorites").replace("улюблених", "останніх") + "</div>";
        } else {
            recentContainer.classList.remove("show");
        }
        return;
    }
    
    recentContainer.classList.add("show");
    recentList.innerHTML = "";
    
    recentSearches.forEach(function (place, index) {
        var item = document.createElement("div");
        item.className = "recent-item";
        
        var subParts = [];
        if (place.admin1) subParts.push(place.admin1);
        if (place.country) subParts.push(place.country);
        
        item.innerHTML = "<span>" + place.name + "</span>" +
            "<span class='remove' data-index='" + index + "'><i class='fas fa-times'></i></span>";
        
        item.addEventListener("click", function (e) {
            if (e.target.classList.contains("remove") || e.target.parentElement.classList.contains("remove")) {
                removeFromRecentSearches(index);
            } else {
                var input = document.getElementById("cityInput");
                if (input) input.value = place.name;
                currentPlace = place;
                activeDayIndex = 0;
                showWeatherFor(place);
            }
        });
        
        recentList.appendChild(item);
    });
}

function addToRecentSearches(place) {
    // Видаляємо, якщо вже існує
    recentSearches = recentSearches.filter(function (p) {
        return p.name !== place.name || p.latitude !== place.latitude || p.longitude !== place.longitude;
    });
    
    // Додаємо нове
    recentSearches.unshift(place);
    
    // Обмежуємо кількість
    if (recentSearches.length > 10) {
        recentSearches = recentSearches.slice(0, 10);
    }
    
    // Зберігаємо
    localStorage.setItem("weatherua_recent", JSON.stringify(recentSearches));
    
    // Оновлюємо відображення
    renderRecentSearches();
}

function removeFromRecentSearches(index) {
    recentSearches.splice(index, 1);
    localStorage.setItem("weatherua_recent", JSON.stringify(recentSearches));
    renderRecentSearches();
}

// ============================================
// Голосовий пошук
// ============================================
function startVoiceSearch() {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    if (!recognition) {
        showToast(t("voiceNotSupported"), "error");
        return;
    }
    
    recognition.lang = getCurrentLang();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    var input = document.getElementById("cityInput");
    if (input) input.value = t("listening");
    
    recognition.start();
    
    recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        if (input) {
            input.value = transcript;
            searchCitiesAndSelectFirst(transcript);
        }
    };
    
    recognition.onerror = function (event) {
        showToast(t("voiceError"), "error");
    };
    
    recognition.onend = function () {
        // Можна перезапустити
    };
}

// ============================================
// Геолокація
// ============================================
function initGeolocation() {
    var geolocBtn = document.getElementById("geolocBtn");
    if (geolocBtn) {
        geolocBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            getCurrentLocation();
        });
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showToast(t("errorGeolocation"), "error");
        return;
    }
    
    var statusMsg = document.getElementById("statusMsg");
    if (statusMsg) {
        statusMsg.textContent = t("loading");
        statusMsg.style.display = "block";
        statusMsg.className = "status-msg";
    }
    
    navigator.geolocation.getCurrentPosition(
        function (position) {
            if (statusMsg) {
                statusMsg.style.display = "none";
            }
            
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            
            // Шукаємо найближче місто
            reverseGeocode(lat, lon);
        },
        function (error) {
            if (statusMsg) {
                statusMsg.textContent = t("errorLocation");
                statusMsg.className = "status-msg error";
            }
            showToast(t("errorLocation"), "error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function reverseGeocode(lat, lon) {
    var lang = getCurrentLang();
    var url = "https://geocoding-api.open-meteo.com/v1/search?latitude=" + lat + 
              "&longitude=" + lon + "&count=1&language=" + lang + "&format=json";
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.results && data.results.length > 0) {
                var place = data.results[0];
                currentPlace = place;
                activeDayIndex = 0;
                showWeatherFor(place);
                addToRecentSearches(place);
                showToast(t("useCurrentLocation"));
            } else {
                // Якщо не знайдено місто, використовуємо координати безпосередньо
                var place = {
                    name: t("ukraine"),
                    latitude: lat,
                    longitude: lon,
                    admin1: null,
                    country: t("ukraine")
                };
                currentPlace = place;
                activeDayIndex = 0;
                showWeatherFor(place);
            }
        })
        .catch(function () {
            showToast(t("errorLocation"), "error");
        });
}

// ============================================
// Улюблені місця
// ============================================
function initFavorites() {
    var favBtn = document.getElementById("favoritesBtn");
    var favToggle = document.getElementById("favToggle");
    var favSidebar = document.getElementById("favoritesSidebar");
    var closeFav = document.getElementById("closeFavorites");
    
    // Кнопка улюблених в хедери
    if (favBtn) {
        favBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavoritesSidebar();
        });
    }
    
    // Перемикач улюблених на картці погоди
    if (favToggle) {
        favToggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite();
        });
    }
    
    // Закриття сайдбару
    if (closeFav) {
        closeFav.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeFavoritesSidebar();
        });
    }
    
    // Рендеримо улюблені
    renderFavorites();
}

function toggleFavoritesSidebar() {
    var sidebar = document.getElementById("favoritesSidebar");
    if (sidebar) {
        sidebar.classList.toggle("show");
    }
}

function closeFavoritesSidebar() {
    var sidebar = document.getElementById("favoritesSidebar");
    if (sidebar) {
        sidebar.classList.remove("show");
    }
}

function toggleFavorite() {
    if (!currentPlace) return;
    
    var favToggle = document.getElementById("favToggle");
    
    if (isPlaceInFavorites(currentPlace)) {
        removeFromFavorites(currentPlace);
        if (favToggle) {
            favToggle.innerHTML = "<i class='far fa-heart'></i>";
            favToggle.title = t("addToFavorites");
        }
        showToast(t("removeFromFavorites"));
    } else {
        addToFavorites(currentPlace);
        if (favToggle) {
            favToggle.innerHTML = "<i class='fas fa-heart' style='color: var(--danger);'></i>";
            favToggle.title = t("removeFromFavorites");
        }
        showToast(t("addToFavorites"));
    }
    
    updateFavCount();
    renderFavorites();
}

function isPlaceInFavorites(place) {
    return favorites.some(function (fav) {
        return fav.name === place.name && 
               fav.latitude === place.latitude && 
               fav.longitude === place.longitude;
    });
}

function addToFavorites(place) {
    if (isPlaceInFavorites(place)) return;
    
    favorites.push(place);
    localStorage.setItem("weatherua_favorites", JSON.stringify(favorites));
}

function removeFromFavorites(place) {
    favorites = favorites.filter(function (fav) {
        return fav.name !== place.name || 
               fav.latitude !== place.latitude || 
               fav.longitude !== place.longitude;
    });
    localStorage.setItem("weatherua_favorites", JSON.stringify(favorites));
}

function updateFavCount() {
    var favCount = document.getElementById("favCount");
    if (favCount) {
        favCount.textContent = favorites.length;
    }
}

function renderFavorites() {
    var favList = document.getElementById("favoritesList");
    if (!favList) return;
    
    if (favorites.length === 0) {
        favList.innerHTML = "<div class='empty-state'>" + t("noFavorites") + "</div>";
        return;
    }
    
    favList.innerHTML = "";
    
    favorites.forEach(function (place, index) {
        var item = document.createElement("div");
        item.className = "favorite-item";
        
        var subParts = [];
        if (place.admin1) subParts.push(place.admin1);
        if (place.country) subParts.push(place.country);
        
        item.innerHTML = "<i class='fas fa-map-marker-alt fav-icon'></i>" +
            "<div class='fav-info'>" +
                "<div class='fav-name'>" + place.name + "</div>" +
                "<div class='fav-sub'>" + subParts.join(", ") + "</div>" +
            "</div>" +
            "<button class='remove-fav' data-index='" + index + "'><i class='fas fa-trash'></i></button>";
        
        item.addEventListener("click", function (e) {
            if (e.target.classList.contains("remove-fav") || 
                e.target.parentElement.classList.contains("remove-fav")) {
                var idx = parseInt(e.target.getAttribute("data-index") || 
                            e.target.parentElement.getAttribute("data-index"));
                removeFromFavorites(favorites[idx]);
                renderFavorites();
                updateFavCount();
                closeFavoritesSidebar();
            } else {
                currentPlace = place;
                activeDayIndex = 0;
                showWeatherFor(place);
                closeFavoritesSidebar();
                addToRecentSearches(place);
            }
        });
        
        favList.appendChild(item);
    });
}

// ============================================
// Модальні вікна
// ============================================
function initModals() {
    // Радар
    var radarBtn = document.getElementById("radarBtn");
    var radarModal = document.getElementById("radarModal");
    var closeRadar = document.getElementById("closeRadar");
    
    if (radarBtn && radarModal) {
        radarBtn.addEventListener("click", function (e) {
            e.preventDefault();
            radarModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    }
    
    if (closeRadar && radarModal) {
        closeRadar.addEventListener("click", function (e) {
            e.preventDefault();
            radarModal.classList.remove("show");
            document.body.style.overflow = "";
        });
    }
    
    // Попередження
    var warningsBtn = document.getElementById("warningsBtn");
    var warningsModal = document.getElementById("warningsModal");
    var closeWarnings = document.getElementById("closeWarnings");
    
    if (warningsBtn && warningsModal) {
        warningsBtn.addEventListener("click", function (e) {
            e.preventDefault();
            warningsModal.classList.add("show");
            document.body.style.overflow = "hidden";
            loadWarnings();
        });
    }
    
    if (closeWarnings && warningsModal) {
        closeWarnings.addEventListener("click", function (e) {
            e.preventDefault();
            warningsModal.classList.remove("show");
            document.body.style.overflow = "";
        });
    }
    
    // Закриття по кліку поза модальним вікном
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("modal")) {
            e.target.classList.remove("show");
            document.body.style.overflow = "";
        }
    });
    
    // Закриття по Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            var modals = document.querySelectorAll(".modal.show");
            modals.forEach(function (modal) {
                modal.classList.remove("show");
            });
            document.body.style.overflow = "";
        }
    });
}

function loadWarnings() {
    var warningsList = document.getElementById("warningsList");
    if (warningsList) {
        warningsList.innerHTML = "<div class='warning-item info'>" +
            "<div class='warning-icon'><i class='fas fa-info-circle'></i></div>" +
            "<div class='warning-content'>" +
                "<h4>" + t("warningExample") + "</h4>" +
                "<p>" + t("warningExampleText") + "</p>" +
            "</div>" +
            "</div>";
    }
}

// ============================================
// Скрол
// ============================================
function initScroll() {
    var hourlyScroll = document.getElementById("hourlyScroll");
    var scrollLeft = document.getElementById("hourlyScrollLeft");
    var scrollRight = document.getElementById("hourlyScrollRight");
    
    if (hourlyScroll && scrollLeft && scrollRight) {
        scrollLeft.addEventListener("click", function (e) {
            e.preventDefault();
            hourlyScroll.scrollBy({ left: -200, behavior: "smooth" });
        });
        
        scrollRight.addEventListener("click", function (e) {
            e.preventDefault();
            hourlyScroll.scrollBy({ left: 200, behavior: "smooth" });
        });
    }
}

// ============================================
// Звуки
// ============================================
function initSounds() {
    weatherSound = document.getElementById("weatherSound");
}

function playWeatherSound(code) {
    if (!weatherSound) return;
    
    var soundUrl = getWeatherSound(code);
    if (!soundUrl) {
        weatherSound.pause();
        return;
    }
    
    weatherSound.src = soundUrl;
    weatherSound.play().catch(function (e) {
        console.log("Audio playback failed:", e);
    });
}

// ============================================
// Сповіщення
// ============================================
function initNotifications() {
    if (!("Notification" in window)) return;
    
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            console.log("Notification permission granted");
        }
    });
}

function showNotification(title, body) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    
    new Notification(title, {
        body: body,
        icon: "favicon.ico",
        badge: "favicon.ico"
    });
}

// ============================================
// Toast сповіщення
// ============================================
function showToast(message, type = "info") {
    var toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;
    
    var toast = document.createElement("div");
    toast.className = "toast " + type;
    
    var iconClass = "fa-info-circle";
    if (type === "success") iconClass = "fa-check-circle";
    if (type === "error") iconClass = "fa-exclamation-circle";
    if (type === "warning") iconClass = "fa-exclamation-triangle";
    
    toast.innerHTML = "<i class='fas " + iconClass + " toast-icon'></i>" +
                     "<span class='toast-message'>" + message + "</span>" +
                     "<button class='toast-close'><i class='fas fa-times'></i></button>";
    
    toastContainer.appendChild(toast);
    
    // Автоматичне закриття
    setTimeout(function () {
        toast.style.animation = "slideInRight 0.3s ease reverse";
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 3000);
    
    // Закриття по кліку
    var closeBtn = toast.querySelector(".toast-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            toast.style.animation = "slideInRight 0.3s ease reverse";
            setTimeout(function () {
                toast.remove();
            }, 300);
        });
    }
}

// ============================================
// Перевірка оновлень
// ============================================
function checkForUpdates() {
    // Перевірка оновлень PWA
    if (window.caches) {
        caches.keys().then(function (cacheNames) {
            cacheNames.forEach(function (cacheName) {
                caches.delete(cacheName);
            });
        });
    }
    
    // Перевірка нової версії
    if (localStorage.getItem("weatherua_version") !== "2.0") {
        localStorage.setItem("weatherua_version", "2.0");
    }
}

// ============================================
// Показ погоди
// ============================================
function showWeatherFor(place) {
    var resultCard = document.getElementById("resultCard");
    var statusMsg = document.getElementById("statusMsg");
    
    if (resultCard) {
        resultCard.classList.remove("show");
    }
    
    if (statusMsg) {
        statusMsg.textContent = t("loadingWeather");
        statusMsg.style.display = "block";
        statusMsg.className = "status-msg";
    }
    
    currentPlace = place;
    localStorage.setItem("weatherua_lastPlace", JSON.stringify(place));
    
    // Оновлюємо кнопку улюблених
    updateFavoriteButton();
    
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude +
        "&longitude=" + place.longitude +
        "&current=temperature_2m,weathercode,apparent_temperature,relativehumidity_2m,windspeed_10m,winddirection_10m,visibility,precipitation,pressure_msl" +
        "&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m,relativehumidity_2m" +
        "&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,uv_index_max,precipitation_probability_max,precipitation_sum" +
        "&forecast_days=14&timezone=auto";
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            lastData = data;
            renderResult(place, data);
            if (statusMsg) {
                statusMsg.style.display = "none";
            }
            loadAirQuality(place);
            
            // Визначення фонової анімації
            updateBackgroundAnimation(data.current.weathercode);
            
            // Відтворення звуку погоди
            playWeatherSound(data.current.weathercode);
        })
        .catch(function () {
            if (statusMsg) {
                statusMsg.textContent = t("errorWeather");
                statusMsg.className = "status-msg error";
            }
            showToast(t("errorWeather"), "error");
        });
}

function updateFavoriteButton() {
    var favToggle = document.getElementById("favToggle");
    if (!favToggle || !currentPlace) return;
    
    if (isPlaceInFavorites(currentPlace)) {
        favToggle.innerHTML = "<i class='fas fa-heart' style='color: var(--danger);'></i>";
        favToggle.title = t("removeFromFavorites");
    } else {
        favToggle.innerHTML = "<i class='far fa-heart'></i>";
        favToggle.title = t("addToFavorites");
    }
}

function updateBackgroundAnimation(weathercode) {
    var bg = document.getElementById("animatedBg");
    var sunMoon = document.getElementById("sunMoon");
    var stars = document.getElementById("stars");
    
    if (!bg) return;
    
    // Видаляємо всі попередні анімації
    bg.className = "animated-bg";
    
    // Додаємо класи в залежності від погоди
    if (weathercode >= 0 && weathercode <= 3) {
        // Ясно або хмарно
        bg.classList.add("clear-sky");
        if (sunMoon) sunMoon.textContent = "☀️";
    } else if (weathercode >= 45 && weathercode <= 48) {
        // Туман
        bg.classList.add("fog");
    } else if (weathercode >= 51 && weathercode <= 82) {
        // Дощ
        bg.classList.add("rain");
        if (sunMoon) sunMoon.textContent = "🌧️";
    } else if (weathercode >= 71 && weathercode <= 77) {
        // Сніг
        bg.classList.add("snow");
        if (sunMoon) sunMoon.textContent = "❄️";
    } else if (weathercode >= 85 && weathercode <= 86) {
        // Снігові зливи
        bg.classList.add("snow");
        if (sunMoon) sunMoon.textContent = "❄️";
    } else if (weathercode >= 95 && weathercode <= 99) {
        // Гроза
        bg.classList.add("thunderstorm");
        if (sunMoon) sunMoon.textContent = "⛈️";
    }
    
    // Для темної теми
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        bg.classList.add("dark");
        if (stars) stars.style.opacity = "0.3";
    }
}

function renderResult(place, data) {
    var lang = getCurrentLang();
    var locale = TRANSLATIONS[lang].locale;
    
    var resultCard = document.getElementById("resultCard");
    if (!resultCard) return;
    
    // Локація
    var subParts = [];
    if (place.admin1) subParts.push(place.admin1);
    if (place.country) subParts.push(place.country);
    
    var cityTitle = document.getElementById("cityTitle");
    var citySub = document.getElementById("citySub");
    
    if (cityTitle) cityTitle.textContent = place.name;
    if (citySub) citySub.textContent = subParts.join(", ");
    
    // Поточна погода
    var current = data.current;
    
    var bigIcon = document.getElementById("bigIcon");
    var bigTemp = document.getElementById("bigTemp");
    var currentDesc = document.getElementById("currentDesc");
    var feelsLike = document.getElementById("feelsLike");
    var weatherBadge = document.getElementById("weatherBadge");
    
    if (bigIcon) bigIcon.textContent = getWeatherIcon(current.weathercode);
    if (bigTemp) bigTemp.textContent = Math.round(current.temperature_2m) + "°";
    if (currentDesc) currentDesc.textContent = getWeatherDescription(current.weathercode, lang);
    if (feelsLike) feelsLike.textContent = t("feelsLike") + " " + Math.round(current.apparent_temperature) + "°";
    if (weatherBadge) weatherBadge.textContent = Math.round(current.temperature_2m) + "°";
    
    // Деталі
    var maxTemp = document.getElementById("maxTemp");
    var minTemp = document.getElementById("minTemp");
    var humidity = document.getElementById("humidity");
    var wind = document.getElementById("wind");
    
    if (maxTemp) maxTemp.textContent = Math.round(data.daily.temperature_2m_max[0]) + "°";
    if (minTemp) minTemp.textContent = Math.round(data.daily.temperature_2m_min[0]) + "°";
    if (humidity) humidity.textContent = (current.relativehumidity_2m || "-") + "%";
    if (wind) wind.textContent = getWindSpeed(current.windspeed_10m) + " " + t("kmh");
    
    // Сонце та місяць
    renderSunMoonInfo(data, locale);
    
    // Чіпи інформації
    renderInfoChips(data, lang);
    
    // Погодинний прогноз
    renderHourly(data, locale);
    
    // Вкладки днів
    renderDayTabs(data, locale);
    
    // Частини дня
    renderDayParts(data, 0, locale);
    
    // Прогноз на 14 днів
    renderForecast14(data, locale);
    
    resultCard.classList.add("show");
}

function renderSunMoonInfo(data, locale) {
    var sunriseTime = document.getElementById("sunriseTime");
    var sunsetTime = document.getElementById("sunsetTime");
    var dayLength = document.getElementById("dayLength");
    
    if (!sunriseTime || !sunsetTime || !dayLength) return;
    
    var sunrise = new Date(data.daily.sunrise[0]);
    var sunset = new Date(data.daily.sunset[0]);
    
    sunriseTime.textContent = sunrise.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    sunsetTime.textContent = sunset.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    dayLength.textContent = getDayLength(sunrise, sunset);
}

function renderInfoChips(data, lang) {
    var uvValue = document.getElementById("uvValue");
    var aqiValue = document.getElementById("aqiValue");
    var visibilityValue = document.getElementById("visibilityValue");
    var precipValue = document.getElementById("precipValue");
    
    var uv = Math.round(data.daily.uv_index_max[0]);
    var uvLabel = t(getUvCategory(uv));
    
    if (uvValue) {
        uvValue.innerHTML = uv + " <span style='font-size: 12px; color: " + getUvColor(uv) + ";'>●</span>";
    }
    
    if (aqiValue) {
        aqiValue.innerHTML = "<span class='aqi-dot' style='background: " + getAqiColor(0) + ";'></span> " + t("loading");
    }
    
    if (visibilityValue) {
        visibilityValue.textContent = getVisibility(data.current.visibility) + " " + t("kmh").replace("км/г", "км");
    }
    
    if (precipValue) {
        precipValue.textContent = getPrecipitation(data.daily.precipitation_sum[0]) + " " + t("mm");
    }
}

function renderHourly(data, locale) {
    var nowIso = data.current.time;
    var times = data.hourly.time;
    var startIndex = times.indexOf(nowIso);
    if (startIndex === -1) startIndex = 0;
    
    var hourlyContainer = document.getElementById("hourlyScroll");
    if (!hourlyContainer) return;
    
    hourlyContainer.innerHTML = "";
    
    for (var i = startIndex; i < startIndex + 24 && i < times.length; i++) {
        var dateObj = new Date(times[i]);
        var hourLabel = dateObj.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
        var rain = data.hourly.precipitation_probability[i];
        var wind = Math.round(data.hourly.windspeed_10m[i]);
        var isCurrent = (i === startIndex);
        
        var card = document.createElement("div");
        card.className = "hour-card" + (isCurrent ? " current" : "");
        card.innerHTML = "<div class='h-time'>" + hourLabel + "</div>" +
            "<div class='h-icon'>" + getWeatherIcon(data.hourly.weathercode[i]) + "</div>" +
            "<div class='h-temp'>" + Math.round(data.hourly.temperature_2m[i]) + "°</div>" +
            "<div class='h-extra'>💧" + rain + "%<br>💨" + wind + " " + t("kmh").replace("км/г", "") + "</div>";
        
        hourlyContainer.appendChild(card);
    }
}

function renderDayTabs(data, locale) {
    var tabsContainer = document.getElementById("dayTabs");
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = "";
    
    var dayCount = Math.min(7, data.daily.time.length);
    
    for (var i = 0; i < dayCount; i++) {
        var label;
        if (i === 0) {
            label = t("today");
        } else if (i === 1) {
            label = t("tomorrow");
        } else {
            var d = new Date(data.daily.time[i]);
            label = d.toLocaleDateString(locale, { weekday: "short" });
        }
        
        var tab = document.createElement("div");
        tab.className = "day-tab" + (i === activeDayIndex ? " active" : "");
        tab.textContent = label;
        tab.setAttribute("data-index", i);
        
        tab.addEventListener("click", (function (index) {
            return function () {
                activeDayIndex = index;
                var allTabs = tabsContainer.querySelectorAll(".day-tab");
                allTabs.forEach(function (el) {
                    el.classList.remove("active");
                    if (parseInt(el.getAttribute("data-index"), 10) === index) {
                        el.classList.add("active");
                    }
                });
                renderDayParts(lastData, index, locale);
            };
        })(i));
        
        tabsContainer.appendChild(tab);
    }
}

function renderDayParts(data, dayIndex, locale) {
    var dateStr = data.daily.time[dayIndex];
    var times = data.hourly.time;
    
    var targets = [
        { hour: "06", labelKey: "morning" },
        { hour: "12", labelKey: "day" },
        { hour: "18", labelKey: "evening" },
        { hour: "23", labelKey: "night" }
    ];
    
    var grid = document.getElementById("dayPartsGrid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    targets.forEach(function (target) {
        var isoTarget = dateStr + "T" + target.hour + ":00";
        var idx = times.indexOf(isoTarget);
        
        var card = document.createElement("div");
        card.className = "day-part-card";
        
        if (idx === -1) {
            card.innerHTML = "<div class='dp-label'>" + t(target.labelKey) + "</div>" +
                "<div class='dp-icon'>—</div>" +
                "<div class='dp-temp'>—</div>";
        } else {
            var temp = Math.round(data.hourly.temperature_2m[idx]);
            var code = data.hourly.weathercode[idx];
            var rain = data.hourly.precipitation_probability[idx];
            
            card.innerHTML = "<div class='dp-label'>" + t(target.labelKey) + "</div>" +
                "<div class='dp-icon'>" + getWeatherIcon(code) + "</div>" +
                "<div class='dp-temp'>" + temp + "°</div>" +
                "<div class='dp-rain'>💧" + rain + "%</div>";
        }
        
        grid.appendChild(card);
    });
}

function renderForecast14(data, locale) {
    var list = document.getElementById("forecast14List");
    if (!list) return;
    
    list.innerHTML = "";
    
    var maxTemps = data.daily.temperature_2m_max;
    var minTemps = data.daily.temperature_2m_min;
    
    var globalMin = Math.min.apply(null, minTemps);
    var globalMax = Math.max.apply(null, maxTemps);
    var range = globalMax - globalMin;
    if (range <= 0) range = 1;
    
    for (var i = 0; i < data.daily.time.length; i++) {
        var d = new Date(data.daily.time[i]);
        var dayLabel = i === 0 ? t("today") : d.toLocaleDateString(locale, { weekday: "short" });
        var dateLabel = d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" });
        
        var min = Math.round(minTemps[i]);
        var max = Math.round(maxTemps[i]);
        var rain = data.daily.precipitation_probability_max[i];
        var icon = getWeatherIcon(data.daily.weathercode[i]);
        
        var leftPct = ((min - globalMin) / range) * 100;
        var widthPct = ((max - min) / range) * 100;
        if (widthPct < 6) widthPct = 6;
        
        var row = document.createElement("div");
        row.className = "forecast14-row";
        row.innerHTML = "<div class='f14-day'>" + dayLabel + " " + dateLabel + "</div>" +
            "<div class='f14-icon'>" + icon + "</div>" +
            "<div class='f14-rain'>💧" + rain + "%</div>" +
            "<div class='f14-bar-wrap'>" +
                "<div class='f14-min'>" + min + "°</div>" +
                "<div class='f14-bar-track'>" +
                    "<div class='f14-bar-fill' style='left:" + leftPct + "%; width:" + widthPct + "%;'></div>" +
                "</div>" +
                "<div class='f14-max'>" + max + "°</div>" +
            "</div>";
        
        list.appendChild(row);
    }
}

// ============================================
// Якість повітря
// ============================================
function loadAirQuality(place) {
    var aqiValue = document.getElementById("aqiValue");
    if (!aqiValue) return;
    
    var url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" +
        place.latitude + "&longitude=" + place.longitude +
        "&current=european_aqi,pm10,pm2_5&timezone=auto";
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var aqi = data.current && data.current.european_aqi;
            if (aqi === undefined || aqi === null) {
                aqiValue.innerHTML = "<span class='aqi-dot' style='background: var(--text-muted);'></span> —";
                return;
            }
            
            var category = getAqiCategory(aqi);
            var color = getAqiColor(aqi);
            
            aqiValue.innerHTML = "<span class='aqi-dot' style='background: " + color + ";'></span> " +
                aqi + " · " + t(category);
        })
        .catch(function () {
            aqiValue.innerHTML = "<span class='aqi-dot' style='background: var(--text-muted);'></span> —";
        });
}

// ============================================
// Показ попереджень
// ============================================
function showAlert(alert) {
    var alertsContainer = document.getElementById("alertsContainer");
    if (!alertsContainer) return;
    
    var alertCard = document.createElement("div");
    alertCard.className = "alert-card " + alert.type;
    
    var iconClass = "fa-exclamation-triangle";
    if (alert.type === "danger") iconClass = "fa-exclamation-circle";
    if (alert.type === "info") iconClass = "fa-info-circle";
    
    alertCard.innerHTML = "<i class='fas " + iconClass + " alert-icon'></i>" +
        "<div class='alert-content'>" +
            "<div class='alert-title'>" + alert.title + "</div>" +
            "<div class='alert-text'>" + alert.message + "</div>" +
            "<div class='alert-time'>" + alert.time + "</div>" +
        "</div>";
    
    alertsContainer.appendChild(alertCard);
    
    // Автоматичне видалення через 10 секунд
    setTimeout(function () {
        alertCard.style.animation = "slideIn 0.3s ease reverse";
        setTimeout(function () {
            alertCard.remove();
        }, 300);
    }, 10000);
}

// ============================================
// Експорт функцій для використання в інших файлах
// ============================================
window.weatherApp = {
    showWeatherFor: showWeatherFor,
    getCurrentPlace: function () { return currentPlace; },
    getFavorites: function () { return favorites; },
    addToFavorites: addToFavorites,
    removeFromFavorites: removeFromFavorites,
    showToast: showToast,
    showAlert: showAlert
};
