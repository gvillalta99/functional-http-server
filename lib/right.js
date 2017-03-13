const Right = (x) => ({
  fold: (l, r) => r(x),
  map: (f) => Right(f(x)),
  inspect: `Right(${x})`,
  x: x
})

module.exports = Right
