$.elm = dom({ class: "movable item" }, root)
$.onresize = new Set; new ResizeObserver(() => onresize.forEach(f => f())).observe(elm)

$.upbar = dom({ class: "nodebar up" }, elm)
$.content = dom({ class: "content" }, elm)
$.downbar = dom({ class: "nodebar down" }, elm)
$.leftbar = dom({ class: "nodebar" }, content)
$.userspace = dom({ class: "userspace" }, content)
$.rightbar = dom({ class: "nodebar right" }, content)

elm.addEventListener("pointerdown", () => tolast($))
elm.addEventListener("pointerenter", () => elm.style.zIndex = "100")
elm.addEventListener("pointerleave", () => di !== $ ? elm.style.zIndex = "" : 0)
upbar.addEventListener("pointerdown", e => e.target === upbar ? setdrag($, e) : 0)

$.up = [], $.down = [], $.left = [], $.right = []
const sc = p => styleconnect(p.target)
$.updateconn = () => [up, down, left, right].forEach(v => v.forEach(sc))
$.setpos = (x = save.x, y = save.y) => (save.x = x, save.y = y,
  style(elm, { left: x, top: y }), updateconn())
onresize.add(updateconn)

// define node ========================
$.execute = async () => {
  if (!user.process) { return } let i = {}, r
  up.forEach(p => { i[p.name] = p.getother()?.value })
  left.forEach(p => { i[p.name] = p.getother()?.value })
  try { r = await user.process(user, i) }
  catch (e) { faillight(new Set([$])); throw e }
  down.forEach(p => { p.value = r?.[p.name] })
  right.forEach(p => { p.value = r?.[p.name] })
}
$.defineport = (type, name) => Cport($, { name, type })
$.defineup = (...a) => defineport("up", ...a)
$.definedown = (...a) => defineport("down", ...a)
$.defineleft = (...a) => defineport("left", ...a)
$.defineright = (...a) => defineport("right", ...a)

$.remove = () => (
  [up, down, left, right].forEach(v => v.forEach(p => p.remove())),
  elm.remove(), save.remove(), getown(user, "remove")?.())

// save & load ========================
const f = nodetype.get(save.type)
if (!f) { throw `type "${save.type}" not exist.` }
$.user = f($, { root: userspace }), setpos()
user.process ? user.process = tofunc(funcbody(user.process), true) : 0
dom({ child: save.type, class: "title", zIndex: -1 }, upbar)