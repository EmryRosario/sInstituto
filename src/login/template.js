const yo = require('yo-yo')
const request = require('superagent')
const page = require('page')
const swal = require('sweetalert')
const url = require('../../config/url')

let el = yo`<div class="login-box">
  <div class="login-logo">
    <a href="/login"><b>DALLAS</b></a>
  </div>
  <div class="login-box-body">
    <p class="login-box-msg">Iniciar Sesion</p>

    <form>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group has-feedback">
            <input type="text" id="usuario" name="usuario" class="form-control" placeholder="Usuario">
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input type="password" id="contrasena" name="contrasena" class="form-control" placeholder="Contraseña">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
               
        </div>
        <div class="col-xs-4 pull-right">
          <button onclick=${logIn} class="btn btn-primary btn-block btn-flat">Entrar</button>
        </div>
      </div>
    </form>
    
  </div>
</div>`

function logIn (e) {
  e.preventDefault()

  let user = document.getElementById('usuario').value
  let password = document.getElementById('contrasena').value
  let userParams = {user: user, password: password}

  request
  .post(`${url}/api/login`)
  .accept('json')
  .send(userParams)
  .set('Accept', 'application/json')
  .end((err, resp) => {
    if (err) console.log(err)
    resp.body = JSON.parse(resp.text)
    if (resp.body.err) {
      swal('Error', 'Usuario o Contraseña incorrecto.', 'error')
    } else {
      window.localStorage.matriculaToken = resp.body.token
      window.localStorage.user = user
      page.redirect('/')
    }
  })
}

module.exports = el
