const Box = (x) => ({
  map: (f) => Box(f(x)),
  fold: (f) => f ? f(x) : x,
  inspect: `Box(${x})`
})

module.exports = Box
