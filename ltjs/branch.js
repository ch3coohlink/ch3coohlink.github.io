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
  const $$ = env.$$; $$.list.push([])
  $.a = { ...env, $$: structuredClone($$) }
  $.b = { ...env, $$: structuredClone($$) }
  $.c = { ...env, $$: structuredClone($$) }
  $.d = { ...env, $$: structuredClone($$) }
  $.e = { ...env, $$: structuredClone($$) }
  $.f = { ...env, $$: structuredClone($$) }
  $.g = { ...env, $$: structuredClone($$) }
  $.h = { ...env, $$: structuredClone($$) }
  $.i = { ...env, $$: structuredClone($$) }
  $.j = { ...env, $$: structuredClone($$) }
}