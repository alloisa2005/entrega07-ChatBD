
const knex = require('knex')

class Chat {
  constructor(opciones, tabla){
    
    const database = knex(opciones);

    database.schema.hasTable(tabla)
      .then( exists => {
        if(!exists){
          return database.schema.createTable(tabla, function(t) {
            t.increments('id').primary();
            t.string('user', 20);            
            t.string('mensaje', 200);
            t.date('date');            
          });
        }
      }) 

    this.database = database;  
    this.tabla = tabla;
  }

  getAll = async () => {    
    let respuesta = await this.database(this.tabla).select('*');       
    return JSON.parse( JSON.stringify(respuesta) );      
  }

  insertMsg = async (obj) => {    
    await this.database(this.tabla).insert(obj);    
}
}

module.exports = Chat;