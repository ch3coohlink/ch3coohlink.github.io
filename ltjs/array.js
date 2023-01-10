defineleft("0")
defineleft("1")
defineleft("2")
defineleft("3")
defineleft("4")
defineleft("5")
defineleft("6")
defineleft("7")
defineleft("8")
defineleft("9")
defineright("arr")

$.push = (arr, ...a) => a.forEach(v => isnth(v) ? 0 : arr.push(v))
$.process = () => {
  push($.arr = [],
    $["0"], $["1"], $["2"], $["3"], $["4"], $["5"], $["6"], $["7"], $["8"], $["9"])
}