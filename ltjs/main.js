await loadsym("./basic.js")
$.root = $.body = document.body
root.classList.add("grid-bg")

const paths = "./item.js ./texteditor.js ./words.js";
[$.Ci, $.Cte, $.Cwrds] = await Promise.all(paths.split(" ").map(require))
Cwrds(null, null, $)

$.svgdiv = dom({ tag:"svg", class: "drag-panel" }, root)
$.items = new Set, $.itemdiv = dom({ class: "drag-panel" }, root)

$.id = 1
$.newbt = dom({ class: "item create-item" }, root)
newbt.onpointerdown = e => {
  const [x, y] = screen2coord(e.pageX - 140 * sx, e.pageY - 12 * sy)
  const i = Ci($, { root: itemdiv, x, y, id: id++, innerfct: Cte })
  items.add(i), setdrag(i)
}

// TODO: add delete
$.delbt = dom({ class: "item create-item right1" }, root)

$.screen2coord = (x, y, rb = itemdiv.
  getBoundingClientRect(), w = rb.width / 2, h = rb.height / 2) =>
  [(x + w - w / sx) / sx - $.x, (y + h - h / sy) / sy - $.y]

await loadsym("./panel.js")
