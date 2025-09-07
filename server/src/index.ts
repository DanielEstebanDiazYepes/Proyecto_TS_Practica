import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors';
import { WeatherRoutes } from './routes/weatherRoutes';

dotenv.config();

class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5000');
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(corsMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    const weatherRoutes = new WeatherRoutes();
    
    this.app.use('/api/weather', weatherRoutes.getRouter());
    
    // Ruta de salud
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
    });
  }

  private initializeErrorHandling(): void {
    // Manejo de errores 404
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
      });
    });

    // Manejo de errores global
    this.app.use((error: any, req: any, res: any, next: any) => {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.start();