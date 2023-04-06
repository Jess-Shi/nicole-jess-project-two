



//filter

document.querySelector(".filters .mobile").addEventListener("click", () => {
    document.querySelector(".filters .options").classList.toggle("display");
});

//footer

const footerNav = document.querySelectorAll(".useful-links, .account, .services, .questions");

for (let i = 0; i < footerNav.length; i++) {
    
    footerNav[i].addEventListener("click", () => {

        const menu = document.querySelector(`.${footerNav[i].classList[1]} ul`);
        menu.classList.toggle("display");
        menu.scrollIntoView({ behavior: "smooth" });
        
        if (i === 3) {
            document.querySelector(`.${footerNav[i].classList[1]} p`).classList.toggle("display");
        }
    });
}
