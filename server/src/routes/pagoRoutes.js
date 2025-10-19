const express = require('express');
const router = express.Router();
const { 
    createPago,
    getAllPagos
} = require('../controllers/pagoController');

// Rutas para /api/pagos

router.post('/', createPago);
router.get('/', getAllPagos);

module.exports = router;