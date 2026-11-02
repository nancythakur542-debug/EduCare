const User = require('../models/User');
const bcrypt = require('bcrypt');

const renderLogin = (req, res) => {
    res.render('auth/login', { error: null, oldInput: {} });
};

const renderRegister = (req, res) => {
    res.render('auth/register', { error: null, oldInput: {} });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('auth/login', { error: 'Invalid email or password', oldInput: { email } });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('auth/login', { error: 'Invalid email or password', oldInput: { email } });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        if (user.role === 'student') return res.redirect('/student/dashboard');
        if (user.role === 'counsellor') return res.redirect('/counsellor/dashboard');
        if (user.role === 'admin') return res.redirect('/admin/dashboard');
        res.redirect('/');
    } catch (error) {
        res.status(500).render('auth/login', { error: 'Server error during login', oldInput: req.body });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, department, studentId } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('auth/register', { error: 'Email already registered', oldInput: req.body });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const counsellor = await User.findOne({ role: 'counsellor' });

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student',
            department,
            studentId,
            assignedCounsellor: counsellor ? counsellor._id : null
        });

        req.session.user = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        res.redirect('/student/dashboard');
    } catch (error) {
        res.status(500).render('auth/register', { error: 'Server error during registration', oldInput: req.body });
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = { renderLogin, renderRegister, login, register, logout };