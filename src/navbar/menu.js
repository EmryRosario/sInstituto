'use strict'

const request = require('superagent')
const key = require('../../config/secret-key')
const url = require('../../config/url')

function menu (cxt, next) {
  request.get(`${url}/api/menu-options`)
  .set('Authorization', `Bearer ${key}`)
  .query({userId: window.localStorage.userId})
  .end((err, res) => {
    if (err) console.log(err)
    cxt.params.menu = JSON.parse(res.text)
    next()
  })
}
module.exports = menu
