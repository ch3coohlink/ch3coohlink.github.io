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
  $.env = Object.assign(a, b, c, d, e, f, g, h, i, j)
}