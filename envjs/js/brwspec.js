$.log = console.log, $.clear = console.clear, bindall(document)

const cutht = (a, b) => {
  let al = a.length, bl = b.length, l = Math.min(al, bl), s = 0, e = al, t = bl, x, y
  for (; ; s++) { if (s >= l || a[s] !== b[s]) break } for (; ; e--, t--) {
    if ((x = e - 1) <= s || (y = t - 1) <= s || a[x] !== b[y]) break
  } return [s, e, t]
}
const sdiff = (n, p, ko = true) => {
  let [s, e, t] = cutht(n, p), o = new Map, r = new Set, d = () => panic("duplication")
  forrg(e, (i, v = n[i]) => o.has(v) ? d() : o.set(v, i), s); let w = []
  forrg(t, (i, v = p[i]) => !o.has(v) ? w.unshift(i) : r.has(v) ? d() : r.add(v), s)
  forof(w, i => p.splice(i, 1)), forrg(e, (i, v = n[i]) => r.has(v) ? 0 : p.splice(i, 0, v), s)
  ko ? (w = [], forrg(e, (i, a = n[i], b = p[i]) => a === b ? 0 : w.unshift([i, o.get(b), b]), s),
    forof(w, ([i]) => p.splice(i, 1)), w = w.sort(([, a], [, b]) => a - b),
    forof(w, ([, i, v]) => p.splice(i, 0, v))) : 0
}
const domarr = (e, d = e.childNodes, f =
  (i, c, a) => c ? e.removeChild(d[i]) : e.insertBefore(a, d[i])
) => new Proxy({}, { get: (_, k) => k === "splice" ? f : d[k] })

const text = document.createTextNode, celm = {}, cns = document.createElementNS
const csvg = n => cns("http://www.w3.org/2000/svg", n), dm = () => { }
const asda = v => asarr(v).map(v => isstr(v) ? text(v) : v)
const attr = [["class", (e, v) => e.className = isarr(v) ? v.join(" ") : v],
["child", (e, v, _, o) => o.diff ? sdiff(asda(v), domarr(e), o.keeporder) : e.append(...asda(v))],
["style", (e, v) => style(e, ...asarr(v))], ..."diff keeporder tag".split(" ").map(v => [v, dm])]
const htmlattr = cases((e, v, k) => e[k] === v ? 0 : e[k] = v, ...attr)
const svgattr = cases((e, v, k) => e.setAttributeNS(null, k, v), ...attr)

$.style = (e, ...s) => (forof(s, s => forin(s, (v, k, n = isnum(v) ? `${v}px` : v) =>
  k === "height" ? (e.style.height = "", e.style.height = n)
    : e.style[k] === n ? 0 : e.style[k] = n)), e) // ⬆ dirty hack for height property
$.elm = (e, o = {}, f, a) => (isstr(e) ? e = _elm(e) : 0, a = e instanceof SVGElement
  ? svgattr : htmlattr, forin(o, (v, k) => a(k, e, v, k, o)), f ? f(e) : 0, e)
$.dom = (o = {}, p, n = o.tag ?? "div") => elm(n, o, p ? p.append.bind(p) : 0)

forof(`a script style title`.split(" "), v => celm[v] = document.createElement)
forof(`abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark marquee menu meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp section select slot small source span strong sub summary sup table tbody td template textarea tfoot th thead time tr track u ul var video wbr`.split(" "), v => celm[v] = document.createElement)
forof(`animate animateMotion animateTransform circle clipPath defs desc ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter foreignObject g image line linearGradient marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop svg switch symbol text textPath tspan use view`.split(" "), v => celm[v] = csvg)
const crte = (n, o, f = n => panic(`tag "${n}" is not valid`)) => n in o ? o[n](n) : f(n)
const _elm = (n, [s, t] = n.split("/")) => !t ?
  crte(n, celm, n => crte(n, ctag)) : s === "svg" ? csvg(t) : crte(n, ctag)
const ctag = {}; dom.register = (n, f) => ctag[n] = f, celm["text", text]

$.swaptag = (t, o, n = dom({ tag: t })) => (
  o.before(n), n.append(...o.childNodes), o.remove(), n)

const hyph = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
const px = v => isnum(v) ? `${v}px` : v, rule = s => Object.keys(s)
  .reduce((p, k) => p + `${hyph(k)}: ${px(s[k])}; `, "")
$.createcss = e => (e = (e.tagName === "STYLE" ? e : dom({}, e, "style")),
  (r, ...s) => e.sheet.insertRule(`${r} { ${s.map(v => rule(v)).join(" ")}}`))
$.css = createcss(document.head)

const dfrag = document.createDocumentFragment
$.dsplice = (p, i, c, ...n) => ((d = p.childNodes, rm = [], l = d.length
  , f = dfrag(), s = i < 0 ? l + i : i, e = isnum(c) ? s + c : l) => (
  forrg(e, () => d[s] ? rm.push(p.removeChild(d[s])) : 0, s),
  forof(n, e => f.appendChild(e)), p.insertBefore(f, d[s]), rm))()

let i = 1, task = {}, pfx = `setNow$${Math.random()}$`
addEventListener("message", ({ data }) => isstr(data) &&
  data.startsWith(pfx) ? run(data.slice(pfx.length)) : 0, false)
const run = i => { try { task[i]?.() } finally { delete task[i] } }
$.setNow = f => (task[i] = f, postMessage(pfx + i, "*"), i++)
$.clearNow = i => delete task[i]

// Due to implementation restriction
// SpeechRecognition should be created only once
let osr = $.SpeechRecognition ?? $.webkitSpeechRecognition, sr
$.initspeech2text = () => sr ??= (sr = new osr(),
  addEventListener("beforeunload", () => sr.stop()), sr)