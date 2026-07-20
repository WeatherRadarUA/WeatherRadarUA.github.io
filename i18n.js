// Словник перекладів для Погода UA
// Підтримувані мови: українська, російська, англійська, польська, угорська, румунська

var TRANSLATIONS = {
    uk: {
        // Основні
        siteName: "Погода UA",
        navSearch: "Пошук",
        navMap: "Карта",
        navRadar: "Радар",
        navWarnings: "Попередження",
        
        // Геро-секція
        heroTitle: "⚡ Сучасний прогноз погоди для України",
        heroSubtitle: "Точні дані, інтерактивна карта, радар опадів та попередження про небезпечну погоду",
        feature1: "25+ тис. населених пунктів",
        feature2: "Радар опадів в реальному часі",
        feature3: "Попередження про небезпеку",
        
        // Пошук
        searchPlaceholder: "Введіть назву міста або села...",
        searching: "Шукаємо...",
        noResults: "Нічого не знайдено. Спробуйте іншу назву.",
        recentSearches: "Останні пошуки:",
        clearHistory: "Очистити історію",
        
        // Завантаження
        loading: "Завантаження...",
        loadingWeather: "Завантажуємо прогноз...",
        loadingVillages: "Завантажуємо населені пункти...",
        
        // Помилки
        errorWeather: "Не вдалося завантажити погоду. Спробуйте ще раз.",
        errorLocation: "Не вдалося визначити ваше місцезнаходження",
        errorGeolocation: "Будь ласка, увімкніть геолокацію в браузері",
        
        // Поточна погода
        feelsLike: "Відчувається як",
        maxTemp: "Макс:",
        minTemp: "Мін:",
        humidity: "Вологість:",
        wind: "Вітер:",
        pressure: "Тиск:",
        visibility: "Видимість:",
        precipitation: "Опади:",
        
        // Сонце та місяць
        sunrise: "Схід сонця:",
        sunset: "Захід сонця:",
        dayLength: "Тривалість дня:",
        
        // Індекси
        uvIndex: "УФ-індекс",
        airQuality: "Якість повітря",
        
        // Категорії УФ-індексу
        uvLow: "низький",
        uvModerate: "помірний",
        uvHigh: "високий",
        uvVeryHigh: "дуже високий",
        uvExtreme: "екстремальний",
        
        // Категорії якості повітря (AQI)
        aqiGood: "добра",
        aqiFair: "задовільна",
        aqiModerate: "помірна",
        aqiPoor: "погана",
        aqiVeryPoor: "дуже погана",
        
        // Частини дня
        morning: "Ранок",
        day: "День",
        evening: "Вечір",
        night: "Ніч",
        
        // Дні
        today: "Сьогодні",
        tomorrow: "Завтра",
        
        // Секції
        next24h: "Погодинний прогноз на 24 години",
        dayParts: "Прогноз за частинами дня",
        forecast14: "Прогноз на 14 днів",
        
        // Улюблені
        favorites: "Улюблені місця",
        noFavorites: "У вас поки що немає улюблених місць",
        addToFavorites: "Додати в улюблені",
        removeFromFavorites: "Видалити з улюблених",
        alreadyInFavorites: "Вже в улюблених",
        
        // Радар
        radarTitle: "Радар опадів",
        radarInfo: "Радар показує опади в реальному часі. Оновлюється кожні 10 хвилин.",
        
        // Попередження
        warningsTitle: "Попередження про погоду",
        warningExample: "Наразі попереджень немає",
        warningExampleText: "Попередження про небезпечну погоду (шторми, град, сильні дощі) з'являться тут.",
        warningThunderstorm: "Гроза",
        warningHeavyRain: "Сильні дощі",
        warningSnow: "Снігопад",
        warningHail: "Град",
        warningStrongWind: "Сильний вітер",
        warningFog: "Густий туман",
        warningHeat: "Спека",
        warningFrost: "Мороз",
        
        // Геолокація
        useCurrentLocation: "Використати моє місцезнаходження",
        locationAccessDenied: "Доступ до геолокації заборонено",
        
        // Тема
        themeLight: "Світла тема",
        themeDark: "Темна тема",
        themeAuto: "Автоматично",
        
        // Додатково
        dataSources: "Джерела даних",
        dataSourcesText: "Дані надаються Open-Meteo, OpenStreetMap та іншими відкритими джерелами.",
        about: "Про нас",
        feedback: "Зворотний зв'язок",
        
        // Місцевий контекст
        locale: "uk-UA",
        
        // Підказки
        zoomHint: "Наближте карту, щоб побачити більше населених пунктів",
        
        // Голосовий пошук
        voiceSearch: "Голосовий пошук",
        voiceNotSupported: "Голосовий пошук не підтримується вашим браузером",
        voiceError: "Сталася помилка при розпізнаванні голосу",
        
        // Сповіщення
        notificationTitle: "Погода UA",
        notificationNewWarning: "Нове попередження про погоду",
        
        // Одиниці виміру
        kmh: "км/г",
        ms: "м/с",
        mm: "мм",
        hPa: "гПа",
        percent: "%",
        degrees: "°",
        
        // Місця
        ukraine: "Україна"
    },
    
    ru: {
        siteName: "Погода UA",
        navSearch: "Поиск",
        navMap: "Карта",
        navRadar: "Радар",
        navWarnings: "Предупреждения",
        
        heroTitle: "⚡ Современный прогноз погоды для Украины",
        heroSubtitle: "Точные данные, интерактивная карта, радар осадков и предупреждения об опасной погоде",
        feature1: "25+ тыс. населенных пунктов",
        feature2: "Радар осадков в реальном времени",
        feature3: "Предупреждения об опасности",
        
        searchPlaceholder: "Введите название города или села...",
        searching: "Ищем...",
        noResults: "Ничего не найдено. Попробуйте другое название.",
        recentSearches: "Последние поиски:",
        clearHistory: "Очистить историю",
        
        loading: "Загрузка...",
        loadingWeather: "Загружаем прогноз...",
        loadingVillages: "Загружаем населенные пункты...",
        
        errorWeather: "Не удалось загрузить погоду. Попробуйте еще раз.",
        errorLocation: "Не удалось определить ваше местоположение",
        errorGeolocation: "Пожалуйста, включите геолокацию в браузере",
        
        feelsLike: "Ощущается как",
        maxTemp: "Макс:",
        minTemp: "Мин:",
        humidity: "Влажность:",
        wind: "Ветер:",
        pressure: "Давление:",
        visibility: "Видимость:",
        precipitation: "Осадки:",
        
        sunrise: "Восход солнца:",
        sunset: "Закат солнца:",
        dayLength: "Продолжительность дня:",
        
        uvIndex: "УФ-индекс",
        airQuality: "Качество воздуха",
        
        uvLow: "низкий",
        uvModerate: "умеренный",
        uvHigh: "высокий",
        uvVeryHigh: "очень высокий",
        uvExtreme: "экстремальный",
        
        aqiGood: "хорошее",
        aqiFair: "удовлетворительное",
        aqiModerate: "умеренное",
        aqiPoor: "плохое",
        aqiVeryPoor: "очень плохое",
        
        morning: "Утро",
        day: "День",
        evening: "Вечер",
        night: "Ночь",
        
        today: "Сегодня",
        tomorrow: "Завтра",
        
        next24h: "Почасовой прогноз на 24 часа",
        dayParts: "Прогноз по времени суток",
        forecast14: "Прогноз на 14 дней",
        
        favorites: "Избранные места",
        noFavorites: "У вас пока нет избранных мест",
        addToFavorites: "Добавить в избранное",
        removeFromFavorites: "Удалить из избранного",
        alreadyInFavorites: "Уже в избранном",
        
        radarTitle: "Радар осадков",
        radarInfo: "Радар показывает осадки в реальном времени. Обновляется каждые 10 минут.",
        
        warningsTitle: "Предупреждения о погоде",
        warningExample: "На данный момент предупреждений нет",
        warningExampleText: "Предупреждения об опасной погоде (грозы, град, сильные дожди) будут отображаться здесь.",
        warningThunderstorm: "Гроза",
        warningHeavyRain: "Сильные дожди",
        warningSnow: "Снегопад",
        warningHail: "Град",
        warningStrongWind: "Сильный ветер",
        warningFog: "Густой туман",
        warningHeat: "Жара",
        warningFrost: "Мороз",
        
        useCurrentLocation: "Использовать мое местоположение",
        locationAccessDenied: "Доступ к геолокации запрещен",
        errorGeolocation: "Пожалуйста, включите геолокацию в браузере",
        
        themeLight: "Светлая тема",
        themeDark: "Темная тема",
        themeAuto: "Автоматически",
        
        dataSources: "Источники данных",
        dataSourcesText: "Данные предоставляются Open-Meteo, OpenStreetMap и другими открытыми источниками.",
        about: "О нас",
        feedback: "Обратная связь",
        
        locale: "ru-RU",
        
        zoomHint: "Приблизьте карту, чтобы увидеть больше населенных пунктов",
        
        voiceSearch: "Голосовой поиск",
        voiceNotSupported: "Голосовой поиск не поддерживается вашим браузером",
        voiceError: "Произошла ошибка при распознавании голоса",
        
        notificationTitle: "Погода UA",
        notificationNewWarning: "Новое предупреждение о погоде",
        
        kmh: "км/ч",
        ms: "м/с",
        mm: "мм",
        hPa: "гПа",
        percent: "%",
        degrees: "°",
        
        ukraine: "Украина"
    },
    
    en: {
        siteName: "Weather UA",
        navSearch: "Search",
        navMap: "Map",
        navRadar: "Radar",
        navWarnings: "Warnings",
        
        heroTitle: "⚡ Modern Weather Forecast for Ukraine",
        heroSubtitle: "Accurate data, interactive map, precipitation radar and severe weather warnings",
        feature1: "25+ thousand settlements",
        feature2: "Real-time precipitation radar",
        feature3: "Severe weather warnings",
        
        searchPlaceholder: "Enter city or village name...",
        searching: "Searching...",
        noResults: "Nothing found. Try a different name.",
        recentSearches: "Recent searches:",
        clearHistory: "Clear history",
        
        loading: "Loading...",
        loadingWeather: "Loading forecast...",
        loadingVillages: "Loading settlements...",
        
        errorWeather: "Could not load weather. Please try again.",
        errorLocation: "Could not determine your location",
        errorGeolocation: "Please enable geolocation in your browser",
        
        feelsLike: "Feels like",
        maxTemp: "Max:",
        minTemp: "Min:",
        humidity: "Humidity:",
        wind: "Wind:",
        pressure: "Pressure:",
        visibility: "Visibility:",
        precipitation: "Precipitation:",
        
        sunrise: "Sunrise:",
        sunset: "Sunset:",
        dayLength: "Day length:",
        
        uvIndex: "UV index",
        airQuality: "Air quality",
        
        uvLow: "low",
        uvModerate: "moderate",
        uvHigh: "high",
        uvVeryHigh: "very high",
        uvExtreme: "extreme",
        
        aqiGood: "good",
        aqiFair: "fair",
        aqiModerate: "moderate",
        aqiPoor: "poor",
        aqiVeryPoor: "very poor",
        
        morning: "Morning",
        day: "Day",
        evening: "Evening",
        night: "Night",
        
        today: "Today",
        tomorrow: "Tomorrow",
        
        next24h: "24-hour forecast",
        dayParts: "Forecast by time of day",
        forecast14: "14-day forecast",
        
        favorites: "Favorites",
        noFavorites: "You don't have any favorite locations yet",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        alreadyInFavorites: "Already in favorites",
        
        radarTitle: "Precipitation Radar",
        radarInfo: "The radar shows precipitation in real time. Updates every 10 minutes.",
        
        warningsTitle: "Weather Warnings",
        warningExample: "No warnings at the moment",
        warningExampleText: "Severe weather warnings (storms, hail, heavy rain) will appear here.",
        warningThunderstorm: "Thunderstorm",
        warningHeavyRain: "Heavy rain",
        warningSnow: "Snowfall",
        warningHail: "Hail",
        warningStrongWind: "Strong wind",
        warningFog: "Dense fog",
        warningHeat: "Heat",
        warningFrost: "Frost",
        
        useCurrentLocation: "Use my location",
        locationAccessDenied: "Location access denied",
        errorGeolocation: "Please enable geolocation in your browser",
        
        themeLight: "Light theme",
        themeDark: "Dark theme",
        themeAuto: "Auto",
        
        dataSources: "Data Sources",
        dataSourcesText: "Data provided by Open-Meteo, OpenStreetMap and other open sources.",
        about: "About",
        feedback: "Feedback",
        
        locale: "en-US",
        
        zoomHint: "Zoom in to see more settlements",
        
        voiceSearch: "Voice search",
        voiceNotSupported: "Voice search is not supported by your browser",
        voiceError: "An error occurred during voice recognition",
        
        notificationTitle: "Weather UA",
        notificationNewWarning: "New weather warning",
        
        kmh: "km/h",
        ms: "m/s",
        mm: "mm",
        hPa: "hPa",
        percent: "%",
        degrees: "°",
        
        ukraine: "Ukraine"
    },
    
    pl: {
        siteName: "Pogoda UA",
        navSearch: "Szukaj",
        navMap: "Mapa",
        navRadar: "Radar",
        navWarnings: "Ostrzeżenia",
        
        heroTitle: "⚡ Nowoczesna prognoza pogody dla Ukrainy",
        heroSubtitle: "Dokładne dane, interaktywna mapa, radar opadów i ostrzeżenia przed niebezpieczną pogodą",
        feature1: "25+ tys. miejscowości",
        feature2: "Radar opadów w czasie rzeczywistym",
        feature3: "Ostrzeżenia przed niebezpieczeństwem",
        
        searchPlaceholder: "Wprowadź nazwę miasta lub wsi...",
        searching: "Szukanie...",
        noResults: "Nic nie znaleziono. Spróbuj innej nazwy.",
        recentSearches: "Ostatnie wyszukiwania:",
        clearHistory: "Wyczyść historię",
        
        loading: "Ładowanie...",
        loadingWeather: "Ładowanie prognozy...",
        loadingVillages: "Ładowanie miejscowości...",
        
        errorWeather: "Nie udało się załadować pogody. Spróbuj ponownie.",
        errorLocation: "Nie udało się określić Twojej lokalizacji",
        errorGeolocation: "Włącz geolokalizację w przeglądarce",
        
        feelsLike: "Odczuwalna",
        maxTemp: "Maks:",
        minTemp: "Min:",
        humidity: "Wilgotność:",
        wind: "Wiatr:",
        pressure: "Ciśnienie:",
        visibility: "Widoczność:",
        precipitation: "Opady:",
        
        sunrise: "Wschód słońca:",
        sunset: "Zachód słońca:",
        dayLength: "Długość dnia:",
        
        uvIndex: "Indeks UV",
        airQuality: "Jakość powietrza",
        
        uvLow: "niski",
        uvModerate: "umiarkowany",
        uvHigh: "wysoki",
        uvVeryHigh: "bardzo wysoki",
        uvExtreme: "ekstremalny",
        
        aqiGood: "dobra",
        aqiFair: "zadowalająca",
        aqiModerate: "umiarkowana",
        aqiPoor: "zła",
        aqiVeryPoor: "bardzo zła",
        
        morning: "Rano",
        day: "Dzień",
        evening: "Wieczór",
        night: "Noc",
        
        today: "Dziś",
        tomorrow: "Jutro",
        
        next24h: "Prognoza na 24 godziny",
        dayParts: "Prognoza według pory dnia",
        forecast14: "Prognoza na 14 dni",
        
        favorites: "Ulubione",
        noFavorites: "Nie masz jeszcze ulubionych lokalizacji",
        addToFavorites: "Dodaj do ulubionych",
        removeFromFavorites: "Usuń z ulubionych",
        alreadyInFavorites: "Już w ulubionych",
        
        radarTitle: "Radar opadów",
        radarInfo: "Radar pokazuje opady w czasie rzeczywistym. Aktualizuje się co 10 minut.",
        
        warningsTitle: "Ostrzeżenia pogodowe",
        warningExample: "Obecnie brak ostrzeżeń",
        warningExampleText: "Ostrzeżenia przed niebezpieczną pogodą (burze, grad, ulewy) pojawią się tutaj.",
        warningThunderstorm: "Burza",
        warningHeavyRain: "Ulewy",
        warningSnow: "Śnieg",
        warningHail: "Grad",
        warningStrongWind: "Silny wiatr",
        warningFog: "Gęsta mgła",
        warningHeat: "Upal",
        warningFrost: "Mróz",
        
        useCurrentLocation: "Użyj mojej lokalizacji",
        locationAccessDenied: "Dostęp do lokalizacji zablokowany",
        errorGeolocation: "Włącz geolokalizację w przeglądarce",
        
        themeLight: "Jasny motyw",
        themeDark: "Ciemny motyw",
        themeAuto: "Automatycznie",
        
        dataSources: "Źródła danych",
        dataSourcesText: "Dane dostarcza Open-Meteo, OpenStreetMap i inne otwarte źródła.",
        about: "O nas",
        feedback: "Opinie",
        
        locale: "pl-PL",
        
        zoomHint: "Przybliż mapę, aby zobaczyć więcej miejscowości",
        
        voiceSearch: "Wyszukiwanie głosowe",
        voiceNotSupported: "Wyszukiwanie głosowe nie jest obsługiwane przez Twoją przeglądarkę",
        voiceError: "Wystąpił błąd podczas rozpoznawania głosu",
        
        notificationTitle: "Pogoda UA",
        notificationNewWarning: "Nowe ostrzeżenie pogodowe",
        
        kmh: "km/h",
        ms: "m/s",
        mm: "mm",
        hPa: "hPa",
        percent: "%",
        degrees: "°",
        
        ukraine: "Ukraina"
    },
    
    hu: {
        siteName: "Időjárás UA",
        navSearch: "Keresés",
        navMap: "Térkép",
        navRadar: "Radar",
        navWarnings: "Figyelmeztetések",
        
        heroTitle: "⚡ Modern időjárás-előrejelzés Ukrajna számára",
        heroSubtitle: "Pontos adatok, interaktív térkép, csapadékradar és veszélyes időjárás figyelmeztetések",
        feature1: "25+ ezer település",
        feature2: "Valós idejű csapadékradar",
        feature3: "Veszélyes időjárás figyelmeztetések",
        
        searchPlaceholder: "Adja meg a város vagy falu nevét...",
        searching: "Keresés...",
        noResults: "Nincs találat. Próbálja meg más nevet.",
        recentSearches: "Legutóbbi keresések:",
        clearHistory: "Előzmények törlése",
        
        loading: "Betöltés...",
        loadingWeather: "Időjárás betöltése...",
        loadingVillages: "Települések betöltése...",
        
        errorWeather: "Nem sikerült betölteni az időjárást. Kérjük, próbálja újra.",
        errorLocation: "Nem sikerült meghatározni a helyzetét",
        errorGeolocation: "Kérjük, engedélyezze a helymeghatározást a böngészőben",
        
        feelsLike: "Érzett hőmérséklet",
        maxTemp: "Max:",
        minTemp: "Min:",
        humidity: "Páratartalom:",
        wind: "Szél:",
        pressure: "Légnyomás:",
        visibility: "Látótávolság:",
        precipitation: "Csapadék:",
        
        sunrise: "Napkelte:",
        sunset: "Napnyugta:",
        dayLength: "Nappali időtartam:",
        
        uvIndex: "UV index",
        airQuality: "Légminőség",
        
        uvLow: "alacsony",
        uvModerate: "mérsékelt",
        uvHigh: "magas",
        uvVeryHigh: "nagyon magas",
        uvExtreme: "extrem",
        
        aqiGood: "jó",
        aqiFair: "megfelelő",
        aqiModerate: "mérsékelt",
        aqiPoor: "rossz",
        aqiVeryPoor: "nagyon rossz",
        
        morning: "Regenyel",
        day: "Nappal",
        evening: "Este",
        night: "Éjszaka",
        
        today: "Ma",
        tomorrow: "Holnap",
        
        next24h: "24 órás előrejelzés",
        dayParts: "Előrejelzés a nap részére",
        forecast14: "14 napos előrejelzés",
        
        favorites: "Kedvencek",
        noFavorites: "Jelenleg nincsenek kedvenc helyszínei",
        addToFavorites: "Hozzáadás a kedvencekhez",
        removeFromFavorites: "Eltávolítás a kedvencekből",
        alreadyInFavorites: "Már a kedvencek között van",
        
        radarTitle: "Csapadékradar",
        radarInfo: "A radar valós időben mutatja a csapadékot. 10 percenként frissül.",
        
        warningsTitle: "Időjárás figyelmeztetések",
        warningExample: "Jelenleg nincsenek figyelmeztetések",
        warningExampleText: "A veszélyes időjárás figyelmeztetések (vihar, jégverés, heves eső) itt fognak megjelenni.",
        warningThunderstorm: "Vihar",
        warningHeavyRain: "Heves eső",
        warningSnow: "Hóesés",
        warningHail: "Jégverés",
        warningStrongWind: "Erős szél",
        warningFog: "Sűrű köd",
        warningHeat: "Kánikula",
        warningFrost: "Fagy",
        
        useCurrentLocation: "Használja a jelenlegi helyzetét",
        locationAccessDenied: "Helymeghatározás elutasítva",
        errorGeolocation: "Kérjük, engedélyezze a helymeghatározást a böngészőben",
        
        themeLight: "Világos téma",
        themeDark: "Sötét téma",
        themeAuto: "Automatikus",
        
        dataSources: "Adatforrások",
        dataSourcesText: "Az adatok az Open-Meteo, OpenStreetMap és más nyílt források által biztosítva.",
        about: "Rólunk",
        feedback: "Visszajelzés",
        
        locale: "hu-HU",
        
        zoomHint: "Nagyítsa a térképen több település megtekintéséhez",
        
        voiceSearch: "Hangkeresés",
        voiceNotSupported: "A hangkeresés nem támogatott a böngészőjében",
        voiceError: "Hiba történt a hangfelismerés során",
        
        notificationTitle: "Időjárás UA",
        notificationNewWarning: "Új időjárás figyelmeztetés",
        
        kmh: "km/h",
        ms: "m/s",
        mm: "mm",
        hPa: "hPa",
        percent: "%",
        degrees: "°",
        
        ukraine: "Ukrajna"
    },
    
    ro: {
        siteName: "Vremea UA",
        navSearch: "Căutare",
        navMap: "Hartă",
        navRadar: "Radar",
        navWarnings: "Avertizări",
        
        heroTitle: "⚡ Prognoza meteo modernă pentru Ucraina",
        heroSubtitle: "Date precise, hartă interactivă, radar de precipitații și avertizări pentru vreme periculoasă",
        feature1: "25+ mii de localități",
        feature2: "Radar de precipitații în timp real",
        feature3: "Avertizări pentru vreme periculoasă",
        
        searchPlaceholder: "Introduceți numele orașului sau satului...",
        searching: "Căutare...",
        noResults: "Nimic găsit. Încercați un alt nume.",
        recentSearches: "Căutări recente:",
        clearHistory: "Șterge istoric",
        
        loading: "Încărcare...",
        loadingWeather: "Se încarcă prognoza...",
        loadingVillages: "Se încarcă localitățile...",
        
        errorWeather: "Nu s-a putut încărca vremea. Încercați din nou.",
        errorLocation: "Nu s-a putut determina locația dvs.",
        errorGeolocation: "Vă rugăm să activați geolocalizarea în browser",
        
        feelsLike: "Se simte ca",
        maxTemp: "Max:",
        minTemp: "Min:",
        humidity: "Umiditate:",
        wind: "Vânt:",
        pressure: "Presiune:",
        visibility: "Vizibilitate:",
        precipitation: "Precipitații:",
        
        sunrise: "Răsarit:",
        sunset: "Apus:",
        dayLength: "Durata zilei:",
        
        uvIndex: "Index UV",
        airQuality: "Calitatea aerului",
        
        uvLow: "scăzut",
        uvModerate: "moderat",
        uvHigh: "ridicat",
        uvVeryHigh: "foarte ridicat",
        uvExtreme: "extrem",
        
        aqiGood: "bun",
        aqiFair: "satisfăcător",
        aqiModerate: "moderat",
        aqiPoor: "slab",
        aqiVeryPoor: "foarte slab",
        
        morning: "Dimineață",
        day: "Zi",
        evening: "Seară",
        night: "Noapte",
        
        today: "Astăzi",
        tomorrow: "Mâine",
        
        next24h: "Prognoză pe 24 de ore",
        dayParts: "Prognoză pe părți ale zilei",
        forecast14: "Prognoză pe 14 zile",
        
        favorites: "Favorite",
        noFavorites: "Nu aveți încă locații favorite",
        addToFavorites: "Adăugați la favorite",
        removeFromFavorites: "Eliminați din favorite",
        alreadyInFavorites: "Deja în favorite",
        
        radarTitle: "Radar precipitații",
        radarInfo: "Radarul arată precipitațiile în timp real. Se actualizează la fiecare 10 minute.",
        
        warningsTitle: "Avertizări meteo",
        warningExample: "Nu există avertizări în acest moment",
        warningExampleText: "Avertizările pentru vreme periculoasă (furtuni, grindină, ploi torențiale) vor apărea aici.",
        warningThunderstorm: "Furtună",
        warningHeavyRain: "Ploi torențiale",
        warningSnow: "Ninsoare",
        warningHail: "Grindină",
        warningStrongWind: "Vânt puternic",
        warningFog: "Ceață densă",
        warningHeat: "Caldură",
        warningFrost: "Îngheț",
        
        useCurrentLocation: "Utilizați locația mea",
        locationAccessDenied: "Accesul la locație refuzat",
        errorGeolocation: "Vă rugăm să activați geolocalizarea în browser",
        
        themeLight: "Temă deschisă",
        themeDark: "Temă închisă",
        themeAuto: "Automat",
        
        dataSources: "Surse de date",
        dataSourcesText: "Datele sunt furnizate de Open-Meteo, OpenStreetMap și alte surse deschise.",
        about: "Despre noi",
        feedback: "Feedback",
        
        locale: "ro-RO",
        
        zoomHint: "Măriți harta pentru a vedea mai multe localități",
        
        voiceSearch: "Căutare vocală",
        voiceNotSupported: "Căutarea vocală nu este suportată de browserul dvs.",
        voiceError: "A apărut o eroare la recunoașterea vocii",
        
        notificationTitle: "Vremea UA",
        notificationNewWarning: "Avertizare meteo nouă",
        
        kmh: "km/h",
        ms: "m/s",
        mm: "mm",
        hPa: "hPa",
        percent: "%",
        degrees: "°",
        
        ukraine: "Ucraina"
    }
};

