// Словник перекладів інтерфейсу. Використовується і на головній сторінці, і на карті.
var TRANSLATIONS = {
    uk: {
        siteName: "Погода UA",
        navSearch: "Пошук",
        navMap: "Карта",
        heroTitle: "Погода будь-якого міста України",
        heroSubtitle: "Введіть назву населеного пункту — від великого міста до маленького села",
        searchPlaceholder: "Введіть назву міста або села...",
        searching: "Шукаємо...",
        noResults: "Нічого не знайдено. Спробуйте іншу назву.",
        loadingWeather: "Завантажуємо прогноз...",
        errorWeather: "Не вдалося завантажити погоду. Спробуйте ще раз.",
        feelsLike: "Відчувається як",
        next24h: "Погодинний прогноз на 24 години",
        locale: "uk-UA",
        precipitation: "Опади",
        wind: "Вітер",
        morning: "Ранок",
        day: "День",
        evening: "Вечір",
        night: "Ніч",
        dayParts: "Прогноз за частинами доби",
        forecast14: "Прогноз на 14 днів",
        uvIndex: "УФ-індекс",
        airQuality: "Якість повітря",
        sunrise: "Схід сонця",
        sunset: "Захід сонця",
        uvLow: "низький", uvModerate: "помірний", uvHigh: "високий", uvVeryHigh: "дуже високий", uvExtreme: "екстремальний",
        aqiGood: "добра", aqiFair: "задовільна", aqiModerate: "помірна", aqiPoor: "погана", aqiVeryPoor: "дуже погана",
        today: "Сьогодні", tomorrow: "Завтра",
        zoomHint: "Наближайте карту, щоб побачити більше населених пунктів",
        loadingVillages: "Завантажуємо населені пункти..."
    },
    ru: {
        siteName: "Погода UA",
        navSearch: "Поиск",
        navMap: "Карта",
        heroTitle: "Погода любого города Украины",
        heroSubtitle: "Введите название населённого пункта — от большого города до маленького села",
        searchPlaceholder: "Введите название города или села...",
        searching: "Ищем...",
        noResults: "Ничего не найдено. Попробуйте другое название.",
        loadingWeather: "Загружаем прогноз...",
        errorWeather: "Не удалось загрузить погоду. Попробуйте ещё раз.",
        feelsLike: "Ощущается как",
        next24h: "Почасовой прогноз на 24 часа",
        locale: "ru-RU",
        precipitation: "Осадки",
        wind: "Ветер",
        morning: "Утро",
        day: "День",
        evening: "Вечер",
        night: "Ночь",
        dayParts: "Прогноз по частям суток",
        forecast14: "Прогноз на 14 дней",
        uvIndex: "УФ-индекс",
        airQuality: "Качество воздуха",
        sunrise: "Восход солнца",
        sunset: "Закат солнца",
        uvLow: "низкий", uvModerate: "умеренный", uvHigh: "высокий", uvVeryHigh: "очень высокий", uvExtreme: "экстремальный",
        aqiGood: "хорошее", aqiFair: "удовлетворительное", aqiModerate: "умеренное", aqiPoor: "плохое", aqiVeryPoor: "очень плохое",
        today: "Сегодня", tomorrow: "Завтра",
        zoomHint: "Приближайте карту, чтобы увидеть больше населённых пунктов",
        loadingVillages: "Загружаем населённые пункты..."
    },
    en: {
        siteName: "Weather UA",
        navSearch: "Search",
        navMap: "Map",
        heroTitle: "Weather for any place in Ukraine",
        heroSubtitle: "Enter the name of a city or village — big or small",
        searchPlaceholder: "Enter a city or village name...",
        searching: "Searching...",
        noResults: "Nothing found. Try a different name.",
        loadingWeather: "Loading forecast...",
        errorWeather: "Could not load weather. Please try again.",
        feelsLike: "Feels like",
        next24h: "24-hour forecast",
        locale: "en-US",
        precipitation: "Precipitation",
        wind: "Wind",
        morning: "Morning",
        day: "Day",
        evening: "Evening",
        night: "Night",
        dayParts: "Forecast by time of day",
        forecast14: "14-day forecast",
        uvIndex: "UV index",
        airQuality: "Air quality",
        sunrise: "Sunrise",
        sunset: "Sunset",
        uvLow: "low", uvModerate: "moderate", uvHigh: "high", uvVeryHigh: "very high", uvExtreme: "extreme",
        aqiGood: "good", aqiFair: "fair", aqiModerate: "moderate", aqiPoor: "poor", aqiVeryPoor: "very poor",
        today: "Today", tomorrow: "Tomorrow",
        zoomHint: "Zoom in to see more settlements",
        loadingVillages: "Loading settlements..."
    }
};

// Повертає обраний раніше або мову браузера за замовчуванням
function getCurrentLang() {
    var saved = localStorage.getItem("weatherua_lang");
    if (saved && TRANSLATIONS[saved]) return saved;
    return "uk";
}

function setCurrentLang(lang) {
    localStorage.setItem("weatherua_lang", lang);
}

function t(key) {
    var lang = getCurrentLang();
    return TRANSLATIONS[lang][key] || key;
}

// Малює перемикач мов і навішує обробники кліків
function renderLangSwitch(containerId, onChangeCallback) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var current = getCurrentLang();
    var langs = ["uk", "ru", "en"];
    var labels = { uk: "UA", ru: "RU", en: "EN" };

    container.innerHTML = "";
    langs.forEach(function (code) {
        var btn = document.createElement("button");
        btn.textContent = labels[code];
        if (code === current) btn.className = "active";
        btn.addEventListener("click", function () {
            setCurrentLang(code);
            if (onChangeCallback) onChangeCallback(code);
        });
        container.appendChild(btn);
    });
}

// Проставляє переклад у всі елементи з data-i18n="ключ"
function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        var key = el.getAttribute("data-i18n-placeholder");
        el.setAttribute("placeholder", t(key));
    });
    document.querySelectorAll("[data-i18n-active-nav]").forEach(function (el) {
        // підсвічуємо активний пункт навігації підписами мовою користувача
    });
}
