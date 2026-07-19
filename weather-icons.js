// Перетворює числовий weathercode (стандарт WMO, який повертає Open-Meteo) на емодзі-іконку
function getWeatherIcon(code) {
    if (code === 0 || code === 1) return "☀️";
    if (code === 2) return "⛅";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 57) return "🌦️";
    if (code >= 61 && code <= 67) return "🌧️";
    if (code === 71 || code === 73 || code === 75 || code === 77) return "❄️";
    if (code === 80 || code === 81 || code === 82) return "🌧️";
    if (code === 85 || code === 86) return "🌨️";
    if (code === 95) return "⛈️";
    if (code === 96 || code === 99) return "⛈️";
    return "☁️";
}

// Текстовий опис погоди трьома мовами (для великого блоку "зараз")
var WEATHER_DESC = {
    uk: {
        0: "Ясно", 1: "Переважно ясно", 2: "Мінлива хмарність", 3: "Хмарно",
        45: "Туман", 48: "Туман з інеєм",
        51: "Легка мряка", 53: "Мряка", 55: "Сильна мряка",
        61: "Невеликий дощ", 63: "Дощ", 65: "Сильний дощ",
        71: "Невеликий сніг", 73: "Сніг", 75: "Сильний сніг", 77: "Снігова крупа",
        80: "Короткочасний дощ", 81: "Зливи", 82: "Сильні зливи",
        85: "Снігопад", 86: "Сильний снігопад",
        95: "Гроза", 96: "Гроза з градом", 99: "Сильна гроза з градом"
    },
    ru: {
        0: "Ясно", 1: "Преимущественно ясно", 2: "Переменная облачность", 3: "Облачно",
        45: "Туман", 48: "Туман с инеем",
        51: "Лёгкая морось", 53: "Морось", 55: "Сильная морось",
        61: "Небольшой дождь", 63: "Дождь", 65: "Сильный дождь",
        71: "Небольшой снег", 73: "Снег", 75: "Сильный снег", 77: "Снежная крупа",
        80: "Кратковременный дождь", 81: "Ливни", 82: "Сильные ливни",
        85: "Снегопад", 86: "Сильный снегопад",
        95: "Гроза", 96: "Гроза с градом", 99: "Сильная гроза с градом"
    },
    en: {
        0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy",
        45: "Fog", 48: "Rime fog",
        51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
        61: "Light rain", 63: "Rain", 65: "Heavy rain",
        71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
        80: "Rain showers", 81: "Showers", 82: "Heavy showers",
        85: "Snow showers", 86: "Heavy snow showers",
        95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm with hail"
    }
};

function getWeatherDescription(code, lang) {
    var dict = WEATHER_DESC[lang] || WEATHER_DESC.uk;
    return dict[code] || dict[3];
}
