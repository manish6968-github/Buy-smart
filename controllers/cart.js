const db = require('../connection/db');
async function showcart(req,res) {
    const sql=`select * from carts`;
    db.query(sql,(err,result)=>{
        if(err)
            throw err;
        else{
            products = result ;
            res.render('cart',{products});
        }
    })
}
async function removecart(req, res) {
    console.log('Request body:', req.body); // Log entire body
    const product_id = parseInt(req.body.Id); // Extract and convert
    console.log('Product ID:', product_id);

   db.query('DELETE FROM carts WHERE product_id = ?', [product_id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log('Query executed successfully', result);
            res.json({ success: true });
        }
    });
}

async function cart(req, res) {
    const data = req.body;
    console.log(data);
    
    try {
        const sql = `SELECT * FROM product WHERE title = ?`;
        console.log("SQL Query:", sql);
        
        db.query(sql, [data.title], (err, results) => {
            if (err) {
              console.error('Error fetching products:', err);
              return res.status(500).send('Internal Server Error');
            }
            console.log("Query Results:", results);
            // Handle results as needed
            const data=results[0];
            console.log(data);
            const values=[data.id,data.img,data.title,data.price];
            db.query(`select * from carts where product_id=${data.id}`,(err,resu)=>{
                if(err)
                    throw err;
                else if(resu.length!=0){
                          console.log('item present in database');  
                          res.json({ success: false });    
                }
                else{
                    const sql2=`insert into carts(product_id,img,title,price) values(?,?,?,?)`;
                   db.query(sql2,values,(erro,resu)=>{
                  if(err)
                    throw err;
                  else{
                   res.json({ success: true });
                    }
            })
                }
            })
            
            
           });
        
        
    } catch (error) {
      console.error('Error in cart function:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  module.exports={
    cart,
    removecart,
    showcart
  }