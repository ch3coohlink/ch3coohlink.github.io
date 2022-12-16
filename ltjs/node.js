$.elm = dom({ class: "movable item" }, root)
$.onresize = new Set; new ResizeObserver(() => onresize.forEach(f => f())).observe(elm)

$.dragbar = dom({ class: "dragbar" }, elm)
$.content = dom({ class: "content" }, elm)
$.inputbar = dom({ class: "nodebar" }, content)
$.userspace = dom({ class: "userspace" }, content)
$.outputbar = dom({ class: "nodebar right" }, content)

elm.addEventListener("pointerdown", () => tolast($))
elm.addEventListener("pointerenter", () => elm.style.zIndex = "100")
elm.addEventListener("pointerleave", () => di !== $ ? elm.style.zIndex = "" : 0)
dragbar.addEventListener("pointerdown", e => setdrag($, e))

$.input = [], $.output = []
const sc = p => styleconnect(p, p.target)
$.updateconn = () => (input.forEach(sc), output.forEach(sc))
$.setpos = (x, y) => (save.x = $.x = x, save.y = $.y = y,
  style(elm, { left: x, top: y }), updateconn())
onresize.add(updateconn)

// define node ========================
$.execute = () => {
  if (!user.process) { return } const i = {}
  input.forEach(p => { i[p.name] = p.target?.value })
  const r = user.process(user, i)
  output.forEach(p => { p.value = r[p.name] })
  //log(`default handler for node "${id}" executed`, elm)
}
$.typedict = {}, $.defineport = (isinput, name, type, nodetype) => {
  let p; switch (nodetype) {
    case "array": p = arrport($, name, isinput, isinput ? inputbar : outputbar); break;
    default: p = port($, name, isinput, isinput ? inputbar : outputbar); break;
  } (typedict[type] ??= []).push(p)
}
$.defineinput = (...a) => defineport(true, ...a)
$.defineoutput = (...a) => defineport(false, ...a)

// save & load
$.save = idb.saveobj(id)
const f = async () => {
  Promise.all([save.x, save.y]).then(([x, y]) => x && y ? setpos(x, y) : 0)
  if ($.type) { save.type = type } else { $.type = await save.type }
  const f = nodetype.get(type); if (!f) { return }
  $.user = f($, { root: userspace })
  user.process = tofunc(funcbody(user.process))
  dragbar.innerHTML = type
}; f()