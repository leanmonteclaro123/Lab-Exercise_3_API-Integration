document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "O3baV1ASzH8F0XPF0Y732GTtTmAvSDzW"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const forecastDiv = document.getElementById("forecast");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchForecastData(locationKey);
                    fetchHourlyForecastData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                    forecastDiv.innerHTML = ``;
                    hourlyForecastDiv.innerHTML = ``;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
                forecastDiv.innerHTML = ``;
                hourlyForecastDiv.innerHTML = ``;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchForecastData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts) {
                    displayForecast(data.DailyForecasts);
                } else {
                    forecastDiv.innerHTML = `<p>No forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
                forecastDiv.innerHTML = `<p>Error fetching forecast data.</p>`;
            });
    }

    function fetchHourlyForecastData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    displayHourlyForecast(data);
                } else {
                    hourlyForecastDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                hourlyForecastDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherIcon = getWeatherIcon(weather);
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
            <img src="${weatherIcon}" alt="${weather}">
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayForecast(forecasts) {
        const forecastContent = forecasts.map(forecast => {
            const date = new Date(forecast.Date).toLocaleDateString();
            const minTemp = forecast.Temperature.Minimum.Value;
            const maxTemp = forecast.Temperature.Maximum.Value;
            const weather = forecast.Day.IconPhrase;
            const weatherIcon = getWeatherIcon(weather);

            return `
                <div class="forecast-day">
                    <h3>${date}</h3>
                    <div>
                        <p>Min: ${minTemp}°C</p>
                        <p>Max: ${maxTemp}°C</p>
                        <p>Weather: ${weather}</p>
                    </div>
                    <img src="${weatherIcon}" alt="${weather}">
                </div>
            `;
        }).join('');

        forecastDiv.innerHTML = `<h2>5-Day Forecast</h2>${forecastContent}`;
    }

    function displayHourlyForecast(forecasts) {
        const hourlyForecastContent = forecasts.map(forecast => {
            const time = new Date(forecast.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temperature = forecast.Temperature.Value;
            const weather = forecast.IconPhrase;
            const weatherIcon = getWeatherIcon(weather);

            return `
                <div class="hourly-forecast">
                    <h3>${time}</h3>
                    <div>
                        <p>Temperature: ${temperature}°C</p>
                        <p>Weather: ${weather}</p>
                    </div>
                    <img src="${weatherIcon}" alt="${weather}">
                </div>
            `;
        }).join('');

        hourlyForecastDiv.innerHTML = `<h2>12-Hour Forecast</h2>${hourlyForecastContent}`;
    }

    function getWeatherIcon(weather) {
        if (weather.toLowerCase().includes("sunny")) {
            return "icons/sunny.png";
        } else if (weather.toLowerCase().includes("cloudy")) {
            return "icons/cloudy.png";
        } else if (weather.toLowerCase().includes("rain")) {
            return "icons/rainy.png";
        } else if (weather.toLowerCase().includes("shower")) {
            return "icons/rainy.png";
        } else if (weather.toLowerCase().includes("thunderstorms")) {
            return "icons/Thunderstorms.png";
        } else if (weather.toLowerCase().includes("fog")) {
            return "icons/fog.png";
        } else {
            return "icons/default.png";
        }
    }
});
