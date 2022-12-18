defineinput("src", "text")

$.sandbox = dom({ class: "sandbox-root" }, root)

$.sto = {}, $.clearsto = () => _csto.forEach(f => f())
const createsto = (n, o, [a, b] = n.split(" ")) => {
  const d = new Set, r = window[a].bind(window), c = window[b].bind(window)
  o[a] = a === "setInterval" ? (f, t) => { const i = r(f, t); d.add(i); return i } :
    (f, t) => { const i = r((...a) => (d.delete(i), f(...a)), t); d.add(i); return i }
  const cm = i => (d.delete(i), c(i)); o[b] = cm; return () => (d.forEach(c), d.clear())
}, _csto = ("requestIdleCallback cancelIdleCallback, "
  + "requestAnimationFrame cancelAnimationFrame, " +
  "setTimeout clearTimeout, setInterval clearInterval"
).split(", ").map(n => createsto(n, sto))

$.logpanel = dom({ class: "sandbox-logpanel" }, root)

$.process = () => {
  isarr(src) ? $.src = src.join("\n\n") : 0
  sandbox.innerHTML = "", clearsto()
  tofunc(src ?? "")(undefined, undefined, { root: sandbox, ...sto })
}