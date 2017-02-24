'use strict'

const page = require('page')
const navbar = require('../../navbar')
const loader = require('../../loader')
const authenticate = require('../../middlewares/authorization')
const empty = require('empty-element')
const yo = require('yo-yo')
const $ = require('jquery')
const request = require('superagent')
const key = require('../../../config/secret-key')
const {deserializeToken, getCompanyById, time} = require('../../utils')

page('/reporte/cuadre-caja', authenticate, loader, navbar.getMenu, navbar.getSubmenu, navbar.navbar, function parametroIngreso (ctx, next) {
  document.title = 'Cuadre de Caja'
  let mainContainer = document.getElementById('main-container')
  empty(mainContainer).appendChild(template())
  $('#modalParametroCuadreCaja').modal('show')
})

page.exit('/reporte/cuadre-caja', (ctx, next) => {
  document.title = 'Matriculas'
  let mainContainer = document.getElementById('main-container')
  empty(mainContainer)
  next()
})

function template () {
  let el = yo`<div class="modal fade" id="modalParametroCuadreCaja" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <a  class="close" onclick=${exitModal} aria-label="Close"><span aria-hidden="true"><a><i class="fa fa-times" aria-hidden="true"></i></a></span></a>
        <h4 class="modal-title">Cuadre de Caja</h4>
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
             <div class="row">
                 <div class="col-xs-12 col-sm-12 col-md-6">
                    
                    <div class="form-group">
                      <label for="txtFechaDesde">Desde</label>
                      <input type="date" class="form-control" id="txtFechaDesde" name="txtFechaDesde" />
                    </div>
                </div>
                  <div class="col-xs-12 col-sm-12 col-md-6">
                   <div class="form-group">
                    <label for="txtFechaHasta">Hasta</label>
                    <input type="date" class="form-control" id="txtFechaHasta" name="txtFechaHasta" />
                  </div>
                  </div>

             </div> 
        </div>

      </div>
      <div class="modal-footer">
        
        <a class="btn btn-default cancel" href="/" onclick=${exitModal}>
          <i class="fa fa-ban" aria-hidden="true"></i>
        </a>
       
        <button type="button" onclick=${getReport} class="btn btn-primary success">
         <i class="fa fa-check" aria-hidden="true"></i>
        </button>
      
      </div>
    </div>
  </div>
</div>`

  return el
}

function exitModal (e) {
  e.preventDefault()
  $('#modalParametroCuadreCaja').modal('hide')
  page.redirect('/')
}
function getReport (e) {
  e.preventDefault()
  let fechaDesde = document.getElementById('txtFechaDesde').value
  let fechaHasta = document.getElementById('txtFechaHasta').value

  deserializeToken(window.localStorage.matriculaToken)
  .then(userToken => {
    request
  .get('/api/reporte/ingreso')
  .accept('json')
  .set({Authorization: `Bearer ${key}`})
  .query({
    fechaDesde,
    fechaHasta,
    company: userToken['USR_CIA'],
    user: userToken['USR_CODIGO']
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
  $('#modalParametroCuadreCaja').modal('hide')
  loader(null, function () {})
}

function renderReport (report, company) {
  let container = document.getElementById('main-container')
  let currentDate = new Date()

  let el = yo`
  <div id="report-container">
    <div id="report-buttons" class="container-fluid text-right">
      <a href="/reporte/ingreso" class="btn btn-danger" id="btn-cancel"><i class="fa fa-ban" aria-hidden="true"></i> Cancelar</a>
      <button class="btn btn-primary" onclick=${print} id="btn-success"><i class="fa fa-print" aria-hidden="true"></i> Imprimir</button>
    </div>
   
    <div id="report-content">
        <table class="table table-striped table-hover">
         <thead>
            <th colspan="9">
              <div class="table-header">
                <div class="row date-report">
                  <div class="col-xs-12">Fecha: ${currentDate.toLocaleDateString()}</div>
                  <div class="col-xs-12">Hora: ${time(currentDate)}</div>
                </div>
                <div class="col-xs-4 col-xs-push-4">
                  <span class="text-center">${company.name}</span>
                </div>
              </div>
            </th>
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
