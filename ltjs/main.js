[, $.basic] = await Promise.all([loadsym("./basic.js"), loadsym("./basic.js", {})])
$.root = $.body = document.body
root.classList.add("grid-bg")
root.addEventListener("contextmenu", e => e.preventDefault())

const paths = "./words.js ./node.js ./port.js ./indexdb.js ./env.js";
[$.Cwrds, $.Cnode, $.Cport, $.Cidb, $.Cenv] = await Promise.all(paths.split(" ").map(v => require(v)))
$.rdword = Cwrds($), $.idb = Cidb($, { name: "ltjs4" })

const mdiv = dom({ class: "measure codefont" }, root)
$.measure = t => (mdiv.innerText = t, getComputedStyle(mdiv).width)

// do not randomly change node type name !!!
const nodename = "texteditor branch merge ref array copy ascend descend"
$.defaultnode = nodename.split(" "), $.dfno = {}
await Promise.all(defaultnode.map(n => require(`./${n}.js`).then(f => dfno[n] = f)))
await loadsym("./panel.js")

$.sendpin = (e, title = "", remove) => {
  const elm = dom({ class: "pin-dom item" }, root)
  const dragbar = dom({ class: "nodebar up", child: title })
  const pinbt = dom({ tag: "button", child: "📌", class: "pin-button" })
  pinbt.onclick = () => remove()
  elm.append(dragbar, pinbt, e)
  return elm
}