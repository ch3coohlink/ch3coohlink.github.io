defineinput("ipt", "any")
defineoutput("0", "any")
defineoutput("1", "any")
defineoutput("2", "any")
defineoutput("3", "any")
defineoutput("4", "any")
defineoutput("5", "any")
defineoutput("6", "any")
defineoutput("7", "any")
defineoutput("8", "any")
defineoutput("9", "any")

$.process = () => {
  $["0"] = $.ipt, $["1"] = $.ipt, $["2"] = $.ipt
  $["3"] = $.ipt, $["4"] = $.ipt, $["5"] = $.ipt
  $["6"] = $.ipt, $["7"] = $.ipt, $["8"] = $.ipt, $["9"] = $.ipt
}