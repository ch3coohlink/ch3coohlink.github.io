const body = document.body; body.innerHTML = ""
const store = idb(assign(scope($), { name: "envjs" }))
css("body", { margin: 0 })

const editor = d => {
  let sdbx, r = dom({ style: { display: "flex" } })
  const onkeydown = e => e.key === "s" && e.ctrlKey ? (e.preventDefault(), upd())
    : e.key === "n" && e.altKey ? (e.preventDefault(), splice(d.i + 1, 0, { v: "" }))
      : e.key === "w" && e.altKey ? (e.preventDefault(), splice(d.i, 1)) : 0
  const upd = () => (d.v = t.value, save(), refresh())
  const t = dom({ tag: "textarea", value: d.v, onkeydown, spellcheck: false })
  style(t, { resize: "vertical", width: "50%" })
  const refresh = () => (sdbx?.destroy(), sdbx = sandbox(scope($)),
    r = elm(r, { child: [t, sdbx.document.documentElement], diff: true }),
    Function("$", `with($){\n${d.v}\n}`)(sdbx))
  setTimeout(refresh); d.d = r; return d
}

const gsl = "global-state-location"
$.save = () => store.set(gsl, data.map(({ v }) => ({ v })))
$.sync = () => elm(editors, { child: data.map(({ d }) => d), diff: true })
$.splice = (s, c, ...a) => (data.splice(s, c, ...a.map(editor)),
  forrg(data.length, i => data[i].i = i), sync())
store.get(gsl).then(v => (body.append($.editors = dom()), $.data = [],
  (v ??= []).length > 0 ? 0 : v.push({ v: "" }), splice(0, 0, ...v)))