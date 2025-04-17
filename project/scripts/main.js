
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const weatherSearchForm = document.getElementById('weather-search-form');
const locationInput = document.getElementById('location-input');
const searchError = document.getElementById('search-error');
const currentWeatherSection = document.querySelector('.current-weather');
const currentWeatherLocation = document.getElementById('current-weather-location');
const weatherResultsContainer = document.getElementById('weather-results');
const forecastResultsContainer = document.getElementById('forecast-results');
const forecastLocationDisplay = document.getElementById('forecast-location');
const nextRainInfoElement = document.getElementById('next-rain-info');

const currentLoader = document.querySelector('.current-weather .loader');
const forecastLoader = document.querySelector('.forecast-display .loader');

const modal = document.getElementById('weather-modal');
const modalBody = document.getElementById('modal-body');
const closeModalButton = document.querySelector('.close-modal');

const API_KEY = '278b044a469bdaddcb31feb72c20af55';
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const UNITS = 'imperial';

//helper functions

const showLoader = (loader) => {
    if (loader) loader.classList.remove('hidden');
};

const hideLoader = (loader) => {
     if (loader) loader.classList.add('hidden');
};

const displayError = (element, message) => {
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
};

const hideError = (element) => {
    if (element) {
        element.textContent = '';
        element.classList.add('hidden');
    }
};


if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        navLinks.classList.toggle('show');
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    });
}


const showModal = (title, content) => {
    if (modal && modalBody) {
        modalBody.innerHTML = `<h3>${title}</h3>${content}`;
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }
};

const hideModal = () => {
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
             modal.classList.add('hidden');
             if (modalBody) modalBody.innerHTML = '';
        }, 300); 
    }
};

if (closeModalButton) {
    closeModalButton.addEventListener('click', hideModal);
}
if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
}


//I am just labeling them like this so it's visually easier for me to sort through them

// ---------------------- FetchWeatherData ----------------------

const fetchWeatherData = async (url, location, loader) => {
    showLoader(loader);
    hideError(searchError);

    const params = new URLSearchParams({
        q: location,
        appid: API_KEY,
        units: UNITS
    });

    try {
        const response = await fetch(`${url}?${params}`);
        if (!response.ok) {
            const data = await response.json();
            const message = data?.message || `API Error: ${response.status} ${response.statusText}`;
            if (response.status === 404) {
                 throw new Error(`Location "${location}" not found. ${message}`);
            } else if (response.status === 401) {
                throw new Error(`Invalid API Key. ${message}`);
            } else {
                throw new Error(message);
            }
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch Weather Error:', error);
        displayError(searchError, error.message || 'Could not fetch weather data. Please try again.');
        showModal('Weather Data Error', `<p>${error.message || 'Could not fetch weather data.'}</p>`);
        return null;
    } finally {
         hideLoader(loader);
    }
};


// ---------------------- displayCurrentWeather ----------------------

const displayCurrentWeather = (data) => {
    if (!data || !weatherResultsContainer || !currentWeatherSection || !currentWeatherLocation) {
        console.warn('Missing elements for displaying current weather.');
        return;
    }

    const { name, main, weather, wind, sys } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const weatherHTML = `
        <div class="weather-main">
             <img src="${iconUrl}" alt="${weather[0].description}" loading="lazy">
            <span class="temp">${Math.round(main.temp)}°F</span>
        </div>
        <p class="description">${weather[0].description}</p>
        <div class="details">
            <p>Feels like: ${Math.round(main.feels_like)}°F</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind: ${Math.round(wind.speed)} mph</p>
            <p>Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    `;

    currentWeatherLocation.textContent = `Current Weather in ${name}`;
    weatherResultsContainer.innerHTML = weatherHTML;
    currentWeatherSection.classList.remove('hidden');
};

// ---------------------- displayNextRainInfo ----------------------


const displayNextRainInfo = (forecastList) => {
    if (!forecastList || forecastList.length === 0 || !nextRainInfoElement) {
        if (nextRainInfoElement) nextRainInfoElement.classList.add('hidden');
        return;
    }

    // Reference: https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
    const rainConditionIds = [
        200, 201, 202, 210, 211, 212, 221, 230, 231, 232, // Thunderstorm
        300, 301, 302, 310, 311, 312, 313, 314, 321, // Drizzle
        500, 501, 502, 503, 504, 511, 520, 521, 522, 531 // Rain
    ];

    const now = Date.now();
    const firstRainItem = forecastList.find(item =>
        item.weather && item.weather[0] && rainConditionIds.includes(item.weather[0].id) && (item.dt * 1000 > now)
    );

    let rainMessage = "No significant rain expected in the next 5 days.";

    if (firstRainItem) {
        const rainTime = firstRainItem.dt * 1000;
        const diffMs = rainTime - now;
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours <= 1) {
            rainMessage = "Next rain expected within the hour.";
        } else if (diffHours <= 48) {
            rainMessage = `Next rain expected in: ~${Math.round(diffHours)} hours`;
        } else {
            const diffDays = diffHours / 24;
            rainMessage = `Next rain expected in: ~${Math.round(diffDays)} days`;
        }
    }

    nextRainInfoElement.textContent = rainMessage;
    nextRainInfoElement.classList.remove('hidden');
};

