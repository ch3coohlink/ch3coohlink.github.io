$.log = (...a) => (console.log(...a), a[a.length - 1])
$.assign = Object.assign, $.inherit = Object.create
$.proto = Object.getPrototypeOf
$.deepcopy = structuredClone.bind(window)
$.getown = (o, k) => o.hasOwnProperty(k) ? o[k] : _

$.asarr = v => isarr(v) ? v : [v]
$.isarr = Array.isArray
$.isnum = v => typeof v === "number"
$.isobj = o => typeof o === "object"
$.ishtml = e => e instanceof HTMLElement
$.ashtml = e => ishtml(e) ? e : e.relm

$.style = (e, ...ss) => {
  e = ashtml(e)
  for (const s of ss) {
    for (const k in s) {
      let v = s[k]; isnum(v) ? v = `${v}px` : 0
      if (e.style[k] !== v) { e.style[k] = v }
    }
  } return e
}

$.compappend = (e, ...a) => e.append(...a.map(v => !isobj(v) ?
  dom({ innerText: v }) : ishtml(v) ? v : v.relm ?? dom({ innerText: v })))

const elm = document.createElement.bind(document)
$.dom = (o = {}, p, n = o.tag ?? "div") => {
  const e = elm(n); for (const k in o) {
    const v = o[k]; switch (k) {
      case "class": e.className = v; break;
      case "child": compappend(e, ...asarr(v)); break;
      case "style": style(e, ...asarr(v)); break;
      default: e[k] !== v ? e[k] = v : 0; break;
    }
  } if (p) { p.append(e) } return e
}

$.uuid = (d = 32, r = 32) => [...crypto.getRandomValues(
  new Uint8Array(d))].map(v => (v % r).toString(r)).join("")

$.eventtarget = $ => {
  const eventdict = {}
  $.trigger = (k, ...a) => (eventdict[k] ?? []).forEach(f => f(...a))
  $.on = (k, f) => (eventdict[k] ??= new Set).add(f)
  $.cancel = (k, f) => (eventdict[k]?.delete(f),
    eventdict[k].size > 0 ? 0 : delete eventdict[k])
  return $
}