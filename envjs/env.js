setdef($, "data", rarr())
$.view = {}
$.repleditor = () => {
  if (data.length === 0) { data.push("") }
  $.view = updarr(data, datalist, texteditor, false)
  updpos()
}
$.updpos = (h = 0, i = 0, ha = []) => (
  forof(data, (d, e = view[d[suid]]) => (ha.push([e, h, i++]), h += e.clientHeight)),
  forof(ha, ([e, h, i]) => style(e, { top: h, zIndex: String(i) })))
$.texteditor = (d, i) => {
  const e = view[d[suid]] ?? dom({ value: d.v }, null, "textarea")
  return e
}

$.css = createcss($.shadow = root.attachShadow({ mode: "open" }))
$.warp = dom({ style: { height: "100%", display: "flex" } }, shadow)
$.datalist = dom({ style: { position: "relative", overflow: "auto", width: "100%" } }, warp)

css("textarea:focus", { background: "#00ff0020", outline: "none" },
  { boxShadow: "inset #ffffff60 0px 0px 20px 5px" })
css("textarea", { display: "block", boxSizing: "border-box", margin: 0, border: 0, padding: 0 },
  { background: "#00000000", resize: "none", width: "100%", overflow: "hidden", whiteSpace: "pre" },
  { lineHeight: 16, fontSize: 15, fontFamily: "consolas, courier new, monospace" })
css(".repl-item", { display: "block", position: "absolute", margin: 0, border: 0, padding: 10 },
  { background: "#ddd", boxShadow: "inset white 0px 0px 20px 5px", resize: "none", width: "100%" },
  { transition: "all 0.5s cubic-bezier(.08,.82,.17,1) 0s", overflow: "hidden", boxSizing: "border-box" })
css(".repl-item-result", { margin: 0, fontSize: 12, color: "#555" })
css(".no-scroll-bar::-webkit-scrollbar", { display: "none" })
css(".no-scroll-bar", { MsOverflowStyle: "none", scrollbarWidth: "none" })

repleditor()