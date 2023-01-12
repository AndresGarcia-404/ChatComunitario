console.log('hola');
let user;
const socket = io();  //instanciamos socket, todo esto es el cliente

Swal.fire({
    title: "Inicia Sesion!",
    text: "Ingresa tu nombre de usuario",
    input: "text",
    confirmButtonText: 'Cool',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if(!value) {
            return "Debe ingresar un nombrede usuario";
        }
    }
}).then((result) => {
    if(result.value){
        user = result.value;
        socket.emit("new-user", {user: user,id: socket.id})
        user.id = socket.id;
    }
    //aqui emite la data que se ve reflejada en la linea 32 de app.js
})

//se define el chatbox para capturar lo que este contenga con el get element by id con la id fijada en el handlebar
let chatBox = document.getElementById("chatBox")
//para hacer acciones hay que crear los eventos, para esto 
chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter"){
        if (chatBox.value.trim().length > 0) { // trim es para que sea diferente de vacio
            //emito el socket de tipo message
            socket.emit("message",{
                user: user,
                message: chatBox.value
            });
            chatBox.value = "";
        }
    }
})

//aqui recibe todos los mensajes mencionados en la linea 30 del app.js en este socket.on recibimos el dato  y creamos un mensaje tipo html para agregarlo en la posicion de messagelogs, aqui lee todo el arreglo de mensajes
socket.on("messageLogs",(data) => {
    let log = document.getElementById("messageLogs");
    let message = "";

    data.forEach(elem => {
        message += `
        <div class="chat-message">
            <div class="message-bubble">
                <div class="message-sender">${elem.user}</div>
                <p>${elem.message}</p>
            </div>
        </div>`;
    });

    log.innerHTML = message;
})

socket.on("new-user-connected",(data) => {
    if(data.id !== socket.id){
        Swal.fire({
            text: `${data.user} se ha conectado al chat`,
            toast: true,
            position: "top-end"
        })
    }
})

function firstLoad (){
    let log = document.getElementById("messageLogs");

    fetch("/messages")
        .then((response) => {
            return response.json();
        })
        .then((data)=>{
            let message = "";

            data.forEach((elem)=>{
                message += `
                <div class="chat-message">
                    <div class="message-bubble">
                        <div class="message-sender">${elem.user}</div>
                        <p>${elem.message}</p>
                    </div>
                </div>`;
            });
            log.innerHTML = message;
        });
}

firstLoad();