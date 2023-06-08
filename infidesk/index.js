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

// compappend(body, fullui($))

$.git = fwith(() => {
  $.graphs = {}, $.nodes = {}, $.p$ = proto($)
  $.stack = [], $.curr = null

  $.newgraph = (name) => (graphs[name] = {}, newnode(name))
  $.newnode = (name, prev) => {
    if (prev && !nodes[prev]) { throw `previous node: "${prev}" not exist` }
    const id = uuid(), n = { to: {}, from: {}, files: {}, graph: name }
    graphs[name][id] = nodes[id] = n; if (prev) {
      n.files = deepcopy(nodes[prev].files)
      n.from[prev] = 1
      nodes[prev].to[id] = 1
    } return id
  }
  $.merge = (a, b) => { }

  $.dir = n => nodes[n].files
  $.read = (node, path) => {
    if (!nodes[node]) { throw `node: "${node}" not exist` }
    let [name, ref] = path.split("/")
    const f = nodes[node].files[name]
    if (!f) { throw `"${name}" not exist on node "${node}"` }
    if (ref) { $.curr = f.id; return read(f.id, ref) } else {
      $.stack.push(curr)
      return f.content ?? panic("path not pointing a file")
    }
  }

  $.write = (node, name, content) => { nodes[node].files[name] = { content } }
  $.writeref = (node, name, id) => { nodes[node].files[name] = { id } }
  $.remove = (node, name) => { delete nodes[node].files[name] }
  $.rename = (node, oldname, newname) => {
    nodes[node].files[newname] = nodes[node].files[oldname]
    remove(node, oldname)
  }

  $.checkwrite = n => Object.keys(nodes[n].to).length > 0
    ? panic(`node "${n}" is not writable`) : 0
  $.cwf = f => (n, ...a) => (checkwrite(n), f(n, ...a));
  [$.write, $.writeref, $.remove, $.rename] =
    [$.write, $.writeref, $.remove, $.rename].map(cwf)

  $.loadjs = (p, n = stack[stack.length - 1], e = p$) => {
    if (!n) { throw `no graph node provided for path: ${p}` }
    let f; if (stack.length === 0) { stack.push(n), f = true }
    let l = stack.length
    fwith(_, _, read(n, p))(_, _, e)
    if (l !== stack.length || f) { stack.pop() }
  }
})

$.comment = src => { body.append(dom({ innerHTML: src })) }
$.code = src => (src = src.trim(),
  setTimeout(() => fwith(...[, , src])(...[, , $])),
  body.append(dom({ tag: "pre", child: src })))

const src = await gettext("./index.dat.js")
src.split("//!").map(t => {
  const [f, ...rest] = t.split(/\r\n?/)
  $.src = rest.join("\r\n")
  fwith(_, _, f)(_, _, $)
})

log(g.dir(c))
log(g.dir(t))
// loadjs("test_file_explorer.js", t)
// loadjs("testdrawtext.js", t)