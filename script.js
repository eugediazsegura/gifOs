'use strict'
const body = document.querySelector('body');
const sailorDay = document.querySelector('#sailorDay')
const sailorNight = document.querySelector('#sailorNight')
const buttonsHover = document.querySelector('.buttons');
const dropdown = document.querySelector('.dropdown');
const logo = document.querySelector('#logo');



window.addEventListener("load", () => {
    if (localStorage.getItem('night') == "true") {
        body.classList.add("night");
        logo.setAttribute("src", "assets/gifOF_logo_dark.png");
    }

})

buttonsHover.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown.style.display == "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }

})

document.addEventListener("scroll", () => {
    dropdown.style.display = "none";

})

sailorNight.addEventListener("click", () => {
    body.classList.add("night");
    logo.setAttribute("src", "assets/gifOF_logo_dark.png");
    localStorage.setItem('night', true)
})

sailorDay.addEventListener("click", () => {
    body.classList.remove("night");
    logo.setAttribute("src", "assets/gifOF_logo.png");
    localStorage.setItem('night', false)
})



const token = '?api_key=AHbdJlM0sAYa8PSQkZ7MHF4AE6OaePBE';
const url = 'https://api.giphy.com/v1/gifs';
const raiting = '&rating=pg';
const suggGif = document.querySelectorAll('.suggestions .gif img');
const suggButton = document.querySelectorAll('.viewmore a');
const trendGif = document.querySelector('.trendings');



let getsuggestionsGifs = async () => {

    const ids = ["5PhoLTGAiHguInjU8w", "IeKpg7M6wu7W8", "g5OVsXxZlKTz0dCYfE", "26AHG5KGFxSkUWw1i"]
    const suggestions = "&ids=";
    let idsURI = [];

    const suggestionsApi = url + token + suggestions + ids.join();
    let result = await fetch(suggestionsApi);
    let resultsJson = await result.json();
    let imagenes = resultsJson.data;

    for (const imagen of imagenes) {
        idsURI.push({
            'src': imagen.images.original.webp,
            'url': imagen.url
        });

    }

    return idsURI;
}

getsuggestionsGifs().then(
    (gifs) => {
        console.log(gifs);
        for (let i = 0; i < gifs.length; i++) {
            suggGif[i].setAttribute('src', gifs[i].src);
            suggButton[i].setAttribute('href', gifs[i].url)


        }

    });

/* const token = '?api_key=AHbdJlM0sAYa8PSQkZ7MHF4AE6OaePBE';
const url = 'https://api.giphy.com/v1/gifs';
const raiting = '&rating=pg';
const suggGif= document.querySelectorAll('.suggestions .gif img');
const suggButton = document.querySelectorAll('.viewmore a');
const trendGif = document.querySelector('.trending');
 */

let getTrendingGifs = async () => {
    const trend = '/trending';
    const trendURI = [];

    const getTrendingApi = url + trend + token + '&limit=31&rating=pg'
    let resultsTrend = await fetch(getTrendingApi);
    let resultsTrendJson = await resultsTrend.json();
    if (resultsTrendJson.meta.status == 200) {
        let imagenesTrend = resultsTrendJson.data;

        for (const imagenTrend of imagenesTrend) {
            trendURI.push({
                'src': imagenTrend.images.original.webp
            });
        }
        return trendURI;
    } else {
        throw new Error('Error en Fetch '+ resultsTrendJson.meta.msg)
    }


}

getTrendingGifs().then(
    (gifs) => {
        for (let i = 1; i < gifs.length; i++) {
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.classList.add("trend-gif")
            if (i % 5 == 0 && i > 0) {
                div.classList.add("wide")
            }
            //div.appendChild(div2);
            div.appendChild(img);
            img.setAttribute('src', gifs[i].src);
            trendGif.append(div)

        }
    }
).catch((error)=> {
    console.error(error)
} )
