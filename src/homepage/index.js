'use strict'
const page = require('page')
const navbar = require('../navbar')
const loader = require('../loader')
const authenticate = require('../middlewares/authorization')
const empty = require('empty-element')
page('/', authenticate, navbar.getMenu, navbar.getSubmenu, navbar.navbar, loader, function homepage (ctx, next) {
  document.title = 'Matriculas - Pagina de inicio'

  let mainContainer = document.getElementById('main-container')
  let logoContainer = document.createElement('div')
  logoContainer.id = 'logo-container'
  logoContainer.className = 'logo-container'
  mainContainer.className += ' main-container-center'
  empty(mainContainer).appendChild(logoContainer)
})
