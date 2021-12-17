$.data ??= rarr(...maprg(100, i => i + "\n" + i))
$.edtscale ??= 0.5, $.exescale ??= 0.5
$.focus = 0
$.view = {}

$.repleditor = d => {
  const e = $.edtdiv ??= dom({}, warp)
  if (d.length === 0) { d.push("") }
  updarr(d, view, e, texteditor, false)
  d.reduce((p, v) => (v.top = p) +
    (v.height = v.v.split(/\r?\n/).length * 16 + 2), 0)
  forrg(d.length, (i, v = d[i]) => texteditor(v, i))
  return style(e, { position: "relative", overflow: "auto" })
}

$.texteditor = (d, i) => {
  const e = view[d[suid]] ?? dom({}, null, "textarea")
  style(e, { top: d.top, zIndex: "" + i, height: d.height })
  d.oninput ??= _ => (d.v = e.value, schedule(() => repleditor(data)))
  d.onfocus ??= _ => $.focus = e.i
  elm(e, extract(d, "onfocus oninput"))
  return elm(e, { spellcheck: false, value: d.v, i })
}

$.css = createcss($.shadow = root.attachShadow({ mode: "open" }))
css("textarea:focus, textarea:hover", { background: "#00ff0020", outline: "none" })
css("textarea", { display: "block", boxSizing: "border-box" },
  { margin: 0, border: 0, padding: 0, width: "100%", resize: "none" },
  { background: "#00000000", overflow: "hidden", whiteSpace: "pre" },
  { lineHeight: 16, fontSize: 15, fontFamily: "consolas, courier new, monospace" })
css(".no-scroll-bar::-webkit-scrollbar", { display: "none" })
css(".no-scroll-bar", { MsOverflowStyle: "none", scrollbarWidth: "none" })
css(".stripe-background", { backgroundImage: `linear-gradient(-45deg, #ffffff33 25%, #00000000 25%, #00000000 50%, #ffffff33 50%, #ffffff33 75%, #00000000 75%, #00000000)`, backgroundColor: "#bbb", backgroundSize: "20px 20px" })
css(".stripe-background-2", { backgroundImage: `linear-gradient(45deg, #ffffff33 25%, #00000000 25%, #00000000 50%, #ffffff33 50%, #ffffff33 75%, #00000000 75%, #00000000)`, backgroundSize: "20px 20px" })
css(".resizer:hover", { background: "#00000066" })
css(".resizer", { transition: "background 0.3s", position: "absolute" })
css(".noflow", { position: "relative", overflow: "hidden", display: "flex" })

$.warp = dom({ class: "noflow", style: { height: "100%", touchAction: "none" } }, shadow)
$.edtdiv = repleditor(data), $.execdiv = dom({ class: "stripe-background noflow" }, warp)
style(execdiv, { flexDirection: "column" })
$.appdiv = dom({}, execdiv), $.sdbxdiv = dom({}, appdiv)
$.dbgdiv = dom({ class: "stripe-background-2" }, execdiv)
style(appdiv, { height: "50%", position: "relative", overflow: "hidden" })
style(dbgdiv, { height: "50%", position: "relative", overflow: "auto" })

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

const resizebar_width = 17.5, rbw = resizebar_width, pct = s => s * 100 + "%"
const noselect = w => w.getSelection().removeAllRanges()
const toclose = (s, i, a = Infinity) => (s === 0 || s === 1 ? 0.5 : (forof([0, 0.5, 1]
  .map(v => [v, Math.abs(s - v)]), ([v, c]) => a > c ? (a = c, i = v) : 0), i))

$.edtrb = dom({ class: "resizer" }), edtdiv.after(edtrb)
style(edtrb, { width: rbw, height: "100%", cursor: "col-resize", zIndex: "98" })
$.rszedt = (s = edtscale, l = (e = 2) => `calc(${pct(s)} - ${rbw / e}px)`) => (
  $.edtscale = s, style(edtdiv, { width: pct(s) }), style(allrb, { left: l(2 / ars) }),
  style(edtrb, { left: l() }), style(execdiv, { width: pct(1 - s) }))
edtrb.onpointerdown = adddrag(edtrb, (e, w) => (noselect(w), rszedt(mn(mx(e.x, 0) / w.innerWidth, 1))))
edtrb.ondblclick = () => rszedt(edtscale === 0.5 ? 0 : toclose(edtscale))

$.exerb = dom({ class: "resizer" }), appdiv.after(exerb)
style(exerb, { width: "100%", height: rbw, cursor: "row-resize", zIndex: "97" })
$.rszexe = (s = exescale, t = (e = 2) => `calc(${pct(s)} - ${rbw / e}px)`) => (
  $.exescale = s, style(appdiv, { height: pct(s) }), style(allrb, { top: t(2 / ars) }),
  style(exerb, { top: t() }), style(dbgdiv, { height: pct(1 - s) }))
exerb.onpointerdown = adddrag(exerb, (e, w) => (noselect(w), rszexe(mn(mx(e.y, 0) / w.innerHeight, 1))))
exerb.ondblclick = () => rszexe(exescale === 0.5 ? 1 : toclose(exescale))

$.allrb = dom({ class: "resizer" }), edtrb.after(allrb), $.ars = 2
style(allrb, { width: rbw * ars, height: rbw * ars, cursor: "all-scroll", zIndex: "99" })
allrb.onpointerdown = adddrag(allrb, (e, w) => (noselect(w),
  rszedt(mn(mx(e.x, 0) / w.innerWidth, 1)), rszexe(mn(mx(e.y, 0) / w.innerHeight, 1))))
allrb.ondblclick = () => (edtrb.ondblclick(), exerb.ondblclick())

const _tstyle = { transition: "all 0.3s ease-in-out 0s" }
style(edtdiv, _tstyle), style(execdiv, _tstyle)
style(appdiv, _tstyle), style(dbgdiv, _tstyle)

rszedt(edtscale), rszexe(exescale)
$.sdbx = await sandbox({ root: sdbxdiv }, proto($))