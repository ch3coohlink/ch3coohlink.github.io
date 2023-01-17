await loadsym("./basic.js")

const cssst = new CSSStyleSheet()
gettext("./common.css").then(t => cssst.replace(t))
document.adoptedStyleSheets.push(cssst)

$.compbase = await require("./compbase.js")
$.newcomp = async name => {
  const [f, s] = await Promise.all([
    require(`./component/${name}.js`), gettext(`./component/${name}.css`)])
  const styst = new CSSStyleSheet(); styst.replace(s)
  const def = { cssst, styst, name }, r = o => {
    const r = f(_, _, compbase($, { def, ...o })); with (r) {
      if (r.child) { append(...asarr(child)) }
    } return r
  }; r.def = def; return r
}

$.initprop = ($, prop, get, set, deft = "", v = $[prop] ?? deft) =>
  (Object.defineProperty($, prop, { get, set }), $[prop] = v)

const list = "texteditor showcase button complist dragpanel".split(" ")
await Promise.all(list.map(n => newcomp(n).then(f => $[n] = f)))

$.newidb = await require("./idb.js")
$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
await save.init

const setscroll = (i = 0) => {
  window.scrollTo(0, save.scrollY ??= 0)
  if (window.scrollY !== save.scrollY && i < 10)
    setTimeout(() => setscroll(i + 1), 1)
}; setTimeout(setscroll)

const body = document.body
compappend(body, $.stexp = showcase())
addEventListener("scroll", () => save.scrollY = window.scrollY)

style($.fsdiv = dom({}, body),
  { position: "fixed", width: "100vw", height: "100vh" },
  { top: 0, left: 0, pointerEvents: "none", zIndex: "1000" }
)

stexp.append("basic component: drag panel",
  dragpanel())