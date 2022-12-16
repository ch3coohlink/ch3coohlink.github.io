defineinput("init", "text")
defineinput("proc", "text")

root.classList.add("registernode-container")
dom({ child: "node type name", class: "label" }, root)
$.ntinput = dom({ tag: "input", class: "codefont node-type-input" }, root)
dom({ child: "", class: "label" }, root)
$.buttonlist = dom({ class: "button-list" }, root)
$.cfbutton = dom({ tag: "button", child: "✔" }, buttonlist)

cfbutton.onpointerdown = () => {
  const o = { type: ntinput.value }
  input.forEach(({ target: t, name: k }) => o[k] = t.$p.user.ta.value)
}

ntinput.oninput = () => save.targettype = ntinput.value
save.targettype.then(t => ntinput.value = t ?? "")