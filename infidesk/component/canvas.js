root.append($.cvs = dom({ tag: "canvas" }))

$.fitcvs = (c = cvs, r = window.devicePixelRatio) => (
  c.width = c.clientWidth * r, c.height = c.clientHeight * r)
new ResizeObserver(() => (fitcvs(), trigger("resize"))).observe(cvs)

$.getContext = (...a) => cvs.getContext(...a)
initprop($, "width", () => cvs.width, v => { cvs.width = v })
initprop($, "height", () => cvs.height, v => { cvs.height = v })