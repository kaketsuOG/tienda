// src/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { testDbConnection } = require('../controllers/testController'); // Importamos la lógica

// Definimos la ruta GET /test-db
router.get('/test-db', testDbConnection);

module.exports = router;