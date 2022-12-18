$.name ??= "default", $.store ??= "default"

$.dbp = new Promise((res, rej, r = indexedDB.open(name)) => (
  r.onsuccess = () => res(r.result), r.onerror = () => rej(r.error),
  r.onupgradeneeded = () => r.result.createObjectStore(store)))

$.upgrade = f => dbp.then(db => $.dbp = new Promise(
  (r, j, d = indexedDB.open(name, db.version + 1)) => (
    d.onsuccess = () => r(d.result), d.onerror = () => j(d.error),
    r.onupgradeneeded = () => f(d.result))))

$.action = (type, cb) => dbp.then(db => new Promise(
  (r, j, t = db.transaction(store, type)) => (
    t.oncomplete = () => r(), t.onabort = t.onerror = () => j(t.error), cb(t))))

$.ro = f => action("readonly", t => f(t.objectStore(store)))
$.rw = f => action("readwrite", t => f(t.objectStore(store)))

$.get = (k, r) => ro(s => r = s.get(k)).then(() => r.result)
$.set = (k, v) => rw(s => s.put(v, k))
$.del = k => rw(s => s.delete(k))
$.clr = () => rw(s => s.clear())

$.key = r => ro(s => r = s.getAllKeys()).then(() => r.result)
$.val = r => ro(s => r = s.getAll()).then(() => r.result)
$.search = (kr, r = []) => ro(s =>
  s.openCursor(kr).onsuccess = (e, c = e.target.result) =>
    !c ? 0 : (r.push([c.key, c.value]), c.continue())).then(() => r)

const fcc = String.fromCharCode
const inc = (s, l = s.length - 1) => s.substring(0, l) + fcc(s.charCodeAt(l) + 1)
$.getpath = s => search(IDBKeyRange.bound(s, inc(s), 0, 1))

const debounce = (f, t = 100, o = {}) => (k, v) => (
  clearTimeout(o[k]), o[k] = setTimeout(() => f(k, v), t))
$.saveobj = p => {
  const tset = debounce((k, v, f = key + k) => { isnth(v) ? $.del(f) : $.set(f, v) })
  const set = (_, k, v) => (tset(k, v), true)
  const get = (o, k) => issyb(k) ? o[k] : o[k] ?? $.get(key + k)
  // const remove = () => getpath(key).then(log)
  const remove = () => getpath(key).then(a => a.forEach(([k]) => $.del(k)))
  const key = `/saveobj/${p}/`; return new Proxy({ remove }, { set, get })
}
$.saveset = p => {
  const add = (k, v = "") => $.set(key + k, v), get = k => $.get(key + k)
  const all = () => getpath(key).then(a => a.map(([k, v]) => [k.slice(key.length), v]))
  const del = k => $.del(key + k), key = `/saveset/${p}/`; return { add, get, del, all }
}