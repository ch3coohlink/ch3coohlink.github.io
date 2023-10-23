let AsyncFunction = (async () => { }).constructor
{
  let timeout_functions = `requestIdleCallback cancelIdleCallback,
    requestAnimationFrame cancelAnimationFrame,
    setTimeout clearTimeout, setInterval clearInterval`.split(",")
    .map(s => s.split(/\s+/).filter(v => v))
  let constructors = {
    AudioContext: v => v.close(),
    Worker: v => v.terminate(),
  }

  $.sandbox = (parent, $g = window) => {
    let start = async (extra = {}) => {
      let root = dom({}, shadow)
      style(root, { width: "100%", height: "100%", overflow: "auto" })
      let gen_timeout = () => {
        for (const [set, clear] of timeout_functions) {
          let cbs = new Set; cbss[clear] = cbs
          const sf = $g[set].bind($g)
          const cf = $g[clear].bind($g)
          $[set] = set === "setInterval"
            ? (f, t) => { const i = sf(f, t); cbs.add(i); return i }
            : (f, t) => {
              const i = sf(t => (cbs.delete(i), f(t)), t)
              cbs.add(i); return i
            }
          $[clear] = i => (cbs.delete(i), cf(i))
        }
      }
      let gen_constructor = () => {
        for (const k in constructors) {
          let cf = $g[k], a = cos[k] = []
          $[k] = function (...v) {
            const o = new cf(...v)
            let r = new WeakRef(o)
            a.push(r); return r
          }
        }
      }
      let clear = async () => {
        await o.onclose?.()
        root.remove()
        for (const k in cbss) { cbss[k].forEach($[k]) }
        // for (const k in cos) {
        //   const f = constructors[k]
        //   cos[k].forEach(r => (r = r.deref(), r ? f(r) : 0))
        // }
      }
      let exec = async (code) => await new AsyncFunction("$", `with($) {\n${code}\n}`)(o)
      let $ = {}, cbss = {}, cos = {}
      gen_timeout()
      // gen_constructor()
      let o = { root, ...$, ...extra }
      return { clear, exec }
    }
    let shadow = parent.attachShadow({ mode: "open" })
    return { start }
  }
}