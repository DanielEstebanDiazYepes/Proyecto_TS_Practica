import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DatabaseService } from './database';
import { User, LoginRequest, RegisterRequest, AuthResponse, JwtPayload } from '@shared/types';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '7d';

  static async register(userData: RegisterRequest): Promise<AuthResponse> {//PARAMETROS A RECIBIR (userData) Y TIPO DE DATO A DEVOLVER (AuthResponse)
    try {
      const connection = DatabaseService.getConnection();

      const [existingUsers] = await connection.execute(//CONSULTA PARA SABER SI YA HAY UN USUARIO CON ESE EMAIL
        'SELECT id FROM users WHERE email = ?',[userData.email]//EL "?" SE REMMPELAZA POR EL email (userData.email)
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {//SI EXISTE UN USUARIO CON ESE EMAIL
        return {
          success: false,
          error: 'El usuario ya existe'
        };
      }

      //HASHEAR CONTRASEÑA
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // GUARDAMOS EL USUARIO
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [userData.email, hashedPassword, userData.name]//LOS "?" SE RELLENAN CON LOS DATOS DEL ARRAY
      );

      //GUARDAMOS EL RESULTADO DE LA CONSULTA "result" TYPADO (as any) PARA QUE TYPESCRIPT DEJE USARLO (EL RESULTADO DE LA CONSULT ES UN OBJETO)
      const insertResult = result as any;

      /*INTENTAMOS OBTENER LA ID DEL USUARIO RECIEN CREADO DEL OBJETO QUE NOS DEVOLVIO (insertResult.insertId)
       "insertId" ES COMO ESTA NOMBREDO EL "ID" QUE DE MANERA AUTOMATICA DEVUELVE SQL CUANDO SE INSERTA UN USUARIO
       POR ESO INTENTAMOS ACCEDER A LA ID DE ESTA MANERA AUNQUE ACA NO EXISTA DE FORMA INTERNA EN SQL SI EXISTE*/
      const userId = insertResult.insertId;

      // GENERAR TOKEN JWT
      const token = this.generateToken({ userId, email: userData.email });

      return {//DEVOLVEMOS RESPUESTA DE REGISTRO EXITOSO CON TOKEN Y DATOS DEL USUARIO
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: userId,
          email: userData.email,
          name: userData.name
        }
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }


  static async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const connection = DatabaseService.getConnection();

      // SE BUSCA EL USUARIO POR EMAIL
      const [users] = await connection.execute(//BUSCAMOS EL USUARIO POR EMAIL
        'SELECT id, email, password, name FROM users WHERE email = ?',
        [loginData.email]
      );

      if (!Array.isArray(users) || users.length === 0) {// SI NO ENCUENTRA NINGUN USUARIO CON ESE EMAIL DA ERROR
        return {
          success: false,
          error: 'Credenciales inválidas'
        };
      }

      //ASIGNAMOS EL PRIMER USUARO ENCONTRADO (users[0]) A "user" ADEMAS LE DECIMOS QUE LO TRATE COMO UN TIPO "User"
      const user = users[0] as User;

      // VERIFICAR CONTRASEÑA (SE VERIFICA QUE LA CONTRASEÑA HASHEADA SEA IGUAL A LA QUE SE GUARDO EN LA BASE DE DATOS)
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) { // SI LA CONTRASEÑA NO ES LA MISMA DA ERROR
        return {
          success: false,
          error: 'Credenciales inválidas'
        };
      }

      // GENERAMOS EL NUEVO JWT PARA EL USUARIO AUTENTICADO
      const token = this.generateToken({ userId: user.id!, email: user.email });

      return {//DEVOLVEMOS RESPUESTA DE LOGIN EXITOSO CON TOKEN Y DATOS DEL USUARIO
        success: true,
        message: 'Login exitoso',
        token,
        user: {
          id: user.id!,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }


  //VERIFICAR TOKEN (SI ES VALIDO O NO)
  static async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  private static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.JWT_EXPIRES_IN 
    });
  }
}