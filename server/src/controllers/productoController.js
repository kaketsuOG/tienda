const pool = require('../config/database');

// --- OBTENER TODOS LOS PRODUCTOS ---
const getAllProductos = async (req, res) => {
    const { categoria } = req.query;

    try {
        let query = 'SELECT * FROM productos';
        const values = [];

        // Si se proporciona una categoría, añadimos un filtro WHERE a la consulta
        if (categoria) {
            query += ' WHERE categoria_id = $1';
            values.push(categoria);
        }

        query += ' ORDER BY nombre ASC'; // Mantenemos el orden alfabético

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- OBTENER UN PRODUCTO POR ID ---
const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Obtenemos el producto principal
        const productoResult = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

        if (productoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const producto = productoResult.rows[0];

        // 2. Si el producto tiene una categoría, buscamos otros productos en ella
        let relacionados = [];
        if (producto.categoria_id) {
            const relacionadosResult = await pool.query(
                `SELECT * FROM productos 
                 WHERE categoria_id = $1 AND id != $2 
                 ORDER BY RANDOM() 
                 LIMIT 4`, // Buscamos en la misma categoría, excluimos el producto actual, ordenamos al azar y tomamos 4
                [producto.categoria_id, id]
            );
            relacionados = relacionadosResult.rows;
        }

        // 3. Devolvemos un objeto que contiene tanto el producto principal como los relacionados
        res.status(200).json({
            producto: producto,
            relacionados: relacionados
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- CREAR UN NUEVO PRODUCTO ---
const createProducto = async (req, res) => {
    // Usamos los nombres en español de tu tabla
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id, precio_oferta } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
        return res.status(400).json({ message: 'Nombre, precio y stock son campos requeridos.' });
    }

    try {
        const query = `
            INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, precio_oferta) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `;
        const values = [nombre, descripcion, precio, stock, imagen_url, categoria_id, precio_oferta || null];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- ACTUALIZAR UN PRODUCTO ---
const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id, precio_oferta } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
        return res.status(400).json({ message: 'Nombre, precio y stock son campos requeridos.' });
    }

    try {
        const query = `
            UPDATE productos 
            SET nombre = $1, descripcion = $2, precio = $3, stock = $4, imagen_url = $5, categoria_id = $6, precio_oferta = $7
            WHERE id = $8
            RETURNING *
        `;
        const values = [nombre, descripcion, precio, stock, imagen_url, categoria_id, precio_oferta || null, id];

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