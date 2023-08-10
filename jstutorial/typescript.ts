// const add = (a: number, b: number) => a + b + false
const add = <T>(a: T, b: T) => a
add<number>(123, 1)
add<string>("123", "1")

with (window) {

}