'use strict'
const body = document.querySelector('body');
const sailorDay = document.querySelector('#sailorDay')
const sailorNight = document.querySelector('#sailorNight')
const buttonsHover = document.querySelector('.buttons');
const dropdown = document.querySelector('.dropdown');
const logo = document.querySelector('#logo');
const buttonSearch = document.querySelector('#search-submit');
const inputSearch = document.querySelector('#search-input');
const home = document.querySelector(".home");
const lupa = document.querySelector("div.lupa");
const autocompleteDiv = document.querySelector("div.dropdown.results")
const autocompeteUl = document.querySelector(".dropdown.results ul")
const title = document.querySelector("#title1")
const divTitle = document.querySelector(".principal.subtitle")
const token = '?api_key=AHbdJlM0sAYa8PSQkZ7MHF4AE6OaePBE';
const url = 'https://api.giphy.com/v1/gifs';
const rating = '&rating=pg';
const suggGif = document.querySelectorAll('.suggestions .gif img');
const suggButton = document.querySelectorAll('.viewmore a');
const trendGif = document.querySelector('.trendings');
const searchGif = document.querySelector('.searchs')
const search = "/search";
const limit = '&limit=';
const q = '&q='




window.addEventListener("load", () => {
    if (localStorage.getItem('night') == "true") {
        body.classList.add("night");
        logo.setAttribute("src", "assets/gifOF_logo_dark.png");
        searchGif.innerHTML = ' ';
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
    autocompleteDiv.classList.add("hidden")

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

logo.addEventListener("click", () => {
    searchGif.innerHTML = ' ';
    home.classList.remove("hidden");
    autocompleteDiv.classList.add("hidden")
})

inputSearch.addEventListener("focus", () => {
    addClassToButton();
})

inputSearch.addEventListener("focusout", () => {
    buttonSearch.classList.remove("submit-imput", "nightSubmit-input")
    buttonSearch.classList.remove("active")
    lupa.style.removeProperty("background-Image")



})


let getSearch = async (query) => {
    if (!/^[\s|\W]{1,}$/gm.test(query) == true) {
        const searchURI = [];
        const getSearchApi = url + search + token + q + query + limit + '31' + '&offset=0' + rating
        let resultsSearch = await fetch(getSearchApi);
        let resultsSearchJson = await resultsSearch.json();
        console.log(resultsSearchJson)
        if (resultsSearchJson.meta.status == 200) {
            let imagenesSearch = resultsSearchJson.data;

            for (const imagenSearch of imagenesSearch) {
                searchURI.push({
                    'src': imagenSearch.images.fixed_height.url,
                    'width': imagenSearch.images.fixed_height.width

                });
            }
            console.log(resultsSearch);
            return searchURI;

        } else {

            throw new Error(`No existen GIFs para ${query}`)
        }
    } else if (query == " ") {
        throw new Error(`No existen GIFs para espacio vacio`)
    } else {

        throw new Error(`No existen GIFs para ${query}`)

    }

}

let getAutocomplete = async (query) => {
    const autocompleteURI = [];
    const getAutocompleteApi = url + search + "/tags" + token + q + query + limit + '3' + '&offset=0'
    let resultsAutocomplete = await fetch(getAutocompleteApi);
    let autocompleteJson = await resultsAutocomplete.json();
    let tags = autocompleteJson.data;
    for (let tag of tags) {
        autocompleteURI.push(tag.name);
    }
    return autocompleteURI;

}

inputSearch.addEventListener("keyup", () => {
    if (inputSearch.value.length >= 3) {


        getAutocomplete(inputSearch.value).then((tags) => {

            autocompeteUl.innerHTML = " "
            if (tags.length == 0) {
                autocompleteDiv.classList.add("hidden")
            }
            for (let tag of tags) {
                let li = document.createElement("li");
                autocompeteUl.appendChild(li);
                li.innerHTML = tag;
                console.log(tags)
                li.addEventListener("click", () => {
                    ejecutarBusqueda(tag);
                    inputSearch.value = tag
                })
                autocompleteDiv.classList.remove("hidden")

            }

        })


    } else {
        autocompleteDiv.classList.add("hidden")
    }
})



function ejecutarBusqueda(inputValue) {
    getSearch(inputValue).then((gifs) => {
        home.classList.add("hidden");
        searchGif.innerHTML = ' ';
        title.innerHTML = inputValue + " (resultados)"
        for (let i = 1; i < gifs.length; i++) {
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.classList.add("trend-gif")
            if (i % 5 == 0 && i > 0) {
                div.classList.add("wide")
            }
            //div.appendChild(div2);
            div.appendChild(img);
             if (gifs[i].width < 200) {
                img.style.width = "100%"
                img.style.objectFit = "cover"
                img.style.objectPosition = "top"
            } 
            img.setAttribute('src', gifs[i].src);
            searchGif.appendChild(div)
            autocompleteDiv.classList.add("hidden")
            divTitle.style.marginTop = "100px"



        }


    }).catch((error) => {
        let divError = document.createElement('div');
        divError.classList.add("error");
        divError.innerHTML = error + " Intenta realizar una nueva búsqueda";
        searchGif.appendChild(divError);
    })
}

buttonSearch.addEventListener("click", () => {
    buttonSearch.classList.add("active")
    ejecutarBusqueda(inputSearch.value);

})

buttonSearch.addEventListener("focus", () => {
    addClassToButton();
    buttonSearch.classList.add("active")

})

buttonSearch.addEventListener("focusout", () => {
    buttonSearch.classList.remove("active")

})

inputSearch.addEventListener('keydown', (e) => {
    if (e.keyCode == '13') {
        buttonSearch.classList.add("active")
        ejecutarBusqueda(inputSearch.value);

    }
})

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


let getTrendingGifs = async () => {
    const trend = '/trending';
    const trendURI = [];

    const getTrendingApi = url + trend + token + limit+ "31" + rating
    console.log(getTrendingApi)
    let resultsTrend = await fetch(getTrendingApi);
    let resultsTrendJson = await resultsTrend.json();
    if (resultsTrendJson.meta.status == 200) {
        let imagenesTrend = resultsTrendJson.data;
        console.log(resultsTrendJson)
        for (const imagenTrend of imagenesTrend) {
            trendURI.push({
                'src': imagenTrend.images.fixed_height.url,
                'width': imagenTrend.images.fixed_height.width,
                'title': imagenTrend.title
                
            });
        }
        return trendURI;
    } else {
        throw new Error('Error en Fetch ' + resultsTrendJson.meta.msg)
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
            div.appendChild(img);
             if (gifs[i].width < 200) {
                img.style.width = "100%"
                img.style.objectFit = "cover"
                img.style.objectPosition = "top"
            } 
            img.setAttribute('src', gifs[i].src);
            img.addEventListener("mouseenter", ()=>{
                div.classList.remove("trend-gif")
                div.classList.add("suggestions", "box")
                let div2=document.createElement("div")
                let divBar = document.createElement("div")
                div.appendChild(div2)
                div2.classList.add("gif", "hover")
                divBar.classList.add("topBar", "hover")
                let title = gifs[i].title
                let search = (title.indexOf("GIF")) - 1
                let string = title.substr(0, search)
                let tagsBar = string.split(" ")
                //tagsBar = [0,1,2,3]

                tagsBar.forEach(element => {
                    element =  "#" +element 
                    let span =document.createElement("span")
                    span.innerText = element
                    divBar.appendChild(span)
                });
                
        
                
                //console.log(stringEnArray) 
                //divBar.innerHTML = string
                div2.appendChild(img)
                div2.appendChild(divBar)
            })
            img.addEventListener("mouseleave", () =>{
                 div.querySelector(".hover").remove()
                
                div.classList.remove("suggestions", "box")
                div.classList.add("trend-gif")
                div.appendChild(img)
            })

            trendGif.append(div)

        }
    }
).catch((error) => {
    console.error(error)
})


function addClassToButton() {
    if (localStorage.getItem('night') == "false") {
        buttonSearch.classList.add("submit-imput")
        lupa.style.backgroundImage = 'url(/assets/lupa.svg)'
    } else if (localStorage.getItem('night') == "true") {
        buttonSearch.classList.add("nightSubmit-input")
        lupa.style.backgroundImage = 'url(/assets/lupa_light.svg)'
    }

}