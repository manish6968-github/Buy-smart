const express=require('express');
const route=express.Router();
const otp=require('../controllers/otp');
route.get('/otp',otp.otp);
route.post('/otp',otp.otpcheck);
route.get('/chkotp',otp.otps);
route.post('/otps',otp.otpchecks);
route.get('/confirm',otp.confirm);
module.exports=route;