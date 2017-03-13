const test = require('tape')
const urlParse = require('../url-parse')

test('url-parse.js', t => {
  const protocol = 'http:'
  const auth = 'user:password'
  const hash = null
  const hostname = 'test.url.com'
  const port = '8080'
  const host = `${hostname}:${port}`
  const pathname = '/path/id'
  const search = '?q=query'
  const path = `${pathname}${search}`
  const href = `${protocol}//${auth}@${hostname}:${port}${path}`
  const slashes = true

  t.deepEqual(
    urlParse(href),
    { auth,
      hash,
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
  t.end()
})
