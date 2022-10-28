
const express = require('express');
const productRouter = require('./routes/products');
const productFaker = require('./routes/productFaker.routes');

const { Server } = require('socket.io');

// Archivos de opciones para ambos gestores de BD
const optionsMYSQL = require('./options/mysql.config')
const optionsSQLITE = require('./options/sqlite.config')
//////////////////////////////////////////////////////////////////////////////////////

const Product = require('./classes/Product.model');
const Chat = require('./classes/Chat.model');

// Instancio las clases pasandole las opciones de cada uno y la tabla correspondiente.
const producto = new Product(optionsMYSQL, 'productos');
const chat = new Chat(optionsSQLITE, 'mensajes');
//////////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = process.env.PORT || 3000;


const server = app.listen(PORT, () => console.log(`Server Up on Port ${PORT}`));

const io = new Server(server);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public')); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/////// Inicializando variables
let user;
let products = []; 
let mensajes = [];
//////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {  
  res.render('home', {products, user});
});

app.use('/api/productos', productRouter) 
app.use('/api/productos-test', productFaker)   // Ruta para trabajar con FAKER

io.on('connection', socket => {  

  // cuando se conecta un nuevo usuario
  socket.on('registered', data => {    

    user = data;

    socket.broadcast.emit('newUser', data)    
    
    socket.emit('userTitle', user);
    
    // Busco los productos y lo "emito" para todos los conectados
    producto.getAll().then( res => {
      products = res;
      io.emit('prodHistory', products)
    })      
    
    chat.getAll().then( res => {
      mensajes = res;
      socket.emit('chatHistory', mensajes)
    })
    
  })

  // cuando guardan un nuevo producto
  socket.on('newProduct', data => {        
    producto.insertProduct(data); 
    producto.getAll().then( res => {
      products = res;
      io.emit('prodHistory', products)
    })         
  })

  //Cuando envian un msj en el chat
  socket.on('message', data => {    
    chat.insertMsg(data);
    chat.getAll().then( res => {
      mensajes = res;
      io.emit('chatHistory', mensajes)
    })
       
  })  
});

