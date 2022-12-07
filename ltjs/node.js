$.elm = dom({ class: "movable item" }, root)
$.onresize = []; new ResizeObserver(() => onresize.forEach(f => f())).observe(elm)

$.dragbar = dom({ class: "dragbar" }, elm)
$.content = dom({ class: "content" }, elm)
$.inputbar = dom({ class: "nodebar" }, content)
$.userspace = dom({ class: "userspace" }, content)
$.outputbar = dom({ class: "nodebar right" }, content)



// define node ========================
$.defineport = (isinput, name, type) => {
  switch (type) {
    case "array":
      arrport($, name, isinput, isinput ? inputbar : outputbar)
      break;
    default:
      port($, name, isinput, isinput ? inputbar : outputbar)
      break;
  }
}
$.defineinput = (...a) => defineport(true, ...a)
$.defineoutput = (...a) => defineport(false, ...a)

$.defineprocess = () => {
  
}

$.def = defunc({ ...basic, typename: "default", input: [], output: [], process: () => { } })
// $.input = def.input.map(a => isarr(a) ? arrport(a) : port(a))
// $.output = def.output.map

// ====================================
style(elm, { top: 500, left: 500 })

defineinput("src")
defineoutput("html")