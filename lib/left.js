const Left = (x) => ({
  fold: (l, r) => l(x),
  map: (f) => Left(x),
  inspect: `Left(${x})`,
  x: x
})

module.exports = Left
