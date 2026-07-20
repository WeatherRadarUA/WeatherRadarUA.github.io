// ============================================
// Погода UA - Карта погоди
// ============================================

// Глобальні змінні
var map;
var baseLayers = {};
var overlayLayers = {};
var markers = {};
var villageCluster;
var fetchedRegions = {};
var currentWeatherData = {};

// Порогові значення для завантаження населених пунктів
var VILLAGE_ZOOM_THRESHOLD = 9;
var HAMLET_ZOOM_THRESHOLD = 12;

// Ініціалізація при завантаженні сторінки
document.addEventListener("DOMContentLoaded", function () {
    // Застосовуємо переклади
    applyTranslations();
    
    // Рендеримо перемикач мов
    renderLangSwitch("langSwitch", function () {
        applyTranslations();
    });
    
    // Ініціалізація теми
    initTheme();
    
    // Ініціалізація карти
    initMap();
    
    // Ініціалізація модальних вікон
    initModals();
    
    // Ініціалізація геолокації
    initGeolocation();
    
    // Ініціалізація керування картою
    initMapControls();
});

// ============================================
// Тема
// ============================================
function initTheme() {
    var savedTheme = localStorage.getItem("weatherua_theme");
    var currentTheme = savedTheme || "light";
    
    applyTheme();
    
    // Кнопка перемикання теми
    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            if (currentTheme === "light") {
                currentTheme = "dark";
            } else if (currentTheme === "dark") {
                currentTheme = "auto";
            } else {
                currentTheme = "light";
            }
            localStorage.setItem("weatherua_theme", currentTheme);
            applyTheme();
        });
    }
}

function applyTheme() {
    var html = document.documentElement;
    var savedTheme = localStorage.getItem("weatherua_theme");
    
    if (savedTheme === "dark") {
        html.setAttribute("data-theme", "dark");
    } else if (savedTheme === "light") {
        html.removeAttribute("data-theme");
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.setAttribute("data-theme", "dark");
        } else {
            html.removeAttribute("data-theme");
        }
    }
    
    // Оновлюємо іконку кнопки теми
    var themeIcon = document.querySelector(".theme-toggle i");
    if (themeIcon) {
        var currentTheme = localStorage.getItem("weatherua_theme") || "auto";
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
// Карта
// ============================================
function initMap() {
    // Центр України
    var center = [48.7, 31.5];
    
    // Створюємо карту
    map = L.map('map', {
        center: center,
        zoom: 6,
        minZoom: 5,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false
    });
    
    // Додаємо атрибуцію
    map.attributionControl.setPrefix('<a href="https://leafletjs.com/" title="A JS library for interactive maps">Leaflet</a>');
    
    // Базові шари карти
    baseLayers.standard = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap © CARTO'
    }).addTo(map);
    
    baseLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '© Esri'
    });
    
    // Кластеризація маркерів
    villageCluster = L.markerClusterGroup({
        maxClusterRadius: 45,
        disableClusteringAtZoom: 15,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: '<div class="marker-cluster"><span>' + cluster.getChildCount() + '</span></div>',
                className: 'marker-cluster-icon',
                iconSize: L.point(40, 40)
            });
        }
    });
    map.addLayer(villageCluster);
    
    // Додаємо базові міста України
    addBaseCities();
    
    // Обробка подій карти
    map.on("moveend zoomend", debouncedLoad);
    
    // Оновлюємо підказку про зум
    updateZoomHint();
    
    // Клік по карті
    map.on("click", function (e) {
        handleMapClick(e.latlng);
    });
    
    // Додаємо шкалу
    L.control.scale({ imperial: false }).addTo(map);
}

