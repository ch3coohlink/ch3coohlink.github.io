require.config({ paths: { vs: '../node_modules/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => { })

dom({
  tag: "style", child: `
html, body {
  overflow: hidden;
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  height: 100%;
  width: 100%;
}

.v-ctn {
  flex-direction: column;
}

.window {
  background: white;
  border-radius: 5px;
  overflow: hidden;
  paddding: 5px;
}

textarea {
  resize: none;
}` }, document.head)

$.db = idb("infidesk/newdev")
$.gt = git(db)

window.addEventListener("load", () => {
  // 当前文件/代码库/版本
  $.save = db.saveobj("6s80s1u052ftdj009g2fd7brflbv1iq8")

  $.topctn = dom({ class: "container" }, document.body)
  $.sidectn = dom({ class: "container v-ctn", style: { flexBasis: "25%" } }, topctn)
  $.mainctn = dom({ class: "container v-ctn", style: { width: "100%" } }, topctn)
  $.textctn = dom({ class: "container" }, mainctn)
  $.evalctn = dom({ style: { position: "absolute" } }, mainctn)
  $.editor = create_editor(textctn)

  $.messagectn = dom({
    class: "container",
    style: {
      position: "fixed",
      background: "#00000040",
      top: "0",
      left: "0",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
    },
    onclick: e => { if (e.target === messagectn) { closemessage() } }
  }, document.body)
  $.openmessage = () => {
    messagectn.style.display = ""
    messagectn.innerHTML = ""
  }
  $.closemessage = () => { messagectn.style.display = "none" }

  // 单个input流程
  $.single_input_message = f => async () => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const ipt = dom({ tag: "input" }, ctn)
    const btn = dom({ tag: "button", child: "Enter" }, ctn)
    btn.addEventListener("click", async () => {
      try {
        await f(ipt)
        closemessage()
      } catch (e) {
        openmessage()
        messagectn.append(dom({ child: e }))
      }
    })
  }

  $.newrepobtn = dom({ tag: "button", child: "newrepo" }, sidectn)
  newrepobtn.addEventListener("click", single_input_message(async (ipt) => {
    if (!ipt.value) { throw `invalid repo name: "${ipt.value}"` }
    await gt.newrepo(ipt.value)
    // TODO: update repo graph
  }))
  $.newfilebtn = dom({ tag: "button", child: "newfile" }, sidectn)
  newfilebtn.addEventListener("click", single_input_message(async () => {
    await gt.write(current.node, ipt.value, "")
    // TODO: update file list
  }))
  $.newrefbtn = dom({ tag: "button", child: "newref" }, sidectn)
  newrefbtn.addEventListener("click", async () => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const ipt = dom({ tag: "input" }, ctn)
    // const svg = svg({}, ctn) // TODO: draw version
    const btn = dom({ tag: "button", child: "Enter" }, ctn)
    btn.addEventListener("click", async () => {
      try {
        await f(ipt)
        closemessage()
      } catch (e) {
        openmessage()
        messagectn.append(dom({ child: e }))
      }
    })
  })

  $.tempbtn = dom({ tag: "button", child: "hide editor" }, sidectn)
  tempbtn.addEventListener("click", () => {
    if (textctn.style.display === "none") {
      textctn.style.display = ""
    } else { textctn.style.display = "none" }
  })

  $.filectn = dom({ class: "container v-ctn" }, sidectn)
  $.nodectn = dom({ class: "container v-ctn" }, sidectn)

  create_node_selector(nodectn)
})

$.create_node_selector = async (parent) => {
  let reposlt = dom({ tag: "select" }, parent)
  let nodesvg = svg({}, parent)
  let description = dom({ tag: "textarea" }, parent)

  let update_repo = async () => {
    const a = await gt.readrepos()
    reposlt.innerHTML = ""
    reposlt.append(...a.map(([n]) => dom({ tag: "option", child: n })))
  }
  let update_node = async (name) => {
    if (!name) { return }
    const a = await gt.readnodes(name)
    if (a.length === 0) { throw `repo: "${name}" has no nodes` }
    // find root node
    log(a)
    let c = a[0], n
    while ([[n]] = await db.getpath(`git/node_from/${c}`)) { c = n }
    // c is root
    log(c)
    nodesvg.innerHTML = ""
    let dict = {}, current = new Set([c]), array = [], maxs = 0
    while (current.size > 0) {
      array.push(current)
      maxs = Math.max(maxs, current.size)
      let next = new Set
      for (const id of current) {
        const a = await db.getpath(`git/node_to/${id}/`)
        dict[id] = a.map(([v]) => (next.add(v), v))
      }
      current = next
    }
    log(array)
  }
  update_repo().then(() => update_node(reposlt.value))
}

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


$.create_editor = (parent) => {
  let editor = monaco.editor.create(parent, {
    value: "",
    language: "javascript",
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

  new ResizeObserver(() => editor.layout()).observe(parent)

  editor.addAction({
    id: "save-text-file",
    label: "save file",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: ed => log(ed.getValue()),
  })

  return editor
}