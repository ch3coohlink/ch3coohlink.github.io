defineinput("src", "text")
defineoutput("env", "obj")

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

dom({ class: "border" }, root)
$.logpanel = dom({ class: "sandbox-logpanel" }, root)
logpanel.onpointerdown = e => e.stopPropagation()
const elimhead = (e = logpanel, n = 1000) => [...e.childNodes]
  .slice(0, e.childNodes.length - n).forEach(e.removeChild.bind(e))
const tolast = (e = logpanel) => bottom ? e.scrollTop = e.scrollHeight : 0
const { log, error } = console; $.console = { ...console }
console.log = (...a) => (log(...a),
  logpanel.append(dom({ child: a.join(" ") })), elimhead(), tolast())
console.error = (...a) => (error(...a), logpanel.append(dom(
  { class: "error-message", child: a.map(v => v?.stack ?? v) })), elimhead(), tolast())

let { min, max } = Math, bottom = false
logpanel.addEventListener("wheel", (e, s = logpanel.scrollTop + e.deltaY) => (
  bottom = s + logpanel.clientHeight >= logpanel.scrollHeight,
  logpanel.scrollTop = min(max(s, 0), logpanel.scrollHeight), e.preventDefault()))

$._tofunc = (s, i) => new Function("__PROTO__", "__APPEND__",
  "$ = Object.assign(Object.create(__PROTO__), __APPEND__)",
  "with($) {\n" + s + "\n} return $" + (i ? `\n//# sourceURL=${i}.js` : ""))

$.process = () => {
  isarr(src) ? $.src = src.map(t => `{\n${t}\n}`).join(" ") : 0
  logpanel.innerHTML = sandbox.innerHTML = "", clearsto()
  $.src = (src ?? "") + `\n//# sourceURL=${id}.js`
  $.env = { root: sandbox, ...sto, console, tofunc: _tofunc }
  try { $.env = tofunc(src ?? "")(0, 0, env) }
  catch (e) { console.error(e); throw e }
}