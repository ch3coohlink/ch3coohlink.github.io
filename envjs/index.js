const { _df_, _rq_ } = (() => { // START OF MODULE "loader" ----------------------------------------
const ms = new Map, exs = new Map, _df_ = (n, f) => ms.set(n, f)
const err = n => { throw `module "${n}" is not found!` }
const _rq_ = (n, s = new Set, r = (n, ex = o => exs.set(n, o)) => s.has(n) || exs.has(n) ? exs.get(n)
  : ms.has(n) ? (s.add(n), ms.get(n)(ex, r), s.delete(n), exs.get(n)) : err(n)) => r(n)
return { _df_, _rq_ }
})() // END OF MODULE "loader" ---------------------------------------------------------------------

_df_("store", (_ex_, _rq_) => { // START OF MODULE "store" -----------------------------------------
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
return { get, set, del, clr, key, val }
}; _ex_({ store })
}) // END OF MODULE "store" ------------------------------------------------------------------------

;(() => { // START OF MODULE "bootstrap" -----------------------------------------------------------
const { store } = _rq_("store")
const rafc = new Set, sic = new Set, stc = new Set, forof = (s, f) => { for (const i of s) f(i) }
const requestAnimationFrame = (...a) => ((id = window.requestAnimationFrame(...a)) => (rafc.add(id), id))()
const setInterval = (...a) => ((id = window.setInterval(...a)) => (sic.add(id), id))()
const setTimeout = (...a) => ((id = window.setTimeout(...a)) => (stc.add(id), id))()
const cleanAnimationFrame = () => (forof(rafc, cancelAnimationFrame), rafc.clear())
const cleanInterval = () => (forof(sic, clearInterval), sic.clear())
const cleanTimeout = () => (forof(stc, clearTimeout), stc.clear())

const bootstore = store("bootstrap")
const setloader = (nm, sc) => bootstore.set(nm, sc)
const load = (nm, sc) => {
  const parent = document.body
  parent.innerHTML = ""
  parent.style.margin = "0"
  parent.style.overflow = "hidden"

  cleanAnimationFrame()
  cleanInterval()
  cleanTimeout()
  eval("const setenv = o => setTimeout(() => tm.setenv(o))\n\n" + sc + `\n//# sourceURL=${nm}.js`) }

window.onload = async () => {
  const pm = new URLSearchParams(window.location.search)
  let nm = pm.get("boot") ?? "default"
  const df = () => fetch("./default.js").then(r => r.text())
  const sc = await bootstore.get(nm) ?? (nm = "default", await df())
  load(nm, sc) }
})() // END OF MODULE "bootstrap" ------------------------------------------------------------------