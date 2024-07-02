const apiUrl = `https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=53.39863982061217&lon=-2.9856372732243814`;
async function fetchWeatherData() {
    try {
        const response = await fetch(apiUrl);
        const weatherData = await response.json();
        const iconCode = weatherData.list[0].weather[0].icon
        const weatherDescription = weatherData.list[0].weather[0].description;
        const temperature = weatherData.list[0].main.temp;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const iconElement = document.createElement('img');
        iconElement.src = iconUrl;
        iconElement.alt = 'Weather Icon';
        iconElement.className = 'weather-icon'; 

        const weatherDataContainer = document.createElement('div');
        weatherDataContainer.style.borderBottom = "1px solid #ccc";
        weatherDataContainer.style.marginTop = "10px";
        weatherDataContainer.style.display = "flex";
        weatherDataContainer.style.alignItems = "center";
        weatherDataContainer.style.gap = "10px";

        const weatherDescriptionElement = document.createElement('p');
        weatherDescriptionElement.textContent = `Weather: ${weatherDescription}`;


        const temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${Math.round(temperature)}°C`;

        weatherDataContainer.appendChild(iconElement);
        weatherDataContainer.appendChild(weatherDescriptionElement);
        weatherDataContainer.appendChild(temperatureElement);

        const spanElement = document.querySelector('.Pillstyle__StyledPill-sc-1tc0qet-0.jpeAyR.PlaceSummarystyle__StyledPill-sc-uf3onk-1.htYDvg.region--warwi');
        const h1Element = spanElement.nextElementSibling;

        spanElement.parentNode.insertBefore(weatherDataContainer, h1Element);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

fetchWeatherData();