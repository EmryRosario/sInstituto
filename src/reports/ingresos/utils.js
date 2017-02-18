'use strict'
const request = require('superagent')
const key = require('../../../config/secret-key')
const co = require('co')
const {deserializeToken} = require('../../utils')

function courses (company) {
  return new Promise((resolve, reject) => {
    request
    .get('/api/cursos')
    .set({Authorization: `Bearer ${key}`})
    .accept('json')
    .query({company})
    .end((err, resp) => {
      if (err) reject(err)
      let courses = JSON.parse(resp.text)
      resolve(courses)
    })
  })
}

function users (company) {
  return new Promise((resolve, reject) => {
    request
    .get('/api/users')
    .set({Authorization: `Bearer ${key}`})
    .accept('json')
    .query({company})
    .end((err, resp) => {
      if (err) reject(err)
      let users = JSON.parse(resp.text)
      resolve(users)
    })
  })
}

function dataParams () {
  const taskUsers = users.bind(this)
  const taskCourses = courses.bind(this)

  const task = co.wrap(function* () {
    let user = yield deserializeToken(window.localStorage.matriculaToken)
    let courses = yield taskCourses(user['USR_CIA'])
    let userList = yield taskUsers(user['USR_CIA'])
    return Promise.resolve({users: userList, courses})
  })
  return Promise.resolve(task())
}

function requestParams (ctx, next) {
  dataParams()
  .then((result) => {
    ctx.dataParams = result
    next()
  })
}

module.exports = {
  requestParams
}
