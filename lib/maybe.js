const Right = require('./right')
const Left  = require('./left')

const Maybe = (fn) => (x) =>
  fn(x) ? Right(x) : Left(x)

module.exports = Maybe
