const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRAR UN NUEVO ADMIN (USAR CON PRECAUCIÓN)
const registerAdmin = async (req, res) => {
    const { email, password, nombre } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO administradores (email, password_hash, nombre) VALUES ($1, $2, $3) RETURNING id, email, nombre',
            [email, password_hash, nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar administrador', error: error.message });
    }
};

// INICIAR SESIÓN DE ADMIN
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    try {
        const result = await pool.query('SELECT * FROM administradores WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' }); // Usuario no encontrado
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' }); // Contraseña incorrecta
        }

        // Si las credenciales son correctas, creamos un token
        const payload = { id: admin.id, email: admin.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registerAdmin, loginAdmin };