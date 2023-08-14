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
}` }, document.head)

$.db = idb("infidesk/newdev")
$.gt = git(db)

window.addEventListener("load", () => {
  $.topctn = dom({ class: "container" }, document.body)
  $.sidectn = dom({ class: "container v-ctn", style: { flexBasis: "25%" } }, topctn)
  $.mainctn = dom({ class: "container v-ctn", style: { width: "100%" } }, topctn)
  $.textctn = dom({ class: "container" }, mainctn)
  $.evalctn = dom({ style: { position: "absolute" } }, mainctn)

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

  $.newrepobtn = dom({ tag: "button", child: "newrepo" }, sidectn)
  newrepobtn.addEventListener("click", e => {
    openmessage()
    const ctn = dom({ class: "window" }, messagectn)
    const ipt = dom({ tag: "input" }, ctn)
    const btn = dom({ tag: "button", child: "Enter" }, ctn)
    btn.addEventListener("click", async () => {
      try {
        await gt.newrepo(ipt.value)
        // TODO: update repo graph
        closemessage()
      } catch (e) {
        openmessage()
        messagectn.append(dom({ child: e }))
      }
    })
  })

  $.newfilebtn = dom({ tag: "button", child: "newfile" }, sidectn)
  $.newrefbtn = dom({ tag: "button", child: "newref" }, sidectn)
  $.tempbtn = dom({ tag: "button", child: "hide editor" }, sidectn)
  tempbtn.addEventListener("click", e => {
    if (textctn.style.display === "none") {
      textctn.style.display = ""
    }
    else { textctn.style.display = "none" }
  })

  $.filectn = dom({ class: "container v-ctn" }, sidectn)
  $.nodectn = dom({ class: "container v-ctn" }, sidectn)
  $.reposlt = dom({ tag: "select" }, nodectn)
  $.nodesvg = svg({}, nodectn)
  $.description = dom({ tag: "textarea" }, nodectn)

  $.editor = monaco.editor.create(textctn, {
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

  new ResizeObserver(() => editor.layout()).observe(textctn)

  editor.addAction({
    id: "save-text-file",
    label: "save file",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: ed => log(ed.getValue()),
  })
})