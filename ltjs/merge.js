defineup("a")
defineup("b")
defineup("c")
defineup("d")
defineup("e")
defineup("f")
defineup("g")
defineup("h")
defineup("i")
defineup("j")
definedown("env")

$.process = () => {
  "abcdefghij".split("").forEach(n => { $[n] ??= {} })
  const op = Object.getPrototypeOf({})
  const p = Object.getPrototypeOf(a)
  $.env = p && p !== op ? p : a
  $.env.ref = { a, b, c, d, e, f, g, h, i, j }
}