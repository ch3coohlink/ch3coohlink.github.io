$.x = 0, $.y = 0, $.sx = 1, $.sy = 1
requestAnimationFrame($.loop = () => {
  requestAnimationFrame(loop)
  style(itemdiv, { transform: `scale(${sx}, ${sy}) translate(${x}px, ${y}px)` })
  style(svgdoc, { transform: `scale(${sx}, ${sy}) translate(${x}px, ${y}px)` })
  if (tc) {
    const i = tc, b = i.cnctbt.getBoundingClientRect(), e = i.tce
    const [ax, ay] = screen2coord(b.x + b.width / 2, b.y + b.height / 2)
    const [bx, by] = screen2coord(e.pageX, e.pageY)
    i.tcelm.setAttribute("d", `M ${ax} ${ay} L ${bx} ${by}`)
  }
})

$.pd = false, $.di = null, $.si = null, $.tc = null
$.selectstyle = "#ffff00 0px 0px 20px"
$.delstyle = "#ff0000 0px 0px 40px"
$.tolast = i => itemdiv.lastChild.after(i.elm)
$.setdrag = i => ($.di = i, tolast(i),
  style(i.elm, { pointerEvents: "none", zIndex: "101" }))

addEventListener("pointerdown", () => $.pd = true)
addEventListener("pointerup", () => {
  const tc = $.tc, si = $.si; $.tc = null, $.si = null
  if (si) { si.onleave() }
  if (tc) { tc.tcelm.remove(), tc.tcelm = null }
  if (tc && si && tc !== si) { makeconnect(si, tc) }

  const di = $.di; $.pd = false, $.di = null
  if (di) { di.elm.style.pointerEvents = "", di.onleave() }
  if (di && $.todel) { di.remove() }
})
addEventListener("pointermove", e => {
  if (tc) { tc.tce = e } if (!pd) { return }
  const mx = e.movementX / sx, my = e.movementY / sy
  if (di) { di.x += mx, di.y += my, di.setpos() } else { $.x += mx, $.y += my }
})

const { min, max } = Math, smin = 1 / 5, smax = 3
addEventListener("wheel", e => {
  const s = sx + e.deltaY * -0.001
  $.sx = $.sy = min(max(s, smin), smax)
})

$.styleconnect = o => {
  const ab = o.a.elm.getBoundingClientRect(), bb = o.b.cnctbt.getBoundingClientRect()
  const [bx, by] = screen2coord(ab.right - 8 * sx, ab.bottom - 8 * sy)
  const [ax, ay] = screen2coord(bb.x + bb.width / 2, bb.y + bb.height / 2)
  o.e.setAttribute("d", `M ${ax} ${ay} L ${bx} ${by}`)
}
$.makeconnect = (a, b) => {
  if (a.from.get(b)) { return } const o = { a, b, e: svg("path", {}, svgdoc) }
  o.e.onpointerenter = () => o.e.style.filter = "drop-shadow(0px 0px 4px #f00)"
  o.e.onpointerleave = () => o.e.style.filter = ""
  o.e.onclick = () => breakconnect(a, b)
  a.from.set(b, o), b.to.set(a, o), styleconnect(o)
}
$.breakconnect = (a, b) => {
  const o = a.from.get(b); if (!o) { return }
  a.from.delete(b), b.to.delete(a), o.e.remove()
}
$.enterconnect = (i, e) => {
  $.tc = i, i.tce = e, i.tcelm = svg("path", {}, svgdoc)
  style(i.tcelm, { pointerEvents: "none" })
}