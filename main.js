

function updateLocalStorage(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}

async function getProducts(){
    try {
        const data = await fetch(`https://ecommercebackend.fundamentos-29.repl.co/`);
        const res = await data.json();
        updateLocalStorage("products", res);
        return res;
    
    } catch (error) {
        console.error(error)
    }
}

function printProducts(db){
    
    let html="";

    db.products.forEach(({category,name,image,price, quantity,id})=> {
        html += 
            `<div class="product">
                <div class="product_img">
                    <img src=${image}>
                </div>
                <div class="product_info">
                 <h4>${name}</h4>
                <p><span>USD ${price},00.</span></p>
                <p><small>${category}  |  Stock: ${quantity}</small></p>
                <i class='bx bx-plus' id= ${id}></i>
                <i class='bx bxs-search-alt-2'id=${id}></i>
                </div>
            </section>
        </div>`
   });
   

document.querySelector(".products").innerHTML = html;
};

function handleShowCart() {
    const iconCartHtml = document.querySelector("#iconCart");
    const cartHtml = document.querySelector(".cart");

    iconCartHtml.addEventListener("click", function (){
        cartHtml.classList.toggle("active");
    })
}

function printProductsCart(db) { 
    let html = "";
    Object.values(db.cart).forEach((product) => {
        html += 
            `<div class="cartItem">
            <div class="cartItem_img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cartItem_info">
                <h4>${product.name.split(" ").splice(0,3).join(" ")}</h4>
                <p>
                <span><i class='bx bx-money'></i>:  ${product.price},00.</span>
                </p>
               <p>Total:USD ${product.price * product.amount}</p>

                 <div class="cartItem_options">
                    <i class='bx bx-plus-circle'id="${product.id}"></i> 
                    <i class='bx bx-minus-circle' id="${product.id}"></i> 
                    <i class='bx bxs-trash' id="${product.id}"></i>
                   </div>  
            </div> 
              
            </div>
            `;
    });
    document.querySelector(".cart_product").innerHTML = html;
};

function addCartFromProducts (db){
    const productsHtml = document.querySelector(".products");
    
    productsHtml.addEventListener("click", function(e){
        if(e.target.classList.contains("bx-plus")){
            printTotal(db)
             const id = Number(e.target.id);
             const productFind = db.products.find((product) => {
                 return product.id === id;
            });
            
            if(db.cart[id]){
                if(db.cart[id].amount ===db.cart[id].quantity)
                  return  Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'OUT OF STOCK',
                        footer: '<a href="">Keep buying</a>'
                      });
                      
                      db.cart[id].amount +=1;   
            }else {
                db.cart[id]=structuredClone(productFind);
                db.cart[id].amount = 1;
            }
            updateLocalStorage("cart", db.cart);
            printProductsCart(db);
        }
    })
    
}



function handleCart(db){
    const cartProductsHtml = document.querySelector(".cart_product");

    cartProductsHtml.addEventListener("click", function(e){
     
       
       
        if(e.target.classList.contains("bx-plus-circle")){
        const id = Number(e.target.id);
        if(db.cart[id].amount ===db.cart[id].quantity)
                   return Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'OUT OF STOCK',
                        footer: '<a href="">Keep buying</a>'
                      });
        db.cart[id].amount++;
       }
       if(e.target.classList.contains("bx-minus-circle")){
        const id = Number(e.target.id);
        if(db.cart[id].amount === 1){
           return Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: `#FF2E63`,
                cancelButtonColor: '#08D9D6',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                    delete db.cart[id];
                  Swal.fire(
                    'Deleted!'
                  )
                }  
              })
        }
    
        db.cart[id].amount--;
       }
       if(e.target.classList.contains("bxs-trash")){
        const id = Number(e.target.id);
        delete db.cart[id];
       }
       updateLocalStorage("cart",db.cart)
      printProductsCart(db);
      printTotal(db);
    })
}

function printTotal(db){
    const cartTotalInfoHtml = document.querySelector(".cart_total--info");
    let amountProducts = 0;
    let priceTotal = 0;
    
    Object.values(db.cart).forEach((item)=>{
        amountProducts+=item.amount;
        priceTotal += item.amount * item.price;
    });

    let html = `
    <p>
        <i class='bx bxs-t-shirt'></i>: ${amountProducts} units.
    </p>
    <p>
         <b>TOTAL: USD ${priceTotal} .00 </b>
    </p>`;

    cartTotalInfoHtml.innerHTML = html;

}

function introRandomImg(db) {
    const introHtml = document.querySelector(".intro");
    html ="";
    
    let numRandom = Math.floor(Math.random() *18);  
    Object.values(db.products).forEach((product)=>{
        let uniqueProduct = product.id
        if(numRandom === uniqueProduct){
            html += `
            
        <div class="intro_img">
        <img src="${product.image}" alt="">
        <div class="intro_img-backgr"></div>
        </div>
        
        <div class="intro_info">
        <h3 class="intro_title">${product.name}.</h3>
            <div class="intro_ftr">
            <p><span>USD${product.price},00. </span></p>
            <button class="btn_intro" id=${product.id}>Add to cart</button>
            </div>
            <p><small>-Popsicle Oficial Store &copy-</small></p>
        </div>
            `
        }
       introHtml.innerHTML = html;
    })
}

function printProdModalInfo(db) {
    const productsHtml = document.querySelector(".products");
    const modalHtml = document.querySelector(".modal_container")
    productsHtml.addEventListener("click",(e) =>{
        let html="";
        if(e.target.classList.contains("bxs-search-alt-2")){
            modalHtml.showModal()
            const id= Number(e.target.id);
            db.products.forEach((prod)=>{
                 if(prod.id === id){
                    html+=`  <div class="close"> 
                    <i class='bx bx-message-square-x'></i>
                </div>
                <div class="modal_description">
                    <div class="modal_img">
                        <img src="${prod.image}" alt="${prod.name}">
                    </div>
                    <div class="modal_info">
                        <h3> ${prod.name} </h3>
                        <p><span> USD ${prod.price},00. </span></p>
                        <p>Category: ${prod.category} </p>
                    </div>
                 </div>`
                 }}
                 )}
    
        modalHtml.innerHTML= html;
    });
}

function closeModal(){
    let modalHtml = document.querySelector(".modal_container");
    modalHtml.addEventListener("click",(e)=> {
        
        if (e.target.classList.contains("bx-message-square-x")){
            modalHtml.close();
            };   
    });
}



async function main(){
    
    const db = {
        products: 
        JSON.parse(localStorage.getItem("products")) || 
        (await getProducts()),
        
        cart:
        JSON.parse(localStorage.getItem("cart")) || {},
    };
    
    printProducts(db);
    handleShowCart();
    printProductsCart(db);
    addCartFromProducts(db);
    handleCart(db);
    printTotal(db);
    introRandomImg(db);
    printProdModalInfo(db);
    closeModal();
    
}

main();

