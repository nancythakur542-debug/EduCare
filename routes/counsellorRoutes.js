const express = require('express');
const router = express.Router();
const counsellorController = require('../controllers/counsellorController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.use(isAuthenticated, hasRole('counsellor'));

router.get('/dashboard', counsellorController.renderDashboard);
router.post('/appointments/:id', counsellorController.updateAppointmentStatus);
router.post('/alerts/:id', counsellorController.reviewRiskAlert);
router.get('/students/:id', counsellorController.renderStudentDetails);

module.exports = router;