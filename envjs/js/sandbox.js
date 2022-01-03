// This is by no mean a secure sandbox.

// dom element
const warp = dom({}, root), shadow = warp.attachShadow({ mode: "open" })
style(warp, { height: "100%", width: "100%", position: "relative", overflow: "auto" })
const html = dom({ lang: "en" }, shadow, "html"), head = dom({}, html, "head")
const css = createcss(dom({}, head, "style")), body = dom({}, html, "body")
css("html", { all: "initial", width: "100%", position: "absolute" })

// everything that not gc should be concerned
// (so maybe add URL.createObjectURL etc...)
const pack = (n, [a, b] = n.split(" "), m = new WeakMap, d = new Set
  , r = $[a], c = $[b], rg = new FinalizationRegistry(d.delete.bind(d))) => (
  $[a] = (f, t) => (i => (rg.register(f, i), m.has(f)
    ? d.delete(m.get(f)) : 0, m.set(f, i), d.add(i), i))(r(f, t)),
  $[b] = i => (c(i), d.delete(i)), () => forof(d, $[b]))
const clr = [pack("requestIdleCallback cancelIdleCallback"), pack("setTimeout clearTimeout")
  , pack("requestAnimationFrame cancelAnimationFrame"), pack("setInterval clearInterval")]

// dispatch all window event
const eventname = `onsearch onappinstalled onbeforeinstallprompt onbeforexrselect onabort onblur oncancel oncanplay oncanplaythrough onchange onclick onclose oncontextmenu oncuechange ondblclick ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onmousewheel onpause onplay onplaying onprogress onratechange onreset onresize onscroll onseeked onseeking onselect onstalled onsubmit onsuspend ontimeupdate ontoggle onvolumechange onwaiting onwebkitanimationend onwebkitanimationiteration onwebkitanimationstart onwebkittransitionend onwheel onauxclick ongotpointercapture onlostpointercapture onpointerdown onpointermove onpointerup onpointercancel onpointerover onpointerout onpointerenter onpointerleave onselectstart onselectionchange onanimationend onanimationiteration onanimationstart ontransitionrun ontransitionstart ontransitionend ontransitioncancel onafterprint onbeforeprint onbeforeunload onhashchange onlanguagechange onmessage onmessageerror onoffline ononline onpagehide onpageshow onpopstate onrejectionhandled onstorage onunhandledrejection onunload ondevicemotion ondeviceorientation ondeviceorientationabsolute onpointerrawupdate`.split(/\s/).map(v => v.slice(2))
const ls = {}, ds = {}, d = t => e => (w["on" + t]?.(e), forof(ls[t] ?? [], f => f(e)))
const oa = addEventListener; forof(eventname, t => oa(t, ds[t] = d(t)))
$.addEventListener = (t, l) => (t in ls ? ls[t] : ls[t] = new Set).add(l)
$.removeEventListener = (t, l) => ls[t]?.delete(l)

// clear everything inside sandbox
const destroy = () => (warp.remove(), forof(clr, f => f()),
  forin(ds, (v, k) => removeEventListener(k, v)))

// extension function: schedule
let m = new Map, f = (t, o = m) => (requestAnimationFrame(f), m = new Map, forof(
  o, async ([_, { f, s, j }]) => { try { await f(t) } catch (e) { j(e) } s() })); f()
const schedule = (u, f, o = { f }) => (m.set(u, o), new Promise((s, j) => (o.s = s, o.j = j)))

// extension function: drag
const ns = w => w.getSelection().removeAllRanges()
const dragm = new Map, deldrag = f => dragm.delete(f)
const adddrag = (o, { down: d, move: m, up: u, noselect: n = true } = {}) => (
  dragm.set(o, { b: false, m, u, n }), e => (dragm.get(o).b = true, d?.(e)))
addEventListener("pointermove", e => forof(dragm,
  ([_, { b, m, n }], w = e.view.window) => (n ? ns(w) : 0, b ? m?.(e, w) : 0)))
addEventListener("pointerup", e => forof(dragm,
  ([_, v], { b, u } = v) => b ? (v.b = false, u?.(e, e.view.window)) : 0))

// warp a window interface
const w = {}, _ = new Proxy(w, { get: (t, k) => k in t ? t[k] : $[k] })
forof("$ window globalThis self".split(" "), n => property(w, n, { value: _ }))
const get = (t, k) => k === "documentElement" ? html : k === "body" ? body : t[k]
assign(w, { document: new Proxy(document, { get }), destroy, css })
assign(w, { setInterval, clearInterval, setTimeout, clearTimeout })
assign(w, { requestAnimationFrame, cancelAnimationFrame })
assign(w, { requestIdleCallback, cancelIdleCallback })
assign(w, { addEventListener, removeEventListener })
assign(w, { schedule, adddrag, deldrag })

assign(w, { isnum, isstr, isudf, isobj, isfct, isbgi })
assign(w, { isnth, isnul, asarr, isarr, isnumstr })
assign(w, { forrg, maprg, forin, forof, cases, panic })
assign(w, { proto, property, assign, deletep, create, extract, exclude, scope })
assign(w, { log, clear, dom, elm, style, createcss, dsplice })

return _