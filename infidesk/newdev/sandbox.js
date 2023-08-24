{
  let timeout_functions = `requestIdleCallback cancelIdleCallback,
    requestAnimationFrame cancelAnimationFrame,
    setTimeout clearTimeout, setInterval clearInterval`.split(",")
    .map(s => s.split(/\s+/).filter(v => v))
  let constructors = {
    AudioContext: v => v.close(),
    Worker: v => v.terminate(),
  }

  $.sandbox = (parent) => {
    let gen_timeout = () => {
      for (const [set, clear] of timeout_functions) {
        let cbs = new Set; cbss[clear] = cbs
        const sf = window[set].bind(window)
        const cf = window[clear].bind(window)
        $[set] = set === "setInterval"
          ? (f, t) => { const i = sf(f, t); cbs.add(i); return i }
          : (f, t) => {
            const i = sf(() => (cbs.delete(i), f()), t)
            cbs.add(i); return i
          }
        $[clear] = i => (cbs.delete(i), cf(i))
      }
    }
    let gen_constructor = () => {
      for (const k in constructors) {
        let cf = window[k], a = cos[k] = []
        $[k] = function (...v) {
          let r = new WeakRef(new cf(...v))
          a.push(r); return r
        }
      }
    }
    let exec = (code) => {
      $.root = dom({ style: { width: "100%", height: "100%" } }, shadow)
      const f = new Function("$", `with($) {\n${code}\n}`); f($)
    }
    let stop = () => {
      if ($.root) { $.root.remove() }
      for (const k in cbss) { cbss[k].forEach($[k]); cbss[k].clear() }
      for (const k in cos) {
        const f = constructors[k]
        cos[k].forEach(r => (r = r.deref(), r ? f(r) : 0))
        cos[k] = []
      }
    }
    // call back set s // contructed object s
    let $ = {}, cbss = {}, cos = {}
    let shadow = parent.attachShadow({ mode: "open" })
    gen_timeout(), gen_constructor()
    return { $, exec, stop }
  }
}