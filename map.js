document.addEventListener("DOMContentLoaded", function () {
    applyTranslations();
    renderLangSwitch("langSwitch", function () {
        applyTranslations();
    });

    var map = L.map('map', {
        minZoom: 1,
        maxZoom: 19
    }).setView([48.7, 31.5], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap © CARTO'
    }).addTo(map);

    // Поріг наближення, з якого починаємо довантажувати реальні населені пункти
    var VILLAGE_ZOOM_THRESHOLD = 9;
    // Ще ближче наближення - додаємо зовсім маленькі хутори
    var HAMLET_ZOOM_THRESHOLD = 12;

    var zoomHint = document.getElementById("zoomHint");
    var mapLoading = document.getElementById("mapLoading");

    function makeIcon(content, small, name) {
        var nameLine = name ? "<div class='label-name'>" + name + "</div>" : "";
        var html = "<div class='label-main'>" + content + "</div>" + nameLine;
        return L.divIcon({
            className: small ? "weather-icon-label small" : "weather-icon-label",
            html: html,
            iconSize: small ? [70, 34] : [90, 40],
            iconAnchor: small ? [35, 17] : [45, 20]
        });
    }

    // ---------- Базові 25 обласних центрів (завжди видимі, як і раніше) ----------

    var baseCities = [
        { name: "Луцьк", lat: 50.7472, lon: 25.3254 },
        { name: "Рівне", lat: 50.6199, lon: 26.2516 },
        { name: "Житомир", lat: 50.2547, lon: 28.6587 },
        { name: "Львів", lat: 49.8397, lon: 24.0297 },
        { name: "Тернопіль", lat: 49.5535, lon: 25.5948 },
        { name: "Ужгород", lat: 48.6208, lon: 22.2879 },
        { name: "Івано-Франківськ", lat: 48.9226, lon: 24.7111 },
        { name: "Хмельницький", lat: 49.4229, lon: 26.9871 },
        { name: "Чернівці", lat: 48.2921, lon: 25.9358 },
        { name: "Вінниця", lat: 49.2331, lon: 28.4682 },
        { name: "Чернігів", lat: 51.4982, lon: 31.2893 },
        { name: "Суми", lat: 50.9077, lon: 34.7981 },
        { name: "Київ", lat: 50.4501, lon: 30.5234 },
        { name: "Черкаси", lat: 49.4444, lon: 32.0598 },
        { name: "Полтава", lat: 49.5883, lon: 34.5514 },
        { name: "Харків", lat: 49.9935, lon: 36.2304 },
        { name: "Кропивницький", lat: 48.5079, lon: 32.2623 },
        { name: "Дніпро", lat: 48.4647, lon: 35.0462 },
        { name: "Запоріжжя", lat: 47.8388, lon: 35.1396 },
        { name: "Луганськ", lat: 48.5740, lon: 39.3078 },
        { name: "Миколаїв", lat: 46.9750, lon: 31.9946 },
        { name: "Херсон", lat: 46.6354, lon: 32.6169 },
        { name: "Донецьк", lat: 48.0159, lon: 37.8028 },
        { name: "Одеса", lat: 46.4825, lon: 30.7233 },
        { name: "Сімферополь", lat: 44.9521, lon: 34.1024 }
    ];

    var baseMarkers = {};

    baseCities.forEach(function (city) {
        var marker = L.marker([city.lat, city.lon], { icon: makeIcon("⏳", false, city.name) }).addTo(map);
        baseMarkers[city.name] = marker;
    });

    baseCities.forEach(function (city) {
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

                baseMarkers[city.name].setIcon(makeIcon(icon + " +" + dayTemp + "°", false, city.name));

                var lang = getCurrentLang();
                baseMarkers[city.name].bindPopup(
                    "<b>" + city.name + "</b><br>" +
                    getWeatherDescription(code, lang) + "<br>" +
                    "+" + dayTemp + "° / +" + nightTemp + "°"
                );
            })
            .catch(function () {
                baseMarkers[city.name].setIcon(makeIcon("⚠️", false, city.name));
            });
    });

    // ---------- Динамічне довантаження всіх інших населених пунктів ----------

    var villageCluster = L.markerClusterGroup({
        maxClusterRadius: 45,
        disableClusteringAtZoom: 15
    });
    map.addLayer(villageCluster);

    var fetchedRegions = {}; // кеш вже завантажених ділянок, щоб не дублювати запити
    var debounceTimer = null;

    function updateZoomHint() {
        if (map.getZoom() < VILLAGE_ZOOM_THRESHOLD) {
            zoomHint.classList.remove("hidden");
        } else {
            zoomHint.classList.add("hidden");
        }
    }

    function regionKey(bounds, zoom) {
        // округлюємо межі, щоб не робити повторний запит за майже той самий регіон
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

    function loadVillagesInView() {
        var zoom = map.getZoom();

        if (zoom < VILLAGE_ZOOM_THRESHOLD) {
            villageCluster.clearLayers();
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

        mapLoading.textContent = t("loadingVillages");
        mapLoading.classList.add("show");

        fetch(overpassUrl)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                mapLoading.classList.remove("show");
                addVillages(data.elements || []);
            })
            .catch(function () {
                mapLoading.classList.remove("show");
            });
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

        // групуємо координати для одного об'єднаного запиту погоди (Open-Meteo підтримує масив координат)
        var latList = newPoints.map(function (p) { return p.lat; }).join(",");
        var lonList = newPoints.map(function (p) { return p.lon; }).join(",");

        var weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + latList +
            "&longitude=" + lonList +
            "&daily=temperature_2m_max,weathercode&timezone=auto";

        var localMarkers = newPoints.map(function (p) {
            var marker = L.marker([p.lat, p.lon], { icon: makeIcon("⏳", true, p.name) });
            marker.bindPopup("<b>" + p.name + "</b>");
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

                    localMarkers[index].setIcon(makeIcon(icon + " +" + dayTemp + "°", true, newPoints[index].name));

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
                    m.setIcon(makeIcon("⚠️", true, newPoints[idx].name));
                });
            });
    }

    function debouncedLoad() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            updateZoomHint();
            loadVillagesInView();
        }, 900);
    }

    map.on("moveend zoomend", debouncedLoad);
    updateZoomHint();
});
