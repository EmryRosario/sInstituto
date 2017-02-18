const config = require('../config/db-config.js')

const knex = require('knex')(config)

// knex.select().table('MENU')
// .then(function (hola) {
//   console.log(hola)
// })

// function close () {
//   var pool = knex.client.pool
//   pool.drain(pool.destroyAllNow)
// }

module.exports = knex
