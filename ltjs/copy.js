defineleft("ipt")
defineright("0")
defineright("1")
defineright("2")
defineright("3")
defineright("4")
defineright("5")
defineright("6")
defineright("7")
defineright("8")
defineright("9")

$.onewayoutput = true
$.process = () => {
  $["0"] = $.ipt, $["1"] = $.ipt, $["2"] = $.ipt
  $["3"] = $.ipt, $["4"] = $.ipt, $["5"] = $.ipt
  $["6"] = $.ipt, $["7"] = $.ipt, $["8"] = $.ipt, $["9"] = $.ipt
}