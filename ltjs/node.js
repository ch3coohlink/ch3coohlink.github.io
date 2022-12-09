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

$.input = new Set, $.output = new Set
const sc = p => styleconnect(p, p.target)
$.updateconn = () => (input.forEach(sc), output.forEach(sc))
$.setpos = () => (style(elm, { left: x, top: y }), updateconn())
onresize.add(updateconn), setpos()

// define node ========================
$.typedict = {}, $.defineport = (isinput, name, type, nodetype) => {
  let p; switch (nodetype) {
    case "array": p = arrport($, name, isinput, isinput ? inputbar : outputbar); break;
    default: p = port($, name, isinput, isinput ? inputbar : outputbar); break;
  } (typedict[type] ??= new Set).add(p)
}
$.defineinput = (...a) => defineport(true, ...a)
$.defineoutput = (...a) => defineport(false, ...a)

$.defineprocess = () => {

}

defunc($, { root: userspace })