// This is by no mean a secure sandbox.
$.stdlib ??= true, $.extralib ??= false, $.extra ??= {}

// dom element
$.html = dom({}), $.shadow = html.attachShadow({ mode: "open" })
$.head = dom({}, shadow, "head"), $.body = dom({}, shadow)
$.css = createcss(head)

// clear everything inside sandbox
const destroy = () => (forof(clr, f => f()), clrac(),
  forin(ds, (v, k) => or(k, v)), ro?.disconnect())

// everything that not gc should be concerned
// (so maybe add URL.createObjectURL etc...)
const pack = (n, [a, b] = n.split(" "), m = new WeakMap, d = new Set
  , r = $[a], c = $[b], rg = new FinalizationRegistry(d.delete.bind(d))) => (
  $[a] = (f, t) => (i => (rg.register(f, i), m.has(f)
    ? d.delete(m.get(f)) : 0, m.set(f, i), d.add(i), i))(r(f, t)),
  $[b] = i => (c(i), d.delete(i)), () => forof(d, $[b]))
const clr = [pack("requestIdleCallback cancelIdleCallback")
  , pack("requestAnimationFrame cancelAnimationFrame"), pack("setNow clearNow")
  , pack("setTimeout clearTimeout"), pack("setInterval clearInterval")]

// ok, web audio not gc
const oac = $.AudioContext, acs = [], clrac = () => forof(acs, v => v.close())
$.AudioContext = function () { const r = new oac(); acs.push(r); return r }

// dispatch all window event
const en = `search appinstalled beforeinstallprompt beforexrselect abort blur cancel canplay canplaythrough change click close contextmenu cuechange dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended error focus formdata input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup mousewheel pause play playing progress ratechange reset resize scroll seeked seeking select stalled submit suspend timeupdate toggle volumechange waiting webkitanimationend webkitanimationiteration webkitanimationstart webkittransitionend wheel auxclick gotpointercapture lostpointercapture pointerdown pointermove pointerup pointercancel pointerover pointerout pointerenter pointerleave selectstart selectionchange animationend animationiteration animationstart transitionrun transitionstart transitionend transitioncancel afterprint beforeprint beforeunload hashchange languagechange message messageerror offline online pagehide pageshow popstate rejectionhandled storage unhandledrejection unload devicemotion deviceorientation deviceorientationabsolute pointerrawupdate`.split(" ")
let ls = {}, ds = {}, d = t => e => (w["on" + t]?.(e), forof(ls[t] ?? [], f => f(e)))
const oa = addEventListener, or = removeEventListener; forof(en, k => ds[k] = null)
const initevent = t => ls[t] ??= (t === "resize" ? wr(d(t)) : oa(t, ds[t] = d(t)), new Set)
const oneventset = (t, v) => isfct(v) && t in ds ? initevent(t) : 0
$.addEventListener = (t, l) => initevent(t).add(l)
$.removeEventListener = (t, l) => ls[t]?.delete(l)

// watch resize of root element
let ro, wr = f => (ro = new ResizeObserver(e => f(tr(e)))).observe(html)
const tr = (entries) => entries // TODO

// warp a window interface
const set = (t, k, v) => (k.startsWith("on") ? oneventset(k.slice(2), v) : 0, t[k] = v, 1)
const w = {}, _ = new Proxy(w, { get: (t, k) => k in t ? t[k] : $[k], set })
forof("$ window globalThis self".split(" "), n => property(w, n, { value: _ }))

// document and other warp function
const get = (t, k) => k in t ? t[k] : document[k]
assign(w, { document: new Proxy({ documentElement: html, head, body }, { get }) })
assign(w, { setInterval, clearInterval, setTimeout, clearTimeout })
assign(w, { requestAnimationFrame, cancelAnimationFrame, setNow, clearNow })
assign(w, { requestIdleCallback, cancelIdleCallback })
assign(w, { addEventListener, removeEventListener })

assign(w, { SpeechRecognition: void 0, webkitSpeechRecognition: void 0 })
assign(w, { destroy, css, initspeech2text, AudioContext })

// common utility
stdlib ? (assign(w, { isnum, isstr, isudf, isobj, isfct, isbgi }),
  assign(w, { isnth, isnul, asarr, isarr, isnumstr }),
  assign(w, { forrg, maprg, forin, forof, cases, trycatch, panic }),
  assign(w, { proto, property, assign, deletep, create, extract, exclude, scope }),
  assign(w, { log, clear, dom, elm, style, createcss, dsplice, swaptag })) : 0

// extra function (TODO: these thing leak!)
if (extralib) {
  // extension function: schedule
  let m = new Map, f = (t, o = m) => (requestAnimationFrame(f), m = new Map, forof(
    o, async ([_, { f, s, j }]) => { try { await f(t) } catch (e) { j(e) } s() })); f()
  const schedule = (u, f, o = { f }) => (m.set(u, o), new Promise((s, j) => (o.s = s, o.j = j)))

  // extension function: drag
  const ns = w => w.getSelection().removeAllRanges()
  const dragm = new Map, deldrag = f => dragm.delete(f)
  const adddrag = (o, { down: d, move: m, up: u, noselect: n = true } = {}) => (
    dragm.set(o, { b: false, m, u, n }), e => (dragm.get(o).b = true, d?.(e)))
  addEventListener("pointermove", e => forof(dragm,
    ([_, { b, m, n }], w = e.view.window) => (n ? ns(w) : 0, b ? m?.(e, w) : 0)))
  addEventListener("pointerup", e => forof(dragm,
    ([_, v], { b, u } = v) => b ? (v.b = false, u?.(e, e.view.window)) : 0))

  assign(w, { schedule, adddrag, deldrag })
}

assign(w, extra); return _