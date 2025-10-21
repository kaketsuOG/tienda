// src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
} = require('../controllers/clienteController');
const { protect } = require('../middlewares/authMiddleware');

// Rutas para /api/clientes

router.get('/', protect, getAllClientes);
router.get('/:id', protect, getClienteById);
router.post('/', protect, createCliente);
router.put('/:id', protect, updateCliente);
router.delete('/:id', protect, deleteCliente);

module.exports = router;