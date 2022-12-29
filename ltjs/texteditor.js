root.classList.add("texteditor-container")
defineup("env")
definedown("env")
defineright("text")
$.resize = (_, e = ta) => {
  e.style.height = "auto"
  e.style.height = e.scrollHeight + "px"
}
$.ta = dom({ tag: "textarea", class: "codefont", spellcheck: false }, root)
$.sandbox = dom({ class: "sandbox" }, root)

ta.onkeydown = e => e.key === "Delete" ? e.stopPropagation() : 0
ta.oninput = () => (resize(), save.text = ta.value)
ta.value = save.text ??= "", resize()

$.process = async () => {
  if (!$.env) { $.env = oneenv.newenv() }
  $.text = ta.value; sandbox.innerHTML = ""
  const f = new AsyncFunction("$", "root",
    `with($){\n${text}\n}//# sourceURL=${save.id}.js\nreturn $`)
  $.env = await f(env, sandbox)
}