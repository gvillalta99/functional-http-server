const test = require('tape')
const server = require('../server')
const EventEmitter = require('events')
const Buffer = require('buffer').Buffer

class Request extends EventEmitter {};
const request = new Request();
request.url = "/path/id?q=query"
request.headers = {
  host: 'localhost:8080',
  connection: 'keep-alive',
  'accept-encoding': 'gzip, deflate',
  accept: 'application/json',
  'user-agent': 'HTTPie/0.9.2',
  'content-type': 'application/json',
  'content-length': '12',
  authorization: 'Basic dXNlcjpwYXNzd29yZA=='
}
request.method = 'POST'

class Response extends EventEmitter {};
const response = new Response();
response.setHeader = (h, v) => console.log('HEADER', h, v)
response.write = (b) => console.log('BODY', b)
response.end = console.log

test('server.js', t => {
  server.emit('request', request, response)
  request.emit('data', new Buffer('ok'))
  request.emit('end')
  t.end()
})
