const express = require('express')
const app = express()
const routes = require('./routes')
const bearerToken = require('express-bearer-token')
const bodyParser = require('body-parser')
const db = require('./utils/db-utils')
const token = require('./utils/token-utils')
const authorization = require('./middlewares/authentication')

// const authenticate = require('./middlewares/authentication')

const port = process.env.PORT || 3000
app.set('view engine', 'pug')
app.use(express.static('app'))

app.use(bearerToken())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get(routes, (req, res) => {
  res.render('index')
})

app.post('/api/login', (req, res) => {
  db('COLUSERS').where({
    USR_USER: req.body.user,
    USR_CLAVE: req.body.password,
    USR_ESTADO: '1'
  }).select('USR_CODIGO', 'USR_USER', 'USR_CIA')
  .then(result => {
    if (result.length !== 1) throw (new Error('user validation error'))
    token.sign(result[0], {})
    .then(token => { res.json({err: null, token: token}) })
    .catch(err => { throw (err) })
  })
  .catch(err => {
    res.status(401)
    res.json({err: err.toString(), token: null})
  })
})

app.get('/api/authenticate', function authenticate (req, res, next) {
  token.validate(req.token)
  .then(token => {
    res.json({token: token, error: null})
  })
  .catch(err => {
    res.json({token: null, error: err.toString()})
  })
})

app.get('/api/menu-options', authorization, (req, res) => {
  db.select('MENU.MEN_CODIGO', 'MENU.MEN_DESCRI', 'MENU.MEN_ORDEN')
  .from('MENU')
  .orderBy('MENU.MEN_ORDEN')
  .innerJoin('COLACCESOS', 'MENU.MEN_CODIGO', 'COLACCESOS.ACC_CODMEN')
  .distinct('COLACCESOS.ACC_CODMEN')
  .where('MENU.MEN_CIA', 1)
  .where('MENU.MEN_ESTATU', 'A')
  .where('MENU.MEN_WEB', 'S')
  .where('COLACCESOS.ACC_CODUSR', req.query.userId)

  .then(result => {
    res.json(result)
  })
})

app.get('/api/submenu-options', authorization, (req, res) => {
  db.select('SUBMENU.SUB_CODMEN', 'SUBMENU.SUB_CODIGO', 'SUBMENU.SUB_DESCRI', 'SUBMENU.SUB_CAPTION', 'SUBMENU.SUB_LINK', 'SUBMENU.SUB_ORDEN')
  .from('SUBMENU')
  .orderBy('SUBMENU.SUB_ORDEN')
  .distinct('COLACCESOS.ACC_CODSUB')
  .innerJoin('COLACCESOS', 'SUBMENU.SUB_CODIGO', 'COLACCESOS.ACC_CODSUB')
  .where('SUBMENU.SUB_CIA', 1)
  .where('SUBMENU.SUB_ESTATU', 'A')
  .where('SUBMENU.SUB_WEB', 'S')
  .where('COLACCESOS.ACC_CODUSR', req.query.userId)
  .then(result => {
    res.json(result)
  })
})

