const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    const token = localStorage.getItem('token');      // req.header('auth-token')
    if(!token) {
        req.flash('error_msg', 'Access denied! You must login first');
        return res.status(401).redirect('/users/login');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        req.flash('error_msg', error.message);
        res.status(400).redirect('/users/login');
    }
}