eventtarget($)

$.relm = dom({ class: def.name })
$.root = relm.attachShadow({ mode: "open" })
root.adoptedStyleSheets = [def.cssst, def.styst
  , ...$.extrasty ? asarr(extrasty) : []]
if ($.specsty) {
  const s = new CSSStyleSheet()
  s.replace(specsty)
  root.adoptedStyleSheets.push(s)
}

$.append = (...a) => $.atarget ? compappend(atarget, ...a) : 0
$.remove = relm.remove.bind(relm)
$.removeChild = (...a) => atarget?.removeChild(...a)
$.replaceWith = relm.replaceWith.bind(relm)

let uc = $.class ?? ""; initprop($, "class", () => uc,
  v => relm.className = def.name + " " + (uc = v), uc)