const express=require('express');
const route=express.Router();
const cookieParser=require('cookie-parser');
const middlewere= require('../middlewere/auth');
const payment=require('../controllers/payemnt');
route.post('/checkout',payment.checkout);
route.get('/complete',payment.complete);
module.exports=route;