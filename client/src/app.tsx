import React, { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import './App.css';

const App: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const { weatherData, loading, error, getWeatherByCity, getWeatherByCoords, clearError } = useWeather();

  useEffect(() => {
    // Intentar obtener ubicación automáticamente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (err) => {
          console.log('Geolocalización no permitida:', err);
        }
      );
    }
  }, [getWeatherByCoords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      getWeatherByCity(city.trim());
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
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
              placeholder="Ej: Bogotá, Madrid, Tokyo..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !city.trim()}>
              {loading ? 'Buscando...' : 'Buscar Clima'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
            <button onClick={clearError} className="error-close">
              ×
            </button>
          </div>
        )}

        {weatherData && (
          <div className="weather-card">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            
            <div className="weather-main">
              <img 
                src={getWeatherIconUrl(weatherData.weather[0].icon)}
                alt={weatherData.weather[0].description}
                className="weather-icon"
              />
              <div className="temperature">
                {Math.round(weatherData.main.temp)}°C
              </div>
            </div>

            <div className="weather-description">
              {weatherData.weather[0].description}
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span>🌡️ Sensación térmica</span>
                <span>{Math.round(weatherData.main.feels_like)}°C</span>
              </div>
              <div className="detail-item">
                <span>💧 Humedad</span>
                <span>{weatherData.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span>💨 Viento</span>
                <span>{weatherData.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span>📊 Presión</span>
                <span>{weatherData.main.pressure} hPa</span>
              </div>
            </div>

            <div className="sun-times">
              <div className="sun-time">
                <span>🌅 Amanecer:</span>
                <span>{formatTime(weatherData.sys.sunrise)}</span>
              </div>
              <div className="sun-time">
                <span>🌇 Atardecer:</span>
                <span>{formatTime(weatherData.sys.sunset)}</span>
              </div>
            </div>
          </div>
        )}

        {!weatherData && !loading && (
          <div className="welcome-message">
            <p>¡Bienvenido! 🌎</p>
            <p>Escribe una ciudad o permite la geolocalización para ver el clima</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;