import axios from 'axios';
import { WeatherData, WeatherError, WeatherResponse } from '@shared/types';

export class WeatherService {
  private apiKey: string 
  private baseURL: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.API_CLIMA_KEY || '';
    if (!this.apiKey) {
      throw new Error('API_CLIMA_KEY no está configurada');
    }
  }

  async getWeatherByCity(city: string, countryCode?: string): Promise<WeatherResponse> {
    try {
      const query = countryCode ? `${city},${countryCode}` : city;
      const response = await axios.get<WeatherData | WeatherError>(
        `${this.baseURL}/weather?q=${query}&appid=${this.apiKey}&units=metric&lang=es`
      );

      if (response.data.cod !== 200) {
        const error = response.data as WeatherError;
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: response.data as WeatherData
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener datos del clima'
      };
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    try {
      const response = await axios.get<WeatherData | WeatherError>(
        `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`
      );

      if (response.data.cod !== 200) {
        const error = response.data as WeatherError;
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: response.data as WeatherData
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener datos del clima'
      };
    }
  }
}