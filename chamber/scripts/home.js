import CONFIG from "./weather-config.js";

const WEATHER_API_KEY = CONFIG.apiKey;
const LAT = CONFIG.lat;
const LON = CONFIG.lon;
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_API_KEY}`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_API_KEY}`;

async function fetchWeather() {
    try {
        const response = await fetch(WEATHER_URL);
        if (response.status === 401) {
            throw new Error("Invalid or inactive API key. Please check your OpenWeatherMap account.");
        }
        if (!response.ok) throw new Error("Weather data not available");
        const data = await response.json();
        displayCurrentWeather(data);
    } catch (error) {
        console.error("Error fetching current weather:", error);
        document.querySelector(".current-weather").innerHTML = `<p>${error.message}</p>`;
    }
}

async function fetchForecast() {
    try {
        const response = await fetch(FORECAST_URL);
        if (response.status === 401) {
            throw new Error("Invalid or inactive API key.");
        }
        if (!response.ok) throw new Error("Forecast data not available");
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error("Error fetching forecast:", error);
        document.getElementById("forecast-container").innerHTML = `<p>${error.message}</p>`;
    }
}

function displayCurrentWeather(data) {
    const container = document.querySelector(".current-weather");
    const desc = data.weather[0].description;
    const temp = Math.round(data.main.temp);

    container.innerHTML = `
        <div class="weather-info">
            <div class="temp">${temp}°C</div>
            <div class="desc">${desc.charAt(0).toUpperCase() + desc.slice(1)}</div>
        </div>
    `;
}

function displayForecast(data) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    // Get one forecast per day (around noon)
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const temp = Math.round(forecast.main.temp);

        const item = document.createElement("div");
        item.className = "forecast-item";
        item.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="temp">${temp}°C</div>
        `;
        container.appendChild(item);
    });
}

// --- Spotlight Configuration & Logic ---
async function fetchSpotlights() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Member data not available");
        const members = await response.json();

        // Filter for Gold (3) and Silver (2) members
        const eligibleMembers = members.filter(m => m.membershipLevel === 3 || m.membershipLevel === 2);

        // Randomly select 2 members
        const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);

        displaySpotlights(selected);
    } catch (error) {
        console.error("Error fetching spotlights:", error);
        document.getElementById("spotlights-container").innerHTML = "<p>Spotlight data unavailable.</p>";
    }
}

function displaySpotlights(members) {
    const container = document.getElementById("spotlights-container");
    container.innerHTML = "";

    const LEVEL_LABELS = { 2: "Silver", 3: "Gold" };
    const LEVEL_CLASSES = { 2: "badge-silver", 3: "badge-gold" };

    members.forEach(member => {
        const card = document.createElement("article");
        card.className = "spotlight-card";

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo" width="320" height="180" loading="lazy" decoding="async">
            <h3>${member.name}</h3>
            <span class="membership-badge ${LEVEL_CLASSES[member.membershipLevel]}">${LEVEL_LABELS[member.membershipLevel]}</span>
            <div class="spotlight-details">
                <p>${member.phone}</p>
                <p>${member.address}</p>
                <p><a href="${member.website}" target="_blank">${member.website.replace(/^https?:\/\//, "")}</a></p>
            </div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchWeather();
    fetchForecast();
    fetchSpotlights();
});
