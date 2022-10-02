
const knex = require('knex')

class Product {
  constructor(opciones, tabla){
    const database = knex(opciones);
    
    database.schema.hasTable(tabla)
      .then( exists => {
        if(!exists){
          return database.schema.createTable('productos', function(t) {
            t.increments('id').primary();
            t.string('title', 20);
            t.float('price');
            t.string('thumbnail', 220);
            t.string('uploaded', 70);
          });
        }
      })         
    
    this.database = database;  
    this.tabla = tabla;
  }

  getAll = async () => {
    // Le agregué el order by para que siempre al principio esten los productos recién cargados
    let respuesta = await this.database(this.tabla).select('*').orderBy('id', 'desc');        
    return JSON.parse( JSON.stringify(respuesta) );      
  }

  insertProduct = async (obj) => {    
      await this.database(this.tabla).insert(obj);    
  }
}

module.exports = Product;


