// window.onerror = function (a, b, c, d, e) {
//   const msg = document.createElement("div")
//   const stack = document.createElement("div")
//   msg.textContent = e.toString()
//   stack.textContent = e.stack
//   document.body.textContent = `JavaScript error occured
//     during loading process, try to contact the site owner.`
//   document.body.append(msg, stack)
// }

const { log, dir, clear } = console
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
const tarr = [Float32Array, Int32Array, Uint32Array, Float64Array,
  Int8Array, Int16Array, Uint8Array, Uint16Array, Uint8ClampedArray,
  ...window["BigInt64Array"] ? [BigInt64Array, BigUint64Array] : []]
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
const _dom = cases((e, v, k) => (e[k] = v, isfct(v) ? 0 : e.setAttribute(k, v)),
  ["class", (e, v) => e.className = isarr(v) ? v.join(" ") : v],
  ["child", (e, v) => e.append(...v)],
  ["parent", (e, v) => v ? v.appendChild(e) : 0],
  ["text", (e, v) => e.textContent = v],
  ["style", (e, v) => style(e, ...isarr(v) ? v : [v])])
const dom = (n, o = {}, f = _ => { }, e = isstr(n) ? document.createElement(n) : n) =>
  (forin(o, (v, k) => v ? _dom(k, e, v, k) : 0), f(e), e)
const exec = (e, a = [], n = (forin(e, (_, k) => a.push(k)), a.join(", "))) => async c =>
  await new Function(`"use strict";\nreturn async ({ ${n} }) => { \n${c}\n }`)()(e)

dom("h1", { text: "ENV.JS Demo Page", parent: document.body })
const description = `Env.js is a web-based coding environment focusing
on exposing the original ideas behind the code, it gives reader
and coder themselves a better vision of what's going on behind
the source code.`
const ctn = dom("div", { text: description, parent: document.body })
style(document.body, { paddingBottom: "50vh", minWidth: 800 })
const demos = []

demos.push(() => {
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  dom("h3", { text: "DEMO 0: simple eval", parent: demo, id: "demo0" })
  const text = `The following demo shows a basic js evaluation environment, which
  offers a simple textarea (right) to write code and a simple console (left) to show your output.`
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
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w}px)` },
    { margin: 0, position: "absolute" }],
    onkeydown: e => {
      if (e.key == "Alt") { e.preventDefault() }
      if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) {
        e.preventDefault()
        try { exec({ console })(t.value) } catch (e) { console.error(e) }
      }
    },
  })
  t.value = `// Use shift + Enter to execute. (alt + Enter, ctrl + Enter also works)
console.log(1, "string", JSON.stringify({ a: 1 })) // only string are supported
console.error(new Error("SOME ERROR"))
// console.clear()`
})

