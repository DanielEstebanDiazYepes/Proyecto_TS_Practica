import { useState, useCallback } from 'react';
import { WeatherData, WeatherResponse } from '@shared/types';
import { weatherApi } from '../services/api';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  getWeatherByCity: (city: string, countryCode?: string) => Promise<void>;
  getWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  clearError: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getWeatherByCity = useCallback(async (city: string, countryCode?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result: WeatherResponse = await weatherApi.getWeatherByCity(city, countryCode);
      
      if (result.success && result.data) {
        setWeatherData(result.data);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result: WeatherResponse = await weatherApi.getWeatherByCoords(lat, lon);
      
      if (result.success && result.data) {
        setWeatherData(result.data);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weatherData,
    loading,
    error,
    getWeatherByCity,
    getWeatherByCoords,
    clearError
  };
};