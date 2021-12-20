$.data ??= rarr() // rarr(...maprg(100, i => `(${i})`))
$.edtscale ??= 0.5, $.exescale ??= 0.5, $.focus ??= 0

{ // Dynamic DOM
  $.splice = (...a) => (data.splice(...a), updrepl())
  $.updrepl = () => schedule("updrepl", () => repleditor(data))
  let dcache; $.repleditor = (d, i) => {
    const e = $.edtdiv ??= dom({ class: "no-scroll-bar" }, warp)
    if (d.length === 0) { d.push("") }

    let c = dcache ?? [], s = 0, l = d.length
    for (; s < l; s++) { if (d[s] !== c[s]) break; } dcache = [...d]
    if (!(s === l && l === c.length)) { updarr(d, e, texteditor, false) } refresh(s)

    d.reduce((p, v) => (v.top = p) +
      (v.height = v.v.split(/\r?\n/).length * 16 + 2), 0)
    forrg(d.length, (i, v = d[i]) => texteditor(v, i))
    return style(e, { position: "relative", overflow: "auto" })
  }

  $.focusto = (i, d = data[i]) => !d ? 0 : d.ta.focus()
  $.texteditor = (d, i) => {
    d.i = i; if (!d.div) {
      const st = d.showst = dom({ class: "edt-button", style: { cursor: "move" } })
      let startdrag = adddrag(st, (e, w, top = d.top + e.y - sy) => (
        noselect(w), toi = hc.findIndex(n => n > top),
        toi === -1 ? toi = hc.length - 1 : 0, style(d.div, { top })),
        () => (splice(d.i, 1), splice(toi, 0, d))), hc, sx, sy, toi
      st.onpointerdown = e => (sx = e.x, sy = e.y,
        hc = data.map(d => d.top), style(d.div, { transition: "" }), startdrag())

      const ta = d.ta = dom({ tag: "textarea" })
      const oninput = _ => (d.v = ta.value, updrepl(), refresh(d.i))
      const onkeydown = e => e.key === "PageUp" ? focusto(d.i - 1)
        : e.key === "PageDown" ? focusto(d.i + 1) : 0
      elm(ta, { spellcheck: false, onfocus: _ => $.focus = d.i, oninput, onkeydown })

      d.div = dom({
        class: "texteditor", child: [st, ta,
          dom({ class: "edt-button", child: "⏬", onclick: () => runtill(d.i + 1) }),
          dom({ class: "edt-button", child: "🔄", onclick: () => to(() => d.i + 1)() }),
          dom({ class: "edt-button", child: "➕", onclick: () => splice(d.i + 1, 0, "") }),
          dom({ class: "edt-button", child: "✖", onclick: () => splice(d.i, 1) }),
        ]
      })
    }

    elm(d.ta, { value: d.v, style: { height: d.height } })
    style(d.div, { transition: "all 0.3s", top: d.top, zIndex: "" + d.i })
    if (d.state === undefined) { d.showst.innerText = "…" }
    else if (d.state === "ok") { d.showst.innerText = "✔" }
    else if (d.state === "runing") { d.showst.innerText = "⏳" }
    else if (d.state === "error") { d.showst.innerText = "❌" }
    else if (d.state === "syntax") { d.showst.innerText = "❓" }
    return d.div
  }
}

{ // Static DOM
  $.css = createcss($.shadow = root.attachShadow({ mode: "open" }))
  const emjft = "Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  css(".emoji-font", { fontFamily: emjft })
  css(".edt-button", { minWidth: 20, textAlign: "center", padding: "1px 0", cursor: "pointer" })
  const focuscolor = { background: "#00ff0020", outline: "none" }
  css("textarea:focus", focuscolor), css(".texteditor:hover", focuscolor)
  css(".texteditor", { userSelect: "none", lineHeight: 16, fontSize: 15 },
    { borderBottom: "", display: "flex", alignItems: "center" },
    { position: "absolute", width: "100%" })
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

  $.execdiv = dom({ class: "stripe-background noflow" })
  style(execdiv, { flexDirection: "column", backgroundColor: "#bbb" })
  $.appdiv = dom({}, execdiv), $.sdbxdiv = dom({}, appdiv)
  $.dbgdiv = dom({ class: "stripe-background-2" }, execdiv)
  style(appdiv, { position: "relative", overflow: "hidden" })
  style(dbgdiv, { position: "relative", overflow: "auto" })

  await envjs_exec({}, 0, $)

  $.warp = dom({ style: { height: "100%", touchAction: "none" } }, shadow)
  elm(warp, { class: "emoji-font noflow", child: execdiv })
  execdiv.before(repleditor(data))

  await envjs_resize({}, 0, $)

  return warp
}