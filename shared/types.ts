/*
CUANDO TRABAJAMOS CON TS LA MEJOR PRACTICA ES CREAR UN ARCHIVO TYPES.TS 
DONDE DEFINIMOS LAS INTERFACES/TYPOS QUE VAMOS A USAR EN LA APLICACION
Y EXPORTAMOS ESOS TIPOS PARA USARLOS EN LOS COMPONENTES
*/

export interface WeatherData { //REPRESENTACION DE LA RESPUESTA DE LA API DEL CLIMA
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherError { //INTERFACE PARA MANEJAR ERRORES DE LA API
  cod: string;
  message: string;
}

export interface WeatherResponse { //AQUI ENVOLVEMOS LA RESPUESTA DE LA API, ASI PODEMOS MANEJAR EXITO Y ERROR
  success: boolean;
  data?: WeatherData; //LOS DATOSN SON OPCIONALES (?) PORQUE SI HAY UN ERROR NO HABRA DATOS
  error?: string;
}

export interface Coordinates { // INTERFAZ PARA UN OBJETO DE COORDENADAS (ALTITU Y LONGITUD)
  lat: number;
  lon: number;
}

export interface CitySearchParams {//INTERFAZ PARA LOS PARAMETROS DE BUSQUEDA POR CIUDAD
  city: string;
  countryCode?: string;
}

//TIPOS PARA LAS AUTENTICACION DE USUARIO

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
  error?: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}