import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define an interface for the Location API response
interface LocationResponse {
  lat: number;
  lon: number;
}

// Define an interface for the Weather API response
interface WeatherResponse {
  list: {
    dt_txt: string;
    main: { temp: number; humidity: number };
    wind: { speed: number };
    weather: { description: string }[];
  }[];
}

// Define an interface for the Weather object
interface Weather {
  temp: number;
  humidity: number;
  wind_speed: number;
  weather: string;
}

// WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }

  // Fetch location data (latitude & longitude) for a given city
  private async fetchLocationData(cityName: string): Promise<Coordinates> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.statusText}`);
    }

    const data = (await response.json()) as LocationResponse[]; // ✅ Type assertion
    if (data.length === 0) {
      throw new Error('Location not found');
    }

    return { lat: data[0].lat, lon: data[0].lon };
  }

  // Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherResponse> {
    const { lat, lon } = coordinates;
    const url = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = (await response.json()) as WeatherResponse; // ✅ Type assertion
    return data;
  }

  // Parse the current weather data
  private parseCurrentWeather(response: WeatherResponse): Weather {
    const { main, wind, weather } = response.list[0];
    return {
      temp: main.temp,
      humidity: main.humidity,
      wind_speed: wind.speed,
      weather: weather[0].description,
    };
  }

  // Build forecast array
  private buildForecastArray(currentWeather: Weather, weatherData: WeatherResponse): any[] {
    return weatherData.list.map((data) => ({
      ...currentWeather,
      date: data.dt_txt,
    }));
  }

  // Get weather data for a given city
  async getWeatherData(cityName: string) {
    try {
      console.log(`Fetching weather for: ${cityName}`);

      const coordinates = await this.fetchLocationData(cityName);
      console.log(`Coordinates found:`, coordinates);

      const weatherData = await this.fetchWeatherData(coordinates);
      console.log(`Weather data received:`, weatherData);

      const currentWeather = this.parseCurrentWeather(weatherData);
      console.log(`Current weather:`, currentWeather);

      const forecastArray = this.buildForecastArray(currentWeather, weatherData);
      console.log(`Forecast data:`, forecastArray);

      return forecastArray;
    } catch (error) {
      console.error(`Error retrieving weather data:`, error);
      throw error;
    }
  }
}

export default new WeatherService();