// Отримання поточної мови
function getCurrentLang() {
    var saved = localStorage.getItem("weatherua_lang");
    if (saved && TRANSLATIONS[saved]) return saved;
    // Визначення мови браузера
    var browserLang = navigator.language || navigator.userLanguage;
    var langMap = {
        'uk': 'uk', 'uk-UA': 'uk',
        'ru': 'ru', 'ru-RU': 'ru',
        'en': 'en', 'en-US': 'en', 'en-GB': 'en',
        'pl': 'pl', 'pl-PL': 'pl',
        'hu': 'hu', 'hu-HU': 'hu',
        'ro': 'ro', 'ro-RO': 'ro'
    };
    return langMap[browserLang] || 'uk';
}

// Встановлення мови
function setCurrentLang(lang) {
    localStorage.setItem("weatherua_lang", lang);
}

// Переклад
function t(key) {
    var lang = getCurrentLang();
    return TRANSLATIONS[lang][key] || TRANSLATIONS.uk[key] || key;
}

// Рендеринг перемикача мов
function renderLangSwitch(containerId, onChangeCallback) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var current = getCurrentLang();
    var langs = [
        { code: "uk", label: "🇺🇦", name: "Українська" },
        { code: "ru", label: "🇷🇺", name: "Русский" },
        { code: "en", label: "🇬🇧", name: "English" },
        { code: "pl", label: "🇵🇱", name: "Polski" },
        { code: "hu", label: "🇭🇺", name: "Magyar" },
        { code: "ro", label: "🇷🇴", name: "Română" }
    ];

    container.innerHTML = "";
    langs.forEach(function (lang) {
        var btn = document.createElement("button");
        btn.textContent = lang.label;
        btn.title = lang.name;
        if (code === current) btn.className = "active";
        btn.addEventListener("click", function () {
            setCurrentLang(lang.code);
            if (onChangeCallback) onChangeCallback(lang.code);
        });
        container.appendChild(btn);
    });
}

// Застосування перекладів до всіх елементів
function applyTranslations() {
    // Текстові елементи
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        el.textContent = t(key);
    });
    
    // Плейсхолдери
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        var key = el.getAttribute("data-i18n-placeholder");
        el.setAttribute("placeholder", t(key));
    });
    
    // Title
    document.title = t("siteName") + " — " + t("heroTitle");
    
    // Meta description
    var metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
        metaDesc.setAttribute("content", t("heroSubtitle"));
    }
}
