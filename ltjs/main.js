await loadsym("./basic.js")
$.root = $.body = document.body
$.html = document.documentElement

$.x = 0, $.y = 0, $.sx = 1, $.sy = 1
$.itemdiv = dom({ style: { height: "100%" } }, root)
$.ci = await require("./item.js")
$.items = "0".repeat(10).split("").map((_, i) => ci($, { root: itemdiv, id: i + 1 }))

requestAnimationFrame($.loop = () => {
  requestAnimationFrame(loop)
  style(body, { transform: `scale(${sx}, ${sy})` })
  items.forEach(i => {
    if (i.parent) style(i.elm, { transform: "" })
    else { style(i.elm, { transform: `translate(${i.x + x}px, ${i.y + y}px)` }) }
  })
})

$.pd = false, $.di = null
$.selectstyle = "#ffff00 0px 0px 20px"
$.tolast = i => itemdiv.lastChild.after(i.elm)
$.setdrag = i => ($.di = i, tolast(i), i.elm.style.pointerEvents = "none")
addEventListener("pointerdown", () => $.pd = true)
addEventListener("pointerup", () => {
  if (di) { di.elm.style.pointerEvents = "" }
  let si, f = i => { if (i.entered) { si = i, i.children.forEach(f) } }
  items.forEach(i => (i.elm.style.boxShadow = "", i.parent ? 0 : f(i)))
  if (di && si && di !== si) { di.tochild(si) } $.pd = false, $.di = null
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