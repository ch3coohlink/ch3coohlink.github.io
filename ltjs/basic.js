$.isnum = o => typeof o == "number", $.isfct = o => typeof o == "function"
$.isstr = o => typeof o == "string", $.isbgi = o => typeof o == "bigint"
$.isudf = o => o === undefined, $.isnth = o => isudf(o) || isnul(o)
$.isobj = o => !!o && typeof o == "object", $.isnul = o => o === null
$.isarr = Array.isArray, $.asarr = v => isarr(v) ? v : [v]
$.isnumstr = s => isstr(s) && !isNaN(Number(s))

$.log = (...a) => (console.log(...a), a[a.length - 1])
$.panic = e => { throw e }
$.proto = Object.getPrototypeOf

$.uuid = (d = 32, r = 32) => [...crypto.getRandomValues(
  new Uint8Array(d))].map(v => (v % r).toString(r)).join("")

$.style = (e, ...ss) => { // 内联样式辅助函数
  for (const s of ss) {
    for (const k in s) {
      let v = s[k]; isnum(v) ? v = `${v}px` : 0
      if (e.style[k] !== v) { e.style[k] = v }
    }
  } return e
}

const elm = document.createElement.bind(document)
$.dom = (o = {}, p, n = o.tag ?? "div") => {
  const e = elm(n); for (const k in o) {
    const v = o[k]; switch (k) {
      case "class": e.className = v; break;
      case "child": e.append(...asarr(v)); break;
      case "style": style(e, ...asarr(v)); break;
      default: e[k] !== v ? e[k] = v : 0; break;
    }
  } if (p) { p.append(e) } return e
}

const csvg = n => document.createElementNS("http://www.w3.org/2000/svg", n)
$.svg = (n, o = {}, p, e = csvg(n)) => {
  for (const k in o) {
    const v = o[k]; switch (k) {
      case "class": e.classList.add(...v.split(" ")); break;
      case "child": e.append(...asarr(v)); break;
      case "style": style(e, ...asarr(v)); break;
      default: e.setAttribute(k, v); break;
    }
  } if (p) { p.append(e) } return e
}

$.cutheadtail = (a, b) => { // 这个函数用于找出数组开头和结尾相同的部分
  let al = a.length, bl = b.length, l = Math.min(al, bl), s = 0, e = al, t = bl, x, y
  for (; ; s++) { if (s >= l || a[s] !== b[s]) { break } }
  for (; ; e--, t--) { if ((x = e - 1) <= s || (y = t - 1) <= s || a[x] !== b[y]) { break } }
  return [s, e, t]
}

const d = () => { throw "duplication" }
$.simpdiff = (n, p, keeporder = true) => {
  let [s, e, t] = cutheadtail(n, p), o = new Map, r = new Set, w = []
  for (let i = s; i < e; i++) { let v = n[i]; o.has(v) ? d() : o.set(v, i) }
  for (let i = s; i < t; i++) { let v = p[i]; !o.has(v) ? w.unshift(i) : r.has(v) ? d() : r.add(v) }
  for (let i of w) { p.splice(i, 1) }
  for (let i = s; i < e; i++) { let v = n[i]; r.has(v) ? 0 : p.splice(i, 0, v) }
  if (keeporder) {
    w = []
    for (let i = s; i < e; i++) { let a = n[i], b = p[i]; a === b ? 0 : w.unshift([i, o.get(b), b]) }
    for (let [i] of w) { p.splice(i, 1) }
    w = w.sort(([, a], [, b]) => a - b)
    for (let [, i, v] of w) { p.splice(i, 0, v) }
  }
}

$.domarr = (e, d = e.childNodes) => { // 为了将上述函数用在dom元素上，再做一层包装
  const splice = (i, c, a) => c ? e.removeChild(d[i]) : e.insertBefore(a, d[i])
  return new Proxy({}, { get: (_, k) => k === "splice" ? splice : d[k] })
}

$.fitta = e => (e.style.height = "auto", e.style.height = e.scrollHeight + "px")
$.fitcvs = (c, r = window.devicePixelRatio) => (
  c.width = c.clientWidth * r, c.height = c.clientHeight * r)