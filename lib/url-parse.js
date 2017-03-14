const url = require('url')

function urlParse(urlString) {
  return url.parse(urlString, true)
}

module.exports = urlParse
