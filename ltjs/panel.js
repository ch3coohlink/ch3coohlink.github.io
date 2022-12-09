$.x = 0, $.y = 0, $.sx = 1, $.sy = 1
// drag flag | drag item | drag offset x/y
$.df = $.di = null, $.dx = 0, $.dy = 0
// temp connection | tc element | current event
$.tc = $.tce = $.ce = null

$.cnablestyle = "#00ff00 0px 0px 20px"
$.unablestyle = "#ff0000 0px 0px 20px"
$.delstyle = "#ff0000 0px 0px 40px"

$.nodes = new Set, $.nodediv = dom({ class: "full-panel drag-panel" }, root)
$.svgdoc = svg("svg", { class: "full-panel svg-panel" }, root)

$.screen2coord = (x, y, rb = nodediv.getBoundingClientRect(),
  w = rb.width / 2, h = rb.height / 2) =>
  [(x + w - w / sx) / sx - $.x, (y + h - h / sy) / sy - $.y]

requestAnimationFrame($.loop = () => {
  requestAnimationFrame(loop)
  style(nodediv, { transform: `scale(${sx}, ${sy}) translate(${x}px, ${y}px)` })
  style(svgdoc, { transform: `scale(${sx}, ${sy}) translate(${x}px, ${y}px)` })
  if (tc) {
    const b = tc.button.getBoundingClientRect(), e = ce
    const [ax, ay] = screen2coord(b.x + b.width / 2, b.y + b.height / 2)
    // TODO: use pageX/Y and root BoundingClientRect get clientX/Y
    const [bx, by] = screen2coord(e.pageX, e.pageY)
    tce.setAttribute("d", `M ${ax} ${ay} L ${bx} ${by}`)
  }
  if (di) {
    const i = di, e = ce, [x, y] = screen2coord(e.pageX, e.pageY)
    i.x = x - dx, i.y = y - dy, i.setpos()
  }
})

// mouse logic ======================
$.tolast = i => nodediv.lastChild.after(i.elm)
$.setdrag = (i, e) => ($.di = i, tolast(i),
  $.dx = e.offsetX, $.dy = e.offsetY,
  style(i.elm, { pointerEvents: "none", zIndex: "101" }))
$.ispanel = e => e.target === nodediv || e.target === root

$.csfp/*click start from panel*/ = false, $.ismoved = false
root.addEventListener("pointerdown", (e, p = ispanel(e)) => {
  if (p) { $.df = true, $.csfp = true }
  if (tc && tc.button !== e.target) { if (p) { showcnp(e) } leaveconnect() }
})
root.addEventListener("pointerup", (e, p = ispanel(e)) => {
  if (p && csfp && e.button == 2) { showcnp(e) }
  di ? di.elm.style.pointerEvents = "" : 0
  $.df = $.di = null, $.csfp = $.ismoved = $.spcf = false
})
onpointermove.add((e) => {
  if (!ismoved && csfp) { $.ismoved = true } $.ce = e
  df ? ($.x += e.movementX / sx, $.y += e.movementY / sy) : 0
})
const { min, max } = Math, smin = 1 / 5, smax = 3
onwheel.add((e, p = ispanel(e), s = sx + e.deltaY * -0.001) =>
  p ? $.sx = $.sy = min(max(s, smin), smax) : 0)

// connection =========================
$.styleconnect = (a, b) => {
  if (!(a && b)) { return } if (a.isinput) { [a, b] = [b, a] }
  const ab = a.button.getBoundingClientRect(), bb = b.button.getBoundingClientRect()
  const [bx, by] = screen2coord(ab.x + ab.width / 2, ab.y + ab.height / 2)
  const [ax, ay] = screen2coord(bb.x + bb.width / 2, bb.y + bb.height / 2)
  a.elm.setAttribute("d", `M ${ax} ${ay} L ${bx} ${by}`)
}
$.connectable = (a, b) => {
  if (a.isinput === b.isinput) { return false }
  if (proto(a) === proto(b)) { return false }
  return true
}
$.makeconnect = (a, b) => {
  if (!connectable(a, b)) { return }
  if (a.isinput) { [a, b] = [b, a] }
  a.elm = b.elm = svg("path", {}, svgdoc)
  a.target = b, b.target = a, styleconnect(a, b)
}
$.breakconnect = (a, b) => (
  a.target = b.target = null, a.elm = b.elm = null)

$.enterconnect = (i, e, elm = svg("path", {}, svgdoc)) =>
  ($.tc = i, $.ce = e, $.tce = elm)
$.leaveconnect = () =>
  ($.tc = null, tce.remove(), $.tce = null)

// create node ========================
$.nodetype = new Map(defaultnode.map(k => [k, dfno[k]]))

$.ncpanel = dom({ class: "node-create-panel" }, root)
$.ntinput = dom({ tag: "input", class: "codefont node-type-input" }, ncpanel)
$.ntlist = dom({ class: "node-type-list" }, ncpanel)

$.createnode = (k, e) => {
  const n = node($, nodetype.get(k), nodediv)
  const [x, y] = screen2coord(e.pageX - 100 * sx, e.pageY - 100 * sy)
  return (n.x = x, n.y = y, n.setpos(), nodes.add(n), n)
}

$.iscnpshow = () => !!ncpanel.style.display
$.showcnp = (e, oncreate) => {
  ncpanel.style.display = "unset"
  style(ncpanel, { display: "unset", left: e.pageX - 10, top: e.pageY - 10 })
  const c = (k, n = createnode(k, e)) => (hidecnp(), oncreate?.(n))
  const f = k => dom({ class: "node-type-item", child: k, onclick: () => c(k) })
  ntlist.append(...[...$.nodetype.keys()].sort().map(f))
}
$.hidecnp = () => (ncpanel.style.display = "", ntlist.innerHTML = "", ntinput.value = "")
ncpanel.onpointerleave = hidecnp