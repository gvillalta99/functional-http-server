const tap = require('tap')
const addRouteFn = require('../../lib/add-route-fn')

const nullRoute      = addRouteFn()('GET')('/')('METHOD 1')
const rootRoute      = addRouteFn({})('GET')('/')('METHOD 1')
const rootMiddleware = addRouteFn({})()('/')('MIDDLEWARE 1')
const usersRoute     = addRouteFn({})('GET')('/users')('METHOD 2')
const deepPath       = addRouteFn({})('GET')('/users/home/path')('METHOD 3')
const postUsersPath  = addRouteFn(usersRoute)('POST')('/users')('METHOD 4')
const postUsersPath2 = addRouteFn(postUsersPath)('POST')('/users')('METHOD 5')
const getUserPath    = addRouteFn({})('GET')('/users/:id')('METHOD 6')

module.exports = {
  'NULL ROUTE': tap.match(nullRoute,{
    '#GET': ['METHOD 1']
  }),
  'GET /': tap.match(rootRoute, {
    '#GET': ['METHOD 1']
  }),
  'Middleware /': tap.match(rootMiddleware, {
    '#middleware': ['MIDDLEWARE 1']
  }),
  'GET /users': tap.match(usersRoute, {
    'users': {
      '#GET': ['METHOD 2']
    }
  }),
  'GET /users/home/path': tap.match(deepPath, {
    'users': {
      'home': {
        'path': {
          '#GET': ['METHOD 3']
        }
      }
    }
  }),
  'POST /users': tap.match(postUsersPath, {
    'users': {
      '#GET': ['METHOD 2'],
      '#POST': ['METHOD 4']
    }
  }),
  'POST /users 2': tap.match(postUsersPath2, {
    'users': {
      '#GET': ['METHOD 2'],
      '#POST': ['METHOD 4', 'METHOD 5']
    }
  }),
  'GET /users/:id': tap.match(getUserPath, {
    'users': {
      '#param': {
        '#name': 'id',
        '#GET': ['METHOD 6']
      }
    }
  })
}
