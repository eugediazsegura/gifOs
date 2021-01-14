const body = document.querySelector('body');
const sailorDay = document.querySelector('#sailorDay')
const sailorNight = document.querySelector('#sailorNight')
const buttonsHover = document.querySelector('.buttons');
const dropdown = document.querySelector('.dropdown');





window.addEventListener("load", () => {
    if (localStorage.getItem('night') == "true") {
        body.classList.add("night");
        if (window.location.pathname.includes('index')) {
            logo.setAttribute("src", "./assets/gifOF_logo_dark.png");
        }else{
            logo.setAttribute("src", "../assets/gifOF_logo_dark.png");
        }
        
        
    }

})

buttonsHover.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display=="none"? dropdown.style.display = "block" : dropdown.style.display = "none";
})

document.addEventListener("scroll", () => {
    dropdown.style.display = "none";


})

sailorNight.addEventListener("click", () => {
    body.classList.add("night");
    if (window.location.pathname.includes('index')) {
        logo.setAttribute("src", "./assets/gifOF_logo_dark.png");
    }else{
        logo.setAttribute("src", "../assets/gifOF_logo_dark.png");
    }
    localStorage.setItem('night', true)
})

sailorDay.addEventListener("click", () => {

    body.classList.remove("night");
    if (window.location.pathname.includes('index')) {
        logo.setAttribute("src", "./assets/gifOF_logo.png");
    }else{
        logo.setAttribute("src", "../assets/gifOF_logo.png");
    }
    localStorage.setItem('night', false)
})

