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

// $.idb = newidb($, { name: "infidesk" })
// $.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
// await save.init

$.eventnode = fwith(() => {
  $._handles = {}
  $.emit = (t, o) => { (_handles[t] ?? []).forEach(f => f(o)) }
  $.on = (t, f) => { (_handles[t] ??= []).push(f) }
})
$.combine = (f, ...fs) => (...a) => fs.reduce((p, v) => v(_, _, p), f(...a))

$.texteditor = combine(fwith(() => {
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
}), eventnode)

$.nodeselector_css = new CSSStyleSheet()
nodeselector_css.replace(`
svg {
  width: 100%;
}
circle {
  r: 3px;
}
circle:hover{
  fill: red;
}
path {
  stroke-width: 1px;
  stroke: black;
}
`)
$.nodeselector = combine(fwith(() => {
  $.relm = dom({ class: "nodeselector" })
  $.root = relm.attachShadow({ mode: "open" })
  root.adoptedStyleSheets = [nodeselector_css]

  $.calxy = (w, h, x, y) => [w * (x + 1), h * (y + 1)]
  $.update = repo => {
    let prev = new Set([g.roots[repo]]), arr = [], ms = 0
    while (prev.size > 0) {
      arr.push(prev)
      let curr = new Set
      prev.forEach(n => Object.keys(g.nodes[n].to)
        .forEach(n => curr.add(n)))
      prev = curr
      ms = Math.max(ms, prev.size)
    }
    $.se = svg({}, root)
    let l = arr.length, hl = 40, wl = se.clientWidth / (ms + 1)
    se.style.height = (l + 1) * hl + "px"
    for (let i = 0; i < l; i++) {
      const e = [...arr[i]], s = e.length
      const ne = [...arr[i + 1] ?? []]
      for (let j = 0; j < s; j++) {
        const k = e[j], [x, y] = calxy(wl, hl, j, i)
        svg({ tag: "circle", cx: x, cy: y }, se)
        Object.keys(g.nodes[k].to).forEach(
          t => {
            let [tx, ty] = calxy(wl, hl, ne.indexOf(t), i + 1)
            let d = `M ${x} ${y} L ${tx} ${ty}`
            svg({ tag: "path", d }, se)
          }
        )
      }
    }
  }
}), eventnode)

$.filelist_css = new CSSStyleSheet()
filelist_css.replace(`
:host {
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
}
.vertical-list {
  display: flex;
  flex-direction: column;
}
`)
$.filelist = combine(fwith(() => {
  $.relm = dom({ class: "filelist" })
  $.root = relm.attachShadow({ mode: "open" })
  root.adoptedStyleSheets = [filelist_css]

  $.ns = nodeselector(proto($))

  root.append(
    dom({ tag: "input" }),
    dom({
      tag: "button", child: "new", onclick: () => {

      }
    }),
    dom({
      tag: "button", child: "rename", onclick: () => {

      }
    }),
    dom({
      tag: "button", child: "delete", onclick: () => {

      }
    }),
    dom({ child: "-----", style: { textAlign: "center" } }),
    $.lista = dom({ class: "vertical-list" }),
    dom({ child: "-----", style: { textAlign: "center" } }),
    $.listb = dom({ class: "vertical-list" }),
    dom({ child: "-----", style: { textAlign: "center" } }),
    dom({
      tag: "button", child: "newref", onclick: () => newref().then(() => {

      })
    }),
    ns.relm
  )
  $.update = n => {
    const o = g.dir(n)
    lista.innerHTML = "", listb.innerHTML = ""
    Object.keys(o).forEach(k => {
      const isref = !!o[k].id
      const list = !isref ? lista : listb
      list.append(dom({
        tag: "button", child: k, onclick: () => emit(
          isref ? "openref" : "openfile", { node: n, path: k })
      }))
    })
  }
}), eventnode)

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

  $.curr = null
  fl.on("openfile", o => {
    const { node, path } = o
    const e = fui.te.editor, me = monaco.editor
    const [ext] = path.split(".").slice(-1)
    $.curr = o, e.setValue(g.read(node, path))
    if (ext === "js") { me.setModelLanguage(e.getModel(), "javascript") }
  })
})

$.git = combine(fwith(() => {
  $.roots = {}, $.graphs = {}, $.nodes = {}, $.p$ = proto($), $.stack = []

  $.newgraph = name => (graphs[name] = {}, roots[name] = newnode(name))
  $.newnode = prev => {
    let name, id = uuid(); if (!nodes[prev]) {
      if (graphs[prev]) { name = prev, prev = null }
      else throw `previous node: "${prev}" not exist`
    } else { name = nodes[prev].graph }
    const n = { to: {}, from: {}, files: {}, graph: name, time: new Date }
    graphs[name][id] = nodes[id] = n; if (prev) {
      n.files = deepcopy(nodes[prev].files)
      n.from[prev] = nodes[prev].to[id] = 1
    } return id
  }
  $.merge = (a, b) => { /* TODO */
    if (!nodes[b]) { throw `previous node: "${b}" not exist` }
    const n = newnode(a); nodes[n].from[b] = nodes[b].to[n] = 1; return n
  }

  $.dir = n => nodes[n].files
  $.read = (node, path) => {
    if (!nodes[node]) { throw `node: "${node}" not exist` }
    let [name, ref] = path.split("/")
    const f = nodes[node].files[name]
    if (!f) { throw `"${name}" not exist on node "${node}"` }
    if (ref) { return read(f.id, ref) } else {
      $.stack.push(node); return f.content
        ?? panic("path not pointing a file")
    }
  }

  $.write = (node, name, c, mode) => {
    if (nodes[node].files[name]) { throw `path "${name}" has been occupied` }
    nodes[node].files[name] = mode === "ref" ? { id: c } : { content: c }
  }
  $.remove = (node, name) => { delete nodes[node].files[name] }
  $.rename = (node, oldname, newname) => {
    nodes[node].files[newname] = nodes[node].files[oldname]
    remove(node, oldname)
  }

  $.checkwrite = n => Object.keys(nodes[n].to).length > 0
    ? panic(`node "${n}" is not writable`) : 0
  $.cwf = f => (n, ...a) => (checkwrite(n), f(n, ...a), emit("filewrite"));
  [$.write, $.remove, $.rename] = [$.write, $.remove, $.rename].map(cwf)

  $.loadjs = (p, n, e = p$) => {
    if (n) { $.stack = [] } else { [n] = stack.slice(-1) }
    fwith(_, _, read(n, p))(_, _, e), stack.pop()
  }
}), eventnode)

// loadjs("test_file_explorer.js", t)
// loadjs("testdrawtext.js", t)

$.g = git($)
$.loadjs = g.loadjs
$.c = g.newgraph("codebase")
$.t = g.newgraph("testbase")

const src = await gettext("./index.dat.js")
src.split("//!").map(t => {
  const [f, ...rest] = t.split(/\r\n?/)
  $.src = rest.join("\r\n")
  fwith(_, _, f)(_, _, $)
})

loadjs("generate_repo.js", t)

$.fui = fullui($)
compappend(body, fui)
fui.fl.update(t)
fui.fl.ns.update("fuzzy_generate_repo")