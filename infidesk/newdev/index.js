require.config({
  paths: {
    vs: "../node_modules/monaco-editor/min/vs",
    "vs/css": { disabled: true }
  }
});
require(["vs/editor/editor.main"], () => { })

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
  padding: 5px;
}

.message-background {
  position: fixed;
  background: #00000040;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
}

.context-menu {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100px;
  background: white;
  box-shadow: 0px 7px 10px #b8b8b8;
}

.context-menu > button {
  height: 3em;
  background: #f7f5e8;
}

button {
  border: 0px;
  margin-bottom: 1px;
}

button.repo-reference {
  background: #f7e8f7;
}

textarea {
  resize: none;
}

svg {
  height: 100%;
}

circle {
  r: 5px;
}

circle:hover {
  fill: red;
}

path {
  stroke-width: 1px;
  stroke: black;
}` }, document.head)

$.db = idb("infidesk/newdev")
$.gt = git(db)

// TODO: delete rename repo
// TODO: delete node(?) / move node(?)
// TODO: node description
// TODO: execution

window.addEventListener("load", async () => {
  // 当前文件/代码库/版本
  $.save = db.saveobj("6s80s1u052ftdj009g2fd7brflbv1iq8")
  await save.init

  // 单个input流程
  $.single_input_message = f => async () => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const ipt = dom({ tag: "input" }, ctn)
    const btn = dom({ tag: "button", child: "Enter" }, ctn)
    const apply = async () => {
      try {
        await f(ipt)
        closemessage()
      } catch (e) {
        openmessage()
        messagectn.append(dom({ child: e }))
      }
    }
    ipt.addEventListener("change", apply)
    btn.addEventListener("click", apply)
  }
  // 新建一个repo，当没有处于一个版本的时候，切换到这个新repo的根节点
  $.new_repo = async (name) => {
    if (!name) { throw `invalid repo name: "${name}"` }
    await gt.newrepo(name)
    await ndslt.update_repo()
    await ndslt.update_node()
    save.node ??= (await gt.readnodes(await gt.getrepoid(name)))[0]
  }
  $.change_node = async (node) => {
    await checkfilesave()
    save.node = node
    await fllst.update_file(node)
    if (get_current_path()) {
      await openfile({ path: get_current_path() })
    } else {
      editor.close()
    }
  }
  $.new_file = async v => {
    await gt.write(save.node, v, "")
    await fllst.update_file(save.node)
    fllst.highlight(get_current_path())
  }
  $.openfile = async ({ path }) => {
    editor.open()
    try {
      set_current_path(path)
      const v = await gt.read(save.node, path)
      const ext = path.match(/\.([^\.]+)$/)?.[1] ?? ""
      editor.editor.setValue("")
      editor.change_language(language_setting[ext] ?? "plaintext")
      editor.editor.setValue(v)
      $.current_file_changed = false
      fllst.highlight(path)
    } catch (e) {
      console.error(e)
      editor.close()
    }
  }
  $.get_current_path = () => save[save.node + "/file"]
  $.set_current_path = v => save[save.node + "/file"] = v
  $.new_node_dialog = () => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const warning = "This action will lock current version," +
      " and you will no longer being able to edit it, proceed?"
    dom({ child: warning }, ctn)
    const btn = dom({ tag: "button", child: "Yes" }, ctn)
    btn.onclick = async () => {
      try {
        const newnode = await gt.newnode(save.node)
        await change_node(newnode)
        await ndslt.update_repo()
        await ndslt.change_repo_by_node(save.node)
      } finally {
        closemessage()
      }
    }
  }
  $.rename_ref_dialog = (new_ref = true) => async (v = {}) => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const ns = dom({ class: "container v-ctn" }, ctn)
    const ndslt = create_node_selector(ns)
    await ndslt.update_repo()
    await ndslt.update_node()
    const ipt = dom({ tag: "input" }, ctn)
    const btn = dom({ tag: "button", child: "Enter" }, ctn)
    if (v.content && v.path) {
      ipt.value = v.path
      await ndslt.change_repo_by_node(v.content)
    }
    const f = async () => {
      try {
        const n = ipt.value
        const i = ndslt.current_node
        if (n && i) {
          if (new_ref) { await gt.write(save.node, n, i, "ref") }
          else { await gt.rename(save.node, path, n) }
        }
        else { throw `new ref failed because of invalid argument` }
        await fllst.update_file(save.node)
        fllst.highlight(get_current_path())
        closemessage()
      } catch (e) {
        openmessage()
        messagectn.append(dom({ child: e }))
        throw e
      }
    }
    ipt.addEventListener("change", f)
    btn.addEventListener("click", f)
  }
  $.checkfilesave = async () => {
    // 有没有正在编辑的文件？如果有那么弹出对话框询问用户是否保存
    if (current_file_changed) {
      await new Promise(acc => {
        openmessage()
        const ctn = dom({ class: "window" }, messagectn)
        dom({ child: "File has been changed, do you want to save it?" }, ctn)
        const btnyes = dom({ tag: "button", child: "Yes" }, ctn)
        const btnno = dom({ tag: "button", child: "No" }, ctn)
        btnyes.onclick = async () => {
          await savefile(editor.editor.getValue())
          acc(), closemessage()
        }
        btnno.onclick = () => { closemessage() }
      })
    }
  }

  $.topctn = dom({ class: "container", style: { userSelect: "none" } }, document.body)
  $.sidectn = dom({ class: "container v-ctn", style: { flexBasis: "15%" } }, topctn)
  $.mainctn = dom({ class: "container v-ctn", style: { width: "100%" } }, topctn)
  $.textctn = dom({ class: "container" }, mainctn)
  $.evalctn = dom({ style: { position: "absolute" } }, mainctn)
  $.editor = create_editor(textctn)
  editor.close()

  $.opencontextmenu = (x, y) => {
    contextmenuctn.style.left = x - 10 + "px"
    contextmenuctn.style.top = y - 10 + "px"
    contextmenuctn.style.display = ""
    contextmenuctn.innerHTML = ""
  }
  $.closecontextmenu = () => { contextmenuctn.style.display = "none" }
  $.contextmenuctn = dom({
    class: "context-menu", style: { display: "none" },
    onpointerleave: closecontextmenu
  }, document.body)

  $.messagectn = dom({
    class: "container message-background", style: { display: "none" },
    onclick: e => { if (e.target === messagectn) { closemessage() } }
  }, document.body)
  $.openmessage = () => {
    messagectn.style.display = ""
    messagectn.innerHTML = ""
  }
  $.closemessage = () => { messagectn.style.display = "none" }

  $.newrepobtn = dom({ tag: "button", child: "newrepo" }, sidectn)
  newrepobtn.addEventListener("click",
    single_input_message(ipt => new_repo(ipt.value)))
  $.newnodebtn = dom({ tag: "button", child: "newnode" }, sidectn)
  newnodebtn.addEventListener("click", new_node_dialog)

  $.newfilebtn = dom({ tag: "button", child: "newfile" }, sidectn)
  newfilebtn.addEventListener("click",
    single_input_message(ipt => new_file(ipt.value)))
  $.newrefbtn = dom({ tag: "button", child: "newref" }, sidectn)
  newrefbtn.addEventListener("click", rename_ref_dialog())

  $.current_file_changed = false
  editor.on("change", () => current_file_changed = true)
  $.savefile = v => gt.write(save.node,
    get_current_path(), v, "file", true)
    .then(() => $.current_file_changed = false)
  $.language_setting = { js: "javascript" }

  $.filectn = dom({ class: "container v-ctn" }, sidectn)
  filectn.style.paddingTop = "10px"
  $.fllst = create_file_list(filectn)
  fllst.update_file(save.node)
  fllst.on("fileselect", async v => {
    await checkfilesave()
    await openfile(v)
  })
  const _rrdf = rename_ref_dialog(false)
  fllst.on("refselect", _rrdf)
  editor.on("filesave", savefile)
  $.rename_file_dialog = v => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const ipt = dom({ tag: "input", value: v.path }, ctn)
    const btn = dom({ tag: "button", child: "Enter" }, ctn)
    const apply = async () => {
      try {
        const oldname = v.path, newname = ipt.value
        await gt.rename(save.node, oldname, newname)
        await fllst.update_file(save.node)
        await openfile({ path: newname })
        closemessage()
      } catch (e) {
        openmessage()
        messagectn.append(dom({ child: e }))
      }
    }
    ipt.addEventListener("change", apply)
    btn.addEventListener("click", apply)
  }
  fllst.on("filerename", v => {
    if (v.mode === "ref") { _rrdf(v) }
    else { rename_file_dialog(v) }
  })
  fllst.on("filedelete", async v => {
    await gt.remove(save.node, v.path)
    await fllst.update_file(save.node)
    if (get_current_path() === v.path) {
      editor.close()
    }
  })

  $.nodectn = dom({ class: "container v-ctn" }, sidectn)
  $.ndslt = create_node_selector(nodectn)
  ndslt.on("nodeselect", change_node)

  $.description = dom({ tag: "textarea" }, nodectn)
  description.style.height = "30%"

  // 初始化
  await ndslt.update_repo()
  if (save.node) { await ndslt.change_repo_by_node(save.node) }
  if (get_current_path()) { await openfile({ path: get_current_path() }) }
})

$.create_file_list = (parent) => {
  let $ = eventnode({ parent }); with ($) {
    $.update_file = async (id) => {
      parent.innerHTML = ""
      $.filedict = {}
      $.filelist = await gt.dir(id)
      filelist.forEach(v => {
        const e = dom({ tag: "button", child: v.path }, parent)
        const rf = v.mode === "ref"
        if (rf) { e.className = "repo-reference" }
        e.onclick = () => emit(rf ? "refselect" : "fileselect", v)
        e.oncontextmenu = e => {
          opencontextmenu(e.pageX, e.pageY)
          const rb = dom({ tag: "button", child: "rename" }, contextmenuctn)
          const db = dom({ tag: "button", child: "delete" }, contextmenuctn)
          rb.onclick = () => (closecontextmenu(), emit("filerename", v))
          db.onclick = () => (closecontextmenu(), emit("filedelete", v))
          e.preventDefault()
        }
        filedict[v.path] = e
      })
    }
    $.highlight = (path) => {
      for (const k in filedict) { filedict[k].style.color = "" }
      if (filedict[path]) { filedict[path].style.color = "red" }
    }
  } return $
}
$.create_node_selector = (parent) => {
  let $ = eventnode({ parent }); with ($) {
    $.reposlt = dom({ tag: "select" }, parent)
    $.nodesvg = svg({}, parent)

    $.change_repo_by_node = async (node) => {
      try {
        $.current_node = node
        reposlt.value = await gt.getnoderepo(node)
        await update_node()
      } catch (e) {
        throw `change repo by id failed using id "${node}" with error:\n` + e
      }
    }
    $.update_repo = async () => {
      const a = await gt.readrepos()
      $.repoinfo_name = {}, $.repoinfo_id = {}
      a.forEach(([k, v]) => (repoinfo_name[k] = v, repoinfo_id[v] = k))
      reposlt.innerHTML = ""
      reposlt.append(...a.map(([n]) => dom({ tag: "option", child: n })))
    }
    $.current_node = null
    $.highlight = (id) => {
      if (current_node) {
        const e = position[current_node]?.e
        if (e) { e.style.fill = "" }
      }
      $.current_node = id
      const e = position[id]?.e
      if (e) { e.style.fill = "red" }
    }
    $.update_node = async (name = reposlt.value) => {
      const a = await gt.readnodes(await gt.getrepoid(name))

      $.position = {}
      nodesvg.innerHTML = ""

      let root = a[0], n // find root node
      while (([n] = await db.getpath(`git/node_from/${root}`), n)) { root = n[0] }

      let nodeto = {}, current = new Set([root]), array = [], maxs = 0
      while (current.size > 0) {
        array.push(current)
        maxs = Math.max(maxs, current.size)
        let next = new Set
        for (const id of current) {
          const a = await db.getpath(`git/node_to/${id}/`)
          nodeto[id] = a.map(([v]) => (next.add(v), v))
        }
        current = next
      } position.width = maxs
      position.height = array.length

      const paths = [], circles = []
      for (let y = 0, l = array.length; y < l; y++) {
        let x = 0; for (const id of array[y]) {
          const e = svg({ tag: "circle" })
          e.addEventListener("pointerenter", () => e.innerHTML =
            `<title>id: ${id}</title>`)
          e.addEventListener("pointerleave", () => e.innerHTML = "")

          position[id] = { x: ++x, y: y + 1, e }
          circles.push(e)
          e.onclick = () => {
            emit("nodeselect", id)
            highlight(id)
          }
          e.info = id
          nodeto[id].map(v => {
            const e = svg({ tag: "path" })
            paths.push(e)
            e.info = { a: id, b: v }
            return e
          })
        }
      }
      nodesvg.append(...paths, ...circles)

      update_position()
      highlight(current_node)
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
    reposlt.addEventListener("change", async () => {
      const v = reposlt.value
      await update_node(v)
    })
  } return $
}
$.create_editor = (parent) => {
  let $ = eventnode({ parent }); with ($) {
    const root = parent.attachShadow({ mode: "open" })
    $.css = document.createElement("style")
    css.innerText =
      `@import "../node_modules/monaco-editor/min/vs/editor/editor.main.css";`
    root.append($.div = dom({ class: "monaco-editor-div" }), css)
    style(div, { width: "100%", height: "100%" })

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

    $.change_language = l =>
      monaco.editor.setModelLanguage(editor.getModel(), l)

    new ResizeObserver(() => editor.layout()).observe(div)

    editor.addAction({
      id: "save-text-file",
      label: "save file",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: ed => emit("filesave", ed.getValue()),
    })

    editor.onDidChangeModelContent(() => emit("change"))
    $.open = () => { parent.style.display = "" }
    $.close = () => { parent.style.display = "none" }
  } return $
}