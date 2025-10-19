
const { Pool } = require('pg');
require('dotenv').config();

// Creamos una instancia del pool de conexiones usando la URL de la base de datos
// que está en tus variables de entorno (.env)
const pool = new Pool({
    connectionString: process.env.DB_URL,
});

// Exportamos el pool para poder usarlo en otros archivos (como los controllers)
module.exports = pool;