$.isnum = o => typeof o == "number", $.isfct = o => typeof o == "function"
$.isstr = o => typeof o == "string", $.isbgi = o => typeof o == "bigint"
$.isudf = o => o === undefined, $.isnth = o => isudf(o) || isnul(o)
$.isobj = o => o && typeof o == "object", $.isnul = o => o === null
$.isarr = Array.isArray, $.asarr = v => isarr(v) ? v : [v]
$.isnumstr = s => isstr(s) && !isNaN(Number(s))

$.forrg = (e, f, s = 0, d = 1) => { for (let i = s; d > 0 ? i < e : i > e; i += d) f(i) }
$.maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
$.forin = (o, f) => { for (const k in o) f(o[k], k) }
$.forof = (o, f) => { for (const v of o) f(v) }
$.cases = (h, ...t) => ((m, d) => (c, ...a) => m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
$.panic = e => { throw isstr(e) ? Error(e) : e }

$.proto = Object.getPrototypeOf, $.property = Object.defineProperty
$.assign = Object.assign, $.create = Object.create
$.deletep = (o, s = "") => (forof(s.split(" "), k => delete o[k]), o)
$.extract = (o, s = "", r = {}) => (forof(s.split(" "), k => r[k] = o[k]), r)
$.exclude = (o, s) => deletep({ ...o }, s)
$.scope = (o, e = create(o)) => property(e, "$", { value: e })

brwspec($), $.body = document.body, body.innerHTML = ""

$.locale = navigator.languages, $.sundaystart = true
$.getweekname = i => new Date(2017, 0, i + (sundaystart ? 1 : 2))
  .toLocaleDateString(locale, { weekday: 'short' })
$.getmonthname = i => new Date(2000, i).toLocaleString(locale, { month: "short" })

const { floor } = Math
$.week = {}, (sundaystart ? "sun mon tue wed thu fri sat"
  : "mon tue wed thu fri sat sun").split(" ").forEach((v, i) => week[v] = i)
$.dayname = d => new Date(d).toLocaleDateString("en-US", { weekday: "short" })
$.yearstart = y => week[dayname(new Date(y, 0, 1)).toLowerCase()]
$.isleapyear = y => y % 4 != 0 ? false : y % 100 != 0 || y % 400 == 0
$.dayofyear = y => isleapyear(y) ? 366 : 365
$.oneday = 1000 * 60 * 60 * 24, $.timediff = (e, s) =>
  (e - s) + ((s.getTimezoneOffset() - e.getTimezoneOffset()) * 60 * 1000)
$.dayinyear = (e = new Date()) => floor(timediff(
  e, new Date(e.getFullYear(), 0, 0)) / oneday) - 1

const iw = 16, ih = iw, im = 2, cw = 52 * im + 53 * iw, ch = 6 * im + 7 * ih
const wk = w => w * (im + iw), da = d => d * (im + ih)
const item = d => {
  const i = d.i + sw, w = floor(i / 7), day = i % 7, r = dom({ class: "sample" })
  style(r, { display: "flex", alignItems: "center", justifyContent: "center", cursor: "none" })
  r.onpointerenter = () => (r.textContent = new Date(ny, 0, d.i + 1).getDate(),
    style(r, { zIndex: "1000", width: 2 * iw, height: 2 * ih },
      { left: wk(w) - iw / 2, top: da(day) - ih / 2 }))
  r.onpointerleave = () => (r.textContent = "",
    style(r, { zIndex: "", width: "", height: "", left: wk(w), top: da(day) }))
  r.onclick = () => (d.data = current_paint, save(),
    style(r, { backgroundColor: lgdata[current_paint] }))
  style(r, { left: wk(w), top: da(day), backgroundColor: lgdata[d.data] })
  return (d.e = r, d)
}
const monthlabel = i => {
  const r = dom({ child: getmonthname(i) }), w = floor((dayinyear(new Date(ny, i, 1)) + sw) / 7)
  style(r, { position: "absolute", top: -20, left: wk(w) })
  return r
}
const weeklabel = i => {
  const r = dom({ child: getweekname(i) })
  style(r, { position: "absolute", left: -30, top: da(i) })
  return r
}

let current_paint = "画了"
const lm = 150
const lgdata = { "画了": "#51b051", "摸鱼": "#d0e69f", "没画": "white" }
const legend = l => dom({
  style: [{ display: "flex", alignItems: "center", margin: 5 },
  { justifyContent: "flex-end", position: "relative" }],
  child: [
    dom({
      class: "sample", style: { right: lm + 4, backgroundColor: lgdata[l], cursor: "pointer" },
      onclick: () => current_paint = l
    }),
    dom({ child: l, style: { width: lm, textAlign: "left" } })
  ]
})

$.store = idb({ name: "drawrecord" })
const throttle = (f, t, l = 0, n) => (...a) =>
  (n = performance.now(), n - l >= t ? (l = n, f(...a)) : void 0)
const debounce = (f, t, tid) => (...a) =>
  (tid ? clearTimeout(tid) : 0, tid = setTimeout(() => f(...a), t))
const save = debounce(() => store.set(ny, data.map((v, i) => ({ i, data: v.data }))), 100)

css("input", { all: "initial", fontWeight: "100", textAlign: "center" })
css(".sample", { position: "absolute", width: iw, height: ih, border: "3px solid #0000001f" },
  { borderRadius: 6, backgroundColor: "white", boxSizing: "border-box" })
const layout = async () => {
  elm(body, { child: $.ctn = dom({ child: [$.tdiv = dom(), $.calendar = dom(), $.sdiv = dom()] }) })
  style(body, { color: "#24292f", height: "100vh", margin: 0, fontWeight: "100" })
  style(body, { display: "flex", flexDirection: "column", alignItems: "center" })
  style(ctn, { minWidth: 1000, maxWidth: 1200, paddingTop: 100 })

  $.ny = new Date().getFullYear(), $.ds = dayofyear(ny), $.sw = yearstart(ny)
  const t = await store.get("title") ?? "2022我画了没？（点我改标题）"
  const a = await store.get("author") ?? "点我改名字"
  const d = await store.get(ny) ?? maprg(ds, i => ({ i, data: "没画" }))
  $.data = d.map(item)

  $.title = dom({ tag: "input", value: t, spellcheck: false })
  $.author = dom({ tag: "input", value: a, spellcheck: false })
  const sth = dom({ tag: "p", child: ["作者：", author] })
  elm(tdiv, { child: [title, sth] })
  style(sth, { textAlign: "right", marginRight: 60 })
  style(title, { margin: "40px 0", width: "100%", fontSize: "3em" })
  style(author, { borderBottom: "0.5px solid", width: 100 })
  title.onchange = () => store.set("title", title.value)
  author.onchange = () => store.set("author", author.value)

  style(calendar, { width: cw, height: ch, userSelect: "none" })
  style(calendar, { position: "relative", margin: 40, marginBottom: 20 })
  style(calendar, { fontSize: 9, fontWeight: "100" })

  elm(calendar, { child: data.map(d => d.e) })
  elm(calendar, { child: maprg(12, monthlabel) })
  elm(calendar, { child: [1, 3, 5].map(weeklabel) })

  elm(sdiv, {
    style: { fontSize: 14, textAlign: "right" },
    child: "画了 摸鱼 没画".split(" ").map(legend)
  })
}
layout()