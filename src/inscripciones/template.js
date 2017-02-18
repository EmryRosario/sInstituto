const yo = require('yo-yo')

let el = yo`<div class="container-fluid">
  <div class="row">
    <div class="col-xs-12 col-sm-12">
      <form id="formInscripciones">
        <div class="form-group">
          <label for="txtMatriculaInscripcion">Matricula</label>
          <select name="txtMatricula" class="form-control" id="txtMatricula"></select>
        </div>
        <div class="form-group">
          <label for="txtFamiliaInscripcion" id="txtFamiliaInscripcion">Familia</label>
          <select name="txtFamiliaInscripcion" class="form-control" id="txtFamiliaInscripcion"></select>
        </div>
        <div class="form-group">
          <label for="txtNombreInscripcion"></label>
          <input type="text" id="txtNombreInscripcion" class="form-control">
        </div>
        <div class="form-group">
          <label for="txtApellidosInscripcion">Apellidos</label>
          <input type="text" id="txtApellidosInscripcion" class="form-control">
        </div>
        <div class="form-group">
          <label for="radGeneroInscripcion">Genero</label>
          <div class="radio">
            <label>
              <input type="radio" name="radGeneroInscripcion" id="radGeneroInscripcionM" value="M">
              Masculino
            </label>
          </div>
          <div class="radio">
            <label>
              <input type="radio" name="radGeneroInscripcion" id="radGeneroInscripcionF" value="F">
              Femenino
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="txtDireccionInscripcion">Direccion</label>
          <input type="text" class="form-control" id="txtDireccionInscripcion">
        </div>
        <div class="form-group">
          <label for="txtNacionalidadInscripcion" id="txtNacionalidadInscripcion">Nacionalidad</label>
          <select name="txtNacionalidadInscripcion" class="form-control" id="txtNacionalidadInscripcion"></select>
        </div>
        <div class="form-group">
          <label for="txtCiudadInscripcion" id="txtCiudadInscripcion">Ciudad</label>
          <select name="txtCiudadInscripcion" class="form-control" id="txtCiudadInscripcion"></select>
        </div>
        <div class="form-group">
          <label for="txtMunicipioInscripcion" id="txtMunicipioInscripcion">Municipio</label>
          <select name="txtMunicipioInscripcion" class="form-control" id="txtMunicipioInscripcion"></select>
        </div>
        <div class="form-group">
          <label for="txtTelefonoInscripcion">Telefono</label>
          <input type="text" class="form-control" id="txtTelefonoInscripcion">
        </div>
        <div class="form-group">
          <label for="txtEmailInscripcion">Email</label>
          <input type="text" class="form-control" id="txtEmailInscripcion">
        </div>
        <div class="form-group text-right">
          <button id="btnCancelInscripcion" class="btn btn-danger">Cancelar</button>
          <button id="btnSaveInscripcion" class="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</div>`

module.exports = el
