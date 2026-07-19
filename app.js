document.addEventListener("DOMContentLoaded", function () {
    applyTranslations();
    renderLangSwitch("langSwitch", function () {
        applyTranslations();
        // якщо вже є вибране місто - перезавантажуємо назви годин/дня тією ж мовою
        if (window._lastSelectedCity) {
            showWeatherFor(window._lastSelectedCity);
        }
    });

    var input = document.getElementById("cityInput");
    var suggestionsBox = document.getElementById("suggestions");
    var resultCard = document.getElementById("resultCard");
    var statusMsg = document.getElementById("statusMsg");

    var debounceTimer = null;

    input.addEventListener("input", function () {
        var query = input.value.trim();

        clearTimeout(debounceTimer);

        if (query.length < 2) {
            suggestionsBox.classList.remove("show");
            suggestionsBox.innerHTML = "";
            return;
        }

        debounceTimer = setTimeout(function () {
            searchCities(query);
        }, 400);
    });

    // приховуємо список підказок, якщо натиснули повз нього
    document.addEventListener("click", function (e) {
        if (!suggestionsBox.contains(e.target) && e.target !== input) {
            suggestionsBox.classList.remove("show");
        }
    });

    function searchCities(query) {
        var lang = getCurrentLang();
        var url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(query) + "&count=8&language=" + lang + "&format=json";

        suggestionsBox.innerHTML = "<div class='suggestion-item'>" + t("searching") + "</div>";
        suggestionsBox.classList.add("show");

        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                renderSuggestions(data.results || []);
            })
            .catch(function () {
                suggestionsBox.innerHTML = "<div class='suggestion-item'>" + t("noResults") + "</div>";
            });
    }

    function renderSuggestions(results) {
        if (!results.length) {
            suggestionsBox.innerHTML = "<div class='suggestion-item'>" + t("noResults") + "</div>";
            return;
        }

        suggestionsBox.innerHTML = "";
        results.forEach(function (place) {
            var item = document.createElement("div");
            item.className = "suggestion-item";

            var subParts = [];
            if (place.admin1) subParts.push(place.admin1);
            if (place.country) subParts.push(place.country);

            item.innerHTML = "<div>" + place.name + "</div>" +
                "<div class='sub'>" + subParts.join(", ") + "</div>";

            item.addEventListener("click", function () {
                input.value = place.name;
                suggestionsBox.classList.remove("show");
                window._lastSelectedCity = place;
                showWeatherFor(place);
            });

            suggestionsBox.appendChild(item);
        });
    }

    function showWeatherFor(place) {
        resultCard.classList.remove("show");
        statusMsg.textContent = t("loadingWeather");
        statusMsg.style.display = "block";

        var url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude +
            "&longitude=" + place.longitude +
            "&current=temperature_2m,weathercode,apparent_temperature" +
            "&hourly=temperature_2m,weathercode" +
            "&forecast_days=2&timezone=auto";

        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                renderResult(place, data);
                statusMsg.style.display = "none";
            })
            .catch(function () {
                statusMsg.textContent = t("errorWeather");
            });
    }

    function renderResult(place, data) {
        var lang = getCurrentLang();
        var locale = TRANSLATIONS[lang].locale;

        var subParts = [];
        if (place.admin1) subParts.push(place.admin1);
        if (place.country) subParts.push(place.country);

        document.getElementById("cityTitle").textContent = place.name;
        document.getElementById("citySub").textContent = subParts.join(", ");

        var current = data.current;
        document.getElementById("bigIcon").textContent = getWeatherIcon(current.weathercode);
        document.getElementById("bigTemp").textContent = Math.round(current.temperature_2m) + "°";
        document.getElementById("currentDesc").textContent =
            getWeatherDescription(current.weathercode, lang) +
            " · " + t("feelsLike") + " " + Math.round(current.apparent_temperature) + "°";

        // знаходимо індекс поточної години в масиві hourly.time
        var nowIso = data.current.time; // напр. "2026-07-19T21:00"
        var times = data.hourly.time;
        var startIndex = times.indexOf(nowIso);
        if (startIndex === -1) startIndex = 0;

        var hourlyContainer = document.getElementById("hourlyScroll");
        hourlyContainer.innerHTML = "";

        for (var i = startIndex; i < startIndex + 24 && i < times.length; i++) {
            var dateObj = new Date(times[i]);
            var hourLabel = dateObj.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

            var card = document.createElement("div");
            card.className = "hour-card";
            card.innerHTML =
                "<div class='h-time'>" + hourLabel + "</div>" +
                "<div class='h-icon'>" + getWeatherIcon(data.hourly.weathercode[i]) + "</div>" +
                "<div class='h-temp'>" + Math.round(data.hourly.temperature_2m[i]) + "°</div>";
            hourlyContainer.appendChild(card);
        }

        resultCard.classList.add("show");
    }
});
