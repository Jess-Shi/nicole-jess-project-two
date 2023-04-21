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
const productRef = ref(database, "/products");
const cartRef = ref(database, "/cart");

onValue(cartRef, (data) => {

  const cart = data.val();
  
  updateCartCount(cart);
});


// Cart count

const cartCountElement = document.querySelector(".cart-count");

const updateCartCount = (cart) => {

  let totalCartCount = 0;

  for (let key in cart) {
    const amountInCart = cart[key].amountInCart;
    totalCartCount += amountInCart;
  };

  displayCartCount(totalCartCount);
};

const displayCartCount = (totalCartCount) => {

  if (totalCartCount > 99) {
    cartCountElement.innerHTML = `<p>99+</p>`;
  } else if (totalCartCount > 0) {
    cartCountElement.innerHTML = `<p>${totalCartCount}</p>`;
  } else {
    cartCountElement.innerHTML = ``;
  }
}


// Product section

const featuredDiv = document.querySelector(".featured");

const displayItems = () => {

  get(productRef).then((data) => {

    const products = data.val();
    featuredDiv.innerHTML = "";
  
    for (let key in products) {
      const productDiv = document.createElement("div");
      productDiv.classList.add("child");
  
      productDiv.innerHTML = `
        <div class="product-image">
          <a href="#"><img src=${products[key].image} alt="${products[key].description}"/></a>
          <button id=${key}><img src="./assets/icons/cart.svg" alt="Shopping cart icon"/></button>
        </div>
  
        <div class="product-text">
          <a href="#">${products[key].name}</a>
          <p class="price">$${products[key].price.toFixed(2)}</p>
        </div>
      `;
  
      featuredDiv.append(productDiv);
    }
    setupButtonClick();
  });
}

const setupButtonClick = () => {

  const addToCartButtons = document.querySelectorAll(".featured button");
  
  addToCartButtons.forEach((button) => {
  
    button.addEventListener("click", () => {

      addToCart(button);
    });
  });
}

const addToCart = (button) => {

  get(productRef).then((data) => {
  
    const newCartItem = data.val()[button.id];
    const newCartItemRef = ref(database, `/cart/${button.id}`);
    const amountInCartRef = ref(database, `/cart/${button.id}/amountInCart`);
  
    get(newCartItemRef).then((newItemAdded) => {
  
      if (!newItemAdded.exists()) {
  
        set(newCartItemRef, newCartItem);
        set(amountInCartRef, 1);
        
      } else {
  
        const newAmount = newItemAdded.val().amountInCart + 1;
        set(amountInCartRef, newAmount);
      }
    });
  });
}

if (document.querySelector(".featured")) {

  displayItems();
}

// Cart modal

const cartModal = document.querySelector(".cart-modal");
cartModal.classList.add("cart-modal-hidden");

const bagButton = document.querySelector(".bag-button");

bagButton.addEventListener("click", () => {
  
  generateCartModal();
  addBackgroundOverlay();
});

const addBackgroundOverlay = () => {
  
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.append(overlay);
  overlay.addEventListener("click", closeCart);
}

const generateCartModal = () => {

  cartModal.innerHTML = "";
  cartModal.classList.remove("cart-modal-hidden");

  get(cartRef).then((cartItems) => {

    const items = cartItems.val();
  
    displayCartItems(items);
    displaySubtotal(items);
    displayCloseButton();
    displayEmptyCart(items);
    
    cartModal.addEventListener("click", modifyCartOnClick);
    
    const cartInputs = document.querySelectorAll(".cart-modal input");
    cartInputs.forEach((input) => {
      input.addEventListener("change", modifyCartOnChange);
    });
  });
}

