import app from "./firebase-config.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const database = getDatabase(app);
const dbRef = ref(database);

const productRef = ref(database, "/products");
const cartRef = ref(database, "/cart");
const cartCountRef = ref(database, "/cartCount");

onValue(dbRef, (data) => {
  const ourData = data.val();
  const products = ourData.products;

  displayItems(products);
});

const displayItems = (products) => {
  const featuredDiv = document.querySelector(".featured");
  featuredDiv.innerHTML = "";

  for (let item in products) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("child");

    productDiv.innerHTML = `
      <div class="product-image">
        <a href="#"><img src=${products[item].image} alt=${
      products[item].description
    }></a>
        <button id=${item}><img src="./assets/icons/cart.svg" alt="Shopping cart icon"></button>
      </div>

      <div class="product-text">
        <a href="#">${products[item].name}</a>
        <p class="price">$${products[item].price.toFixed(2)}</p>
      </div>
    `;

    featuredDiv.append(productDiv);
  }
};

const cartCountElement = document.querySelector(".cart-count");

const featuredProducts = document.querySelector(".featured");

featuredProducts.addEventListener("click", (e) => {

  if (e.target.parentElement.tagName === "BUTTON") {

    get(cartCountRef).then((cartCount) => {

      const number = parseInt(cartCount.val());

      const newCartCount = number + 1;

      console.log(newCartCount);
      set(cartCountRef, newCartCount);
      cartCountElement.innerHTML = `<p>${newCartCount}</p>`;
    });
  }
});



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
