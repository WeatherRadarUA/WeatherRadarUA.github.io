document.addEventListener("DOMContentLoaded", function () {
    applyTranslations();
    renderLangSwitch("langSwitch", function () {
        applyTranslations();
        if (window._lastSelectedCity) {
            showWeatherFor(window._lastSelectedCity);
        }
    });

    var input = document.getElementById("cityInput");
    var suggestionsBox = document.getElementById("suggestions");
    var resultCard = document.getElementById("resultCard");
    var statusMsg = document.getElementById("statusMsg");

    var debounceTimer = null;
    var activeDayIndex = 0;
    var lastData = null;

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
                activeDayIndex = 0;
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
            "&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m" +
            "&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,uv_index_max,precipitation_probability_max" +
            "&forecast_days=14&timezone=auto";

        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                lastData = data;
                renderResult(place, data);
                statusMsg.style.display = "none";
                loadAirQuality(place);
            })
            .catch(function () {
                statusMsg.textContent = t("errorWeather");
            });
    }

    function loadAirQuality(place) {
        var chip = document.getElementById("aqiChipValue");
        if (!chip) return;

        var url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" +
            place.latitude + "&longitude=" + place.longitude +
            "&current=european_aqi&timezone=auto";

        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var aqi = data.current && data.current.european_aqi;
                if (aqi === undefined || aqi === null) {
                    chip.textContent = "—";
                    return;
                }
                chip.textContent = aqi + " · " + t(getAqiCategory(aqi));
            })
            .catch(function () {
                chip.textContent = "—";
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

        renderSunRow(data, locale);
        renderInfoChips(data, lang);
        renderHourly(data, locale);
        renderDayTabs(data, locale);
        renderDayParts(data, 0, locale);
        renderForecast14(data, locale);

        resultCard.classList.add("show");
    }

    function renderSunRow(data, locale) {
        var sunrise = new Date(data.daily.sunrise[0]);
        var sunset = new Date(data.daily.sunset[0]);
        var sunriseStr = sunrise.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
        var sunsetStr = sunset.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

        document.getElementById("sunRow").innerHTML =
            "<span>🌅 " + t("sunrise") + ": " + sunriseStr + "</span>" +
            "<span>🌇 " + t("sunset") + ": " + sunsetStr + "</span>";
    }

    function renderInfoChips(data, lang) {
        var uv = Math.round(data.daily.uv_index_max[0]);
        var uvLabel = t(getUvCategory(uv));

        var html =
            "<div class='info-chip'>" +
                "<div class='chip-label'>" + t("uvIndex") + "</div>" +
                "<div class='chip-value'>" + uv + " · " + uvLabel + "</div>" +
            "</div>" +
            "<div class='info-chip'>" +
                "<div class='chip-label'>" + t("airQuality") + "</div>" +
                "<div class='chip-value' id='aqiChipValue'>…</div>" +
            "</div>";

        document.getElementById("infoChips").innerHTML = html;
    }

    function renderHourly(data, locale) {
        var nowIso = data.current.time;
        var times = data.hourly.time;
        var startIndex = times.indexOf(nowIso);
        if (startIndex === -1) startIndex = 0;

        var hourlyContainer = document.getElementById("hourlyScroll");
        hourlyContainer.innerHTML = "";

        for (var i = startIndex; i < startIndex + 24 && i < times.length; i++) {
            var dateObj = new Date(times[i]);
            var hourLabel = dateObj.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
            var rain = data.hourly.precipitation_probability[i];
            var wind = Math.round(data.hourly.windspeed_10m[i]);

            var card = document.createElement("div");
            card.className = "hour-card";
            card.innerHTML =
                "<div class='h-time'>" + hourLabel + "</div>" +
                "<div class='h-icon'>" + getWeatherIcon(data.hourly.weathercode[i]) + "</div>" +
                "<div class='h-temp'>" + Math.round(data.hourly.temperature_2m[i]) + "°</div>" +
                "<div class='h-extra'>💧" + rain + "%<br>🌬️" + wind + " км/г</div>";
            hourlyContainer.appendChild(card);
        }
    }

    function renderDayTabs(data, locale) {
        var tabsContainer = document.getElementById("dayTabs");
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
        grid.innerHTML = "";

        targets.forEach(function (target) {
            var isoTarget = dateStr + "T" + target.hour + ":00";
            var idx = times.indexOf(isoTarget);

            var card = document.createElement("div");
            card.className = "day-part-card";

            if (idx === -1) {
                card.innerHTML =
                    "<div class='dp-label'>" + t(target.labelKey) + "</div>" +
                    "<div class='dp-icon'>—</div>" +
                    "<div class='dp-temp'>—</div>";
            } else {
                var temp = Math.round(data.hourly.temperature_2m[idx]);
                var code = data.hourly.weathercode[idx];
                var rain = data.hourly.precipitation_probability[idx];

                card.innerHTML =
                    "<div class='dp-label'>" + t(target.labelKey) + "</div>" +
                    "<div class='dp-icon'>" + getWeatherIcon(code) + "</div>" +
                    "<div class='dp-temp'>" + temp + "°</div>" +
                    "<div class='dp-rain'>💧" + rain + "%</div>";
            }

            grid.appendChild(card);
        });
    }

    function renderForecast14(data, locale) {
        var list = document.getElementById("forecast14List");
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
            row.innerHTML =
                "<div class='f14-day'>" + dayLabel + " " + dateLabel + "</div>" +
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
});
