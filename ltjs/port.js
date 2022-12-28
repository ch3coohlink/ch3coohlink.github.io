$.$p = proto($), $.global = proto($p)

$.root = $p[type + "bar"]

$.portdiv = dom({ class: "nodeport" + " " + type }, root)
$.namediv = dom({ class: "nodeportname", child: name }, portdiv)
$.button = dom({ class: "nodeportbutton" }, portdiv)

$.ports = $[type]
$.id = ports.length, ports.push($)
$.target = null

$.remove = () => breakconnect(target)

$.getother = (t = target, p = $) => t.a === p ? t.b : t.a
button.addEventListener("pointerdown", e => {
  if (!tc) {
    if (target) {
      enterconnect(getother(), e)
      breakconnect(target)
      e.stopPropagation()
    } else { enterconnect($, e) }
  }
})
portdiv.addEventListener("pointerdown", () => tc ? makeconnect($, tc) : 0)
portdiv.addEventListener("pointerenter", () => !tc ? 0 :
  button.style.boxShadow = connectable($, tc) ? cnablestyle : unablestyle)
portdiv.addEventListener("pointerleave", () => button.style.boxShadow = "")