// ============================================
// Базові міста України
// ============================================
var baseCities = [
    { name: "Київ", lat: 50.4501, lon: 30.5234, region: "Київ" },
    { name: "Харків", lat: 49.9935, lon: 36.2304, region: "Харківська" },
    { name: "Одеса", lat: 46.4825, lon: 30.7233, region: "Одеська" },
    { name: "Дніпро", lat: 48.4647, lon: 35.0462, region: "Дніпропетровська" },
    { name: "Донецьк", lat: 48.0159, lon: 37.8028, region: "Донецька" },
    { name: "Запоріжжя", lat: 47.8388, lon: 35.1396, region: "Запорізька" },
    { name: "Львів", lat: 49.8397, lon: 24.0297, region: "Львівська" },
    { name: "Кривий Ріг", lat: 47.9105, lon: 33.3917, region: "Дніпропетровська" },
    { name: "Миколаїв", lat: 46.9750, lon: 31.9946, region: "Миколаївська" },
    { name: "Маріуполь", lat: 47.0958, lon: 37.5483, region: "Донецька" },
    { name: "Луганськ", lat: 48.5740, lon: 39.3078, region: "Луганська" },
    { name: "Вінниця", lat: 49.2331, lon: 28.4682, region: "Вінницька" },
    { name: "Полтава", lat: 49.5883, lon: 34.5514, region: "Полтавська" },
    { name: "Чернігів", lat: 51.4982, lon: 31.2893, region: "Чернігівська" },
    { name: "Черкаси", lat: 49.4444, lon: 32.0598, region: "Черкаська" },
    { name: "Хмельницький", lat: 49.4229, lon: 26.9871, region: "Хмельницька" },
    { name: "Чернівці", lat: 48.2921, lon: 25.9358, region: "Чернівецька" },
    { name: "Житомир", lat: 50.2547, lon: 28.6587, region: "Житомирська" },
    { name: "Сумми", lat: 50.9077, lon: 34.7981, region: "Сумська" },
    { name: "Рівне", lat: 50.6199, lon: 26.2516, region: "Рівненська" },
    { name: "Тернопіль", lat: 49.5535, lon: 25.5948, region: "Тернопільська" },
    { name: "Івано-Франківськ", lat: 48.9226, lon: 24.7111, region: "Івано-Франківська" },
    { name: "Луцьк", lat: 50.7472, lon: 25.3254, region: "Волинська" },
    { name: "Ужгород", lat: 48.6208, lon: 22.2879, region: "Закарпатська" },
    { name: "Сімферополь", lat: 44.9521, lon: 34.1024, region: "Крим" },
    { name: "Севастополь", lat: 44.6167, lon: 33.5254, region: "Крим" }
];

function addBaseCities() {
    baseCities.forEach(function (city) {
        var marker = L.marker([city.lat, city.lon], {
            icon: createCityIcon(city.name, false),
            title: city.name
        }).addTo(map);
        
        markers[city.name] = marker;
        
        // Завантажуємо погоду для міста
        loadCityWeather(city);
    });
}

function createCityIcon(name, small) {
    return L.divIcon({
        className: small ? "weather-icon-label small" : "weather-icon-label",
        html: "<div class='label-main'>📍</div><div class='label-name'>" + name + "</div>",
        iconSize: small ? [70, 34] : [90, 40],
        iconAnchor: small ? [35, 17] : [45, 20]
    });
}

function loadCityWeather(city) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + city.lat +
        "&longitude=" + city.lon +
        "&daily=temperature_2m_max,temperature_2m_min,weathercode" +
        "&timezone=auto";
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var dayTemp = Math.round(data.daily.temperature_2m_max[0]);
            var nightTemp = Math.round(data.daily.temperature_2m_min[0]);
            var code = data.daily.weathercode[0];
            var icon = getWeatherIcon(code);
            
            var marker = markers[city.name];
            if (marker) {
                marker.setIcon(L.divIcon({
                    className: "weather-icon-label",
                    html: "<div class='label-main'>" + icon + " +" + dayTemp + "°</div><div class='label-name'>" + city.name + "</div>",
                    iconSize: [90, 40],
                    iconAnchor: [45, 20]
                }));
                
                var lang = getCurrentLang();
                marker.bindPopup(
                    "<b>" + city.name + "</b><br>" +
                    getWeatherDescription(code, lang) + "<br>" +
                    "+" + dayTemp + "° / +" + nightTemp + "°"
                );
            }
            
            // Зберігаємо дані
            currentWeatherData[city.name] = {
                temp: dayTemp,
                code: code,
                icon: icon
            };
        })
        .catch(function () {
            var marker = markers[city.name];
            if (marker) {
                marker.setIcon(L.divIcon({
                    className: "weather-icon-label",
                    html: "<div class='label-main'>❓</div><div class='label-name'>" + city.name + "</div>",
                    iconSize: [90, 40],
                    iconAnchor: [45, 20]
                }));
            }
        });
}

