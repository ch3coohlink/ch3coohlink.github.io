const $ = {}
with ($) {
  $._ = undefined, $.self = globalThis
  $.AsyncFunction = (async () => { }).constructor
  $.tofunc = (s, a) => new (a ? AsyncFunction : Function)("__PROTO__",
    "__APPEND__", "$ = Object.assign(Object.create(__PROTO__), __APPEND__)",
    "with($) {\n" + s + "\n} return $")
  $.gettext = async p => (await fetch(p)).text()
  $.require = (p, a = false) => gettext(p)
    .then(t => tofunc(t + `\n//# sourceURL=${p}`, a))
  $.loadsym = (p, e = $) => require(p, true).then(f => f(_, _, e))

  addEventListener("message", e => {
    const [type, path, ...data] = e.data
    if (type === "init") {
      loadsym(path).then(a => postMessage("inited"))
    } else if (type === "call") {
      $[path](...data)
    }
  })
}