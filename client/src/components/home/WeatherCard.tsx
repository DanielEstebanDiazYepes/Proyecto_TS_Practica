type WeatherCardProps = {
  data: any; // Puedes tiparlo mejor con la interfaz de OpenWeather
};

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
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
    <div className="weather-card">
      <h2>{data.name}, {data.sys.country}</h2>
      
      <div className="weather-main">
        <img 
          src={getWeatherIconUrl(data.weather[0].icon)}
          alt={data.weather[0].description}
          className="weather-icon"
        />
        <div className="temperature">
          {Math.round(data.main.temp)}°C
        </div>
      </div>

      <div className="weather-description">
        {data.weather[0].description}
      </div>

      <div className="weather-details">
        <div className="detail-item"><span>🌡️ Sensación térmica</span><span>{Math.round(data.main.feels_like)}°C</span></div>
        <div className="detail-item"><span>💧 Humedad</span><span>{data.main.humidity}%</span></div>
        <div className="detail-item"><span>💨 Viento</span><span>{data.wind.speed} m/s</span></div>
        <div className="detail-item"><span>📊 Presión</span><span>{data.main.pressure} hPa</span></div>
      </div>

      <div className="sun-times">
        <div className="sun-time"><span>🌅 Amanecer:</span><span>{formatTime(data.sys.sunrise)}</span></div>
        <div className="sun-time"><span>🌇 Atardecer:</span><span>{formatTime(data.sys.sunset)}</span></div>
      </div>
    </div>
  );
};

export default WeatherCard;
