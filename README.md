# Scripting Hackathon

## Overview
This project integrates a weather API into a web page with A/B testing capabilities. Using the OpenWeather API, it fetches weather data and provides an A/B testing mechanism to show or hide the weather information based on user selection. For more detailed information, including decision-making processes, challenges faced, and other technical details, please visit the [Notion Page](https://ten-prune-7ca.notion.site/Scripting-Hackaton-ff02f120d4014ecba892bc8ce9bbc446).

I also created a [Scribe Guide](https://scribehow.com/shared/AB_Testing_the_script__bqV1qgdoRnK8d8ErzYY42w) to help you step by step use the feature. If you have any queries please feel free to contact me at the email on my profile. 

## Instructions

### Prerequisites
- **OpenWeather API Key**: Obtain an API key from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/francesco44Hello/scripting-hackathon.git
   ```
2. **Install dependencies**:
   ```bash
   npm install

### Usage with MockEndpoint
   - Access the mockEndPointScript.js file
   - Open your browser console on the page where you want to test the script.
   - Paste the entire script into the console and press Enter.
   - You should see the updated UI displaying weather Data. 

### Usage with OpenWeatherApi
1. **Add your OpenWeather API Key**:
   - Open the `openWeatherScript.js` file.
   - Replace the placeholder API key with your actual OpenWeather API key:
     ```javascript
     const OPENWEATHERMAP_API_KEY = 'your-api-key-here';
     ```

2. **Copy and Paste the Script**:
   - Copy all the functions from `openWeatherScript.js` except for the export statement at the bottom.
   - Open your browser console on the page where you want to test the script.
   - Paste the entire script into the console and press Enter.

3. **Interact with the A/B Testing UI**:
   - At the very beginning of the body, you will see a select input and two buttons: 'Save' and 'Reset'.
     - **Group A**: Select this option to show weather data. The script will store this choice in `localStorage` and reload the page. Now paste again the script and you will see the updated UI with weather data.
     - **Group B**: Select this option to hide weather data. The UI and `localStorage` will update accordingly.
   - **Time Tracking**: The script tracks the time spent on each feature and stores it in `localStorage`. You should see a log of this data in the console. This data helps determine which group is spending more time on each version.

4. **Run the UnitTests**:
   - Within your code editor, run the tests I wrote to ensure functionality:
     ```bash
     npm test
     ```
