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
}

svg {
  height: 100%;
}

circle {
  r: 3px;
}

circle:hover {
  fill: red;
}` }, document.head)

$.db = idb("infidesk/newdev")
$.gt = git(db)

window.addEventListener("load", async () => {
  // 当前文件/代码库/版本
  $.save = db.saveobj("6s80s1u052ftdj009g2fd7brflbv1iq8")
  await save.init

  $.topctn = dom({ class: "container" }, document.body)
  $.sidectn = dom({ class: "container v-ctn", style: { flexBasis: "15%" } }, topctn)
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
    await ndslt.update_repo()
  }))
  $.newfilebtn = dom({ tag: "button", child: "newfile" }, sidectn)
  newfilebtn.addEventListener("click", single_input_message(async (ipt) => {
    await gt.write(save.node, ipt.value, "")
    await fllst.update_file(save.node)
  }))
  $.newrefbtn = dom({ tag: "button", child: "newref" }, sidectn)
  newrefbtn.addEventListener("click", async () => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const ns = dom({ class: "container v-ctn" }, ctn)
    create_node_selector(ns)
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
  })

  $.tempbtn = dom({ tag: "button", child: "hide editor" }, sidectn)
  tempbtn.addEventListener("click", () => {
    if (textctn.style.display === "none") {
      textctn.style.display = ""
    } else { textctn.style.display = "none" }
  })

  $.filectn = dom({ class: "container v-ctn", style: { paddingTop: 10 } }, sidectn)
  $.fllst = create_file_list(filectn)
  fllst.update_file(save.node)
  fllst.on("fileselect", ({ content, path }) => {
    save.file = path
    editor.setValue(content)
  })

  $.nodectn = dom({ class: "container v-ctn" }, sidectn)
  $.ndslt = create_node_selector(nodectn)
  ndslt.on("nodeselect", id => {
    save.node = id
    fllst.update_file(id)
  }) // TODO: fix this initialization
  await ndslt.update_repo()
  if (save.node) { ndslt.reposlt.value = save.node }
  await ndslt.update_node(save.node ?? ndslt.reposlt.value)
})

$.create_file_list = (parent) => {
  let $ = eventnode({ parent }); with ($) {
    $.update_file = async (id) => {
      let filelist = await gt.dir(id)
      filelist.forEach(v => {
        // {mode: 'file', content: '', path: 'dfadfs'}
        // {mode: 'file', content: '', path: 'dfasfd'}
        const e = dom({ tag: "button", child: v.path }, parent)
        e.onclick = () => emit("fileselect", { id, ...v })
      })
    }
  } return $
}

$.create_node_selector = (parent) => {
  let $ = eventnode({ parent }); with ($) {
    $.reposlt = dom({ tag: "select" }, parent)
    $.nodesvg = svg({}, parent)
    $.description = dom({ tag: "textarea" }, parent)
    description.style.height = "30%"

    $.update_repo = async () => {
      const a = await gt.readrepos()
      $.repoinfo_name = {}, $.repoinfo_id = {}
      a.forEach(([k, v]) => (repoinfo_name[k] = v, repoinfo_id[v] = k))
      reposlt.innerHTML = ""
      reposlt.append(...a.map(([n]) => dom({ tag: "option", child: n })))
    }
    $.update_node = async (name) => {
      const id = repoinfo_name[name]
      if (!id) { throw `repo "${name}" not exist` }
      const a = await gt.readnodes(id)
      if (a.length === 0) { throw `repo: "${name}" has no nodes` }

      position = {}
      nodesvg.innerHTML = ""

      let root = a[0], n // find root node
      while (([n] = await db.getpath(`git/node_from/${root}`), n)) { root = n[0] }

      let dict = {}, current = new Set([root]), array = [], maxs = 0
      while (current.size > 0) {
        array.push(current)
        maxs = Math.max(maxs, current.size)
        let next = new Set
        for (const id of current) {
          const a = await db.getpath(`git/node_to/${id}/`)
          dict[id] = a.map(([v]) => (next.add(v), v))
        }
        current = next
      } position.width = maxs
      position.height = array.length

      for (let y = 0, l = array.length; y < l; y++) {
        let x = 0; for (const id of array[y]) {
          position[id] = { x: ++x, y: y + 1 }
          const e = svg({ tag: "circle" }, nodesvg)
          e.onclick = () => emit("nodeselect", id)
          e.info = id
          dict[id].map(v => {
            const e = svg({ tag: "path" }, nodesvg)
            e.info = { a: id, b: v }
            return e
          })
        }
      }

      update_position()
    }
    $.update_position = () => {
      const w = nodesvg.clientWidth / (position.width + 1)
      const h = nodesvg.clientHeight / (position.height + 1)
      for (const e of nodesvg.children) {
        if (e.tagName === "circle") {
          const { x, y } = position[e.info]
          svg(e, { cx: w * x, cy: h * y })
        } else {
          let { a, b } = e.info
          a = position[a], b = position[b]
          svg(e, { d: `M ${w * a.x} ${h * a.y} L ${w * b.x} ${h * b.y}` })
        }
      }
    }
    $.position = {}
    new ResizeObserver(update_position).observe(nodesvg)
    reposlt.addEventListener("change", () => update_node(reposlt.value))
  } return $
}
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