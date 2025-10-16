const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Registro de usuario
router.post('/registro', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    const usuarioExiste = await Usuario.findByEmail(email);
    if (usuarioExiste) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario ya existe' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const usuarioId = await Usuario.create({
      email,
      password: passwordHash,
      nombre: nombre || email.split('@')[0]
    });

    const nuevoUsuario = await Usuario.findById(usuarioId);

    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    await Usuario.updateLastAccess(usuario.id);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// Verificar token
router.get('/verificar', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No hay token' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        fecha_registro: usuario.fecha_registro,
        ultimo_acceso: usuario.ultimo_acceso
      }
    });

  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
});

module.exports = router;