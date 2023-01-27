$.ctn = dom({ class: "container" }, root)
$.ta = dom({ tag: "textarea", spellcheck: false }, ctn)
$.lbd = dom({ class: "label text-ellipsis" }, ctn)

$.fitta = () => (ta.style.height = "auto",
  ta.style.height = ta.scrollHeight + 3 + "px")
ta.oninput = e => (trigger("input", e), fitta())
new ResizeObserver(fitta).observe(ta)

initprop($, "label", () => lbd.innerText, v => (lbd.innerText = v,
  ta.style.paddingTop = v.length > 0 ? "21px" : ""))
initprop($, "value", () => ta.value, v => { ta.value = v, fitta() })