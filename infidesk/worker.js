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

  addEventListener("message", async e => {
    const type = e.data.shift()
    if (type === "init") {
      const [path] = e.data
      await loadsym(path)
      postMessage(["inited"])
    } else if (type === "call") {
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

  $.call = (...a) => postMessage(["call", ...a])
  $.transfer = (t, ...a) => postMessage(["call", ...a], t)
  let callid = 0, cbs = {}; $.waitcall = (...a) => {
    let i = callid++; postMessage(["waitcall", i, ...a])
    return new Promise(r => cbs[i] = r)
  }
}