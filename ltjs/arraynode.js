defineinput("0", "any")
defineinput("1", "any")
defineinput("2", "any")
defineinput("3", "any")
defineinput("4", "any")
defineinput("5", "any")
defineinput("6", "any")
defineinput("7", "any")
defineinput("8", "any")
defineinput("9", "any")
defineoutput("arr", "any")

$.push = (arr, ...a) => a.forEach(v => !v ? 0 : isarr(v) ? arr.push(...v) : arr.push(v))
$.process = () => {
  push($.arr = [],
    $["0"], $["1"], $["2"], $["3"], $["4"], $["5"], $["6"], $["7"], $["8"], $["9"])
}