const apiKey = '88dfdcf514c2622f65864589f7853ca6';  // Replace with your OpenWeatherMap API key
const unit = 'metric';  // Default unit for API requests

// Function to fetch weather data by user input
function getWeatherByInput() {
    const location = document.getElementById('location').value;
    if (location) {
        fetchWeather(location);
    } else {
        alert('Please enter a location.');
    }
}

// Function to fetch weather data for a given location
function fetchWeather(location) {
    document.getElementById('loading').style.display = 'block';  // Show loading spinner
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';  // Hide loading spinner
            displayWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            document.getElementById('loading').style.display = 'none';  // Hide loading spinner
            console.error('Error fetching the weather data:', error);
        });
}

// Function to display weather data
function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    if (data.cod === 200) {
        const tempC = `${data.main.temp}°C`;
        const tempF = `${(data.main.temp * 9/5 + 32).toFixed(2)}°F`;
        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.body.className = getBackgroundClass(data.weather[0].main.toLowerCase());
        weatherInfo.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${icon}" alt="${data.weather[0].description}" class="weather-icon">
            <p>Weather: ${data.weather[0].description}</p>
            <p>Temperature: ${tempC} / ${tempF}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    } else {
        weatherInfo.innerHTML = `<p>Location not found.</p>`;
    }
}

// Function to fetch 5-day forecast data
function fetchForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching the forecast data:', error));
}

// Function to display 5-day forecast data
function displayForecast(data) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '<h3>5-Day Forecast</h3>';
    const forecastItems = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    forecastItems.forEach(item => {
        const tempC = `${item.main.temp}°C`;
        const tempF = `${(item.main.temp * 9/5 + 32).toFixed(2)}°F`;
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        forecastElement.innerHTML += `
            <div class="forecast-item">
                <h4>${new Date(item.dt_txt).toLocaleDateString()}</h4>
                <img src="${icon}" alt="${item.weather[0].description}" class="weather-icon">
                <p>${item.weather[0].description}</p>
                <p>${tempC} / ${tempF}</p>
            </div>
        `;
    });
}

// Function to set background based on weather condition
function getBackgroundClass(weather) {
    switch (weather) {
        case 'clear':
            return 'clear';
        case 'clouds':
            return 'clouds';
        case 'rain':
            return 'rain';
        case 'snow':
            return 'snow';
        case 'mist':
            return 'mist';
        default:
            return 'default';
    }
}
