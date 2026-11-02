const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/auth/login');
};

const hasRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === role) {
            return next();
        }
        return res.status(403).render('pages/error', { message: 'Access Denied' });
    };
};

const attachUser = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};

module.exports = { isAuthenticated, hasRole, attachUser };