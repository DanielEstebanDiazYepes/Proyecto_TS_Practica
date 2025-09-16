import { Request, Response, NextFunction } from 'express';//<-- COSAS QUE NECESITAMOS DE EXPRES IMBECIL
import { AuthService } from '../services/authService';//<-- AQUI SE IMPORTA EL SERVICIO DE AUTENTICACION QUE CONTIENE LA LOGICA PARA VERIFICAR EL TOKEN

export const authenticateToken = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {

    //SE EXTRAE EL ECABEZADO "authorization" DE LA PETICION (TOKEN) (ejem:Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6 )
    const authHeader = req.headers['authorization'];

    //ACA DIVIVIDOMOS EL TOKEN EN DOS PARTES (Bearer y el token en si) y NOS QUEDAMOS CON LA SEGUNDA PARTE QUE ES EL TOKEN (eyJhbGciOiJIUzI1NiIsInR5cCI6)
    const token = authHeader && authHeader.split(' ')[1];//

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token de acceso requerido'
      });
      return;
    }

    //USAMOS EK SERVICIO DE AUTENTICACION PARA VERIFICAR EL TOKEN (verifyToken ES UN METODO ESTATICO DE LA CLASE AuthService)
    const decoded = await AuthService.verifyToken(token);
    if (!decoded) {
      res.status(403).json({
        success: false,
        error: 'Token inválido o expirado'
      });
      return;
    }

    /*AQUI SE AGREGA LA INFORMACION DECODIFICADA 
    DEL TOKEN AL OBJETO DE LA PETICION (req.user) PARA QUE ESTE DISPONIBLE EN LOS 
    SIGUIENTES MIDDLEWARES O RUTAS*/

    req.user = decoded; 
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en autenticación'
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = await AuthService.verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    next();
  }
};