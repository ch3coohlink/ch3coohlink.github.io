//! g.write(c, "draw.js", src)
$.cvs = dom({ tag: "canvas" }, body)
cvs.style.width = "100%"
cvs.style.height = "100%"
new ResizeObserver(() => fitcvs(cvs)).observe(cvs)
Object.defineProperty($, "pratio", { get: () => window.devicePixelRatio })
$.ctx = cvs.getContext("2d")
$.cvssize = () => [cvs.width / pratio, cvs.height / pratio]
$.clearcvs = () => { ctx.clearRect(0, 0, cvs.width, cvs.height) }
$.drawrect = (a, b, x, y, s) => {
  if (s) { ctx.strokeStyle = s }
  if (ctx.lineWidth !== pratio) { ctx.lineWidth = pratio }
  [a, b, x, y] = [a, b, x, y].map(x => x * pratio)
  ctx.strokeRect(a + 0.5, b + 0.5, x - a, y - b)
}
$.drawtext = (s, x, y, h = 20, w) => {
  const { actualBoundingBoxLeft: bbl,
    fontBoundingBoxAscent: fba,
  } = ctx.measureText(s)
  if (h) (h = log(Math.round(h * 0.78125 * pratio)),
    ctx.font = ctx.font.replace(/\d+(?=px)/, h))
  ctx.fillStyle = "black"
  ctx.fillText(s, x + bbl, y + fba, w)
}
//! g.write(t, "lib", c, "ref")
//! g.write(t, "draw.js", src)
body.innerHTML = ""
loadjs("lib/draw.js")
frame(t => {
  clearcvs()
  drawrect(10, 100 + 50 * Math.sin(t / 1000 + 1),
    100 + 50 * Math.sin(t / 1000), 200)
})
//! g.write(t, "drawtext.js", src)
body.innerHTML = ""
loadjs("lib/draw.js")
$.s = "The quick brown fox jumps over the lazy dog"
log(ctx.measureText(s))

frame(() => {
  clearcvs()

  ctx.font = ctx.font.replace(/\d+(?=px)/, 50)
  let x = 100, y = 300, w, {
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
    fontBoundingBoxAscent,
    fontBoundingBoxDescent,
    width } = ctx.measureText(s)

  ctx.fillStyle = "black"
  ctx.fillText(s, x, y, w)
  // base line
  ctx.fillStyle = "blue"
  ctx.fillRect(x, y, width, 1)
  // bounding box
  ctx.lineWidth = 1
  ctx.strokeStyle = "red"
  ctx.strokeRect(
    Math.round(x - actualBoundingBoxLeft) + 0.5,
    Math.round(y - actualBoundingBoxAscent) + 0.5,
    Math.round(actualBoundingBoxLeft + actualBoundingBoxRight),
    Math.round(actualBoundingBoxAscent + actualBoundingBoxDescent))

  ctx.fillStyle = "green"
  ctx.fillRect(x, Math.round(y - fontBoundingBoxAscent), width, 1)
  ctx.fillRect(x, Math.round(y + fontBoundingBoxDescent), width, 1)
})
//! g.write(c, "file_explorer.js", src)
$.file_explorer = n => {
  g.dir(n)
}
//! g.write(t, "file_explorer.js", src)
loadjs("lib/draw.js")
loadjs("lib/file_explorer.js")
frame(() => {
  file_explorer()
})
//! g.write(t, "generate_repo.js", src)
let curr = [g.newgraph("fuzzy_generate_repo")];
[$.rd, $.rdi] = genrd(999999999)
for (const i of array(10)) {
  let l = curr.length
  curr = [].concat(...curr.map((v, i) => {
    if (rd() > 2 / 3) { return [g.newnode(v), g.newnode(v)] }
    else if (rd() > 1 / 3) { return g.newnode(v) }
    // else if (l > 1) { return g.merge(v, curr[i + 1] ?? curr[i - 1]) }
    else return []
  }))
}