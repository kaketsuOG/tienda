const pool = require('../config/database');

// OBTENER TODAS LAS CATEGORÍAS
exports.getAllCategorias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// CREAR UNA NUEVA CATEGORÍA
exports.createCategoria = async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es requerido.' });
    }
    try {
        const result = await pool.query('INSERT INTO categorias (nombre) VALUES ($1) RETURNING *', [nombre]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
    }
};
// Aquí podríamos agregar update y delete más adelante