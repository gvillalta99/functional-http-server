const t = require('tap')
const urlParse = require('../../lib/url-parse')

const protocol = 'http:'
const auth = 'user:password'
const hostname = 'test.url.com'
const port = '8080'
const host = `${hostname}:${port}`
const pathname = '/path/id'
const search = '?q=query'
const path = `${pathname}${search}`
const href = `${protocol}//${auth}@${hostname}:${port}${path}`
const slashes = true

module.exports = t.match(
  urlParse(href),
  { auth,
    hash: null,
    host,
    hostname,
    href,
    path,
    pathname,
    port,
    protocol,
    query: {q: 'query'},
    search,
    slashes }
)
