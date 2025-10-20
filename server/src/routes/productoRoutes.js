const express = require('express');
const router = express.Router();
const { 
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} = require('../controllers/productoController'); // Asegúrate que el nombre del archivo coincida
const { protect } = require('../middlewares/authMiddleware');

// Rutas para /api/productos

router.get('/', getAllProductos);
router.get('/:id', getProductoById);

router.post('/', protect, createProducto);
router.put('/:id', protect, updateProducto);
router.delete('/:id', protect, deleteProducto);

module.exports = router;