const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { verificarToken, esAdmin } = require('../middleware/auth');

// GET: Obtener contratos con JOINs para la tabla de React
router.get('/', verificarToken, async (req, res) => {
    try {
        // 1. Sincronización de estados según la fecha actual
        await db.query(`
            UPDATE public.contrato 
            SET estado = 2 
            WHERE estado = 1 AND fechatermino < CURRENT_DATE
        `);

        // 2. Consulta con ordenamiento prioritario para vigentes
        const queryText = `
            SELECT 
                c.idcontrato AS id, 
                c.nombre, 
                cat.nombre_tipo AS tipo, 
                c.fechainicio AS fecha_firma, 
                c.fechatermino AS fecha_termino, 
                c.estado, 
                p.idproveedor,
                p.razonsocial AS proveedor, 
                c.costo
            FROM public.contrato c
            LEFT JOIN public.catcontratos cat ON c.idtipo = cat.idcat
            LEFT JOIN public.proveedor p ON c.idproveedor = p.idproveedor
            WHERE c.estado != 0 
            ORDER BY 
                c.estado ASC,          -- Primero estado 1 (Vigente), luego 2 (Caducado)
                c.fechatermino ASC;    -- Dentro de cada grupo, ordenar por fecha más cercana
        `;
            
        const result = await db.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error("Error en GET /contratos:", err.message);
        res.status(500).json({ error: "Error al obtener la lista" });
    }
});

// POST: Registrar un nuevo contrato
router.post('/nuevo', async (req, res) => {
    const { 
        nombre, idtipo, idproveedor, 
        descripcion, asistencia, fechainicio, 
        fechatermino, costo, renovado, estado 
    } = req.body;

    try {
        const queryText = `
            INSERT INTO public.contrato (
                nombre, idtipo, idproveedor, 
                descripcion, asistencia, fechainicio, 
                fechatermino, costo, renovado, estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`;
        
        const values = [
            nombre, idtipo, idproveedor, 
            descripcion, asistencia, fechainicio, 
            fechatermino, costo, renovado || false, estado
        ];

        const result = await db.query(queryText, values);
        
        res.status(201).json({
            mensaje: "Contrato guardado correctamente",
            contrato: result.rows[0]
        });
    } catch (err) {
        console.error("Error en el INSERT:", err.message);
        res.status(500).json({ error: "Error al registrar el contrato en la base de datos" });
    }
});

// Obtener detalle mediante el body para mayor seguridad
router.post('/detalle', async (req, res) => {
    const { idcontrato } = req.body; // Recibimos el ID desde el body

    if (!idcontrato) {
        return res.status(400).json({ error: "ID de contrato es requerido" });
    }

    try {
        const queryText = `
            SELECT 
                c.*, 
                cat.nombre_tipo, 
                p.razonsocial 
            FROM public.contrato c
            LEFT JOIN public.catcontratos cat ON c.idtipo = cat.idcat
            LEFT JOIN public.proveedor p ON c.idproveedor = p.idproveedor
            WHERE c.idcontrato = $1`;

        const result = await db.query(queryText, [idcontrato]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Contrato no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error en servidor:", err.message);
        res.status(500).json({ error: "Error al recuperar los detalles" });
    }
});

router.put('/actualizar', verificarToken, esAdmin, async (req, res) => {
    // Extraemos el idcontrato junto con el resto de los datos del body
    const { 
        idcontrato, 
        nombre, 
        idtipo, 
        idproveedor, 
        fechainicio, 
        fechatermino, 
        costo, 
        renovado, 
        asistencia, 
        descripcion 
    } = req.body;

    if (!idcontrato) {
        return res.status(400).json({ error: "Falta el identificador del contrato" });
    }

    try {
        const queryText = `
            UPDATE public.contrato 
            SET 
                nombre = $1, 
                idtipo = $2, 
                idproveedor = $3, 
                fechainicio = $4, 
                fechatermino = $5, 
                costo = $6, 
                renovado = $7, 
                asistencia = $8, 
                descripcion = $9
            WHERE idcontrato = $10
            RETURNING *`;

        const values = [
            nombre, idtipo, idproveedor, fechainicio, 
            fechatermino, costo, renovado, asistencia, 
            descripcion, idcontrato
        ];

        const result = await db.query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Contrato no encontrado" });
        }

        res.json({ message: "Registro actualizado exitosamente" });
    } catch (err) {
        console.error("Error en UPDATE seguro:", err.message);
        res.status(500).json({ error: "Error interno al procesar la actualización" });
    }
});


// Borrado lógico de un contrato
router.put('/eliminar', verificarToken, esAdmin, async (req, res) => {
    const { idcontrato } = req.body; // Seguimos tu estándar de seguridad en el body

    if (!idcontrato) {
        return res.status(400).json({ error: "ID de contrato requerido" });
    }

    try {
        const queryText = `
            UPDATE public.contrato 
            SET estado = 0 
            WHERE idcontrato = $1 
            RETURNING idcontrato`;
        
        const result = await db.query(queryText, [idcontrato]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Contrato no encontrado" });
        }

        res.json({ message: "Contrato eliminado correctamente (Borrado Lógico)" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al eliminar el registro" });
    }
});

// Obtener TODO para el panel de administración
router.get('/all', verificarToken, esAdmin, async (req, res) => {
    try {
        const queryText = `
            SELECT 
                c.idcontrato AS id, c.nombre, cat.nombre_tipo AS tipo, 
                c.fechainicio AS fecha_firma, c.fechatermino AS fecha_termino, 
                c.estado, p.razonsocial AS proveedor, c.costo
            FROM public.contrato c
            LEFT JOIN public.catcontratos cat ON c.idtipo = cat.idcat
            LEFT JOIN public.proveedor p ON c.idproveedor = p.idproveedor
            ORDER BY c.estado DESC, c.fechatermino ASC`;
            
        const result = await db.query(queryText);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

module.exports = router;