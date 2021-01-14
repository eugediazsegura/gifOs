const token = '?api_key=AHbdJlM0sAYa8PSQkZ7MHF4AE6OaePBE';
const urlUpload = 'https://upload.giphy.com/v1/gifs';
const url = 'https://api.giphy.com/v1/gifs/';
const logovideo = document.querySelector(".video #logo");
const bodyvideo = document.querySelector('body.video');
const arrow = document.querySelector('span.logo');
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav")
const start = document.querySelector('#start');
const modal1 = document.querySelector('#modal1');
const modal2 = document.querySelector('#modal2');
const modal3 = document.querySelector('#modal3');
const modalProgressBar = document.querySelector(".modal-bar");
const btnsUpload = document.querySelector("#btns-upload");
const video = document.querySelector('video');
const capturar = document.querySelector('#button-text');
const capturar2 = document.querySelector('#button-icon');
const cancel = document.querySelector("#cancel");
const mygifPreview = document.querySelector("#gif-preview");
const counter = document.querySelector(".counter");
const btnreupload = document.querySelector("#reupload");
const btnUpload = document.querySelector("#upload");
const time = document.querySelector(".time");
const copy = document.querySelector("#copy");
const myguifos = document.querySelector(".myguifos");

let recorder;
let recording = false;
let uploading = false;

window.addEventListener("load", () => {
    if (window.location.search =="?crearGuifo") {
        modal1.classList.remove("hidden");
        nav.style.justifyContent = "flex-start"
        arrow.classList.remove("hidden")

        
    }else if (window.location.search =="?misGuifos") {
        menu.classList.remove("hidden");
        
        
    } 
    if (localStorage.getItem('night') == "true") {
        bodyvideo.classList.add("night");
        logovideo.setAttribute("src", "./assets/gifOF_logo_dark.png");
    }

})

logo.addEventListener("click", () => {
    window.location = "../index.html"
})

 arrow.addEventListener("click", () => {
    window.location = "../index.html"
}) 

cancel.addEventListener("click", () => {
    window.location = "../index.html"
})


start.addEventListener("click", () => {
    modal1.classList.add("hidden");
    modal2.style.display = "block"
    getStreamAndRecord();

})

btnreupload.addEventListener("click", () => {
    window.location = "../video/video.html?crearGuifo"
})

function getCounter() {
    let seconds = 0;
    let minutes = 0;
    let timer = setInterval(() => {
        if (recording) {
            if (seconds < 59) {
                seconds++
            } else {
                seconds = 0;
                minutes++
            }
            counter.innerHTML = "00:00:" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
        }

    }, 1000);

}

function getStreamAndRecord() {
    //aca empieza a correr la camara, se pide permiso al usuario
    //chrome lanza un error si la pagina que da el script es insegura
    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: {
                    max: 480
                },
                width: {
                    max: 1200
                }
            }
        })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();

            capturar.addEventListener('click', () => {
                recording = !recording;

                if (recording === true) {
                    this.disabled = true;
                    //capturando el video
                    recorder = RecordRTC(stream, {
                        type: 'gif',
                        frameRate: 1,
                        quality: 10,
                        width: 360,
                        hidden: 240,
                        onGifRecordingStarted: function () {
                            console.log("started")
                        },
                    });
                    //inicio de grabacion
                    recorder.startRecording();

                    document.querySelector(".video .topBar .font14").innerHTML = "Capturando Tu Guifo"
                    capturar.classList.add("recording")
                    capturar2.classList.add("recording")
                    capturar.innerHTML = "Listo"
                    counter.style.visibility = "visible"
                    getCounter()
                    recorder.camera = stream;

                } else {
                    this.disabled = true;
                    recorder.stopRecording(stopRecordingCall);
                    recording = false
                }
            });
        });
};

function stopRecordingCall() {
    recorder.camera.stop();
    //le da el formato requerido a la data que se envía en el body del POST
    //que contendrá el gif pasado a formato blob
    let form = new FormData();

    form.append('file', recorder.getBlob(), 'test.gif');

        btnUpload.addEventListener("click", () => {
            uploading = true;
            const uploadProgressBar = document.querySelector("#uploadProgressBar");
            mygifPreview.classList.add("hidden");
            modalProgressBar.classList.remove("hidden");
            counter.style.visibility = "hidden"
            time.classList.add("hidden");
            btnUpload.classList.add("hidden");
            btnreupload.innerHTML = "Cancelar"
            createProgressBarUploading();
            uploadGif(form);
    
        })

    //obtener el blob de la variable recorder, que actualmente tiene el gif almacenado
    objectURL = URL.createObjectURL(recorder.getBlob());

    document.querySelector(".video .topBar .font14").innerHTML = "Vista Previa"
    video.classList.add("hidden");
    mygifPreview.classList.remove("hidden")
    
    mygifPreview.src = objectURL
   
    document.querySelector("a#btns-preview").style.display = "none";
    btnsUpload.classList.remove("hidden");
    time.classList.remove("hidden")
   
    createProgressBarTime();
    recorder.destroy();
    recoder = null;
}

