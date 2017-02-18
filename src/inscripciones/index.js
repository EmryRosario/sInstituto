const page = require('page')
const empty = require('empty-element')
const navbar = require('../navbar')
const loader = require('../loader')
const template = require('./template')
const authenticate = require('../middlewares/authorization')

page('/inscripciones', authenticate, loader, navbar.request, navbar.navbar, function inscripciones (ctx, next) {
  let container = document.getElementById('main-container')
  empty(container).appendChild(template)
})

