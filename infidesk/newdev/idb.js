$.idb = (name = "default", store = "default") => {
  let $ = { name, store }

  with ($) {
    $.dbp = new Promise((r, j, d = indexedDB.open(name)) => (
      d.onsuccess = () => r(d.result),
      d.onerror = () => j(d.error),
      d.onupgradeneeded = () => d.result.createObjectStore(store)))

    $.deletedatabase = () => dbp.then(db => (db.close(),
      new Promise((r, j, d = indexedDB.deleteDatabase(name)) =>
        (d.onerror = j, d.onsuccess = r))))

    $.upgrade = f => dbp.then(db => (db.close(), $.dbp = new Promise(
      (r, j, d = indexedDB.open(name, db.version + 1)) => (
        d.onsuccess = () => r(d.result),
        d.onerror = () => j(d.error),
        d.onupgradeneeded = () => f(d.result)))))

    $.action = (type, cb, s = store) => dbp.then(db => new Promise(
      (r, j, t = db.transaction(s ?? db.objectStoreNames, type)) => (
        t.oncomplete = () => r(),
        t.onabort = t.onerror = () => j(t.error),
        cb(t))))

    $.request = rq => new Promise((r, j) => (
      rq.onsuccess = r(rq.result), rq.onerror = j))

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
    $.path = s => IDBKeyRange.bound(s, inc(s), 0, 1)
    $.getpath = s => search(path(s))

    const debounce = (f, t = 100, o = {}) => (k, v) => (
      clearTimeout(o[k]), o[k] = setTimeout(() => f(k, v), t))
    const { set: rset, deleteProperty: rdel } = Reflect
    $.saveobj = id => {
      const dset = debounce((k, v) => set(key + k, v))
      const pset = (o, k, v) => (dset(k, v), rset(o, k, v))
      const pdel = (o, k) => (del(key + k), rdel(o, k))
      const remove = () => del(path(key)), key = `/saveobj/${id}/`, kl = key.length
      const init = getpath(key).then(a => a.forEach(([k, v]) => o[k.slice(kl)] = v))
      const o = eventtarget({ init, remove, id })
      return new Proxy(Object.create(o), { set: pset, deleteProperty: pdel })
    }
  }

  return $
}

// test
const main = async () => {
  const db = idb("test_db")

  db.dbp // valid

  await Promise.all([
    db.set("somekey", 1), // 将somekey设置为1
    db.set("somekey1", 1),// 将somekey1设置为1
    db.set("somekey2", 1), // 将somekey2设置为1
  ])

  // 等设置完之后
  log(db.get("somekey")) // 读取somekey
  // [object Promise]
  log(await db.get("somekey")) // 读取somekey
  // 1

  // 
  db.set("a/b/c", 1)
  db.set("a/b/d", 2)
  db.set("a/b/somepath", 3)

  await db.getpath("a/b")
  [["a/b/c", 1], ["a/b/d", 2], ["a/b/somepath", 3]]

  // 单层saveobj
  let so = db.saveobj("fdksajkfi2gii3ivj43o09df")
  let so2 = db.saveobj("fdksajkfi2gii3ivj43o09df")
  so.a = 1
  db.set("fdksajkfi2gii3ivj43o09df/a", 1)
  so.a // 1
  so2.a === so.a

  // 多层saveobj（未实现）
  so.b = {}
  db.set("fdksajkfi2gii3ivj43o09df/b", {})
  so.b.a = 1
  db.set("fdksajkfi2gii3ivj43o09df/b/a", 1)
}