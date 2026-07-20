// Перетворювач weathercode на емодзі-іконки
// Стандарт WMO, який використовує Open-Meteo

function getWeatherIcon(code, animated = false) {
    // Ясне небо
    if (code === 0) return animated ? "🌞" : "☀️";
    if (code === 1) return animated ? "⛅" : "⤹️";
    
    // Хмарно
    if (code === 2) return animated ? "☁️" : "☁️";
    if (code === 3) return animated ? "☁️" : "☁️";
    
    // Туман
    if (code === 45) return "🌫️";
    if (code === 48) return "🌫️";
    
    // Мряка
    if (code === 51) return "🌦️";
    if (code === 53) return "🌦️";
    if (code === 55) return "🌧️";
    
    // Дощ
    if (code === 61) return "🌧️";
    if (code === 63) return "🌧️";
    if (code === 65) return "🌧️";
    
    // Сніг
    if (code === 71) return "❄️";
    if (code === 73) return "❄️";
    if (code === 75) return "❄️";
    if (code === 77) return "❄️";
    
    // Зливи
    if (code === 80) return "🌧️";
    if (code === 81) return "🌧️";
    if (code === 82) return "🌧️";
    
    // Снігові зливи
    if (code === 85) return "❄️";
    if (code === 86) return "❄️";
    
    // Гроза
    if (code === 95) return "⛈️";
    if (code === 96) return "⛈️";
    if (code === 99) return "⛈️";
    
    // За замовчуванням
    return "🌦️";
}

// Опис погоди за weathercode
var WEATHER_DESC = {
    uk: {
        0: "Ясно", 
        1: "Переважно ясно", 
        2: "Мінлива хмарність", 
        3: "Хмарно",
        45: "Туман", 
        48: "Туман з інеєм",
        51: "Слабка мряка", 
        53: "Мряка", 
        55: "Сильна мряка",
        61: "Слабкий дощ", 
        63: "Дощ", 
        65: "Сильний дощ",
        71: "Слабкий сніг", 
        73: "Сніг", 
        75: "Сильний сніг", 
        77: "Снігові зерна",
        80: "Зливовий дощ", 
        81: "Зливи", 
        82: "Сильні зливи",
        85: "Снігові зливи", 
        86: "Сильні снігові зливи",
        95: "Гроза", 
        96: "Гроза з градом", 
        99: "Сильна гроза з градом"
    },
    ru: {
        0: "Ясно", 
        1: "Преимущественно ясно", 
        2: "Переменная облачность", 
        3: "Облачно",
        45: "Туман", 
        48: "Туман с изморозью",
        51: "Слабая морось", 
        53: "Морось", 
        55: "Сильная морось",
        61: "Слабый дождь", 
        63: "Дождь", 
        65: "Сильный дождь",
        71: "Слабый снег", 
        73: "Снег", 
        75: "Сильный снег", 
        77: "Снежные зерна",
        80: "Ливневый дождь", 
        81: "Ливни", 
        82: "Сильные ливни",
        85: "Снежные ливни", 
        86: "Сильные снежные ливни",
        95: "Гроза", 
        96: "Гроза с градом", 
        99: "Сильная гроза с градом"
    },
    en: {
        0: "Clear sky", 
        1: "Mainly clear", 
        2: "Partly cloudy", 
        3: "Cloudy",
        45: "Fog", 
        48: "Rime fog",
        51: "Light drizzle", 
        53: "Drizzle", 
        55: "Heavy drizzle",
        61: "Light rain", 
        63: "Rain", 
        65: "Heavy rain",
        71: "Light snow", 
        73: "Snow", 
        75: "Heavy snow", 
        77: "Snow grains",
        80: "Rain showers", 
        81: "Showers", 
        82: "Heavy showers",
        85: "Snow showers", 
        86: "Heavy snow showers",
        95: "Thunderstorm", 
        96: "Thunderstorm with hail", 
        99: "Severe thunderstorm with hail"
    },
    pl: {
        0: "Bezchmurnie", 
        1: "Przeważnie bezchmurnie", 
        2: "Częściowo pochmurno", 
        3: "Pochmurno",
        45: "Mgła", 
        48: "Mgła z szadzią",
        51: "Lekka mżawka", 
        53: "Mżawka", 
        55: "Silna mżawka",
        61: "Lekki deszcz", 
        63: "Deszcz", 
        65: "Silny deszcz",
        71: "Lekki śnieg", 
        73: "Śnieg", 
        75: "Silny śnieg", 
        77: "Ziarna śniegu",
        80: "Ulewny deszcz", 
        81: "Ulewy", 
        82: "Silne ulewy",
        85: "Śnieżne ulewy", 
        86: "Silne śnieżne ulewy",
        95: "Burza", 
        96: "Burza z gradem", 
        99: "Gwałtowna burza z gradem"
    },
    hu: {
        0: "Derült ég", 
        1: "Főleg derült", 
        2: "Részben felhős", 
        3: "Felhős",
        45: "Köd", 
        48: "Jégköd",
        51: "Gyenge eső", 
        53: "Eső", 
        55: "Erős eső",
        61: "Gyenge eső", 
        63: "Eső", 
        65: "Erős eső",
        71: "Gyenge hó", 
        73: "Hó", 
        75: "Erős hó", 
        77: "Hópelyhek",
        80: "Záporeső", 
        81: "Zápor", 
        82: "Erős zápor",
        85: "Hóvihar", 
        86: "Erős hóvihar",
        95: "Vihar", 
        96: "Jégveréses vihar", 
        99: "Heves jégveréses vihar"
    },
    ro: {
        0: "Cer senin", 
        1: "Preponderent senin", 
        2: "Parțial noros", 
        3: "Înnorat",
        45: "Ceață", 
        48: "Ceață cu chiciură",
        51: "Burniță ușoară", 
        53: "Burniță", 
        55: "Burniță abundentă",
        61: "Ploaie ușoară", 
        63: "Ploaie", 
        65: "Ploaie abundentă",
        71: "Ninsoare ușoară", 
        73: "Ninsoare", 
        75: "Ninsoare abundentă", 
        77: "Grindină fină",
        80: "Averse", 
        81: "Averse puternice", 
        82: "Averse violente",
        85: "Averse de nea", 
        86: "Averse puternice de nea",
        95: "Furtună", 
        96: "Furtună cu grindină", 
        99: "Furtună puternică cu grindină"
    }
};

