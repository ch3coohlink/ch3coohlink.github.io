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
    type: "text", text: "e",
    size: "50px", font: "consolas"
  })

  let getlines = (text, maxWidth) => {
    let words = text.split(" ")
    let lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      let word = words[i]
      let width = ctx.measureText(currentLine + " " + word).width
      if (width < maxWidth) {
        currentLine += " " + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  let w = 0, h = 0
  for (const o of screen.child) {
    if (o.type === "text") {
      ctx.font = o.size + " " + o.font
      const m = ctx.measureText(o.text)
      o.top = m.fontBoundingBoxAscent
      o.bottom = m.fontBoundingBoxDescent
      o.height = o.top + o.bottom
      o.width = m.width
    }
    w = Math.max(w, o.width)
    h += o.height
  }
  screen.cwidth = w
  screen.cheight = h
  log(w, h)

  $.testdiv = dom({
    style: {
      position: "fixed", top: `calc(50% - 10px)`,
      left: `calc(50% - 4px)`
    }, child: "e"
  })
  body.append(testdiv)

  frame(t => {

    testdiv.style.transform = `scale(${t / 100})`

    ctx.save()
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cvs.width, cvs.height)
    ctx.fillStyle = "black"

    const wp = screen.layout.width.match(/(\d+)%/)[1] / 100
    const hp = screen.layout.height.match(/(\d+)%/)[1] / 100
    const w = wp * cvs.width * 0.5, h = hp * cvs.height * 0.5
    for (const o of screen.child) {
      if (o.type === "text") {
        // o.x = w * 0.5
        o.x = (w - o.width) * 0.5
        o.y = (h + screen.cheight) * 0.5 - o.bottom
      }
    }

    for (const o of screen.child) {
      if (o.type === "text") {
        // const s = t / 0.1
        const s = t / 1000
        // ctx.setTransform(new DOMMatrix().scale(t / 1000, t / 1000))
        // ctx.setTransform(new DOMMatrix().scale3d(t / 1000, w * 0.5, h * 0.5))
        ctx.setTransform(new DOMMatrix().translate(w, h).scale(s)
          .translate(-o.width * 0.5, screen.cheight * 0.5 - o.bottom))
        log(o.x, o.y)
        ctx.font = o.size + " " + o.font
        // ctx.fillText(o.text, 0, 0)
      }
    }

    ctx.resetTransform()
    ctx.fillRect(0, h, w * 2, 1)
    ctx.fillRect(w, 0, 1, h * 2)

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