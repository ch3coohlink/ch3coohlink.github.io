compappend(root, $.bg = dom({ class: "grid-bg full root" }))
$.panel = dom({ class: "full" }, bg)

compappend(bg, complist({
  direction: "vertical-reverse",
  child: [$.scalebt = button()],
  class: "float-button-list",
  specsty: `.list { width: 90px; }`,
}))

let fs = false, dummy = dom(), setfs = b => {
  fs = b, scalebt.text = b ? "⇲" : "⇱"
  b ? relm.replaceWith(dummy) : dummy.replaceWith(relm)
  if (b) { fsdiv.append(relm), relm.classList.add("full") }
  else { relm.classList.remove("full") }
}; scalebt.on("click", () => setfs(!fs))
initprop($, "fullscreen", () => fs, setfs, fs)

$.atarget = panel; const oa = append
$.append = (...a) => oa(...a.map(e => e))