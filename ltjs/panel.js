$.x = 0, $.y = 0, $.sx = 1, $.sy = 1
// drag flag | drag item | focus item | drag offset x/y
$.df = $.di = $.fi = null, $.dx = 0, $.dy = 0
// temp connection | tc element | current event
$.tc = $.tce = $.ce = null

$.cnablestyle = "#00ff00 0px 0px 20px"
$.unablestyle = "#ff0000 0px 0px 20px"
$.focusstyle = "#fff 0px 0px 40px"
$.delstyle = "#ff0000 0px 0px 40px"

$.nodediv = dom({ class: "full-panel drag-panel" }, root)
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
    i.setpos(x - dx, y - dy)
  }
})

// mouse logic ======================
$.clearfocus = () => fi ? (fi.elm.style.boxShadow = "", $.fi = null) : 0
$.tolast = i => (nodediv.lastChild.after(i.elm),
  clearfocus(), $.fi = i, fi.elm.style.boxShadow = focusstyle)
$.setdrag = (i, e) => ($.di = i,
  $.dx = e.offsetX, $.dy = e.offsetY,
  style(i.elm, { pointerEvents: "none", zIndex: "101" }))
$.ispanel = e => e.target === nodediv || e.target === root

$.csfp/*click start from panel*/ = false, $.ismoved = false
root.addEventListener("pointerdown", (e, p = ispanel(e)) => {
  if (p) { $.df = $.csfp = true, clearfocus() }
  if (tc && tc.button !== e.target) { if (p) { showcnp(e) } leaveconnect() }
})
root.addEventListener("pointerup", (e, p = ispanel(e)) => {
  if (p && csfp && e.button == 2) { showcnp(e) }
  di ? di.elm.style.pointerEvents = "" : 0
  $.df = $.di = null, $.csfp = $.ismoved = $.spcf = false
})
onpointermove.add((e) => {
  if (!ismoved && csfp) { $.ismoved = true } $.ce = e
  df ? ($.x += e.movementX / sx, $.y += e.movementY / sy, save.x = x, save.y = y) : 0
})
const { min, max } = Math, smin = 1 / 5, smax = 3
onwheel.add((e, p = ispanel(e), s = sx + e.deltaY * -0.001) =>
  p ? ($.sx = $.sy = min(max(s, smin), smax), save.sx = sx, save.sy = sy) : 0)

// keyboard ===========================
root.addEventListener("keydown", e => {
  const k = e.key, lk = k.toLowerCase()
  if (lk === "e" && e.ctrlKey) {
    try { fi ? execgraph(getgraph(fi)) : 0 }
    catch (e) { console.error(e) }
  }
  if (k === "F5") { return }
  e.preventDefault()
})

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
  if (a.target || b.target) { return false }
  if (proto(a) === proto(b)) { return false } return true
}
$.makeconnect = (a, b) => {
  if (!connectable(a, b)) { return }
  if (a.isinput) { [a, b] = [b, a] }
  a.elm = b.elm = svg("path", {}, svgdoc)
  a.settarget(b), b.settarget(a), styleconnect(a, b)
}
$.breakconnect = (a, b) => (a.settarget(0), b.settarget(0))
$.enterconnect = (i, e, elm = svg("path", {}, svgdoc)) =>
  ($.tc = i, $.ce = e, $.tce = elm)
$.leaveconnect = () => ($.tc = null, tce.remove(), $.tce = null)

// node update ========================
const mapset = (m, k, v) => { if (!m.has(k)) m.set(k, new Set); m.get(k).add(v) }
$.getgraph = i => {
  let s = false, ns = new Set, ps = new Set
  const to = new Map, from = new Map, fi = (i, b) => {
    if (!s) for (const p of b ? i.input : i.output) {
      const pt = p.target, t = pt?.$p
      if (!t || ps.has(pt)) { continue }
      if (ns.has(t)) { s = true; return }
      const x = b ? t : i, y = b ? i : t
      mapset(to, x, y), mapset(from, y, x), ps.add(p, pt), f(t)
    }
  }, f = i => (ns.add(i), fi(i, 1), fi(i, 0))
  f(i); return [to, from]
}
$.execgraph = ([to, from]) => {
  const findfree = (k, v = from.get(k)) => { if (v) for (let i of v) if (!seen.has(i)) return i }
  const findtop = (k, n = findfree(k)) => n ? findtop(n) : k
  const seen = new Set, execute = (k, v = to.get(k) ?? new Set) => {
    seen.add(k), k.execute(); for (let i of v) { execute(findtop(i)) }
  }, fst = from.keys().next().value; fst ? execute(findtop(fst)) : 0
}

// create node ========================
$.nodetype = new Map(defaultnode.map(k => [k, dfno[k]]))

$.ncpanel = dom({ class: "node-create-panel" }, root)
$.ntinput = dom({ tag: "input", class: "codefont node-type-input" }, ncpanel)
$.ntlist = dom({ class: "node-type-list" }, ncpanel)

$.createnode = (id, k, x, y) => {
  const n = Cnode($, { id, type: k, root: nodediv })
  nodelist.add(id), nodes.set(id, n)
  x && y ? n.setpos(x, y) : 0; return n
}

$.iscnpshow = () => !!ncpanel.style.display
$.showcnp = (e, oncreate) => {
  ncpanel.style.display = "unset"
  style(ncpanel, { display: "unset", left: e.pageX - 10, top: e.pageY - 10 })
  const [x, y] = screen2coord(e.pageX - 100 * sx, e.pageY - 100 * sy)
  const c = (k, n = createnode(uuid(), k, x, y)) => (hidecnp(), oncreate?.(n))
  const f = k => dom({ class: "node-type-item", child: k, onclick: () => c(k) })
  ntlist.append(...[...$.nodetype.keys()].sort().map(f))
}
$.hidecnp = () => (ncpanel.style.display = "", ntlist.innerHTML = "", ntinput.value = "")
ncpanel.onpointerleave = hidecnp

// save & load ========================
$.nodes = new Map(), key = "7s2piqth3djutk1dqv4bci53e6875g7q"
$.save = idb.saveobj(key), $.nodelist = idb.saveset(key)
Promise.all([save.x, save.y, save.sx, save.sy]).then(([x, y, sx, sy]) => (
  x ? $.x = x : 0, y ? $.y = y : 0, sx ? $.sx = sx : 0, sy ? $.sy = sy : 0))
nodelist.all().then(a => a.map(([id]) => createnode(id)))