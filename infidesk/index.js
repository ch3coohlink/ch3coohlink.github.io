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
  $.pause = true; l ? a.jumpto(_, Math.max(l, 0))
    : a.jumpto(Math.max(t, 0)), step()
})

$.seed = 3952395901;[$.rd, $.rdi] = genrd(seed)
addEventListener("keydown", e => {
  const acsm = [e.altKey, e.ctrlKey, e.shiftKey
    , e.metaKey].map(v => v ? 1 : 0).join("")
  if (acsm === "0000") {
    if (e.key === " ") {
      [$.rd, $.rdi] = genrd(seed)
      a.jumpto(0)
    }
  } else if (acsm === "0100") {
    if (e.key === " ") {
      $.seed = rd() * 2 ** 32;[$.rd, $.rdi] = genrd(seed)
      a.jumpto(0)
    }
  }
})

$.min = Math.min, $.max = Math.max
//=================================================

$.rect = defseq({
  formula: () => {
    const s = tween.easeOutElastic(min(max(t, 0), d), 0, es, d), sd2 = s / 2
    draw.push(["fillRect", x * cvs.width - sd2, y * cvs.height - sd2, s, s])
    draw.push(["fillText", text, x * cvs.width - sd2, y * cvs.height - sd2 - 3])
  },
})

$.a = defseq({
  init: () => {
    $.arr = array(100, i => {
      return rect($, {
        x: rd(0.1, 0.9), y: rd(0.1, 0.9), es: rd(10, 20), d: 2,
        text: (i + 1).toString().padStart(2, "0")
      })
    })
  },
  formula: () => {
    // if (t > 0) { popin("") }
    if (t > 3) { for (const o of arr) { o.formula(t - 3) } }
  },
})()

// frame(() => { if (!pause) { step() } }, 1000)
// frame(() => { if (!pause) { step() } })

{
  $.screen = {
    type: "container", child: [],
    layout: { type: "fixed", width: "100%", height: "100%" },

  }

  screen.child.push({
    type: "text", value: "测试一些中文😍🥰abcdefghijklmnopqrstuvwxyz",
    size: "25px",
    layout: { type: "item", }
  })

  for (const o of screen.child) {
    if (o.type === "text") {
      ctx.font = "25px consolas"
      o.width = ctx.measureText(o.value)
      log(o.width)
    }
  }

  frame(t => {
    ctx.save()
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cvs.width, cvs.height)
    ctx.fillStyle = "black"
    for (const o of screen.child) {
      // caluculate parent size
    }
    for (const o of screen.child) {
      if (o.type === "text") {
        // position
        // color
        // font
        // align
        // baseline
        let size = (t / 1000) ** 2
        ctx.font = size + "px consolas"

        o.width = ctx.measureText(o.value)

        let x = 100, y = 800

        let r = size / (o.width.fontBoundingBoxAscent + o.width.fontBoundingBoxDescent)
        log(size.toFixed(4), r.toFixed(4))

        ctx.strokeStyle = "black"
        ctx.strokeRect(x - 2, y - 2, 4, 4)

        ctx.fillText(o.value, x, y)
        ctx.fillRect(x, y, o.width.width, 1)

        ctx.fillRect(x - 5, y,
          1, o.width.fontBoundingBoxDescent + 1)

        ctx.fillStyle = "blue"
        ctx.fillRect(x, y + o.width.fontBoundingBoxDescent,
          o.width.width, 1)

        ctx.fillStyle = "red"
        ctx.fillRect(x, y - o.width.fontBoundingBoxAscent,
          o.width.width, 1)

        ctx.fillStyle = "green"
        ctx.fillRect(x, y - o.width.actualBoundingBoxAscent,
          o.width.width, 1)
        ctx.fillRect(x - 2, y - o.width.actualBoundingBoxAscent,
          1, size)

        ctx.fillStyle = "black"
        x += o.width.width
        ctx.fillText(o.value, x, y)
      }
    }
    ctx.restore()
  })
}

// {
//   let t = 0
//   let seq = []

//   let text = init => ({ type: "text", value: init })
//   let popin = (...a) => { seq.push([t, "popin", ...a]), t += popin.timer(...a) }
//   let change = (...a) => { seq.push([t, "change", ...a]), t += change.timer(...a) }

//   {
//     let a = text("如何在计算机上绘制文本")
//     let b = text("...或者说任意矢量图形")
//     enter(a, "popin", 1)
//     wait(0.5)
//     enter(b, "popin", 1)
//     wait(0.5)
//     leave([a, b], 1)

//     change(o, 1, "cba")
//   }
// }