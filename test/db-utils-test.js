'use strict'
const test = require('ava')
const db = require('../utils/db-utils')

test('Create connection to the database', async function (t) {
  let connection = await db.connect({password: 'er3030', database: 'DALLAS'})

  t.not(connection, null)
  t.throws(db.connect)
})

test.todo('Close Connection')
test.todo('execute query')
