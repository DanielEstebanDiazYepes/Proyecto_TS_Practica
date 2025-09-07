import { Router } from 'express';
import { WeatherController } from '../controllers/weatherController';

export class WeatherRoutes {
  private router: Router;
  private weatherController: WeatherController;

  constructor() {
    this.router = Router();
    this.weatherController = new WeatherController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/city', this.weatherController.getWeatherByCity);
    this.router.get('/coords', this.weatherController.getWeatherByCoords);
  }

  public getRouter(): Router {
    return this.router;
  }
}