const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
// La ruta de registro es opcional, puedes quitarla después de crear tu primer admin
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/stats', protect, getDashboardStats);
module.exports = router;