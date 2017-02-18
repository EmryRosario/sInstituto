const mysql = require('mysql2/promise')
const co = require('co')

function connect (config) {
  config.host = config.host || 'localhost'
  config.user = config.user || 'root'
  config.password = config.password || ''
  config.database = config.database || 'test'

  let connection = co(function * () {
    let connectionPromise = yield mysql.createConnection({host: 'localhost', user: 'root', password: 'er3030', database: 'DALLAS'})
    return Promise.resolve(connectionPromise)
  }).catch(function onError (err) { return Promise.reject(err) })

  return connection
}

module.exports = {
  connect: connect
}
