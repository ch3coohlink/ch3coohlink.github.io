[, , $.newidb, $.glutil] = await Promise.all([
  loadsym("./basic.js"), loadsym("./comp.js"),
  require("./idb.js"), require("./gl.js")
])

$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")

const body = document.body
// compappend(body, $.cvs = canvas())
// $.cvs = canvas()
// $.gl = cvs.cvs.getContext("webgl2"), glutil(_, _, $)
$.cvs = { cvs: document.getElementById("src") }
$.ctx = cvs.cvs.getContext("2d")
const ratio = 0.2
cvs.cvs.width = 1920 * ratio
cvs.cvs.height = 1080 * ratio
log(ctx)

$.seedrd = mb32(7592834538)
$.rd = (a = 1, b) => (b ? 0 : (b = a, a = 0), seedrd() * (b - a) + a)
$.rdi = (a = 1, b) => Math.ceil(b ? 0 : (b = a, a = 0), seedrd() * (b - a) + a)

$.animate = (f, ...a) => { }
$.wait = t => { t }

const sequence = $ => {
  with ($) {
    $.frame = 0, $.time = 0, $.ftime = 1 / 60, $.drawflag = true
    Object.defineProperty($, "draw", {
      get: () => {
        let o = $; while (o = proto(o)) {
          if (o.drawflag === false) { return false }
        } return drawflag
      }
    })
    const _init = () => { $.frame = 0, init($) }
    $.next = () => { $.frame++, time = ftime * frame, tick($); return $ }
    $.jumpto = (t, l = Math.floor(t / ftime)) => {
      $.drawflag = false, _init()
      while (frame < l) next(); $.drawflag = true
      return $
    }; _init()
  } return $
}

const s = (o, i, n, a, sa, spd) => sequence(inherit(o, {
  init: $ => {
    with ($) {
      $.box = { x: 0, y: 0, w: 100, h: 100 }
      $.angle = 0
    }
  },
  tick: $ => {
    with ($) {
      box.x += ftime * spd
      box.y += ftime * spd
      angle += ftime * sa
      if (draw) {
        ctx.setTransform(new DOMMatrix().translate(cvs.cvs.width / 2, cvs.cvs.height / 2)
          .rotate(a + 360 / n * i).translate(box.x, box.y).rotate(angle))
        ctx.fillRect(0, 0, box.w, box.h)
      }
    }
  },
}))

const ss = sequence(inherit($, {
  init: $ => {
    with ($) {
      $.l = Math.ceil(rd(1, 8))
      $.a = Math.ceil(rd(360))
      $.sa = Math.ceil(rd(-100, 100))
      $.spd = Math.ceil(rd(-100, 100))
      $.ss = array(l, i => s($, i, l, a, sa, spd).jumpto(1))
    }
  },
  tick: $ => {
    with ($) {
      for (const s of ss) { s.next() }
    }
  },
}))

// let shrinkcvs = dom({ tag: "canvas" })
// let shrinkctx = shrinkcvs.getContext("2d")
// let drawtoimage = (ratio = 0.2) => {
//   const w = Math.ceil(cvs.cvs.width * ratio)
//   const h = Math.ceil(cvs.cvs.height * ratio)
//   if (shrinkcvs.width !== w || shrinkcvs.height !== h)
//     shrinkcvs.width = w, shrinkcvs.height = h;
//   shrinkctx.clearRect(0, 0, w, h)
//   shrinkctx.drawImage(cvs.cvs, 0, 0, w, h)
//   const img = dom({ tag: "img", src: shrinkcvs.toDataURL("image/webp", 0.1) })
//   body.append(img)
// }
// body.append(cvs.cvs, shrinkcvs)
body.append(cvs.cvs)

let t = 100
// setInterval(() => {
$.draw = (() => {
  let st = pnow()
  ctx.setTransform(new DOMMatrix())
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, cvs.cvs.width, cvs.cvs.height)
  ctx.fillStyle = "black"
  ss.next()
  if (ss.time > t) {
    let i = rd(4)
    ss.jumpto(i)
    t = rd(i, 4)
  }
  // drawtoimage()

  let et = pnow(), ft = et - st
  // ft > 1 ? log(ft.toFixed(1)) : 0
})

addEventListener("keydown", e => {
  const rt = pnow(), et = e.timeStamp, dt = rt - et
})

const newwrk = (p, ...a) => {
  let w = new Worker("./worker.js", ...a), r
  w.postMessage(["init", p])
  w.addEventListener("message", e => { if (e.data === "inited") { r(w) } })
  w.call = (...a) => w.postMessage(["call", ...a])
  w.transfer = (t, ...a) => w.postMessage(["call", ...a], t)
  return new Promise(v => r = v)
}

const w = await newwrk("./codec.js")
let stream = cvs.cvs.captureStream(0)
let track = stream.getVideoTracks()[0]
let mp = new MediaStreamTrackProcessor(track)
let r = mp.readable
let ocvs = dom({ tag: "canvas" }, body)
ocvs.width = cvs.cvs.width
ocvs.height = cvs.cvs.height
let off = ocvs.transferControlToOffscreen()
w.transfer([off, r], "setup_encode", off, r)
$.feedframe = () => track.requestFrame()

await new Promise(r => setTimeout(r, 100))
for (let i = 0; i < 1000; i++) {
  draw(i * (1 / 60) * 1000)
  feedframe()
  // w.call("encode_frame", i)
  await new Promise(r => setTimeout(r, 20))
  // log("call encode frame", i)
}

await save.init
