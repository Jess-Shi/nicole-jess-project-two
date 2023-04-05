

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

const display = (selector) => {
    document.querySelector(selector).classList.toggle("display");
}

const scrollIntoView = (selector) => {
    document.querySelector(selector).scrollIntoView({behavior: "smooth"});
}

document.querySelector(".useful-links").addEventListener("click", () => {
    display(".useful-links ul");
    scrollIntoView(".useful-links ul");
});

document.querySelector(".account").addEventListener("click", () => {
    display(".account ul");
    scrollIntoView(".account ul");
});

document.querySelector(".services").addEventListener("click", () => {
    display(".services ul");
    scrollIntoView(".services ul");
});

document.querySelector(".questions").addEventListener("click", () => {
    display(".questions ul");
    scrollIntoView(".questions ul");
    display(".questions p");
});

