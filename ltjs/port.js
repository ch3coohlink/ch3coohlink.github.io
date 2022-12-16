$.$p = proto($), $.global = proto($p)

$.portdiv = dom({ class: "nodeport" + (isinput ? "" : " right") }, root)
$.namediv = dom({ class: "nodeportname", child: name }, portdiv)
$.button = dom({ class: "nodeportbutton" }, portdiv)

$.ports = isinput ? input : output, $.id = ports.length, ports.push($)
$.target = $.elm = null

$.key = (isinput ? "input" : "output") + id
$.settarget = t => t ? (save[key] = [t.$p.id, t.isinput, t.id], $.target = t)
  : (save[key] = null, elm.remove(), $.elm = $.target = null)
save[key].then(c => {
  if (!c) { return } const [id, isinput, portid] = c
  const t = nodes.get(id), p = (isinput ? t.input : t.output)[portid]
  makeconnect($, p)
})

button.addEventListener("pointerdown", e => {
  if (!tc) {
    if (target) {
      enterconnect(target, e, elm)
      breakconnect($, target)
      e.stopPropagation()
    } else { enterconnect($, e) }
  }
})
portdiv.addEventListener("pointerdown", () => tc ? makeconnect($, tc) : 0)
portdiv.addEventListener("pointerenter", () => !tc ? 0 :
  button.style.boxShadow = connectable($, tc) ? cnablestyle : unablestyle)
portdiv.addEventListener("pointerleave", () => button.style.boxShadow = "")