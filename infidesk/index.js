window.require.config({
  paths: {
    "vs": "node_modules/monaco-editor/min/vs",
    "vs/css": { disabled: true }
  }
})

let [, newidb] = await Promise.all([
  loadsym("./basic.js"), require("./idb.js"),
  new Promise(r => window.require(["vs/editor/editor.main"], r))
])

$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
await save.init

$.texteditor = fwith(() => {
  $.relm = dom({ class: "texteditor" })
  relm.style.height = "100%"
  $.root = relm.attachShadow({ mode: "open" })

  $.css = document.createElement('style')
  css.innerText =
    `@import "node_modules/monaco-editor/min/vs/editor/editor.main.css";`
  root.append($.div = dom({ class: "monaco-editor-div" }), css)
  div.style.height = "100%"

  $.fitta = () => editor.layout()
  new ResizeObserver(fitta).observe(div)

  $.editor = monaco.editor.create(div, {
    value: "",
    language: "plaintext",
    theme: "vs-light",
    renderWhitespace: "all",
    renderControlCharacters: true,
    tabSize: 2,
    lineNumbers: "off",
    lightbulb: { enabled: false },
    glyphMargin: false,
    overviewRulerBorder: false,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    folding: false,
    minimap: { enabled: false },
  })
})

$.filelist_css = new CSSStyleSheet()
filelist_css.replace(`
:host {
  height: 100%;
  display: flex;
  flex-direction: column;
}
`)
$.filelist = fwith(() => {
  $.relm = dom({ class: "filelist" })
  $.root = relm.attachShadow({ mode: "open" })
  root.adoptedStyleSheets = [filelist_css]

  root.append(dom({ tag: "button", child: "+" }))
})

$.fullui_css = new CSSStyleSheet()
fullui_css.replace(`
:host {
  height: 100%;
  display: flex;
  --filelist-width: 15%;
}

.filelist {
  width: var(--filelist-width);
}

.texteditor {
  width: calc(100% - var(--filelist-width));
}
`)
$.fullui = fwith(() => {
  $.relm = dom({ class: "fullui" })
  $.root = relm.attachShadow({ mode: "open" })
  root.adoptedStyleSheets = [fullui_css]

  $.fl = filelist(proto($))
  $.te = texteditor(proto($))

  compappend(root, fl, te)
})

compappend(body, fullui($))

$.git = fwith(() => {
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
  $.validate = p => "/" + p.split("/").filter(v => v).join("/")

  $.__create = async (path, { type, content, nodeid, originpath, checkpath, overwrite } = {}) => {
    const pn = await dbget(path)
    let id; switch (type) {
      case "folder":
        if (!pn) { id = uuid(), dbset(path, { path, type: "folder", id, create_time: new Date() }) }
        else { id = pn.id } break
      case "symbolink":
        id = nodeid; let op = originpath
        if (!id && !op) { throw "can't create symbolink since " }
        if (!id) { }
        if (!op) {
          await dbget("fsnode/" + id,)
        }
        dbset(path, { type: "symbolink", id })
        dbset("noderef/" + id + "/" + path, path)
        break
      case "file":
        if (pn && !overwrite) { throw `the path "${path}" is occupied` }
        if (pn && overwrite) { await _remove(path) }

        if (nodeid) {
          id = nodeid
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

    // add to parent path
    let [pp, n] = splitpath(path), pm = await dbget(pp)
    if ((pp === "" || !checkpath) && !pm) {
      dbset(pp, pm = { type: "folder", id: uuid(), create_time: new Date() })
    } if (!pm) { throw `parent path: "${pp}" not exist!` }
    if (pm.type !== "folder") {
      if (pm.type === "folder link") { /* TODO */ }
      else { throw `parent path: "${pp}" is not a folder!` }
    }
    dbset("nodechild/" + pm.id + "/" + n, { name: n, path })
  }
  $._create = async (path, args = {}, { checkpath } = args) => {
    const paths = path.split("/").filter(v => v), n = paths.pop()
    let pt = ""; if (!checkpath) for (const p of paths) {
      await __create(pt += "/" + p, { type: "folder", checkpath })
    } await __create(validate(path), args)
  }
  $._remove = async (path, { force } = {}) => {
    path = validate(path); const meta = await dbget(path)
    if (!meta) { throw `nothing found on path: "${path}"` }
    // TODO: or maybe a symbol link

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

  $.solidify = (point) => { }
  $.merge = (a, b) => { }
  $.newpoint = (prev) => { }
  $.newgraph = () => { }
  $.database = d => { $.db = d }
})

$.g = git($, { db: idb })
// g.newgraph("testproj")
// const p = g.newpoint(null)
// g.newfile(p, "test.js")