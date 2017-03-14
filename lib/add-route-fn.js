const Maybe    = require('./maybe')
const { Map, List }  = require('immutable')
const treePath = require('./tree-path')
const notNull  = require('./not-null')
const isNull   = require('./is-null')

const NOT_FOUND_ROUTE = {}

const id = (x) => x

const formatMethod = (method) => Maybe(notNull)(method)
  .map((m) => '#' + m.toUpperCase())
  .fold((_) => '#middleware', id)

const isEmpty = (arr) => arr.isEmpty()
const notEmpty = (arr) => !isEmpty(arr)

const newRoute = (method, handler) => Map().set(formatMethod(method), [handler])

const addRouteFn = (routes) => (method) => (path) => (handler) => {
  const routesMap = Maybe(isNull)(routes).fold(
    (routes) => Map(routes),
    (_) => Map({})
  )
  const pathList = List(treePath(path))
  const node = newRoute(method, handler)

  return addRoute(routesMap)(pathList)(node);
}

const mergeRoutes = (routes) => (node) =>
  Map(routes).mergeWith(
    (oldHandlers, newHandler) => oldHandlers.concat(newHandler),
    node
  )

const addRoute = (routesMap) => (pathList) => (node) =>
  Maybe(notEmpty)(pathList)
    .map((paths) =>
      routesMap.set(
        paths.first(),
        addRoute(
          Maybe(notEmpty)(Map(routesMap)).fold(
            (routes) => routes,
            (routes) => Map(routes.get(paths.first()))
          )
        )(paths.skip(1))(node)
      )
    ).fold(
      (_) => mergeRoutes(routesMap)(node),
      (routes) => routes
    ).toJS()

module.exports = addRouteFn
