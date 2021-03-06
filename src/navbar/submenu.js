'use strict'

const request = require('superagent')
const key = require('../../config/secret-key')

module.exports = (ctx, next) => {
  request.get('/api/submenu-options')
  .set('Authorization', `Bearer ${key}`)
  .query({userId: window.localStorage.userId})
  .end((err, res) => {
    if (err) return err
    ctx.params.submenu = JSON.parse(res.text)
    next()
  })
}