// ============================================
// Керування картою
// ============================================
function initMapControls() {
    // Перемикання базових шарів
    var layerBase = document.getElementById("layerBase");
    var layerSatellite = document.getElementById("layerSatellite");
    
    if (layerBase && layerSatellite) {
        layerBase.addEventListener("click", function () {
            map.removeLayer(baseLayers.satellite);
            map.addLayer(baseLayers.standard);
            layerBase.classList.add("active");
            layerSatellite.classList.remove("active");
        });
        
        layerSatellite.addEventListener("click", function () {
            map.removeLayer(baseLayers.standard);
            map.addLayer(baseLayers.satellite);
            layerBase.classList.remove("active");
            layerSatellite.classList.add("active");
        });
    }
    
    // Перемикання оверлейних шарів
    var layerPrecip = document.getElementById("layerPrecip");
    var layerTemp = document.getElementById("layerTemp");
    var layerWind = document.getElementById("layerWind");
    
    if (layerPrecip) {
        layerPrecip.addEventListener("click", function () {
            toggleOverlayLayer("precip", layerPrecip);
        });
    }
    
    if (layerTemp) {
        layerTemp.addEventListener("click", function () {
            toggleOverlayLayer("temp", layerTemp);
        });
    }
    
    if (layerWind) {
        layerWind.addEventListener("click", function () {
            toggleOverlayLayer("wind", layerWind);
        });
    }
    
    // Зум
    var zoomIn = document.getElementById("zoomIn");
    var zoomOut = document.getElementById("zoomOut");
    
    if (zoomIn) {
        zoomIn.addEventListener("click", function () {
            map.zoomIn();
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener("click", function () {
            map.zoomOut();
        });
    }
}

function toggleOverlayLayer(layerName, button) {
    button.classList.toggle("active");
    
    if (button.classList.contains("active")) {
        // Додаємо шар
        if (layerName === "precip") {
            overlayLayers.precip = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', {
                maxZoom: 19,
                attribution: 'OpenWeatherMap'
            }).addTo(map);
        } else if (layerName === "temp") {
            overlayLayers.temp = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', {
                maxZoom: 19,
                attribution: 'OpenWeatherMap'
            }).addTo(map);
        } else if (layerName === "wind") {
            overlayLayers.wind = L.tileLayer('https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', {
                maxZoom: 19,
                attribution: 'OpenWeatherMap'
            }).addTo(map);
        }
    } else {
        // Видаляємо шар
        if (overlayLayers[layerName]) {
            map.removeLayer(overlayLayers[layerName]);
            delete overlayLayers[layerName];
        }
    }
}

// ============================================
// Геолокація
// ============================================
function initGeolocation() {
    var geolocBtn = document.getElementById("geolocBtn");
    if (geolocBtn) {
        geolocBtn.addEventListener("click", function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var lat = position.coords.latitude;
                        var lon = position.coords.longitude;
                        map.setView([lat, lon], 12);
                        handleMapClick({ lat: lat, lng: lon });
                    },
                    function (error) {
                        showToast(t("errorLocation"), "error");
                    }
                );
            } else {
                showToast(t("errorGeolocation"), "error");
            }
        });
    }
}

// ============================================
// Клік по карті
// ============================================
function handleMapClick(latlng) {
    // Шукаємо найближче місто
    reverseGeocodeMap(latlng.lat, latlng.lng);
}

