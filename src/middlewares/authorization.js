'use strict'
const request = require('superagent')
const page = require('page')
const swal = require('sweetalert')
const url = require('../../config/url')

module.exports = function (ctx, next) {
  if (window.localStorage.matriculaToken) {
    request.get(`${url}/api/authenticate`)
    .set('Authorization', window.localStorage.matriculaToken)
    .end((err, resp) => {
      if (err) {
        swal('Error', 'Necesita loguearse para acceder a esta opcion.', 'error')
        page.redirect('/login')
      }
      resp.body = JSON.parse(resp.text)
      if (window.localStorage.user === resp.body.token['USR_USER']) {
        window.localStorage.userId = resp.body.token['USR_CODIGO']
        next()
      } else {
        swal('Error', 'Necesita loguearse para acceder a esta opcion.', 'error')
        page.redirect('/login')
      }
    })
  } else {
    page.redirect('/login')
  }
}
