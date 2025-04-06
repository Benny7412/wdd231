const api = "278b044a469bdaddcb31feb72c20af55";
const lat = "16.77315386667067";
const lon = "-3.007517092507894";

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api}&units=metric`;

const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const captionDesc = document.querySelector("#weather-container figcaption");
const cityLocation = document.querySelector("#location");
const currentClouds = document.querySelector("#current-clouds");
const currentHigh = document.querySelector("#current-high");
const currentLow = document.querySelector("#current-low");
const currentHumidity = document.querySelector("#current-humidity");
const currentSunrise = document.querySelector("#current-sunrise");
const currentSunset = document.querySelector("#current-sunset");
const todayForecast = document.querySelector("#today-forecast");
const dayTwoForecast = document.querySelector("#day-two-forecast");
const dayThreeForecast = document.querySelector("#day-three-forecast");

async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayResults(data); // uncomment when ready
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

function displayResults(data) {
  currentTemp.innerHTML = `${data.main.temp.toFixed(1)}&deg;C`;
  const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  let desc = data.weather[0].description;
  weatherIcon.setAttribute("src", iconsrc);
  weatherIcon.setAttribute("alt", desc);
  captionDesc.textContent = desc;

  if (cityLocation) cityLocation.innerHTML = data.name;

  currentHigh.innerHTML = `${data.main.temp_max.toFixed(1)}&deg;C`;
  currentLow.innerHTML = `${data.main.temp_min.toFixed(1)}&deg;C`;
  currentHumidity.innerHTML = `${data.main.humidity}%`;

  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  currentSunrise.innerHTML = formatTime(sunrise);
  currentSunset.innerHTML = formatTime(sunset);
}

async function fetchForecast() {
  try {
    console.log("Fetching forecast...");
    const responseForecast = await fetch(forecastUrl);
    if (responseForecast.ok) {
      const dataForecast = await responseForecast.json();
      displayForecast(dataForecast);
    } else {
      throw Error(await responseForecast.text());
    }
  } catch (error) {
    console.log(error);
  }
}

function displayForecast(data) {
  const todayData = data.list[0];
  const dayTwoData = data.list[8];
  const dayThreeData = data.list[16];

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: "long" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  //day1
  todayForecast.innerHTML = `<strong>Today:</strong> ${todayData.main.temp.toFixed(
    1
  )}&deg;C, ${todayData.weather[0].description}`;

  //day2
  dayTwoForecast.innerHTML = `<strong>${formatDay(
    dayTwoData.dt
  )}:</strong> ${dayTwoData.main.temp.toFixed(1)}&deg;C, ${
    dayTwoData.weather[0].description
  }`;

  //day3
  dayThreeForecast.innerHTML = `<strong>${formatDay(
    dayThreeData.dt
  )}:</strong> ${dayThreeData.main.temp.toFixed(1)}&deg;C, ${
    dayThreeData.weather[0].description
  }`;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded");
  apiFetch();
  fetchForecast();
});
