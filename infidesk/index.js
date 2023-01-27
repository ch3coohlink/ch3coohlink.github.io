[, , $.newidb, $.glutil] = await Promise.all([
  loadsym("./basic.js"), loadsym("./comp.js"),
  require("./idb.js"), require("./gl.js")
])

$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
await save.init

const body = document.body
compappend(body, $.cvs = canvas())

const sequence = $ => {
  with ($) {
    $.frame = 0, $.time = 0, $.ftime = 1 / 60, $.drawflag = true
    Object.defineProperty($, "draw", {
      get: () => {
        let o = $; while (o = proto(o)) {
          if (o.drawflag === false) { return false }
        } return drawflag
      }
    })
    const _init = () => { $.frame = 0, init($) }
    $.next = () => { $.frame++, time = ftime * frame, tick($); return $ }
    $.jumpto = (t, l = Math.floor(t / ftime)) => {
      $.drawflag = false, _init()
      while (frame < l) next(); $.drawflag = true
      return $
    }; _init()
  } return $
}
