defineinput("a", "text")
defineinput("b", "text")
defineinput("c", "text")
defineinput("d", "text")
defineinput("e", "text")
defineoutput("src", "text")

root.classList.add("texteditor-container")
$.resize = (_, e = ta) => {
  e.style.width = measure(e.value)
  e.style.height = "auto"
  e.style.height = e.scrollHeight + "px"
}
$.ta = dom({ tag: "textarea", class: "codefont", spellcheck: false }, root)

ta.onkeydown = e => e.key === "Delete" ? e.stopPropagation() : 0
ta.oninput = () => (resize(), save.text = ta.value)
save.text.then(t => (ta.value = t ?? "", resize()))

$.process = () => {
  $.src = `$.ref = {}` + "abcde".split("")
    .map(n => `\n$.ref.${n} = ${JSON.stringify($[n] ?? "")}`).join("") +
    `\n$.ref.id = "${id}"\n` + ta.value
}