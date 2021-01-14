'use strict'
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
const q = '&q=';
const tagsRelated = document.querySelector(".tags-related")

let infinityScroll = false
let infinityElement = 25;
let infinityQuantity = 31;

window.addEventListener("load", () => {
    if (localStorage.getItem('night') == "true") {
        limpiarBusqueda();
    }

})

sailorNight.addEventListener("click", () => {
    if (buttonSearch.classList.contains('active')) {
        lupa.style.backgroundImage = 'url(../assets/lupa_light.svg)'
    }
})

sailorDay.addEventListener("click", () => {
    if (buttonSearch.classList.contains('active')) {
        lupa.style.backgroundImage = 'url(../assets/lupa.svg)'
    }
})

document.addEventListener("scroll", () => {
    autocompleteDiv.classList.add("hidden")
})

logo.addEventListener("click", () => {
    limpiarBusqueda();
    location.reload()
})

inputSearch.addEventListener("focus", () => {
    addClassToButton();
    dropdown.style.display = "none"
})

inputSearch.addEventListener("focusout", () => {
    buttonSearch.classList.remove("submit-imput", "nightSubmit-input")
    buttonSearch.classList.remove("active")
    lupa.style.removeProperty("background-Image")
    setTimeout(() => {
        autocompleteDiv.classList.add("hidden")
    }, 500);

})

//scroll infinito en el index

document.addEventListener('scroll', async () => {
    let element = document.querySelector('.trendings>div:nth-child(' + infinityElement + ')');
    if (element !== null) {
        //innerHeight es la altura del viewsport + window.scrollY n° de px desplazados en scroll

        if (window.innerHeight + window.scrollY > element.offsetTop &&
            infinityScroll == false) {

            infinityScroll = true;

            await getTrendingGifs(infinityQuantity).then((gifs) => {
                addTrendingGif(gifs)
            }).catch((error) => {
                console.error(error)
            })
            infinityElement += 31;
            infinityQuantity += 31;
            infinityScroll = false;
        }
    }

});

let getSearch = async (query) => {
    if (!/^[\s|\W]{1,}$/gm.test(query) == true) {
        let searchURIs = [];
        const getSearchApi = url + search + token + q + query + limit + '31' + '&offset=0' + rating
        let resultsSearch = await fetch(getSearchApi);
        let resultsSearchJson = await resultsSearch.json();
        console.log("entro")
        if (resultsSearchJson.meta.status == 200 && resultsSearchJson.data.length != 0) {
            console.log("entro")
            let imagenesSearch = resultsSearchJson.data;

            for (const imagenSearch of imagenesSearch) {
                searchURIs.push({
                    'src': imagenSearch.images.fixed_height.url,
                    'width': imagenSearch.images.fixed_height.width,
                    'title': imagenSearch.title
                });
            }
            return searchURIs;

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
    let autocompleteURIs = [];
    const getAutocompleteApi = url + search + "/tags" + token + q + query + limit + '3' + '&offset=0'
    console.log(getAutocompleteApi)
    let resultsAutocomplete = await fetch(getAutocompleteApi);
    let autocompleteJson = await resultsAutocomplete.json();
    let tags = autocompleteJson.data;
    for (let tag of tags) {
        autocompleteURIs.push(tag.name);
    }
    return autocompleteURIs;
}

let getTags = async (query) => {
    const tagsApi = 'https://api.giphy.com/v1/tags/related/term=' + query + token
    let tagsURIs = [];

    let result = await fetch(tagsApi);
    let resultsJson = await result.json();
    let tags = resultsJson.data;

    for (const tag of tags) {
        tagsURIs.push(tag.name)
    }
    return tagsURIs;
}

inputSearch.addEventListener("keypress", () => {
    if (inputSearch.value.length >= 2) {
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
                    addClassToButton();
                    buttonSearch.classList.add("active")
                    ejecutarBusqueda(tag);
                    mostrarTags(tag)
                    inputSearch.value = tag
                })           
                autocompleteDiv.classList.remove("hidden")
            }
        })

    } else {
        autocompleteDiv.classList.add("hidden")
    }
})

