import { DatabaseService } from './services/database';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env')});

async function testDatabaseConnection() {
  console.log('🧪 Probando conexión a MySQL...');
  console.log('📋 Variables de entorno:');
  console.log(`   DB_HOST: ${process.env.DB_HOST}`);
  console.log(`   DB_USER: ${process.env.DB_USER}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT}`);

  try {
    // Inicializar la base de datos
    await DatabaseService.initialize();
    console.log('✅ Conexión a MySQL exitosa!');

    // Probamos una consulta simple
    const connection = DatabaseService.getConnection();
    const [rows] = await connection.execute('SELECT 1 + 1 as result');
    console.log('✅ Consulta de prueba exitosa:', rows);

    // Verificar si la tabla users existe
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME 
       FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME]
    );

    if (Array.isArray(tables) && tables.length > 0) {
      console.log('✅ Tabla "users" existe');
    } else {
      console.log('ℹ️ Tabla "users" no existe, se creará automáticamente');
    }

    // Cerrar conexión
    await DatabaseService.close();
    console.log('✅ Conexión cerrada correctamente');

  } catch (error) {
    console.error('❌ Error en la conexión:');
    
    if (error instanceof Error) {
      console.error('   Mensaje:', error.message);
      console.error('   Código:', (error as any).code);
      
      // Errores comunes de MySQL
      if ((error as any).code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('\n💡 Solución: Verifica usuario y contraseña de MySQL');
      } else if ((error as any).code === 'ER_BAD_DB_ERROR') {
        console.log('\n💡 Solución: La base de datos no existe. Crea la BD primero:');
        console.log('   mysql -u root -p -e "CREATE DATABASE weather_app"');
      } else if ((error as any).code === 'ECONNREFUSED') {
        console.log('\n💡 Solución: MySQL no está corriendo o el puerto es incorrecto');
        console.log('   Verifica que MySQL esté instalado y ejecutándose');
      }
    }
    
    process.exit(1);
  }
}

// Ejecutar la prueba
testDatabaseConnection();