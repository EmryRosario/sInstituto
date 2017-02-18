'use strict'

const page = require('page')
const swal = require('sweetalert')

function exit (ctx, next) {
  window.localStorage.clear()
  swal('Exito', 'Se ha desconectado correctamente', 'success')
  page.redirect('/login')
}
page('/salir', exit)