buttonSearch.addEventListener("click", () => {
    buttonSearch.classList.add("active")
    ejecutarBusqueda(inputSearch.value);
    mostrarTags(inputSearch.value);
})

buttonSearch.addEventListener("focus", () => {
    addClassToButton();
    buttonSearch.classList.add("active")
})

buttonSearch.addEventListener("focusout", () => {
    buttonSearch.classList.remove("active")
})

inputSearch.addEventListener('keyup', (e) => {
    if (e.keyCode == '13') {
        e.preventDefault
        autocompleteDiv.classList.add("hidden")
        buttonSearch.classList.add("active")
        ejecutarBusqueda(inputSearch.value);
        mostrarTags(inputSearch.value)
    }
})

let getsuggestionsGifs = async () => {

    const ids = ["5PhoLTGAiHguInjU8w", "IeKpg7M6wu7W8", "g5OVsXxZlKTz0dCYfE", "26AHG5KGFxSkUWw1i"]
    const suggestions = "&ids=";
    let idsURIs = [];

    const suggestionsApi = url + token + suggestions + ids.join();
    let result = await fetch(suggestionsApi);
    let resultsJson = await result.json();
    let imagenes = resultsJson.data;

    for (const imagen of imagenes) {
        idsURIs.push({
            'src': imagen.images.original.webp,
            'url': imagen.url
        });
    }
    return idsURIs;
}

getsuggestionsGifs().then(
    (gifs) => {
        for (let i = 0; i < gifs.length; i++) {
            suggGif[i].setAttribute('src', gifs[i].src);
            suggButton[i].setAttribute('href', gifs[i].url)
        }
    });

let getTrendingGifs = async (offset = 0) => {
    const trend = '/trending';
    let trendURIs = [];

    const getTrendingApi = url + trend + token + limit + "31" + rating + "&offset=" + offset
    let resultsTrend = await fetch(getTrendingApi);
    let resultsTrendJson = await resultsTrend.json();
    if (resultsTrendJson.meta.status == 200) {
        let imagenesTrend = resultsTrendJson.data;
        for (const imagenTrend of imagenesTrend) {
            trendURIs.push({
                'src': imagenTrend.images.fixed_height.url,
                'width': imagenTrend.images.fixed_height.width,
                'title': imagenTrend.title
            });
        }
        return trendURIs;
    } else {
        throw new Error('Error en Fetch ' + resultsTrendJson.meta.msg)
    }
}

getTrendingGifs().then((gifs) => {
    addTrendingGif(gifs)
}).catch((error) => {
    console.error(error)
})

function addTrendingGif(gifs) {
    for (let i = 1; i < gifs.length; i++) {
        let div = document.createElement('div');

        let img = document.createElement('img');
        div.classList.add("trend-gif")
        if (i % 5 == 0 && i > 0) {
            div.classList.add("wide")
            if (gifs[i].width < 270) {
                img.style.objectPosition = "center"

            }
        }
        div.appendChild(img);
        if (gifs[i].width < 200) {
            img.style.width = "100%"
            img.style.objectFit = "cover"
            img.style.objectPosition = "top"
        }
        img.setAttribute('src', gifs[i].src);
        let title = gifs[i].title
        let search = (title.indexOf("GIF")) - 1
        let string = title.substr(0, search)
        let tagsBar = string.split(" ")
        /* img.addEventListener("mouseenter", () => {
            div.classList.remove("trend-gif")
            div.classList.add("suggestions", "box")
            let div2 = document.createElement("div")
            let divBar = document.createElement("div")
            div.appendChild(div2)
            div2.classList.add("gif", "hover")
            divBar.classList.add("topBar", "hover")
            let title = gifs[i].title
            let search = (title.indexOf("GIF")) - 1
            let string = title.substr(0, search)
            let tagsBar = string.split(" ")

            tagsBar.forEach(element => {
                element = "#" + element
                let span = document.createElement("span")
                span.innerText = element
                divBar.appendChild(span)
            });

            div2.appendChild(img)
            div2.appendChild(divBar)
        })
        img.addEventListener("mouseleave", () => {
            div.querySelector(".hover").remove()

            div.classList.remove("suggestions", "box")
            div.classList.add("trend-gif")
            div.appendChild(img)
        }) */
        agregarTags(div, img, tagsBar)
        trendGif.append(div)
    }
}

