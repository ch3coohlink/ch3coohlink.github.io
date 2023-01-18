root.append($.cvs = dom({ tag: "canvas" }))

$.fitcvs = (c = cvs, r = window.devicePixelRatio) => (
  c.width = c.clientWidth * r, c.height = c.clientHeight * r)
new ResizeObserver(() => fitcvs()).observe(cvs)
