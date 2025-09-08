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

export const useWeather = (): UseWeatherReturn => {//ESTOS SON LOS ESTADOS Y FUNCIONES QUE VAMOS A USAR EN EL HOOK
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); //ESTADO PARA GUARDAR LOS DATOS DEL CLIMA (WEATHERDATA/SETWEATHERDATA)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getWeatherByCity = useCallback(async (city: string, countryCode?: string) => {//FUNCION PARA OBTENER EL CLIMA POR CIUDAD
    setLoading(true);
    setError(null);
    
    try {
      const result: WeatherResponse = await weatherApi.getWeatherByCity(city, countryCode); //LLAMAMOS A LA FUNCION DE LA API PARA OBTENER LOS DATOS
      
      if (result.success && result.data) { //SI LA RESPUESTA ES EXITOSA Y HAY DATOS LOS GUARDAMOS EN EL ESTADO (SETWEATHERDATA)
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

  const getWeatherByCoords = useCallback(async (lat: number, lon: number) => { //ACA SE HACE LO MISMO PERO CON COORDENADAS
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

  return { //DEVOLVEMOS LOS ESTADOS Y FUNCIONES PARA USARLOS EN EL COMPONENTE
    weatherData,
    loading,
    error,
    getWeatherByCity,
    getWeatherByCoords,
    clearError
  };
};