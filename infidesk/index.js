[, , , $.newidb, $.glutil] = await Promise.all([
  loadsym("./basic.js"), loadsym("./tween.js"), loadsym("./comp.js"),
  require("./idb.js"), require("./gl.js")
])

$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
await save.init

const body = document.body
compappend(body, $.cvs = canvas())
$.ctx = cvs.getContext("2d")

$.seed = 3952395901;[$.rd, $.rdi] = genrd(seed)
$.min = Math.min, $.max = Math.max
 
$.box = (...a) => {
  let o = {}; with (o) {
    o.type = "box"
    o.child = a
    o.temp = {}
    o.layout = {}
    o.matrix = new DOMMatrix()
    o.size = () => {
      let l = o.layout, w = l.width ?? 300, h = 5
      for (let i of child) {
        if (i.layout.position) { continue }
        let [dw, dh] = i.size()
        w = max(w, dw + 10), h += dh + 5
      } o.temp.w = w, h = o.temp.h = max(l.height ?? 100, h)
      return [w, h]
    }
    o.pos = () => {
      let { x, y, w } = temp, lx = 5, ly = 5
      for (let i of child) {
        let ix, iy
        if (i.layout.position) { [ix, iy] = i.layout.position }
        else {
          ix = x + lx, iy = y + ly
          ly += i.temp.h + 5
        }
        i.temp.x = ix, i.temp.y = iy
        i.pos(), i.grow(o)
      }
    }
    o.grow = (p) => {
      // let pw = w - 10; if (pw > i.temp.w) { i.temp.w = pw }
      // let pw = w - i.temp.x - 5; if (pw > i.temp.w) { i.temp.w = pw }
    }
    o.draw = () => {
      ctx.fillStyle = "#00000050"
      let m = new DOMMatrix().translate(temp.x, temp.y)
      ctx.setTransform(m)
      ctx.fillRect(0, 0, temp.w, temp.h)
      for (let i of child) { i.draw() }
      o.temp = {}
    }
  } return o
}

$.text = () => {
  let o = {}; with (o) {
    o.type = "text"
    o.child = []
    o.temp = {}
    o.layout = {}
    o.size = () => { }
    o.pos = () => { }
    o.grow = () => { }
    o.draw = () => { }
  } return o
}

$.root = () => {
  let o = {}; with (o) {
    o.type = "root"
    o.child = []
    o.size = () => { for (let i of child) { i.size() } }
    o.pos = () => {
      let lx = 5, ly = 5, x = 0, y = 0, w = cvs.width
      for (let i of child) {
        let ix, iy
        if (i.layout.position) { [ix, iy] = i.layout.position }
        else {
          ix = x + lx, iy = y + ly
          ly += i.temp.h + 5
        } i.temp.x = ix, i.temp.y = iy

        let pw = w - i.temp.x - 5; if (pw > i.temp.w) { i.temp.w = pw }
        i.pos()
      }
    }
    o.draw = () => { for (let i of child) { i.draw() } o.temp = {} }
  } return o
}

frame(t => {
  t /= 1000

  if (t < Infinity) {
    panel.layout.position = [100 * Math.sin(t) + 200, 100 * Math.cos(t) + 200]
    panel.layout.height = 500 + 200 * Math.sin(t)
  }

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  rt.size(), rt.pos(), rt.draw()
})

$.rt = root()
$.panel = box(
  box(),
  box(box(box(), box())),
  box(box(), box()),
  box(),
)
panel.layout.height = 800
rt.child.push(panel, box())

$.erf = x => {
  // save the sign of x
  let sign = (x >= 0) ? 1 : -1
  x = Math.abs(x)
  let a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  let a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  // A&S formula 7.1.26
  let t = 1.0 / (1.0 + p * x)
  let y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return sign * y // erf(-x) = -erf(x);
}

$.normpdf = (x, sd = 1, mn = 0) =>
  1 / (sd * Math.sqrt(2 * Math.PI)) * Math.exp(-1 / 2 * ((x - mn) / sd) ** 2)
$.normcdf = (x, sd = 1, mn = 0) => 1 / 2 * (1 + erf((x - mn) / Math.sqrt(2 * sd)))

const n = 100
const cdf = array(n, v => (normcdf((v + 1) / n, 0.1) - 0.5) * 2)
const revcdf = r => {
  let i = cdf.findIndex(v => v > r)
  let s = cdf[i - 1] ?? 0, e = cdf[i]
  if (i === -1) { i = n - 1, s = cdf[i], e = 1 }
  if (i === -1) { log(i, r, s, e, (i + (r - s) / (e - s)) / n) }
  return (i + (r - s) / (e - s)) / n
}
const nd = i => Math.floor(revcdf(rd()) * (Math.floor(i) + 1))

// Standard Normal variate using Box-Muller transform.
const gaussianRandom = (mean = 0, stdev = 1) => {
  let u = 1 - Math.random(), v = Math.random()
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}

// $.seed = hash(new Date().getTime().toString());[$.rd, $.rdi] = genrd(seed)