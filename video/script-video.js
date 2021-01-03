const logovideo = document.querySelector(".video #logo");
const bodyvideo = document.querySelector('body.video');
const arrow = document.querySelector('span.logo');
const start = document.querySelector('#start');
const modal1 = document.querySelector('#modal1');
const modal2 = document.querySelector('#modal2');
const video = document.querySelector('video');
const capturar = document.querySelector('#button4')


let grabar;
let grabando = false;

logo.addEventListener("click", () =>{
    window.location = "../index.html"
})

arrow.addEventListener("click", () =>{
    window.location = "../index.html"
})

window.addEventListener("load", () => {
    console.log("entro")
    if (localStorage.getItem('night') == "true") {
        bodyvideo.classList.add("night");
        logovideo.setAttribute("src", "../assets/gifOF_logo_dark.png");

    }

})

start.addEventListener("click", ()=>{
    modal1.classList.add("hidden");
    modal2.style.display = "block"
    getStreamAndRecord();

})

function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: {
                    max: 480
                },
                width: {
                    max:  1200
                }
            }
        })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            capturar.addEventListener('click', startVideoRecord(source));

          
            
        });
};

startVideoRecord(stream){

}