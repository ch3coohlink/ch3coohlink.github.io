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
  let i = {}, r = {}
  up.forEach(p => { i[p.name] = p.getother()?.value })
  left.forEach(p => { i[p.name] = p.getother()?.value })
  try {
    if (user.process) { r = await user.process(user, i) }
    else {
      if (exechorz && user.processhorz) { r = await user.processhorz(user, i) }
      Object.assign(i, r)
      if (execvert && user.processvert) { r = await user.processvert(user, i) }
    }
  } catch (e) { faillight(new Set([$])); console.error(e) }
  right.forEach(p => { p.value = r?.[p.name] })
  down.forEach(p => { p.value = r?.[p.name] })
}
$.defineport = (type, name) => Cport($, { name, type })
$.defineup = (...a) => defineport("up", ...a)
$.definedown = (...a) => defineport("down", ...a)
$.defineleft = (...a) => defineport("left", ...a)
$.defineright = (...a) => defineport("right", ...a)

$.remove = () => (oneenv.clear(), user?.remove(),
  [up, down, left, right].forEach(v => v.forEach(p => p.remove())),
  elm.remove(), save.remove(), getown(user, "remove")?.())

$.oneenv = Cenv($)

// save & load ========================
const f = nodetype.get(save.type)
if (!f) { throw `type "${save.type}" not exist.` }
$.user = f($, { root: userspace }), setpos()
const transproc = v => user[v] ? user[v] = tofunc(funcbody(user[v]), true) : 0
"process processvert processhorz".split(" ").map(transproc)
dom({ child: save.type, class: "title", zIndex: -1 }, upbar)