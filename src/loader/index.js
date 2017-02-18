// const elLoader = require('./template')
const empty = require('empty-element')

module.exports = function loading (ctx, next) {
  var container = document.createElement('div')
  var loadingEl = document.createElement('div')
  container.classList.add('loader-container')
  loadingEl.classList.add('loader')
  container.appendChild(loadingEl)
  var main = document.getElementById('main-container')
  empty(main).appendChild(container)
  next()
}