function reverseGeocodeMap(lat, lon) {
    var lang = getCurrentLang();
    var url = "https://geocoding-api.open-meteo.com/v1/search?latitude=" + lat + 
              "&longitude=" + lon + "&count=1&language=" + lang + "&format=json";
    
    var mapLoading = document.getElementById("mapLoading");
    if (mapLoading) {
        mapLoading.textContent = t("loading");
        mapLoading.classList.add("show");
    }
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (mapLoading) {
                mapLoading.classList.remove("show");
            }
            
            if (data.results && data.results.length > 0) {
                var place = data.results[0];
                showMapPopup(place, lat, lon);
            } else {
                // Якщо не знайдено місто, показуємо погоду для координат
                var place = {
                    name: t("ukraine"),
                    latitude: lat,
                    longitude: lon,
                    admin1: null,
                    country: t("ukraine")
                };
                showMapPopup(place, lat, lon);
            }
        })
        .catch(function () {
            if (mapLoading) {
                mapLoading.classList.remove("show");
            }
            showToast(t("errorLocation"), "error");
        });
}

function showMapPopup(place, lat, lon) {
    var popup = document.getElementById("mapPopup");
    var popupTitle = document.getElementById("popupTitle");
    var popupIcon = document.getElementById("popupIcon");
    var popupTemp = document.getElementById("popupTemp");
    var popupMax = document.getElementById("popupMax");
    var popupMin = document.getElementById("popupMin");
    var popupDesc = document.getElementById("popupDesc");
    var popupViewDetails = document.getElementById("popupViewDetails");
    
    if (!popup) return;
    
    // Завантажуємо погоду для місця
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
        "&longitude=" + lon +
        "&current=temperature_2m,weathercode" +
        "&daily=temperature_2m_max,temperature_2m_min,weathercode" +
        "&timezone=auto";
    
    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var currentTemp = Math.round(data.current.temperature_2m);
            var maxTemp = Math.round(data.daily.temperature_2m_max[0]);
            var minTemp = Math.round(data.daily.temperature_2m_min[0]);
            var code = data.current.weathercode;
            var icon = getWeatherIcon(code);
            var desc = getWeatherDescription(code, getCurrentLang());
            
            if (popupTitle) popupTitle.textContent = place.name;
            if (popupIcon) popupIcon.textContent = icon;
            if (popupTemp) popupTemp.textContent = currentTemp + "°";
            if (popupMax) popupMax.textContent = t("maxTemp") + " " + maxTemp + "°";
            if (popupMin) popupMin.textContent = t("minTemp") + " " + minTemp + "°";
            if (popupDesc) popupDesc.textContent = desc;
            
            popup.classList.add("show");
            
            // Обробка кліку по кнопці детального прогнозу
            if (popupViewDetails) {
                popupViewDetails.onclick = function () {
                    // Зберігаємо місце
                    localStorage.setItem("weatherua_lastPlace", JSON.stringify(place));
                    // Переходимо на головну сторінку
                    window.location.href = "index.html";
                };
            }
        })
        .catch(function () {
            showToast(t("errorWeather"), "error");
        });
}

// ============================================
// Завантаження населених пунктів
// ============================================
var debounceTimer = null;

function debouncedLoad() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
        updateZoomHint();
        loadVillagesInView();
    }, 900);
}

function updateZoomHint() {
    var zoomHint = document.getElementById("zoomHint");
    if (!zoomHint) return;
    
    if (map.getZoom() < VILLAGE_ZOOM_THRESHOLD) {
        zoomHint.classList.remove("hidden");
    } else {
        zoomHint.classList.add("hidden");
    }
}

function loadVillagesInView() {
    var zoom = map.getZoom();
    
    if (zoom < VILLAGE_ZOOM_THRESHOLD) {
        if (villageCluster) {
            villageCluster.clearLayers();
        }
        return;
    }
    
    var bounds = map.getBounds();
    var key = regionKey(bounds, zoom);
    
    if (fetchedRegions[key]) {
        return;
    }
    fetchedRegions[key] = true;
    
    var south = bounds.getSouth();
    var west = bounds.getWest();
    var north = bounds.getNorth();
    var east = bounds.getEast();
    
    var placeRegex = getPlaceRegex(zoom);
    
    var query = "[out:json][timeout:25];" +
        "node[\"place\"~\"" + placeRegex + "\"](" +
        south + "," + west + "," + north + "," + east +
        ");out body 400;";
    
    var overpassUrl = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
    
    var mapLoading = document.getElementById("mapLoading");
    if (mapLoading) {
        mapLoading.textContent = t("loadingVillages");
        mapLoading.classList.add("show");
    }
    
    fetch(overpassUrl)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (mapLoading) {
                mapLoading.classList.remove("show");
            }
            addVillages(data.elements || []);
        })
        .catch(function () {
            if (mapLoading) {
                mapLoading.classList.remove("show");
            }
        });
}

