'use strict'

const request = require('superagent')
const key = require('../../config/secret-key')

function deserializeToken (token) {
  return new Promise((resolve, reject) => {
    request
  .get('/api/authenticate')
  .accept('json')
  .set({Authorization: token})
  .end((err, resp) => {
    if (err) reject(err)
    let user = JSON.parse(resp.text)
    user = user.token
    resolve(user)
  })
  })
}

function getCompanyById (id) {
  return new Promise((resolve, reject) => {
    request
    .get(`/api/company/${id}`)
    .accept('json')
    .set({Authorization: `Bearer ${key}`})
    .end((err, response) => {
      if (err) return reject(err)
      let result = JSON.parse(response.text)
      resolve(result)
    })
  })
}

module.exports = {
  deserializeToken,
  getCompanyById
}
