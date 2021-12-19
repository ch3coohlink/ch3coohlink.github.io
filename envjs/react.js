$.g = proto($)

const rnd8 = () => Math.random().toString(16).slice(2, 10)
g.uuid = (a = rnd8(), b = rnd8()) => [rnd8(), a.slice(0, 4)
  , a.slice(4), b.slice(0, 4), b.slice(4) + rnd8()].join("-")

const dfrag = document.createDocumentFragment
g.dsplice = (p, i, c, ...n) => ((d = p.childNodes, rm = [], l = d.length
  , f = dfrag(), s = i < 0 ? l + i : i, e = isnum(c) ? s + c : l) => (
  forrg(e, () => d[s] ? rm.push(p.removeChild(d[s])) : 0, s),
  forof(n, e => f.appendChild(e)), p.insertBefore(f, d[s]), rm))()

g.mx = Math.max, g.mn = Math.min
const ap = proto([]), addid = v => {
  if (!isobj(v) && !isfct(v)) { v = { v } }
  if (!v[suid]) { v[suid] = uuid() } return v
}; class ReactArray extends Array {
  constructor(...a) { super(); this.push(...a) } splice(s, d, ...a) {
    const r = this.slice(s + d), dl = this.slice(s, s + d)
    this.length = s, this.push(...a, ...r); return dl
  } push(...a) { return ap.push.call(this, ...a.map(addid)) }
  slice(s = 0, e = this.length) { return maprg(mn(e, this.length), i => this[i], mx(s, 0)) }
} g.rarr = (...a) => new ReactArray(...a), g.suid = Symbol("uuid")

g.updarr = (data, elm, item, keeporder = true) => {
  const order = {}, worder = [], target = elm.childNodes, view = {}

  let quick = data.length === target.length
  forrg(data.length, (i, u = data[i][suid]) => u in order
    ? panic("duplicate uuid in data")
    : (order[u] = i, !quick ? 0 : target[i][suid] === u ? 0 : quick = false))

  if (quick) { return } forof(target, (e, u = e[suid]) => u in view
    ? panic("duplicate uuid in dom") : u in order ? view[u] = e : e.remove())

  if (data.length === target.length) { return } forrg(data.length,
    (i, d = data[i], u = d[suid], e) => u in view ? 0
      : (view[u] = e = item(d, i), e[suid] = u, dsplice(elm, i, 0, e)))

  if (keeporder) { // correct the order inside dom (optional)
    forrg(target.length, (i, e = target[i], o = order[e[suid]]) => o === i
      ? 0 : worder.push({ e, o })), forof(worder, ({ e }) => e.remove())
    forof(worder.sort(({ o: a }, { o: b }) => a - b), ({ e, o }) => dsplice(elm, o, 0, e))
  }
}