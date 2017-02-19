'use strict'

const request = require('superagent')
const key = require('../../config/secret-key')

function menu (cxt, next) {
  request.get('/api/menu-options')
  .set('Authorization', `Bearer ${key}`)
  .query({userId: window.localStorage.userId})
  .end((err, res) => {
    if (err) console.log(err)
    cxt.params.menu = JSON.parse(res.text)
    next()
  })
}
module.exports = menu
