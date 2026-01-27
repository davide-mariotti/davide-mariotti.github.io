/**
 * Weather App Logic
 * Modernized with ES6, async/await and localStorage API Key management
 */

const STORAGE_KEY = 'weather_api_key';
const DEFAULT_KEY = 'b2ed72738688945eaabeec6c00645e54'; // Fallback key

document.addEventListener("DOMContentLoaded", () => {
    // Load saved key if exists
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
        document.getElementById('api-key-input').value = savedKey;
    }

    // Initial fetch for default city
    getWeather();
});

const saveApiKey = () => {
    const key = document.getElementById('api-key-input').value.trim();
    if (key) {
        localStorage.setItem(STORAGE_KEY, key);
        alert('API Key saved successfully!');
        getWeather(); // Refresh with new key
    } else {
        localStorage.removeItem(STORAGE_KEY);
        alert('API Key cleared. Using default key.');
        getWeather();
    }
};

async function getWeather() {
    const cityInput = document.getElementById('city');
    const weatherArea = document.getElementById('weather-display-area');
    const statusMsg = document.getElementById('weather-status-msg');

    // Priority: 1. Input Field (unsaved), 2. LocalStorage, 3. Default (hardcoded)
    const apiKey = document.getElementById('api-key-input').value.trim() || localStorage.getItem(STORAGE_KEY) || DEFAULT_KEY;
    const city = cityInput.value.trim() || 'Fucecchio';

    statusMsg.innerHTML = '<div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading weather...</p>';
    statusMsg.style.display = 'block';
    weatherArea.style.display = 'none';

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        if (weatherRes.status === 401) {
            throw new Error("Invalid API Key or not yet active. Please check the 'Configure API Key' section below.");
        }

        if (weatherData.cod !== 200) {
            throw new Error(weatherData.message || 'City not found');
        }

        displayWeather(weatherData);
        displayHourlyForecast(forecastData.list);

        statusMsg.style.display = 'none';
        weatherArea.style.display = 'block';

    } catch (error) {
        console.error('Weather error:', error);
        statusMsg.innerHTML = `<p class="text-danger">⚠️ ${error.message}</p>`;
        // Open the settings automatically on 401 error
        if (error.message.includes("API Key")) {
            const apiCollapse = new bootstrap.Collapse(document.getElementById('apiConfig'), { show: true });
        }
    }
}

function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const infoDiv = document.getElementById('weather-info');
    const iconImg = document.getElementById('weather-icon');
    const cityName = document.getElementById('city-name-display');

    cityName.textContent = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    tempDiv.innerHTML = `<p>${temp}°</p>`;
    infoDiv.textContent = desc;
    iconImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    iconImg.alt = desc;
}

function displayHourlyForecast(list) {
    const forecastDiv = document.getElementById('hourly-forecast');
    forecastDiv.innerHTML = '';

    // Get next 8 intervals (24 hours)
    const dailyForecast = list.slice(0, 8);

    dailyForecast.forEach(item => {
        const time = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;

        const html = `
            <div class="hourly-item">
                <span>${time}:00</span>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather">
                <span>${temp}°</span>
            </div>
        `;
        forecastDiv.insertAdjacentHTML('beforeend', html);
    });
}