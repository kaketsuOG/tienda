const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});