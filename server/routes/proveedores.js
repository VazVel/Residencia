const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM public.proveedor');
        res.json(result.rows); // Esto asegura que devuelva un [ ]
    } catch (err) {
        res.status(500).json([]); // Devolvemos arreglo vacío si falla
    }
});

// AGREGAR NUEVO PROVEEDOR
router.post('/nuevo', async (req, res) => {
    const { rfc, razonsocial, nombrecomercial, direccionfiscal, telefono, correo } = req.body;

    // Validación básica de campos obligatorios
    if (!rfc || !razonsocial || !correo) {
        return res.status(400).json({ error: "RFC, Razón Social y Correo son obligatorios" });
    }

    try {
        const queryText = `
            INSERT INTO public.proveedor (rfc, razonsocial, nombrecomercial, direccionfiscal, telefono, correo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        
        const values = [rfc, razonsocial, nombrecomercial, direccionfiscal, telefono, correo];
        const result = await db.query(queryText, values);
        
        res.status(201).json({ message: "Proveedor registrado con éxito", proveedor: result.rows[0] });
    } catch (err) {
        console.error("Error al crear proveedor:", err.message);
        res.status(500).json({ error: "Error interno al registrar el proveedor" });
    }
});

// EDITAR PROVEEDOR (Seguro: ID en el body)
router.put('/actualizar', async (req, res) => {
    const { idproveedor, rfc, razonsocial, nombrecomercial, direccionfiscal, telefono, correo } = req.body;

    if (!idproveedor) {
        return res.status(400).json({ error: "El ID del proveedor es necesario para actualizar" });
    }

    try {
        const queryText = `
            UPDATE public.proveedor 
            SET rfc = $1, razonsocial = $2, nombrecomercial = $3, 
                direccionfiscal = $4, telefono = $5, correo = $6
            WHERE idproveedor = $7
            RETURNING *`;

        const values = [rfc, razonsocial, nombrecomercial, direccionfiscal, telefono, correo, idproveedor];
        const result = await db.query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Proveedor no encontrado" });
        }

        res.json({ message: "Datos del proveedor actualizados correctamente", proveedor: result.rows[0] });
    } catch (err) {
        console.error("Error al actualizar proveedor:", err.message);
        res.status(500).json({ error: "Error interno al actualizar el proveedor" });
    }
});

router.post('/detalle', async (req, res) => {
    const { idproveedor } = req.body;

    if (!idproveedor) {
        return res.status(400).json({ error: "ID requerido" });
    }

    try {
        // Convertimos explícitamente a entero para evitar fallos de tipos en la DB
        const idInt = parseInt(idproveedor);
        
        const result = await db.query(
            'SELECT * FROM public.proveedor WHERE idproveedor = $1', 
            [idInt]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No encontrado" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error DB Proveedor:", err.message);
        res.status(500).json({ error: "Error de servidor" });
    }
});

module.exports = router;