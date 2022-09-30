
const express = require('express');
const productRouter = require('./routes/products');
const { Server } = require('socket.io');
const Contenedor = require("./classes/contenedor");

const app = express();
const PORT = process.env.PORT || 3000;

let contenedor = new Contenedor('productos.txt');
let cont_mensajes = new Contenedor('mensajes.txt');

const server = app.listen(PORT, () => console.log(`Server Up on Port ${PORT}`));

const io = new Server(server);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public')); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let user;

let products = [];
contenedor.getAll().then(res => {products = res.data;}); 

let mensajes = [];
cont_mensajes.getAll().then(res => {mensajes = res.data;});

app.get('/', (req, res) => {  
  res.render('home', {products, user});
});

app.use('/api/productos', productRouter)


io.on('connection', socket => {  

  // cuando se conecta un nuevo usuario
  socket.on('registered', data => {    

    user = data;

    socket.broadcast.emit('newUser', data)    
    
    socket.emit('userTitle', user);
    
    io.emit('prodHistory', products)
    socket.emit('chatHistory', mensajes)
  })

  // cuando guardan un nuevo producto
  socket.on('newProduct', data => {    
    contenedor.save(data)
      .then(res => {
        if(res.status === 'success'){
          products.push(data);
          io.emit('prodHistory', products)
        }
      })
  })

  //Cuando envian un msj en el chat
  socket.on('message', data => {    
    cont_mensajes.save(data)
      .then(res => {
        if(res.status === 'success'){
          mensajes.push(data);
          io.emit('chatHistory', mensajes)
        }
      })    
  })  
});

