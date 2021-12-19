$.data ??= rarr(...maprg(100, i => `(${i})`))
$.edtscale ??= 0.5, $.exescale ??= 0.5, $.focus ??= 0

{ // Execution model
  const te = (d, i) => schedule("steprepl" + i, () => texteditor(d, i))
  $.step = async (i = execat, d = data[i]) => {
    if (!d) { return false } try {
      d.state = "running", te(d, i)
      await gencode(d.v)(sdbx)()
      d.state = "ok", $.execat++
    } catch (e) {
      console.error(e)
      if (e.name === "SyntaxError") { d.state = "syntax" }
      else { d.state = "error" } return false
    } finally { te(d, i) } return true
  }

  $.to = f => async (i = f()) => (refresh(-1), await runtill(i))
  $.runtill = async i => { while ($.execat < i && await step()); }
  $.refresh = async i => $.execat <= i ? 0 : (
    $.sdbx?.destroy?.(), $.execat = 0, forof(data, d => delete d.state),
    schedule("refresh", () => repleditor(data)), $.sdbx =
    await sandbox({ root: sdbxdiv }, proto($)))
  const bk = () => execat - 1, cr = () => execat, ed = () => Infinity
  $.toback = to(bk), $.tocurr = to(cr), $.toend = to(ed)
}

{ // UI Declaration
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
      const st = d.showst = dom({ class: "edt-button" })
      style(st, { cursor: "move", alignSelf: "flex-start" })
      let startdrag = adddrag(st, (e, w, top = d.top + e.y - sy) => (
        noselect(w), toi = hc.findIndex(n => n > top),
        toi === -1 ? toi = hc.length - 1 : 0, style(dv, { top })),
        () => (splice(d.i, 1), splice(toi, 0, d))), hc, sx, sy, toi
      st.onpointerdown = e => (sx = e.x, sy = e.y,
        hc = data.map(d => d.top), style(dv, { transition: "" }), startdrag())

      const up = dom({ class: "edt-button", child: "⬆", style: { alignSelf: "flex-start" } })
      elm(up, { onclick: () => splice(mx(d.i - 1, 0), 0, "") })
      const rm = dom({ class: "edt-button", child: "✖", onclick: () => splice(d.i, 1) })
      const ct = dom({ class: "edt-button", child: "⏬", onclick: () => runtill(d.i + 1) })
      const rf = dom({ class: "edt-button", child: "🔄", onclick: () => to(() => d.i + 1)() })
      const dw = dom({ class: "edt-button", child: "⬇", style: { alignSelf: "flex-end" } })
      elm(dw, { onclick: () => splice(d.i + 1, 0, "") })

      const ta = d.ta = dom({ tag: "textarea" })
      const oninput = _ => (d.v = ta.value, updrepl(), refresh(d.i))
      const onkeydown = e => e.key === "PageUp" ? focusto(d.i - 1)
        : e.key === "PageDown" ? focusto(d.i + 1) : 0
      elm(ta, { onfocus: _ => $.focus = d.i, oninput, onkeydown })

      const dv = d.div = dom({ class: "texteditor" })
      style(dv, { userSelect: "none", lineHeight: 16, fontSize: 15 })
      style(dv, { borderBottom: "", display: "flex", alignItems: "center" })
      elm(dv, { child: [st, ta, rm, ct, rf, dw, up] })
    }

    elm(d.ta, { spellcheck: false, value: d.v, style: { height: d.height } })
    style(d.div, { transition: "all 0.3s" })
    style(d.div, { position: "absolute", width: "100%" })
    style(d.div, { top: d.top, zIndex: "" + d.i })
    if (d.state === undefined) { d.showst.innerText = "⭕" }
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

  $.warp = dom({ style: { height: "100%", touchAction: "none" } }, shadow)
  elm(warp, { class: "emoji-font noflow", child: execdiv })
  execdiv.before(repleditor(data))
}

await envjs_resize({}, 0, $)
await envjs_exec({}, 0, $)