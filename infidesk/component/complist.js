compappend(root, $.lst = dom({class: "list"}))

$.atarget = lst

let currd = $.direction ?? ""
initprop($, "direction", () => currd,
  v => lst.className = "list " + (currd = v))