const http     = require('http')
const urlParse = require('./url-parse')
const Promise  = require('bluebird')
const server   = http.createServer()

console.log('STARTED')
const extractContext = (request) => ({
  headers: request.headers,
  method: request.method,
  url: urlParse(request.url)
})

const appendToBody = (body) => (data) =>
  body.push(data)

const convertBodyToString = (body) => (context) => (fn) => () => {
  context.body = Buffer.concat(body).toString()
  fn(context)
}

const receiveRequestData = (request) =>
  new Promise((resolve, reject) => {
    const body = []
    const context = extractContext(request)
    request.on('aborted', reject)
    request.on('close', reject)
    request.on('data', appendToBody(body))
    request.on('error', reject)
    request.on('end', convertBodyToString(body)(context)(resolve))
  })

const respondWithSuccess = (response) => (context) => {
  response.on('error', function(err) {
    console.error("RESPONSE ERROR", err);
  });

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  // response.writeHead(200, {'Content-Type': 'application/json'})

  response.write(JSON.stringify(context));
}

const mainLoop = (request, response) => {
  receiveRequestData(request)
    .then(respondWithSuccess(response))
    .then(() => response.end())
    .catch(function(err) {
      console.error("REQUEST ERROR", err);
    })
}
server.on('request', mainLoop)

module.exports = server
