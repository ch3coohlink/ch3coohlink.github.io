const inits = [], steps = []
$.step = (...a) => steps.push(a), $.init = (...a) => inits.push(a)

const elemap = new Map, commands = [], stepfunc = []
let s = 0, w = 0; $.wait = t => w += t
const setcommand = (i, e, o, t = w) => (
  (commands[i] ??= []).push([e, o, t]),
  (commands[i].elms ??= new Set).add(e))
$.trans = (t, l, ...a) => {
  const [s, e] = t(...a); if (!elemap.has(l)) { elemap.set(l, new Map) }
  const c = elemap.get(l); forin(s, (v, k) => {
    if (!c[k]) { c[k] = [] } const a = c[k]
    if (a.length === 0) {
      a.push([0, v]), setcommand(0, l, { [k]: v })
    } else if (a[a.length - 1][1] !== v) {
      panic(`incompatible style for property "${k}"` +
        ` with value: "${a[a.length - 1][1]}" and "${v}"`)
    }
  })
  forin(e, (v, k) => {
    if (!c[k]) { c[k] = [] } const a = c[k], p = a[a.length - 1]
    if (!p) { panic(`no start value set for property "${k}"`) }
    a.push([s, v]), setcommand(s, l, { [k]: v })
    forrg(p[0], i => setcommand(i, l, { [k]: v }, 0), s - 1)
  })
}

const groupby = (a, n) => maprg(Math.ceil(a.length / n), i => maprg(n, j => a[i * n + j]))
const exec = (f, r) => (new Function("$", `with($){return (${f})() }`)(r), r)
const smap = new Map; $.start = () => (
  s = 0, forof(inits, ([f, id]) => {
    if (!isfct(f)) { panic("expect argument function but got none ") }
    const s = exec(f, scope($)); if (id) { smap.set(id, s) } smap.set(s++, s)
  }),
  s = 0, forof(steps, a => {
    s++; let mw = 0
    forof(groupby(a, 2), ([f, id]) => {
      if (!f) { panic("expect argument function but got none ") }
      if (!isnum(id)) { panic("expect argument uuid but got none") }
      if (!smap.has(id)) { panic("no scope object found in uuid: " + id) }
      w = 0, exec(f, smap.get(id)), mw = Math.max(mw, w)
    })
    if (commands[s]) { commands[s].end = Math.max(commands[s].end ?? 0, mw + 1000) }
  }))

const pack = (n, [a, b] = n.split(" "), m = new WeakMap, d = new Set
  , r = $[a], c = $[b], rg = new FinalizationRegistry(d.delete.bind(d))) => (
  $[a] = (f, t) => (i => (rg.register(f, i), m.has(f)
    ? d.delete(m.get(f)) : 0, m.set(f, i), d.add(i), i))(r(f, t)),
  $[b] = i => (c(i), d.delete(i)), () => forof(d, $[b]))
const clear = pack("setTimeout clearTimeout")

const _exec = a => forof(a, ([e, o]) => style(e, o))
const _jump = async (s, e, wait = true) => {
  let i = s; for (const cd of commands.slice(s, e)) {
    forof(cd.elms, e => style(e, { transition: wait ? "all 1s" : "" })); const ts = new Map
    forof(cd, ([e, o, t]) => (ts.get(t) ?? (ts.set(t, []), ts.get(t))).push([e, o]))
    forof(ts, ([t, v]) => t === 0 ? _exec(v) : setTimeout(() => _exec(v), wait ? t : 0))
    wait ? await new Promise(r => setTimeout(r, cd.end ?? 0)) : 0
    // log(`step ${i++} end in ` + (wait ? (cd.end ?? 0) : 0) + "ms", cd)
  }
}
$.jump = async (o, i = o.i, back = false) => {
  o.i = i = Math.min(Math.max(i, 0), commands.length)
  if (back) {
    _jump(0, i + 1, false)
  } else {
    await _jump(0, i, false)
    setTimeout(() => _jump(i, i + 1), 20)
  }
}

const p = property; forof(Object.keys($),
  (k, v = $[k]) => (delete $[k], p($, k, { value: v })))