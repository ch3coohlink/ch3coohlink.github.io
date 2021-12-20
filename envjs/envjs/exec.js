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

style(dbgdiv, { userSelect: "none" })
css(".button", { display: "inline", margin: 5, padding: 10, borderRadius: 10 })
css(".button", { background: "white", cursor: "pointer" })
dom({ child: "⏮", onclick: () => refresh(), class: "button" }, dbgdiv)
dom({ child: "⏪", onclick: () => toback(), class: "button" }, dbgdiv)
dom({ child: "🔁", onclick: () => tocurr(), class: "button" }, dbgdiv)
dom({ child: "⏩", onclick: () => step(), class: "button" }, dbgdiv)
dom({ child: "⏬", onclick: () => runtill(Infinity), class: "button" }, dbgdiv)
dom({ child: "⏭", onclick: () => toend(), class: "button" }, dbgdiv)

dom({ child: "📝", onclick: () => { }, class: "button" }, dbgdiv)
dom({ child: "📂", onclick: () => { }, class: "button" }, dbgdiv)
dom({ child: "💾", onclick: () => { }, class: "button" }, dbgdiv)