// $.root = root.attachShadow({ mode: "open" })
$.resize = () => fitta(ta)
$.ta = dom({ tag: "textarea", oninput: resize }, root)
new ResizeObserver(resize).observe(root); resize()
