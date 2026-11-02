const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.use(isAuthenticated, hasRole('admin'));

router.get('/dashboard', adminController.renderDashboard);

module.exports = router;