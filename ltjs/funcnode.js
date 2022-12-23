defineinput("src", "text")
defineoutput("src", "text")

style(root, { width: 200 })
dom({ child: "name", class: "label" }, root)
$.nameip = dom({ tag: "input", class: "codefont node-type-input" }, root)
nameip.oninput = () => save.targetname = nameip.value
save.targetname.then(t => nameip.value = t ?? "")

$.process = () => {
  const n = $.nameip.value
  isarr(src) ? $.src = src.map(t => `{\n${t}\n}`).join(" ") : 0
  if (n.length <= 0) { $.src = ""; return }
  $.src = `$.${n} = (__PROTO__, __APPEND__, $ = ` +
    `Object.assign(Object.create(__PROTO__), __APPEND__))` +
    ` => {\nwith($) {\n${src}\n} return $ }`
}