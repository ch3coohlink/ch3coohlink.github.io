[, $.basic] = await Promise.all([loadsym("./basic.js"), loadsym("./basic.js", {})])
$.root = $.body = document.body
root.classList.add("grid-bg")
root.addEventListener("contextmenu", e => e.preventDefault())

const paths = "./words.js ./node.js ./port.js ./indexdb.js ./env.js";
[$.Cwrds, $.Cnode, $.Cport, $.Cidb, $.Cenv] = await Promise.all(paths.split(" ").map(v => require(v)))
$.rdword = Cwrds($), $.idb = Cidb($, { name: "ltjs4" })

const mdiv = dom({ class: "measure codefont" }, root)
$.measure = t => (mdiv.innerText = t, getComputedStyle(mdiv).width)

const nodename = "texteditor branch merge ref"
$.defaultnode = nodename.split(" "), $.dfno = {}
await Promise.all(defaultnode.map(n => require(`./${n}.js`).then(f => dfno[n] = f)))
await loadsym("./panel.js")