const test = require('tape')
const Maybe = require('../../lib/maybe')

const Truthy = Maybe(x => x === true)
test('maybe', (t) => {
  t.equal(Truthy(true).fold(x => 'left', x => 'right'), 'right')
  t.equal(Truthy(false).fold(x => 'left', x => 'right'), 'left')
  t.end()
})

