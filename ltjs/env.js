$.sto = {}, $.clearsto = () => _csto.forEach(f => f())
const createsto = (n, o, [a, b] = n.split(" ")) => {
  const d = new Set, r = window[a].bind(window), c = window[b].bind(window)
  o[a] = a === "setInterval" ? (f, t) => { const i = r(f, t); d.add(i); return i } :
    (f, t) => { const i = r((...a) => (d.delete(i), f(...a)), t); d.add(i); return i }
  const cm = i => (d.delete(i), c(i)); o[b] = cm; return () => (d.forEach(c), d.clear())
}, _csto = ("requestIdleCallback cancelIdleCallback, "
  + "requestAnimationFrame cancelAnimationFrame, " +
  "setTimeout clearTimeout, setInterval clearInterval"
).split(", ").map(n => createsto(n, sto))

$.clearctor = () => { cca.forEach(f => f()) }
const cca = [], ctorf = (f, c, a = []) => (cca.push(() => (a.forEach(c), a = [])),
  function (...a) { let r = new f(...a); a.push(r); return r })
const ctora = [["AudioContext", v => v.close()], ["Worker", v => v.terminate()]]
const ctoro = {}; for (const [n, f] of ctora) { ctoro[n] = ctorf(window[n], f) }

$.clear = () => { clearsto(), clearctor() }
$.newenv = () => (clear(), { ...sto, ...ctoro, $$: { list: [[]], seen: new Set } })