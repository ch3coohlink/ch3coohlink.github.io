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
  $.pstr = (...a) => a.join("/")
  $.fileref = id => idb.getpath(pstr("git/fileref", id)).then(a => a.length)
  $.fileexist = id => fileref(id).then(n => n <= 0)
  $.lastref = id => fileref(id).then(n => n === 1)

  $.newgraph = (name) => {
    const id = uuid()
    idb.set(pstr("git/graphs", name), name)
    idb.set(pstr("git/graphnode", name, id), id)
    idb.set(pstr("git/nodegraph", id), name)
  }
  $.newnode = async (prev) => {
    const name = idb.get(pstr("git/nodegraph", prev)), curr = uuid()
    idb.set(pstr("git/graphnode", name, curr), curr)
    idb.set(pstr("git/nodegraph", curr), name)
    idb.set(pstr("git/graphedge", prev, curr), curr)
    // copy prev node file
    const s = pstr("git/pointer", node), fs = await idb.getpath(s)
    await Promise.all(fs.forEach(([k, { type, id }]) =>
      write(curr, k.slice(s.length + 1), type, id)))
  }
  $.merge = (a, b) => { }

  $.read = async (node, name, ref) => {
    if (ref) {
      const { id } = await idb.get(pstr("git/pointer", node, ref))
      return await read(id, name)
    } else {
      const { id } = await idb.get(pstr("git/pointer", node, name))
      return await idb.get(pstr("git/file", id))
    }
  }
  $.write = async (node, name, type, content) => {
    switch (type) {
      case "raw":
        let id = hash(content)
        if (await fileexist(id)) {
          await idb.set(pstr("git/file", id), content)
        }
        idb.set(pstr("git/fileref", id, node, name), { node, name })
        idb.set(pstr("git/pointer", node, name), { type: "file", id })
        break
      case "file":
        idb.set(pstr("git/fileref", content, node, name), { node, name })
        idb.set(pstr("git/pointer", node, name), { type, id: content })
        break
      default:
        idb.set(pstr("git/pointer", node, name), { type, id: content })
        break
    }
  }
  $.rename = async (node, oldname, newname) => {
    // check file exists and type
    const { type, id } = await idb.get()
  }
  $.remove = async (node, name) => {
    // check file exists and type
    // remove reference, if it's the last ref
    // delete the file
  }
})

$.g = git($)
g.newgraph("testproj")
// const p = g.newnode(null)
// g.newfile(p, "test.js")