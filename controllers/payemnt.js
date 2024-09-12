const stripe = require('stripe')("sk_test_51PsyvZHv1ddk6Ktl60ZpbnFdwZ5JdcxuFWIuhMsuqLzDrpXByoJgbKbGD5irONETkVep4po0HBwNcR8h4C89AmEw00X7lDp295");
const db = require('../connection/db');
require("dotenv").config();
async function checkout(req, res) {
    const data = req.body;
    let price = parseInt(data.price);
    db.query('SELECT * FROM product WHERE title = ?', [data.title.trim()], async (err, resu) => {
        if (err) {
            throw err;  // Handle error appropriately, e.g., logging and responding
        } else if (resu.length == 0) {
            console.log("Payment not found for title:", data.title);
        } else {
            const user = resu[0];
            // console.log('Payment user:', user);
            try {
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: user.title,
                                    images: [data.imgSrc]
                                },
                                unit_amount: user.price * 100, // Ensure `price` is multiplied by 100 for cents
                            },
                            quantity: 1
                        }
                    ],
                    mode: 'payment',
                    success_url: 'http://localhost:8000/users/complete',
                    cancel_url: 'http://localhost:8000/users/cancel'
                });

                //  console.log("Session created:", session);
                if(session)
                    console.log("Session is created!!");
                else
                console.log("session not created!!");
                
                    
                // Respond with session ID to the client
                res.json({ sessionId: session.id });
            } catch (error) {
                console.error('Error creating checkout session:', error);
                res.status(500).json({ error: 'Failed to initiate checkout session' });
            }
            
            // Further processing with `user` data can go here
        }
    });
}

async function complete(req,res) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sendSMS = async (body)=>{
    let msgOptions={
        from: process.env.TWILIO_FORM_NUMBER,
        to : process.env.TO_NUMBER,
        body,
    };
    try{
        const message= await client.messages.create(msgOptions);
        console.log(message);  
    }
    catch(err)
    {
        console.log(err);    
    }
};
 sendSMS("Your order  was successfully purchased. Thank you for shopping with us!")
    res.render('complete');
}
module.exports={
    checkout,
    complete
  }