'use strict'

const request = require('superagent')
const key = require('../../config/secret-key')

function deserializeToken (token) {
  return new Promise((resolve, reject) => {
    request
  .get('/api/authenticate')
  .accept('json')
  .set({Authorization: token})
  .end((err, resp) => {
    if (err) reject(err)
    let user = JSON.parse(resp.text)
    user = user.token
    resolve(user)
  })
  })
}

function getCompanyById (id) {
  return new Promise((resolve, reject) => {
    request
    .get(`/api/company/${id}`)
    .accept('json')
    .set({Authorization: `Bearer ${key}`})
    .end((err, response) => {
      if (err) return reject(err)
      let result = JSON.parse(response.text)
      resolve(result)
    })
  })
}

function time (date) {
  let time = date.toLocaleTimeString()

  time = time.split(':')
  time = time.map(x => parseInt(x))

  let meridian = time[0] > 11 ? 'PM' : 'AM'

  time[0] = time[0] > 12 ? time[0] - 12 : time[0]

  return `${time[0]}:${time[1]}:${time[2]} ${meridian}`
}

module.exports = {
  deserializeToken,
  getCompanyById,
  time
}
