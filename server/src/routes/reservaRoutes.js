const express = require('express');
const router = express.Router();
const { 
    createReserva,
    getAllReservas 
} = require('../controllers/reservaController');

// Rutas para /api/reservas

router.post('/', createReserva);
router.get('/', getAllReservas);

module.exports = router;