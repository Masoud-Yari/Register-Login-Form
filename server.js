const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const handlebars  = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');

const app = express();

dotenv.config();

// initial node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

// session middleware
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

// flash middleware
app.use(flash());

// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// middleware for static parts
app.use(express.static('public'));

// initial handlebar
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}));


// body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// router middleware
app.use('/users', require('./routes/users'));
app.use('/users/user', require('./routes/welcome'));

// connect to mongodb
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true ,useUnifiedTopology: true }, () => console.log('database connected...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port: ${PORT}...`));