

// const footerNav = document.querySelectorAll("footer nav");

// for (let i = 0; i < footerNav.length; i++) {
//     footerNav[i].classList.toggle("display");
// }

// const myAccount = document.querySelector(".account ul");

// console.log(myAccount);

// document.querySelector(".account").addEventListener("click", () => {
//     document.querySelector(".account ul").classList.toggle("display");
// });


// myAccount.classList.toggle("display");

const displayRow = (selector) => {
    document.querySelector(selector).classList.toggle("display-row");
}

const displayColumn = (selector) => {
    document.querySelector(selector).classList.toggle("display-column");
}

const scrollIntoView = (selector) => {
    document.querySelector(selector).scrollIntoView({behavior: "smooth"});
}

if (window.matchMedia("(max-width: 1200px)").matches) {

    document.querySelector(".useful-links").addEventListener("click", () => {
        displayRow(".useful-links ul");
    });

    document.querySelector(".account").addEventListener("click", () => {
        displayRow(".account ul");
    });

    document.querySelector(".services").addEventListener("click", () => {
        displayRow(".services ul");
    });

    document.querySelector(".questions").addEventListener("click", () => {
        displayColumn(".questions ul");
        scrollIntoView(".questions ul");
        displayColumn(".questions p");
    });
}

if (window.matchMedia("(max-width: 780px)").matches) {

    document.querySelector(".useful-links").addEventListener("click", () => {
        displayColumn(".useful-links ul");
        scrollIntoView(".useful-links ul");
    });

    document.querySelector(".account").addEventListener("click", () => {
        displayColumn(".account ul");
        scrollIntoView(".account ul");
    });

    document.querySelector(".services").addEventListener("click", () => {
        displayColumn(".services ul");
        scrollIntoView(".services ul");
    });
}

