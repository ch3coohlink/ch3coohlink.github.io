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
      let l = o.layout, w = l.width ?? 300
      let h = l.height ?? (child.length > 0 ? 5 : 100)
      for (const i of child) {
        let [dw, dh] = i.size()
        w = max(w, dw + 10), h += dh + 5
      } o.temp.w = w, o.temp.h = h
      return [w, h]
    }
    o.pos = (p) => {
      let pw = p.temp.w - 10
      if (pw > temp.w) { temp.w = pw }

      temp.lx = 5, temp.ly = 5
      let l = o.layout, x, y
      if (l.position) { [x, y] = l.position }
      else {
        x = p.temp.x + p.temp.lx
        y = p.temp.y + p.temp.ly
        p.temp.ly += temp.h + 5
      } temp.x = x, temp.y = y; return [x, y]
    }
    o.draw = (p) => {
      pos(p)
      ctx.fillStyle = "#00000010"
      ctx.fillRect(temp.x, temp.y, temp.w, temp.h)
      for (let i of child) { i.draw(o) }
      o.temp = {}
    }
  } return o
}

$.root = []
frame(t => {
  t /= 1000
  panel.layout.position = [100 * Math.sin(t) + 200, 100 * Math.cos(t) + 200]
  panel.layout.width = 500 + 100 * Math.sin(t * 3)

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  for (let i of root) { i.size() }
  // for (let i of root) { i.pos({ temp: { lx: 5, ly: 5 } }) }
  const o = { temp: { lx: 5, ly: 5, x: 0, y: 0 } }
  for (let i of root) { i.draw(o) }
})

$.panel = box(
  box(),
  box(box(box(), box())),
  box(box(), box()),
  box(),
)
panel.layout.position = [100, 100]
root.push(panel, box())