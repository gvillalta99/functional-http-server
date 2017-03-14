const urlParse = require('./url-parse')
const notEmptyString = (str) =>
  str.trim() !== ''

const treePath = (url) =>
  urlParse(url).path
    .split('/')
    .filter(notEmptyString)

module.exports = treePath
