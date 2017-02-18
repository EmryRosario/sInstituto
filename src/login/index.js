let el = require('./template')
const empty = require('empty-element')
const page = require('page')
const loader = require('../loader')

page('/login', loader, (ctx, next) => {
  let header = document.getElementById('header')
  empty(header)
  document.getElementsByTagName('body')
  document.body.className = 'layout-boxed'
  let container = document.getElementById('main-container')
  empty(container).appendChild(el)
})

page.exit('/login', (ctxt, next) => {
  document.body.className = ''
  next()
})
