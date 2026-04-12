const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 1. OBTENER USUARIOS ACTIVOS (status = true)
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT idusuario, username, rol, nombrecompleto, status 
            FROM public.usuarios 
            WHERE status = true 
            ORDER BY idusuario ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// 2. CREAR USUARIO (status por defecto true)
router.post('/nuevo', async (req, res) => {
    const { username, rol, nombrecompleto, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const queryText = `
            INSERT INTO public.usuarios (username, rol, nombrecompleto, "password", status)
            VALUES ($1, $2, $3, $4, true) 
            RETURNING idusuario, username`;
        
        const result = await db.query(queryText, [username, rol, nombrecompleto, hashedPassword]);
        res.status(201).json({ message: "Usuario creado con éxito", usuario: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al crear: el username ya existe o los datos son inválidos" });
    }
});

// 3. ACTUALIZAR USUARIO (Manejo de password opcional)
router.put('/actualizar', async (req, res) => {
    const { idusuario, username, rol, nombrecompleto, password } = req.body;

    try {
        let queryText;
        let values;

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            queryText = `
                UPDATE public.usuarios 
                SET username = $1, rol = $2, nombrecompleto = $3, "password" = $4
                WHERE idusuario = $5`;
            values = [username, rol, nombrecompleto, hashedPassword, idusuario];
        } else {
            queryText = `
                UPDATE public.usuarios 
                SET username = $1, rol = $2, nombrecompleto = $3
                WHERE idusuario = $4`;
            values = [username, rol, nombrecompleto, idusuario];
        }

        await db.query(queryText, values);
        res.json({ message: "Datos actualizados" });
    } catch (err) {
        res.status(500).json({ error: "Error en la actualización" });
    }
});

// 4. BORRADO LÓGICO (Cambia status a false)
router.put('/eliminar', async (req, res) => {
    const { idusuario } = req.body; // ID en el body por seguridad
    try {
        const result = await db.query(
            'UPDATE public.usuarios SET status = false WHERE idusuario = $1 RETURNING idusuario', 
            [idusuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario desactivado correctamente (Borrado Lógico)" });
    } catch (err) {
        res.status(500).json({ error: "Error al desactivar usuario" });
    }
});

module.exports = router;