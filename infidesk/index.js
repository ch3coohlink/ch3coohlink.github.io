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

$.seed = 3952395901
[$.rd, $.rdi] = genrd(seed)
$.min = Math.min, $.max = Math.max

$.screen = {
  type: "container", child: [],
  layout: { type: "fixed", width: "100%", height: "100%" },
}

frame(t => {
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  ctx.fillStyle = "black"

  for (const o of screen.child) {
    if (o.type === "text") {
      // const s = t / 0.1
      const s = t / 1000
      ctx.setTransform(new DOMMatrix().translate(w, h).scale(s)
        .translate(-o.width * 0.5, screen.cheight * 0.5 - o.bottom))
      log(o.x, o.y)
      ctx.font = o.size + " " + o.font
      // ctx.fillText(o.text, 0, 0)
    }
  }
})