const express = require('express');
const router = express.Router();

const faker = require('faker');

router.get('/', (req, res) => {    
  
  try {
    let products = [];

    for (let i = 0; i < 5; i++) {
      const element = {
        id: faker.datatype.uuid(),
        nombre: faker.commerce.product(), 
        precio: faker.commerce.price(), 
        foto: faker.image.business() 
      };
      
      products.push(element);
    }

    res.status(200).send({status: 'OK', result: products});
  } catch (error) {
    res.status(404).send({status: 'ERROR', result: error.message});
  }
});


module.exports = router;