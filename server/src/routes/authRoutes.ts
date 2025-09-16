import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

export class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();//SE CREA UNA INSTANCIA DE ROUTER
    this.initializeRoutes();//SE INICIALIZAN LAS RUTAS
  }

  private initializeRoutes(): void {

    /*RUTA DE REGISTRO, LLAMA AL METODO ESTATICO "register" DE LA CLASE AuthController
    DONDE ESTA LA LOGICA PARA REGISTRAR USUARIOS (VALIDACIONES, LLAMADA AL SERVICIO, RESPUESTAS)
    Y ASI IGUAL CON TODOS LOS DEMAS METODOS
    */
    this.router.post('/register', AuthController.register);
    this.router.post('/login', AuthController.login);
    this.router.get('/profile', authenticateToken, AuthController.getProfile);
  }

  public getRouter(): Router {
    return this.router;
  }
}