const mysql = require('mysql2/promise');

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para crear la tabla de usuarios si no existe
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('✅ Conectado a MySQL');
    
    // Crear tabla usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) DEFAULT '',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ultimo_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Tabla "usuarios" lista');
    
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
    console.error('💡 Verifica que MySQL esté corriendo: brew services list');
    process.exit(1);
  }
};

module.exports = { pool, initDatabase };