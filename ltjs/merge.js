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
  const list = [], seen = new Set
  "abcdefghij".split("").forEach(n => {
    $[n] ??= {}; const $$ = $[n].$$; if (!$$) { return }
    for (const i of $$.list) {
      if (!seen.has(i[0]?.id)) { list.push(i) }
    } $$.seen.forEach(i => seen.add(i))
  })
  list.push([])
  $.env = Object.assign(a, b, c, d, e, f, g, h, i, j)
  $.env.$$.list = list
  $.env.$$.seen = seen
}