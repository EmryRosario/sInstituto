'use strict'

const page = require('page')
const navbar = require('../../navbar')
const loader = require('../../loader')
const authenticate = require('../../middlewares/authorization')
const empty = require('empty-element')
const yo = require('yo-yo')
const $ = require('jquery')
const request = require('superagent')
const urlRequest = require('../../../config/url')
const key = require('../../../config/secret-key')
const {requestParams} = require('./utils')
const {deserializeToken, getCompanyById} = require('../../utils')

page('/reporte/ingreso', authenticate, navbar.getMenu, navbar.getSubmenu, navbar.navbar, requestParams, loader, function parametroIngreso (ctx, next) {
  document.title = 'Parametros reporte de ingresos'
  let mainContainer = document.getElementById('main-container')
  empty(mainContainer).appendChild(template(ctx.dataParams))
  $('#modalParametroIngreso').modal('show')
})

page.exit('/reporte/ingreso', (ctx, next) => {
  document.title = 'Matriculas'
  let mainContainer = document.getElementById('main-container')
  empty(mainContainer)
  next()
})

function template (data) {
  let el = yo`<div class="modal fade" id="modalParametroIngreso" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><a><i class="fa fa-times" aria-hidden="true"></i></a></span></button>
        <h4 class="modal-title">Ingresos</h4>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 text-right">
              <div class="radio">
                
                <label class="radio-inline">
                 <input type="radio" name="rptForma" id="rptForma1" value="1">
                 Detallado
                </label>

                <label class="radio-inline">
                 <input type="radio" name="rptForma" id="rptForma1" value="2">
                 Resumido
                </label>
            </div>
              </div>
            <div class="col-xs-12 col-sm-12 col-md-6">
              
              <div class="form-group">
                <label for="txtFechaDesde">Desde</label>
                <input type="date" class="form-control" id="txtFechaDesde" name="txtFechaDesde" />
              </div>

              <div class="form-group">
                <label for="txtFechaHasta">Hasta</label>
                <input type="date" class="form-control" id="txtFechaHasta" name="txtFechaHasta" />
              </div>

            </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            
            <div class="form-group">
              <label for="optCourse">Curso</label>
              <select id="optCourse" class="form-control">
                <option value="0">Todos</option>
                ${data.courses.map(listCourses)}
              </select>
            </div>

            <div class="form-group">
              <label for="optUser">Usuario</label>
              <select id="optUser" class="form-control">
                <option value="0">Todos</option>
                ${data.users.map(listUsers)}
              </select>
            </div>             
          </div>

        </div>

      </div>
      <div class="modal-footer">
        
        <button type="button" class="btn btn-default cancel" data-dismiss="modal">
          <i class="fa fa-ban" aria-hidden="true"></i>
        </button>
       
        <button type="button" onclick=${getReport} class="btn btn-primary success">
         <i class="fa fa-check" aria-hidden="true"></i>
        </button>
      
      </div>
    </div>
  </div>
</div>`

  return el
}

function listCourses (element) {
  return yo`<option value=${element.code}>${element.course}</option>`
}
function listUsers (element) {
  return yo`<option value=${element.code}}>${element.user}</option>`
}

function getReport (e) {
  e.preventDefault()
  let fechaDesde = document.getElementById('txtFechaDesde').value
  let fechaHasta = document.getElementById('txtFechaHasta').value
  let course = document.getElementById('optCourse').value
  let user = document.getElementById('optUser').value

  if (user === '0') { user = null }

  deserializeToken(window.localStorage.matriculaToken)
  .then(userToken => {
    request
  .get(`${urlRequest}/api/reporte/ingreso`)
  .accept('json')
  .set({Authorization: `Bearer ${key}`})
  .query({
    fechaDesde,
    fechaHasta,
    course,
    user,
    company: userToken['USR_CIA']
  })
  .set('Accept', 'application/json')
  .end((err, resp) => {
    if (err) {
      $('#modalParametroIngreso').modal('show')
      return err
    }
    let result = JSON.parse(resp.text)
    getCompanyById(userToken['USR_CIA'])
    .then(company => {
      renderReport(result, company)
    })
  })
  })
  $('#modalParametroIngreso').modal('hide')
  loader(null, function () {})
}

function renderReport (report, company) {
  let container = document.getElementById('main-container')

  let el = yo`
  <div id="report-container">
    <div id="report-buttons" class="container-fluid text-right">
      <a href="/reporte/ingreso" class="btn btn-danger" id="btn-cancel">Cancelar</a>
      <button class="btn btn-primary" onclick=${print} id="btn-success">Imprimir</button>
    </div>
   
    <div id="report-content">
        <table class="table table-striped table-hover">
         <thead>
            <th colspan="9"><div class=" text-center table-header">${company.name}</div></th>
            <tr>
              <th>Recibo</th>
              <th>Fecha</th>
              <th>Matricula</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Sec</th>
              <th>Hora</th>
              <th>Concepto</th>
              <th>Total</th>
            </tr>
            </thead>
          <tbody>
            ${report.map(formatRow)}
          </tbody>
        </table>
    </div>
  </div>
 `
  empty(container).appendChild(el)
}

function formatRow (element) {
  return yo`
    <tr>
      <td>${element.recibo}</td>
      <td>${element.fecha.substring(0, 10)}</td>
      <td>${element.matricula}</td>
      <td>${element.nombre}</td>
      <td>${element.user}</td>
      <td>${element.sec}</td>
      <td>${element.hora.substring(11, 23)}</td>      
      <td>${element.concepto}</td>
      <td>${element.total}</td>            
    </tr>    
  `
}

function print (e) {
  e.preventDefault()
  $('#report-buttons').hide()
  window.print()
  $('#report-buttons').show()
}
