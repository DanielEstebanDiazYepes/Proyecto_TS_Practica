import { Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';

export class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  getWeatherByCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { city, countryCode } = req.query;
      
      if (!city || typeof city !== 'string') {
        res.status(400).json({
          success: false,
          error: 'El parámetro "city" es requerido'
        });
        return;
      }

      const result = await this.weatherService.getWeatherByCity(
        city, 
        countryCode as string
      );

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };

  getWeatherByCoords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        res.status(400).json({
          success: false,
          error: 'Los parámetros "lat" y "lon" son requeridos'
        });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
          success: false,
          error: 'Latitud y longitud deben ser números válidos'
        });
        return;
      }

      const result = await this.weatherService.getWeatherByCoords(latitude, longitude);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
}