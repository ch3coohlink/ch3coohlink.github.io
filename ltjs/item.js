if (!$.hasOwnProperty("x")) $.x = Math.random() * (root.clientWidth - 600) + 100
if (!$.hasOwnProperty("y")) $.y = Math.random() * (root.clientHeight - 400) + 100
$.elm = dom({ id, class: "movable item" }, root)
$.onresize = []; new ResizeObserver(() => onresize.forEach(f => f())).observe(root)

$.entered = false, $p = proto($)
$.onenter = () => {
  $.entered = true
  di ? style(elm, { boxShadow: selectstyle }) : 0
  elm.style.zIndex = "100"
}
$.onleave = () => {
  $.entered = false
  style(elm, { boxShadow: "" })
  di !== $ ? elm.style.zIndex = "" : 0
}
elm.addEventListener("pointerenter", onenter)
elm.addEventListener("pointerleave", onleave)
elm.addEventListener("pointerup", onleave)

$.dragbar = dom({ class: "dragbar" }, elm)
dragbar.addEventListener("pointerdown", () => setdrag($))

$.cnctbt = dom({ class: "right1 button" }, dragbar)
cnctbt.addEventListener("pointerdown", e => e.stopPropagation())

dom({ child: id, class: "left1 title" }, dragbar)

$.ibody = dom({ class: "item-body" }, elm)
ibody.addEventListener("pointerdown", e => (tolast($), e.stopPropagation()))

$.content = dom({ class: "content" }, ibody)
$.inner = innerfct($, { root: content })

