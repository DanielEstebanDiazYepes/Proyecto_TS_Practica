import React, { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import './App.css';

const App: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const { weatherData, loading, error, getWeatherByCity, getWeatherByCoords, clearError } = useWeather();

  useEffect(() => {
    // Obtener ubicación del usuario al cargar
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.log('Geolocalización no permitida:', error);
        }
      );
    }
  }, [getWeatherByCoords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      getWeatherByCity(city.trim(), countryCode.trim() || undefined);
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString('es-ES');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🌤️ App del Clima</h1>
        
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ciudad (ej: Madrid)"
              required
            />
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              placeholder="Código país (ej: ES)"
              maxLength={2}
              style={{ width: '80px' }}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error">
            <span>{error}</span>
            <button onClick={clearError}>×</button>
          </div>
        )}

        {weatherData && (
          <div className="weather-card">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            
            <div className="weather-main">
              <img 
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
              />
              <div className="temp">{Math.round(weatherData.main.temp)}°C</div>
            </div>

            <div className="weather-desc">
              {weatherData.weather[0].description}
            </div>

            <div className="weather-details">
              <div className="detail">
                <span>🌡️ Sensación</span>
                <span>{Math.round(weatherData.main.feels_like)}°C</span>
              </div>
              <div className="detail">
                <span>💧 Humedad</span>
                <span>{weatherData.main.humidity}%</span>
              </div>
              <div className="detail">
                <span>💨 Viento</span>
                <span>{weatherData.wind.speed} m/s</span>
              </div>
              <div className="detail">
                <span>☁️ Nubes</span>
                <span>{weatherData.clouds.all}%</span>
              </div>
            </div>

            <div className="sun-times">
              <div>🌅 Amanecer: {formatTime(weatherData.sys.sunrise)}</div>
              <div>🌇 Atardecer: {formatTime(weatherData.sys.sunset)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;