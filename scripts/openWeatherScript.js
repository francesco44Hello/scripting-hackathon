(async function () {
    const OPENWEATHERMAP_API_KEY = 'your-api-key-here'; 
    const GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
  
    let startTime;
  
    /** Fetch coordinates from OpenWeatherMap Geocoding API */
    async function fetchCoordinates(location) {
      const url = `${GEOCODING_API_URL}?q=${encodeURIComponent(location)},GB&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
      // console.log(`Geocoding API URL: ${url}`);
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }
      const data = await response.json();
      // console.log(`Geocoding API Response:`, data);
  
      if (data.length === 0) {
        throw new Error("Location not found");
      }
      return { lat: data[0].lat, lon: data[0].lon };
    }
  
    /** Fetch weather data from OpenWeatherMap */
    async function fetchWeather(lat, lon) {
      const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
      // console.log(`Weather API URL: ${url}`);
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return response.json();
    }
  
    /** Create weather container */
    function createWeatherContainer() {
      const container = document.createElement("div");
      container.id = "weather-info";
      const styles = {
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        height: "100px",
        gap: "10px",
        paddingBlock: "20px"
      };
      Object.assign(container.style, styles);
      return container;
    }
  
    /** Create weather icon element */
    function createWeatherIcon(iconCode) {
      const iconElement = document.createElement("img");
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      iconElement.src = iconUrl;
      iconElement.alt = "Weather Icon";
      const styles = {
        height: "100px",
        width: "100px",
        margin: "0px",
        padding: "0px"
      };
      Object.assign(iconElement.style, styles);
      return iconElement;
    }
  
    /** Capitalize description */
    function capitalizeDescription(description) {
      return description.replace(/\b\w/g, char => char.toUpperCase());
    }
  
    /** Create weather HTML content */
    function createWeatherContent(temperature, description) {
      return `
        <h3>Current Weather</h3>
        <p>${temperature}°C</p>
        <p>- ${capitalizeDescription(description)}</p>
      `;
    }
  
    /** Display weather data */
    function displayWeather(weatherData) {
      const weatherContainer = createWeatherContainer();
      const iconElement = createWeatherIcon(weatherData.weather[0].icon);
      const temperature = Math.round(weatherData.main.temp);
      const description = weatherData.weather[0].description;
  
      weatherContainer.innerHTML = createWeatherContent(temperature, description);
      weatherContainer.appendChild(iconElement);
  
      insertAfterTarget(weatherContainer);
    }
  
    /** Display error message */
    function displayError(message) {
      const weatherContainer = createWeatherContainer();
      weatherContainer.innerHTML = `<p>${message}</p>`;
  
      insertAfterTarget(weatherContainer);
    }
  
    /** Insert element after the target element */
    function insertAfterTarget(element) {
      const targetElement = document.querySelector('.Pillstyle__StyledPill-sc-1tc0qet-0.jpeAyR.PlaceSummarystyle__StyledPill-sc-uf3onk-1.htYDvg.region--warwi');
  
      if (targetElement) {
        targetElement.insertAdjacentElement('afterend', element);
      } else {
        console.error("Target element not found");
      }
    }
  
    /** Try to fetch coordinates with different variations */
    async function tryFetchCoordinates(location) {
      const variations = [location, location + ', England', location + ', United Kingdom'];
      for (const variant of variations) {
        try {
          return await fetchCoordinates(variant);
        } catch (err) {
          console.error(`Geocoding failed for ${variant}:`, err);
        }
      }
      throw new Error("Geocoding failed for all variations");
    }
  
    /** Add UI for group selection */
    function addGroupSelectionUI() {
      const groupContainer = document.createElement('div');
  
      const styles = {
        height: "80px",
        width: "100%",
        margin: "0px",
        padding: "0px",
        display:'flex',
        alignItems: 'center',
        paddingLeft: '30px',
        justifyContent: 'flex-start',
        gap: '10px'
      };
      Object.assign(groupContainer.style, styles);
  
      const label = document.createElement('label');
      label.textContent = 'Select A/B Test Group: ';
      label.htmlFor = 'ab-test-group';
  
      groupContainer.appendChild(label);
  
      const select = document.createElement('select');
      select.id = 'ab-test-group';
      select.innerHTML = `
        <option value="A">Group A (Show Weather)</option>
        <option value="B">Group B (Hide Weather)</option>
      `;
      const selectStyles = {
        outline: 'none',
        border: '2px solid #077a3c',
        borderRadius: '8px'
      };
      Object.assign(select.style, selectStyles);
      groupContainer.appendChild(select);
  
      const button = document.createElement('button');
      button.textContent = 'Save';
      button.onclick = () => {
        const group = select.value;
        setGroupInLocalStorage(group);
        location.reload();
      };
  
      const saveButtonStyles = {
        outline: 'none',
        border: 'none',
        backgroundColor: ' #077a3c',
        color: '#eee',
        borderRadius: '8px',
        marginLeft: '10px',
        cursor: 'pointer'
      };
      Object.assign(button.style, saveButtonStyles);
      groupContainer.appendChild(button);
  
      const resetButton = document.createElement('button');
      resetButton.textContent = 'Reset Data';
  
      const resetButtonStyles = {
        outline: 'none',
        border: 'none',
        color: ' #077a3c',
        backgroundColor: '#eee',
        borderRadius: '8px',
        marginLeft: '10px',
        cursor: 'pointer'
      };
      Object.assign(resetButton.style, resetButtonStyles);
  
      resetButton.onclick = () => {
        resetLocalStorage();
        location.reload();
      };
      groupContainer.appendChild(resetButton);
  
      document.body.prepend(groupContainer);
    }
  
    /** Set group in local storage */
    function setGroupInLocalStorage(group) {
      localStorage.setItem('abTestGroup', group);
    }
  
    /** Get group from local storage */
    function getGroupFromLocalStorage() {
      return localStorage.getItem('abTestGroup');
    }
  
    /** Save the time spent on the weather feature */
    function saveTimeSpentOnFeature() {
      const group = getGroupFromLocalStorage();
      const totalTime = Date.now() - startTime;
  
      let timeSpentData = JSON.parse(localStorage.getItem('timeSpentData')) || { A: 0, B: 0 };
      timeSpentData[group] += totalTime;
  
      localStorage.setItem('timeSpentData', JSON.stringify(timeSpentData));
  
      console.log(`Time spent on weather feature: ${totalTime / 1000} seconds`);
    }
  
    /** Calculate and log the current winning group */
    function logWinningGroup() {
      const timeSpentData = JSON.parse(localStorage.getItem('timeSpentData')) || { A: 0, B: 0 };
      const groupATime = timeSpentData.A || 0;
      const groupBTime = timeSpentData.B || 0;
  
      if (groupATime > groupBTime) {
        console.log(`Version with Weather Data is winning with a total time of ${(groupATime / 1000).toFixed(2)} seconds.`);
      } else if (groupBTime > groupATime) {
        console.log(`Version without Weather Data is winning with a total time of ${(groupBTime / 1000).toFixed(2)} seconds.`);
      } else {
        console.log("Both versions are performing equally.");
      }
    }
  
    /** Reset local storage */
    function resetLocalStorage() {
      localStorage.removeItem('abTestGroup');
      localStorage.removeItem('timeSpentData');
      console.log("Local storage has been reset.");
    }
  
    /** Initialize the script */
    function init() {
      addGroupSelectionUI();
  
      const group = getGroupFromLocalStorage();
      if (!group) {
        return;
      }
  
      console.log(`User is in group: ${group}`);
  
      if (group === 'A') {
        if (typeof window.globalDataLayer === 'undefined' || typeof window.globalDataLayer.propertySubRegion === 'undefined') {
          displayError("globalDataLayer or propertySubRegion is not defined");
          return;
        }
  
        const location = window.globalDataLayer.propertySubRegion;
        console.log(`Property SubRegion: ${location}`);
  
        if (!location) {
          displayError("Location not found in globalDataLayer");
          return;
        }
  
        startTime = Date.now();
  
        tryFetchCoordinates(location)
          .then(coordinates => fetchWeather(coordinates.lat, coordinates.lon))
          .then(weatherData => displayWeather(weatherData))
          .catch(error => {
            console.error("Error:", error);
            displayError("Failed to retrieve weather data. Please try again later.");
          });
  
        window.addEventListener('beforeunload', saveTimeSpentOnFeature);
      }
  
      logWinningGroup();
    }
  
    init();
  })();
  