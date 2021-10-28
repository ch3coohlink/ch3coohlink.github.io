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

const fullrepl = async (demo) => {
  const root = demo.attachShadow({ mode: "open" })
  const csselm = dom("style", { parent: root }), px = v => isnum(v) ? `${v}px` : v
  const hyphenate = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
  const content = s => Object.keys(s).reduce((p, k) => p + `${hyphenate(k)}: ${px(s[k])}; `, "")
  const css = (e => (r, ...s) => { e.sheet.insertRule(`${r} { ${s.map(v => content(v)).join(" ")}}`) })(csselm)
  css("textarea:focus", { background: "#00ff0020", outline: "none" },
    { boxShadow: "inset #ffffff60 0px 0px 20px 5px" })
  css("textarea", { display: "block", boxSizing: "border-box", margin: 0, border: 0, padding: 10 },
    { background: "#00000000", resize: "none", width: "100%", overflow: "hidden", whiteSpace: "pre" },
    { lineHeight: "1em", fontSize: "1em", fontFamily: "consolas, courier new, monospace" })
  css(".repl-item", { display: "block", position: "absolute", margin: 0, border: 0 },
    { background: "#ddd", boxShadow: "inset white 0px 0px 20px 5px", resize: "none", width: "100%" },
    { transition: "all 0.5s cubic-bezier(.08,.82,.17,1) 0s", overflow: "hidden" })
  css(".repl-item-result", { margin: 0, padding: "0px 10px", fontSize: "0.5em", color: "#555" })
  const scolor = { executed: "#8f8fff", error: "#ff7b7b", working: "#ffff75" }

  const topdiv = dom("div", { parent: root, style: { display: "flex", height: "100%" } })
  const txtlist = dom("div", {
    parent: topdiv, style: [{ borderRight: "1px solid black" },
    { width: "50%", position: "relative", overflow: "auto" }]
  }), framediv = dom("div", { parent: topdiv, style: { width: "50%" } })
  const html = dom("div", { parent: framediv })
  const body = dom("div", { parent: framediv })

  const newdata = (v = "") => ({ uuid: uuid(), value: v })
  let data = [].map(newdata)//; data = maprg(10, i => newdata("return " + i))
  let pos = 0, curr = 0, $, $$ = { name: "env.js - 101" }, $$$, order, elms

  const valid = i => 0 <= i && i < data.length
  const focus = (e, c = e.children[0].clientHeight, h = txtlist.clientHeight,
    y = Number(e.style.top.slice(0, -2)) + (c - h) / 2) =>
    (c < h ? txtlist.scrollTo({ left: 0, top: y, behavior: "smooth" }) : 0, e.children[0].focus())
  const move = p => valid(p) ? focus(elms[data[pos = p].uuid]) : 0
  const moverel = p => move(pos + p)
  const swap = async (a, b, t = data[a]) => valid(a) && valid(b) ?
    (data[a] = data[b], data[b] = t, await cstate(Math.min(a, b)), update()) : 0
  const swaprel = async (id, r, a = order[id], b = a + r) => (await swap(a, b), move(order[id]))
  const step = async (i = curr, r) => {
    if (!valid(i)) { return false } try {
      elms[data[i].uuid].style.background = scolor.working
      r = await exec(env())(data[i].value), curr++, wrtdata(data[i], r)
    } catch (e) { wrtdata(data[i], e.stack, "error"); return false } return true
  }

  const update = () => (!data || data.length === 0 ? data = [newdata()] : 0,
    order = {}, elms = {}, forrg(data.length, (i, l = data[i]) => order[l.uuid] = i),
    forof([...txtlist.children], e => isnum(order[e.uuid]) ? elms[e.uuid] = e : e.remove()),
    forof(data, d => elms[d.uuid] ? 0 : elms[d.uuid] = editor(d)), uresult(), uposition(), ustate())

  const stringify = r => isstr(r) ? r : isfct(r) ? "" + r : JSON.stringify(r)
  const uresult = () => forof(data, ({ uuid, result }) =>
    elms[uuid].children[1].textContent = stringify(result))
  const uposition = (h = 0, i = 0) => forof(data, ({ uuid }, e = elms[uuid]) => (
    style(e, { top: h, zIndex: String(i++) }), h += e.getBoundingClientRect().height))
  const uheight = (e, l = 1) => { e.style.height = "", e.style.height = `calc(${l}em + 20px)` }
  const ustate = () => forof(data, ({ state: s, uuid }) => elms[uuid].style.background = scolor[s] ?? "")
  const clrdata = d => (delete d.result, delete d.state)
  const wrtdata = (d, r, s = "executed") => (d.result = r, d.state = s)

  const add = async (uuid, i = order[uuid] + 1) => (
    data.splice(i, 0, newdata()), await cstate(i), update(), moverel(1))
  const del = async (uuid, i = order[uuid]) => (data.splice(i, 1),
    await cstate(i), update(), moverel(pos < data.length ? 0 : -1))
  const forward = async (l = data.length) => {
    if (valid(curr) && data[curr].state !== "error") { await step() }
    if (curr === l && data[l - 1].value !== "") { data.push(newdata()) }
    update(), move(Math.min(curr, data.length - 1))
  }, backward = async _ => await exectill(curr - 2)
  const reset = () => ($ = {}, html.innerHTML = "", $$$ =
    { dom, load, read, erase, save, repls: () => repls })
  const exectill = async i => {
    if (!valid(i) && i !== -1) { return } if (curr > i) { _cstate(), curr = 0, reset() }
    while (curr <= i && await step()) { } update(), move(i)
  }, _cstate = (m = 0) => forrg(data.length, (i, d = data[i]) =>
    i >= m && d.state !== "error" ? clrdata(d) : 0)
  const cstate = async (m = 0) => (_cstate(m), curr > m ? await exectill(m - 1) : 0)

  const env = () => ({ window: {}, document: { html, body }, ...$$$, $, $$, $$$ })
  const load = async (n = $$.name) => (data = (await read(n)).map(newdata), reset(), update(), move(0))
  const read = async (n, p = srk + "/" + n) => await idb.get(p) ?? []
  const erase = async (n, p = srk + "/" + n) => (repls.del(n),
    await Promise.all([idb.set(srk, repls), idb.del(p)]))
  const save = async (n = $$.name, p = srk + "/" + n) => (repls.add(n),
    await Promise.all([idb.set(srk, repls), idb.set(p, data.map(d => d.value))]))
  const emitkey = new Set(`Alt Tab`.split(" "))
  const editor = ({ value, uuid }) => dom("div", {
    onclick: _ => move(order[uuid]), class: "repl-item",
    parent: txtlist, uuid, child: [dom("textarea", {
      spellcheck: "false", value, onkeydown: (e, p = true) => {
        const { altKey: a, ctrlKey: c, shiftKey: s } = e, n = !(a || c || s)
        if (e.key == "ArrowUp" && c && !s || e.key === "PageUp" && n) { moverel(-1) }
        else if (e.key == "ArrowDown" && c && !s || e.key === "PageDown" && n) { moverel(+1) }
        else if (e.key == "ArrowUp" && c && s || e.key === "PageUp" && s) { swaprel(uuid, -1) }
        else if (e.key == "ArrowDown" && c && s || e.key === "PageDown" && s) { swaprel(uuid, +1) }
        else if (e.key == "Insert" && s) { add(uuid) } else if (e.key == "Delete" && s) { del(uuid) }
        else if (e.key == "Enter" && s && c) { backward() }
        else if (e.key == "Enter" && (a || c || s) && !(s && c)) { forward() }
        else if (e.key == "e" && a) { exectill(order[uuid]) }
        else if (e.key == "s" && c) { save() }
        else if (e.key == "ArrowLeft" && a || e.key == "ArrowRight" && a) { }
        else if ((emitkey.has(e.key))) { } else { p = false } p ? e.preventDefault() : 0
      }, oninput: async (e, t = e.target, v = t.value) => (
        uheight(t, v.split(/\r?\n/).length), clrdata(data[order[uuid]]),
        await cstate(order[uuid]), data[order[uuid]].value = v, update(), move(order[uuid])),
    }, uheight), dom("pre", { class: "repl-item-result" })]
  })

  const idb = store("envjs"), srk = "saved_repl"
  const repls = await idb.get(srk) ?? new Set(); await load()
}

style(document.body, { margin: 0, height: "100vh" })
fullrepl(document.body)
