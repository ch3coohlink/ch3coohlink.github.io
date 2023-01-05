// drag flag | drag item | focus item | drag offset x/y
$.df = $.di = $.fi = null, $.dx = 0, $.dy = 0
// temp connection | tc element | current event
$.tc = $.tce = $.ce = null

$.cnablestyle = "#00ff00 0px 0px 20px"
$.unablestyle = "#ff0000 0px 0px 20px"
$.delstyle = "#ff0000 0px 0px 40px"

$.nodediv = dom({ class: "full-panel drag-panel" }, root)
$.svgdoc = svg("svg", { class: "full-panel svg-panel" }, root)

$.screen2coord = (a, b, rb = nodediv.getBoundingClientRect(),
  w = rb.width / 2, h = rb.height / 2, { sx, sy, x, y } = save) =>
  [(a + w - w / sx) / sx - x, (b + h - h / sy) / sy - y]

requestAnimationFrame($.loop = () => {
  requestAnimationFrame(loop); const { sx, sy, x, y } = save
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
$.clearfocus = () => fi ? (fi.elm.classList.remove("focus"), $.fi = null) : 0
$.tolast = i => (nodediv.lastChild.after(i.elm),
  clearfocus(), $.fi = i, fi.elm.classList.add("focus"))
$.setdrag = (i, e) => ($.di = i,
  $.dx = e.offsetX, $.dy = e.offsetY,
  style(i.elm, { pointerEvents: "none", zIndex: "101" }))
$.ispanel = e => e.target === nodediv || e.target === root

$.csfp/*click start from panel*/ = false, $.ismoved = false, $.msb = -1
addEventListener("pointerdown", (e, p = ispanel(e)) => {
  $.msb = e.button; if (msb === 1) { e.preventDefault() }
  if (p) { $.df = $.csfp = true, clearfocus() }
  if (tc && tc.button !== e.target) { leaveconnect() }
})
addEventListener("pointerup", (e, p = ispanel(e)) => {
  if (p && csfp && msb === 2) { showcnp(e) }
  di ? di.elm.style.pointerEvents = "" : 0, $.msb = -1
  $.df = $.di = null, $.csfp = $.ismoved = $.spcf = false
})
addEventListener("pointermove", e => {
  if (!ismoved && csfp) { $.ismoved = true } $.ce = e
  if (df && (msb === 1 || (msb === 0 && e.shiftKey)))
    (save.x += e.movementX / save.sx, save.y += e.movementY / save.sy)
})
const { min, max } = Math, smin = 1 / 5, smax = 3
addEventListener("wheel", (e, p = ispanel(e), s = save.sx + e.deltaY * -0.001) =>
  p ? (save.sx = save.sy = min(max(s, smin), smax)) : 0)

addEventListener("error", e => {

})

// keyboard ===========================
addEventListener("keydown", e => {
  const k = e.key, lk = k.toLowerCase()
  if (k === "Alt") { e.preventDefault() }
  if (lk === "w" && e.ctrlKey) { e.preventDefault() }
  if (k === "Delete") { fi ? removenode(fi) : 0 }
  if (lk === "e" && e.ctrlKey) {
    e.preventDefault(), fi ? execgraph(...getgraph(fi)) : 0
  }
})

// connection =========================
$.styleconnect = t => {
  if (!t) { return } let { a, b, elm } = t
  const ab = a.button.getBoundingClientRect(), bb = b.button.getBoundingClientRect()
  const [bx, by] = screen2coord(ab.x + ab.width / 2, ab.y + ab.height / 2)
  const [ax, ay] = screen2coord(bb.x + bb.width / 2, bb.y + bb.height / 2)
  elm.setAttribute("d", `M ${ax} ${ay} L ${bx} ${by}`)
}
$.isinput = a => a.type === "left" || a.type === "up"
$.sub_connable = (a, b) => (a.type === "left" ||
  a.type === "right") && (b.type === "up" || b.type === "down")
$.connectable = (a, b) => {
  if (a.type === b.type) { return false }
  if (sub_connable(a, b) || sub_connable(b, a)) { return false }
  if (a.target || b.target) { return false }
  if (proto(a) === proto(b)) { return false } return true
}
$.conseli = p => [p.$p.save.id, p.type, p.id]
$.condsel = ([nid, type, pid]) => nodes.get(nid)[type][pid]
$.makeconnect = (a, b, id = uuid(), skipsave = false) => {
  if (!connectable(a, b)) { return } if (isinput(a)) { [a, b] = [b, a] }
  const elm = svg("path", {}, svgdoc), conn = { id, elm, a, b }
  b.target = a.target = conn, styleconnect(conn)
  skipsave ? 0 : connlist[id] = [a, b].map(conseli)
}
$.breakconnect = t => t ? (delete connlist[t.id],
  t.elm.remove(), t.b.target = t.a.target = null) : 0
$.enterconnect = (i, e, elm = svg("path", {}, svgdoc)) =>
  ($.tc = i, $.ce = e, $.tce = elm)
$.leaveconnect = () => ($.tc = null, tce.remove(), $.tce = null)

// execution ==========================
const mapset = (m, k, v) => { if (!m.has(k)) m.set(k, new Set); m.get(k).add(v) }
$.getgraph = i => {
  const ns = new Set, ps = new Set, to = new Map, from = new Map
  const full = "up down left right".split(" ")
  const vert = "up down".split(" "), horz = "left right".split(" ")
  const inpt = "up left".split(" "), otpt = "down right".split(" ")
  const f = (i, type) => {
    for (const p of i[type]) {
      let pt = p.target, { a, b } = pt ?? {}; if (!pt || ps.has(pt)) continue
      a = a.$p, b = b.$p; if (from.has(b) && from.get(b).has(a)) { ps.add(pt); continue }
      mapset(to, a, b), mapset(from, b, a), ps.add(pt); const t = p.getother().$p;
      if (t.user.fulltransport) { ff(t), t.execvert = t.exechorz = true }
      else if (t.user.onewayoutput && (type === "left" || type === "up")) {
        fi(t), t.execvert = t.exechorz = true
      } else if (type === "up" || type === "down") { fv(t), t.execvert = true }
      else if (type === "left" || type === "right") { fh(t), t.exechorz = true }
    }
  }, [ff, fv, fh, fi, fo] = [full, vert, horz, inpt, otpt]
    .map(n => i => (ns.has(i) ? 0 : (i.execvert = i.exechorz = false),
      ns.add(i), n.forEach(t => f(i, t))))
  const color = new Map, dfs = (n, c) => {
    color.set(n, 1); if (to.has(n)) for (const t of to.get(n)) (c = color.get(t),
      c === 1 ? panic("cyclic!") : c !== -1 ? dfs(t) : 0); color.set(n, -1)
  }, isacylic = () => { for (const n of ns) if (color.get(n) !== -1) dfs(n) }
  try { ff(i), i.execvert = i.exechorz = true, isacylic() }
  catch (e) { faillight(ns); throw e; } return [ns.keys().next().value, to, from]
}
$.faillight = ns => (ns.forEach(n => n.elm.classList.add("failed")),
  setTimeout(() => ns.forEach(n => n.elm.classList.remove("failed")), 1000))
$.execlight = (t = 0, s = 30) => k => (
  setTimeout(() => k.elm.classList.add("executing"), t),
  setTimeout(() => k.elm.classList.remove("executing"), t + 500), t += s)
$.execgraph = async (fst, to, from) => {
  const findfree = (k, v = from.get(k)) => {
    if (v) for (let i of v) if (!seen.has(i)) return i
  }, findtop = (k, n = findfree(k)) => n ? findtop(n) : k, l = execlight()
  const seen = new Set, queue = [], q = (k, v = to.get(k) ?? new Set) => {
    if (seen.has(k)) { return } queue.push(k), seen.add(k)
    for (let i of v) { q(findtop(i)) }
  }; fst ? q(findtop(fst)) : 0
  for (const n of queue) { l(n), await n.execute() }
}

// node management ====================
$.nodetype = new Map(defaultnode.map(k => [k, dfno[k]]))

$.ncpanel = dom({ class: "node-create-panel" }, root)
$.ntinput = dom({ tag: "input", class: "codefont node-type-input" }, ncpanel)
$.ntlist = dom({ class: "node-type-list" }, ncpanel)

$.createnode = save => {
  const n = Cnode($, { save, root: nodediv })
  nodelist[save.id] = 1, nodes.set(save.id, n)
  return n
}
$.removenode = (i, k = i.save.id) => (
  delete nodelist[k], nodes.delete(k), i.remove())

$.iscnpshow = () => !!ncpanel.style.display
$.showcnp = (e, oncreate) => {
  ncpanel.style.display = "unset"
  style(ncpanel, { display: "unset", left: e.pageX - 10, top: e.pageY - 10 })
  const [x, y] = screen2coord(e.pageX - 100 * save.sx, e.pageY - 100 * save.sy)
  const c = (k, s = idb.saveobj(uuid()), n = (s.type = k,
    s.x = x, s.y = y, createnode(s))) => (hidecnp(), oncreate?.(n))
  const f = k => dom({ class: "node-type-item", child: k, onclick: () => c(k) })
  ntlist.append(...[...$.nodetype.keys()].sort().map(f))
}
$.hidecnp = () => (ncpanel.style.display = "", ntlist.innerHTML = "", ntinput.value = "")
ncpanel.onpointerleave = hidecnp

// save & load ========================
$.nodes = new Map(), $.key = "7s2piqth3djutk1dqv4bci53e6875g7q"
$.save = idb.saveobj(key), $.nodelist = idb.saveobj("list/" + key)
$.connfrom = new Map, connto = new Map
$.connlist = idb.saveobj("connection/" + key)

Promise.all([save, nodelist, connlist].map(v => v.init)).then(() => {
  save.x ??= 0, save.y ??= 0, save.sx ??= 1, save.sy ??= 1
  $.temp_nodes = Object.keys(nodelist).map(id => idb.saveobj(id))
  return Promise.all(temp_nodes.map(v => v.init))
}).then(() => {
  temp_nodes.forEach(createnode)
  Object.keys(connlist).forEach(k => {
    try {
      let [a, b] = connlist[k].map(condsel)
      makeconnect(a, b, k, true)
    } catch (e) {
      delete connlist[k]
      console.error(e)
    }
  })
})