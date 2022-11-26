$.x = 0, $.y = 0, $.sx = 1, $.sy = 1
requestAnimationFrame($.loop = () => {
  requestAnimationFrame(loop)
  style(itemdiv, { transform: `scale(${sx}, ${sy})` })
  items.forEach(i => style(i.elm, { transform: `translate(${i.x + x}px, ${i.y + y}px)` }))
})

$.pd = false, $.di = null
$.selectstyle = "#ffff00 0px 0px 20px"
$.tolast = i => itemdiv.lastChild.after(i.elm)
$.setdrag = i => ($.di = i, tolast(i),
  style(i.elm, { pointerEvents: "none", zIndex: "101" }))

addEventListener("pointerdown", () => $.pd = true)
addEventListener("pointerup", () => {
  if (di) { di.elm.style.pointerEvents = "" }
  $.pd = false, $.di = null
})
addEventListener("pointermove", e => {
  if (!pd) { return }

  const mx = e.movementX / sx, my = e.movementY / sy
  if (di) { di.x += mx, di.y += my }
  else { $.x += mx, $.y += my }
})

const { min, max } = Math, smin = 1 / 5, smax = 3
addEventListener("wheel", e => {
  const s = sx + e.deltaY * -0.001
  $.sx = $.sy = min(max(s, smin), smax)
})