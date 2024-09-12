const db = require('../connection/db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const Captcha= require('node-captcha-generator');
const jwt=require('jsonwebtoken');
// require('dotenv').config();
// const {v4: uuidv4} = require('uuid')
// const {setUser} = require('../service/auth');
const session=require('express-session');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manishpardhan851@gmail.com',
    pass: 'tsdr crra vokq awjn'
  }
});


  
async function signup(req, res) {
    let c=new Captcha({
        length: 5,
        size :{
            width : 150,
            height : 100
        }
    })
    await c.toBase64(async(err,base64)=>{
        if(err)
            console.log('captcha failed!!');
        else{
            console.log(c.value,'====');
            db.query(`INSERT INTO captchas (captcha) VALUES ('${c.value}')`, (err, resu) => {
                if (err) {
                    throw err;
                } else {
                    console.log('Inserted captcha value successfully');
                    // Further logic here
                }
            });
            res.render('signup',{imgPath:base64,message: req.flash('error')}); 
        }      
    })
   
}

async function signupdata(req, res) {
    const data = req.body;
    console.log('captcha: ',data.captcha);
    db.query(`select * from captchas where captcha ='${data.captcha}'`,async (err,resu)=>{
        if(err)
           {
            throw err;
            return;
           }
        else if(resu.length==0)
        {
            console.log('not found captcha');
             db.query(`Delete  from captcha`,(err,resi)=>{
                if(err)
                    throw err;
                else
                {
                    console.log('Delete captcha!!');
                }
             })
            req.flash('error','Invalid captcha');
            res.redirect('/users/signup');
            return;
        }
        else{
            if(data.username==''||data.email==''||data.password=='')
                {
                    req.flash('error','Please enter all details!!')
                    res.redirect('/users/signup');
                }
                if(data.password.length<4)
                {
                    req.flash('error','Please enter atleast 4 char password!!');
                    res.redirect('/users/signup');
                } 
                const email = data.email;
                  console.log(data);
                try {
                   
                    const hashpass = await bcrypt.hash(data.password, 10);
                //   async  function genotp(){
                //      const grnotp=Math.floor(Math.random() * 90000) + 10000;
                //       const chkq=`select * from otps where otp=?`;
                //       db.query(chkq,grnotp,(err,res)=>{
                //           if(err)
                //           {
                //             console.log('otp matching error!!');
                //             throw err;
                //           }
                //           else if(res.length!==0)
                //           {
                //              console.log('otp present');
                //              genotp();
                //           }
                //           else{
                //             console.log('in fun otp',grnotp);
                //           return grnotp;
                //           }
                //       });
                //     }
                    const gotp = Math.floor(Math.random() * 90000) + 10000;
                    transporter.sendMail({
                        from: 'manishpardhan851@gmail.com',
                        to: email,
                        subject: "One Time Password (OTP)",
                        text: `Your OTP is: ${gotp}`,
                    }, (mailErr, info) => {
                        if (mailErr) {
                            console.log('Error sending email', mailErr);
                            req.flash('error', 'Failed to send OTP email. Please try again.');
                            return res.redirect('/users/signup');
                        }
                        console.log('Email sent: ' + info.response);
                        req.flash('success', 'Signup successful! Please check your email for OTP.');
                        res.redirect('/users/otp');
                        console.log('fun return otp',gotp);
                        const sql = `INSERT INTO users(name, email, password, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`;
                        const ca = new Date();
                        const ua = new Date();
                        const st = 'inactive';
                        const values = [data.username, data.email, hashpass, st, ca, ua];
                        console.log(values, 'stored otp',gotp);
                        const que = `SELECT * FROM users WHERE email=?`;
                        db.query(que, data.email, (err, resu) => {
                            if (err) {
                                console.log('Error accessing database:', err);
                                console.log('Error database!!');
                            } else if (resu.length !== 0) {
                                req.flash('error', 'Signup failed. Email already exists.');
                                console.log('Same email!!');
                                 return res.redirect('/users/signup');
                            } else {
                                console.log('Unique email!!');
                                db.query(sql, values,  (err, result) => {
                                    if (err) {
                                        console.log('Query error', err);
                                        req.flash('error', 'Signup failed. Please try again.');
                                        return res.redirect('/users/signup');
                                        // throw err; // Handle error appropriately
                                    } else {
                                        console.log('User inserted successfully');
                                         
                                        const sql2 = `INSERT INTO otps(user_id, otp,created_at, updated_at) VALUES (?, ?, ?,?)`;
                                        const otpValues = [result.insertId, gotp, ca,ua]; // Assuming 'insertId' gives the last inserted id
                                       
                                        db.query(sql2, otpValues, async (otpErr, otpResult) => {
                                            if (otpErr) {
                                                console.log('OTP insertion error', otpErr);
                                                // throw otpErr; // Handle error appropriately
                                                req.flash('error', 'Failed to generate OTP. Please try again.');
                                                return res.redirect('/users/signup');
                                            } else {
                                                console.log('OTP inserted successfully');
                                            
                                                console.log(otpResult);
                                                 // Log the result of OTP insertion if needed
                                               
                                            }
                                          
                                        });
                                       
                                    }
                                });
                            }
                        });
                    });

                    
                   
                   
                    // res.redirect('/users/otp');
                } catch (err) {
                    console.log('Error in signupdata', err);
                    req.flash('error', 'Signup failed. Please try again.');
                    res.redirect('/users/signup');// Handle error response to the client
                }
        }
       
    })
    
}

