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

  editor.addAction({
    id: "save-text-file",
    label: "save file",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: ed => log(ed.getValue()),
  });

}), eventnode)

$.nodeselector_css = new CSSStyleSheet()
nodeselector_css.replace(`
svg, select {
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

  $.selrep = dom({ tag: "select", oninput: () => update(selrep.value) }, root)
  $.update_repo = () => {
    selrep.innerHTML = ""
    selrep.append(...Object.keys(g.graphs)
      .map(k => dom({ tag: "option", child: k })))
  }

  $.se = svg({}, root)
  $.calx = (w, x) => 100 / (w + 1) * (x + 1)
  $.calxy = (w, h, x, y) => [calx(w, x), calx(h, y)]
  $.update = repo => {
    $.cirs = [], $.pats = [], se.innerHTML = ""
    let prev = new Set([g.roots[repo]]), arr = [], ms = 0
    while (prev.size > 0) {
      arr.push(prev)
      ms = Math.max(ms, prev.size)
      let curr = new Set
      prev.forEach(n => Object.keys(g.nodes[n].to)
        .forEach(n => curr.add(n)))
      prev = curr
    }

    let l = arr.length, hl = 40
    se.style.height = (l + 1) * hl + "px"
    for (let i = 0; i < l; i++) {
      const e = [...arr[i]], s = e.length
      const ne = [...arr[i + 1] ?? []]
      for (let j = 0; j < s; j++) {
        const k = e[j], [x, y] = calxy(ms, l, j, i)
        let se = svg({ tag: "circle" })
        se.onclick = () => log(k)
        se.data = { x, y, node: k }
        cirs.push(se)
        Object.keys(g.nodes[k].to).forEach(t => {
          let [bx, by] = calxy(ms, l, ne.indexOf(t), i + 1)
          let se = svg({ tag: "path" })
          se.data = { ax: x, ay: y, bx, by }
          pats.push(se)
        })
      }
    }
    se.append(...pats, ...cirs)
    update_svgpos()
  }
  $.cirs = [], $.pats = []
  $.update_svgpos = () => {
    const w = se.clientWidth * 0.01, h = se.clientHeight * 0.01
    for (const p of pats) {
      const { ax, ay, bx, by } = p.data
      svg(p, { d: `M ${w * ax} ${h * ay} L ${w * bx} ${h * by}` })
    }
    for (const c of cirs) {
      const { x, y } = c.data
      svg(c, { cx: w * x, cy: h * y })
    }
  }
  new ResizeObserver(update_svgpos).observe(relm)
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
    dom({
      tag: "button", child: "new", onclick: () => {
        // create a temp file naming dialog
      }
    }),
    dom({
      tag: "button", child: "newref", onclick: () => newref().then(() => {

      })
    }),
    dom({ child: "-----", style: { textAlign: "center" } }),
    $.lista = dom({ class: "vertical-list" }),
    dom({ child: "-----", style: { textAlign: "center" } }),
    $.tempfiledom = dom(),
    $.listb = dom({ class: "vertical-list" }),
    dom({ child: "-----", style: { textAlign: "center" } }),
    ns.relm
  )
  $.update = n => {
    const o = g.dir(n)
    lista.innerHTML = "", listb.innerHTML = ""
    Object.keys(o).forEach(k => {
      const isref = !!o[k].id
      const list = isref ? lista : listb
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

  // 创建新的代码库
  $.newrepo = async name => {
    idb.set(`graphs/${name}`, {})
    const root = await newver(name)
    idb.set(`roots/${name}`, root)
    idb.set(`current/${name}`, root)
  }
  // 创建新的版本
  $.newver = async () => {
    let name, id = uuid()
    if (!nodes[prev]) {
      if (graphs[prev]) { name = prev, prev = null }
      else throw `previous node: "${prev}" not exist`
    } else { name = nodes[prev].graph }
    const n = { to: {}, from: {}, files: {}, graph: name, time: new Date }
    graphs[name][id] = nodes[id] = n; if (prev) {
      n.files = deepcopy(nodes[prev].files)
      n.from[prev] = nodes[prev].to[id] = 1
    } return id
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

$.g = git($)
$.loadjs = g.loadjs

$.fui = fullui($)
compappend(body, fui)