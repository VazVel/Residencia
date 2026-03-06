// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// 1. Middlewares globales
app.use(cors());
app.use(express.json());

// 2. RUTAS DE LA API
const contratosRoutes = require('./routes/contratos');
const proveedoresRoutes = require('./routes/proveedores');
const catContratosRoutes = require('./routes/catcontratos');

app.use('/api/contratos', contratosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/catcontratos', catContratosRoutes);

// 3. SERVIR FRONTEND (PRODUCCIÓN)
app.use(express.static(path.join(__dirname, '../client/dist')));

// 4. MANEJO DE RUTAS DEL CLIENTE (Sintaxis corregida para Node v24+)
// Cambiamos '*' por '(.*)' para que no lance el error de PathError
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de Bodesa corriendo en el puerto ${PORT}`);
});