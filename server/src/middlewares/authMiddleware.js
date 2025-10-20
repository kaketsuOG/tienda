const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // El token vendrá en los headers de la petición, con el formato "Bearer TOKEN"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Obtenemos el token del header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificamos el token con nuestra clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. (Opcional) Adjuntamos la info del usuario a la petición para usarla después
            req.admin = decoded;

            next(); // Si todo es correcto, continuamos a la siguiente función (el controlador)
        } catch (error) {
            console.error('Error de autenticación:', error);
            res.status(401).json({ message: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

module.exports = { protect };