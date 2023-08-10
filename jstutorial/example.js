// v8: js jit compiler
// some code in script: a = 1
// interpreter is a c software
// assignValue(){}
// void assignValue(TYPE left, TYPE right) {
// // left = right
// }
// js is an interpreter language
// until v8...
// gcc is a c aot compiler
// .c -> .exe
// .js -> v8 interpreter -> profiler -> hotpath
// -> jit compiler

const add = (a, b) => a + b
// 99 + 100
// "add" + "sth" = "addsth"
// const add = (a: int, b: int): int => a + b
// const add = (a: string, b: string): string => a + b
// const add = <T>(a: T, b: T) : T => a + b

// gravvl vm
// jvm
// js -> interpreter(Java) -> compiler

let a = { a: 12 }
console.log(a) // [Object object]
a.b = 14
console.log(a) // [Object object]
a.c = { c: 14 } // a.c = { c: 14, a }
a.c.self = a.c
console.log(a) // [Object object]

let somefunction = (a, b) => {
  return somefunction
}
somefunction.a = 12
console.dir(somefunction())

delete a.b

Object.defineProperty(a, "readonly", { writable: false, value: "un" })


// js object: dynamic
// js function: executable object
// js array: number indexed object

let somearray = [1, 2, 3, "string", {}, () => { }]
somearray.sort()
// [...]

let oarr = {}
oarr.some
oarr["somestring"] // oarr.somestring
oarr["0"] // oarr.somestring
//oarr.0property
oarr["0property"] // undefined
oarr["0property"].something // ERROR
oarr[0] = 1
oarr[1] = 2
oarr[2] = 3
oarr[3] = "string"
oarr[4] = {}
oarr[5] = () => void 0
oarr[5] = function () { return void 0 }
oarr.length = 6



console.log(somearray)
console.log(oarr)

oarr.sort() // ERROR
// undefined   // OK
// undefined() // ERROR


// a:a -> 12
// a:b -> 14
// a:c -> a:c object
// a:c:c -> 14
// a:c:a -> a object

// console.log(a)
// output:
// {}