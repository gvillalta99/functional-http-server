const tap = require('tap')
const Maybe = require('../../lib/maybe')

const Truthy = Maybe((x) => x === true)

module.exports = {
  Truthy: tap.equal(Truthy(true).map((_) => 'right').fold((x) => 'left', (x) => x), 'right'),
  Falsey: tap.equal(Truthy(false).map((_) => 'right').fold((x) => 'left', (x) => 'right'), 'left')
}
