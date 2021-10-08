const { log, dir, clear } = console; clear()
const stamp = (tag, point, elapse) => ({ tag, point, elapse })
const mktimer = (s = performance.now(), a = [stamp("start", s, 0)]) => (m = "",
  n = performance.now()) => (a.push(stamp(m, n, n - a[a.length - 1].elapse)), a)

const forrg = (e, f, s = 0, d = 1) => {
  if (d > 0) for (let i = s; i < e; i += d) f(i)
  else for (let i = s; i > e; i += d) f(i)
}, maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
const forin = (o, f) => { for (const k in o) f(o[k], k) }
const forof = (o, f) => { for (const v of o) f(v) }
const cases = (h, ...t) => ((m, d) => (c, ...a) =>
  m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
const panic = e => { throw isstr(e) ? Error(e) : e }

const isnum = o => typeof o == "number", isfct = o => typeof o == "function"
const isstr = o => typeof o == "string", isbgi = o => typeof o == "bigint"
const isudf = o => o === undefined, isnth = o => isudf(o) || isnul(o)
const isobj = o => o && typeof o == "object", isnul = o => o === null
const tarr = [Float32Array, Int32Array, Uint32Array, Float64Array, Int8Array,
  Int16Array, Uint8Array, Uint16Array, Uint8ClampedArray, BigInt64Array, BigUint64Array]
const _istarr = o => { for (const A of tarr) if (o instanceof A) return true; return false }
const isarr = Array.isArray, istarr = o => isobj(o) && _istarr(o)
const isnumstr = s => isstr(s) && !isNaN(parseFloat(s))

const raf = requestAnimationFrame, render = (f, c = Infinity, i = 0,
  l = t => (f(t), r()), r = () => i++ < c ? raf(l) : 0) => r()
const dfrag = document.createDocumentFragment.bind(document)
const dsplice = (p, i, c, ...n) => ((d = p.childNodes, rm = [], l = d.length
  , f = dfrag(), s = i < 0 ? l + i : i, e = isnum(c) ? s + c : l) => (
  forrg(e, () => d[s] ? rm.push(p.removeChild(d[s])) : 0, s),
  forof(n, e => f.appendChild(e)), p.insertBefore(f, d[s]), rm))()

const style = (e, ...s) => (forof(s, s =>
  forin(s, (v, k) => e.style[k] = isnum(v) ? `${v}px` : v)), e)
const _dom = cases((e, v, k) => (isfct(v) ? e[k] = v : e.setAttribute(k, v)),
  ["class", (e, v) => e.className = isarr(v) ? v.join(" ") : v],
  ["child", (e, v) => e.append(...v)],
  ["parent", (e, v) => v ? v.appendChild(e) : 0],
  ["text", (e, v) => e.textContent = v],
  ["style", (e, v) => style(e, ...isarr(v) ? v : [v])])
const dom = (n, o = {}, e = isstr(n) ? document.createElement(n) : n) =>
  (forin(o, (v, k) => v ? _dom(k, e, v, k) : 0), e)
const exec = (e, a = [], n = (forin(e, (_, k) => a.push(k)), a.join(", "))) =>
  c => new Function(`"use strict";\nreturn ({ ${n} }) => { \n${c}\n }`)()(e)

dom("h1", { text: "ENV.JS Demo Page", parent: document.body })
const description = `Env.js is a web-based coding environment focusing
on exposing the original ideas behind the code, it gives reader
and coder themselves a better vision of what's going on behind
the source code.`
const ctn = dom("div", { text: description, parent: document.body })
const demos = []

demos.push(() => {
  const demo = dom("div", { parent: ctn })
  dom("h3", { text: "DEMO 0: simple eval", parent: demo, id: "demo0" })
  const text = `The following demo shows a basic js evaluation environment, which
  offers a simple textarea to write code and a simple console to show your output.`
  dom("div", { parent: demo, text, style: { marginBottom: "1em" } })

  const h = 200, w = h * 16 / 9, d = dom("div", {
    parent: demo, style: [
      { overflow: "auto", display: "inline-block", height: h, width: w },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  })
  const dlog = o => (...a) => {
    dom("div", { text: a.join(" "), parent: d, ...o })
    d.scrollTop = d.scrollHeight
  }
  const console = {
    log: dlog({}),
    warn: dlog({ style: { color: "yellow" } }),
    error: dlog({ style: { color: "red" } }),
    clear: () => d.innerHTML = "",
  }

  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w}px)` }],
    onkeydown: e => {
      if (e.key == "Alt") { e.preventDefault() }
      if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) {
        e.preventDefault()
        try { exec({ console })(t.value) } catch (e) { console.error(e) }
      }
    },
  })
  t.value = `// Use shift + Enter to execute.
console.log(1, "string", JSON.stringify({ a: 1 })) // only string are supported
console.error(new Error("SOME ERROR"))
// console.clear()`
})

