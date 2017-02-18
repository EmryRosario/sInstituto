'use strict'
const page = require('page')
const navbar = require('../navbar')
const loader = require('../loader')
const authenticate = require('../middlewares/authorization')

page('/', authenticate, navbar.getMenu, navbar.getSubmenu, navbar.navbar, loader, function homepage (ctx, next) {
  document.title = 'Matriculas - Pagina de inicio'
})
