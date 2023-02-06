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
        let [dw, dh] = i.size()
        w = max(w, dw + 10), h += dh + 5
      } o.temp.w = w, h = o.temp.h = max(l.height ?? 100, h)
      return [w, h]
    }
    o.pos = () => {
      let { x, y, w } = temp, lx = 5, ly = 5
      for (let i of child) {
        let pw = w - 10, ix, iy; if (pw > i.temp.w) { i.temp.w = pw }
        if (i.layout.position) { [ix, iy] = i.layout.position }
        else {
          ix = x + lx, iy = y + ly
          ly += i.temp.h + 5
        } i.temp.x = ix, i.temp.y = iy, i.pos()
      }
    }
    o.draw = () => {
      ctx.fillStyle = "#00000050"
      ctx.fillRect(temp.x, temp.y, temp.w, temp.h)
      for (let i of child) { i.draw() }
      o.temp = {}
    }
  } return o
}

$.button = () => { }

$.root = []
frame(t => {
  t /= 1000

  if (t < Infinity) {
    panel.layout.position = [100 * Math.sin(t) + 200, 100 * Math.cos(t) + 200]
    panel.layout.height = 500 + 200 * Math.sin(t)
  }

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  for (let i of root) { i.size() }
  let lx = 5, ly = 5, x = 0, y = 0, w = cvs.width
  for (let i of root) {
    let ix, iy
    if (i.layout.position) { [ix, iy] = i.layout.position }
    else {
      ix = x + lx, iy = y + ly
      ly += i.temp.h + 5
    } i.temp.x = ix, i.temp.y = iy

    let pw = w - i.temp.x - 5; if (pw > i.temp.w) { i.temp.w = pw }
    i.pos()
  }
  for (let i of root) { i.draw() }

  ctx.fillStyle = "black"
  ctx.font = "25px consolas"
  ctx.fillText("OK...", 100, 200)
  ctx.fillText(pnow().toFixed(1), 100, 230)
})

$.panel = box(
  box(),
  box(box(box(), box())),
  box(box(), box()),
  box(),
)
panel.layout.height = 800
root.push(panel, box())