demos.push(() => {
  const demo = dom("div", { parent: ctn })
  dom("h3", { text: "DEMO 1: change the environment", parent: demo, id: "demo1" })
  const text = `Demo 1 adds a "$" variable on top of demo 0.
  "$" is just a plain js object, and will be reference to the same object
  during all execution, so we can use it as a sort of global envrionment,
  thus all the global variable visit has to be started with "$.", which is tedious,
  but I didn't find a better way to do this without using full js code transformation.`
  dom("div", { parent: demo, text, style: { marginBottom: "1em" } })
  const txt1 = `The middle window will show current name inside "$".`
  dom("div", { parent: demo, text: txt1, style: { marginBottom: "1em" } })

  const h = 200, w = h * 16 / 9, r = 0.3
  const csty = [
    { overflow: "auto", display: "inline-block", height: h, width: w },
    { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  const cdiv = dom("div", { parent: demo, style: csty })
  const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const dlog = o => (...a) => {
    dom("div", { text: a.join(" "), parent: cdiv, ...o })
    cdiv.scrollTop = cdiv.scrollHeight
  }
  const console = {
    log: dlog({}),
    warn: dlog({ style: { color: "yellow" } }),
    error: dlog({ style: { color: "red" } }),
    clear: () => cdiv.innerHTML = "",
  }

  const $ = { console }, shadow = {}; for (const k in window) { shadow[k] = undefined }
  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` }],
    onkeydown: e => {
      if (e.key == "Alt") { e.preventDefault() }
      if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) {
        e.preventDefault()
        try { exec({ ...shadow, $ })(t.value) }
        catch (e) { console.error(e) }
        ediv.innerHTML = ""
        forin($, (_, k) => dom("div", { text: k, parent: ediv }))
      }
    },
  })

  t.value = `// $.a = 1 // uncomment this to see the change of environment
console.log($) // this output to dev tool console
$.console.log(JSON.stringify($)) // this output to the left console`
})

demos.push(() => {
  const demo = dom("div", { parent: ctn })
  dom("h3", { text: "DEMO 2: history", parent: demo, id: "demo2" })
  const text = `Firstly, let's add a simple history feature.
  You can navigate your past input using ctrl + up / down.
  ( Note that in this demo, once you made an execution,
  the textarea will be automatically cleared, just like a repl. )`
  dom("div", { parent: demo, text, style: { marginBottom: "1em" } })

  const h = 200, w = h * 16 / 9, r = 0.3
  const csty = [
    { overflow: "auto", display: "inline-block", height: h, width: w },
    { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  const cdiv = dom("div", { parent: demo, style: csty })
  const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const dlog = o => (...a) => {
    dom("div", { text: a.join(" "), parent: cdiv, ...o })
    cdiv.scrollTop = cdiv.scrollHeight
  }, console = {
    log: dlog({}), warn: dlog({ style: { color: "yellow" } }),
    error: dlog({ style: { color: "red" } }), clear: () => cdiv.innerHTML = "",
  }

  let history = [], pos = 0, edit_histroy = []
  const val = (v = edit_histroy[pos]) => isudf(v) ? history[pos] : v
  const eval = (i = val()) => {
    try { exec({ ...shadow, $ })(i) } catch (e) { console.error(e) } finally {
      ediv.innerHTML = "", forin($, (_, k) => dom("div", { text: k, parent: ediv }))
      t.value = "", history.push(i), pos += 1, edit_histroy = []
    }
  }
  const load = n => {
    if (n < 0 || n > Math.max(history.length, edit_histroy.length) - 1) return
    pos = n, t.value = val()
  }

  const $ = { console }, shadow = {}; for (const k in window) { shadow[k] = undefined }
  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` }],
    onkeydown: e => {
      edit_histroy[pos] = t.value
      if (e.key == "Alt") { e.preventDefault() }
      if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
      if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
      if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey))
        (e.preventDefault(), eval())
    },
  })
  setTimeout(() => t.focus(), 0)

  {
    const text = `And here comes a problem, what if the history becomes too long
and we can't find our old definition to modify?`
    dom("div", { parent: demo, text, style: { marginBottom: "1em" } })
  }
})

forof(demos, d => d())