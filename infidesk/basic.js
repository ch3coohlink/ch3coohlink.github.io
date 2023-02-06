$.log = (...a) => (console.log(...a), a[a.length - 1])
$.assign = Object.assign
const obj = Object.create
$.inherit = (o, ...a) => assign(obj(o), ...a)
$.proto = Object.getPrototypeOf
$.deepcopy = structuredClone.bind(self)
$.hasown = (o, k) => o.hasOwnProperty(k)
$.getown = (o, k) => o.hasOwnProperty(k) ? o[k] : _
$.getset = (o, k, g, s) => Object.defineProperty(o, k, { get: g, set: s })
$.objproto = proto({})

$.array = (n, f) => [...Array(n).keys()].map(f)
$.asarr = v => isarr(v) ? v : [v]
$.isarr = Array.isArray
$.isnum = v => typeof v === "number"
$.isobj = o => typeof o === "object"
$.ishtml = e => e instanceof HTMLElement
$.ashtml = e => ishtml(e) ? e : e.relm
$.istarr = ArrayBuffer.isView

$.funcbody = f => f.toString()
  .replace(/^[^{]*{\s*/, "").replace(/\s*}[^}]*$/, "")

$.debounce = (f, t = 100, i) => (...a) =>
  (clearTimeout(i), i = setTimeout(() => f(...a), t))
$.throttle = (f, t = 100, i) => (...a) =>
  i ? 0 : (i = 1, f(...a), setTimeout(() => i = 0, t))

$.wait = t => new Promise(r => setTimeout(r, t))

if (self.document) {
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

let { imul } = Math, mb32 = a => t =>
  (a = a + 1831565813 | 0,
    t = imul(a ^ a >>> 15, 1 | a),
    t = t + imul(t ^ t >>> 7, 61 | t) ^ t,
    (t ^ t >>> 14) >>> 0) / 4294967296
let sfc32 = (a, b, c, d) => () => {
  a |= 0; b |= 0; c |= 0; d |= 0;
  let t = (a + b | 0) + d | 0;
  d = d + 1 | 0;
  a = b ^ b >>> 9;
  b = c + (c << 3) | 0;
  c = c << 21 | c >>> 11;
  c = c + t | 0;
  return (t >>> 0) / 4294967296;
}
$.genrd = seed => {
  let seedrd = mb32(seed)
  let rd = (a = 1, b) => (b ? 0 : (b = a, a = 0), seedrd() * (b - a) + a)
  let rdi = (a, b) => Math.ceil(rd(a, b))
  return [rd, rdi]
}

$.pnow = performance.now.bind(performance)
$.frame = (f, c = Infinity, st = pnow(), l) => (
  l = t => c-- > 0 ? (requestAnimationFrame(l), f(t - st)) : 0,
  requestAnimationFrame(l))

$.newwrk = (p, ...a) => {
  let w = new Worker("./worker.js", ...a), r
  const postMessage = w.postMessage.bind(w)
  postMessage(["init", p])
  w.addEventListener("message", async e => {
    const type = e.data.shift()
    if (type === "inited") { r(w) }
    else if (type === "call") {
      const [name, ...args] = e.data
      $[name](...args)
    } else if (type === "waitcall") {
      const [id, name, ...args] = e.data
      const r = await $[name](...args)
      postMessage(["waitcallfined", id, r])
    } else if (type === "waitcallfined") {
      const [id, r] = e.data
      cbs[id](r), delete cbs[id]
    }
  })
  w.call = (...a) => postMessage(["call", ...a])
  w.transfer = (t, ...a) => postMessage(["call", ...a], t)
  let callid = 0, cbs = {}; $.waitcall = (...a) => {
    let i = callid++; postMessage(["waitcall", i, ...a])
    return new Promise(r => cbs[i] = r)
  }
  return new Promise(v => r = v)
}