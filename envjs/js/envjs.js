const body = document.body; body.innerHTML = ""
const store = idb(assign(scope($), { name: "envjs" }))
css("body", { margin: 0 })

const trycatch = (t, c, f) => { try { t() } catch (e) { c?.(e) } finally { f?.() } }
const lh = 18, setth = t => style(t, { height: t.value.split(/\r?\n/).length * lh })
const editor = d => {
  let sdbx, r = dom({ style: { display: "flex" } })
  const onkeydown = e => e.key === "s" && e.ctrlKey ? (e.preventDefault(), upd())
    : e.key === "n" && e.altKey ? splice(d.i + 1, 0, { v: "" })
      : e.key === "w" && e.altKey ? splice(d.i, 1) : 0
  const upd = () => trycatch(() => (d.v = t.value, save(), refresh(),
    style(t, { color: "" })), () => style(t, { color: "red" }))
  const t = dom({ tag: "textarea", value: d.v, onkeydown })
  elm(t, { oninput: () => setth(t), spellcheck: false })
  style(t, { resize: "none", width: "calc(50% - 6px)", lineHeight: lh })
  style(t, { whiteSpace: "pre", overflow: "hidden" })
  const refresh = () => (sdbx?.destroy(), sdbx = sandbox(scope($)),
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