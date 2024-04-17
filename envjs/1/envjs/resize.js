css(".resizer:hover", { background: "#00000066" })
css(".resizer", { transition: "background 0.3s", position: "absolute" })
css(".noflow", { position: "relative", overflow: "hidden", display: "flex" })

$.setusersize = us => ($.usersize = us, resize()), $.resize = () => {
  const [tx, ty] = $.usersize ?? [warp.clientWidth, warp.clientHeight]
  const [rx, ry] = [appdiv.clientWidth, appdiv.clientHeight]
  const scale = (x, [tl, rl] = x ? [tx, rx] : [ty, ry]) => rl / tl
  let x = tx >= ty, s = scale(x); (!x ? rx < tx * s : ry < ty * s)
    ? s = scale(x = !x) : 0; const t = (!x ? rx - tx * s : ry - ty * s) / 2
  style(sdbxdiv, { width: tx, height: ty, background: "white" })
  style(sdbxdiv, { transform: `translate${!x ? "X" : "Y"}(${t}px) scale(${s})` })
  style(sdbxdiv, { transformOrigin: "left top", position: "absolute" })
}; new ResizeObserver(resize).observe(appdiv)

const resizebar_width = 16, rbw = resizebar_width, pct = s => s * 100 + "%"
$.noselect = w => w.getSelection().removeAllRanges()
const toclose = (s, i, a = Infinity) => (s === 0 || s === 1 ? 0.5 : (forof([0, 0.5, 1]
  .map(v => [v, Math.abs(s - v)]), ([v, c]) => a > c ? (a = c, i = v) : 0), i))

{
  $.exerb = dom({ class: "resizer" }), appdiv.after(exerb)
  style(exerb, { width: "100%", height: rbw, cursor: "ns-resize", zIndex: "97" })
  $.rszexe = (s = exescale, t = (e = 2) => `calc(${pct(s)} - ${rbw / e}px)`) => (
    $.exescale = s, style(appdiv, { height: pct(s) }), style(allrb, { top: t(2 / ars) }),
    style(exerb, { top: t() }), style(dbgdiv, { height: pct(1 - s) }))
  const opd = adddrag(exerb,
    (e, w) => (noselect(w), rszexe(mn(mx(e.y, 0) / w.innerHeight, 1))),
    () => animate())
  exerb.onpointerdown = () => (animate(0), opd())
  exerb.ondblclick = () => rszexe(exescale === 0.5 ? 1 : toclose(exescale))
}

{
  $.edtrb = dom({ class: "resizer" }), edtdiv.after(edtrb)
  style(edtrb, { width: rbw, height: "100%", cursor: "ew-resize", zIndex: "98" })
  $.rszedt = (s = edtscale, l = (e = 2) => `calc(${pct(s)} - ${rbw / e}px)`) => (
    $.edtscale = s, style(edtdiv, { width: pct(s) }), style(allrb, { left: l(2 / ars) }),
    style(edtrb, { left: l() }), style(execdiv, { width: pct(1 - s) }))
  const opd = adddrag(edtrb,
    (e, w) => (noselect(w), rszedt(mn(mx(e.x, 0) / w.innerWidth, 1))),
    () => animate())
  edtrb.onpointerdown = () => (animate(0), opd())
  edtrb.ondblclick = () => rszedt(edtscale === 0.5 ? 0 : toclose(edtscale))
}

{
  $.allrb = dom({ class: "resizer" }), edtrb.after(allrb), $.ars = 1
  style(allrb, { width: rbw * ars, height: rbw * ars, cursor: "all-scroll", zIndex: "99" })
  const opd = adddrag(allrb,
    (e, w) => (noselect(w),
      rszedt(mn(mx(e.x, 0) / w.innerWidth, 1)), rszexe(mn(mx(e.y, 0) / w.innerHeight, 1))),
    () => animate())
  allrb.onpointerdown = () => (animate(0), opd())
  allrb.ondblclick = () => (edtrb.ondblclick(), exerb.ondblclick())
}

const on = { transition: "all 0.3s ease-in-out 0s" }, off = { transition: "" }
const animate = (b = 1, s = b ? on : off) => (
  style(edtdiv, s), style(execdiv, s), style(appdiv, s), style(dbgdiv, s))
rszedt(edtscale), rszexe(exescale), animate()