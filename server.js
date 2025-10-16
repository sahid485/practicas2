require('dotenv').config({ path: './bin.env' });
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/db');

const app = express();

// Inicializar base de datos
initDatabase();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API funcionando correctamente con MySQL',
    database: 'MySQL',
    endpoints: {
      registro: 'POST /api/auth/registro',
      login: 'POST /api/auth/login',
      verificar: 'GET /api/auth/verificar'
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: MySQL`);
});