const jwt = require('jsonwebtoken')
const key = require('../config/secret-key')

function sign (payload, opts) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, key, opts, (err, token) => {
      if (err) reject(err)
      resolve('Bearer ' + token)
    })
  })
}

function validate (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}
module.exports = {
  sign: sign,
  validate: validate
}