function limpiarBusqueda() {
    searchGif.innerHTML = ' ';
    tagsRelated.innerHTML = ' '
    tagsRelated.style.height = "50px"
    title.innerHTML = "Hoy te sugerimos:"
    home.classList.remove("hidden");
    title.classList.remove("hidden")
    autocompleteDiv.classList.add("hidden")
}

function addClassToButton() {
    if (localStorage.getItem('night') == "false") {
        buttonSearch.classList.add("submit-imput")
        lupa.style.backgroundImage = 'url(/assets/lupa.svg)'
    } else if (localStorage.getItem('night') == "true") {
        buttonSearch.classList.add("nightSubmit-input")
        lupa.style.backgroundImage = 'url(/assets/lupa_light.svg)'
    }
}

function mostrarTags(inputValue) {

    getTags(inputValue).then((tags) => {
        tagsRelated.innerHTML = ' '
        for (const tag of tags) {
            let div = document.createElement("div")
            tagsRelated.appendChild(div)
            div.classList.add("tag")
            div.addEventListener("click", () => {
                addClassToButton();
                buttonSearch.classList.add("active")
                inputSearch.value = tag
                ejecutarBusqueda(tag)
                mostrarTags(tag)
            })
            let tagSinEspacio = tag.replace(/ /g, "")
            div.innerHTML = "#" + tagSinEspacio
        }
        tagsRelated.style.height = "75px"

    })
}

function ejecutarBusqueda(inputValue) {
    getSearch(inputValue).then((gifs) => {
        home.classList.add("hidden");
        title.classList.remove("hidden")
        searchGif.innerHTML = ' ';
        title.innerHTML = inputValue + " (resultados)"

        for (let i = 1; i < gifs.length; i++) {
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.classList.add("trend-gif")
            if (i % 5 == 0 && i > 0) {
                div.classList.add("wide")
                if (gifs[i].width < 270) {
                    img.style.objectPosition = "center"

                }
            }
            div.appendChild(img);
            if (gifs[i].width < 200) {
                img.style.width = "100%"
                img.style.objectFit = "cover"
                img.style.objectPosition = "top"
            }
            img.setAttribute('src', gifs[i].src);
            let title = gifs[i].title
            let search = (title.indexOf("GIF")) - 1
            let string = title.substr(0, search)
            let tagsBar = string.split(" ")
            
            agregarTags(div, img, tagsBar)
            
            searchGif.appendChild(div)
            autocompleteDiv.classList.add("hidden")
            body.classList.add("busqueda")
        }

    }).catch((error) => {
        home.classList.add("hidden");
        title.classList.add("hidden")
        searchGif.innerHTML = ' ';
        let divError = document.createElement('div');
        divError.classList.add("font14");
        divError.innerHTML = error + " Intenta realizar una nueva búsqueda";
        searchGif.appendChild(divError);
    })
}

function agregarTags(div, img,tagsBar){
    img.addEventListener("mouseenter", () => {
        div.classList.remove("trend-gif")
        div.classList.add("suggestions", "box")
        let div2 = document.createElement("div")
        let divBar = document.createElement("div")
        div.appendChild(div2)
        div2.classList.add("gif", "hover")
        divBar.classList.add("topBar", "hover")


        tagsBar.forEach(element => {
            element = "#" + element
            let span = document.createElement("span")
            span.innerText = element
            divBar.appendChild(span)
        });

        div2.appendChild(img)
        div2.appendChild(divBar)
    })
    img.addEventListener("mouseleave", () => {
        div.querySelector(".hover").remove()

        div.classList.remove("suggestions", "box")
        div.classList.add("trend-gif")
        div.appendChild(img)
    })
}