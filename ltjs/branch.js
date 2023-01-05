defineup("env")
definedown("a")
definedown("b")
definedown("c")
definedown("d")
definedown("e")
definedown("f")
definedown("g")
definedown("h")
definedown("i")
definedown("j")

$.process = () => {
  if (!$.env) { $.env = oneenv.newenv() }
  $.a = { ...env }
  $.b = { ...env }
  $.c = { ...env }
  $.d = { ...env }
  $.e = { ...env }
  $.f = { ...env }
  $.g = { ...env }
  $.h = { ...env }
  $.i = { ...env }
  $.j = { ...env }
}