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
const sleep = n => new Promise(r => setTimeout(r, n))

const rnd8 = () => Math.random().toString(16).slice(2, 10)
const uuid = (a = rnd8(), b = rnd8()) => [rnd8(), a.slice(0, 4)
  , a.slice(4), b.slice(0, 4), b.slice(4) + rnd8()].join("-")

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

const fullrepl = async (demo, { shflag = true, name = "env.js - 101" } = {}) => {
  const root = demo.attachShadow({ mode: "open" })
  const csselm = dom("style", { parent: root }), px = v => isnum(v) ? `${v}px` : v
  const hyphenate = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
  const content = s => Object.keys(s).reduce((p, k) => p + `${hyphenate(k)}: ${px(s[k])}; `, "")
  const css = (e => (r, ...s) => { e.sheet.insertRule(`${r} { ${s.map(v => content(v)).join(" ")}}`) })(csselm)
  css("textarea:focus", { background: "#00ff0020", outline: "none" },
    { boxShadow: "inset #ffffff60 0px 0px 20px 5px" })
  css("textarea", { display: "block", boxSizing: "border-box", margin: 0, border: 0, padding: 0 },
    { background: "#00000000", resize: "none", width: "100%", overflow: "hidden", whiteSpace: "pre" },
    { lineHeight: "1em", fontSize: "1em", fontFamily: "consolas, courier new, monospace" })
  css(".repl-item", { display: "block", position: "absolute", margin: 0, border: 0, padding: 10 },
    { background: "#ddd", boxShadow: "inset white 0px 0px 20px 5px", resize: "none", width: "100%" },
    { transition: "all 0.5s cubic-bezier(.08,.82,.17,1) 0s", overflow: "hidden", boxSizing: "border-box" })
  css(".repl-item-result", { margin: 0, fontSize: 12, color: "#555" })
  css(".no-scroll-bar::-webkit-scrollbar", { display: "none" })
  css(".no-scroll-bar", { MsOverflowStyle: "none", scrollbarWidth: "none" })
  const scolor = { executed: "#8f8fff", error: "#ff7b7b", working: "#ffff75" }

  const shtrans = "all 0.3s", topdiv = dom("div", {
    style: { display: "flex", height: "100%", background: "white" }, parent: root, tabindex: "0", onkeydown:
      (e, { key: k, altKey: a, ctrlKey: c, shiftKey: s } = e) => (k + a + c + s !== "`truefalsefalse"
        ? 0 : shflag = (shflag ? hide() : show(), !shflag), e.stopPropagation())
  }), editordiv = dom("div", { parent: topdiv }, e => style(e, { boxSizing: "border-box" },
    { transition: shtrans }, shflag ? { borderRight: "1px solid black" } : {},
    { width: shflag ? "50%" : 0, position: "relative", overflow: "hidden" }))
  const txtlist = dom("div", { parent: editordiv, class: "no-scroll-bar" }, e => style(e,
    { transition: shtrans, position: "relative", width: "100%", height: "100%" },
    { overflow: "auto" }))
  const framediv = dom("div", { parent: topdiv }, e =>
    style(e, { width: shflag ? "50%" : "100%", transition: shtrans, overflow: "hidden" }))
  const html = dom("div", { parent: framediv }, e => style(e, shflag ? { transform: `scale(0.5)` } : {},
    { width: "100vw", height: "100vh", transition: shtrans, transformOrigin: "top left", overflow: "auto" }))

  const show = (p = 0.5) => (
    style(editordiv, { width: p * 100 + "%", borderRight: "1px solid black" }),
    style(framediv, { width: (1 - p) * 100 + "%" }),
    style(html, { transform: `scale(${1 - p})` }))
  const hide = () => (style(editordiv, { width: 0, borderRight: "" }),
    style(framediv, { width: "100%" }), style(html, { transform: "" }))

  const newdata = (v = "") => ({ uuid: uuid(), value: v })
  let data = [].map(newdata)//; data = maprg(10, i => newdata("return " + i))
  let pos = 0, curr = 0, $, $$ = { name }, $$$, order, elms

  const valid = i => 0 <= i && i < data.length
  const focus = (e, c = e.children[0].clientHeight, h = txtlist.clientHeight,
    y = Number(e.style.top.slice(0, -2)) + (c - h) / 2) =>
    (c < h ? txtlist.scrollTo({ left: 0, top: y, behavior: "smooth" }) : 0, e.children[0].focus())
  const move = p => valid(p) ? focus(elms[data[pos = p].uuid]) : 0
  const moverel = p => move(pos + p)
  const swap = async (a, b, t = data[a]) => valid(a) && valid(b) ?
    (data[a] = data[b], data[b] = t, await cstate(Math.min(a, b)), update()) : 0
  const swaprel = async (id, r, a = order[id], b = a + r) => (await swap(a, b), move(order[id]))

  const env = () => ({ window: {}, document: { html, body }, ...$$$, $, $$, $$$, main: true })
  const step = async (i = curr, r) => {
    if (!valid(i)) { return false } try {
      elms[data[i].uuid].style.background = scolor.working
      r = await exec(env())(data[i].value), curr++, wrtdata(data[i], r)
    } catch (e) {
      if (e === skip) { curr++; return true }
      wrtdata(data[i], e.stack, "error"); return false
    } return true
  }; let body

  const update = () => (!data || data.length === 0 ? data = [newdata()] : 0,
    order = {}, elms = {}, forrg(data.length, (i, l = data[i]) => order[l.uuid] = i),
    forof([...txtlist.children], e => isnum(order[e.uuid]) ? elms[e.uuid] = e : e.remove()),
    forof(data, d => elms[d.uuid] ? 0 : elms[d.uuid] = editor(d)), uresult(), uposition(), ustate())

  const stringify = r => isstr(r) ? r : isfct(r) ? "" + r : JSON.stringify(r)
  const uresult = () => forof(data, ({ uuid, result }) =>
    elms[uuid].children[1].textContent = stringify(result))
  const uposition = (h = 0, i = 0) => forof(data, ({ uuid }, e = elms[uuid]) => (
    style(e, { top: h, zIndex: String(i++) }), h += e.getBoundingClientRect().height))
  const uheight = (e, l = 1) => { e.style.height = "", e.style.height = `calc(${l}em + 2px)` }
  const ustate = () => forof(data, ({ state: s, uuid }) => elms[uuid].style.background = scolor[s] ?? "")
  const clrdata = d => (delete d.result, delete d.state)
  const wrtdata = (d, r, s = "executed") => (d.result = r, d.state = s)

  const add = async (uuid, i = order[uuid] + 1) => (
    data.splice(i, 0, newdata()), await cstate(i), update(), moverel(1))
  const del = async (uuid, i = order[uuid]) => (data.splice(i, 1),
    await cstate(i), update(), moverel(pos < data.length ? 0 : -1))
  const forward = async (focus = false, l = data.length) => {
    if (valid(curr) && data[curr].state !== "error") { await step() }
    if (curr === l && data[l - 1].value !== "") { data.push(newdata()) }
    update(), focus ? move(Math.min(curr, data.length - 1)) : 0
  }, backward = async (focus = false) => (
    await exectill(curr - 2, { focus, reset: false }), focus ? move(curr) : 0)
  const exectill = async (i, { reset: r = true, stop = null,
    hard = false, focus = false } = {}) => {
    if (!valid(i) && i !== -1) { return }
    if (curr > i || hard) { _cstate(), curr = 0, r ? reset(hard) : 0 }
    while (curr <= i && await step() && (stop ? !stop(env()) : true)) { }
    update(), focus ? move(i) : 0
  }, _cstate = (m = 0) => forrg(data.length, (i, d = data[i]) =>
    i >= m && d.state !== "error" ? clrdata(d) : 0)
  const cstate = async (m = 0, o = { reset: false }) =>
    (_cstate(m), curr > m ? await exectill(m - 1, o) : 0)

  const skip = Symbol("skip execution")
  const reset = (hard = false) => (html.innerHTML = "",
    body = dom("div", { parent: html }), $ = {}, hard ? $$ = { name } : 0, $$$ = {
      log, dom, style, load, read, erase, save, repls: () => repls, fullrepl,
      keybind, bindkey, moverel, swaprel, add, del, forward, backward, exectill,
      skip: (f, r = f()) => { if (r) throw skip }
    })
  const load = async (n = $$.name) => (
    data = (isstr(n) ? await read(n) : n).map(newdata),
    reset(), update(), move(data.length - 1))
  const read = async (n, p = srk + "/" + n) => await idb.get(p) ?? []
  const erase = async (n, p = srk + "/" + n) => (repls.del(n),
    await Promise.all([idb.set(srk, repls), idb.del(p)]))
  const save = async (n = $$.name, p = srk + "/" + n) => (repls.add(n),
    await Promise.all([idb.set(srk, repls), idb.set(p, data.map(d => d.value))]))

  const transkey = (v, a = "f", c = "f", s = "f", k = "", f) => (forof(v.split(" "),
    v => v == "any" ? f = 1 : v == "alt" ? a = "t" : v == "ctrl"
      ? c = "t" : v == "shift" ? s = "t" : k = v), f ? k : k + a + c + s)
  const keybind = {}, bindkey = (f, ...a) => forof(a, a => keybind[transkey(a)] = f)
  const testkey = (e, uuid, { key: k, altKey: a, ctrlKey: c, shiftKey: s } = e, p,
    f = keybind[k + [a, c, s].map(b => b ? "t" : "f").join("")] ?? keybind[k]) =>
    (f ? p = !f(uuid) : 0, p ? e.preventDefault() : 0)

  const exectoid = (uuid, o) => exectill(order[uuid], o)
  const rtdiv = dom("div", { parent: editordiv }, e => style(e,
    { transition: "all 1s", zIndex: String(1e10), top: 0, position: "absolute" },
    { width: "100%", height: "100%", pointerEvents: "none" }))
  let realtime = false, togglert = () => realtime = (!realtime
    ? style(rtdiv, { boxShadow: "inset 0 0 50px 20px #fff03c6b" })
    : style(rtdiv, { boxShadow: "inset 0 0 0 0 #fff03c6b" }), !realtime)

  bindkey(_ => { moverel(-1) }, "ArrowUp ctrl", "PageUp")
  bindkey(_ => { moverel(+1) }, "ArrowDown ctrl", "PageDown")
  bindkey(_ => { swaprel(_, -1) }, "ArrowUp ctrl shift", "PageUp shift")
  bindkey(_ => { swaprel(_, +1) }, "ArrowDown ctrl shift", "PageDown shift")
  bindkey(_ => { add(_) }, "Insert shift")
  bindkey(_ => { del(_) }, "Delete shift")
  bindkey(_ => { forward(true) }, "shift Enter", "Tab")
  bindkey(_ => { backward(true) }, "ctrl Enter", "shift Tab")
  bindkey(_ => { exectoid(_, { reset: false }) }, "e alt")
  bindkey(_ => { exectoid(_) }, "d alt")
  bindkey(_ => { exectoid(_, { hard: true }) }, "R alt shift ctrl")
  bindkey(_ => { save() }, "s ctrl")
  bindkey(_ => { togglert() }, "b ctrl")
  bindkey(_ => { }, "Alt any", "Tab any", "ArrowLeft alt", "ArrowRight alt")

  const editor = ({ value, uuid }) => dom("div", {
    onclick: _ => move(order[uuid]), class: "repl-item",
    parent: txtlist, uuid, child: [dom("textarea", {
      spellcheck: "false", value, onkeydown: e => testkey(e, uuid),
      oninput: async (e, t = e.target, v = t.value) => (
        uheight(t, v.split(/\r?\n/).length), clrdata(data[order[uuid]]),
        data[order[uuid]].value = v, await (realtime
          ? exectill(order[uuid], { reset: false })
          : cstate(order[uuid], { reset: false })),
        update(), move(order[uuid])),
    }, e => uheight(e, value.split(/\r?\n/).length)),
    dom("pre", { class: "repl-item-result" })]
  })

  const idb = store("envjs"), srk = "saved_repl"
  const repls = await idb.get(srk) ?? new Set()
  if (dev) { await load() }
  else { await load(JSON.parse(await (await fetch("101.json")).text())) }
  await exectill(data.length - 1, { stop: o => o.$$.state == "init" })
  await forward()
}

const dev = !!new URL(window.location.href).searchParams.get("dev")
style(document.body, { margin: 0, height: "100vh" })
fullrepl(document.body, { shflag: dev })
