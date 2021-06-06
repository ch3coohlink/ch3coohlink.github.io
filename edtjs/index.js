const __sandbox__ = (__src__, __ctx__, _____ = []) => {
  for (const k in __ctx__) { _____.push(k) }
  eval(["const {", ..._____.map(v => v + ","),
    "} = __ctx__;\n"].join(" ") + __src__) }

(() => { const { log, dir, clear } = console
const fori = (n, f, s = 0, d = 1) => { for(let i = s; i < n; i+=d) f(i) }
const forin = (o, f) => { for(const k in o) f(o[k], k) }
const forof = (o, f) => { for(const v of o) f(v) }
const cases = (h, ...t) => ((m, d) => (c, ...a) =>
  m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
const isnum = o => typeof o == "number"
const isstr = o => typeof o == "string"
const isarr = Array.isArray

const rnd8 = () => Math.random().toString(16).slice(2, 10)
const uuid = (a = rnd8(), b = rnd8()) => [rnd8(), a.slice(0,4),
  a.slice(4), b.slice(0,4), b.slice(4) + rnd8()].join("-")
const dsplice = (parent, start, count, ...nodes) => ((cn = parent.childNodes
  , rm = [], l = cn.length, df = document.createDocumentFragment()
  , s = start < 0 ? l + start : start, e = isnum(count) ? s + count : l) => (
  fori(e, () => cn[s] ? rm.push(parent.removeChild(cn[s])) : 0, s),
  forof(nodes, e => df.appendChild(e)), parent.insertBefore(df, cn[s]), rm))()
const _dom = cases((e, v, k) => e[k] = v,
  ["class", (e, v, k) => e.setAttribute(k, isarr(v) ? v.join(" ") : v)],
  ["child", (e, v) => e.append(...v)],
  ["parent", (e, v) => v ? v.appendChild(e) : 0],
  ["style", (e, v) => style(e, v)])
const px = v => isnum(v) ? `${v}px` : v
const style = (elm, ...style) => (forof(style,
  s => forin(s, (v, k) => elm.style[k] = px(v))), elm)
const dom = (n, o = {}, f = v => v
  , e = isstr(n) ? document.createElement(n) : n) => 
  f((forin(o, (v, k) => _dom(k, e, v, k)), e))

const item = t => t.split(" "), part = t => t.split("|")
const ctrl = (t, i, c, o) => part(t).map(t=>item(t.trim())).forEach(s => {
  const j = c(), [t, ...a] = j == 0 ? ["name", s[0]]
    : j == 1 ? ["type", s[0] || "js"] : s, r = [i, ...a]
  !t ? 0 : o[t] ? o[t].push(r) : o[t] = [r] })
const txt2obj = (t, o = {}, a = [], c = (i=>()=>i++)(0)) => (
  t.split(/\r\n?|\n/).forEach((t, i) => t.startsWith("//#") ?
    ctrl(t.slice(3), i, c, o) : a.push([i, t])), o.text = a, o)

const store = (name="default", store="default") => {
const _ = null, ro = f => action("readonly", f), rw = f => action("readwrite", f)
const dbp = new Promise((res, rej, r = indexedDB.open(name)) => (r.onsuccess = () => res(r.result),
  r.onupgradeneeded = () => r.result.createObjectStore(store), r.onerror = () => rej(r.error)))
const action = (type, cb) => dbp.then(db => new Promise((r, j, t = db.transaction(store, type)) =>
    (t.oncomplete = () => r(), t.onabort = t.onerror = () => j(t.error), cb(t.objectStore(store)))))
const key = (r = _) => ro(s => s.getAllKeys().onsuccess = e => r = e.target.result).then(() => r)
const val = (r = _) => ro(s => s.getAll().onsuccess = e => r = e.target.result).then(() => r)
const get = (k, r = _) => ro(s => r = s.get(k)).then(() => r.result), clr = () => rw(s => s.clear())
const set = (k, v) => rw(s => s.put(v, k)), del = k => rw(s => s.delete(k))
return { get, set, del, clr, key, val } }

const codebase = (o, d, k = "codebase") => {
const add = ([i, t]) => o[i] = t
const del = ([i]) => delete o[i]
const save = () => d.set(k, o)
const init = s => (d = s, o = d.get(k))
return {add, del, save, init, get data() { return o }} }

const livecode = (a, d, b) => {
const add = (i, o) => a.splice(i, 0, o)
const del = (i, n = 1) => a.splice(i, n)
const mod = (i, o) => a[i] = o
const mov = (x, y, t = a[x]) => (del(x), add(y > x ? y - 1 : y, t))
const swp = (x, y, t = a[x]) => (a[x] = a[y], a[y] = t)
const save = () => (d.set("live", a), forof(a, b.add))
const init = (s, ib) => (d = s, b = ib, a = d.get("live"))
return { add, del, mod, mov, swp, save, init, get data() { return a } } }

const objcache = (b, l, bi, li) => {
const init = () => (b = m(), l = m(), bi = m(), li = m())
const dictdict = (d, k) => (d.has(k) ? d.set(k, new Map) : d).get(k)
const dictpush = m => (t, k, v, d = dictdict(m, t), a = d.get(k)) =>
  (a ? a.push(v) : d.set(k, a = [v]), a.length - 1)
const bp = dictpush(b), lp = dictpush(l)
const add = (del, di, dp) => ([i, t], o = txt2obj(t),
  { type:ty, name:n } = o) => (di.has(i) ? del([i]) : 0,
    di.set(i, [ty, n, dp(ty, n, o)]))
const del = (d, di) => ([i], [ty, n, p] = di.get(i)) =>
    (d.get(ty).get(n).splice(p, 1), di.delete(i))
const delb = del(b, bi), addb = add(delb, bi, bp)
const dell = del(l, li), addl = add(dell, li, lp)
return { addb, addl, delb, dell, init: (cb, lc) => (init(),
    forof(lc.data, addl), forin(cb.data, (v, k) => addb([k, v]))) }
}, m = () => new Map

const editors = (m = new Map) => {
const editor = (t) => {}
const init = () => {  }
const add = (i, [id, t]) => { m.set(id, editor(t)) }
const del = (i, [id]) => { m.delete(id) }
const mov = () => {}
const swp = () => {}
return { init } }

clear(); (async () => {
const cb = codebase(), lc = livecode(), eds = editors()
const idb = store("storage"), oc = objcache()
const o = { codebase: await idb.get("codebase") ?? {},
            live: await idb.get("live") ?? [] }
const st = { set: idb.set, get: k => o[k] }

cb.init(st), lc.init(st, { add: a => { cb.add(a), oc.addb(a) }})
oc.init(cb, lc), eds.init()
})() })()