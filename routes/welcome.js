const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/welcome', verify, (req, res) => {
    res.render('welcome', {layout: 'index'});
});

router.post('/welcome', (req, res) => {
    localStorage.removeItem('token');
    req.flash('success_msg', 'You are logout.');
    res.redirect('/users/login');
});

module.exports = router;