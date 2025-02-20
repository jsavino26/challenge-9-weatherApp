import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
  temp: number;
  humidity: number;
  wind_speed: number;
  weather: string;
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private city: string;

  constructor() {
    this.baseURL = process.env.BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }

  async getWeatherData(cityname: string) {
    this.city = cityname;
    let coordinates = await this.fetchAndDestructureLocationData();
    console.log(coordinates);
    let weatherData: any = await this.fetchWeatherData(coordinates);
    console.log(weatherData);
    let currentWeather = this.parseCurrentWeather(weatherData);
    console.log(currentWeather);
    let forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    console.log(forecastArray);
    return forecastArray;
  }
  // TODO: Define the baseURL, API key, and city name properties


  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    if (!response.ok) throw new Error('Failed to fetch location data');
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return this.city;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { main, wind, weather } = response;
    const { temp, humidity } = main;
    const { speed } = wind;
    const weatherDescription = weather[0].description;

    return {
      temp,
      humidity,
      wind_speed: speed,
      weather: weatherDescription,
    };
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return weatherData.map((data) => ({
      ...currentWeather,
      date: data.dt_txt,
    }));
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city
    let coordinates = await this.fetchAndDestructureLocationData();
    console.log(coordinates);
    let weatherData: any = await this.fetchWeatherData(coordinates);
    console.log(weatherData);
    let currentWeather = this.parseCurrentWeather(weatherData);
    console.log(currentWeather);
    let forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    console.log(forecastArray);
    return forecastArray;
  }
}



export default new WeatherService();
