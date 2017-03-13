const urlParse = require('./url-parse')
const Maybe = require('./lib/maybe')

const log = (tag) => (value) =>
  console.log(tag, value)
// console.log(paths)

const treePath = (url) =>
  urlParse(url).path
    .split('/')
    .filter(s => s !== '')

const notNull = (val) =>
  val !== null && val !== undefined
const isNull = (val) => !notNull(val)
const isParam = (str) => str[0] === ':'
const removeParam = (str) => str.split(':')[1]

const First = (x) => ({
  concat: (x) => First(x)
})

const id = (x) => x

const addRouteFn = (routes) => (method) => (path) => (handler) => {
  const splitedPath = treePath(path)

  const buildRoute = (newRoutes, path) => {
    Maybe(isNull)(path).map(path => {
      const key = Maybe(isParam)(path)
        .fold(id, _ => "#param")
      const newRoute = Maybe(isParam)(path)
        .fold(_ => ({}), _ => ({'#name': removeParam(path)}))
      return Maybe(notNull)(routes[key])
        .fold(_ => newRoute, id)
    }).fold(
      _ => null,
      id
    )
  }
  const route = splitedPath.reduce(buildRoute, routes)
  const methodKey = Maybe(notNull)(method)
    .map(method => method.toUpperCase())
    .fold(_ => '#middlewares', method => `#${method}`)
  route[methodKey] = [].concat(route[methodKey]).concat(handler)
  return routes
}

const addRoute = (rs) => (method) => (path) => (handler) => {
  const splitedPath = treePath(path)

  route = splitedPath.reduce((rs, path) => {
    if (isNull(path)) {
      return null;
    }
    let key = path
    if (isParam(path)) {
      key = '#param'
    }
    if (isNull(rs[key])) {
      // New Route :D
      const newRoute = {}
      if (isParam(path)) {
        newRoute['#name'] = removeParam(path)
      }
      rs[key] = newRoute
    }
    return rs[key]
  }, rs)
  if (isNull(method)) {
    route[`#middlewares`] = [].concat(route['#middleware']).concat(handler)
  } else {
    route[`#${method}`] = [].concat(route[`#${method}`]).concat(handler)
  }
  return rs
}

const routes = {
}

addRouteFn(routes)()('/')(log('middleware /'))
addRouteFn(routes)('GET')('/')(log('GET /'))
addRouteFn(routes)('GET')('/users')(log('GET /users'))
addRoute(routes)('POST')('/users')(log('POST /users'))
addRoute(routes)('GET')('/users/:id')(log('GET /users/:id'))
addRoute(routes)('GET')('/ok/:id')(log('GET /ok/:id'))
addRoute(routes)('POST')('/ok/:id/new')(log('POST /ok/:id'))
addRoute(routes)('POST')('/ok/oks/:id')(log('POST /ok/:id'))
addRoute(routes)('POST')('/ok/:id/new/:id')(log('POST /ok/:id'))

console.log(routes)

const navigateTree = (tree) => (urlsArr) =>
  urlsArr.reduce((state, p) => {
    const currentPath = state.currentPath
    if (notNull(currentPath['#middlewares'])) {
      state.context['#middlewares'] = 
        state.context['#middlewares'].concat(
          [].concat(currentPath['#middlewares']).filter(notNull)
        )
    }
    if (notNull(currentPath[p])) {
      return {
        currentPath: currentPath[p],
        context: state.context,
        pathName: state.pathName + '/' + p,
        '#middlewares': state['#middlewares']
      }
    } else if (notNull(currentPath['#param'])) {
      const param = {}
      state.context.params[state.currentPath['#param']['#name']] = p
      return {
        currentPath: currentPath['#param'],
        context: state.context,
        pathName: state.pathName + '/' + p,
        '#middlewares': state['#middlewares']
      }
    } else {
      return {
        currentPath: {},
        context: state.context,
        pathName: '404',
        '#middlewares': state['#middlewares']
      }
    }
  }, {currentPath: tree, context: {params: {}, '#middlewares': []}, pathName: ''})

methodHandler = (method) => {
}

urls = [
  '/',
  '/users',
  '/users/2312',
  '/dss',
  '/ok',
  '/ok/gustavo'
]

urls.forEach(url => {
  treePath(url), navigateTree(routes)(treePath(url))
})

module.exports = {routes, addRoute, addRouteFn}
