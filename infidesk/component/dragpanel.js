compappend(root, $.bg = dom({ class: "grid-bg full root" }))
$.panel = dom({ class: "full" }, bg)

compappend(bg, complist({
  direction: "vertical-reverse",
  child: [$.scalebt = button({ text: "⇱" })],
  class: "float-button-list",
  specsty: `.list { width: 90px; }`,
}))

$.atarget = panel; const oa = append
$.append = (...a) => oa(...a.map(e => e))