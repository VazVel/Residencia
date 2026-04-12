const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, esAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM public.catcontratos');
        res.json(result.rows); // Esto asegura que devuelva un [ ]
    } catch (err) {
        res.status(500).json([]); // Devolvemos arreglo vacío si falla
    }
});

// AGREGAR NUEVA CATEGORÍA
router.post('/nuevo', verificarToken, esAdmin, async (req, res) => {
    const { nombre_tipo } = req.body;

    if (!nombre_tipo) {
        return res.status(400).json({ error: "El nombre del tipo es obligatorio" });
    }

    try {
        const queryText = `
            INSERT INTO public.catcontratos (nombre_tipo)
            VALUES ($1)
            RETURNING *`;
        
        const result = await db.query(queryText, [nombre_tipo]);
        res.status(201).json({ 
            message: "Categoría agregada con éxito", 
            categoria: result.rows[0] 
        });
    } catch (err) {
        console.error("Error al crear categoría:", err.message);
        res.status(500).json({ error: "Error al registrar la categoría" });
    }
});

// EDITAR CATEGORÍA (Seguro: ID en el body)
router.put('/actualizar', verificarToken, esAdmin, async (req, res) => {
    const { idcat, nombre_tipo } = req.body;

    if (!idcat || !nombre_tipo) {
        return res.status(400).json({ error: "ID y Nombre son necesarios para actualizar" });
    }

    try {
        const queryText = `
            UPDATE public.catcontratos 
            SET nombre_tipo = $1
            WHERE idcat = $2
            RETURNING *`;

        const result = await db.query(queryText, [nombre_tipo, idcat]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        res.json({ 
            message: "Categoría actualizada correctamente", 
            categoria: result.rows[0] 
        });
    } catch (err) {
        console.error("Error al actualizar categoría:", err.message);
        res.status(500).json({ error: "Error al actualizar la categoría" });
    }
});

module.exports = router;