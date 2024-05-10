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
  height: 2em;
  background: #f7f5e8;
  text-align: right;
}

button {
  word-break: break-all;
  text-align: left;
  border: 0px;
  padding: 4px;
  border-bottom: 1px solid black;
}

button:focus {
  outline: none;
  filter: brightness(0.8);
}

button:hover {
  filter: brightness(0.8);
}

button.repo-reference {
  background: #f7e8f7;
}

.message-background button, .message-background input {
  height: 2em;
  box-sizing: border-box;
}

.error {
  color: red;
}

textarea {
  resize: none;
}

pre {
  font-family: Consolas, "Courier New", monospace;
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
// TODO: mobile UI support
// TODO: multiple tab
// rename a modified file
// support parallel exec

$.single_input_message = f => async () => {
  openmessage()
  const ctn = dom({ class: "window" }, messagectn)
  const ipt = dom({ tag: "input" }, ctn)
  const btn = dom({ tag: "button", child: "Enter" }, ctn)
  const apply = commit_dialog(f); ipt.focus()
  ipt.addEventListener("keydown", e => e.key === "Enter" ? apply(ipt) : 0)
  btn.addEventListener("click", () => apply(ipt))
}
// 新建一个repo，当没有处于一个版本的时候，切换到这个新repo的根节点
$.new_repo = async (name) => {
  if (!name) { panic(`invalid repo name: "${name}"`) }
  await gt.newrepo(name)
  await ndslt.update_repo()
  await ndslt.update_node()
  if (!save.node) {
    const node = (await gt.readnodes(await gt.getrepoid(name)))[0]
    save.node = node
    await ndslt.change_repo_by_node(node)
    ndslt.highlight(node)
  }
}
$.change_node = async (node) => {
  await check_file_save_dialog()
  save.node = node
  await fllst.update_file(node)
  if (get_current_path()) {
    await open_file({ path: get_current_path() })
  } else {
    editor.close()
  }
}
$.new_file = async v => {
  await gt.write(save.node, v, "")
  await fllst.update_file(save.node)
  fllst.highlight(get_current_path())
}
$.current_file_changed = false
$.language_setting = { js: "javascript" }
$.save_file = async content => {
  const p = get_current_path()
  await gt.write(save.node, p, content, "file", true)
  $.current_file_changed = false
  fllst.set_modified(p, false)
}
$.open_file = async ({ path }) => {
  editor.open()
  try {
    set_current_path(path)
    const v = await gt.read(save.node, path)
    const ext = path.match(/\.([^\.]+)$/)?.[1] ?? ""
    editor.value = ""
    editor.change_language(language_setting[ext] ?? "plaintext")
    editor.value = v
    $.current_file_changed = false
    fllst.highlight(path)
    fllst.set_modified(path, false)
  } catch (e) {
    editor.close()
    throw e
  }
}
$.get_current_path = () => save[save.node + "/file"]
$.set_current_path = v => save[save.node + "/file"] = v
$.new_node_dialog = async () => {
  await check_file_save_dialog(); openmessage()
  const ctn = dom({ class: "window" }, messagectn)
  const warning = "This action will lock current version," +
    " and you will no longer being able to edit it, proceed?"
  dom({ child: warning }, ctn)
  const btn = dom({ tag: "button", child: "Yes" }, ctn)
  btn.onclick = commit_dialog(async () => {
    const newnode = await gt.newnode(save.node)
    await change_node(newnode)
    await ndslt.update_repo()
    await ndslt.change_repo_by_node(save.node)
  })
}
$.commit_dialog = f => async (...a) => {
  try { await f(...a); closemessage() } catch (e) {
    openmessage()
    const child = e instanceof Error ? (e.message + "\n" + e.stack) : e
    messagectn.append(dom({ tag: "pre", class: "error", child }))
    throw e
  }
}
$.rename_ref_dialog = (new_ref = true) => async (v = {}) => {
  openmessage()
  const ctn = dom({ class: "window" }, messagectn)
  const ns = dom({ class: "container v-ctn" }, ctn)
  const ndslt = create_node_selector(ns)
  ndslt.nodesvg.style.height = "500px"
  await ndslt.update_repo()
  await ndslt.update_node()
  const ipt = dom({ tag: "input" }, ctn)
  const btn = dom({ tag: "button", child: "Enter" }, ctn)
  if (v.content && v.path) {
    ipt.value = v.path
    await ndslt.change_repo_by_node(v.content)
  }
  const apply = commit_dialog(async () => {
    const n = ipt.value
    const i = ndslt.current_node
    if (n && i) {
      if (new_ref) { await gt.write(save.node, n, i, "ref") }
      else if (v.path) {
        await gt.remove(save.node, v.path)
        await gt.write(save.node, n, i, "ref")
      }
    }
    else { panic(`new ref failed because of invalid argument`) }
    await fllst.update_file(save.node)
    fllst.highlight(get_current_path())
  })
  ipt.addEventListener("keydown", e => e.key === "Enter" ? apply() : 0)
  btn.addEventListener("click", apply)
}
$.check_file_save_dialog = async () => {
  if (current_file_changed) {
    await new Promise(acc => {
      openmessage()
      const ctn = dom({ class: "window" }, messagectn)
      dom({ child: "File has been changed, do you want to save it?" }, ctn)
      const btnyes = dom({ tag: "button", child: "Yes" }, ctn)
      const btndis = dom({ tag: "button", child: "Discard" }, ctn)
      const btnno = dom({ tag: "button", child: "No" }, ctn)
      btnyes.onclick = commit_dialog(async () => (
        await save_file(editor.value), acc()))
      btndis.onclick = commit_dialog(() =>
        (fllst.set_modified(get_current_path(), false), acc()))
      btnno.onclick = () => closemessage()
    })
  }
}
$.simple_rename_dialog = async (v, f) => {
  openmessage()
  const ctn = dom({ class: "window" }, messagectn)
  const ipt = dom({ tag: "input", value: v }, ctn)
  const btn = dom({ tag: "button", child: "Enter" }, ctn)
  const apply = commit_dialog(f); ipt.focus()
  ipt.addEventListener("keydown", e => e.key === "Enter" ? apply(v, ipt.value) : 0)
  btn.addEventListener("click", () => apply(v, ipt.value))
}
$.rename_file_dialog = async v => {
  await check_file_save_dialog()
  simple_rename_dialog(v.path, async (o, n) => {
    await gt.rename(save.node, o, n)
    await fllst.update_file(save.node)
    await open_file({ path: n })
  })
}
$.rename_repo_dialog = async () => simple_rename_dialog(
  await gt.getnoderepo(save.node), async (o, n) => {
    await gt.renamerepo(o, n)
    await ndslt.update_repo()
  })
$._packcode_ = v =>
  `const _cnode_ = "${v.node}";\n` +
  `const read = async p => (await rawread(_cnode_, p)).content;\n` +
  `const loadjs = async p => new AsyncFunction("$",
  \`with($) {\n\${_packcode_(await rawread(_cnode_, p))}\n}\`)($);\n` +
  "\n" + v.content
$.exec_result = [], $.exec_count = 0
$.exec_dialog = commit_dialog(async v => {
  if (current_file_changed && v.path === get_current_path()) { await save_file(editor.value) }
  save.last_exec = v, exec_result.forEach(f => f())
  $.exec_count -= exec_result.length, $.exec_result = []
  if (exec_count >= 10) { return } $.exec_count += 1; let o; try {
    v = await gt.rawread(v.node, v.path)
    o = await sdbx.start({ rawread: gt.rawread, sandbox, _packcode_ })
    await o.exec(_packcode_(v))
  } finally { exec_result.push(o.clear) }
})
$.opencontextmenu = (x, y) => {
  contextmenuctn.style.left = x - 1 + "px"
  contextmenuctn.style.top = y - 1 + "px"
  contextmenuctn.style.display = ""
  contextmenuctn.innerHTML = ""
}
$.closecontextmenu = () => { contextmenuctn.style.display = "none" }
$.openmessage = () => {
  messagectn.style.display = ""
  messagectn.innerHTML = ""
}
$.closemessage = () => { messagectn.style.display = "none" }

window.addEventListener("beforeunload", (e) => {
  if (!$.current_file_changed) { return }
  check_file_save_dialog()
  return e.returnValue = "file has been changed"
})
window.addEventListener("load", async () => {
  // DOM 结构
  $.topctn = dom({ class: "container", style: { userSelect: "none" } }, document.body)
  $.sidectn = dom({ class: "container v-ctn", style: { width: "150px" } }, topctn)
  $.mainctn = dom({ class: "container v-ctn", style: { width: "700px" } }, topctn)
  $.evalctn = dom({ class: "container v-ctn" }, topctn)
  evalctn.style.width = "calc(100% - 850px)"
  evalctn.style.userSelect = "text"
  $.sdbx = sandbox(evalctn)
  $.textctn = dom({ class: "container" }, mainctn)
  $.editor = create_editor(textctn)
  $.contextmenuctn = dom({
    class: "context-menu", style: { display: "none" },
    onpointerleave: closecontextmenu
  }, document.body)
  $.messagectn = dom({
    class: "container message-background", style: { display: "none" },
    onpointerdown: e => { if (e.target === messagectn) { closemessage() } }
  }, document.body)
  $.newrepobtn = dom({ tag: "button", child: "newrepo" }, sidectn)
  $.renamerepobtn = dom({ tag: "button", child: "renamerepo" }, sidectn)
  $.delrepobtn = dom({ tag: "button", child: "delrepo" }, sidectn)
  $.newnodebtn = dom({ tag: "button", child: "newnode" }, sidectn)
  $.newfilebtn = dom({ tag: "button", child: "newfile" }, sidectn)
  $.newrefbtn = dom({ tag: "button", child: "newref" }, sidectn)
  $.filectn = dom({ class: "container v-ctn" }, sidectn)
  filectn.style.overflow = "auto"
  filectn.style.paddingTop = "10px"
  $.fllst = create_file_list(filectn)
  $.nodectn = dom({ class: "container v-ctn" }, sidectn)
  $.ndslt = create_node_selector(nodectn)
  $.description = dom({ tag: "textarea" }, nodectn)
  description.style.height = "30%"

  // 事件绑定
  newrepobtn.addEventListener("click",
    single_input_message(ipt => new_repo(ipt.value)))
  renamerepobtn.addEventListener("click", rename_repo_dialog)
  newnodebtn.addEventListener("click", new_node_dialog)
  newfilebtn.addEventListener("click",
    single_input_message(ipt => new_file(ipt.value)))
  newrefbtn.addEventListener("click", rename_ref_dialog())
  editor.on("change", () => {
    current_file_changed = true
    fllst.set_modified(get_current_path(), true)
  })
  ndslt.on("nodeselect", change_node)
  fllst.on("fileselect", async v => {
    await check_file_save_dialog()
    await open_file(v)
  })
  const _rrdf = rename_ref_dialog(false)
  fllst.on("refselect", _rrdf)
  editor.on("filesave", commit_dialog(save_file))
  fllst.on("rename", v => {
    if (v.mode === "ref") { _rrdf(v) }
    else { rename_file_dialog(v) }
  })
  fllst.on("delete", async v => {
    await gt.remove(save.node, v.path)
    await fllst.update_file(save.node)
    if (get_current_path() === v.path) {
      editor.close()
    }
  })
  fllst.on("execute", exec_dialog)
  window.addEventListener("keydown", async e => {
    const k = e.key.toLowerCase()
    if (k === "escape") { closemessage() }
    if (e.altKey) {
      e.preventDefault()
      if (k === "e" || k === "enter") {
        exec_dialog({ path: get_current_path(), node: save.node })
      } else if (k === "q") {
        await save_file(editor.value)
        const v = save.last_exec; if (v) { exec_dialog(v) }
        else { exec_dialog({ path: get_current_path(), node: save.node }) }
      }
    }
  })

  // 初始化
  $.save = db.saveobj("6s80s1u052ftdj009g2fd7brflbv1iq8")
  await save.init
  fllst.update_file(save.node)
  editor.close()
  await ndslt.update_repo()
  if (save.node) { await ndslt.change_repo_by_node(save.node) }
  if (get_current_path()) { await open_file({ path: get_current_path() }) }
})

$.add_context_menu_item = (event, emit, ...a) => {
  const e = dom({ tag: "button", child: event }, contextmenuctn)
  e.onclick = () => (closecontextmenu(), emit(event, ...a))
}
$.create_file_list = (parent) => {
  let $ = eventnode({ parent }); with ($) {
    $.update_file = async (node) => {
      parent.innerHTML = ""
      $.filedict = {}
      $.filelist = await gt.dir(node)
      filelist.forEach(v => {
        const e = dom({ tag: "button", child: v.path }, parent)
        const rf = v.mode === "ref"
        if (rf) { e.className = "repo-reference" }
        e.onclick = () => emit(rf ? "refselect" : "fileselect", v)
        e.oncontextmenu = e => {
          opencontextmenu(e.pageX, e.pageY)
          if (v.mode === "file") { add_context_menu_item("execute", emit, v) }
          add_context_menu_item("rename", emit, v)
          add_context_menu_item("delete", emit, v)
          e.preventDefault()
        }
        filedict[v.path] = e
      })
    }
    $.highlight = (path) => {
      for (const k in filedict) { filedict[k].style.color = "" }
      if (filedict[path]) { filedict[path].style.color = "red" }
    }
    $.set_modified = (path, flag) => {
      const e = filedict[path]
      if (e) e.innerText = path + (flag ? " *" : "")
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
        panic(`change repo by id failed using id "${node}" with error:\n` + e)
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
    css.innerText = `@import "../node_modules` +
      `/monaco-editor/min/vs/editor/editor.main.css";`
    root.append($.div = dom({ class: "monaco-editor-div" }), css)
    style(div, { width: "100%", height: "100%" })

    $.wordWrap = "on"
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
      // folding: false,
      minimap: { enabled: false },
      wordWrap,
    })
    editor.addAction({
      id: "save-text-file", label: "Save File",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => emit("filesave", value),
    })
    editor.addAction({
      id: "toggle-word-warp", label: "Toggle Word Warp",
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
      run: () => ($.wordWrap = wordWrap === "on" ? "off" : "on",
        editor.updateOptions({ wordWrap })),
    })

    $.change_language = l =>
      monaco.editor.setModelLanguage(editor.getModel(), l)
    new ResizeObserver(() => editor.layout()).observe(div)
    editor.onDidChangeModelContent(() => emit("change"))
    Object.defineProperty($, "value",
      { get: () => editor.getValue(), set: v => editor.setValue(v) })
    $.open = () => { parent.style.display = "" }
    $.close = () => { parent.style.display = "none" }
  } return $
}