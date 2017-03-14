const tap = require('tap')
const treePath = require('../../lib/tree-path')

module.exports = {
  '/this/is/ok': tap.match(treePath('/this/is/ok'), ['this','is','ok']),
  '/this///is/messed': tap.match(treePath('/this///is/messed'), ['this','is','messed']),
  'missing/the/first/slash': tap.match(treePath('missing/the/first/slash'), ['missing','the','first','slash'])
}
