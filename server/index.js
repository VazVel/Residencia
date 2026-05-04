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
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const reportesRoutes = require('./routes/reportes');
const { verificarToken, esAdmin } = require('./middleware/auth');

// Registro de endpoints
app.use('/api/contratos', verificarToken, contratosRoutes);
app.use('/api/proveedores', verificarToken, proveedoresRoutes);
app.use('/api/catcontratos', verificarToken, catContratosRoutes); 
app.use('/api/usuarios', verificarToken, esAdmin, usuariosRoutes);
app.use('/api/reportes', verificarToken, esAdmin, reportesRoutes);
app.use('/api/auth', authRoutes);

// 3. SERVIR FRONTEND (PRODUCCIÓN)
app.use(express.static(path.join(__dirname, '../client/dist')));

// 4. MANEJO DE RUTAS DEL CLIENTE (Compatibilidad Total con Node v24+)
// Usamos una Expresión Regular que captura cualquier ruta
// pero con un condicional interno para no interferir con la API
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Si algo llega aquí y empieza con /api, es un error 404 de la API
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Endpoint de API no encontrado' });
});

// 5. ARRANQUE DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 Servidor de Bodesa corriendo en puerto ${PORT}`);
    console.log(`===========================================`);
});