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

    var cities = [
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

    function makeIcon(content) {
        return L.divIcon({
            className: "weather-icon-label",
            html: content,
            iconSize: [60, 26],
            iconAnchor: [30, 13]
        });
    }

    var markers = {};

    cities.forEach(function (city) {
        var marker = L.marker([city.lat, city.lon], { icon: makeIcon("⏳") }).addTo(map);
        markers[city.name] = marker;
    });

    cities.forEach(function (city) {
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

                markers[city.name].setIcon(makeIcon(icon + " +" + dayTemp + "°"));

                var lang = getCurrentLang();
                markers[city.name].bindPopup(
                    "<b>" + city.name + "</b><br>" +
                    getWeatherDescription(code, lang) + "<br>" +
                    "+" + dayTemp + "° / +" + nightTemp + "°"
                );
            })
            .catch(function () {
                markers[city.name].setIcon(makeIcon("⚠️"));
            });
    });
});
