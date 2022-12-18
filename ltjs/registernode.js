defineinput("init", "text")
defineinput("proc", "text")

root.classList.add("registernode-container")
dom({ child: "node type name", class: "label" }, root)
$.ntinput = dom({ tag: "input", class: "codefont node-type-input" }, root)

ntinput.oninput = () => save.targettype = ntinput.value
save.targettype.then(t => ntinput.value = t ?? "")

$.process = () => {
  log(`Registernode is temporarily removed from design.`)
}