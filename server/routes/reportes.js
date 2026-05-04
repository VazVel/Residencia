const express = require('express');
const router = express.Router();
const db = require('../db');
const ExcelJS = require('exceljs');
const { verificarToken, esAdmin } = require('../middleware/auth');

router.post('/contratos', verificarToken, esAdmin, async (req, res) => {
    try {
        const { nombre, tipo, proveedor, estadoFiltro, fechaDesde, fechaHasta } = req.body;

        // 1. Consulta ajustada a tu definición de tabla (public.contrato)
        let queryBase = `
            SELECT 
                c.idcontrato, 
                c.nombre, 
                tc.nombre_tipo AS tipo, 
                p.razonsocial AS proveedor, 
                c.costo, 
                c.fechainicio, 
                c.fechatermino, 
                c.estado,
                c.asistencia,
                c.descripcion
            FROM public.contrato c
            JOIN public.catcontratos tc ON c.idtipo = tc.idcat
            JOIN public.proveedor p ON c.idproveedor = p.idproveedor
            WHERE 1=1
        `;
        
        let clauses = [];
        const params = [];

        // 2. Filtros dinámicos
        if (nombre && nombre.trim() !== '') {
            clauses.push(`c.nombre ILIKE $${params.length + 1}`);
            params.push(`%${nombre.trim()}%`);
        }
        if (tipo && tipo.trim() !== '') {
            clauses.push(`tc.nombre_tipo ILIKE $${params.length + 1}`);
            params.push(`%${tipo.trim()}%`);
        }
        if (proveedor && proveedor.trim() !== '') {
            clauses.push(`p.razonsocial ILIKE $${params.length + 1}`);
            params.push(`%${proveedor.trim()}%`);
        }
        if (fechaDesde) {
            clauses.push(`c.fechainicio >= $${params.length + 1}`);
            params.push(fechaDesde);
        }
        if (fechaHasta) {
            clauses.push(`c.fechatermino <= $${params.length + 1}`);
            params.push(fechaHasta);
        }

        const finalQuery = clauses.length > 0 
            ? `${queryBase} AND ${clauses.join(' AND ')}` 
            : queryBase;

        // 3. Ejecución
        const result = await db.query(finalQuery, params);
        const rows = result.rows;

        // 4. Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Contratos');

        worksheet.columns = [
            { header: 'ID', key: 'idcontrato', width: 10 },
            { header: 'NOMBRE', key: 'nombre', width: 35 },
            { header: 'TIPO', key: 'tipo', width: 20 },
            { header: 'PROVEEDOR', key: 'proveedor', width: 30 },
            { header: 'COSTO (MXN)', key: 'costo', width: 15 },
            { header: 'INICIO', key: 'fechainicio', width: 15 },
            { header: 'VENCIMIENTO', key: 'fechatermino', width: 15 },
            { header: 'ESTADO', key: 'estado_texto', width: 15 }
        ];

        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1D3557' } };

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        rows.forEach(row => {
            const fechaV = new Date(row.fechatermino);
            const est = row.estado === 0 ? 'BORRADO' : (hoy > fechaV ? 'CADUCADO' : 'VIGENTE');

            if (!estadoFiltro || estadoFiltro === '' || est.toLowerCase() === estadoFiltro.toLowerCase()) {
                worksheet.addRow({
                    ...row,
                    costo: Number(row.costo),
                    fechainicio: row.fechainicio ? new Date(row.fechainicio).toLocaleDateString('es-MX') : 'N/A',
                    fechatermino: row.fechatermino ? new Date(row.fechatermino).toLocaleDateString('es-MX') : 'N/A',
                    estado_texto: est
                });
            }
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Bodesa.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ error: "Error en base de datos", detalle: error.message });
    }
});

module.exports = router;