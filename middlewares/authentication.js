'use strict'
const key = require('../config/secret-key')
function authenticate (req, res, next) {
  if (req.token === key) {
    next()
  } else {
    res.status(401)
    res.send(req.token)
  }
}

module.exports = authenticate
