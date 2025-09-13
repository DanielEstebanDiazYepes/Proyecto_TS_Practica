import React, { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import './App.css';

const App: React.FC = () => {

  //USAMOS EL HOOK PERSONALIZADO
  //ESTADO PARA GUARDAR EL NOMBRE DE LA CIUDAD (const [city, setCity] = useState<string>(''); )
  const [city, setCity] = useState<string>('');//<-- "city" ES EL ESTADO PARA GUARDAR EL NOMBRE DE LA CIUDAD, "setCity" ES LA FUNCION PARA ACTUALIZAR ESE ESTADO, INICIALMENTE ES UNA CADENA VACIA

  //EXTRAEMOS DEL HOOK LOS DATOS Y FUNCIONES QUE VAMOS A USAR DE (useWeather)
  const { weatherData, loading, error, getWeatherByCity, getWeatherByCoords, clearError } = useWeather();

  useEffect(() => {
    // INTENTA OBTENER UBICACION AUTOMAITICAMENTE SI EL NAVEGADOR LO PERMITE
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

  const handleSubmit = (e: React.FormEvent) => {//FUNCION PARA EL SUBMIT DE FORMULARIO
    e.preventDefault();//PA QUE LA PAGINA NO SE RECARGE AL BUSCAR
    if (city.trim()) {
      getWeatherByCity(city.trim());//LLAMAMOS A LA FUNCION DEL HOOK PARA BUSCAR EL CLIMA POR CIUDAD
      setCity(''); //PA LIMPIAR EL INPUT DESPUES DE BUSCAR
    }
  };

  const formatTime = (timestamp: number): string => {//FUNCION PARA FORMATEAR LA HORA DE AMANECER Y ATARDECER
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