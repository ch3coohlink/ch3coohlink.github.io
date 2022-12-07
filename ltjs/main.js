[, $.basic] = await Promise.all([loadsym("./basic.js"), loadsym("./basic.js", {})])
$.root = $.body = document.body
root.classList.add("grid-bg")
root.addEventListener("contextmenu", e => e.preventDefault())

const paths = "./item.js ./texteditor.js ./words.js ./node.js ./port.js";
[$.Ci, $.Cte, $.Cwrds, $.Cn, $.Cport] = await Promise.all(paths.split(" ").map(require))
$.rdword = Cwrds($)
$.port = ($, name = "", isinput = true, root) => Cport($, { name, isinput, root })

$.items = new Set, $.itemdiv = dom({ class: "full-panel drag-panel" }, root)
$.svgdoc = svg("svg", { class: "full-panel svg-panel" }, root)

$.newbt = dom({ class: "item create-item" }, root)
newbt.onpointerdown = e => {
  const [x, y] = screen2coord(e.pageX - 140 * sx, e.pageY - 12 * sy)
  const i = Ci($, { root: itemdiv, x, y, id: uuid(), innerfct: Cte })
  items.add(i), setdrag(i)
}

$.delbt = dom({ class: "item create-item right1" }, root)
delbt.addEventListener("pointerenter", () => (
  $.todel = true, di ? di.elm.style.boxShadow = delstyle : 0))
delbt.addEventListener("pointerleave", () => (
  $.todel = false, di ? di.elm.style.boxShadow = "" : 0))

$.screen2coord = (x, y, rb = itemdiv.getBoundingClientRect(),
  w = rb.width / 2, h = rb.height / 2) =>
  [(x + w - w / sx) / sx - $.x, (y + h - h / sy) / sy - $.y]

const mdiv = dom({ class: "measure codefont" }, root)
$.measure = t => (mdiv.innerText = t, getComputedStyle(mdiv).width)

await loadsym("./panel.js")

$.tofunc = src => new Function("$", `with($){\n${src}\n}`)
const simple = ``
Cn($, { root, defunc: tofunc(simple) })