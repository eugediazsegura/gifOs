const logovideo = document.querySelector(".video #logo");
const bodyvideo = document.querySelector('body.video');
const arrow = document.querySelector('span.logo');
const start = document.querySelector('#start');
const modal1 = document.querySelector('#modal1');
const modal2 = document.querySelector('#modal2');
const video = document.querySelector('video');
const capturar = document.querySelector('#button4')


let recorder;
let recording = false;

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
    //aca empieza a correr la camara, se pide permiso al usuario
    //chrome lanza un error si la pagina que da el script es insegura
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

            capturar.addEventListener('click', () => {
                recording = !recording;

                if (recording ===true) {
                    this.disabled = true;
                    //capturando el video
                    recorder = RecordRTC(stream, 
                        {
                            type: 'gif', 
                            frameRate : 1, 
                            quality: 10, 
                            width: 360,
                            hidden: 240,
                            onGifRecordingStarted: function ()
                            {
                                console.log("started")
                            },
                        }
                    );
                    //inicio de grabacion
                    recorder.startRecording();

                    //getDuration
                    //cambiar estilos del dom
                    recorder.camera = stream;
                    
                }else{
                    this.disabled = true;
                    recorder.stopRecording(stopRecordingCall);
                    recording = false
                }
            });
        });
};

function stopRecordingCall(){
    recorder.camera.stop();
    //le damos el formato requerido a la data que vamos a enviar como body del POST

    //se crea un archivo form que luego contendrá el gif pasado a formato blob
    let form = new FormData();

    form.append('file', recorder.getBlob(), 'test.gif');
    console.log(form.get('file'));

    //este es el boton de cargar gif
    upload.addEventListener('click', () =>{
        //css uploarmessage.classlist.remove(hidden);
        //preview.classlist.add(hidden);
        uploadGif(form);
    })

    //obtener el blob de la variable recorder, que actualmente tiene el gif almacenado
    objectURL = URL.createObjectURL(recorder.getBlob());
    preview.src = objectURL
}
/* startVideoRecord(stream){
 */
