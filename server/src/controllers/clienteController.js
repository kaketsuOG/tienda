const pool = require('../config/database');

// --- OBTENER TODOS LOS CLIENTES ---
const getAllClientes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes ORDER BY apellido, nombre');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- OBTENER UN CLIENTE POR ID ---
const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- CREAR UN NUEVO CLIENTE ---
const createCliente = async (req, res) => {
    const { nombre, apellido, email, telefono, direccion } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ message: 'Nombre y email son campos requeridos.' });
    }

    try {
        const query = `
            INSERT INTO clientes (nombre, apellido, email, telefono, direccion) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const values = [nombre, apellido, email, telefono, direccion];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Manejo de error para email duplicado (código de error 23505 en PostgreSQL)
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- ACTUALIZAR UN CLIENTE ---
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, direccion } = req.body;

     if (!nombre || !email) {
        return res.status(400).json({ message: 'Nombre y email son campos requeridos.' });
    }

    try {
        const query = `
            UPDATE clientes 
            SET nombre = $1, apellido = $2, email = $3, telefono = $4, direccion = $5
            WHERE id = $6
            RETURNING *
        `;
        const values = [nombre, apellido, email, telefono, direccion, id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
         if (error.code === '23505') {
            return res.status(409).json({ message: 'El email ya está en uso por otro cliente.' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- ELIMINAR UN CLIENTE ---
const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};


module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};