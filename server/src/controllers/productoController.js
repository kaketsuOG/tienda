const pool = require('../config/database');

// --- OBTENER TODOS LOS PRODUCTOS ---
const getAllProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos ORDER BY nombre ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- OBTENER UN PRODUCTO POR ID ---
const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- CREAR UN NUEVO PRODUCTO ---
const createProducto = async (req, res) => {
    // Usamos los nombres en español de tu tabla
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
        return res.status(400).json({ message: 'Nombre, precio y stock son campos requeridos.' });
    }

    try {
        const query = `
            INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const values = [nombre, descripcion, precio, stock, imagen_url];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- ACTUALIZAR UN PRODUCTO ---
const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
        return res.status(400).json({ message: 'Nombre, precio y stock son campos requeridos.' });
    }

    try {
        const query = `
            UPDATE productos 
            SET nombre = $1, descripcion = $2, precio = $3, stock = $4, imagen_url = $5
            WHERE id = $6
            RETURNING *
        `;
        const values = [nombre, descripcion, precio, stock, imagen_url, id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- ELIMINAR UN PRODUCTO ---
const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};


module.exports = {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};