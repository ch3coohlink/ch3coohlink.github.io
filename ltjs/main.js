await loadsym("./basic.js")
$.root = $.body = document.body
root.classList.add("grid-bg")

const paths = "./item.js ./texteditor.js ./words.js";
[$.Ci, $.Cte, $.Cwrds] = await Promise.all(paths.split(" ").map(require))
$.rdword = Cwrds($)

$.items = new Set, $.itemdiv = dom({ class: "full-panel drag-panel" }, root)
$.svgdoc = svg("svg", { class: "full-panel svg-panel" }, root)

$.id = 1
$.newbt = dom({ class: "item create-item" }, root)
newbt.onpointerdown = e => {
  const [x, y] = screen2coord(e.pageX - 140 * sx, e.pageY - 12 * sy)
  const i = Ci($, { root: itemdiv, x, y, id: id++, innerfct: Cte })
  items.add(i), setdrag(i)
}

$.delbt = dom({ class: "item create-item right1" }, root)
delbt.addEventListener("pointerenter", () => (
  $.todel = true, di ? di.elm.style.boxShadow = delstyle : 0))
delbt.addEventListener("pointerleave", () => (
  $.todel = false, di ? di.elm.style.boxShadow = "" : 0))

$.screen2coord = (x, y, rb = itemdiv.
  getBoundingClientRect(), w = rb.width / 2, h = rb.height / 2) =>
  [(x + w - w / sx) / sx - $.x, (y + h - h / sy) / sy - $.y]

const mdiv = dom({ class: "measure codefont" }, root)
$.measure = t => (mdiv.innerText = t, getComputedStyle(mdiv).width)

await loadsym("./panel.js")
