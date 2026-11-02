const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.use(isAuthenticated, hasRole('student'));

router.get('/dashboard', studentController.renderDashboard);
router.get('/mood', studentController.renderMoodTracker);
router.post('/mood', studentController.saveMood);
router.get('/checkin', studentController.renderCheckIn);
router.post('/checkin', studentController.saveCheckIn);
router.get('/chat', studentController.renderChat);
router.post('/chat', studentController.sendMessage);
router.get('/appointments', studentController.renderAppointments);
router.post('/appointments', studentController.bookAppointment);
router.post('/appointments/:id/cancel', studentController.cancelAppointment);

module.exports = router;