const express=require('express');
const route=express.Router();
const cart=require('../controllers/cart');
const cookieParser=require('cookie-parser');
const middlewere= require('../middlewere/auth');
route.post('/cart',middlewere.checkcookiejs,cart.cart);
route.get('/showcart',middlewere.checkcookie,cart.showcart);
route.post('/removecart',cart.removecart);
module.exports=route;