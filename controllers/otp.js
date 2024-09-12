const db = require('../connection/db');
const flash = require('connect-flash');
async function otp(req, res) {
    req.sesssion.otp=false;
    res.render('otp',{message:req.flash('error')});
}
async function otpcheck(req,res) {
    const otp=req.body.otp;
    const ans=db.query(`select * from otps where otp=${otp}`,(err,result)=>{
        if(err)
        {
            console.log('Database error');
            throw err;
        }
        else if(result.length==0){
            req.flash('error', 'Failed to match OTP . Please try again.');
            res.redirect('/users/otp');
        }
        else
            {
                // alert('OTP VERIFY SUCCESSFULLY!!');
                req.sesssion.otp=true;
                res.redirect('/users/login')
            }
    
    });
    console.log(ans);
   
}
async function otps(req,res) {
    res.render('otps',{message:req.flash('error')});
}
async function otpchecks(req,res) {
    const otp=req.body.otp;
    const ans=db.query(`select * from otps where otp=${otp}`,(err,result)=>{
        if(err)
        {
            console.log('Database error');
            throw err;
        }
        else if(result.length==0){
            req.flash('error', 'Failed to match OTP . Please try again.');
            res.redirect('/users/otps');
        }
        else
            {
                // alert('OTP VERIFY SUCCESSFULLY!!');
                res.redirect('/users/confirm');
            }
    
    });
    console.log(ans);
   
}
async function confirm(req,res) {
    res.render('confirm',{message:req.flash('error')});
}
module.exports={
    otp,
    otpcheck,
    otps,
    otpchecks,
    confirm
  }