// Отримання опису погоди
function getWeatherDescription(code, lang) {
    var dict = WEATHER_DESC[lang] || WEATHER_DESC.uk;
    return dict[code] || dict[3];
}

// Категорії УФ-індексу
function getUvCategory(uv) {
    if (uv < 3) return "uvLow";
    if (uv < 6) return "uvModerate";
    if (uv < 8) return "uvHigh";
    if (uv < 11) return "uvVeryHigh";
    return "uvExtreme";
}

// Категорії якості повітря (European AQI)
function getAqiCategory(aqi) {
    if (aqi <= 20) return "aqiGood";
    if (aqi <= 40) return "aqiFair";
    if (aqi <= 60) return "aqiModerate";
    if (aqi <= 80) return "aqiPoor";
    return "aqiVeryPoor";
}

// Кольори для категорій AQI
function getAqiColor(aqi) {
    if (aqi <= 20) return "#48bb78"; // Зелений
    if (aqi <= 40) return "#4299e1"; // Синій
    if (aqi <= 60) return "#ed8936"; // Помаранчевий
    if (aqi <= 80) return "#f56565"; // Червоний
    return "#9f40c1"; // Фіолетовий
}

// Кольори для категорій УФ
function getUvColor(uv) {
    if (uv < 3) return "#48bb78"; // Зелений
    if (uv < 6) return "#4299e1"; // Синій
    if (uv < 8) return "#ed8936"; // Помаранчевий
    if (uv < 11) return "#f56565"; // Червоний
    return "#9f40c1"; // Фіолетовий
}

// Напрямок вітру
function getWindDirection(degrees) {
    if (degrees === null || degrees === undefined) return "-";
    
    var directions = [
        "Пн", "ПнСх", "Сх", "ПдСх", "Пд", "ПдЗх", "Зх", "ПнЗх"
    ];
    var index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Швидкість вітру в км/г
function getWindSpeed(ms) {
    if (ms === null || ms === undefined) return "-";
    return Math.round(ms * 3.6);
}

// Видимість в км
function getVisibility(meters) {
    if (meters === null || meters === undefined) return "-";
    if (meters >= 10000) return "10+";
    return (meters / 1000).toFixed(1);
}

// Тиск в мм рт. ст.
function getPressure(hPa) {
    if (hPa === null || hPa === undefined) return "-";
    return Math.round(hPa * 0.750062);
}

// Опади в мм
function getPrecipitation(mm) {
    if (mm === null || mm === undefined) return "-";
    return mm.toFixed(1);
}

// Тривалість дня
function getDayLength(sunrise, sunset) {
    if (!sunrise || !sunset) return "-";
    var diff = (sunset - sunrise) / 1000 / 60 / 60;
    var hours = Math.floor(diff);
    var minutes = Math.round((diff - hours) * 60);
    return hours + " год " + minutes + " хв";
}

// Форматування часу
function formatTime(date, locale) {
    return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

// Форматування дати
function formatDate(date, locale) {
    return date.toLocaleDateString(locale, { 
        weekday: "short", 
        day: "2-digit", 
        month: "2-digit" 
    });
}

// Анімовані іконки погоди (для фонових ефектів)
function getAnimatedWeatherIcon(code) {
    switch(code) {
        case 0: return "☀️";
        case 1: return "⛅";
        case 2:
        case 3: return "☁️";
        case 45:
        case 48: return "🌫️";
        case 51:
        case 53:
        case 55:
        case 61:
        case 63:
        case 65: return "🌧️";
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86: return "❄️";
        case 80:
        case 81:
        case 82: return "🌧️";
        case 95:
        case 96:
        case 99: return "⛈️";
        default: return "🌦️";
    }
}

// Звуки погоди
var WEATHER_SOUNDS = {
    rain: "https://assets.mixkit.co/sfx/preview/mixkit-rain-heavy-101.mp3",
    thunder: "https://assets.mixkit.co/sfx/preview/mixkit-thunder-close-11.mp3",
    wind: "https://assets.mixkit.co/sfx/preview/mixkit-wind-blowing-101.mp3",
    snow: "https://assets.mixkit.co/sfx/preview/mixkit-snow-crunch-11.mp3"
};

// Отримання звуку для погоди
function getWeatherSound(code) {
    if (code >= 95 && code <= 99) return WEATHER_SOUNDS.thunder;
    if (code >= 61 && code <= 65) return WEATHER_SOUNDS.rain;
    if (code >= 71 && code <= 77) return WEATHER_SOUNDS.snow;
    if (code >= 80 && code <= 82) return WEATHER_SOUNDS.rain;
    return null;
}
