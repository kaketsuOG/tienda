const express = require('express');
const router = express.Router();
const { registerAdmin, 
        loginAdmin, 
        getDashboardStats,
        getReservasChartData } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
// La ruta de registro es opcional, puedes quitarla después de crear tu primer admin
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/stats', protect, getDashboardStats);
router.get('/stats/reservas-chart', protect, getReservasChartData);

module.exports = router;