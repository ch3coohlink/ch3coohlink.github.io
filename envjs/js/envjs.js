const body = document.body; body.innerHTML = ""
const store = idb(assign(scope($), { name: "envjs" }))
css("body", { margin: 0 })
style(body, { paddingBottom: "90%" })

const fct2str = (f, s = String(f)) => {
  const t = s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"))
  const a = t.split(/\r?\n/); if (a[0] === "") a.shift()
  const n = a[0].match(/^[\s]+/)?.[0].length ?? 0
  return a.map(v => v.slice(n)).join("\r\n").trim()
}

const lh = 18, setth = t => style(t, { height: t.value.split(/\r?\n/).length * lh })
const editor = d => {
  let sdbx, r = dom({ style: { display: "flex" } }), onkeydown = e =>
    e.key === "s" && (e.ctrlKey || e.altKey) ? (e.preventDefault(), upd())
      : e.key === "n" && e.altKey ? splice(d.i + 1, 0, { v: "" })
        : e.key === "w" && e.altKey ? splice(d.i, 1) : 0
  const upd = () => trycatch(() => (d.v = t.value, save(), refresh(),
    style(t, { color: "" })), e => (style(t, { color: "red" }), panic(e)))
  const t = dom({ tag: "textarea", value: d.v, onkeydown })
  elm(t, { oninput: () => setth(t), spellcheck: false })
  style(t, { resize: "none", width: "calc(50% - 6px)", lineHeight: lh })
  style(t, { whiteSpace: "pre", overflow: "hidden", fontFamily: "consolas, courier" })
  const refresh = () => (sdbx?.destroy(), sdbx = sandbox(assign(scope($), { extra: { fct2str } })),
    r = elm(r, { child: [t, sdbx.document.documentElement], diff: true }),
    Function("$", `with($){\n${d.v}\n}`)(sdbx))
  setth(t), setTimeout(refresh), d.d = r; return d
}

$.save = () => store.set(gsl, data.map(({ v }) => ({ v })))
$.sync = () => elm(editors, { child: data.map(({ d }) => d), diff: true })
$.splice = (s, c, ...a) => (data.splice(s, c, ...a.map(editor)),
  data.length > 0 ? 0 : data.push(editor({ v: "" })),
  forrg(data.length, i => data[i].i = i), sync())
const gsl = "global-state-location"; store.get(gsl).then(v => (
  body.append($.editors = dom()), $.data = [], splice(0, 0, ...v ?? [])))