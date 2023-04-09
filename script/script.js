
document.addEventListener("click", () => {

    const displayed = document.querySelectorAll(".display");

    for (let i = 0; i < displayed.length; i++) {
        
        displayed[i].classList.remove("display");
    }
});

//settings

const settings = document.querySelectorAll(".settings .expandable");

for (let i = 0; i < settings.length; i++) {

    settings[i].addEventListener("click", (e) => {

        e.stopPropagation();
        settings[i].lastElementChild.classList.toggle("display");
        settings[i].insertBefore(e.target, settings[i].firstElementChild);
    });
}


//filters

document.querySelector(".filters .mobile").addEventListener("click", (e) => {

    e.stopPropagation();
    document.querySelector(".filters .options").classList.toggle("display");
});

//footer

window.addEventListener("resize", () => {

    if (window.matchMedia("(max-width: 1200px)").matches) {

        const footerNav = document.querySelectorAll("h6");

        for (let i = 0; i < footerNav.length; i++) {

            const button = document.createElement("button");
            footerNav[i].parentElement.insertBefore(button, footerNav[i]);
            button.appendChild(footerNav[i]);
        }
    }
})



// const footerNav = document.querySelectorAll(".useful-links, .account, .services, .questions");

// for (let i = 0; i < footerNav.length; i++) {
    
//     footerNav[i].addEventListener("click", () => {

//         const menu = document.querySelector(`.${footerNav[i].classList[1]} ul`);
//         menu.classList.toggle("display");
//         menu.scrollIntoView({ behavior: "smooth" });
        
//         if (i === 3) {
//             document.querySelector(`.${footerNav[i].classList[1]} p`).classList.toggle("display");
//         }
//     });
// }
