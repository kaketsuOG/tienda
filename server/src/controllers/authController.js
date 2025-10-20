const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO DE NUEVO CLIENTE
exports.registerCliente = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;
    if (!email || !password || !nombre) {
        return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Verificamos si el email ya existe
        const userExists = await pool.query('SELECT id FROM clientes WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const result = await pool.query(
            'INSERT INTO clientes (nombre, apellido, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email',
            [nombre, apellido, email, password_hash]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el cliente', error: error.message });
    }
};

// LOGIN DE CLIENTE
exports.loginCliente = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    try {
        const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
        const cliente = result.rows[0];

        if (!cliente || !cliente.password_hash) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, cliente.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Creamos un token con rol de cliente
        const payload = { id: cliente.id, email: cliente.email, rol: 'cliente' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({ token, user: { nombre: cliente.nombre, email: cliente.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};