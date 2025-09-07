import axios from 'axios';
import { WeatherResponse } from '@shared/types';

const API_BASE_URL = '/api';

export class WeatherApiService {
  private client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async getWeatherByCity(city: string, countryCode?: string): Promise<WeatherResponse> {
    try {
      const response = await this.client.get<WeatherResponse>('/weather/city', {
        params: { city, countryCode }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error de conexión'
      };
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    try {
      const response = await this.client.get<WeatherResponse>('/weather/coords', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error de conexión'
      };
    }
  }
}

export const weatherApi = new WeatherApiService();