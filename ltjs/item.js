if (!$.hasOwnProperty("x")) $.x = Math.random() * (root.clientWidth - 600) + 100
if (!$.hasOwnProperty("y")) $.y = Math.random() * (root.clientHeight - 400) + 100
$.elm = dom({ id, class: "movable item" }, root)

$.entered = false, $p = proto($)
$.onenter = () => {
  $.entered = true
  di ? style(elm, { boxShadow: selectstyle }) : 0
  elm.style.zIndex = "100"
  updatewidth()
}
$.onleave = () => {
  $.entered = false
  style(elm, { boxShadow: "" })
  di !== $ ? elm.style.zIndex = "" : 0
  updatewidth()
}
elm.addEventListener("pointerenter", onenter)
elm.addEventListener("pointerleave", onleave)

$.dragbar = dom({ class: "dragbar" }, elm)
dragbar.addEventListener("pointerdown", () => parent ? unchild() : setdrag($))

$.cnctbt = dom({ class: "right1 button" }, dragbar)
cnctbt.addEventListener("pointerdown", e => e.stopPropagation())

dom({ child: id, class: "left1 title" }, dragbar)

$.ibody = dom({ class: "item-body" }, elm)
ibody.addEventListener("pointerdown", e => {
  if (!parent) { tolast($) } e.stopPropagation()
})

$.content = dom({ class: "content" }, ibody)
$.inner = innerfct($, { root: content })

$.parent = null, $.children = new Set
$.tochild = p => {
  elm.classList.add("item-child")
  $.parent = p
  p.children.add($)
  p.childdiv.append(elm)
  p.updatewidth()
}
$.unchild = (p = parent) => {
  const b = elm.getBoundingClientRect(), [x, y] = screen2coord(b.x, b.y)
  elm.classList.remove("item-child")
  $.parent = null, $.x = x, $.y = y
  p.children.delete($)
  setdrag($)
  p.setleave()
  $p.pd = true
}
$.setleave = (p = parent) => (onleave(), p ? p.setleave() : 0)
$.childdiv = dom({ class: "item-child-div" }, ibody)

$.selfwidth = $.width = 900
$.getwidth = () => width + 3
$.setwidth = w => elm.style.width = ($.width = w) + "px"
$.updatewidth = (w = 0, r = true) => {
  children.forEach(c => w += c.getwidth())
  setwidth(Math.max(w, selfwidth))
  r ? parent?.updatewidth() : 0
  $.onresize?.()
}