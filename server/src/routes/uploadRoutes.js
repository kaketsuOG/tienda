const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Configuración de Multer para guardar el archivo en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta protegida que usa 'upload.single' para procesar un solo archivo llamado 'image'
router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;