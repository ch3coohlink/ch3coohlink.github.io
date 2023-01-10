root.classList.add("texteditor-container")
defineup("env")
definedown("env")
defineright("text")
$.resize = (_, e = ta) => {
  e.style.height = "auto"
  e.style.height = e.scrollHeight + "px"
}
$.ta = dom({ tag: "textarea", class: "codefont", spellcheck: false }, root)

$.sandbox = dom({}, root)
$.initsdbx = () => {
  sandbox.replaceWith($.sandbox = dom({ class: "sandbox" }, root))
  $.sandbox.onpointerdown = e => e.stopPropagation()
}

ta.onkeydown = e => e.key === "Delete" ? e.stopPropagation() : 0
ta.oninput = () => (resize(), save.text = ta.value)
ta.value = save.text ??= "", resize()

$.processhorz = () => {
  $.text = ta.value
}
$.processvert = async () => {
  if (!$.env) { $.env = oneenv.newenv() }
  initsdbx()
  const f = new AsyncFunction("$", "root",
    `with($){\n${ta.value}\n}//# sourceURL=${save.id}.js\nreturn $`)
  $.env = await f(env, sandbox)
}

$.pinbt = dom({ tag: "button", child: "📌", class: "pin-button" }, root)
pinbt.onpointerdown = e => e.stopPropagation()
pinbt.onclick = () => save.pined ? removepin() : createpin()
$.placeholder = dom(), $.pindom = null
$.createpin = () => {
  sandbox.replaceWith(placeholder)
  $.pindom = sendpin(sandbox, "", removepin)
  save.pined = true
}
$.removepin = () => {
  pindom.remove(), $.pindom = null
  placeholder.replaceWith(sandbox)
  save.pined = false
}
if (save.pined ??= false) { createpin() }

$.remove = () => {
  if (save.pined) { removepin() }
}