[, , $.newidb] = await Promise.all([
  loadsym("./basic.js"), loadsym("./comp.js"),
  require("./idb.js")
])

$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
await save.init

const body = document.body
compappend(body, canvas())