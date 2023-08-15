$.idb = (name = "default", store = "default") => {
  let $ = { name, store }; with ($) {
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
    $.getpath = s => search(path(s = s[s.length - 1] === "/" ? s : s + "/"))
      .then(a => (a ?? []).map(v => (v[0] = v[0].slice(s.length), v)))

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
  } return $
}

// test
const main = async () => {
  const db = idb("test_db")

  log(db)
  await db.set("key1", 12)
  log(await db.get("key1"))
  await db.del("key1")

  await Promise.all([
    db.set("key2/a", 1),
    db.set("key2/b", 2),
    db.set("key2/c", 3),
    db.set("key2/d", 4),
    db.set("key2/e", 5),
  ])
  log(await db.getpath("key2"))

  const ob = db.saveobj("id1")
  ob.a = 1
  log(ob.a)

  // const wo = db.waitobj("id2")
  // wo.a = 1 // 1
  // await (wo.a = 1) // Promise
  // log(wo.a) // Promise = [1]
  // log(await wo.a) // 1
  // log(wo)
  const wo = db.waitobj("id2")
  await wo.set("a", 1) // await (wo.a = 1)
  log(wo.get("a")) //
  log(await wo.get("a")) // await wo.a
  await wo.set("b", { a: 1 })
  await wo.b.get("")
}
