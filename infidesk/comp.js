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

const list = `texteditor showcase button complist dragpanel canvas
scrollpanel`.split(/\s+/)
await Promise.all(list.map(n => newcomp(n).then(f => $[n] = f)))