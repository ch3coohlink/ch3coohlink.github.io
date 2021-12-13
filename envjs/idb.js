setdef($, "name", "default")
setdef($, "store", "default")

$.dbp = new Promise((res, rej, r = indexedDB.open(name)) => (
  r.onsuccess = () => res(r.result),
  r.onerror = () => rej(r.error),
  r.onupgradeneeded = () => r.result.createObjectStore(store)))
$.action = (type, cb) => dbp.then(db =>
  new Promise((r, j, t = db.transaction(store, type)) => (
    t.oncomplete = () => r(),
    t.onabort = t.onerror = () => j(t.error),
    cb(t.objectStore(store)))))

const _ = null, ro = f => action("readonly", f), rw = f => action("readwrite", f)
$.key = (r = _) => ro(s => s.getAllKeys().onsuccess = e => r = e.target.result).then(() => r)
$.val = (r = _) => ro(s => s.getAll().onsuccess = e => r = e.target.result).then(() => r)
$.get = (k, r = _) => ro(s => r = s.get(k)).then(() => r.result)
$.clr = () => rw(s => s.clear())
$.set = (k, v) => rw(s => s.put(v, k))
$.del = k => rw(s => s.delete(k))

const rt = { ...$ }; delete rt.dbp, delete rt.action; return rt