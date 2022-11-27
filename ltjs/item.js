if (!$.hasOwnProperty("x")) $.x = Math.random() * (root.clientWidth - 600) + 100
if (!$.hasOwnProperty("y")) $.y = Math.random() * (root.clientHeight - 400) + 100
$.elm = dom({ id, class: "movable item" }, root)
$.onresize = []; new ResizeObserver(() => onresize.forEach(f => f())).observe(elm)

$.$p = proto($)
$.onenter = () => {
  $p.si = $
  tc && tc !== $ ? style(elm, { boxShadow: selectstyle }) : 0
  elm.style.zIndex = "100"
}
$.onleave = () => {
  $p.si === $ ? $p.si = null : 0
  style(elm, { boxShadow: "" })
  di !== $ ? elm.style.zIndex = "" : 0
}
elm.addEventListener("pointerenter", onenter)
elm.addEventListener("pointerleave", onleave)

$.dragbar = dom({ class: "dragbar" }, elm)
dragbar.addEventListener("pointerdown", () => setdrag($))

$.cnctbt = dom({ class: "right1 button" }, dragbar)
cnctbt.addEventListener("pointerdown", e =>
  (enterconnect($, e), e.stopPropagation()))
$.from = new Map, $.to = new Map

dom({ child: id, class: "left1 title" }, dragbar)

$.ibody = dom({ class: "item-body" }, elm)
ibody.addEventListener("pointerdown", e => (tolast($), e.stopPropagation()))

$.content = dom({ class: "content" }, ibody)
$.inner = innerfct($, { root: content })

const rmconn = ({ a, b }) => breakconnect(a, b)
$.remove = () => (items.delete($), elm.remove(),
  from.forEach(rmconn), to.forEach(rmconn))

$.updateconn = () => (from.forEach(styleconnect), to.forEach(styleconnect))
$.setpos = () => (style(elm, { left: x, top: y }), updateconn())
setpos()

onresize.push(updateconn)