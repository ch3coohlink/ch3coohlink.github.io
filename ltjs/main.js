await loadsym("./basic.js")
$.root = $.body = document.body
root.classList.add("grid-bg")

const paths = "./item.js ./texteditor.js";
[$.Ci, $.Cte] = await Promise.all(paths.split(" ").map(require))

$.items = [], $.itemdiv = dom({ class: "drag-panel" }, root)

// $.updatelist = () => domarr(items.filter(i => !i.parent).map(i => i.elm), itemdiv)

$.id = 1
$.newbt = dom({ class: "item create-item" }, root)
newbt.onpointerdown = e => {
  const [x, y] = screen2coord(e.pageX - 140 * sx, e.pageY - 12 * sy)
  const i = Ci($, { root: itemdiv, x, y, id: id++ })
  items.push(i), setdrag(i)
}

// TODO: add delete
$.delbt = dom({ class: "item create-item right1" }, root)

$.screen2coord = (x, y, rb = itemdiv.
  getBoundingClientRect(), w = rb.width / 2, h = rb.height / 2) =>
  [(x + w - w / sx) / sx - $.x, (y + h - h / sy) / sy - $.y]

await loadsym("./panel.js")
