$.name ??= "default", $.store ??= "default"

const dbp = new Promise((res, rej, r = indexedDB.open(name)) => (
  r.onsuccess = () => res(r.result),
  r.onerror = () => rej(r.error),
  r.onupgradeneeded = () => r.result.createObjectStore(store)))
const action = (type, cb) => dbp.then(db =>
  new Promise((r, j, t = db.transaction(store, type)) => (
    t.oncomplete = () => r(),
    t.onabort = t.onerror = () => j(t.error),
    cb(t.objectStore(store)))))

const _ = null, ro = f => action("readonly", f), rw = f => action("readwrite", f)
$.key = (r = _) => ro(s => s.getAllKeys().onsuccess = e => r = e.target.result).then(() => r)
$.val = (r = _) => ro(s => s.getAll().onsuccess = e => r = e.target.result).then(() => r)
$.get = (k, p = false, r = _) => ro(s => r = s.get(k)).then(() => r.result
  ?? source[k] ?? (p ? panic(`"${k}" not found on storage`) : void 0))
$.clr = () => rw(s => s.clear())
$.set = (k, v) => rw(s => s.put(v, k))
$.del = k => rw(s => s.delete(k))
$.def = json => $.source = JSON.parse(json)

$.source = {}, $.tojson = async (...a) => {
  const ks = await key(), o = {}
  await Promise.all(ks.map(k => get(k).then(r => o[k] = r)))
  return JSON.stringify(o, ...a)
}

return { ...$ }