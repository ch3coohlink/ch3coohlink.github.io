const sign = v => v > 0n ? 1n : v < 0n ? -1n : 0n
const rootN = (v, k = 2n) => {
  if (v < 0n) { throw "negative number is not supported" }
  let o = 0n, x = v, limit = 100;
  while (x ** k !== k && x !== o && --limit) {
    o = x; x = ((k - 1n) * x + v / x ** (k - 1n)) / k;
  } return x;
}
const sqrt = v => {
  if (v < 0n) { throw 'square root of negative numbers is not supported' }
  if (v < 2n) { return v; } let x0, x1 = 1n; do { x0 = x1, x1 = ((v / x0) + x0) >> 1n }
  while (!(x0 === x1 || x0 === (x1 - 1n))) return x0
}
const pell = (v, i = 1000) => {
  const n = BigInt(v); let x = sqrt(n), y = x, z = 1n, w = x << 1n
  if (x * x === n) { return `solution not exist for N=${n}` }
  let e1 = 1n, e2 = 0n, f1 = 0n, f2 = 1n, a, b; while (i--) {
    y = w * z - y, z = (n - y * y) / z, w = (x + y) / z;
    [e1, e2, f1, f2] = [e2, e1 + e2 * w, f2, f1 + f2 * w], [a, b] = [f2 * x + e2, f2]
    if (a * a - n * b * b === 1n) { return [a, b] }
  } return `solution not found for N=${n} in ${i} times of iteration`
}