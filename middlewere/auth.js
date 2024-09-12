const {getUser}=require("../service/auth");
const cookies = require("cookies");


const jwt = require('jsonwebtoken');

async function checkcookie(req, res, next) {
    try {
        
        const token = req.cookies.token; // Assuming token is stored in cookies
        
        if (!token) {
            return res.redirect('/users/login');
        }
        
        const user = jwt.verify(token, 'shhhhh');
        req.user = user; // Optionally store user information in request object for later use
        next();
    } catch (err) {
        console.log('Please login!!', err);
        return res.redirect('/users/login'); // Redirect to login page on token verification failure
    }
}
async function checkcookiejs(req, res, next) {
    try {
        const token = req.cookies.token; // Assuming token is stored in cookies
        console.log('in middleware');
        
        if (!token) {
            console.log('token not generate',token);
            return  res.status(401).json({ error: 'Unauthorized' });
        }
        console.log('token  generate',token);
        const user = jwt.verify(token, 'shhhhh');
        req.user = user; // Optionally store user information in request object for later use
        console.log('user: ',user);
        
        next();
    } catch (err) {
        console.log('Please login!!', err);
        return res.status(401).json({ error: 'Unauthorized' }); // Redirect to login page on token verification failure
    }
}
function login(req, res, next) {
    if (req.session && req.session.login) {
        console.log('in if',req.session.login);
        
        next();
    } 
        else {
            console.log('in else',req.session.login);
            res.status(401).json({ error: 'Unauthorized' });
              
        }
    
}
async function check(req,res,next) {
      const dat=req.body;
      if(dat)
        console.log('not work');
    else
    next();
        
}
module.exports={
    login,
    checkcookie,
    checkcookiejs
};