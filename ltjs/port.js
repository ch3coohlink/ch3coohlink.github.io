$.$p = proto($)

$.portdiv = dom({ class: "nodeport" + (isinput ? "" : " right") }, root)
$.namediv = dom({ class: "nodeportname", child: name }, portdiv)
$.button = dom({ class: "nodeportbutton" }, portdiv)

