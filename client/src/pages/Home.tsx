import React, { useState} from 'react';
import { useWeather } from '../hooks/useWeather';
import SearchForm from '../components/home/SearchForm';
import WeatherCard from '../components/home/WeatherCard';
import ErrorMessage from '../components/home/ErrorMessage';
import WelcomeMessage from '../components/home/WelcomeMessage';
import '../App.css';

const Home: React.FC = () => {
  
  // ESTADO PARA CPATURAR LA CIUDAD DEL FORMULARIO
  const [city, setCity] = useState<string>('');

  // HOOKS RECUPERADOS DEL CUSTOM HOOK useWeather
  const { weatherData, loading, error, getWeatherByCity, clearError } = useWeather();

  // MANEJAMOS EL ENVÍO DEL FORMULARIO
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      getWeatherByCity(city.trim());
      setCity('');
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🌤️ App del Clima</h1>

        {/*IMPORTAMOS EL FORMULARIO DE BÚSQUEDA*/}      
        <SearchForm 
          city={city} 
          setCity={setCity} 
          loading={loading} 
          onSubmit={handleSubmit} 
        />

        {/*IMPORTAMOS EL MENSAJE DE ERROR, SI HAY ERROR*/}
        {error && <ErrorMessage error={error} clearError={clearError} />}

        {/*MOSTRAMOS LA TARJETA CONS LOS DATOS DEL CLIMA SI HAY */}
        {weatherData && <WeatherCard data={weatherData} />}

        {/*POR ULTIMO, MOSTRAMOS EL MENSAJE DE BIENVENIDA SI NO HAY DATOS NI CARGANDO*/}
        {!weatherData && !loading && <WelcomeMessage />}
      </div>
    </div>
  );
};

export default Home;
