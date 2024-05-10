const { min, max, floor } = Math
const arr = () => new Proxy({}, { get: (t, k) => t[k] ?? 0 })
$.diff = (A, B, i = 0, j = 0) => {
  const N = A.length, M = B.length, L = N + M, Z = 2 * min(N, M) + 2
  if (N > 0 && M > 0) {
    const delta = N - M, g = arr(), p = arr()
    for (let D = 0; D < floor(L / 2) + (L % 2 != 0) + 1; D++) {
      for (let o = 1; o >= 0; o--) {
        const of = o === 1, [c, d, os] = of ? [g, p, 1] : [p, g, -1]
        const ke = D - 2 * max(0, D - N), o_ = 1 - o
        for (let k = 2 * max(0, D - M) - D; k <= ke; k += 2) {
          const ca = c[(k - 1) % Z], cb = c[(k + 1) % Z]
          let a = k === -D || k !== D && ca < cb ? cb : ca + 1, b = a - k
          const s = a, t = b, lo = D - o, k_ = delta - k
          while (a < N && b < M && A[o_ * N + os * a - o_] === B[o_ * M + os * b - o_]
          ) { a += 1, b += 1 } c[k % Z] = a
          if (L % 2 === o && -lo <= k_ && k_ <= lo && a + d[k_ % Z] >= N) {
            let [D_, x, y, u, v] = of ? [2 * D - 1, s, t, a, b]
              : [2 * D, N - a, M - b, N - s, M - t]
            if (D_ > 1 || x !== u && y !== v) { // maybe do some merge here
              return diff(A.slice(0, x), B.slice(0, y), i, j)
                .concat(diff(A.slice(u), B.slice(v), i + u, j + v))
            } else if (M > N) { return diff([], B.slice(N), i + N, j + N) }
            else if (M < N) { return diff(A.slice(M), [], i + M, j + M) }
            else { return [] }
          }
        }
      }
    }
  } else if (N > 0) { return [{ type: 'delete', old: i, length: N }] }
  else if (M > 0) { return [{ type: 'insert', old: i, new: j, length: M }] }
  else { throw new Error('can\'t diff') }
}