const body = document.body; body.innerHTML = ""

const fct2str = (f, s = String(f)) => {
  const t = s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"))
  const a = t.split(/\r?\n/); if (a[0] === "") a.shift()
  const n = a[0].match(/^[\s]+/)?.[0].length ?? 0
  return a.map(v => v.slice(n)).join("\r\n").trim()
}
const deepcopy = (o, r = {}) => (forof(Object.keys(o),
  (k, v = o[k]) => r[k] = isobj(o) ? deepcopy(v) : v), r)

const exec = (f, r) => Function("$", `with($){\n${f}\n}`)(r)

const savepoint = k => ({ k, get: () => store.get(k), set: v => store.set(k, v) })

const schgd = savepoint("simplechg/definition"), stop = Symbol("stop"); let select
const lh = 18, setth = t => style(t, { height: t.value.split(/\r?\n/).length * lh + 6 })
const defsel = f => isfct(f) ? select = f : panic("事件选择必须是一个函数")
const newenv = () => ({ defsel, print, stop })
const upddfn = (s = def.value, n = newenv()) => (schgd.set(s), exec(s, n))

let nh, fstop, now = () => new Promise(r => nh = setNow(r))
const mkone = async (c = {}) => {
  try {
    fstop = false, clearNow(nh), style(rnlt, { background: "lime" }), clearmsg(), upddfn()
    while (!fstop && select(c) !== stop) await now(); style(rnlt, { background: "" })
  } catch (e) { print(e, { color: "red" }), style(rnlt, { background: "red" }) }
}
const stopsim = () => (fstop = true, clearNow(nh), style(rnlt, { background: "" }))

const print = (s, style = {}) => sdbx.append(dom({ tag: "pre", child: s, style }))
const clearmsg = () => elm(sdbx, { innerHTML: "" })

const mktag = t => (...a) => dom({ tag: t, child: a })
const br = mktag("br"), h1 = mktag("h1")
dom({
  style: { maxWidth: 1000, minWidth: 300 }, child: [
    dom({ tag: "h1", child: "写一个角色生成器" }),
    "很烦，不想写css，简单点，", dom({ tag: "del", child: "全部都用" }),
    "（好吧，大部分都用）默认样式。", br(), br(),
    "这是一个最简单版本的角色生成器的编辑器。", br(),
    "不是角色生成器，而是角色生成器的编辑器。", br(), br(),
    "这是定义编辑区，在这里面编写角色的人生里可能发生的随机事件：", br(),
    $.def = dom({
      tag: "textarea", spellcheck: false,
      onkeydown: e => e.key == "s" && e.ctrlKey ? (e.preventDefault(), mkone()) : 0,
      oninput: () => setth(def)
    }),
    "这是个按钮，按一下生成一个角色：",
    $.exec = dom({ tag: "button", child: "▶", onclick: mkone }), br(),
    "这是仿真运行指示灯，如果它是绿色的，表明仿真还在运行，如果它是红色的，说明你的仿真出了点问题：",
    $.rnlt = dom({ class: "indicator" }), br(),
    "如果你想强行终止一次仿真，按这个按钮：",
    $.exec = dom({ tag: "button", child: "◼", onclick: () => stopsim() }), br(),
    "这是显示仿真结果的地方，使用print函数把信息打印出来：",
    $.sdbx = dom({ class: "result" }),
  ]
}, body)

style(def, { width: "100%", boxSizing: "border-box", lineHeight: lh })
style(def, { resize: "none", display: "block" })
css("button", { verticalAlign: "bottom" })
css("pre", { borderBottom: "0.5px solid", margin: 0 })
css(".result", { border: "0.5px solid", minHeight: 100, maxHeight: 400, overflow: "auto" })
css(".result", { paddingBottom: 15.5 })
css(".indicator", { display: "inline-block", width: 10, height: 10, background: "black" })

