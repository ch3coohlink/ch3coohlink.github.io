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

$.defseq = $d => {
  let keyname = "init formula step".split(" ")
  keyname.forEach(k => $d["_" + k] = tofunc(funcbody($d[k] ?? (() => { }))))
  return (i = $, a, o = inherit(i, a)) => {
    with (o) {
      o.frame = 0, o.t = 0, o.ft ??= 1 / 60
      o.init = () => { o.frame = 0, $d._init(_, _, o) }
      o.formula = (t = ft * frame) => { o.t = t, $d._formula(_, _, o) }
      o.step = () => {
        o.t = ft * frame, $d._step(_, _, o), $d._formula(_, _, o), o.frame++
      }
      o.jumpto = (t, l = Math.floor(t / ft)) => {
        init(); while (frame < l) { step() }
      }
    } o.init(); return o
  }
}

$.pause = false
$.step = () => {
  $.draw = []

  a.step()

  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  ctx.fillStyle = "white"
  for (const [f, ...a] of draw) {
    ctx[f](...a)
  }
}

$.jump = throttle((t, l) => {
  $.pause = true
  l ? a.jumpto(_, Math.max(l, 0)) : a.jumpto(Math.max(t, 0))
  step()
})

addEventListener("keydown", e => {
  const acsm = [e.altKey, e.ctrlKey, e.shiftKey, e.metaKey].map(v => v ? 1 : 0).join("")
  // log(e.key, acsm)
  if (acsm === "0000") {
    if (e.key === " ") { a.jumpto(0) }
    // if (e.key === " ") { $.pause = !pause }
    // else if (e.key === "ArrowUp") { jump(a.t - 1) }
    // else if (e.key === "ArrowDown") { jump(a.t + 1) }
    // else if (e.key === "ArrowLeft") { jump(_, a.frame - 2) }
    // else if (e.key === "ArrowRight") { jump(_, a.frame) }
  }
})

$.min = Math.min, $.max = Math.max
//=================================================

$.rect = defseq({
  formula: () => {
    const s = tween.easeOutElastic(min(max(t, 0), d), 0, es, d), sd2 = s / 2
    draw.push(["fillRect", x * cvs.width - sd2, y * cvs.height - sd2, s, s])
    // draw.push(["fillText", text, x * cvs.width - sd2, y * cvs.height - sd2 - 3])
  },
})

$.arr = array(100, i => {
  return rect($, {
    x: rd(0.1, 0.9), y: rd(0.1, 0.9),
    es: rd(10, 20), d: 1,
    text: (i + 1).toString().padStart(2, "0")
  })
})

$.a = defseq({
  init: () => {
  },
  formula: () => {
    for (const o of arr) { o.formula(t) }
  },
})()

// frame(() => { if (!pause) { step() } }, 1000)
frame(() => { if (!pause) { step() } })