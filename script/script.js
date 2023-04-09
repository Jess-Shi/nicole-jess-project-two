
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

if (document.querySelector(".filters")) {

    document.querySelector(".filters .mobile").addEventListener("click", (e) => {

        const options = document.querySelector(".filters .options");
        e.stopPropagation();
        options.classList.toggle("display");
        options.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}


//footer

const toggleFooterNav = (e) => {

    if (e.target.tagName === "BUTTON") {

        const ul = e.target.nextElementSibling;
        e.stopPropagation();
        ul.classList.toggle("display");
        ul.scrollIntoView({behavior: "smooth"});
    }
}

let below1200 = false;

if (window.matchMedia("(max-width: 1200px)").matches) {

    const h6 = document.querySelectorAll("h6");

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

        const h6 = document.querySelectorAll("h6");

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

        document.querySelector("footer").removeEventListener("click", toggleFooterNav);

        below1200 = false;
    }
});