function regionKey(bounds, zoom) {
    return zoom + ":" +
        bounds.getSouth().toFixed(1) + "," + bounds.getWest().toFixed(1) + "," +
        bounds.getNorth().toFixed(1) + "," + bounds.getEast().toFixed(1);
}

function getPlaceRegex(zoom) {
    if (zoom >= HAMLET_ZOOM_THRESHOLD) {
        return "^(city|town|village|hamlet)$";
    }
    return "^(city|town|village)$";
}

var shownIds = {};

function addVillages(elements) {
    var newPoints = [];
    
    elements.forEach(function (el) {
        if (!el.tags || !el.tags.name) return;
        if (shownIds[el.id]) return;
        shownIds[el.id] = true;
        
        newPoints.push({
            id: el.id,
            name: el.tags.name,
            lat: el.lat,
            lon: el.lon
        });
    });
    
    if (!newPoints.length) return;
    
    // Групуємо координати для запиту погоди
    var latList = newPoints.map(function (p) { return p.lat; }).join(",");
    var lonList = newPoints.map(function (p) { return p.lon; }).join(",");
    
    var weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + latList +
        "&longitude=" + lonList +
        "&daily=temperature_2m_max,weathercode&timezone=auto";
    
    var localMarkers = newPoints.map(function (p) {
        var marker = L.marker([p.lat, p.lon], {
            icon: createCityIcon(p.name, true),
            title: p.name
        });
        marker.bindPopup("<b>" + p.name + "</b><br>" + t("loading"));
        villageCluster.addLayer(marker);
        return marker;
    });
    
    fetch(weatherUrl)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var resultsArray = Array.isArray(data) ? data : [data];
            
            resultsArray.forEach(function (dayData, index) {
                if (!dayData || !dayData.daily || !localMarkers[index]) return;
                
                var dayTemp = Math.round(dayData.daily.temperature_2m_max[0]);
                var code = dayData.daily.weathercode[0];
                var icon = getWeatherIcon(code);
                
                localMarkers[index].setIcon(L.divIcon({
                    className: "weather-icon-label small",
                    html: "<div class='label-main'>" + icon + " +" + dayTemp + "°</div><div class='label-name'>" + newPoints[index].name + "</div>",
                    iconSize: [70, 34],
                    iconAnchor: [35, 17]
                }));
                
                var lang = getCurrentLang();
                localMarkers[index].setPopupContent(
                    "<b>" + newPoints[index].name + "</b><br>" +
                    getWeatherDescription(code, lang) + "<br>" +
                    "+" + dayTemp + "°"
                );
            });
        })
        .catch(function () {
            localMarkers.forEach(function (m, idx) {
                m.setIcon(L.divIcon({
                    className: "weather-icon-label small",
                    html: "<div class='label-main'>❓</div><div class='label-name'>" + newPoints[idx].name + "</div>",
                    iconSize: [70, 34],
                    iconAnchor: [35, 17]
                }));
            });
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
        radarBtn.addEventListener("click", function () {
            radarModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    }
    
    if (closeRadar && radarModal) {
        closeRadar.addEventListener("click", function () {
            radarModal.classList.remove("show");
            document.body.style.overflow = "";
        });
    }
    
    // Закриття попапу
    var closePopup = document.getElementById("closePopup");
    var popup = document.getElementById("mapPopup");
    
    if (closePopup && popup) {
        closePopup.addEventListener("click", function () {
            popup.classList.remove("show");
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
    toast.querySelector(".toast-close").addEventListener("click", function () {
        toast.style.animation = "slideInRight 0.3s ease reverse";
        setTimeout(function () {
            toast.remove();
        }, 300);
    });
}
