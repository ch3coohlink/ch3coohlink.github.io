if (!$.hasOwnProperty("x")) $.x = Math.random() * (root.clientWidth - 600) + 100
if (!$.hasOwnProperty("y")) $.y = Math.random() * (root.clientHeight - 600) + 100
$.elm = dom({ id: id, class: "movable item" }, root)

$.entered = false, $p = proto($)
elm.addEventListener("pointerenter", () => {
  $.entered = true
  di ? style(elm, { boxShadow: selectstyle }) : 0
})
elm.addEventListener("pointerleave", () => {
  $.entered = false
  style(elm, { boxShadow: "" })
})

$.dragbar = dom({ class: "dragbar" }, elm)
dragbar.addEventListener("pointerdown", e => {
  if (parent) { e.stopPropagation(), unchild() }
  else { setdrag($) }
})

$.cnctbt = dom({ class: "right1" }, dragbar)
cnctbt.addEventListener("pointerdown", e => e.stopPropagation())

$.ibody = dom({ class: "item-body" }, elm)
ibody.addEventListener("pointerdown", e => {
  if (!parent) { tolast($) } e.stopPropagation()
})

dom({ child: id, style: { padding: "0.5em" } }, ibody)

$.parent = null, $.children = new Set
$.tochild = p => {
  $.parent = p
  p.children.add($)
  p.childdiv.append(elm)
  elm.classList.add("item-child")
}
$.unchild = () => {
  parent.children.delete($)
  $.parent = null

  const b = elm.getBoundingClientRect()
  const rb = $p.root.getBoundingClientRect()
  const w = rb.width / 2, h = rb.height / 2
  $.x = (b.x + w - w / sx) / sx - $p.x
  $.y = (b.y + h - h / sy) / sy - $p.y

  elm.classList.remove("item-child")
  setdrag($), $p.pd = true
}
$.childdiv = dom({ class: "item-child-div" }, ibody)