require.config({ paths: { vs: '../node_modules/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => { })

dom({
  tag: "style", child: `
html, body {
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  height: 100%;
}

.v-ctn {
  flex-direction: column;
}` }, document.head)

window.addEventListener("load", () => {
  $.topctn = dom({ class: "container" }, document.body)
  $.sidectn = dom({ class: "container v-ctn", style: { flexBasis: "25%" } }, topctn)
  $.mainctn = dom({ class: "container v-ctn", style: { width: "100%" } }, topctn)
  $.textctn = dom({ class: "container" }, mainctn)
  $.evalctn = dom({ style: { position: "absolute" } }, mainctn)

  $.newrepobtn = dom({ tag: "button", child: "newrepo" }, sidectn)
  $.newfilebtn = dom({ tag: "button", child: "newfile" }, sidectn)
  $.newrefbtn = dom({ tag: "button", child: "newref" }, sidectn)

  $.allitemctn = dom({ class: "container v-ctn" }, sidectn)
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

  new ResizeObserver(() => editor.layout()).observe(document.body)

  editor.addAction({
    id: "save-text-file",
    label: "save file",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: ed => log(ed.getValue()),
  })
})