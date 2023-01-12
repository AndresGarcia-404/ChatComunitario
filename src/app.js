import express from 'express';
import {Server} from 'socket.io';
import { engine } from 'express-handlebars';
import viewsRoute from "./routes/view.router.js";


const app = express();
const PORT =3000;

const messages = []; //aqui vamos a almacenar todos los mensajes creados
app.use(express.json()); // aqui definimos que vamos a trabajar con json
app.use(express.urlencoded({ extended:true}));

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
}) // lo definimos como una const para despues deplegarlo con socket.io

const io = new Server(httpServer); //aqui definimos que el servidor trabajara con socket.io

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views","./src/views");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello, world!")
});

app.use("/views",viewsRoute)

io.on("connection", (socket) => {
    console.log('new user connected');
    socket.on("new-user",(data) => { //hace referencia a que cuando se active el emit del socket de index.json recupere la data que se envia
        console.log(data);
    });
    //revibe el socket de message con toda su data enviada como segundo parametro en index.js

    socket.on("message", (data) => { //este socket hace referencia a que cuando suceda el evento de message se trae ese mensaje y lo aniade al arreglo de mensajes, despues emite todo el arreglo como messagelog. //! lo recibe como mensaje y lo emite como messageLogs
        messages.push(data);
        io.emit("messageLogs", messages);
    })
})