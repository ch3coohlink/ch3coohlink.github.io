await loadsym("./basic.js")

const cssst = new CSSStyleSheet()
gettext("./common.css").then(t => cssst.replace(t))

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

stexp.append("basic component: text editor",
  texteditor({ label: "test-label" }))
stexp.append("basic component: button",
  dom({
    class: "grid-bg",
    style: { padding: 5 },
    child: [button()
      , button({ text: "text too long ".repeat(10) })]
  }))
stexp.append("basic component: component list",
  dom({
    class: "grid-bg",
    style: { padding: 5 },
    child: [complist({
      direction: "horizontal-reverse", child: [
        texteditor({
          label: "special text editor with background",
          value: "this text editor has white background ".repeat(10)
        }),
        ..."↻◰⇱⊞⊠⩩".split("").map(n => button({ text: n }))],
      specsty: `.list>* { width: 70px; }
        .texteditor { background: white; width: 200px; }`
    })]
  }))
stexp.append("basic component: drag panel",
  style(dragpanel(), { height: 500 }))