async function login(req, res) {
    req.session.login=false;
    res.render('login',{ message: req.flash('error')});
}

async function logincheck(req, res) {
    const data = req.body;

    if (data.email == '' || data.password == '') {
        req.flash('error', 'Please enter all details!!');
        return res.redirect('/users/login'); // Return to avoid further execution
    }

    if (data.password.length < 4) {
        req.flash('error', 'Please enter at least 4 character password!!');
        return res.redirect('/users/login'); // Return to avoid further execution
    }
   
    
    const sql = `select * from users where email=?`;
    db.query(sql, data.email, async (err, dbres) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Database error');
            return res.redirect('/users/login'); // Return to avoid further execution
        } else if (dbres.length === 0) {
            req.flash('error', 'User does not exist');
            return res.redirect('/users/login'); // Return to avoid further execution
        } else {
            const user = dbres[0];
            try {
                console.log('data password: ',data.password,'user password ',user.password);
                const pass = await bcrypt.compare(data.password, user.password);

                if (pass) {
                    req.session.email = user.email;
                    req.session.login = true;
                    let token = jwt.sign(user, "shhhhh", { expiresIn: '1h' });
                    console.log('token', token);
                    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
                    user.status = 'active';
                    console.log("password is", pass);
                    return res.redirect('/users/home'); // Return to avoid further execution
                } else {
                    req.flash('error', 'Incorrect password');
                    return res.redirect('/users/login'); // Return to avoid further execution
                }

            } catch (error) {
                console.log(error);
                req.flash('error', 'Error comparing passwords');
                return res.redirect('/users/login'); // Return to avoid further execution
            }
        }
    });
}


async function profile(req,res){
    db.query(`select name  from users where email='${req.session.email}'`,(err,resu)=>{
        if(err)
            throw err;
        else if(resu.length==0)
            res.render('web',{name:""});
        else
          {
              const data=resu[0];
            console.log(data);
             
             res.render('web',{name:data.name});
          }
    })
    // res.render('web');
   
}
async function address(req, res) {
    const data = req.body;
    const ca = new Date();
    const ua = new Date();
      const sql=`select * from users where email=?`;
      db.query(sql,data.email,(err,resu)=>{
        if(err)
        {
            console.log(err);
            throw err;
        }
        else if(resu.length==0)
          {
            console.log("user not registered!!")
          }
         else{
            const user_id=resu[0].id;
            const sql=`insert into user_details(user_id,name,email,address,phone_number,created_at,updated_at) values(?,?,?,?,?,?,?)`;
            const values=[user_id,data.name,data.email,data.address,data.contact,ca,ua];
            db.query(sql,values,(err,result)=>{
                if(err)
                {
                    console.log('inserting database error!!');
                    res.redirect('/users/home')
                    throw err;
                }
                else{
                    console.log(result);
                    console.log('data inserted successfully!!');
                    res.redirect('/users/home')
                }
            });
         }
      });
}
// async function products(req, res) {
//     const data = req.body;
//     console.log(data);
    
//     const sqlSelectUser = `SELECT * FROM users WHERE email = ?`;
//     db.query(sqlSelectUser, [data.email], (err, userResult) => {
//         if (err) {
//             console.log(err);
//             return res.redirect('/users/home');
//         }
        
