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

let oac = window.AudioContext, arr = []
$.clearoac = () => (arr.forEach(v => v.close()), arr = [])
$.AudioContext = function () { const r = new oac(); arr.push(r); return r }

$.newenv = () => {
  clearsto(), clearoac()
  return { ...sto, AudioContext }
}