demos.push(() => {
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  dom("h3", { text: "DEMO 1: change the environment", parent: demo, id: "demo1" })
  const text = `Demo 1 adds a "$" variable on top of demo 0.
  "$" is just a plain js object, and will be reference to the same object
  during all execution, so we can use it as a sort of global envrionment.
  Thus all the global variable visit has to be started with "$.", which is tedious,
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
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` },
    { margin: 0, position: "absolute" }],
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
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  dom("h3", { text: "DEMO 2: history", parent: demo, id: "demo2" })
  const text = `Firstly, let's add a simple history feature.
  You can navigate your past input using ctrl + up / down. ( Note that
  in this demo, once you made an execution, the textarea will be automatically
  cleared, just like a REPL(read eval print loop). )`
  dom("div", { parent: demo, text, style: { marginBottom: "1em" } })

  {
    const h = 200, w = h * 16 / 9, r = 0.3
    const csty = [
      { overflow: "auto", display: "inline-block", height: h, width: w },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
    const cdiv = dom("div", { parent: demo, style: csty })
    const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const dlog = o => (...a) => {
      dom("div", { text: a.join(" "), parent: cdiv, ...o })
      cdiv.scrollTop = cdiv.scrollHeight
    }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
    const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

    const history = [`// You find the history!
// And you can modify it to create more!
// ================ Like delete this line and then eval ============================`,
      "// Use ctrl + up to see the history."]
    let pos = history.length - 1, edit_histroy = []
    const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
    const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
    const eval = (i = val()) => {
      if (!i) { return } try { exec({ ...shadow, $ })(i) } catch (e) { error(e) } finally {
        ediv.innerHTML = "", forin($, (_, k) => dom("div", { text: k, parent: ediv }))
        t.value = "", history.push(i), pos = history.length, edit_histroy = []
      }
    }

    const $ = { log, error, warn, clear }, shadow = {}
    for (const k in window) { shadow[k] = undefined }
    const t = dom("textarea", {
      label: "code", placeholder: "code", spellcheck: "false",
      parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
      { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` },
      { margin: 0, position: "absolute" }],
      onkeydown: (e, p = true) => {
        if (e.key == "Alt") { }
        else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
        else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
        else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
        else { p = false } p ? e.preventDefault() : 0
      },
      oninput: () => { edit_histroy[pos] = t.value }
    }); t.value = val()
  }

  {
    dom("div", {
      parent: demo, text: `And here comes a problem, what if the history becomes too long
        and we can't find our old definition to modify?`, style: { margin: "1em 0em" }
    })
    dom("div", {
      parent: demo, text: `Actually, that's not very hard to deal with since we have
        a fully working REPL, just add a function to save current input as a snippet!
        And that funciton is provided as "$.ssave", it will save current input by the name
        you pass to it, and you can load snippets using "$.sload", have a try!`,
      style: { margin: "1em 0em" }
    })

    const h = 200, w = h * 16 / 9, r = 0.3
    const csty = [
      { overflow: "auto", display: "inline-block", height: h, width: w * (1 - r) },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
    const cdiv = dom("div", { parent: demo, style: csty })
    const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const sdiv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const dlog = o => (...a) => {
      dom("div", { text: a.join(" "), parent: cdiv, ...o })
      cdiv.scrollTop = cdiv.scrollHeight
    }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
    const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

    let history = [], pos = 0, loading = ""
    let edit_histroy = [`$.ssave("1") // the left window shows current snippets`]
    const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
    const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
    const update_list = (d, o) => (s = []) => d.innerHTML =
      (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
    const update_env = update_list(ediv, () => $)
    const update_his = i => (history.push(i), pos = history.length,
      edit_histroy = [], edit_histroy[pos] = t.value = loading, loading = "")
    const eval = (i = val()) => {
      try { exec({ ...shadow, $ })(i) } catch (e) { error(e) }
      finally { update_env(), update_snp(), i ? update_his(i) : 0 }
    }

    const snippets = {}, update_snp = update_list(sdiv, () => snippets)
    const ssave = (name) => isstr(name) ? snippets[name] = val() : 0
    const sload = (name, v = snippets[name]) => v ? loading = v : 0

    const $ = { log, error, warn, clear, ssave, sload }, shadow = {}
    for (const k in window) { shadow[k] = undefined }
    const t = dom("textarea", {
      label: "code", placeholder: "code", spellcheck: "false",
      parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
      { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` },
      { margin: 0, position: "absolute" }],
      onkeydown: (e, p = true) => {
        if (e.key == "Alt") { }
        else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
        else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
        else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
        else { p = false } p ? e.preventDefault() : 0
      }, oninput: () => { edit_histroy[pos] = t.value }
    }); t.value = val()
  }
})

demos.push(() => {
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  dom("h3", { text: "DEMO 3: external script & non-js text", parent: demo, id: "demo3" })
  dom("div", {
    parent: demo, text: `It's quite useful to load external lib, and by the same
      fashion of "$.ssave" and "$.sload", we can add a new function to load
      external script. Here I presented a simple example loading PicoGL.js
      (which is a nice tiny webgl2 helper).
  `, style: { marginBottom: "1em" }
  })
  const canvas = dom("canvas", {
    parent: dom("div", {
      parent: demo, style: [
        { display: "block", width: "100%", boxSizing: "border-box", },
        { border: "0.5px solid black", borderBottom: "none" }]
    }), style: [{ display: "block", margin: "0 auto" },
    { maxHeight: 800, minHeight: 500, maxWidth: "100%" }]
  })

  const h = 200, w = h * 16 / 9, r = 0.3
  const csty = [
    { overflow: "auto", display: "inline-block", height: h, width: w * (1 - r) },
    { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  const cdiv = dom("div", { parent: demo, style: csty })
  const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const sdiv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const dlog = o => (...a) => {
    dom("div", { text: a.join(" "), parent: cdiv, ...o })
    cdiv.scrollTop = cdiv.scrollHeight
  }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
  const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

  let history = [], pos = 0, edit_histroy = [], pending = [], wait, resolve
  const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
  const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
  const update_list = (d, o) => (s = []) => d.innerHTML =
    (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
  const update_env = update_list(ediv, () => $), ores = () => { wait = false }
  const update_his = i => (history.push(i), pos = history.length, edit_histroy = [])
  const update_nxt = (v = pending.shift()) => edit_histroy[pos] = t.value = v ? v : ""
  const update_all = i => (update_env(), update_snp(), i ? update_his(i) : 0, update_nxt())
  const update_err = e => (error(e), pending.unshift(val()))
  const env = () => ({ window: {}, document: {}, $ })
  const eval = (i = val()) => {
    const p = new Promise(async (res) => {
      try { wait = false, resolve = ores, await exec(env())(i) }
      catch (e) { update_err(e) } finally { if (!wait) { res() } else { resolve = res } }
    }); p.finally(() => update_all(i))
  }
  const eload = async (url, f = () => { }) => {
    try {
      wait = true; const res = await fetch(url)
      if (res.ok) { await exec(env())(await res.text() + `\n(${f})()`) }
      else { throw `GET ${url} ${res.status}` }
    } catch (e) { update_err(e) } finally { update_env(), update_snp(), resolve() }
  }

  const snippets = {}, update_snp = update_list(sdiv, () => snippets)
  const ssave = (name) => isstr(name) ? snippets[name] = val() : 0
  const sload = (name, v = snippets[name]) => v ? pending.unshift(v) : 0

  const $ = { log, error, warn, clear, ssave, sload, eload, canvas }, shadow = {}
  for (const k in window) { shadow[k] = undefined }
  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` },
    { margin: 0, position: "absolute" }],
    onkeydown: (e, p = true) => {
      if (e.key == "Alt") { }
      else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
      else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
      else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
      else { p = false } p ? e.preventDefault() : 0
    }, oninput: () => { edit_histroy[pos] = t.value }
  });

  {
    const picogl = "../external/picogl.min.js"
    pending.push(`$.eload("${picogl}", () => {$.PicoGL = PicoGL})`, `// now you can use $.PicoGL!
const { PicoGL, canvas } = $
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// Create a PicoGL.js app to manage GL state.
const app = PicoGL.createApp(canvas)
.clearColor(0.0, 0.0, 0.0, 1.0);

const vsSource = \`
#version 300 es

layout(location=0) in vec4 position;
layout(location=1) in vec3 color;

out vec3 vColor; 
void main() {
    vColor = color;
    gl_Position = position;
}
\`, fsSource = \`
#version 300 es
precision highp float;

in vec3 vColor;

out vec4 fragColor;
void main() {
    fragColor = vec4(vColor, 1.0);
}
\`
let positions = app.createVertexBuffer(PicoGL.FLOAT, 2, new Float32Array([
  -0.5, -0.5,
   0.5, -0.5,
   0.0, 0.5, 
]));

let colors = app.createVertexBuffer(PicoGL.UNSIGNED_BYTE, 3, new Uint8Array([
  255, 0, 0,
  0, 255, 0,
  0, 0, 255
]));

// COMBINE VERTEX BUFFERS INTO VERTEX ARRAY
let triangleArray = app.createVertexArray()
.vertexAttributeBuffer(0, positions)
.vertexAttributeBuffer(1, colors, { normalized: true });

app.createPrograms([vsSource, fsSource]).then(function([program]) {
  // CREATE DRAW CALL FROM PROGRAM AND VERTEX ARRAY
  let drawCall = app.createDrawCall(program, triangleArray);

  // DRAW
  app.clear();
  drawCall.draw();

  // CLEANUP
  program.delete();
  positions.delete();
  colors.delete();
  triangleArray.delete();
});`), eval("")
  }

  {
    dom("div", {
      parent: demo, text: `Another useful feature is editing non-js string, which could
      also be done by providing a global function.`, style: { margin: "1em 0em" }
    })

    const h = 200, w = h * 16 / 9, r = 0.3, csty = [
      { overflow: "auto", display: "inline-block", height: h, width: w * (1 - r) },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
    const cdiv = dom("div", { parent: demo, style: csty })
    const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const sdiv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const dlog = o => (...a) => {
      dom("div", { text: a.join(" "), parent: cdiv, ...o })
      cdiv.scrollTop = cdiv.scrollHeight
    }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
    const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

    let history = [], pos = 0, edit_histroy = [], pending = []
    let snippets = {}, isjs = true, edt_target, wait, resolve

    const dummy = () => { }, ores = () => { wait = false }
    const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
    const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
    const update_list = (d, o) => (s = []) => d.innerHTML =
      (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
    const update_env = update_list(ediv, () => $)
    const update_his = i => (history.push(i), pos = history.length, edit_histroy = [])
    const update_nxt = (v = pending.shift()) => edit_histroy[pos] = t.value = v ? v : ""
    const update_all = i => (update_env(), update_snp(), i ? update_his(i) : 0, update_nxt())
    const env = () => ({ window: {}, document: {}, $ })
    const err = e => (error(e), pending.unshift(val()), isjs = true)
    const init = () => (isjs = true, edt_target = dummy, wait = false, resolve = ores)
    const eval = (i = val()) => {
      if (isjs) {
        const p = new Promise(async (res) => {
          try { init(), await exec(env())(i) }
          catch (e) { err(e) } finally { if (!wait) { res() } else { resolve = res } }
        }); p.finally(() => update_all(i))
      } else { isjs = true, edt_target(t.value), update_all(t.value) }
    }
    const eload = async (url, f = () => { }) => {
      try {
        wait = true; const res = await fetch(url)
        if (res.ok) { await exec(env())(await res.text() + `\n(${f})()`) }
        else { throw `${res.type} ${url} ${res.status}` }
      } catch (e) { err(e) } finally { update_env(), update_snp(), resolve() }
    }

    const update_snp = update_list(sdiv, () => snippets)
    const ssave = (name) => isstr(name) ? snippets[name] = val() : 0
    const sload = (name, v = snippets[name]) => v ? pending.unshift(v) : 0
    const nonjs = (s, f) => { edt_target = f, isjs = false, pending.unshift(s) }

    const $ = { log, error, warn, clear, ssave, sload, eload, edit: nonjs }
    const t = dom("textarea", {
      label: "code", placeholder: "code", spellcheck: "false",
      parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
      { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` },
      { margin: 0, position: "absolute" }],
      onkeydown: (e, p = true) => {
        if (e.key == "Alt") { }
        else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
        else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
        else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
        else { p = false } p ? e.preventDefault() : 0
      }, oninput: () => { edit_histroy[pos] = t.value }
    })

    {
      pending.push(`// Suppose we want to change the content of "$.a"
$.a = "You will see this in non-js mode.\\nTry make some change."\n
// Then we can use "$.edit" to enter string editing mode,
// the first parameter is the initial value of the target string,
// followed by a function which will receive the edited value.
// In this case, we simply use it to change the value of "$.a".
$.edit($.a, s => $.a = s)`, `// now show the change of "$.a"
$.log($.a)`), eval("")
    }
  }
})

const store = (name = "default", store = "default") => {
  const dbp = new Promise((res, rej, r = indexedDB.open(name)) => (r.onsuccess = () => res(r.result),
    r.onupgradeneeded = () => r.result.createObjectStore(store), r.onerror = () => rej(r.error)))
  const action = (type, cb) => dbp.then(db => new Promise((r, j, t = db.transaction(store, type)) =>
    (t.oncomplete = () => r(), t.onabort = t.onerror = () => j(t.error), cb(t.objectStore(store)))))
  const _ = null, ro = f => action("readonly", f), rw = f => action("readwrite", f)
  const key = (r = _) => ro(s => s.getAllKeys().onsuccess = e => r = e.target.result).then(() => r)
  const val = (r = _) => ro(s => s.getAll().onsuccess = e => r = e.target.result).then(() => r)
  const get = (k, r = _) => ro(s => r = s.get(k)).then(() => r.result), clr = () => rw(s => s.clear())
  const set = (k, v) => rw(s => s.put(v, k)), del = k => rw(s => s.delete(k))
  return { get, set, del, clr, key, val }
}

demos.push(async () => {
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  const id = 4, title = "save, load, version control"
  dom("h3", { text: `DEMO ${id}: ${title}`, parent: demo, id: "demo" + id })
  dom("div", {
    parent: demo, text: `Several useful features has been implemented since
    the beginning of this page, but there is still one crucial feature being absent.
    That is, we still can't save our work, everything just gone after a page refresh.
    So it is the time to visit this feature.`, style: { margin: "1em 0em" }
  })
  dom("div", {
    parent: demo, text: `Saving is trivial for a REPL, just write the history into
    the storage and it's done. But it's not that straightforward for loading,
    since the control command of REPL is also recorded into the history.
    A quick fix for this problem is to neglect the side effects of (most)
    REPL commands during the loading process, and this seemingly works
    well so I'll just keep it.`, style: { margin: "1em 0em" }
  })

  const h = 300, w = h * 16 / 9, r = 0.15, csty = [
    { overflow: "auto", display: "inline-block", height: h, width: w * (1 - r) },
    { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  const cdiv = dom("div", { parent: demo, style: csty })
  const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const sdiv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const dlog = o => (...a) => {
    style(dom("pre", { text: a.join(" "), parent: cdiv, ...o }), { margin: 0 })
    cdiv.scrollTop = cdiv.scrollHeight
  }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
  const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

  let $, history, pos, edit_histroy, pending = []
  let snippets, isjs, aftedit, wait, resolve
  const init = () => (history = [], pos = history.length, $ = {
    log, error, warn, clear, ssave, sload, eload,
    edit, save, forget, load, listall, exportall
  }, edit_histroy = [], pending = [], snippets = {}, reset())
  const reset = () => (isjs = true, aftedit = dummy, wait = false, resolve = ores)

  const dummy = () => { }, ores = () => { wait = false }
  const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
  const load_pos = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
  const update_list = (d, o) => (s = []) => d.innerHTML =
    (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
  const update_env = update_list(ediv, () => $)
  const update_his = i => (history.push(i), pos = history.length, edit_histroy = [])
  const update_nxt = (v = pending.shift()) => edit_histroy[pos] = t.value = v ? v : ""
  const update_all = (i, s) => (update_env(), update_snp(), i && s ? update_his(i) : 0, update_nxt())
  const env = () => ({ window: {}, document: {}, $ })
  const err = e => (error(isstr(e) ? e : e.stack), pending.unshift(val()), isjs = true)
  const eval = async (i = val(), save = true) => {
    if (!isjs) { isjs = true, aftedit(t.value), update_all(t.value, save) }
    else (await new Promise(async r => {
      try { reset(), await exec(env())(i) }
      catch (e) { err(e) } finally { if (!wait) { r() } else { resolve = r } }
    }), update_all(i, save))
  }
  const eload = async (url, f = () => { }) => {
    try {
      wait = true; const res = await fetch(url)
      if (res.ok) { await exec(env())(await res.text() + `\n(${f})()`) }
      else { throw `${res.type} ${url} ${res.status}` }
    } catch (e) { err(e) } finally { update_env(), update_snp(), resolve() }
  }

  const update_snp = update_list(sdiv, () => snippets)
  const ssave = name => isstr(name) ? snippets[name] = val() : 0
  const sload = (name, v = snippets[name]) => v ? pending.unshift(v) : 0
  const edit = (s, f) => { aftedit = f, isjs = false, pending.unshift(s) }

  const replid = "demo 4: save, load, version control", t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` },
    { margin: 0, position: "absolute", whiteSpace: "pre", wordWrap: "normal" }],
    onkeydown: (e, p = true) => {
      const { altKey: a, ctrlKey: c, shiftKey: s } = e
      if (e.key == "ArrowUp" && c) { load_pos(pos - 1) }
      else if (e.key == "ArrowDown" && c) { load_pos(pos + 1) }
      else if (e.key == "Enter" && (a || c || s)) { eval() }
      else if (e.key == "s" && c) { save(replid) }
      else if (e.key == "Alt") { } else { p = false } p ? e.preventDefault() : 0
    }, oninput: () => { edit_histroy[pos] = t.value }
  })

  {
    dom("div", {
      parent: demo, text: `By extending the ideas behind the save & load procedure,
      it is possible to propose a new kind of version control system.`, style: { margin: "1em 0em" }
    })
    dom("div", {
      parent: demo, text: `You can think of each savepoint as a version
      of the codebase, and ideally, the development of the software is
      the growth of the REPL's history. This perspective on software development
      reveals a possibility, that is: every single feature or bugfix is the delta
      between two REPL savepoint, and both of the savepoint is able to iteract.
      We can show the real function to the reader before we show the actual code,
      and by flexibly dividing the version, we can create a new code reading
      experience, that is, reading equals development.`, style: { margin: "1em 0em" }
    })
    dom("div", {
      parent: demo, text: `To achieve this vision, there is still a lot of work
      to be done, but I think this is a good start.`, style: { margin: "1em 0em" }
    })
  }

  const db = store("envjs"), spath = "saved_repl"
  const loadenv = { log, error, warn, clear, edit, eload }
  const _load = async (o, _ = (init(), $)) => {
    $ = {}, forin(_, (_, k) => $[k] = dummy), Object.assign($, loadenv)
    for (const h of o.history) { await eval(h) } history = o.history, pos = o.pos
    edit_histroy = o.edit_histroy, pending = o.pending, snippets = o.snippets
    Object.assign($, _), t.value = val(), update_env(), update_snp()
  }
  const saves = await db.get(spath) ?? new Set, getpath = n => [spath, n].join("/")
  const save = async n => (saves.add(n), Promise.all([db.set(spath, saves), db
    .set(getpath(n), { history, pos, edit_histroy, pending, snippets })]))
  const forget = async n => (saves.delete(n),
    Promise.all([db.set(spath, saves), db.del(getpath(n))]))
  const load = async n => {
    if (!saves.has(n)) { return error(Error(`REPL "${n}" is not found.`)) }
    const s = await db.get(getpath(n)), h = s?.history; if (s && isarr(h)) { _load(s) }
    else { return error(Error(`REPL "${n}" data corrupted.`)) }
  }, listall = () => Array.from(saves), exportall = () =>
    Promise.all(Array.from(saves).map(n => db.get(getpath(n))))

  {
    init(), pending.push(`// this REPL will automatically load data from name:
// "${replid}"
// you can do this manually by executing the following code
// $.load("${replid}")\n
// you can use ctrl+s to save current state
// which is identical to this command:
// $.save("${replid}")\n
// and this line will bring you back to the initial state
// $.forget("${replid}")\n
// "$.listall" will return a array of all saved REPL names
// "$.exportall" will return all saved REPL data`), eval(`$.load("${replid}")`, false)
  }
})

const defaultdo = ({ init, eval, pending }) => (init(), eval(""))
const createrepl = async (container, replid = "default", dosth = defaultdo) => {
  const h = 600, sty = [
    { overflow: "auto", display: "inline-block", height: h, width: "50%" },
    { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  const alldiv = dom("div", { parent: container, style: { display: "flex" } })
  const html = dom("div", { parent: alldiv, style: sty })
  const body = dom("div", { parent: html, style: { margin: 8 } })
  const adiv = dom("div", {
    parent: alldiv, style: [...sty, { overflow: "hidden" },
    { position: "relative", border: "none" },
    { display: "flex", flexDirection: "column" }]
  })
  const infodiv = dom("div", { parent: adiv, style: { height: "50%", width: `100%` } })
  const cdiv = dom("div", { parent: infodiv, style: [...sty, { height: "100%", width: "70%" }] })
  const ediv = dom("div", { parent: infodiv, style: [...sty, { height: "100%", width: "15%" }] })
  const sdiv = dom("div", {
    parent: infodiv, style: [...sty,
    { height: "100%", width: "15%", borderRight: "0.5px solid black" }]
  })
  const dlog = o => (...a) => {
    style(dom("pre", { text: a.join(" "), parent: cdiv, ...o }), { margin: 0 })
    cdiv.scrollTop = cdiv.scrollHeight
  }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
  const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: adiv, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: "50%", width: "100%" },
    { margin: 0, whiteSpace: "pre", wordWrap: "normal", borderTop: "none" }],
    onkeydown: (e, p = true) => {
      const { altKey: a, ctrlKey: c, shiftKey: s } = e
      if (e.key == "ArrowUp" && c) { load_pos(pos - 1) }
      else if (e.key == "ArrowDown" && c) { load_pos(pos + 1) }
      else if (e.key == "Enter" && (a || c || s)) { eval() }
      else if (e.key == "s" && c) { save(replid) }
      else if (e.key == "Alt") { } else { p = false } p ? e.preventDefault() : 0
    }, oninput: () => { edit_histroy[pos] = t.value }
  })

  let $, history, pos, edit_histroy, pending = []
  let snippets, isjs, aftedit, wait, resolve, reload = false
  const init = () => (history = [], pos = 0, $ = {
    dom, log, error, warn, clear, ssave, sload, eload,
    edit, save, forget, load, listall, exportall, newrepl: createrepl
  }, edit_histroy = [], pending = [], snippets = {}, reset())
  const reset = () => (isjs = true, aftedit = dummy, wait = false, resolve = ores)

  const dummy = () => { }, ores = () => { wait = false }
  const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
  const load_pos = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
  const update_list = (d, o) => (s = []) => d.innerHTML =
    (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
  const update_env = update_list(ediv, () => $)
  const update_his = i => (history.push(i), pos = history.length, edit_histroy = [])
  const update_nxt = (v = pending.shift()) => edit_histroy[pos] = t.value = v ? v : ""
  const update_all = (i, s) => (update_env(), update_snp(), i && s ? update_his(i) : 0, update_nxt())
  const env = () => ({ window: {}, document: { html, body }, $ })
  const err = e => (error(isstr(e) ? e : e.stack), pending.unshift(val()), isjs = true)
  const eval = async (i = val(), { save = true, reloading = false } = {}) => {
    if (!isjs) { isjs = true, aftedit(t.value), update_all(t.value, save) }
    else (await new Promise(async r => {
      try { reset(), await exec(env())(i) }
      catch (e) { err(e) } finally { if (!wait) { r() } else { resolve = r } }
    }), reload && !reloading ? reload = false : update_all(i, save))
  }
  const eload = async (url, f = () => { }) => {
    try {
      wait = true; const res = await fetch(url)
      if (res.ok) { await exec(env())(await res.text() + `\n(${f})()`) }
      else { throw `${res.type} ${url} ${res.status}` }
    } catch (e) { err(e) } finally { update_env(), update_snp(), resolve() }
  }

  const update_snp = update_list(sdiv, () => snippets)
  const ssave = name => isstr(name) ? snippets[name] = val() : 0
  const sload = (name, v = snippets[name]) => v ? pending.unshift(v) : 0
  const edit = (s, f) => { aftedit = f, isjs = false, pending.unshift(s) }

  const db = store("envjs"), spath = "saved_repl"
  const loadenv = { log, error, warn, clear, edit, eload }
  const _load = async (o, _ = (init(), $)) => {
    $ = {}, forin(_, (_, k) => $[k] = dummy), Object.assign($, loadenv)
    for (const h of o.history) { await eval(h, { reloading: true }) } history = o.history
    pos = o.pos, edit_histroy = o.edit_histroy, pending = o.pending, snippets = o.snippets
    Object.assign($, _), t.value = val(), update_env(), update_snp()
  }
  const saves = await db.get(spath) ?? new Set, getpath = n => [spath, n].join("/")
  const save = async n => (saves.add(n), Promise.all([db.set(spath, saves), db
    .set(getpath(n), { history, pos, edit_histroy, pending, snippets })]))
  const forget = async n => (saves.delete(n),
    Promise.all([db.set(spath, saves), db.del(getpath(n))]))
  const load = async n => {
    if (!saves.has(n)) { return error(Error(`REPL "${n}" is not found.`)) } reload = true;
    const s = await db.get(getpath(n)), h = s?.history; if (s && isarr(h)) { await _load(s) }
    else { error(Error(`REPL "${n}" data corrupted.`)), update_all(val()) }
  }, listall = () => Array.from(saves), exportall = () =>
    Promise.all(Array.from(saves).map(n => db.get(getpath(n))))

  dosth ? dosth({ init, eval, pending: (...a) => pending.push(...a) }) : 0
}
demos.push(() => {
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  const id = 5, title = "dom"
  dom("h3", { text: `DEMO ${id}: ${title}`, parent: demo, id: "demo" + id })
  dom("div", {
    parent: demo, text: `Having discussed so many feature of the REPL itself,
    let's have a taste on the actual application. DOM operation should be
    a good topic so here it is.`, style: { margin: "1em 0em" }
  })
  dom("div", {
    parent: demo, text: `The editor layout is changed a little bit,
    but I believe you can figure it out.`, style: { margin: "1em 0em" }
  })
  createrepl(demo, "demo 5: dom", ({ init, eval, pending }) => {
    const expmd = `# Marked in browser\n\nRendered by **marked**.`
    init(), pending(`// firstly, load a markdown lib
$.eload("../external/marked.min.js", () => { $.marked = marked })` , ` // now test it
$.log($.marked(\`${expmd}\`))`, `// use it\n
// (document.body is not the real html body in here so this is ok)
document.body.innerHTML = $.marked(\`${expmd}\`)`, `// make a function
$.update = s => document.body.innerHTML = $.marked(s)`, `// remember the "$.edit" ?
$.edit("# This a markdown document, do whatever you want to it.", $.update)`, `// something more interesting\n
// make a div element using "$.dom"
const somediv = $.dom("div", { parent: document.body })\n
// use "$.newrepl" to create a new REPL
$.newrepl(somediv)`, `// that's how you make a REPL inside a REPL`), eval("")
  })
})

demos.push(() => {
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  const id = 6, title = "write the editor inside the editor", replid = `demo ${id}: ${title}`
  dom("h3", { text: `DEMO ${id}: ${title}`, parent: demo, id: "demo" + id })
  dom("div", {
    parent: demo, text: `In the previous section we see how to create a REPL
    inside a REPL, but that is done through the global function "$.newrepl",
    which is just cheating from the perspective of a editor creater. So the
    goal of this section is to implement "$.newrepl" manually, step by step,
    with no secret left behind.`, style: { margin: "1em 0em" }
  })
  dom("div", {
    parent: demo, text: `(this chapter is deprecated)`, style: { margin: "1em 0em" }
  })
  createrepl(demo, replid, ({ init, eval, pending }) => {
    init()
    pending()
    eval(`await $.load("${replid}"), $.clear()`, { save: false })
    // eval(`$.load("${replid}")`, { save: false })
  })
})

const rnd8 = () => Math.random().toString(16).slice(2, 10)
const uuid = (a = rnd8(), b = rnd8()) => [rnd8(), a.slice(0, 4)
  , a.slice(4), b.slice(0, 4), b.slice(4) + rnd8()].join("-")
demos.push(() => {
  const demo = dom("div", { parent: ctn, style: { position: "relative" } })
  const id = 7, title = "recap & new design", replid = `demo ${id}: ${title}`
  dom("h3", { text: `DEMO ${id}: ${title}`, parent: demo, id: "demo" + id })

  dom("div", {
    parent: demo, text: [`在DEMO6中我理解到一件事情：要在REPL中完成一整段程序是困难的，
这主要是由于用户只能看到他们当前正在编写的一小段程序，
而大部分时间我们希望看到正在操作的整个程序上下文，
我原本以为简单打印出环境中的所有数据可以解决这一问题，但事实看来并非如此。`,
      `I learned one thing in DEMO6: it is difficult to complete a whole program in REPL,
      this is mainly because users can only see a small fraction of what
      they are currently working on, and most of the time we want to see the entire program context,
      I originally thought that simply printing out all the data in the environment
      could solve this problem, but it doesn't seem to be the case.`][1], style: { margin: "1em 0em" }
  })
  dom("div", {
    parent: demo, text: [`为此我在原有的设计上添加了一点变化，
让用户可以方便地浏览并操作REPL中的历史记录（这解决了许多用户交互上的问题）。`
      , `For this reason, I add a little change to the original design
      so that users can easily browse and manipulate the history records
      in the REPL. (This solves many user-interaction problems)`][1], style: { margin: "1em 0em" }
  })
  const line = text => dom("div", { parent: demo, text, style: { margin: "0.5em 0em" } })
  line(`Hot keys:`)
  line(`PageUp/PageDown: move up/down in history`)
  line(`Shift + PageUp/PageDown: swap up/down history`)
  line(`Shift + Enter: step one command`)
  line(`Alt + R: execute till this command`)
  line(`Shift + Delete/Insert: delete/insert a command`)


  const root = dom("div", { parent: demo }).attachShadow({ mode: "open" })
  const csselm = dom("style", { parent: root }), px = v => isnum(v) ? `${v}px` : v
  const hyphenate = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
  const content = s => Object.keys(s).reduce((p, k) => p + `${hyphenate(k)}: ${px(s[k])}; `, "")
  const css = (e => (r, ...s) => { e.sheet.insertRule(`${r} { ${s.map(v => content(v)).join(" ")}}`) })(csselm)
  css("textarea:focus", { background: "#baffbc", outline: "none" })
  css("textarea", { display: "block", position: "absolute", boxSizing: "border-box", margin: 0, border: 0 },
    { background: "#ddd", boxShadow: "inset white 0px 0px 20px 5px", resize: "none", width: "100%" },
    { padding: 10, lineHeight: "1em", fontSize: "1em", fontFamily: "consolas, courier new, monospace" },
    { transition: "top 0.5s cubic-bezier(.08,.82,.17,1) 0s", overflow: "hidden" })

  const topdiv = dom("div", { parent: root, style: { display: "flex", height: "50vh" } })
  const txtlist = dom("div", {
    parent: topdiv, style: [{ border: "1px solid black", borderRight: "none" },
    { width: "50%", position: "relative", overflow: "auto" }]
  }), htmldiv = dom("div", { parent: topdiv, style: { border: "1px solid black", width: "50%" } })

  const newdata = (v = "") => ({ uuid: uuid(), value: v })
  let data = maprg(100, i => newdata("return " + i)), order, elms
  // let data = [], order, elms
  let pos = 0, curr = 0, $ = { window: {}, document: {} }

  const valid = i => 0 <= i && i < data.length, swap = (a, b, t = data[a]) =>
    valid(a) && valid(b) ? (data[a] = data[b], data[b] = t, cstate(Math.min(a, b)), update()) : 0
  const focus = (e, y = Number(e.style.top.slice(0, -2)) + (e.clientHeight - txtlist.clientHeight) / 2) =>
    (txtlist.scrollTo({ left: 0, top: y, behavior: "smooth" }), e.focus())
  const moveto = p => valid(p) ? focus(elms[data[pos = p].uuid]) : 0
  const swapwith = (id, r, a = order[id], b = a + r) => (swap(a, b), moveto(order[id]))
  const step = async (i = curr, r) => {
    if (!valid(i)) { return false } try {
      r = await exec({ ...$, $ })(data[i].value), curr++
      r ? log(r) : 0; data[i].state = "executed"; return true
    } catch (e) { data[i].state = "error"; return false }
  }
  const execto = async i => { if (curr > i) cstate(); while (curr <= i && await step()); ustate() }

  const update = () => (!data || data.length === 0 ? data = [newdata()] : 0,
    order = {}, elms = {}, forrg(data.length, (i, l = data[i]) => order[l.uuid] = i),
    forof([...txtlist.children], e => order[e.uuid] ? elms[e.uuid] = e : e.remove()),
    forof(data, d => elms[d.uuid] ? 0 : elms[d.uuid] = editor(d)), uposition(), ustate())

  const oninput = (s, id) => { data[order[id]].value = s, uposition(), moveto(order[id]) }
  const uposition = (h = 0, i = 0) => forof(data, ({ uuid }, e = elms[uuid]) => (
    style(e, { top: h, zIndex: String(i++) }), h += e.getBoundingClientRect().height))
  const uheight = (e, l = 1) => { e.style.height = "", e.style.height = `calc(${l}em + 20px)` }
  const ustate = () => forof(data, ({ state: s, uuid: u }, y = elms[u].style) =>
    y.background = { executed: "#8f8fff", error: "#ff7b7b" }[s] ?? "")
  const cstate = (m = 0, i = 0) => ( // TODO: refresh repl state
    forof(data, d => i++ >= m ? delete d.state : 0), curr > m ? curr = m : 0)

  const emitkey = new Set(`Alt Tab`.split(" "))
  const editor = ({ value, uuid }) => dom("textarea", {
    spellcheck: "false", uuid, value, parent: txtlist, onkeydown: async (e, p = true) => {
      const { altKey: a, ctrlKey: c, shiftKey: s } = e, n = !(a || c || s)
      if (e.key == "ArrowUp" && c && !s || e.key === "PageUp" && n) { moveto(pos - 1) }
      else if (e.key == "ArrowDown" && c && !s || e.key === "PageDown" && n) { moveto(pos + 1) }
      else if (e.key == "ArrowUp" && c && s || e.key === "PageUp" && s) { swapwith(uuid, -1) }
      else if (e.key == "ArrowDown" && c && s || e.key === "PageDown" && s) { swapwith(uuid, +1) }
      else if (e.key == "Delete" && s) {
        data.splice(order[uuid], 1), cstate(order[uuid]), update()
        const l = data.length; moveto(pos < l ? pos : l - 1)
      } else if (e.key == "Insert" && s) {
        data.splice(order[uuid] + 1, 0, newdata())
        cstate(order[uuid] + 1), update(), moveto(pos + 1)
      } else if (e.key == "Enter" && (a || c || s)) {
        if (data[curr].state !== "error") {
          await step(); const l = data.length
          if (curr === l && data[l - 1].value !== "") {
            data.push(newdata()), update(), moveto(l)
          } else { ustate() }
        }
      } else if (e.key == "r" && a) { execto(order[uuid]) }
      else if (e.key == "s" && c) { }
      else if (e.key == "ArrowLeft" && a || e.key == "ArrowRight" && a) { }
      else if ((emitkey.has(e.key))) { } else { p = false } p ? e.preventDefault() : 0
    }, oninput: (e, t = e.target, v = t.value) => (uheight(t, v.split(/\r?\n/).length),
      cstate(order[uuid]), ustate(), oninput(v, uuid)), onclick: _ => moveto(order[uuid]),
  }, uheight)

  update()
})

const convert_diff = (df, r = [], o = 0) => (forrg(df.length, (i
  , [pd, _, __, pl] = df[i - 1] ?? [], [dw, x, y, l] = df[i]
  , j = dw ? y : x, p = r[r.length - 1], [t, s, e] = p ?? []) =>
  x < 0 || y < 0 ? 0 : dw === pd && pl === 0 ? p[2] += 1 : (o += isudf(t) ? 0
    : t ? e - s : s - e, r.push([dw, j, j + 1, o]))), r)
const forward_myers = (a, b) => {
  const vs = [], n = a.length, m = b.length, max = n + m, v = { [1]: 0 }
  let found = false; for (let d = 0; d <= max; d++) {
    for (let k = -d; k <= d; k += 2) {
      const down = k === -d || k !== d && v[k - 1] < v[k + 1]
      const xs = down ? v[k + 1] : v[k - 1]; let xe = down ? xs : xs + 1, ye = xe - k
      while (xe < n && ye < m && a[xe] === b[ye]) { xe++, ye++ } v[k] = xe
      if (xe >= n && ye >= m) { found = true }
    } if (found) { vs.push(v); break } vs.push({ ...v });
  } let r = [], xs = n, ys = m; for (let d = vs.length - 1; d >= 0; d--) {
    const v = vs[d], k = xs - ys, down = k === -d || k !== d && v[k - 1] < v[k + 1]
    xs = down ? v[k + 1] : v[k - 1], ys = xs - (down ? k + 1 : k - 1)
    let xe = down ? xs : xs + 1, ye = xe - k, l = 0
    while (xe < n && ye < m && a[xe] === b[ye]) { xe++, ye++, l++ }
    r.unshift([down, xs, ys, l])
  } if (r[0] && r[0][1] == 0 && r[0][2] == -1 && r[0][3] == 0) { r.shift() }
  return convert_diff(r)
}

// forof(forward_myers("a".split(""), "abcd".split("")), log)
// log("--------------------")
// forof(forward_myers("accd".split(""), "abcd".split("")), log)
// log("--------------------")
// forof(forward_myers("".split(""), "abcd".split("")), log)
// log("--------------------")
// forof(forward_myers("FDAJKDLFAS".split(""), "FDLFDFASDAS".split("")), log)


// v repl code extraction (poor choice)
// v SAVE
// ? version control
// v dom interface
// * tabs
// * omit mode
// * worker thread

forof(demos, d => d())