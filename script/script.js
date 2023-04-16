import app from "./firebase-config.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const database = getDatabase(app);

const dbRef = ref(database);

const productRef = ref(database, "/products");
const cartRef = ref(database, "/cart");
const cartCountRef = ref(database, "/cartCount");

onValue(dbRef, (data) => {
  const ourData = data.val();
  const products = ourData.products;
  const cartCount = ourData.cartCount;

  displayItems(products);
  displayCartCount(cartCount);
  displayMobileCartCount(cartCount);
});

const displayItems = (products) => {

  const featuredDiv = document.querySelector(".featured");

  featuredDiv.innerHTML = "";

  for (let item in products) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("child");

    productDiv.innerHTML = `
      <div class="product-image">
        <a href="#"><img src=${products[item].image} alt=${products[item].description}/></a>
        <button id=${item}><img src="./assets/icons/cart.svg" alt="Shopping cart icon"/></button>
      </div>

      <div class="product-text">
        <a href="#">${products[item].name}</a>
        <p class="price">$${products[item].price.toFixed(2)}</p>
      </div>
    `;

    featuredDiv.append(productDiv);
  }

  addToCart();
};

const addToCart = () => {

  const addToCartButtons = document.querySelectorAll(".featured button");
  
  addToCartButtons.forEach((button) => {
  
    button.addEventListener("click", () => {

      get(cartCountRef).then((cartCount) => {
  
        const newCartCount = cartCount.val() + 1;
        set(cartCountRef, newCartCount);
      });

      get(productRef).then((product) => {

        const newCartItem = product.val()[button.id];
        const newCartItemRef = ref(database, `/cart/${button.id}`);
        const amountInCartRef = ref(database, `/cart/${button.id}/amountInCart`);

        get(newCartItemRef).then((newProduct) => {

          if (newProduct.val() === null) {

            set(newCartItemRef, newCartItem);
            set(amountInCartRef, 1);
            
          } else {

            const newAmount = newProduct.val().amountInCart + 1;
            set(amountInCartRef, newAmount);
          }
        });
      });
    });
  });
}


const cartModal = document.querySelector('.cart-modal');
const bagButton = document.querySelector('.bag-icon');

bagButton.addEventListener('click', ()=>{
  
  generateCartModal();

  modifyCart();
});

const generateCartModal = () => {

  cartModal.innerHTML = "";
  
  get(cartRef).then((cartItems)=>{

    const items = cartItems.val();
  
    for(let item in items){

      const productContainer = document.createElement('div');
      productContainer.classList.add("product-container");
      productContainer.classList.add(item);
  
      productContainer.innerHTML = `
      
        <div class="image-container">
            <img src=${items[item].image} />
        </div>

        <div class="product-details">
            <h2>${items[item].name}</h2>
            <p>Quantity: ${items[item].amountInCart}</p>
            <p>Price: $${(items[item].price * items[item].amountInCart).toFixed(2)}</p>
            <button>Remove</button>
        </div>

        <div class="amount-btns">
            <button>-</button>
            <label class="sr-only" for='quantity of ${items[item].name}' >Quantity of ${items[item].name}</label>
            <input type="number" id='quantity of ${items[item].name}' value="${items[item].amountInCart}"/>
            <button>+</button>
        </div>
      `;
        cartModal.append(productContainer);
    }

    let subtotal = 0;

    for (let item in items) {

      const price = items[item].amountInCart * items[item].price;
      subtotal += price;
    }

    const subtotalDiv = document.createElement("div");

    subtotalDiv.innerHTML = `
    <p>Subtotal</p>
    <p>$${subtotal.toFixed(2)}</p>
    `

    const checkoutDiv = document.createElement("div");

    checkoutDiv.innerHTML = `
      <a href="#">Checkout</a>
    `

    cartModal.append(subtotalDiv, checkoutDiv);
  });
}

