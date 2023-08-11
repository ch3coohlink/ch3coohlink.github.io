require.config({ paths: { vs: '../node_modules/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => { })

window.addEventListener("load", () => {

  document.documentElement.style.height = "100%"
  document.body.style.height = "100%"
  document.body.style.margin = "0"

  $.editor = monaco.editor.create(document.body, {
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