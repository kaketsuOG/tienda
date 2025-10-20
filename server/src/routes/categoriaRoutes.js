const express = require('express');
const router = express.Router();
const { getAllCategorias, createCategoria } = require('../controllers/categoriaController');
const { protect } = require('../middlewares/authMiddleware');

// Ruta pública para obtener todas las categorías (el frontend las necesitará)
router.get('/', getAllCategorias);

// Ruta protegida para crear nuevas categorías
router.post('/', protect, createCategoria);

module.exports = router;