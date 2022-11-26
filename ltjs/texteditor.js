// $.root = root.attachShadow({ mode: "open" })
$.resize = () => fitta(ta)
$.ta = dom({ tag: "textarea", oninput: resize }, root)
onresize.push(resize), resize()