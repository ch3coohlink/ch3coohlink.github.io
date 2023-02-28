[, , , $.newidb, $.glutil] = await Promise.all([
  loadsym("./basic.js"), loadsym("./tween.js"), loadsym("./comp.js"),
  require("./idb.js"), require("./gl.js")
])

$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
await save.init

const body = document.body
compappend(body, $.cvs = canvas())
$.ctx = cvs.getContext("2d")

$.seed = 3952395901;[$.rd, $.rdi] = genrd(seed)
$.min = Math.min, $.max = Math.max

$.box = (...a) => {
  let o = {}; with (o) {
    o.type = "box"
    o.child = a
    o.temp = {}
    o.layout = {}
    o.matrix = new DOMMatrix()
    o.size = () => {
      let l = o.layout, w = l.width ?? 300, h = 5
      for (let i of child) {
        if (i.layout.position) { continue }
        let [dw, dh] = i.size()
        w = max(w, dw + 10), h += dh + 5
      } o.temp.w = w, h = o.temp.h = max(l.height ?? 100, h)
      return [w, h]
    }
    o.pos = () => {
      let { x, y, w } = temp, lx = 5, ly = 5
      for (let i of child) {
        let ix, iy
        if (i.layout.position) { [ix, iy] = i.layout.position }
        else {
          ix = x + lx, iy = y + ly
          ly += i.temp.h + 5
        }
        i.temp.x = ix, i.temp.y = iy
        i.pos(), i.grow(o)
      }
    }
    o.grow = (p) => {
      // let pw = w - 10; if (pw > i.temp.w) { i.temp.w = pw }
      // let pw = w - i.temp.x - 5; if (pw > i.temp.w) { i.temp.w = pw }
    }
    o.draw = () => {
      ctx.fillStyle = "#00000050"
      let m = new DOMMatrix().translate(temp.x, temp.y)
      ctx.setTransform(m)
      ctx.fillRect(0, 0, temp.w, temp.h)
      for (let i of child) { i.draw() }
      o.temp = {}
    }
  } return o
}

$.text = () => {
  let o = {}; with (o) {
    o.type = "text"
    o.child = []
    o.temp = {}
    o.layout = {}
    o.size = () => { }
    o.pos = () => { }
    o.grow = () => { }
    o.draw = () => { }
  } return o
}

$.root = () => {
  let o = {}; with (o) {
    o.type = "root"
    o.child = []
    o.size = () => { for (let i of child) { i.size() } }
    o.pos = () => {
      let lx = 5, ly = 5, x = 0, y = 0, w = cvs.width
      for (let i of child) {
        let ix, iy
        if (i.layout.position) { [ix, iy] = i.layout.position }
        else {
          ix = x + lx, iy = y + ly
          ly += i.temp.h + 5
        } i.temp.x = ix, i.temp.y = iy

        let pw = w - i.temp.x - 5; if (pw > i.temp.w) { i.temp.w = pw }
        i.pos()
      }
    }
    o.draw = () => { for (let i of child) { i.draw() } o.temp = {} }
  } return o
}
// frame(t => {
//   t /= 1000

//   if (t < Infinity) {
//     panel.layout.position = [100 * Math.sin(t) + 200, 100 * Math.cos(t) + 200]
//     panel.layout.height = 500 + 200 * Math.sin(t)
//   }

//   ctx.fillStyle = "white"
//   ctx.fillRect(0, 0, cvs.width, cvs.height)
//   rt.size(), rt.pos(), rt.draw()
// })

$.rt = root()
$.panel = box(
  box(),
  box(box(box(), box())),
  box(box(), box()),
  box(),
)
panel.layout.height = 800
rt.child.push(panel, box())

const { imul } = Math; $.hash = (s, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch, l = s.length; i < l; i++) (ch = s.charCodeAt(i),
    h1 = imul(h1 ^ ch, 2654435761), h2 = imul(h2 ^ ch, 1597334677))
  h1 = imul(h1 ^ (h1 >>> 16), 2246822507) ^ imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = imul(h2 ^ (h2 >>> 16), 2246822507) ^ imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

$.fwith = (f, n, s = funcbody(f)) => (n ??= hash(s).toString(16),
  new (f instanceof AsyncFunction ? AsyncFunction : Function)
    ("__P__", "__A__", "$ = Object.assign(Object.create(__P__), __A__)",
      "with($) {\n" + `//# sourceURL=${n}.js\n` + s + "\n} return $"))


