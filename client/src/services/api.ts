import axios from 'axios';
import { WeatherResponse } from '@shared/types';

const API_BASE_URL = '/api';

export class WeatherApiService {
  private client = axios.create({ // PRIVATE SIGNIFICA QUE SOLO LAS FUNCIONES QUE ESTEN DENTRO DE ESTA CLASE PUEDEN ACCEDER A ESE ATRIBUTO (CLIENTE DE AXIOS)
    baseURL: API_BASE_URL, //TODAS LAS PETICIONES DE ESTE CLIENTE USARAN ESTA URL BASE 
    timeout: 10000, // SI LA PETICION TARDE MAS DE 10 SEG SE CANCELA
  });

  /* FUNCION ASYNCRONICA PARA OBTENER LOS DATOS DEL CLIMA POR CIUDAD (GETWEATHERBYCITY)
  "city" NOMBRE DE LA CIUDAD
  "countryCode" CODIGO DEL PAIS (OPCIONAL)
  "returns" PROMESA DE TIPO WEATHERRESPONSE (QUE ES LA INTERFAZ QUE ENVUELVE LA RESPUESTA DE LA API, INCLUYENDO EXITO Y ERROR)
  */

  async getWeatherByCity(city: string, countryCode?: string): Promise<WeatherResponse> {//<--PROME PARA DEVOLVER DATOS COMO UN OBJETO DE TIPO WEATHERRESPONSE
    try {

      /* USAMOS AXIOS PARA HACER LA PETICION GET A LA RUTA /weather/city
      LE DECIMOS A AXIOS QUE LA RESPUESTA QUE ESPERAMOS SERA DE TIPO "WEATHERRESPONSE"
      */
      const response = await this.client.get<WeatherResponse>('/weather/city', {

      /*AXIOS MANEJA LOS PARAMETROS DE CONSULTA "params"
        Y LOS CONVIERTE EN UNA URL COMO ESTA: /weather/city?city=Ciudad&countryCode=CodigoPais
      */
        params: { city, countryCode }//<---PARAMETROS DE CONSULTA (CITY Y COUNTRYCODE
      });

      /*AXIOS DEVUELVE LA RESPUESTA COMPLETA, PERO NOSOTROS SOLO QUEREMOS LOS DATOS (RESPONSE.DATA) QUE ES DE TIPO WEATHERRESPONSE
      RETORNAMOS LOS DATOS EN LA RESPUESTA
      */
     
      return response.data;//<---RETORNAMOS LOS DATOS DE LA RESPUESTA
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error de conexión'
      };
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> { //ACA SE HACE LO MISMO PERO PARA BUSQUEDA POR COORDENADAS
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