const $ = {}
with (window) {
  var a = 1 // too old (pre es5)
  a = 1 // not good
  let a = 1
  const a = 1
  a = 2 // ERROR
  window.a = 1
  with ($) {
    $.a = 1
    // log($.a) // 1
    log(a) // 1
    $.a
    b // ERROR
  }
}

const add = (a, b) => a + b + false