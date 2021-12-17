window.$ = $, $.log = console.log, $.clear = console.clear

$.isnum = o => typeof o == "number", $.isfct = o => typeof o == "function"
$.isstr = o => typeof o == "string", $.isbgi = o => typeof o == "bigint"
$.isudf = o => o === undefined, $.isnth = o => isudf(o) || isnul(o)
$.isobj = o => o && typeof o == "object", $.isnul = o => o === null
$.isarr = Array.isArray, $.asarr = v => isarr(v) ? v : [v]
$.isnumstr = s => isstr(s) && !isNaN(Number(s))

$.forrg = (e, f, s = 0, d = 1) => { for (let i = s; d > 0 ? i < e : i > e; i += d) f(i) }
$.maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
$.forin = (o, f) => { for (const k in o) f(o[k], k) }
$.forof = (o, f) => { for (const v of o) f(v) }
$.cases = (h, ...t) => ((m, d) => (c, ...a) => m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
$.panic = e => { throw isstr(e) ? Error(e) : e }

$.proto = Object.getPrototypeOf, $.property = Object.defineProperty, $.assign = Object.assign
$.extract = (o, s, r = {}) => (forof(s.split(" "), k => r[k] = o[k]), r)
$.bindall = o => forin(o, (v, k) => isfct(v) ? o[k] = v.bind(o) : 0)

bindall(document); const text = document.createTextNode, _elm = document.createElement
const attr = cases((e, v, k, o = e[k]) => o === v ? 0 : e[k] = v,
  ["class", (e, v) => e.className = isarr(v) ? v.join(" ") : v],
  ["child", (e, v) => e.append(...asarr(v).map(v => isstr(v) ? text(v) : v))],
  ["tag", _ => { }], ["style", (e, v) => style(e, ...asarr(v))])
$.style = (e, ...s) => (forof(s, s => forin(s, (v, k, n = isnum(v) ? `${v}px` : v) =>
  k === "height" ? (e.style.height = "", e.style.height = n) // dirty hack for height property
    : e.style[k] === n ? 0 : e.style[k] = n)), e)
$.elm = (e, o = {}, f) => (isstr(e) ? e = _elm(e) : 0,
  forin(o, (v, k) => attr(k, e, v, k)), f ? f(e) : 0, e)
$.dom = (o = {}, p, n = o.tag ?? "div") => elm(n, o, p ? p.append.bind(p) : 0)

const px = v => isnum(v) ? `${v}px` : v
const hyphenate = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
const content = s => Object.keys(s).reduce((p, k) => p + `${hyphenate(k)}: ${px(s[k])}; `, "")
$.createcss = e => (e = (e.tagName === "STYLE" ? e : dom({}, e, "style")),
  (r, ...s) => e.sheet.insertRule(`${r} { ${s.map(v => content(v)).join(" ")}}`))

const ra = requestAnimationFrame, ca = cancelAnimationFrame
const si = setInterval, ci = clearInterval
const st = setTimeout, ct = clearTimeout
const _a = new Map, _i = new Map, _t = new Map
$.requestAnimationFrame = f => { _a.set(f, ra(f)) }
$.cancelAnimationFrame = f => { ca(_a.get(f)), _a.delete(f) }
$.setInterval = (f, t) => { _i.set(f, si(f, t)) }
$.clearInterval = f => { ci(_i.get(f)), _i.delete(f) }
$.setTimeout = (f, t) => { _t.set(f, st(f, t)) }
$.clearTimeout = f => { ct(_t.get(f)), _t.delete(f) }

$.gencode = c => Function("$", `with ($) { return async () => {\n"use strict";\n${c}\n} }`)
const _l = {}, load = async (u, l = _l[u]) => l ? l : _l[u] = await (await fetch(u)).text()
$.scope = (o, e = Object.create(o)) => Object.defineProperty(e, "$", { value: e })
$.asfct = async (u, f) => (f = gencode(await load(u)), async (a = {},
  e = $, o = scope(e)) => (forin(a, (v, k) => o[k] = v), await f(o)()))

const loadlist = `./idb.js ./env.js ./sandbox.js ./react.js ./envjs/resize.js`;
[$.idb, $.envjs, $.sandbox, $.react, $.envjs_resize] =
  await Promise.all(loadlist.split(" ").map(v => asfct(v)))
await react({})

const peerjs = async () => (
  (await asfct("../external/peerjs.min.js"))(),
  $.peerjs = window.peerjs, $.Peer = window.Peer,
  delete window.peerjs, delete window.Peer)

const _q = new URL(window.location.href).searchParams
$.query = {}; _q.forEach((v, k) => query[k] = v === "false"
  ? false : v === "true" ? true : isnumstr(v) ? Number(v) : v)

style(document.documentElement, { height: "100%" })
style(document.body, { margin: 0, height: "100%" })
with (await sandbox({ root: document.body })) {
  style(document.documentElement, { height: "100%" })
  style(document.body, { margin: 0, height: "100%" })

  $.schedule = ((f = (t, o = m) => (requestAnimationFrame(f), m = new Map
    , forof(o, ([f, r]) => (f(), r()))), m = new Map) => (f(),
      (f, r, p = new Promise(s => r = s)) => (m.set(f, r), p)))()

  const _drag = new Map
  addEventListener("pointermove", e => forof(_drag,
    ([_, { b, m }]) => b ? m?.(e, e.view.window) : 0))
  addEventListener("pointerup", e => forof(_drag,
    ([_, v]) => (v.b = false, v.u?.(e, e.view.window))))
  $.deldrag = _drag.delete.bind(_drag), $.adddrag = (o, m, u) => (
    _drag.set(o, { b: false, m, u }), () => _drag.get(o).b = true)

  $.rootenv = await envjs({ root: document.body }, window)
}