$.erf = x => {
  // save the sign of x
  let sign = (x >= 0) ? 1 : -1
  x = Math.abs(x)
  let a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  let a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  // A&S formula 7.1.26
  let t = 1.0 / (1.0 + p * x)
  let y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return sign * y // erf(-x) = -erf(x);
}

$.normpdf = (x, sd = 1, mn = 0) =>
  1 / (sd * Math.sqrt(2 * Math.PI)) * Math.exp(-1 / 2 * ((x - mn) / sd) ** 2)
$.normcdf = (x, sd = 1, mn = 0) => 1 / 2 * (1 + erf((x - mn) / Math.sqrt(2 * sd)))

$.seed = hash("" + new Date().getTime());[$.rd, $.rdi] = genrd(seed)
fwith(() => {
  const n = 100
  const cdf = array(n, v => (normcdf((v + 1) / n, 0.1) - 0.5) * 2)
  const revcdf = r => {
    let i = cdf.findIndex(v => v > r)
    let s = cdf[i - 1] ?? 0, e = cdf[i]
    if (i === -1) { i = n - 1, s = cdf[i], e = 1 }
    if (i === -1) { log(i, r, s, e, (i + (r - s) / (e - s)) / n) }
    return (i + (r - s) / (e - s)) / n
  }
  const nd = i => Math.floor(revcdf(rd()) * (Math.floor(i) + 1))

  const endround = () => {
    maxHP = max(o.hp, maxHP)
    minHP = min(o.hp, minHP)
    a.push(deepcopy(o))
  }

  const o = { hp: rdi(100), maxHP: 100, str: rdi(200), money: rdi(100) }
  const a = [deepcopy(o)]

  let maxHP = o.hp, minHP = o.hp

  for (let i = 0; i < 1000; i++) {
    a.push(i + 1)
    let df = i
    let skip = false
    let mdf = df ** 2

    if (rd(100) > 50) {
      a.push(`Difficulty level up... current ${mdf} `)
      let d = nd(mdf)
      let dd = rdi(o.str)
      let reald = max(d - dd, 0)
      if (reald > 0) {
        let d = reald
        if (o.money >= d) {
          o.money -= d
          a.push(`Give out money ${d} to spare this attack`)
          skip = true
        } else {
          o.hp -= d
          a.push(`HP - ${d}, damage dealt ${dd} `)
        }
      } else { a.push(`Perfect fight: guard ${dd} to ${d}`) }

      if (o.hp <= 0) {
        a.push(`You dead...! Level reached: ${i + 1}`);
        endround()
        break
      }

      if (!skip) {
        let m = nd(mdf)
        o.money += m
        a.push(`Get money ${m}`)
      }
    }

    if (rd(100) > 0) {
      let m = nd(o.money)
      o.money -= m
      if (m > 0) {
        let r = rd()
        if (r > 2 / 3) {
          o.str += m
          a.push(`Spend ${m} on str`)
        } else if (r > 1 / 3) {
          let p = o.hp
          o.hp = min(o.hp + m * 10, o.maxHP)
          let d = o.hp - p
          let rm = Math.floor(d / 10)
          o.money += m - rm
          if (rm > 0) {
            a.push(`Spend ${rm} on hp, heal ${d} hp`)
          }
        } else {
          o.hp += m
          o.maxHP += m
          a.push(`Spend ${m} on maxHP`)
        }
      }
    }

    if (rd(100) > 99) {
      const d = nd(df)
      o.maxHP += d
      o.hp += d
      a.push(`MaxHP + ${d}`)
    }

    if (rd(100) > 50) {
      const d = nd(df / 3)
      if (o.hp + d >= o.maxHP) {
        o.hp = o.maxHP
        o.maxHP += 1
        o.hp += 1
        a.push(`HP + ${d}, HP Maxed`)
        a.push(`MaxHP + 1`)
      } else {
        o.hp += d
        a.push("HP + " + d)
      }
    }

    endround()
  }

  a.forEach(v => log(v))
  log("maxHP:", maxHP)
  log("minHP:", minHP)
})($)

// log(...array(1000, () => revcdf(rd()) * 100))
// const result = array(1000, () => Math.floor(revcdf(rd()) * 100))
// log(array(10, v => result.filter(r => r >= v * 10 && r < (v + 1) * 10).length))
