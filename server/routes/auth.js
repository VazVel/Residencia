const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Clave secreta (En producción usa process.env.JWT_SECRET)
const JWT_SECRET = "Bodesa_Secret_Key_2026"; 

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Buscar usuario y verificar que esté activo (status = true)
        const result = await db.query(
            'SELECT * FROM public.usuarios WHERE username = $1 AND status = true', 
            [username.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas o usuario desactivado" });
        }

        const usuario = result.rows[0];

        // 2. Comparar contraseña con el Hash de la DB
        const match = await bcrypt.compare(password, usuario.password);

        if (!match) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // 3. Generar el Token (JWT) incluyendo el ROL
        const token = jwt.sign(
            { 
                id: usuario.idusuario, 
                rol: usuario.rol, 
                nombre: usuario.nombrecompleto 
            }, 
            JWT_SECRET, 
            { expiresIn: '8h' } // La sesión dura una jornada laboral
        );

        // 4. Enviar datos al Front (Sin el password)
        res.json({
            token,
            user: {
                nombre: usuario.nombrecompleto,
                rol: usuario.rol,
                username: usuario.username
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;