const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validator');

router.get('/login', authController.renderLogin);
router.post('/login', validateLogin, authController.login);
router.get('/register', authController.renderRegister);
router.post('/register', validateRegistration, authController.register);
router.get('/logout', authController.logout);

module.exports = router;