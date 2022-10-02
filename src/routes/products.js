
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Middleware para validar si existe el ID del producto
const validarProductId = (req,res,next) => {
  let { id } = req.params;  

  let existe = products.some(p => p.id === id);

  existe ? next() : res.status(200).send({ status:'ERROR', result: `No existe producto con ID ${id}`});
}

// Middleware para validar lo que viene en el body como dato de entrada
const validarInputsProduct = (req,res,next) => {
  let producto = req.body;

  if(producto.title === '' || producto.price <= 0 || producto.price === '') return res.status(404).send({
    status: 'ERROR',
    result: 'Ingrese los datos del producto correctamente'
  });

  next();
}

router.get('/', (req, res) => {  
  res.status(200).send({status: 'OK', result:products});
});

router.get('/:id', validarProductId, (req, res) => {
  try {
    let {id} = req.params;
    let prod = products.find( p => p.id === id);  
  
    // Si pasa la validación, se que el producto va a existir, por eso no pongo un "else"
    res.status(200).send({status: 'OK', result: prod})         
  } catch (error) {
    res.status(404).send({status: 'ERROR', result: error.message})
  }  
});

router.post('/', validarInputsProduct, async (req, res) => {

  try {
    let producto = req.body;    
    producto.id = crypto.randomUUID();  

    //products.push(producto);  
    //res.status(200).send({status: 'OK', result: producto});  
    await contenedor.save(producto);
    res.redirect('/');
  } catch (error) {
    res.status(404).send({status: 'ERROR', result: error.message})
  }
});


router.put('/:id', validarProductId, validarInputsProduct, (req, res) => {
  try {
    let {id} = req.params;

    // El producto existe porq pasó la validación de ID (validarProductId)
    let prod = products.find( p => p.id === id);  
          
    // Obtengo el producto que viene en el body
    let productoBody = req.body;

    prod.title = productoBody.title;
    prod.price = productoBody.price;
    prod.thumbnail = productoBody.thumbnail;

    res.status(200).send({status: 'OK', result: prod});
  } catch (error) {
    res.status(404).send({status: 'ERROR', result: error.message})
  }
});


router.delete('/:id', validarProductId, (req, res) => {
  try {
    let {id} = req.params;
    let prod = products.find( p => p.id === id);  

    products = products.filter( p => p.id !== id);
    res.status(200).send({status: 'OK', result: `Producto ID ${id} borrado correctamente`});
  } catch (error) {
    res.status(404).send({status: 'ERROR', result: error.message})
  }
});

module.exports = router;