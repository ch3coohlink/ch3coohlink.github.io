$.g = Object.getPrototypeOf($)

const dfrag = document.createDocumentFragment
g.dsplice = (p, i, c, ...n) => ((d = p.childNodes, rm = [], l = d.length
  , f = dfrag(), s = i < 0 ? l + i : i, e = isnum(c) ? s + c : l) => (
  forrg(e, () => d[s] ? rm.push(p.removeChild(d[s])) : 0, s),
  forof(n, e => f.appendChild(e)), p.insertBefore(f, d[s]), rm))()

const ap = Object.getPrototypeOf([]), mx = Math.max, mn = Math.min, addid = v => {
  if (!isobj(v) && !isfct(v)) { v = { v } }
  if (!v[suid]) { v[suid] = uuid() } return v
}; class ReactArray extends Array {
  constructor(...a) { super(); this.push(...a) } splice(s, d, ...a) {
    const r = this.slice(s + d), dl = this.slice(s, s + d)
    this.length = s, this.push(...a, ...r); return dl
  } push(...a) { return ap.push.call(this, ...a.map(addid)) }
  slice(s = 0, e = this.length) { return maprg(mn(e, this.length), i => this[i], mx(s, 0)) }
} g.rarr = (...a) => new ReactArray(...a), g.suid = Symbol("uuid")

g.updarr = (darr, viewdom, item, keeporder = true) => {
  const view = viewdom.childNodes, order = {}, elms = {}, worder = []
  forrg(darr.length, (i, u = darr[i][suid]) => u in order
    ? panic("duplicate uuid in react array") : order[u] = i)
  forof(view, (e, u = e[suid]) => u in order ? elms[u] = e : e.remove())
  forrg(darr.length, (i, d = darr[i], u = d[suid]) => {
    if (!(u in elms)) {
      const e = item(d, i); elms[u] = e
      e[suid] = u, e.index = i
      dsplice(viewdom, i, 0, e)
    } else { elms[u].index = i }
  })

  if (keeporder) { // correct the order inside dom (optional)
    forrg(view.length, (i, e = view[i], o = order[e[suid]]) =>
      o === i ? 0 : worder.push({ e, o }))
    forof(worder, ({ e }) => e.remove())
    forof(worder.sort(({ o: a }, { o: b }) => a - b),
      ({ e, o }) => dsplice(viewdom, o, 0, e))
  } return elms
}