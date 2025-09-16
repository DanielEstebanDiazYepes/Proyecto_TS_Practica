import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors';
import { WeatherRoutes } from './routes/weatherRoutes';
import { AuthRoutes } from './routes/authRoutes';
import { DatabaseService } from './services/database';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });//ESTO PARA QUE SE PUEDA UBICAR EL .ENV

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

   private async initializeDatabase(): Promise<void> {
    try {
      await DatabaseService.initialize();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    this.app.use(corsMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    const weatherRoutes = new WeatherRoutes();
    const authRoutes = new AuthRoutes();
    
    this.app.use('/api/weather', weatherRoutes.getRouter());
    this.app.use('/api/auth', authRoutes.getRouter());

    
    // Ruta de salud
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
    });
  }

  private initializeErrorHandling(): void {
    // Manejo de errores 404
    this.app.use("/",(req, res) => {
      res.status(404).json({
        success: false,
        error: 'DANIEL'
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

  public async start(): Promise<void> {
    await this.initializeDatabase(); //<--- Aquí inicializamos la BD
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.start();