const store = idb(assign(scope($), { name: "charactergen" }))
store.def(JSON.stringify({
  [schgd.k]: ' // 定义选择函数，这个函数每回合运行一次\ndefsel(c => { // 参数c存储了角色的一切信息\n  if(!("live" in c)) { 出生(c) } // 当角色没有live属性时，生成角色\n\n  // 角色已经被创建了，我们以每个月为单位为TA安排一些事件\n  const y = floor(c.live / yms), m = floor(c.live % yms / mms)\n  print(`时间是第${y+1}年的第${m+1}个月`)\n  // 判定基础标签\n  const tgv = []; forin(tags, (k, f) => f(c) ? tgv.push(k) : 0)\n  // 判定复合标签\n  forin(ltags, (k, f) => f(c) ? tgv.push(k) : 0)\n  // 收集具有通过测试的标签的事件\n  const evts = [...nes]; forof(tgv, t => t in es ? evts.push(...es[t]) : 0)\n  // 计算事件的概率密度\n  let pdf = evts.map(({p}, i) => [isfct(p) ? p(c) : p, i]).filter(([p, i]) => p > 0), cdf = [], sum = 0\n  // 概率密度转积累分布\n  forof(pdf, ([v]) => cdf.push(sum += v)), cdf = cdf.map(c => c / sum)\n  // 随机选一个事件，进行状态转移\n  const magic = random(), si = pdf[bisearch(magic, cdf)]?.[1]\n  log(`第${y+1}年的第${m+1}个月`, ...pdf.map(([p, i], j) => [evts[i].n, p / sum]).flat())\n  const r = evts[si]?.f(c)\n  // 时间推进一个月\n  c.live += mms\n  // 返回stop表示生成结束，返回其他任何东西都会继续生成\n  return r\n})\n\n// 其余部分都是普通的js ==============================================================\n\nconst { log, clear } = console, dms = 24 * 60 * 60 * 1000, mms = 30 * dms, yms = 12 * mms\nclear()\n\nconst isnum = o => typeof o == "number", isfct = o => typeof o == "function"\nconst isstr = o => typeof o == "string", isbgi = o => typeof o == "bigint"\nconst isudf = o => o === undefined, isnth = o => isudf(o) || isnul(o)\nconst isobj = o => o && typeof o == "object", isnul = o => o === null\nconst isarr = Array.isArray, asarr = v => isarr(v) ? v : [v]\nconst isnumstr = s => isstr(s) && !isNaN(Number(s))\n\n\nconst forrg = (e, f, s = 0, d = 1) => { for (let i = s; d > 0 ? i < e : i > e; i += d) f(i) }\nconst maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)\nconst forin = (o, f) => { for (const k in o) f(o[k], k) }\nconst forof = (o, f) => { for (const v of o) f(v) }\nconst panic = e => { throw isstr(e) ? Error(e) : e }\n\nconst { random, floor } = Math\nconst d = n => floor(random() * n + 1)\nconst dn = (n, t) => maprg(t, () => d(n))\nconst sum = a => a.reduce((p, v) => p + v, 0)\n\nconst bisearch = (t, a, l = 0, r = a.length - 1) => {\n  if(t < a[0]) { return 0 } let m; while(r >= l) {\n    m = floor((l + r) / 2); if(t > a[m]) { l = m + 1 }\n    else if(t < a[m]) { r = m - 1 } else { return m }\n  } return l\n}\n\nconst 概率表生成概率函数 = o => {\n  let s = 0, vs = [], ks = []\n  forin(o, (v, k) => (vs.push(s += v), ks.push(k)))\n  vs = vs.map(v => v / s)\n  return () => ks[bisearch(random(), vs)]\n}\nconst tags = {}, tag = (n, f) => (n in $ ? panic(`重复标签${n}`) : tags[n] = $[n] = f, n), ltags = {}\nconst logic = (n, f) => (n in $ ? panic(`重复标签${n}`) : (f.type = "logic", ltags[n] = $[n] = f), n)\nconst ens = new Set, es = {}, nes = [], event = (n, p, f, t) => {\n  if (ens.has(n)) { panic(`重复事件${n}`) } else { ens.add(n) }\n  if (!(isfct(p) || isnum(p))) { panic(`在事件${n}中出现了既非函数也非具体数值的概率`) }\n  if (!isfct(f)) { panic(`在事件${n}中出现了不合法的状态转移函数`) }\n  if (!t) { return nes.push({ n, p, f }) }\n  if (!(t in tags) && !(t in ltags)) { panic(`事件${n}使用了不存在的标签${t}`) }\n  return (es[t]??=[]).push({n, t, p, f})\n}\n\n// 下面都是数据 ======================================================================\n\nconst 出身概率函数 = 概率表生成概率函数({\n  "农民": 100, "商人": 30, "军人": 30, "宗教": 10, "学者": 10, "贵族": 4, "皇族": 1 })\nconst sexstr = c => c.sex === "男" ? "他" : "她"\nconst 出生 = c => {\n  c.live = 0 // 自出生开始经过的时间\n  c.sex = d(2) > 1 ? "男" : "女"\n  c.str = sum(dn(10,19))\n  c.family = 出身概率函数()\n  print(`\n角色出生了，\n${sexstr(c)}出身自 ${c.family} 家庭，\n具有如下的能力数值：\n力量： ${c.str}`.trim())\n}\n\nevent("死亡", c => (c.live / yms)**2, c => (print("角色死亡了"), stop))\nevent("吃饭睡觉打豆豆", 30000, c => print("无所事事的一个月"))'
}))
schgd.get().then(r => (def.value = r, setth(def)))


// 成长类事件
// 角色发生成长，塑造角色的核心数值
// 由角色的核心成长值决定具体发生多少变化

// 技能类事件
// 角色学到某类技能或提升技能等级
// 学到的技能类别和角色出身强相关

// 社交类事件
// 角色和其他人发展出社会关联的事件
// 由于目前只仿真一个角色，暂时不会涉及其他角色的数值变化
// 社会关系会影响其他事件的发生概率以及成功判定

// 遭遇类事件
// 随机遭遇一些事件，根据角色的实际情况进行结果判定

// 判定的流程
// 每个事件都有一个概率定义函数，输入是角色的全部信息，输出是该事件的可能性大小
// 单个事件的发生概率就是该事件的可能性大小除以所有事件可能性的总和
// 随机选择一个事件，运行该事件的运作函数，对角色的状态进行修改
// 这构成一次完整的事件判定