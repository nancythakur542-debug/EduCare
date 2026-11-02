const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('auth/register', { error: errors.array()[0].msg, oldInput: req.body });
        }
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('auth/login', { error: errors.array()[0].msg, oldInput: req.body });
        }
        next();
    }
];

module.exports = { validateRegistration, validateLogin };