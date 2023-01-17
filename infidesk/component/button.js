compappend(root, $.bt = dom({}))
bt.onclick = e => trigger("click", e)
compappend(bt, $.txt = dom({ class: "text-ellipsis" }))

initprop($, "text", () => txt.innerText, v => txt.innerText = v, "B")

let cn = $.btstyle ?? "float"; initprop($, "btstyle", () => cn,
  v => bt.className = "button " + (cn = v), cn)