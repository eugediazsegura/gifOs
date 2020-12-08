'use strict'
const body = document.querySelector('body');
const sailorDay = document.querySelector('#sailorDay')
const sailorNight = document.querySelector('#sailorNight')
const buttonsHover = document.querySelector('.buttons');
const dropdown = document.querySelector('.dropdown');
const logo = document.querySelector('#logo');



window.addEventListener("load", ()=>{
    if (localStorage.getItem('night') =="true") {
        body.classList.add("night");
        logo.setAttribute("src", "assets/gifOF_logo_dark.png");
    }

}) 

buttonsHover.addEventListener("click", (e)=>{
    e.stopPropagation();
    if (dropdown.style.display == "none"){
         dropdown.style.display = "block";
     }else{
         dropdown.style.display = "none";
     }
 
 })

document.addEventListener("scroll", () =>{
        dropdown.style.display = "none";
    
})

sailorNight.addEventListener("click", () =>{
    body.classList.add("night");
    logo.setAttribute("src", "assets/gifOF_logo_dark.png");
    localStorage.setItem('night', true)
})

sailorDay.addEventListener("click",() =>{
    body.classList.remove("night");
    logo.setAttribute("src", "assets/gifOF_logo.png");
    localStorage.setItem('night', false)
})



const token = '?api_key=AHbdJlM0sAYa8PSQkZ7MHF4AE6OaePBE';
const url = 'https://api.giphy.com/v1/gifs/';
const raiting = '&rating=pg';
const trendsGif= document.querySelectorAll('.trending .gif img') 


let getRandomGif = async()=>{
    const hashtag = '&tag='
    const tags = ['Jonathan-van-ness','Sailor-Mercury','FabFive','Unicorns&Rainbows']
    let tagsUrls = [];
    for (const tag of tags) {
        
        const randomApi = url + 'random' + token + hashtag + tag 
        let result = await fetch(randomApi);
        let resultsJson = await result.json();
        tagsUrls.push(resultsJson.data.images.original.webp);
        
         
    }
    return tagsUrls;
}

getRandomGif().then(
(tagssUrls) => {
    for (let i = 0; i <= tagssUrls.length; i++) {
        trendsGif[i].setAttribute('src', tagssUrls[i])
        
    }
       
});