const displayCartItems = (items) => {

  for(let key in items) {

    const productContainer = document.createElement("div");
    productContainer.classList.add("product-container");
    productContainer.classList.add(key);

    const id = `quantity of ${items[key].name}`;
    const idWithoutSpaces = id.replaceAll(" ", "-");

    productContainer.innerHTML = `
    
      <div class="image-container">
          <img src=${items[key].image} alt="${items[key].description}"/>
      </div>

      <div class="product-details">
          <h2>${items[key].name}</h2>
          <p>Quantity: ${items[key].amountInCart}</p>
          <p>Price: $${(items[key].price * items[key].amountInCart).toFixed(2)}</p>
          <button>Remove</button>
      </div>

      <div class="amount-buttons">
          <button>-</button>
          <label class="sr-only" for=${idWithoutSpaces} >Quantity of ${items[key].name}</label>
          <input type="number" min="0" id=${idWithoutSpaces} value="${items[key].amountInCart}" pattern="[0-9]*"/>
          <button>+</button>
      </div>
    `;

    cartModal.append(productContainer);
  }
}

const displaySubtotal = (items) =>{

  let subtotal = 0;
    
  for (let key in items) {
    
    const price = items[key].amountInCart * items[key].price;
    subtotal += price;
  }
  
  const subtotalDiv = document.createElement("div");
  subtotalDiv.classList.add("subtotal");
  
  subtotalDiv.innerHTML = `
  <h2>Subtotal</h2>
  <h2>$${subtotal.toFixed(2)}</h2>
  `
  
  const checkoutDiv = document.createElement("div");
  checkoutDiv.classList.add("checkout");
  
  checkoutDiv.innerHTML = `
  <a href="#">Checkout</a>
  `
  cartModal.append(subtotalDiv, checkoutDiv);
} 

const displayCloseButton = () =>{
  const closeModal = document.createElement("button");
  closeModal.innerHTML = "x";
  closeModal.classList.add("close");
  closeModal.addEventListener("click", closeCart);
  cartModal.append(closeModal);
}

const displayEmptyCart = (items) =>{

  if (!items) {
    cartModal.classList.add("empty-cart");
    cartModal.innerHTML = `<p>Your cart is empty! <br/>Click here to start filling it up.</p>
    <a href="#products" class="shop">Shop Now</a>
    `;
    displayCloseButton();
    
    const shopNowButton = document.querySelector(".shop");
    shopNowButton.addEventListener("click", closeCart);
    
  } else {
    cartModal.classList.remove("empty-cart");
  }
}

const modifyCartOnClick = (e) => {

  get(cartRef).then((cartItems) => {

    if (e.target.innerHTML === "+" || e.target.innerHTML === "-" || e.target.innerHTML === "Remove") {

      const product = e.target.closest(".product-container");
      const productKey = product.classList[1];
      const cartItem = cartItems.val()[productKey];
      const amountInCartRef = ref(database, `/cart/${productKey}/amountInCart`);
      const itemRef = ref(database, `/cart/${productKey}`);
  
      if (e.target.innerHTML === "+") {
        
        const newAmount = cartItem.amountInCart + 1; 
        set(amountInCartRef, newAmount);
        generateCartModal();
        
      } else if (e.target.innerHTML === "-") {
  
        const newAmount = cartItem.amountInCart - 1;
        set(amountInCartRef, newAmount);
  
        if(newAmount === 0 ){
          remove(itemRef);
        }

        generateCartModal();
  
      } else if (e.target.innerHTML === "Remove") {
  
        remove(itemRef);
        generateCartModal();
      };
    }
  });
}

const modifyCartOnChange = (e) => {

  const input = e.target;
  const product = input.closest(".product-container");
  const productKey = product.classList[1];
  const amountInCartRef = ref(database, `/cart/${productKey}/amountInCart`);
  const itemRef = ref(database, `/cart/${productKey}`);

  if (!parseInt(input.value) && parseInt(input.value) !== 0) {
    input.value = 1;

  } else if (input.value < 0 || input.value === "") {
    input.value = 0;
  }

  const newAmount = parseInt(input.value);
  set(amountInCartRef, newAmount);

  if(newAmount === 0 ){
    remove(itemRef);
  }

  generateCartModal();
}

const closeCart = () => {
  
  const overlay = document.querySelector(".overlay");
  document.body.removeChild(overlay);
  cartModal.classList.add("cart-modal-hidden");
}





// Project 1 content below

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
  .querySelector("header .hamburger-button")
  .addEventListener("click", (e) => {
    e.stopPropagation();
    document
      .querySelector("header > .mobile")
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
