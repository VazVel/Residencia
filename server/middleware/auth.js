const jwt = require('jsonwebtoken');

// Asegúrate de que esta clave coincida con la de tu archivo de Login
const JWT_SECRET = process.env.JWT_SECRET || "Bodesa_Secret_Key_2026";

const verificarToken = (req, res, next) => {
    // Obtenemos el token del header 'Authorization'
    // El estándar es: "Bearer [TOKEN]"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: "Acceso denegado: Token no proporcionado" });
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.user = verificado; // Guardamos los datos del usuario (id, rol) en la petición
        next(); // Continuamos a la siguiente función (la ruta)
    } catch (err) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};

// Middleware adicional para rutas exclusivas de ADMIN
const esAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 1) {
        next();
    } else {
        res.status(403).json({ error: "Acceso denegado: Se requieren permisos de administrador" });
    }
};

module.exports = { verificarToken, esAdmin };