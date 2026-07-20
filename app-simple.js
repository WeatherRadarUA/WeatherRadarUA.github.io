// ============================================
// Спрощена версія app.js для тестування
// ============================================

console.log('app-simple.js завантажено!');

// Глобальні змінні
var currentPlace = null;

// Fallback функція перекладу
function t(key) {
    var translations = {
        loading: "Завантаження...",
        searching: "Шукаємо...",
        noResults: "Нічого не знайдено",
        loadingWeather: "Завантажуємо прогноз...",
        errorWeather: "Не вдалося завантажити погоду",
        feelsLike: "Відчувається як",
        maxTemp: "Макс:",
        minTemp: "Мін:",
        humidity: "Вологість:",
        wind: "Вітер:",
        sunrise: "Схід сонця:",
        sunset: "Захід сонця:",
        kmh: "км/г"
    };
    return translations[key] || key;
}

// Ініціалізація при завантаженні сторінки
document.addEventListener("DOMContentLoaded", function () {
    console.log('DOM завантажено!');
    
    // Приховуємо екран завантаження
    var loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }
    
    // Тест: Додаємо обробник для поля пошуку
    var cityInput = document.getElementById("cityInput");
    if (cityInput) {
        console.log('Знайдено поле пошуку!');
        
        cityInput.addEventListener("input", function() {
            console.log('Введено текст: ' + this.value);
        });
        
        cityInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                console.log('Натиснуто Enter!');
                var query = this.value.trim();
                if (query.length >= 2) {
                    searchCity(query);
                }
            }
        });
    }
    
    // Тест: Додаємо обробник для кнопки геолокації
    var geolocBtn = document.getElementById("geolocBtn");
    if (geolocBtn) {
        console.log('Знайдено кнопку геолокації!');
        geolocBtn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log('Кнопка геолокації натиснута!');
            getLocation();
        });
    }
    
    // Тест: Додаємо обробник для кнопки пошуку
    var searchBtn = document.getElementById("clearSearch");
    if (searchBtn) {
        console.log('Знайдено кнопку очищення!');
        searchBtn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log('Кнопка очищення натиснута!');
            if (cityInput) cityInput.value = "";
        });
    }
    
    console.log('Всі обробники додано!');
});

// Пошук міста
function searchCity(query) {
    console.log('Шукаємо місто: ' + query);
    
    var url = "https://geocoding-api.open-meteo.com/v1/search?name=" + 
              encodeURIComponent(query) + "&count=1&language=uk&format=json";
    
    console.log('URL запиту: ' + url);
    
    fetch(url)
        .then(function(r) {
            console.log('Відповідь отримана, статус: ' + r.status);
            return r.json();
        })
        .then(function(data) {
            console.log('Дані отримано:', data);
            if (data.results && data.results.length > 0) {
                var place = data.results[0];
                console.log('Знайдено місце:', place);
                showWeather(place);
            } else {
                console.log('Нічого не знайдено');
                showError('Нічого не знайдено');
            }
        })
        .catch(function(e) {
            console.error('Помилка:', e);
            showError('Помилка запиту: ' + e.message);
        });
}

// Отримання геолокації
function getLocation() {
    console.log('Отримуємо геолокацію...');
    
    if (!navigator.geolocation) {
        showError('Геолокація не підтримується');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            console.log('Геолокація отримана:', position.coords);
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            reverseGeocode(lat, lon);
        },
        function(error) {
            console.error('Помилка геолокації:', error);
            showError('Помилка геолокації: ' + error.message);
        }
    );
}

// Зворотнє геокодування
function reverseGeocode(lat, lon) {
    console.log('Зворотнє геокодування для: ' + lat + ', ' + lon);
    
    var url = "https://geocoding-api.open-meteo.com/v1/search?latitude=" + lat + 
              "&longitude=" + lon + "&count=1&language=uk&format=json";
    
    fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            console.log('Зворотнє геокодування:', data);
            if (data.results && data.results.length > 0) {
                showWeather(data.results[0]);
            } else {
                showError('Місце не знайдено');
            }
        })
        .catch(function(e) {
            showError('Помилка: ' + e.message);
        });
}

// Показ погоди
function showWeather(place) {
    console.log('Показуємо погоду для:', place);
    currentPlace = place;
    
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude +
              "&longitude=" + place.longitude +
              "&current=temperature_2m,weathercode,apparent_temperature" +
              "&daily=temperature_2m_max,temperature_2m_min" +
              "&timezone=auto";
    
    console.log('URL погоди: ' + url);
    
    fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            console.log('Дані погоди:', data);
            displayWeather(place, data);
        })
        .catch(function(e) {
            showError('Помилка завантаження погоди: ' + e.message);
        });
}

// Відображення погоди
function displayWeather(place, data) {
    console.log('Відображаємо погоду');
    
    var resultCard = document.getElementById("resultCard");
    if (resultCard) {
        resultCard.classList.add("show");
    }
    
    var cityTitle = document.getElementById("cityTitle");
    var bigTemp = document.getElementById("bigTemp");
    var currentDesc = document.getElementById("currentDesc");
    
    if (cityTitle) cityTitle.textContent = place.name;
    if (bigTemp) bigTemp.textContent = Math.round(data.current.temperature_2m) + "°";
    if (currentDesc) currentDesc.textContent = "Температура: " + Math.round(data.current.temperature_2m) + "°";
    
    console.log('Погоду відображено!');
}

// Показ помилки
function showError(message) {
    console.error('Помилка: ' + message);
    var statusMsg = document.getElementById("statusMsg");
    if (statusMsg) {
        statusMsg.textContent = message;
        statusMsg.style.display = "block";
        statusMsg.style.color = "red";
    }
    alert(message);
}

// Експорт функцій
window.weatherApp = {
    searchCity: searchCity,
    showWeather: showWeather
};

console.log('app-simple.js ініціалізовано!');
