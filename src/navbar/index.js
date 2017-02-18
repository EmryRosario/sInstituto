'use strict'

const navbar = require('./template')
const empty = require('empty-element')
const submenu = require('./submenu')
const menu = require('./menu')

module.exports = {
  getMenu: menu,
  getSubmenu: submenu,
  navbar: (ctx, next) => {
    let header = document.getElementById('header')
    let el = navbar(ctx.params.menu, ctx.params.submenu)
    empty(header).appendChild(el)
    next()
  }
}
