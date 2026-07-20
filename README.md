# Погода UA 🇺🇦

**Сучасний прогноз погоди для України**

[![Website](https://img.shields.io/website?url=https://weatherradarua.github.io&label=WeatherRadarUA.github.io)](https://weatherradarua.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/WeatherRadarUA/WeatherRadarUA.github.io?style=social)](https://github.com/WeatherRadarUA/WeatherRadarUA.github.io/stargazers)

## 🌟 Особливості

### ✅ Основні функції
- **Точний прогноз погоди** для 25+ тисяч населених пунктів України
- **Погодинний прогноз** на 24 години
- **Прогноз на 14 днів** з детальною інформацією
- **Прогноз за частинами дня** (ранок, день, вечір, ніч)
- **Інтерактивна карта** України з маркерами міст

### 🗺️ Карта
- **Два типи карти**: стандартна та супутникова
- **Шари оверлеїв**: опади, температура, вітер
- **Кластеризація маркерів** для зручного перегляду
- **Пошук по карті** - клік на будь-яке місце показує погоду
- **Автоматичне визначення місцезнаходження**

### 🎨 Дизайн
- **Сучасний та зручний інтерфейс**
- **Анімований фон** в залежності від погоди
- **Темна та світла теми** з автоматичним вибором
- **Адаптивний дизайн** для всіх пристроїв
- **Українські кольори** (синьо-жовта палітра)

### 🌍 Локалізація
- **6 мов**: Українська, Російська, Англійська, Польська, Угорська, Румунська
- **Автоматичне визначення мови** браузера
- **Повна підтримка Unicode**

### ⚡ Додаткові функції
- **Улюблені місця** - збереження улюблених локацій
- **Історія пошуків** - швидкий доступ до останніх запитів
- **Голосовий пошук** - пошук за допомогою мікрофона
- **Радар опадів** - візуалізація опадів в реальному часі (Ventusky)
- **Попередження про небезпечну погоду**
- **Погодні звуки** - звуки дощу, вітру, грози

### 📱 PWA (Progressive Web App)
- **Встановлення на пристрій** як додаток
- **Офлайн-режим** - робота без інтернету
- **Push-сповіщення** про зміну погоди
- **Швидке завантаження** завдяки кешуванню

## 🚀 Як використовувати

### Локальний запуск
1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/WeatherRadarUA/WeatherRadarUA.github.io.git
   cd WeatherRadarUA.github.io
   ```

2. Відкрийте `index.html` у браузері

### Встановлення як PWA
1. Відкрийте сайт у Chrome, Edge або Safari
2. Натисніть "Встановити" у адресному рядку
3. Додаток буде встановлено на ваш пристрій

## 🛠️ Технології

- **HTML5, CSS3, JavaScript (ES6+)**
- **Leaflet.js** - для інтерактивної карти
- **Open-Meteo API** - дані про погоду
- **OpenStreetMap** - картографічні дані
- **Ventusky** - радар опадів
- **Font Awesome** - іконки
- **Service Worker** - для PWA функціоналу

## 📦 API, які використовуються

- [Open-Meteo](https://open-meteo.com/) - Прогноз погоди
- [OpenStreetMap](https://www.openstreetmap.org/) - Картографічні дані
- [Nominatim](https://nominatim.org/) - Геокодування
- [Ventusky](https://www.ventusky.com/) - Радар опадів
- [Overpass API](https://overpass-api.de/) - Пошук населених пунктів

## 🎯 Структура проекту

```
WeatherRadarUA.github.io/
├── index.html          # Головна сторінка
├── map.html            # Сторінка карти
├── style.css           # Стилі
├── app.js              # Логіка головної сторінки
├── map.js              # Логіка карти
├── i18n.js             # Локалізація
├── weather-icons.js    # Іконки погоди
├── manifest.json       # Маніфест PWA
├── service-worker.js   # Service Worker
├── sw-register.js      # Реєстрація Service Worker
├── favicon.ico         # Іконка сайту
├── icons/              # Іконки для PWA
└── screenshots/        # Скриншоти
```

## 🤝 Як допомогти

### Звіт про помилки
1. Створіть Issue у репозиторії
2. Опишіть проблему
3. Додайте скріншот (якщо потрібно)

### Пропозиції щодо покращення
1. Створіть Issue з тегом `enhancement`
2. Опишіть свою ідею
3. Ми обов'язково розглянемо її!

### Pull Request
1. Форкніть репозиторій
2. Створіть гілку для вашої функції (`git checkout -b feature/amazing-feature`)
3. Зробіть коміт ваших змін (`git commit -m 'Add amazing feature'`)
4. Відправте у свій форк (`git push origin feature/amazing-feature`)
5. Відкрийте Pull Request

## 📜 Ліцензія

Цей проект ліцензований за [MIT License](https://opensource.org/licenses/MIT).

## 🙏 Подяки

- [Open-Meteo](https://open-meteo.com/) за безкоштовні дані про погоду
- [OpenStreetMap](https://www.openstreetmap.org/) за картографічні дані
- [Leaflet.js](https://leafletjs.com/) за чудову бібліотеку для карти
- Всім, хто допомагає покращувати цей проект!

---

**Зроблено з ❤️ для України** 🇺🇦
