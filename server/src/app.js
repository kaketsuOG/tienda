
const express = require('express');
const cors = require('cors');

const app = express();

// --- Middlewares ---
// Permite que tu frontend en localhost:3000 se comunique con el backend
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Permite que el servidor entienda y procese datos en formato JSON
app.use(express.json());

//--- Rutas ---
const testRoutes = require('./routes/testRoutes'); // Importamos el archivo de rutas
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

app.use('/api', testRoutes); // Le decimos que use esas rutas bajo el prefijo /api
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/pagos', pagoRoutes);

// Ruta de bienvenida simple
app.get('/', (req, res) => {
    res.send('API de la Tienda activa.');
});

// Exportamos 'app' para que server.js pueda usarla
module.exports = app;