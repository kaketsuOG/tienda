// src/controllers/testController.js
const pool = require('../config/database'); // Importamos la conexión

const testDbConnection = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();

        res.status(200).json({
            message: "Conexión a Supabase exitosa!",
            currentTime: result.rows[0].now
        });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        res.status(500).json({ 
            message: "Error de conexión a la base de datos",
            error: error.message
        });
    }
};

module.exports = { testDbConnection };