//calcula el tiempo del gif
let getValueProgressbar = () => {
    let finalSeconds = parseInt(counter.innerText.slice(-2));
    let finalMinutes = (parseInt(counter.innerText.slice(6, 8))) * 60;
    let finalTime = finalSeconds + finalMinutes

    //en esta variable se realiza una regla de 3,los segundos por cantidad de barras y este resultado dividido
    // el "valor máximo supuesto" de segundos del gif, 2 minutos

    let total = Math.ceil((finalTime * 17) / 120)

    return total
}

function createProgressBarTime() {

    let progress = document.querySelector("#timeProgressBar")

    let bar;

    for (let i = 1; i <= 17; i++) {
        bar = document.createElement("div");
        bar.className = "bar";
        progress.appendChild(bar)
        let totalBars = getValueProgressbar();
        if (i <= totalBars) {
            bar.classList.add("chargedBar");
        }

    }
}

function createProgressBarUploading() {
    let bar = [];

        for (let i = 1; i <= 23; i++) {
            bar[i] = document.createElement("div");
            bar[i].className = "bar";
            uploadProgressBar.appendChild(bar[i]);
            setTimeout(() => {
                //bar[i].classList.toggle("chargedBar");
                changeBarColor(bar, i)
            }, (i * 100));
        }     
    }
    function changeBarColor(bar, i) {
        bar[i].classList.toggle("chargedBar");
        if (i == 23 && uploading) {
            for (let j = 1; j <= 23; j++) {

                setTimeout(() => {
                    changeBarColor(bar, j)
                }, (j * 100))
            }
        }

    }

    function uploadGif(gif) {
        fetch( urlUpload + token, {
            method: 'POST', 
            body: gif,
        }).then(res => {
            if (res.status != 200 ) {
                let uploading = false;
                modalProgressBar.innerHTML ="<h3>Hubo un error subiendo tu Guifo</h3>"
                console.error("Error status: " + res.status)
            }
            return res.json()
        }).then( data => {
            modal2.style.display ="none";
            modal3.classList.remove("hidden");
            let gifId = data.data.id;
            getGifDetails(gifId)
        })
        .catch(error => {
            modalProgressBar.innerHTML ="<h3>Hubo un error subiendo tu Guifo</h3>"
            console.error("Error: " + error)
        })
        
    }

    function getGifDetails(id) {
        fetch(url + id + token)
        
        .then((res) => {
            return res.json()
        }).then(data => {
            let gifURL = data.data.url;
            localStorage.setItem('gif' + data.data.id, JSON.stringify(data));
            document.querySelector("div#modal3 .camera img").src = data.data.images.fixed_height.url;
            const copyModal = document.querySelector(".modal")
            document.querySelector("#download").href =  mygifPreview.src
            
            copy.addEventListener("click", async () => {
                await navigator.clipboard.writeText(gifURL);
                copyModal.innerHTML = "Link copiado con éxito!"
                copyModal.classList.remove("hidden");
                setTimeout(() => {
                copyModal.classList.add("hidden")
            }, 1500);
            })
            document.getElementById("ok").addEventListener("click", () => {
                location.reload();
            })
            
        })
        .catch((error) => {
            return error;
        })  
    }

    function getGifs() {
        let gifs = []
        for (let i = 0; i < localStorage.length; i++) {
            const gif = localStorage.getItem(localStorage.key(i));
            if(gif.includes('data')) {
                gifJSON = JSON.parse(gif)
                gifs.push(gifJSON.data.images.fixed_height.url)

            }
            
        }
        return gifs;
    }
    window.addEventListener("load", ()=> {
        const gifs = getGifs()
        for (let i = 0; i < gifs.length; i++ ) {
            const gif = gifs[i];
            const img = document.createElement("img");
            img.src = gif;
            if (i % 5 == 0) {
                img.style.width = "48.5%";
                img.style.objectFit = "cover"
               
            }
            myguifos.appendChild(img)   
        }  
    })