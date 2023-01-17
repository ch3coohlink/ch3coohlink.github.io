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
  const p = proto(env), $$ = env.$$; $$.list.push([])
  const { assign: a, create: c } = Object
  $.a = a(c(p), env, { $$: structuredClone($$) })
  $.b = a(c(p), env, { $$: structuredClone($$) })
  $.c = a(c(p), env, { $$: structuredClone($$) })
  $.d = a(c(p), env, { $$: structuredClone($$) })
  $.e = a(c(p), env, { $$: structuredClone($$) })
  $.f = a(c(p), env, { $$: structuredClone($$) })
  $.g = a(c(p), env, { $$: structuredClone($$) })
  $.h = a(c(p), env, { $$: structuredClone($$) })
  $.i = a(c(p), env, { $$: structuredClone($$) })
  $.j = a(c(p), env, { $$: structuredClone($$) })
}