$.queue = [], $.tempobj = {}
$.dbget = async (k) => k in tempobj ? tempobj[k] : await db.get(k)
$.dbset = (k, v) => (tempobj[k] = v, queue.push(["put", k, v]))
$.dbdel = (k) => (tempobj[k] = undefined, queue.push(["delete", v]))
$.abort = () => { $.queue = [], $.tempobj = {} }
$.flush = () => db.rw(s => { for (const [o, ...a] of queue) { s[o](...a) } })
$.transaction = f => async (...a) => {
  try { await f(...a), await flush() } finally { abort() }
}

$.splitpath = (p, si = path.lastIndexOf("/")) => [p.slice(0, si), p.slice(si + 1)]
$.validpath = p => "/" + p.split("/").filter(v => v).join("/")
$.realpath = async p => p
$.getpath = async p => {

}

$.__create = async (path, { type, content, nodeid: id, originpath: op, overwrite } = {}) => {
  const pn = await dbget(path); switch (type) {
    case "folder":
      if (!pn) { id = uuid(), dbset(path, { path, type: "folder", id, create_time: new Date() }) }
      else if (pn.type !== "folder") {
        throw `node type "${pn.type}" conflict with creation type "folder" on path "${path}"`
      } else { id = pn.id } break
    case "symbolink":
      if (!id && !op) { throw "can't create symbolink since no data provided" }
      if (!id) { /* TODO */ }
      if (!op) { /* TODO */ }
      dbset(path, { type: "symbolink", id })
      dbset("symbolink/" + id, op)
      break
    case "file":
      if (pn) {
        if (overwrite) {
          if (pn.type !== "file") {
            throw `node type "${pn.type}" conflict with creation type "file" on path "${path}"`
          } await _remove(path)
        } else { throw `the path "${path}" is occupied` }
      }

      if (id) {
        dbset(path, { type: "file", id })
        dbset("noderef/" + id + "/" + path, path)
      } else {
        id = uuid()
        dbset(path, { type: "file", id })
        dbset("fsnode/" + id, content)
        dbset("metadata/" + id, { create_time: new Date() })
        dbset("noderef/" + id + "/" + path, path)
      } break
    default: throw `unknown type "${type}" on filesystem`
  }
}
$._create = async (path, args = {}, { allowemptypath } = args) => {
  path = validpath(path)
  let [pp, n] = splitpath(path), pm = await getpath(pp)
  if (!pm) {
    if (!allowemptypath) { throw `parent path: "${pp}" not exist!` }
    // TODO: create all empty folder
  }
  if (pm.type !== "folder") {
    if (pm.type === "folder link") { /* TODO */ }
    else { throw `parent path: "${pp}" is not a folder!` }
  } dbset("nodechild/" + pm.id + "/" + n, { name: n, path })
  await __create(path, args) // TODO: use a real path
}
$._remove = async (path, { force } = {}) => {
  path = validpath(path); const meta = await getpath(path)
  if (!meta) { throw `nothing found on path: "${path}"` }

  const { id, type } = meta; switch (type) {
    case "file":
      const refs = await db.getpath("noderef/" + id + "/")
      dbdel("noderef/" + id + "/" + path)
      if (refs.length === 1) {
        dbdel("noderef/" + id + "/" + path)

      }
      break
    case "folder":
      // check folder empty?
      if (!force) { throw `unable to delete folder on path: "${path}"` }
      break
    case "symbolink":
      break
    default: throw `unknown type "${type}" on filesystem`
  }

  dbdel("nodechild")
}
$._move = async (from, to) => {
  // here, this process should be done in one transaction
  // but I wrote it as is anyway
  await read()
  await _create()
  await _remove()
}
$.read = (path) => { }
$.write = (path) => { }
$.dir = (path) => { }