app.get('/api/reporte/ingreso', authorization, (req, res) => {
  let conditionCOB = {}
  let conditionENC = {}

  if (req.query.user) {
    conditionCOB['COB_CODUSR'] = req.query.user
    conditionENC['ENC_IDUSR'] = req.query.user
  }
  db
  .select('Cob_Matric AS matricula', 'Est_Nombre AS nombre', 'Cob_Numero AS recibo', 'Cob_Secuen AS sec', 'Cob_Feccha AS fecha', 'Cob_Hora AS hora', 'Cob_Descri AS concepto', 'Cob_Total AS total', 'COLUSERS.USR_USER AS user')
  .from('COLCOBROS')
  .join('COLESTUDIA', function () {
    this.on('COLCOBROS.COB_MATRIC', '=', 'COLESTUDIA.EST_MATRIC')
    .andOn('COLESTUDIA.EST_CODCOL', '=', 'COLCOBROS.COB_CODCOL')
  })
  .join('COLUSERS', function () {
    this.on('COLUSERS.USR_CIA', '=', 'COLCOBROS.COB_CODCOL')
    .andOn('COLUSERS.USR_CODIGO', '=', 'COLCOBROS.COB_CODUSR')
  })
  .where('COLCOBROS.COB_ESTADO', 1)
  .where('COLCOBROS.COB_TIPMOV', '<>', 3)
  .where('COLCOBROS.COB_FECCHA', '>=', req.query.fechaDesde)
  .where('COLCOBROS.COB_FECCHA', '<=', req.query.fechaHasta)
  .where('COLCOBROS.COB_CODCOL', req.query.company)
  .where(conditionCOB)
  .unionAll(function () {
    this
    .select('FACENC.Enc_CodCli AS encCodCli', 'COLESTUDIA.Est_Nombre AS estNombre', 'FACENC.Enc_Numero AS encNumero', 'FACDET.Det_Linea AS sec', 'FACENC.Enc_Fecha AS encFecha', 'FACENC.Enc_Hora AS encHora', 'FACDET.Det_Descri AS detDescri')
    .select(db.raw('FACDET.Det_Total + FACDET.Det_Itbis'))
    .select('FACENC.Enc_User AS encUser')
    .from('FACENC')
    .join('FACDET', function () {
      this.on('FACDET.DET_CIA', '=', 'FACENC.ENC_CIA')
      .andOn('FACDET.DET_NUMERO', '=', 'FACENC.ENC_NUMERO')
    })
    .join('COLESTUDIA', function () {
      this.on('COLESTUDIA.EST_CODCOL', '=', 'FACENC.ENC_CIA')
      .andOn('COLESTUDIA.EST_MATRIC', '=', 'FACENC.ENC_CODCLI')
    })
    .where('FACENC.ENC_ESTADO', 'A')
    .where('FACDET.DET_ESTADO', 'A')
    .where('FACENC.ENC_CIA', req.query.company)
    .where('FACENC.ENC_FECHA', '>=', req.query.fechaDesde)
    .where('FACENC.ENC_FECHA', '<=', req.query.fechaHasta)
    .where(conditionENC)
  })
  .then((result) => {
    console.log(result)
    res.json(result)
  })
  .catch((err) => {
    console.log(err)
    res.json(req)
  })
})

app.get('/api/cursos', authorization, (req, res) => {
  db
  .from('COLCURSOS')
  .select('CUR_CODIGO AS code', 'CUR_DESCRI AS course')
  .where('CUR_CODCOL', req.query.company)
  .then((result) => {
    res.json(result)
  })
  .catch((err) => {
    res.status(500)
    console.log(err)
    res.send(err)
  })
})

app.get('/api/users', authorization, (req, res) => {
  db.from('COLUSERS')
  .select('USR_CODIGO AS code', 'USR_USER AS user')
  .where('USR_CIA', req.query.company)
  .then((result) => {
    res.json(result)
  })
  .catch((err) => {
    res.status(500)
    res.send(err)
  })
})

app.get('/api/company/:id', authorization, (req, res) => {
  let id = req.params.id
  db
  .select('COL_CODIGO AS code')
  .select('COL_RNC AS rnc')
  .select('COL_NOMBRE AS name')
  .select('COL_DIRECC AS address')
  .select('COL_SECTOR AS sector')
  .select('COL_WEB AS web')
  .select('COL_ABREVI AS abbreviation')
  .from('COLEGIOS')
  .where('COL_CODIGO', id)
  .then(result => res.json(result[0]))
  .catch(err => {
    if (err) {
      res.json({error: new Error('The company was not found')})
    }
  })
})

app.listen(port, () => console.log('Server listen on port 3000'))

 // Select e.Enc_CodCli,m.Est_Nombre,e.Enc_Numero,d.Det_Linea Sec,e.Enc_Fecha,e.Enc_Hora,d.Det_Descri,d.Det_Total+d.Det_Itbis,e.Enc_User " & _
 //                    " From FACENC e," & _
 //                    "      FACDET d, " & _
 //                    "   VW_MATRICULAS m " & _
 //                    " Where e.Enc_Cia = d.Det_Cia " & _
 //                    " And e.Enc_Numero = d.Det_Numero " & _
 //                    " And m.Est_CodCol = e.Enc_Cia " & _
 //                    " And m.Est_Matric = e.Enc_CodCli " & _
 //                    " And e.Enc_Estado = 'A' " & _
 //                    " And d.Det_Estado = 'A'" & _
 //                    " And e.Enc_Cia = " & mCia & _
 //                    " And e.Enc_Fecha >= " & mFechaDesde & _
 //                    " And e.Enc_Fecha <= " & mFechaHasta & _
 //                    mCondUsuario2
