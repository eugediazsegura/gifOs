const logovideo = document.querySelector(".video #logo");
const bodyvideo = document.querySelector('body.video');
const arrow = document.querySelector('span.logo');
const start = document.querySelector('#start');
const modal1 = document.querySelector('#modal1');
const modal2 = document.querySelector('#modal2');
const btnsUpload = document.querySelector("#btns-upload");
const video = document.querySelector('video');
const capturar = document.querySelector('#button4');
const capturar2 = document.querySelector('#button3');
const mygifPreview = document.querySelector("#gif-preview");
const counter = document.querySelector(".counter");
const btnreupload = document.querySelector("#reupload");
const btnUpload = document.querySelector("#upload")
const time = document.querySelector(".time")

let recorder;
let recording = false;
let uploading = false;

logo.addEventListener("click", () => {
    window.location = "../index.html"
})

arrow.addEventListener("click", () => {
    window.location = "../index.html"
})

window.addEventListener("load", () => {
    console.log("entro")
    if (localStorage.getItem('night') == "true") {
        bodyvideo.classList.add("night");
        logovideo.setAttribute("src", "../assets/gifOF_logo_dark.png");

    }

})

start.addEventListener("click", () => {
    modal1.classList.add("hidden");
    modal2.style.display = "block"
    getStreamAndRecord();

})

btnreupload.addEventListener("click", () => {
    console.log("entro")
    window.location = "../video/video.html"
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

                    //getDuration
                    //cambiar estilos del dom
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
    console.log(form.get('file'));

    //este es el boton de cargar gif
    //upload.addEventListener('click', () =>{
    //css uploarmessage.classlist.remove(hidden);
    //preview.classlist.add(hidden);
    // uploadGif(form);
    //  })

    //obtener el blob de la variable recorder, que actualmente tiene el gif almacenado
    objectURL = URL.createObjectURL(recorder.getBlob());
    console.log(objectURL);
    document.querySelector(".video .topBar .font14").innerHTML = "Vista Previa"
    video.classList.add("hidden");
    mygifPreview.classList.remove("hidden")
    mygifPreview.src = objectURL
    document.querySelector("a#btns-preview").style.display = "none";
    btnsUpload.classList.remove("hidden");
    time.classList.remove("hidden")
    createProgressBar();


    btnUpload.addEventListener("click", () => {
        uploading = true;
        const modalProgressBar = document.querySelector(".modal-bar");
        const uploadProgressBar = document.querySelector("#uploadProgressBar");
        mygifPreview.classList.add("hidden");
        modalProgressBar.classList.remove("hidden");

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
        /* let i= 1;
        function cFor(i){
            if(i<=23){
                bar = document.createElement("div");
                bar.className = "bar";
                uploadProgressBar.appendChild(bar);
            }
        } */


    })
}

let getValueProgressbar = () => {
    let finalSeconds = parseInt(counter.innerText.slice(-2));
    let finalMinutes = (parseInt(counter.innerText.slice(6, 8))) * 60;
    let finalTime = finalSeconds + finalMinutes

    /*en esta variable se realiza una regla de 3,los segundos por cantidad de barras  y este resultado dividido
     el "valor máximo supuesto" de segundos del gif, 2 minutos */
    let total = Math.ceil((finalTime * 17) / 120)

    return total
}


function createProgressBar() {

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