const modifyCart = () => {

  cartModal.addEventListener("click", (e) => {
    
    get(cartRef).then((cartItems) => {
      
      const product = e.target.closest(".product-container");
      const productKey = product.classList[1];
      const cartItem = cartItems.val()[productKey];
      const amountInCartRef = ref(database, `/cart/${productKey}/amountInCart`);
      const itemRef = ref(database, `/cart/${productKey}`);

      if (e.target.innerHTML === "+") {
        
        const newAmount = cartItem.amountInCart + 1; 
        set(amountInCartRef, newAmount);

        get(cartCountRef).then((cartCount) => {

          const newCartCount = cartCount.val() + 1;
          set(cartCountRef, newCartCount);
        });
        
      } else if (e.target.innerHTML === "-") {

        const newAmount = cartItem.amountInCart - 1;
        set(amountInCartRef, newAmount);

        get(cartCountRef).then((cartCount) => {

          const newCartCount = cartCount.val() - 1;
          set(cartCountRef, newCartCount);
        });

          if(newAmount === 0 ){
            remove(itemRef);

          }

      } else if (e.target.innerHTML === "Remove") {

        get(cartCountRef).then((cartCount) => {

          const newCartCount = cartCount.val() - cartItems.val()[productKey].amountInCart;
          set(cartCountRef, newCartCount);
        });
        remove(itemRef);
      };

      generateCartModal();
    });
  });
}


const cartCountElement = document.querySelector(".cart-count");

const displayCartCount = (cartCount) => {

  if (cartCount > 0) {
    cartCountElement.innerHTML = `<p>${cartCount}</p>`;
  } else {
    cartCountElement.innerHTML = ``;
  }
};


const cartCountMobileElement = document.querySelector(".cart-count-mobile");

const displayMobileCartCount = (cartCount) => {

  if (cartCount > 0) {
    cartCountMobileElement.innerHTML = `<p>${cartCount}</p>`;
  } else {
    cartCountMobileElement.innerHTML = ``;
  }
};



// global

document.addEventListener("click", () => {
  const displayed = document.querySelectorAll(".display");

  for (let i = 0; i < displayed.length; i++) {
    displayed[i].classList.remove("display");
  }
});

// settings

const settings = document.querySelectorAll(".settings .expandable");

for (let i = 0; i < settings.length; i++) {
  settings[i].addEventListener("click", (e) => {
    e.stopPropagation();
    settings[i].lastElementChild.classList.toggle("display");
    settings[i].insertBefore(e.target, settings[i].firstElementChild);
  });
}

// hamburger menu

document
  .querySelector("header .mobile .hamburger-icon")
  .addEventListener("click", (e) => {
    e.stopPropagation();
    document
      .querySelector("header .mobile .hidden")
      .classList.toggle("display");
  });


// filters

if (document.querySelector(".filters")) {
  document.querySelector(".filters .mobile").addEventListener("click", (e) => {
    const options = document.querySelector(".filters .options");
    e.stopPropagation();
    options.classList.toggle("display");
    options.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// footer

const toggleFooterNav = (e) => {
  if (e.target.tagName === "BUTTON") {
    const ul = e.target.nextElementSibling;
    e.stopPropagation();
    ul.classList.toggle("display");
    ul.scrollIntoView({ behavior: "smooth" });
  }
};

let below1200 = false;

if (window.matchMedia("(max-width: 1200px)").matches) {
  const h6 = document.querySelectorAll("footer h6");

  for (let i = 0; i < h6.length; i++) {
    const button = document.createElement("button");
    button.innerHTML = h6[i].innerHTML;
    h6[i].replaceWith(button);
  }

  document.querySelector("footer").addEventListener("click", toggleFooterNav);

  below1200 = true;
}

window.addEventListener("resize", () => {
  if (window.innerWidth <= 1200 && !below1200) {
    const h6 = document.querySelectorAll("footer h6");

    for (let i = 0; i < h6.length; i++) {
      const button = document.createElement("button");
      button.innerHTML = h6[i].innerHTML;
      h6[i].replaceWith(button);
    }

    document.querySelector("footer").addEventListener("click", toggleFooterNav);

    below1200 = true;
  } else if (window.innerWidth > 1200 && below1200) {
    const buttons = document.querySelectorAll("footer button");

    for (let i = 0; i < buttons.length; i++) {
      const h6 = document.createElement("h6");
      h6.innerHTML = buttons[i].innerHTML;
      buttons[i].replaceWith(h6);
    }

    document
      .querySelector("footer")
      .removeEventListener("click", toggleFooterNav);

    below1200 = false;
  }
});

// contact
