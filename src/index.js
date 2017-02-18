'use strict'

require('./index.scss')
require('./bootstrap-3.3.7-dist/js/bootstrap.js')
require('font-awesome-webpack')
require('font-awesome-webpack!./font-awesome/font-awesome.config.js')
const page = require('page')

require('./login')
require('./homepage')
require('./inscripciones')
require('./reports/ingresos')
require('./exit')
require('./reports/ingresos/utils')
page();
