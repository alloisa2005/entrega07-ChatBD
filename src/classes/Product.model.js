
const knex = require('knex')

class Product {
  constructor(options, table){
    const database = knex(options);

    this.database = database;
    this.table = table;
  }
}

module.exports = Product;