// ---------------------- displayForecast ----------------------

const displayForecast = (data) => {
    if (!data || !data.list || !forecastResultsContainer || !forecastLocationDisplay) {
         console.warn('Missing elements for displaying forecast.');
         if (forecastLocationDisplay) forecastLocationDisplay.textContent = 'Error displaying forecast data.';
         if (nextRainInfoElement) nextRainInfoElement.classList.add('hidden');
        return;
    }

    forecastLocationDisplay.textContent = `Forecast for ${data.city.name}`;
    forecastResultsContainer.innerHTML = '';
    let currentDayString = '';
    let dayCounter = 0;
    let forecastHTML = '';

    displayNextRainInfo(data.list);

    data.list.forEach(item => {
        const { dt, main, weather, wind } = item;
        const dateTime = new Date(dt * 1000);
        const itemDayString = dateTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        const dateShortString = dateTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        const timeString = dateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hourTwelve: false }); //can be set to false if wanted
        const iconCode = weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        if (itemDayString !== currentDayString) {
            dayCounter++;
            currentDayString = itemDayString;
            forecastHTML += `<h3 class="forecast-day-heading">Day ${dayCounter}: ${itemDayString}</h3>`;
        }

        forecastHTML += `
            <div class="forecast-item">
                <p class="time">${dateShortString} ${timeString}</p>
                <img src="${iconUrl}" alt="${weather[0].description}" loading="lazy">
                <p class="temp">${Math.round(main.temp)}°F</p>
                <p class="desc">${weather[0].description}</p>
                <p class="wind">Wind: ${Math.round(wind.speed)} mph</p>
            </div>
        `;
    });

    forecastResultsContainer.innerHTML = forecastHTML;
    forecastResultsContainer.closest('section')?.classList.remove('hidden');
};

// ---------------------- handleWeatherSearch ----------------------

const handleWeatherSearch = async (event) => {
    event.preventDefault();
    if (!locationInput || !currentLoader) return;

    const location = locationInput.value.trim();

    if (!location) {
        displayError(searchError, 'Please enter a location.');
        return;
    }

    if (currentWeatherSection) currentWeatherSection.classList.add('hidden');

    const currentWeatherData = await fetchWeatherData(CURRENT_WEATHER_URL, location, currentLoader);
    if (currentWeatherData) {
        displayCurrentWeather(currentWeatherData);
        localStorage.setItem('lastWeatherLocation', location);
    } else {
        if (currentWeatherSection) currentWeatherSection.classList.add('hidden');
    }
};

const initializePage = async () => {
    const lastLocation = localStorage.getItem('lastWeatherLocation');

    //Home Page
    if (weatherSearchForm && locationInput) {
        if (lastLocation) {
            locationInput.value = lastLocation;
        }
        weatherSearchForm.addEventListener('submit', handleWeatherSearch);
    }

    //Forecast Page
    if (forecastResultsContainer && forecastLocationDisplay && forecastLoader) {
         if(nextRainInfoElement) nextRainInfoElement.classList.add('hidden');

        if (lastLocation) {
             forecastLocationDisplay.textContent = `Loading forecast for ${lastLocation}...`;
            const forecastData = await fetchWeatherData(FORECAST_URL, lastLocation, forecastLoader);
            if (forecastData) {
                displayForecast(forecastData);
            } else {
                 forecastLocationDisplay.textContent = `Could not load forecast for "${lastLocation}". Check the error or try searching again on the Home page.`;
                 if(nextRainInfoElement) nextRainInfoElement.classList.add('hidden');
            }
        } else {
            forecastLocationDisplay.textContent = 'Please search for a location on the Home page first.';
            hideLoader(forecastLoader);
             if(nextRainInfoElement) nextRainInfoElement.classList.add('hidden');
        }
    }
};

document.addEventListener('DOMContentLoaded', initializePage);