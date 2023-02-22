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
      let pw = w - i.temp.x - 5; if (pw > i.temp.w) { i.temp.w = pw }
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