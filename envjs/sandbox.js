// This is by no mean a secure sandbox.

// dom element
const rtsty = [{ height: "100%", width: "100%" },
{ position: "relative", overflow: "auto" }]
$.warp = dom({ style: rtsty }, root)
$.shadow = warp.attachShadow({ mode: "open" })
$.html = dom({ lang: "en" }, shadow, "html")
$.head = dom({}, html, "head")
$.css = createcss(dom({}, head, "style"))
$.body = dom({}, html, "body")
css("html", { all: "initial", width: "100%", position: "absolute" })

// everything that not gc should be concerned
// (so maybe add URL.createObjectURL etc...)
// note this api is different from the web standard
$.ra = requestAnimationFrame, $.ca = cancelAnimationFrame
$.si = setInterval, $.ci = clearInterval
$.st = setTimeout, $.ct = clearTimeout
$._a = new Set, $._i = new Set, $._t = new Set
$.requestAnimationFrame = f => (_a.add(f), ra(f))
$.cancelAnimationFrame = f => (_a.delete(f), ca(f))
$.setInterval = (f, t) => (_i.add(f), si(f, t))
$.clearInterval = f => (_i.delete(f), ci(f))
$.setTimeout = (f, t) => (_t.add(f), st(f, t))
$.clearTimeout = f => (_t.delete(f), ct(f))

// dispatch all window event
$.eventkey = `onsearch onappinstalled onbeforeinstallprompt onbeforexrselect onabort onblur oncancel oncanplay oncanplaythrough onchange onclick onclose oncontextmenu oncuechange ondblclick ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onmousewheel onpause onplay onplaying onprogress onratechange onreset onresize onscroll onseeked onseeking onselect onstalled onsubmit onsuspend ontimeupdate ontoggle onvolumechange onwaiting onwebkitanimationend onwebkitanimationiteration onwebkitanimationstart onwebkittransitionend onwheel onauxclick ongotpointercapture onlostpointercapture onpointerdown onpointermove onpointerup onpointercancel onpointerover onpointerout onpointerenter onpointerleave onselectstart onselectionchange onanimationend onanimationiteration onanimationstart ontransitionrun ontransitionstart ontransitionend ontransitioncancel onafterprint onbeforeprint onbeforeunload onhashchange onlanguagechange onmessage onmessageerror onoffline ononline onpagehide onpageshow onpopstate onrejectionhandled onstorage onunhandledrejection onunload ondevicemotion ondeviceorientation ondeviceorientationabsolute onpointerrawupdate`.split(/\s/)
$.eventname = eventkey.map(v => v.slice(2))

$.listeners = {}, $.handler = {}
$.addEventListener = (t, l) => {
  let s = listeners[t]; if (!s) { s = listeners[t] = new Set } s.add(l)
}
$.removeEventListener = (t, l) => {
  const s = listeners[t]; if (s) { s.delete(l) }
}
const dispatch = t => e => {
  const h = handler["on" + t], s = listeners[t]
  h ? h(e) : 0, s ? forof(s, f => f(e)) : 0
}
const dispatcher = {}
forof(eventname, t => window.addEventListener(t, dispatcher[t] = dispatch(t)))

// clear everything inside sandbox
$.destroy = () => {
  root.innerHTML = ""
  forin(dispatcher, (v, k) => { window.removeEventListener(k, v) })
  forof(_a, cancelAnimationFrame)
  forof(_i, clearInterval)
  forof(_t, clearTimeout)
}

// warp a window interface
// (maybe proxy is not a good choice here)
// (P.S bad news! proxy do not work with "with" keyword )
// (P.P.S not very sure about this, need more test )
const _ = assign(scope(proto($)), {
  document: new Proxy(document, {
    get: (t, k) => {
      if (k === "documentElement") { return html }
      else if (k === "body") { return body }
      else { return t[k] }
    }
  }), destroy, shadow, css, addEventListener, removeEventListener,
  requestAnimationFrame, cancelAnimationFrame,
  setInterval, clearInterval, setTimeout, clearTimeout
})
property(_, "window", { value: _ })
property(_, "$", { value: _ })
forof(eventkey, k => property(_, k, { set: v => handler[k] = v }))
return _