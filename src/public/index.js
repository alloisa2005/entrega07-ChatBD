
const socket = io();

let user;

let title = document.getElementById('title');
let price = document.getElementById('price');
let thumbnail = document.getElementById('thumbnail');
let btn_guardar = document.getElementById('btn_guardar');

let input_msj = document.getElementById('input_msj');
let chat_container = document.getElementById('chat_container');

// Para mostrar en pantalla el email del usuario
let title_user = document.getElementById('title_user');

// Cuando un usuario se conecta
Swal.fire({
  title: 'Login',
  text: 'Ingrese su email',
  input: 'text',
  confirmButtonText: 'OK',
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return 'Necesitas un correo para ingresar'
    }
    if(!validarCorreo(value)) {
      return 'Ingrese un formato de correo válido'
    }
  }
}).then(res => {
  user = res.value;
  socket.emit('registered', user)
});

// Boton GUARDAR
btn_guardar.addEventListener('click', (e) => {
  e.preventDefault();

  let obj = {
    title:title.value, 
    price:parseFloat(price.value), 
    thumbnail:thumbnail.value,
    uploaded: user
  }  

  if(obj.title !== '' && obj.price !== 0 && price.value !== '' && obj.thumbnail !== ''){    
    socket.emit('newProduct', obj)
    title.value = '';
    price.value='';
    thumbnail.value='';
  } else {
    mensaje();  // Mensaje de Error
  }
  
});

// Cuando se envia un msj en el chat (Tecla ENTER)
input_msj.addEventListener('keyup', (e) => {
  if(e.key === 'Enter'){    
    socket.emit('message', {user, date: new Date(), mensaje: input_msj.value});        
    input_msj.value = '';         
  }
});

//sockets
socket.on('newUser', (data) => {
  // alert('New user connected!')
  Swal.fire({
      icon: "success",
      text: `${data} has connected`,
      toast: true,
      position: "top-right"
  })
})

// Cuando se registra un usuario pinto en pantalla el email
socket.on('userTitle', data => {
  title_user.innerHTML = data;
});

socket.on('prodHistory', data => {

  let productosTabla_h2 = document.getElementById('productosTabla_h2');
  productosTabla_h2.innerHTML = `Productos Cargados (${data.length})`;

  let table = document.getElementById('productosTabla');
  table.innerHTML = '';
  let row = table.insertRow(0);
  row.style.fontWeight= "bold";
  row.style.fontSize= "20px";
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3); 
  cell1.innerHTML = "Titulo";
  cell2.innerHTML = "Precio";
  cell3.innerHTML = "Uploaded";
  cell4.innerHTML = "Foto";

  data.forEach((prod,index)=> {
    row = table.insertRow(index+1);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell4 = row.insertCell(3);
    cell1.innerHTML = prod.title;
    cell2.innerHTML = `$${prod.price}`;
    cell3.innerHTML = prod.uploaded;
    cell4.innerHTML = `<img style="object-fit:contain;" src="${prod.thumbnail}" alt="${prod.title}">`;
  });  
});

socket.on('chatHistory', data => {      
  chat_container.innerHTML ='';

  data.forEach((item) => {    
    let burbu = document.createElement('div');
    user === item.user
      ? burbu.innerHTML = `<div style="with:100%; display:flex; justify-content: end; gap:10px;"> <p class="txt_blue">${item.user}</p> <p class="txt_brown">[${formatoFecha(item.date)}]</p> <p class="txt_green">${item.mensaje}</p> </div>`  
      : burbu.innerHTML = `<div style="with:100%; display:flex; justify-content: start; gap:10px;"> <p class="txt_blue">${item.user}</p> <p class="txt_brown">[${formatoFecha(item.date)}]</p> <p class="txt_green">${item.mensaje}</p> </div>`;    

      chat_container.innerHTML += burbu.innerHTML; 
  })

});

// Funcion mensaje de error
function mensaje(){
  return Swal.fire({
    icon: "error",
    text: `Ingrese todos los campos`,    
  });
}

function formatoFecha(fch){    

  let date = new Date(fch);
  
  let dia = date.getDate();
  if(dia < 10) dia='0'+dia;

  let mes = date.getMonth() + 1;
  if(mes < 10) mes='0'+mes;

  let anio= date.getFullYear();

  let hora = date.getHours();
  if(hora < 10) hora='0'+hora;

  let minutes= date.getMinutes();
  if(minutes < 10) minutes='0'+minutes;

  let seconds = date.getSeconds();
  if(seconds < 10) seconds='0'+seconds;

  return `${dia}/${mes}/${anio} ${hora}:${minutes}:${seconds}`;
}

function validarCorreo(correo) {
  emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  
   return emailRegex.test(correo) ? true : false;
}


