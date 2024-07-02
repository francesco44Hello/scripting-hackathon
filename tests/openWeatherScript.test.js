import openWeatherScript from './testsFunctions';

/* Mock the fetch function for tests*/
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ lat: 52.2819, lon: -1.5820 }])
  })
);

describe('Weather App Functions', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('fetchCoordinates should return correct coordinates', async () => {
    const location = 'Warwick';
    const coordinates = await openWeatherScript.fetchCoordinates(location);
    expect(coordinates).toEqual({ lat: 52.2819, lon: -1.5820 });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(location));
  });

  test('fetchWeather should return weather data', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ main: { temp: 25 }, weather: [{ icon: '01d', description: 'clear sky' }] })
      })
    );
    const weatherData = await openWeatherScript.fetchWeather(52.2819, -1.5820);
    expect(weatherData).toEqual({ main: { temp: 25 }, weather: [{ icon: '01d', description: 'clear sky' }] });
  });

  test('createWeatherContainer should create a div with correct styles', () => {
    const container = openWeatherScript.createWeatherContainer();
    expect(container.tagName).toBe('DIV');
    expect(container.id).toBe('weather-info');
    expect(container.style.borderBottom).toBe('1px solid #ccc');
  });

  test('createWeatherIcon should create an img element with correct src', () => {
    const iconCode = '01d';
    const icon = openWeatherScript.createWeatherIcon(iconCode);
    expect(icon.tagName).toBe('IMG');
    expect(icon.src).toBe('https://openweathermap.org/img/wn/01d@2x.png');
  });

  test('capitalizeDescription should capitalize the first letter of each word', () => {
    const description = 'clear sky';
    const result = openWeatherScript.capitalizeDescription(description);
    expect(result).toBe('Clear Sky');
  });

  test('createWeatherContent should return correct HTML content', () => {
    const temperature = 25;
    const description = 'Clear Sky';
    const content = openWeatherScript.createWeatherContent(temperature, description);
    expect(content).toContain('<h3>Current Weather</h3>');
    expect(content).toContain('<p>25°C</p>');
    expect(content).toContain('<p>- Clear Sky</p>');
  });

  test('displayWeather should create and insert weather element', () => {
    document.body.innerHTML = '<div class="Pillstyle__StyledPill-sc-1tc0qet-0 jpeAyR PlaceSummarystyle__StyledPill-sc-uf3onk-1 htYDvg region--warwi"></div>';
    const weatherData = {
      main: { temp: 25 },
      weather: [{ icon: '01d', description: 'clear sky' }]
    };
    openWeatherScript.displayWeather(weatherData);
    const weatherContainer = document.querySelector('#weather-info');
    expect(weatherContainer).not.toBeNull();
    expect(weatherContainer.innerHTML).toContain('<h3>Current Weather</h3>');
  });

  test('displayError should create and insert error message', () => {
    document.body.innerHTML = '<div class="Pillstyle__StyledPill-sc-1tc0qet-0 jpeAyR PlaceSummarystyle__StyledPill-sc-uf3onk-1 htYDvg region--warwi"></div>';
    openWeatherScript.displayError('Error message');
    const weatherContainer = document.querySelector('#weather-info');
    expect(weatherContainer).not.toBeNull();
    expect(weatherContainer.innerHTML).toContain('Error message');
  });

  test('insertAfterTarget should insert element after the target element', () => {
    document.body.innerHTML = '<div class="Pillstyle__StyledPill-sc-1tc0qet-0 jpeAyR PlaceSummarystyle__StyledPill-sc-uf3onk-1 htYDvg region--warwi"></div>';
    const newElement = document.createElement('div');
    openWeatherScript.insertAfterTarget(newElement);
    expect(document.body.contains(newElement)).toBe(true);
  });

  test('tryFetchCoordinates should try multiple variations and succeed', async () => {
    const location = 'Warwick';
    const coordinates = await openWeatherScript.tryFetchCoordinates(location);
    expect(coordinates).toEqual({ lat: 52.2819, lon: -1.5820 });
  });

  test('setGroupInLocalStorage should set the group in localStorage', () => {
    openWeatherScript.setGroupInLocalStorage('A');
    expect(localStorage.getItem('abTestGroup')).toBe('A');
  });

  test('getGroupFromLocalStorage should get the group from localStorage', () => {
    localStorage.setItem('abTestGroup', 'B');
    const group = openWeatherScript.getGroupFromLocalStorage();
    expect(group).toBe('B');
  });

  test('logWinningGroup should log the correct winning group', () => {
    localStorage.setItem('timeSpentData', JSON.stringify({ A: 20000, B: 15000 }));
    const logSpy = jest.spyOn(console, 'log');
    openWeatherScript.logWinningGroup();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Group A is winning'));
  });

  test('resetLocalStorage should clear localStorage', () => {
    localStorage.setItem('abTestGroup', 'A');
    localStorage.setItem('timeSpentData', JSON.stringify({ A: 20000, B: 15000 }));
    openWeatherScript.resetLocalStorage();
    expect(localStorage.getItem('abTestGroup')).toBeNull();
    expect(localStorage.getItem('timeSpentData')).toBeNull();
  });

  test('init should add group selection UI and handle group selection', () => {
    document.body.innerHTML = '';
    openWeatherScript.init();
    const select = document.querySelector('#ab-test-group');
    const button = document.querySelector('button');
    expect(select).not.toBeNull();
    expect(button).not.toBeNull();
  });

  test('addGroupSelectionUI should add group selection UI', () => {
    document.body.innerHTML = '';
    openWeatherScript.addGroupSelectionUI();
    const select = document.querySelector('#ab-test-group');
    const button = document.querySelector('button');
    expect(select).not.toBeNull();
    expect(button).not.toBeNull();
  });
});
