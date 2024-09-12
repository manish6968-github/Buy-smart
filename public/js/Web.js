

let card = document.querySelector(".trend");
let card2 = document.getElementById("trendSec");
let about = document.querySelector(".about");
let contact = document.querySelector(".contact");
let cart=document.getElementById('cart');
let addcart=document.getElementById('addcart')
// let scart=document.getElementById('scart');
let blog = document.querySelector(".trends");
let mainPage = document.querySelector(".main");
let payment=document.getElementById("buy");
// function showcart(){
//     scart.style.display="block";
// }

function homes(){
    mainPage.style.display="flex";
    card.style.display="block";
    card2.style.display="block";
    blog.style.display="block";
   about.style.display="none"
   cart.style.display="none";
//    scart.style.display="none";
   document.querySelectorAll('.card > div').forEach(card => {
    card.style.display = 'block';
});
    
document.getElementById("blog").style.color="black";
document.getElementById("home").style.color="rgb(2, 173, 173)";
document.getElementById("shop").style.color="black";
document.getElementById("contact").style.color="black";
document.getElementById("about").style.color="black"


}
function shops(){
mainPage.style.display="none";
blog.style.display="none";
about.style.display="none"
card.style.display="block";
card2.style.display="block";
cart.style.display="none";
// scart.style.display="none";
document.querySelectorAll('.card > div').forEach(card => {
    card.style.display = 'block';
});
document.getElementById("blog").style.color="black";
document.getElementById("home").style.color="black";
document.getElementById("shop").style.color="rgb(2, 173, 173)";
document.getElementById("contact").style.color="black";
document.getElementById("about").style.color="black"


}

function blogs(){
    mainPage.style.display="none";
    card.style.display="none";
    card2.style.display="none";
   blog.style.display="block";
   about.style.display="none"
   cart.style.display="none"; 
//    scart.style.display="none";
document.getElementById("blog").style.color="rgb(2, 173, 173)";
document.getElementById("home").style.color="black";
document.getElementById("shop").style.color="black";
document.getElementById("contact").style.color="black";
document.getElementById("about").style.color="black"

 



}

function abouts(){
    mainPage.style.display="none";
    card.style.display="none";
    card2.style.display="none";
   blog.style.display="none";
   about.style.display="block"
   cart.style.display="none";
//    scart.style.display="none";
document.getElementById("blog").style.color="black";
document.getElementById("home").style.color="black";
document.getElementById("shop").style.color="black";
document.getElementById("contact").style.color="black";
document.getElementById("about").style.color="rgb(2, 173, 173)"

}

function contacts(){
    mainPage.style.display="none";
    card.style.display="none";
    card2.style.display="none";
   blog.style.display="none";
   about.style.display="none";
   contact.style.display="block"
   cart.style.display="none";
//    scart.style.display="none";
document.getElementById("blog").style.color="black";
document.getElementById("home").style.color="black";
document.getElementById("shop").style.color="black";
document.getElementById("contact").style.color="black";
document.getElementById("about").style.color="black"
document.getElementById("contact").style.color="rgb(2, 173, 173)"

}

// cart

function show(card){
    
    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('.crdText h2').textContent;
    const price = card.querySelectorAll('.crdText h2')[2].textContent;
    //  addTocart(imgSrc,title,price);
    let newImg = document.getElementById("newImg");
    console.log(imgSrc);
    newImg.src=imgSrc;
    let titles=document.getElementById("title");
    titles.innerText=title;
    let pricep=document.getElementById("price");
    pricep.innerText=price;

    document.querySelectorAll('.card > div').forEach(card => {
        card.style.display = 'none';
    });

       mainPage.style.display="none";
    card.style.display="none";
    card2.style.display="none";
   blog.style.display="none";
   about.style.display="none";
   contact.style.display="none"
//    scart.style.display="none";
    document.querySelector(".cart").style.display="flex"
    console.log(addcart);
    


    addcart.addEventListener('click',()=>{

        const data = {
            imgsrc: imgSrc,
            title: title,
            price: price
        };
        console.log(data);
        fetch('/users/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imgSrc, title, price })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error('Unauthorized'); // Trigger catch block for redirect
            } else {
                throw new Error('Failed to add item to cart');
            }
        })
        .then(data => {
            if (data.success) {
                alert('Item added successfully!!');
            } else {
                alert('Item already present in cart!!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle unauthorized error to redirect
            if (error.message === 'Unauthorized') {
                window.location.href = '/users/login'; // Redirect to login page
            }
        });
    });
    
    payment.addEventListener('click', async () => {
        const stripe = Stripe('pk_test_51PsyvZHv1ddk6KtlvOgYYNmI8mIGQIkBy9bhnKktJEO31vxAwJfCby0clsozgAVgGbY7FgPFWZBMXTS49Ljr32pe008baaeVDZ');
    
        try {
            const response = await fetch('/users/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, price, imgSrc })
            });
             console.log('upper response');
             
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
    
            const rest = await response.json();
    
            const result = await stripe.redirectToCheckout({
                sessionId: rest.sessionId
            });
    
            if (result.error) {
                console.log('in js error');
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error:', error);
    
            if (error.message === 'Failed to fetch data') {
                // Handle fetch error
            } else if (error.message === 'Unauthorized') {
                console.log('Unauthorized access detected, redirecting to login page.');
                window.location.href = '/users/login'; // Redirect to login page
            }
            else {
                // Handle other errors
                console.error('Other error:', error);
            }
        }
    });  
}

// payment.addEventListener('click', async () => {
    //     const stripe = Stripe('pk_test_51PsyvZHv1ddk6KtlvOgYYNmI8mIGQIkBy9bhnKktJEO31vxAwJfCby0clsozgAVgGbY7FgPFWZBMXTS49Ljr32pe008baaeVDZ');
    
    //      try{
    //         const response = await fetch('/users/checkout', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ title, price, imgSrc })
    //         });
    
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
    
    //         const rest = await response.json();
    //         console.log(rest);
            
    //         const result = stripe.redirectToCheckout({
    //             sessionId: rest.sessionId
    //         });
    
    //         if (response.status === 401) {
    //             throw new Error('Unauthorized'); // Trigger catch block for redirect
    //         } else {
    //             throw new Error('Failed to add item to cart');
    //         }
    //     }
    //     catch(error)
    //     {
    //         console.log('error c',err); 
    //         if (error.message === 'Failed to fetch data') {
    //             // Handle fetch error
    //         } else if (error.message === 'Unauthorized') {
    //             window.location.href = '/users/login'; // Redirect to login page
    //         }
    //     }
    // });







function backTohome(){
    alert("Back To HomePage");
    location.reload()
}
