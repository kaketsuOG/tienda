const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

// La ruta de registro es opcional, puedes quitarla después de crear tu primer admin
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

module.exports = router;