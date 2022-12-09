$.$p = proto($), $.global = proto($p)

$.portdiv = dom({ class: "nodeport" + (isinput ? "" : " right") }, root)
$.namediv = dom({ class: "nodeportname", child: name }, portdiv)
$.button = dom({ class: "nodeportbutton" }, portdiv)

$.ports = isinput ? input : output, ports.add($)
$.target = null, $.elm = null
button.addEventListener("pointerdown", e => {
  if (target) {
    enterconnect(target, e, elm)
    breakconnect($, target)
    e.stopPropagation()
    return
  } else if (!tc) { enterconnect($, e) }
})
portdiv.addEventListener("pointerdown", () => tc ? makeconnect($, tc) : 0)
portdiv.addEventListener("pointerenter", () => !tc ? 0 :
  button.style.boxShadow = connectable($, tc) ? cnablestyle : unablestyle)
portdiv.addEventListener("pointerleave", () => button.style.boxShadow = "")