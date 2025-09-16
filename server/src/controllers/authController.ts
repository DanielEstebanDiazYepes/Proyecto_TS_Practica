import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginRequest, RegisterRequest, AuthResponse } from '@shared/types';


export class AuthController { //CONTROLADOR DE AUTENTICACION

  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name }: RegisterRequest = req.body;

      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: 'Email, password y name son requeridos'
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
        return;
      }

      const result: AuthResponse = await AuthService.register({
        email,
        password,
        name
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Error en controlador de registro:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email y password son requeridos'
        });
        return;
      }

      const result: AuthResponse = await AuthService.login({
        email,
        password
      });

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Error en controlador de login:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };

  static getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // El usuario está disponible en req.user gracias al middleware
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
}