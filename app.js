const path = require('path');
const express = require('express');
const cookieParser=require('cookie-parser')
const bodyParser = require('body-parser');
const user=require('./routes/user');
const cart=require('./routes/cart');
const otp=require('./routes/otp');
const payment=require('./routes/payment');
const {restrictTologgedUserOnly}= require('./middlewere/auth');
const app = express();
const flash = require('connect-flash');
const port = 8000;
require('dotenv').config()
app.use(express.static('public'));

const session = require('express-session');
app.use(bodyParser.json());
app.use(session({
    secret: '123#$%mom?>>', // Change this to a more secure random key
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(express.urlencoded({ extended: true })); // Middleware for parsing POST data
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/users',user);
app.use('/users',cart);
app.use('/users',otp);
app.use('/users',payment);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
