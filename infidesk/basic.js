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

// 凑合用吧，这个函数没有完整的parser是搞不定的
$.funcbody = (f, s = f.toString()) =>
  s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"))

$.fwith = (f, n, s = funcbody(f)) => (n ??= hash(s).toString(16),
  new (f instanceof AsyncFunction ? AsyncFunction : Function)
    ("__P__", "__A__", "$ = Object.assign(Object.create(__P__), __A__)",
      "with($) {\n" + `//# sourceURL=${n}.js\n` + s + "\n} return $"))

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
        case "child": e.append(...asarr(v)); break;
        case "style": style(e, ...asarr(v)); break;
        default: e[k] !== v ? e[k] = v : 0; break;
      }
    } if (p) { p.append(e) } return e
  }

  $.body = document.body
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
$.genrd = seed => {
  let { log, cos, sqrt, ceil, PI } = Math, seedrd = mb32(seed)
  let rd = (a = 1, b) => (b ? 0 : (b = a, a = 0), seedrd() * (b - a) + a)
  let rdi = (a, b) => ceil(rd(a, b))
  let gaussian = (mean = 0, stdev = 1) => {
    let u = 1 - rd(), v = rd()
    let z = sqrt(-2.0 * log(u)) * cos(2.0 * PI * v)
    return z * stdev + mean
  }// Standard Normal variate using Box-Muller transform
  return [rd, rdi, gaussian]
}

$.hash = (s, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch, l = s.length; i < l; i++) (ch = s.charCodeAt(i),
    h1 = imul(h1 ^ ch, 2654435761), h2 = imul(h2 ^ ch, 1597334677))
  h1 = imul(h1 ^ (h1 >>> 16), 2246822507) ^ imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = imul(h2 ^ (h2 >>> 16), 2246822507) ^ imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
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