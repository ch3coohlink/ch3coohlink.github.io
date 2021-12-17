$.data ??= rarr(...maprg(100, i => `log(${i})`))
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
  const e = view[d[suid]] ?? dom({}, 0, "textarea")
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
const sz = 20, ac = "#ffffff33", bc = "#00000000", stp = d => "linear-gradient(" +
  `${d}deg, ${ac} 25%, ${bc} 25%, ${bc} 50%, ${ac} 50%, ${ac} 75%, ${bc} 75%, ${bc})`
css(".stripe-background", { backgroundImage: stp(45), backgroundSize: `${sz}px ${sz}px` })
css(".stripe-background-2", { backgroundImage: stp(-45), backgroundSize: `${sz}px ${sz}px` })

$.warp = dom({ class: "noflow", style: { height: "100%", touchAction: "none" } }, shadow)
$.edtdiv = repleditor(data), $.execdiv = dom({ class: "stripe-background noflow" }, warp)
style(execdiv, { flexDirection: "column", backgroundColor: "#bbb" })
$.appdiv = dom({}, execdiv), $.sdbxdiv = dom({}, appdiv)
$.dbgdiv = dom({ class: "stripe-background-2" }, execdiv)
style(appdiv, { position: "relative", overflow: "hidden" })
style(dbgdiv, { position: "relative", overflow: "auto" })

await envjs_resize({}, 0, $)

$.step = async (i = execat, d = data[i]) => {
  if (!d) return false; try { await gencode(d.v)(sdbx)() }
  catch (e) { log(e); return false } $.execat++; return true
}, $.stepback = async (i = execat - 1) => (refresh(), await runtill(i))
$.runtill = async i => { while (execat < i && await step()); }
$.refresh = async () => ($.sdbx?.destroy?.(), $.execat = 0,
  $.sdbx = await sandbox({ root: sdbxdiv }, proto($))), await refresh()

style(dbgdiv, { userSelect: "none" })
css(".button", { display: "inline", margin: 5, padding: 10, background: "white", borderRadius: 10 })
dom({ child: "⏮", onclick: () => refresh(), class: "button" }, dbgdiv)
dom({ child: "◀", onclick: () => stepback(), class: "button" }, dbgdiv)
dom({ child: "▶", onclick: () => step(), class: "button" }, dbgdiv)
dom({ child: "⏭", onclick: () => stepback(Infinity), class: "button" }, dbgdiv)