//         // if (userResult.length === 0) {
//         //     console.log("User not registered!");
//         //     return res.redirect('/users/home');
//         // }
//         const sqlInsertProduct = `INSERT INTO products ( img, title, price) VALUES ( ?, ?, ?)`;
//         const values = [ data.imgSrc, data.title, data.price];
        
//         db.query(sqlInsertProduct, values, (err, insertResult) => {
//             if (err) {
//                 console.log('Inserting database error!!');
//                 return res.redirect('/users/home');
//             }
            
//             console.log(insertResult);
//             console.log('Data inserted successfully!!');
//             res.redirect('/users/cart');
//         });
//     });
// }
async function logout(req, res) {
    try {
        // Clear the cookie that stores the JWT token
        res.clearCookie('token');

        // If using sessions with express-session, destroy the session
        req.session.destroy(err => {
            if (err) {
                console.log('Error destroying session:', err);
            } else {
                console.log('Session destroyed successfully.');
            }
        });

        // Redirect to the login page
        res.redirect('/users/login');
    } catch (error) {
        console.error('Error logging out:', error);
        res.redirect('/users/home'); // Redirect to home or another appropriate page on error
    }
}
async function search(req,res) {
    const data=req.body.search;
    db.query(`select * from product where price<'${data}'`,(err,resu)=>{
        if(err)
        {
            throw err;
        }
        else if(resu.length==0)
        {
            res.render('empty');
        }
        else{
            const data=resu;
            console.log(data); 
            res.render('search',{products:data});
        }

    })
    
}

async function password(req, res) {
    req.session.login=false;
    res.render('password',{ message: req.flash('error')});
}
async function chkpassword(req, res) {
    // console.log('in forgot');
      
    const data = req.body;
    if(data.password!=data.cfpassword)
    {
        req.flash('error','Re-Enter password not match!!');
       return res.redirect('/users/confirm');
    }
    
    if(data.length<4)
        {
            req.flash('error','Please enter atleast 4 char password!!');
           return res.redirect('/users/confirm');
        } 
    const hashpass = await bcrypt.hash(data.password, 10);
    console.log('bcrypt chkpassword',hashpass);
    const sql = `UPDATE users SET password='${hashpass}' WHERE email='${data.email}'`;
    
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
           return res.redirect('/users/login');
        }
    });
}
async function chkemail(req, res) {
    const data = req.body.email;
    const sql = `SELECT * FROM users WHERE email=?`;
    
    db.query(sql, [data], (err, resu) => {
        if (err) {
            console.log('Error querying database:', err);
            throw err; // Handle error appropriately
        } else if (resu.length !== 0) {
            const ca = new Date();
            const ua = new Date();
            const otp = Math.floor(Math.random() * 900000) + 100000; // Generate a 6-digit OTP

            transporter.sendMail({
                from: 'manishpardhan851@gmail.com',
                to: data, // Assuming 'data' contains the recipient's email address
                subject: "One Time Password (OTP)",
                text: `Your OTP is: ${otp}`,
            }, (mailErr, info) => {
                if (mailErr) {
                    console.log('Error sending email:', mailErr);
                    req.flash('error', 'Failed to send OTP email. Please try again.');
                    return res.redirect('/users/login');
                }
                console.log('Email sent:', info.response);

                const sqlInsertOTP = `INSERT INTO otps(user_id, otp, created_at, updated_at) VALUES (?, ?, ?, ?)`;
                const otpValues = [resu[0].id, otp, ca, ua]; // Assuming 'id' is the primary key of users table

                db.query(sqlInsertOTP, otpValues, async (otpErr, otpResult) => {
                    if (otpErr) {
                        console.log('Error inserting OTP:', otpErr);
                        req.flash('error', 'Failed to generate OTP. Please try again.');
                        return res.redirect('/users/password');
                    } else {
                        console.log('OTP inserted successfully:', otpResult);
                        // Log the result of OTP insertion if needed
                        return res.redirect('/users/chkotp');
                    }
                });
            });
        } else {
            console.log('Email is unique.');
            // Handle case where email does not exist in the database
            return res.redirect('/users/password');
        }
    });
}


module.exports = {
    signup,
    signupdata,
    login,
    logincheck,
    profile,
    address,
    logout,
    search,
    password,
    chkpassword,
    chkemail
};
