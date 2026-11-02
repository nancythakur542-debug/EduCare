const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const connectDB = require('./config/db');
const { attachUser } = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const counsellorRoutes = require('./routes/counsellorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
connectDB();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/educare' }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use(limiter);

app.use(attachUser);

app.get('/', (req, res) => {
    res.render('pages/landing');
});

app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/counsellor', counsellorRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
    res.status(404).render('pages/error', { message: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`EduCare server running on port ${PORT}`);
});