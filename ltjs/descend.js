defineup("env")
definedown("env")

$.process = () => {
  if (!$.env) { $.env = oneenv.newenv() }
  const e = env, p = proto(env)
  if (p !== proto({})) { $.env = p, env.ref = e, p.$$ = e.$$ }
  const $$ = env.$$; $$.list.push([])
}