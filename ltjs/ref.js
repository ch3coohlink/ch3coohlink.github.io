defineleft("a")
defineleft("b")
defineleft("c")
defineleft("d")
defineleft("e")
defineup("env")
definedown("env")

$.fulltransport = true
$.process = () => {
  if (!$.env) { $.env = oneenv.newenv() }
  env.ref = { a, b, c, d, e }
}