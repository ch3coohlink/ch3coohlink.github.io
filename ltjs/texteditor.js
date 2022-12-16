root.classList.add("texteditor-container")
defineoutput("text")
$.resize = (_, e = ta) => {
  e.style.width = measure(e.value)
  e.style.height = "auto"
  e.style.height = e.scrollHeight + "px"
}
$.ta = dom({ tag: "textarea", class: "codefont", spellcheck: false }, root)

ta.oninput = () => (resize(), save.text = ta.value)
save.text.then(t => (ta.value = t ?? "", resize()))

$.process = () => {
  $.text = ta.value
}