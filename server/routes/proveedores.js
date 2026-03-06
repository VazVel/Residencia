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

module.exports = router;