import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env')});//ESTO PARA QUE PUEDA ENCONTRAR EL .ENV

export class DatabaseService {
  private static connection: mysql.Connection;

  static async initialize(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306'),
      });

      console.log('✅ Conectado a MySQL');
    } catch (error) {
      console.error('❌ Error conectando a MySQL:', error);
      throw error;
    }
  }


  static getConnection(): mysql.Connection {
    if (!this.connection) {
      throw new Error('Database not initialized');
    }
    return this.connection;
  }

  static async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      console.log('✅ Conexión a MySQL cerrada');
    }
  }
}