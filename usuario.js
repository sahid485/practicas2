const { pool } = require('../config/db');

class Usuario {
  // Crear un nuevo usuario
  static async create({ email, password, nombre }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)',
      [email, password, nombre || '']
    );
    return result.insertId;
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, email, nombre, fecha_registro, ultimo_acceso FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Actualizar último acceso
  static async updateLastAccess(id) {
    await pool.query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
      [id]
    );
  }
}

module.exports = Usuario;