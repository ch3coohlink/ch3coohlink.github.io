const { _df_, _rq_ } = (() => { // START OF MODULE "loader" ----------------------------------------
  const ms = new Map, exs = new Map, _df_ = (n, f) => ms.set(n, f)
  const err = n => { throw `module "${n}" is not found!` }
  const _rq_ = (n, s = new Set, r = (n, ex = o => exs.set(n, o)) => s.has(n) || exs.has(n) ? exs.get(n)
    : ms.has(n) ? (s.add(n), ms.get(n)(ex, r), s.delete(n), exs.get(n)) : err(n)) => r(n)
  return { _df_, _rq_ }
  })() // END OF MODULE "loader" ---------------------------------------------------------------------
  
  _df_("_list", (_ex_, _rq_) => { // START OF MODULE "_list" -----------------------------------------
  const lis_ = (s, ...a) => typeof s == "string" ? s : String.raw(s, ...a), ws_ = /\s+/ ?? ""
  const trim_ = (v, b) => b === ws_ ? v.trim() : v, emp_ = (r, b) => b === ws_ && !r[0] ? [] : r
  const _list = (s, b = ws_, ...a) => emp_(trim_(lis_(s, ...a), b).split(b), b)
  _ex_({ _list })
  }) // END OF MODULE "_list" ------------------------------------------------------------------------
  
  _df_("list", (_ex_, _rq_) => { // START OF MODULE "list" -------------------------------------------
  const { _list } = _rq_("_list")
  const groupby = (n, a) => map(range(ceil(lth(a) / n)), i => range(i * n, i * n + n).map(i => a[i]))
  const list = _list, lth = s => (isstr(s) ? [...s] : s).length
  const _pr = f => a => b => isarr(a) ? a.map(f(b)) : [f(b)(a)]
  const pairs = a => groupby(2, a).map(([a, b]) => _pr(_pr(a => b => [a, b]))(a)(b)).flat(2)
  const range = (s, e, t = 1) => ((i, r = []) => ((e !== 0 && !e) ? (e = s, s = 0) : 0,
    i = s, loop(t > 0 ? () => i < e : () => i > e, () => (r.push(i), i += t)), r))()
  const genarr = (o, s, e, t = 1) => range(s, e, t).map(isfuc(o) ? v => o(v) : () => clone(o))
  const arrpush = (r, i, ...v) => r[i] ? r[i].push(...v) : r[i] = [...v]
  const hopper = (a, r = []) => forof(a, a => iter(a, (v, i) => arrpush(r, i, v)), r)
  const _aggre = (a, r, l) => iter(a[0], (_, k) => r.push(range(l).map(i => a[i][k])), r)
  const aggreg = (...a) => _aggre(a, [], lth(a))
  const sliceby = (n, a, i = 0, r = [], g = v => a.slice(i, n[v] ? i = n[v] : undefined)) =>
    forof(range(lth(n) + 1), (v, x = g(v)) => x.length > 0 ? r.push(x) : 0, r)
  const tosums = (a, s = 0) => fold(a, [], (p, v) => p.concat(s += v))
  const ainit = a => a.slice(0, -1)
  const alast = a => a[lth(a) - 1]
  const ahead = a => a[0]
  const atail = a => a.slice(1)
  _ex_({ list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums })
  const { equal, clone } = _rq_("equal")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  }) // END OF MODULE "list" -------------------------------------------------------------------------
  
  _df_("flow", (_ex_, _rq_) => { // START OF MODULE "flow" -------------------------------------------
  const { _list } = _rq_("_list")
  const [lrt, lbk, lct] = _list`return break continue`.map(Symbol), loop = (j, f, r, c, t) => {
    while (j()) if ((c = f()) && (t = c[0])) if (t == lrt) { return c[1] }
    else if (t == lbk) { break } else if (t == lct) { continue } return r
  }, panic = e => { throw iserr(e) ? e : Error(e) }, doloop = (j, f, r, c, t) => {
    do if ((c = f()) && (t = c[0])) if (t == lrt) { return c[1] }
    else if (t == lbk) { break } else if (t == lct) { continue } while (j()) return r
  }, cases = (h, ...t) => ((m, d) => (c, ...a) => m.has(c) ? m.get(c)(...a) : d(...a))(dict(t), h)
  const forof = (a, f, r = a) => { for (const i of a) { f(i) } return r }
  const forin = (o, f, r = o) => { for (const k in o) { f(o[k], k) } return r }
  const trycat = (t, c, f = () => { }) => { try { t() } catch (e) { c(e) } finally { f() } }
  const trytry = (...a) => trycat(a[0], e => lth(a) > 1 ? trytry(...a.slice(1)) : panic(e))
  const iter = (s, f, r = s) => isitr(s) ? (k => forof(s, v => f(v, k++), r))(0) : forin(s, f, r)
  const map = (s, f) => (r => iter(s, (v, k) => r[k] = f(v, k), r))(isitr(s) ? [] : {})
  const fold = (s, i, f) => (iter(s, (v, k) => i = f(i, v, k)), i)
  const seen = (s = new Set) => (n, r = s.has(n)) => r ? r : (s.add(n), r)
  _ex_({ lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen })
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  }) // END OF MODULE "flow" -------------------------------------------------------------------------
  
  _df_("type", (_ex_, _rq_) => { // START OF MODULE "type" -------------------------------------------
  const { _list } = _rq_("_list")
  const rtype = _list`bigint boolean function number string symbol`
  const [isbin, isbol, isfuc, isnum, isstr, issym] = rtype.map(t => o => typeof o == t)
  const [isset, ismap, isdat, iserr] = [Set, Map, Date, Error].map(t => o => o instanceof t)
  const isobj = o => o && typeof o == "object"
  const isitr = a => isfuc(a?.[Symbol.iterator])
  const toarr = o => isitr(o) ? [...o] : fold(o, [], (p, v, k) => p.concat([[k, v]]))
  const clrarr = a => a.splice(0, lth(a))
  const btw = (l, n, r) => l <= n && n <= r
  const isarr = Array.isArray
  const clct = a => new Set(a)
  const dict = a => new Map(isarr(a) ? pairs(a) : a)
  const asarr = a => isarr(a) ? a : [a]
  _ex_({ isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr })
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  }) // END OF MODULE "type" -------------------------------------------------------------------------
  
  _df_("buildin", (_ex_, _rq_) => { // START OF MODULE "buildin" -------------------------------------
  const now = performance.now.bind(performance)
  const { log, dir, error, clear, table } = console
  const { ceil, floor, imul, sqrt, min, max } = Math
  const { fromCharCode: c2str, fromCodePoint: p2str } = String
  const str2c = s => s.charCodeAt(0), str2p = s => s.codePointAt(0)
  const logn = n => (...v) => log(...v.slice(0, n)), log1 = logn(1)
  const logobj = (...a) => forof(a, (o, r = [""], f = (v, k) => r.push("|" + k, v, "\n")
  ) => (iter(o, ismap(o) ? ([k, v]) => f(v, k) : f), log(...r)))
  _ex_({ now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p })
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  }) // END OF MODULE "buildin" ----------------------------------------------------------------------
  
  _df_("genhash", (_ex_, _rq_) => { // START OF MODULE "genhash" -------------------------------------
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const genhash = (seed=0) => {
  const ignore_order = (p, v) => p ^ (v ^ (v << 16) ^ 89869747) * 3644798167
  const str = o => [...JSON.stringify(o) ?? ""].reduce((p, v) => imul(31, p) ^ str2c(v) | 0, seed)
  const hash = (...a) => a.map(v => isarr(v) ? str(v.map(v => hash(v))) : isobj(v) ? hash(...toarr(v)): str(v))
                          .reduce(ignore_order, seed) * 69069 + 907133923 | 0
  return { str, hash }
  }; _ex_({ genhash })
  }) // END OF MODULE "genhash" ----------------------------------------------------------------------
  
  _df_("hash", (_ex_, _rq_) => { // START OF MODULE "hash" -------------------------------------------
  const { genhash } = _rq_("genhash")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const shuffle = (v, n) => n > 0 ? shuffle(v.map(String).map(str), n - 1) : v
  const _genmulti = n => [0].concat(shuffle([...Array(n).keys()].slice(1), 100)).map(v => genhash(v).hash)
  const multihash = (n, fs = _genmulti(n)) => (...s) => fs.map(f => f(...s)).join("")
  const { str, hash } = genhash(), hash64 = multihash(2)
  _ex_({ multihash, hash, hash64 })
  }) // END OF MODULE "hash" -------------------------------------------------------------------------
  
  _df_("equal", (_ex_, _rq_) => { // START OF MODULE "equal" -----------------------------------------
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const eq1by1 = ([l, r]) => fold(l, true, (p, v, k) => p ? equal(v, r[k]) : p)
  const eqmulti = (a, obj = false) => eqlen(obj ? a.map(Object.keys) : a) && eq1by1(a)
  const eqlen = ([l, r]) => lth(l) == lth(r), [boths, bothm, botha, bothi] =
    [isset, ismap, isarr, isitr].map(f => ([l, r]) => f(l) && f(r))
  const eqval = (a, [l, r] = a) => boths(a) || bothm(a) ? equal(hash64(l), hash64(r))
    : botha(a) ? eqmulti(a) : bothi(a) ? eqmulti(a.map(toarr)) : eqmulti(a, true)
  const equal = (l, r) => l === r ? true : isobj(l) && isobj(r) ? eqval([l, r]) : false
  const _cl = (o, c) => iter(o, (v, k) => c[k] = clone(v), c)
  const clone = o => isset(o) ? _cl(o, new Set(toarr(o))) : ismap(o) ? _cl(o, new Map(toarr(o)))
    : isdat(o) ? _cl(o, new Date(o)) : isfuc(o) ? _cl(o, o.bind({})) : isobj(o) ? map(o, clone) : o
  _ex_({ equal, clone })
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { multihash, hash, hash64 } = _rq_("hash")
  }) // END OF MODULE "equal" ------------------------------------------------------------------------
  
  _df_("graph", (_ex_, _rq_) => { // START OF MODULE "graph" -----------------------------------------
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { equal, clone } = _rq_("equal")
  let conts = [], _ex = 0, summit = (...t) => { forof(t, f => conts.push(f)) }
  const single = f => () => _ex ? 0 : (_ex = 1, trycat(f, e => (clrarr(conts), panic(e)), () => _ex = 0))
  const excute = single(c => { while (c = conts.shift()) c() }) // shift -> bfs, pop -> dfs
  const rambda = (f, s = [], w = (...a) => new Promise(async rs => (
    summit(r => (rs(r = f(...a)), summit(...s.map(f => () => f(r))))), excute()))) => (w["to"] = s, w)
  const lambda = (f, s = [], w = (...a) => // current call order: f, a_in_f, f_to, a_in_f_to
    (summit(r => (r = f(...a), summit(...s.map(f => () => f(r))))), excute())) => (w["to"] = s, w)
  const link = (f, t) => forof(asarr(f), f => forof(asarr(t), t => f.to.push(t)))
  const unlink = (f, t) => forof(asarr(f), f => f.to = f.to.filter(f => !asarr(t).some(t => f === t)))
  const backup = (c = clone(conts), r = _ex) => (clrarr(conts), _ex = 0, [c, r])
  const skip = (f, [c, r] = backup()) => (f(), conts.splice(0, 0, ...c), _ex = r)
  const tryskip = (...a) => skip(() => trytry(...a))
  _ex_({ rambda, lambda, link, unlink, backup, skip, tryskip })
  }) // END OF MODULE "graph" ------------------------------------------------------------------------
  
  _df_("string", (_ex_, _rq_) => { // START OF MODULE "string" ---------------------------------------
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const splitraw = (s, g, r = [], p, c
    , _ = (i, t = s.slice(p ? p.index + lth(p[0]) : 0, i)) => t ? r.push(t) : 0 ) => (
    g.global ? 0 : panic("splitraw only accept global regex"),
    loop(() => c = g.exec(s), () => (_(c.index), r.push(p = c))), _(lth(s)), r)
  const upfst = ([s, ...e]) => s.toLocaleUpperCase(navigator.language) + e.join("")
  const lwfst = ([s, ...e]) => s.toLocaleLowerCase(navigator.language) + e.join("")
  const hyphenate = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
  const indent = (text, n = 2) => text.split(/\r\n?|\n/).map(v => " ".repeat(n) + v).join("\n")
  _ex_({ splitraw, upfst, lwfst, hyphenate, indent })
  }) // END OF MODULE "string" -----------------------------------------------------------------------
  
  _df_("auxkey", (_ex_, _rq_) => { // START OF MODULE "auxkey" ---------------------------------------
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { splitraw, upfst, lwfst, hyphenate, indent } = _rq_("string")
  const asckey = list`Alt Shift Control`
  const spkey = new Set(asckey)
  const asc2str = e => asckey.map(k => e[(k == "Control" ? "ctrl" : lwfst(k)) + "Key"] ? k : "").filter(v => v)
  _ex_({ asckey, spkey, asc2str })
  }) // END OF MODULE "auxkey" -----------------------------------------------------------------------
  
  _df_("dom", (_ex_, _rq_) => { // START OF MODULE "dom" ---------------------------------------------
  const { rambda, lambda, link, unlink, backup, skip, tryskip } = _rq_("graph")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { splitraw, upfst, lwfst, hyphenate, indent } = _rq_("string")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const event = (elm, type, v = lambda(e => e)) => (elm.addEventListener(type, v), v)
  const render = lambda((t = 0) => (requestAnimationFrame(render), t))
  
  const dsplice = (parent, start, count, ...nodes) => ((cn = parent.childNodes
    , rm = [], l = lth(cn), df = document.createDocumentFragment()
    , s = start < 0 ? l + start : start, e = isnum(count) ? s + count : l) => (
    forof(range(s, e), () => cn[s] ? rm.push(parent.removeChild(cn[s])) : 0),
    forof(nodes, e => df.appendChild(e)), parent.insertBefore(df, cn[s]), rm))()
  
  const _dom = cases((e, v, k) => e[k] = v, 
    "class", (e, v, k) => e.setAttribute(k, isarr(v) ? v.join(" ") : v),
    "child", (e, v) => e.append(...v),
    "parent", (e, v) => v ? v.appendChild(e) : 0,
    "style", (e, v) => style(e, v))
  const style = (elm, ...style) => forof(style, s => iter(s, (v, k) => elm.style[k] = px(v)), elm)
  const dom = (n, o = {}, f = v => v , e = isstr(n) ? document.createElement(n) : n) => 
    f(iter(o, (v, k) => _dom(k, e, v, k), e))
  
  const csselm = dom("style", { parent }), px = v => isnum(v) ? `${v}px` : v
  const content = s => fold(s, "", (p, v, k) => p + `${hyphenate(k)} : ${px(v)}; `)
  const css = (r, s) => { csselm.sheet.insertRule(`${r} { ${content(s)}}`) }
  const body = dom("div", { parent, tabIndex: "0", style: { width: "100vw", height: "100vh", overflow: "auto" } })
  
  const copy = t => navigator.clipboard.writeText(t)
  setenv({ copy })
  _ex_({ event, render, dsplice, style, dom, css, body })
  }) // END OF MODULE "dom" --------------------------------------------------------------------------
  
  _df_("input", (_ex_, _rq_) => { // START OF MODULE "input" -----------------------------------------
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { asckey, spkey, asc2str } = _rq_("auxkey")
  const { rambda, lambda, link, unlink, backup, skip, tryskip } = _rq_("graph")
  const { event, render, dsplice, style, dom, css, body } = _rq_("dom")
  const input = (ta) => {
  const [kd, ip] = list`keydown input`.map(v => event(ta, v))
  const ks = rambda((e, k = e.key) => [].concat(asc2str(e), spkey.has(k) ? [] : k).join(" "))
  const cmds = new Map, getcmd = (a, b = true, k = a.join(" ")) => 
    (cmds.has(k) ? 0 : cmds.set(k, [lambda(v => v), b]), cmds.get(k)[0])
  link(kd, async (e, s, f, b) => (s = await ks(e), [f, b] = cmds.get(s) ?? [],
    spkey.has(s) || b ? e.preventDefault() : 0, f ? f() : 0))
  return { getcmd, kd, ip, keystr: ks }
  }; _ex_({ input })
  }) // END OF MODULE "input" ------------------------------------------------------------------------
  
  _df_("store", (_ex_, _rq_) => { // START OF MODULE "store" -----------------------------------------
  const store = (name="default", store="default") => {
  const _ = null, ro = f => action("readonly", f), rw = f => action("readwrite", f)
  const dbp = new Promise((res, rej, r = indexedDB.open(name)) => (r.onsuccess = () => res(r.result),
    r.onupgradeneeded = () => r.result.createObjectStore(store), r.onerror = () => rej(r.error)))
  const action = (type, cb) => dbp.then(db => new Promise((r, j, t = db.transaction(store, type)) =>
      (t.oncomplete = () => r(), t.onabort = t.onerror = () => j(t.error), cb(t.objectStore(store)))))
  const key = (r = _) => ro(s => s.getAllKeys().onsuccess = e => r = e.target.result).then(() => r)
  const val = (r = _) => ro(s => s.getAll().onsuccess = e => r = e.target.result).then(() => r)
  const get = (k, r = _) => ro(s => r = s.get(k)).then(() => r.result), clr = () => rw(s => s.clear())
  const set = (k, v) => rw(s => s.put(v, k)), del = k => rw(s => s.delete(k))
  return { get, set, del, clr, key, val }
  }; _ex_({ store })
  }) // END OF MODULE "store" ------------------------------------------------------------------------
  
  _df_("uuid", (_ex_, _rq_) => { // START OF MODULE "uuid" -------------------------------------------
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const uuidslc = a => sliceby(tosums([8, 4, 4, 4, 12]), a.join("")).join("-")
  const uuid = () => uuidslc(genarr(_ => Math.random().toString(16).slice(2, 10), 4))
  _ex_({ uuid })
  }) // END OF MODULE "uuid" -------------------------------------------------------------------------
  
  _df_("deserial", (_ex_, _rq_) => { // START OF MODULE "deserial" -----------------------------------
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const star = (a, r = [[], []]) => map(a, a => /^\*/.exec(a) ?  ["ref", a.slice(1)] : ["normal", a])
  const deft = (o, [t, ...a]) => o[t] ? o[t].push(...a) : o[t] = a
  const _arg = cases(deft,
    "expose", (o, [t, ...a]) => deft(o, [t, ...star(a)]),
    list`async text`, (o, [t]) => o[t] = true,
    list`open close simple plain`, (o, [t, n, ...a]) => (o.type = t, o.name = n, o.param = star(a)))
  const deserial = (t, o = {}, p = [], s = (s, t, r = t.trim()) => r ? r.split(s) : [], l = s("\n", t)
    , _ = (t, r = s("|", t).map(v => list(v))) => forof(r, a => p.push(a)), st = /^(\s*)?\/\/#/) => (
    forof(l, (v, r = v.match(st)) => (r ? _(v.slice(r[0].length)) : p.push(["source", v]))),
    forof(p, v => _arg(v[0], o, v), o))
  _ex_({ deserial })
  }) // END OF MODULE "deserial" ---------------------------------------------------------------------
  
  _df_("template", (_ex_, _rq_) => { // START OF MODULE "template" -----------------------------------
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const hd = n => `_df_("${n}", (_ex_, _rq_) => {`
  const sphd = (n, a, eo) => `${eo == "{}"? ";" : `const ${eo} = `}(${a ? "async " : ""}() => {`
  const exo = e => e.length == 0 ? "{}" : `{ ${e.join(", ")} }`
  const rtexo = eo => eo == "{}" ? [] : `return ${eo}`
  const impt = cases(_ => _, "normal", (n, ...c) => `const ${exo(c)} = _rq_("${n}")`)
  const rq = r => r.map(a => impt(...a)), exp = eo => `_ex_(${eo})`
  const fillto = (s, c = 110, l = s.length) => s + "-".repeat(Math.max(0, 100 - l))
  const start = (h, n) => fillto(h + ` // START OF MODULE${n?` "${n}" `:""}`)
  const end = (h, n) => fillto(h + ` // END OF MODULE${n?` "${n}" `:""}`)
  const param = p => p.map(([t, ...n]) => t == "ref" ? exo(n) : n[0] ).join(", ")
  
  const cm = f => (o, { n, r, b } = o) => [].concat(start(hd(n), n), rq(r), f(o), rq(b), end("})", n))
  const simple = ({ n, a, s, r, b, e, i }, eo = exo(e)) => [].concat(
    start(sphd(n, a, eo), n), rq(r), i, s, rq(b), rtexo(eo), end("})()", n))
  const open = cm(({ s, e, i }, eo = exo(e)) => [].concat(i, s, exp(eo)))
  const close = cm(({ n, p, s, e, r, i, a }, eo = exo(e)) => [].concat(
    `const ${n} = ${a ? "async " : ""}(${param(p)}) => {`, i, s, rtexo(eo), "}; " + exp(exo([n]))))
  const samename = a => [].concat(...a.map(n => [n, eval(n)]))
  const _t = cases(_ => [], "plain", ({s}) => s, ...samename(list`simple open close`))
  const tplt = (t, o) => _t(t, o).join("\n")
  _ex_({ tplt })
  }) // END OF MODULE "template" ---------------------------------------------------------------------
  
  _df_("Icodegen", (_ex_, _rq_) => { // START OF MODULE "Icodegen" -----------------------------------
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const wps = dict(list`type t name n async a text tx param p expose e require r back b replace rp source s inner i`)
  const warpname = (o, r = fold(o, {}, (p, v, k) => (wps.has(k) ? p[wps.get(k)] = v : 0, p))) => (
    r.t = r.t ?? "simple", iter(list`p s e r b i`, k => r[k] = r[k] ?? [], r))
  _ex_({ warpname })
  }) // END OF MODULE "Icodegen" ---------------------------------------------------------------------
  
  _df_("codebase", (_ex_, _rq_) => { // START OF MODULE "codebase" -----------------------------------
  const { store } = _rq_("store")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { uuid } = _rq_("uuid")
  const { deserial } = _rq_("deserial")
  const ed = store("editordata"), cb = store("codebase")
  const newsnip = (t = Date.now()) => ({ source: "", id: uuid(), create: t , modify: t })
  const savesnip = async (buffers, t = Date.now()) => (ed.set("live", buffers),
    await Promise.all(map(buffers, async (l, i) => {
      const o = await cb.get(l.id) ?? {}, create = o.create ?? l.create ?? t
      const source = l.source, modify = l.modify ?? o.modify ?? create
      return await cb.set(l.id, { source, create, modify: create, object: deserial(source) })
  })))
  const exportJSON = async () => log(JSON.stringify(
    await Promise.all(map(await cb.key(), async k => ({ id: k, ...await cb.get(k) })))))
  const importJSON = data => savesnip(JSON.parse(data))
  _ex_({ ed, cb, newsnip, savesnip })
  }) // END OF MODULE "codebase" ---------------------------------------------------------------------
  
  _df_("gencode", (_ex_, _rq_) => { // START OF MODULE "gencode" -------------------------------------
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { tplt } = _rq_("template")
  const { multihash, hash, hash64 } = _rq_("hash")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const { warpname } = _rq_("Icodegen")
  const gencode = (o, n2o, loader="") => {
  const rp = [], st = seen(), sn = seen(), on = o.name
  const hasthis = ({n, r, b, p, e}) => sn(hash64({n, r, b, p, e}))
  const dep = (o, f) => forof(list`r b p e i`, k => o[k] = map(o[k],
    k == "p" || k == "e" ? ([t, v]) => [t, t == "ref" ? f(v) : v] : v => f(v)))
  const pre = (a, o = warpname(a), n = o.n ?? "", vn = n, h, rh, i = 1, ds = clct()) => (
    rp.push(dict(o.rp ?? [])), rh = hash64(rp.map(toarr).flat(Infinity)),
    dep(o, n => (forof(rp, r => r.has(n) ? n = r.get(n) : 0), ds.add(n), n)),
    rp.pop(), forof(ds, n => st(hash64([n, rh])) ? n : pre(n2o(n))),
    hasthis(o) ? 0 : (loop(() => d.has(vn), () => vn = n + "$" + i++), d.set(vn, o)), vn)
  
  const ccl = a => `circular reference when using * is not allowed: "{a.join(" ")}"`
  const expose = (o, s = seen(), r = [] , _ = o => s(o.n) ? panic(ccl(toarr(s)))
    : forof(o.e, ([t, ...n]) => t == "ref" ? forof(n, n => _(get(n))) : r.push(...n)) ) => (_(o), r)
  const expandr = (n, o = get(n)) => caser(o.tx ?? o.t, o), caser = cases(({n}) => (fd.add(n), ["normal", n, n]),
    list`plain simple`, o => ["text", o.n], "open", o => (fd.add(o.n), ["normal", o.n, ...expose(o)]))
  const expandp = ([t, n]) => [t, ...t == "ref" ? expose(get(n)) : [n]]
  const expand = ([n, o]) => (forof(list`r b`, k => o[k] = map(o[k], n => expandr(n))),
    o.p = map(o.p, v => expandp(v)), o.e = [["normal", ...expose(o)]], o)
  const expdtxt = (a, [t, n] = a) => t == "text" ? [t, gen(n)] : a
  const expand2 = ([n, o]) => (o.e = o.e[0].slice(1), o.i = o.i.map(n => gen(n)),
    forof(list`r b`, k => o[k] = map(o[k], v => expdtxt(v))), o)
  
  const cclget = n => panic(`you somehow made a sneaky self reference on "${n}"!`)
  const c = dict(), d = dict(), fd = clct(), get = n => d.get(n) ?? cclget(n)
  const gentext = n => `const ${n} = ${JSON.stringify(gencode({ ...n2o(n), text: false }, n2o))}`
  const gen = (n, o = get(n), { t, tx, e } = o, rs = c.get(n) ?? (tx
    ? tplt("open", { ...o, s: [gentext(n)], e: [n] }) : tplt(t, o)) ) => (c.set(n, rs), rs)
  
  pre(o), forof(d, expand), forof(d, expand2), fd.add(alast(toarr(d))[0])
  return (loader ? [loader] : []).concat(map(fd, n => gen(n))).join("\n\n")
  }; _ex_({ gencode })
  }) // END OF MODULE "gencode" ----------------------------------------------------------------------
  
  _df_("loader", (_ex_, _rq_) => { // START OF MODULE "loader" ---------------------------------------
  const loader = "const { _df_, _rq_ } = (() => { // START OF MODULE \"loader\" ----------------------------------------\nconst ms = new Map, exs = new Map, _df_ = (n, f) => ms.set(n, f)\nconst err = n => { throw `module \"${n}\" is not found!` }\nconst _rq_ = (n, s = new Set, r = (n, ex = o => exs.set(n, o)) => s.has(n) || exs.has(n) ? exs.get(n)\n  : ms.has(n) ? (s.add(n), ms.get(n)(ex, r), s.delete(n), exs.get(n)) : err(n)) => r(n)\nreturn { _df_, _rq_ }\n})() // END OF MODULE \"loader\" ---------------------------------------------------------------------"
  _ex_({ loader })
  }) // END OF MODULE "loader" -----------------------------------------------------------------------
  
  _df_("buffer", (_ex_, _rq_) => { // START OF MODULE "buffer" ---------------------------------------
  const { rambda, lambda, link, unlink, backup, skip, tryskip } = _rq_("graph")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const buffer = (buffers=[]) => {
  const bfidx = b => buffers.indexOf(b)
  const append = rambda((i, b) => (buffers.splice(i, 0, ...b), [i, b]))
  const remove = rambda((i, c) => [i, buffers.splice(i, c)])
  return { buffers, bfidx, append, remove }
  }; _ex_({ buffer })
  }) // END OF MODULE "buffer" -----------------------------------------------------------------------
  
  _df_("bfloc", (_ex_, _rq_) => { // START OF MODULE "bfloc" -----------------------------------------
  const { rambda, lambda, link, unlink, backup, skip, tryskip } = _rq_("graph")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const bfloc = ({ buffers, bfidx, append, remove }, loc=0) => {
  const setloc = lambda(n => btw(0, n, buffers.length) ? loc = n : panic("invalid loc: " + n)), getloc = () => loc
  link(append, ([i, b]) => loc >= i ? setloc(loc + b.length) : 0)
  link(remove, ([i, b]) => loc >= i ? setloc(max(i, loc - b.length)) : 0)
  return { setloc, getloc }
  }; _ex_({ bfloc })
  }) // END OF MODULE "bfloc" ------------------------------------------------------------------------
  
  _df_("editors", (_ex_, _rq_) => { // START OF MODULE "editors" -------------------------------------
  const { event, render, dsplice, style, dom, css, body } = _rq_("dom")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { rambda, lambda, link, unlink, backup, skip, tryskip } = _rq_("graph")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { input } = _rq_("input")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { ed, cb, newsnip, savesnip } = _rq_("codebase")
  const editors = ({ buffers, bfidx, append, remove }, { setloc, getloc }, { toggle, build }) => {
  const { editor } = (() => { // START OF MODULE "editor" --------------------------------------------
  const editor = b => {
  const t = dom("textarea", { value: b.source, spellcheck: 0, class: "editor_textarea" },
    e => style(e,
    { margin: 0, padding: 0, boxSizing: "border-box" },
    { width: "100%", resize: "none", overflow: "hidden" },
    { paddingLeft: 10, paddingRight: 10, display: "block", borderRadius: 0 },
    { fontFamily: 'Consolas, "Courier New", monospace', fontWeight: "normal" },
    { fontSize: 14, fontFeatureSettings: '"liga" 0, "calt" 0' },
    { lineHeight: lineh, letterSpacing: 0, textSizeAdjust: "100%" }))
  const rsz = () => (style(t, { height: 0 }), style(t, { height: t.scrollHeight + lineh }))
  const ip = input(t), c = (s, f) => link(ip.getcmd(list(s)), f)
  link(ip.ip, [() => b.source = t.value, rsz, autosave])
  link(event(t, "pointerdown"), () => setloc(bfidx(b) + 1)),
  c("Control ArrowUp", () => scroll(-samount))
  c("Control ArrowDown", () => scroll(samount))
  c("Control Enter", toggle)
  c("Shift Enter", () => pickup ? build(pickup.source, pickup.id) : build(b.source, b.id))
  c("Control p", () => (pickup = b, log(`set script "${b.id}" as default execution target`)))
  c("Control o", () => (pickup = null, log("cancel default execution")))
  c("Insert", () => append(getloc(), [newsnip()]))
  c("Shift Insert", () => append(getloc(), [newsnip()]))
  c("Control s", saveall), c("Shift S", tojson)
  c("Delete", async () => history.push(await remove(bfidx(b), 1)))
  c("Shift Delete", (op = history.pop()) => op ? append(...op) : 0)
  c("PageUp", () => setloc(max(getloc() - 1, 1)))
  c("PageDown", () => setloc(min(getloc() + 1, buffers.length)))
  c("Shift PageUp", async (i = bfidx(b) - 1) => i >= 0
    ? (append(i, (await remove(i, 2))[1].reverse()), setloc(i + 1)) : 0)
  c("Shift PageDown", async (i = bfidx(b)) => i < buffers.length - 1
    ? append(i, (await remove(i, 2))[1].reverse()) : 0)
  edt2dom.set(b, t).set(t, b), setTimeout(rsz)
  return t
  }
  return { editor }
  })() // END OF MODULE "editor" ---------------------------------------------------------------------
  let pickup, samount = 100, scroll = n => body.scrollBy(0, n)
  const lineh = 20, history = [], edt2dom = dict()
  const edts = dom("div", { parent: body }, e => style(e, { paddingBottom: "50vh" }))
  const rmb2e = b => (edt2dom.delete(edt2dom.get(b)), edt2dom.delete(b))
  link(append, ([i, b]) => dsplice(edts, i, 0, ...b.map(editor)))
  link(remove, ([i, b]) => (dsplice(edts, i, b.length), forof(b, rmb2e)))
  link(setloc, (n, t = edt2dom.get(buffers[max(n - 1, 0)])) => t ? t.focus() : 0)
  
  const autosave = () => window.onbeforeunload = saveall
  const saveall = () => (savesnip(buffers), window.onbeforeunload = undefined)
  const tojson = () => log(JSON.stringify(buffers, null, 2))
  
  ;(async () => { link(setloc, n => ed.set("loc", n))
  const [l, a] = await Promise.all(list`loc live`.map(v => ed.get(v)))
  append(0, forof(a ?? [newsnip()], b => iter(newsnip(), (v, k) => b[k] ? 0 : b[k] = v)))
  setTimeout(() => setloc(l ?? 0)), toggle() })()
  return { samount, scroll, lineh, history }
  }; _ex_({ editors })
  }) // END OF MODULE "editors" ----------------------------------------------------------------------
  
  _df_("build", (_ex_, _rq_) => { // START OF MODULE "build" -----------------------------------------
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { event, render, dsplice, style, dom, css, body } = _rq_("dom")
  const { deserial } = _rq_("deserial")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { gencode } = _rq_("gencode")
  const { loader } = _rq_("loader")
  const build = ({ buffers, bfidx, append, remove }) => {
  const edvpad = 8, evaldv = dom("div", { parent }, v => style(v, { transition: "all 0.3s" },
    { height: "100vh", width: "100vw", position: "absolute", background: "white" },
    { transform: "scale(0.5)", transformOrigin: "100% 100%", bottom: edvpad, overflow: "hidden" },
    { boxShadow: "0px 10px 50px -20px #000, 5px 5px 15px 5px #000" }))
  const toggle = ((b = false) => () => style(evaldv, { right: !(b = !b) ? edvpad : "-55vw" }))()
  const cancel = (g, c) => ((id = g()) => loop(() => id--, () => c(id)))()
  const sandbox = (c, parent = evaldv) => (evaldv.innerHTML = "",
    cleanAnimationFrame(), cleanInterval(), cleanTimeout(), eval(c))
  const ld = loader.trim(), build = (t, id = "dummy", o = deserial(t)) => {
    const sn = seen(), cache = dict([].concat(...buffers.map(({ source: s }) =>
      ((o, n = o.name) => n && sn(n) ? panic("duplicate name: " + n) : [n, o])(deserial(s)))))
    sandbox(gencode(o, n => cache.get(n) ?? panic(`module "${n}" not found`), ld) + `\n//# sourceURL=${id}.js`)
  }
  return { toggle, build }
  }; _ex_({ build })
  }) // END OF MODULE "build" ------------------------------------------------------------------------
  
  _df_("terminal", (_ex_, _rq_) => { // START OF MODULE "terminal" -----------------------------------
  const { event, render, dsplice, style, dom, css, body } = _rq_("dom")
  const { rambda, lambda, link, unlink, backup, skip, tryskip } = _rq_("graph")
  const { input } = _rq_("input")
  const { list, groupby, lth, pairs, range, genarr, arrpush, hopper, aggreg, ainit, alast, ahead, atail, sliceby, tosums } = _rq_("list")
  const { splitraw, upfst, lwfst, hyphenate, indent } = _rq_("string")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const terminal = () => {
  const font = [{ fontFamily: 'Consolas, "Courier New", monospace', fontWeight: "normal" },
    { fontSize: 14, fontFeatureSettings: '"liga" 0, "calt" 0', wordBreak: "break-all" },
    { lineHeight: 20, letterSpacing: 0, textSizeAdjust: "100%" }]
  const edvpad = 8, termdv = dom("div", { parent }, v => style(v, ...font,
    { height: "calc(50vh - 30px)", width: "50vw", position: "absolute", background: "white" },
    { top: edvpad, right: edvpad, overflow: "auto", padding: "2em", boxSizing: "border-box" },
    { boxShadow: "0px 10px 50px -20px #000, 5px 5px 15px 5px #000" },
    { background: "black", color: "white", opacity: "0.8", transition: "all 0.3s" }))
  const textbf = dom("span", { parent: termdv, style: { whiteSpace: "pre-wrap" } })
  const inputdv = dom("div", { parent: termdv, style: { display: "flex" } })
  const prompt = dom("span", { parent: inputdv, textContent: ">\u00a0", style: {color:"yellow"} })
  const t = dom("textarea", { parent: inputdv, spellcheck: 0 }, v => style(v, ...font,
    { resize: "none", overflow: "hidden", background: "rgba(0,0,0,1)" },
    { color: "white", border: 0, padding: 0, width: "100%" }))
  
  const setstate = b => style(termdv, { transform: (state = b) ? "" : "translateX(110%)" })
  let state = false, toggle = () => setstate(!state); setstate(false)
  
  const scroll2bottom = () => { termdv.scrollTop = termdv.scrollHeight }
  const rsz = () => (style(t, { height: 0 }), style(t, { height: t.scrollHeight + 20 }))
  const res = [], ip = input(t), wait = () => new Promise(rs => res.push(rs))
  const setinput = i => t.value = i, write = (...s) => (dom(textbf,
    { textContent: (textbf.textContent + s.join("")).slice(-100000) }), scroll2bottom())
  const clear = () => { dom(textbf, { textContent: "" }) }
  const execute = () => ahead(res) ? (res.shift()(t.value), t.value = "", rsz()) : 0
  
  const env = {}, delenv = o => iter(o, (_, k) => delete env.k)
  const setenv = o => iter(o, (v, k) => env[k] ? 0 : env[k] = v)
  const envstr = () => `const { ${map(toarr(env), ([k]) => k).join(", ")} } = env;\n`
  
  rsz(); link(ip.kd, e => { scroll2bottom(), rsz() })
  link(ip.getcmd(list`Shift Enter`), execute)
  ;(async () => { while(1) { const i = await wait()
  write("> "+ indent(i).slice(2) + "\n")
  try { write(await eval(envstr() + i) + "\n") }
  catch (e) { write(e.stack + "\n") } } })()
  return { write, setinput, wait, execute, clear, setenv, delenv, envstr, setstate, toggle }
  }; _ex_({ terminal })
  }) // END OF MODULE "terminal" ---------------------------------------------------------------------
  
  _df_("codegenbyname", (_ex_, _rq_) => { // START OF MODULE "codegenbyname" -------------------------
  const { ed, cb, newsnip, savesnip } = _rq_("codebase")
  const { deserial } = _rq_("deserial")
  const { store } = _rq_("store")
  const { lrt, lbk, lct, loop, panic, doloop, cases, forof, forin, trycat, trytry, iter, map, fold, seen } = _rq_("flow")
  const { gencode } = _rq_("gencode")
  const { isbin, isbol, isfuc, isnum, isstr, issym, isset, ismap, isdat, iserr, isobj, isitr, isarr, toarr, clrarr, btw, clct, dict, asarr } = _rq_("type")
  const { event, render, dsplice, style, dom, css, body } = _rq_("dom")
  const codegenbyname = async (name, opt, useloader=true) => {
  const sn = seen(), cache = dict([].concat(...(await ed.get("live")).map(({ source: s }) =>
    ((o, n = o.name) => n && sn(n) ? panic("duplicate name: " + n) : [n, o])(deserial(s)))))
  
  const n2o = n => cache.get(n) ?? panic(`module "${n}" not found`)
  const l = gencode({...n2o("loader"), text: false}).trim()
  return gencode({ ...n2o(name), ...opt }, n2o, useloader ? l : "")
  }; _ex_({ codegenbyname })
  }) // END OF MODULE "codegenbyname" ----------------------------------------------------------------
  
  const { tm } = (() => { // START OF MODULE "lifesupport" -------------------------------------------
  const { event, render, dsplice, style, dom, css, body } = _rq_("dom")
  const { terminal } = _rq_("terminal")
  const { store } = _rq_("store")
  const { codegenbyname } = _rq_("codegenbyname")
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const { ed, cb, newsnip, savesnip } = _rq_("codebase")
  const { deserial } = _rq_("deserial")
  ;(() => { // START OF MODULE "grapheditor" ---------------------------------------------------------
  const { now, log, dir, error, clear, table, logn, log1, logobj, ceil, floor, imul, sqrt, min, max, c2str, p2str, str2c, str2p } = _rq_("buildin")
  const { buffer } = _rq_("buffer")
  const { bfloc } = _rq_("bfloc")
  const { editors } = _rq_("editors")
  const { build } = _rq_("build")
  const { event, render, dsplice, style, dom, css, body } = _rq_("dom")
  css(".editor_textarea:focus", { boxShadow: "inset 0 0 5px green" })
  const bf = buffer(), loc = bfloc(bf)
  const bd = build(bf), edts = editors(bf, loc, bd)
  })() // END OF MODULE "grapheditor" ----------------------------------------------------------------
  css("textarea:focus", { outline: "none" })
  const tm = terminal()
  const genbooter = () => codegenbyname("bootstrap")
  const genloader = loader => codegenbyname("lifesupport", { inner: loader ? [loader] : [] })
  const genandset = async (name, loader) => setloader(name, await genloader(loader))
  const genandload = async (name, loader) => load(name, await genloader(loader))
  const gensetload = async (name, loader) => (await genandset(name, loader), await genandload(name, loader))
  const update = name => genandset(name, name)
  tm.setenv({ genbooter, genloader, genandset, genandload, gensetload, update })
  body.addEventListener("keydown", e => e.key == "`" && e.altKey ? tm.toggle() : 0)
  return { tm }
  })() // END OF MODULE "lifesupport" ----------------------------------------------------------------