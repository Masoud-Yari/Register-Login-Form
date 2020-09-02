const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');

const router = express.Router();


// handle get method of users route
router.get('/login', (req, res) => {
    res.render('login', {layout: 'index'});
});

router.get('/register', (req, res) => {
    res.render('register', {layout: 'index'});
});

// handle post method of users route
router.post('/register', async (req, res) => {

    // error handling for validation
    const {error} = registerValidation(req.body);
    if(error) {
        req.flash('error_msg', error.details[0].message);
        return res.status(400).redirect('/users/register');
    }

    // check if email already exist or not
    const existedUser = await User.findOne({email: req.body.email});
    if(existedUser) {
        req.flash('error_msg', 'Email already existed!');
        return res.status(400).redirect('/users/register');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        await user.save();
        req.flash('success_msg', 'You are now registered and can login.');
        res.redirect('/users/login');
    }catch (err){
        req.flash('error_msg', err.message);
        res.status(400).redirect('/users/register');
    }
});

// handling login form
router.post('/login', async (req, res) => {

    // error handling for validation
    const {error} = loginValidation(req.body);
    if(error) {
        req.flash('error_msg', error.details[0].message);
        return res.status(400).redirect('/users/login');
    }

    // check if email exist or not
    const existUser = await User.findOne({email: req.body.email});
    //if(!existUser) return res.status(400).send('Email does not exist!');
    if(!existUser) {
        req.flash('error_msg', 'Email does not exist!');
        return res.status(400).redirect('/users/login');
    }

    // compare user password with hashed one
    const validPassword = await bcrypt.compare(req.body.password, existUser.password);
    if(!validPassword) {
        req.flash('error_msg', 'Password is incorrect!');
        return res.status(400).redirect('/users/login');
    }

    // create and assign token
    const token = jwt.sign({
        id: existUser._id,
        exp: Math.floor(Date.now() / 1000) + (30 * 60) // token expire after 30 min
    }, process.env.TOKEN_SECRET);

    // send token in localStorage
    localStorage.setItem('token', token);   // header('auth-token', token)

    req.flash('success_msg', 'You are now logged in.');
    res.redirect('/users/user/welcome');
});


module.exports = router;