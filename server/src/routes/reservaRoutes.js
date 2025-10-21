const express = require('express');
const router = express.Router();
const { 
    createReserva,
    getAllReservas,
    getReservaDetails,   
    updateReservaStatus 
} = require('../controllers/reservaController');
const { protect } = require('../middlewares/authMiddleware');

// Rutas para /api/reservas

router.post('/', createReserva);
router.get('/', protect, getAllReservas);
router.get('/:id', protect, getReservaDetails); 
router.put('/:id/status', protect, updateReservaStatus);

module.exports = router;