$.isnum = o => typeof o == "number", $.isfct = o => typeof o == "function"
$.isstr = o => typeof o == "string", $.isbgi = o => typeof o == "bigint"
$.isudf = o => o === undefined, $.isnth = o => isudf(o) || isnul(o)
$.isobj = o => o && typeof o == "object", $.isnul = o => o === null
$.isarr = Array.isArray, $.asarr = v => isarr(v) ? v : [v]
$.isnumstr = s => isstr(s) && !isNaN(Number(s))

$.forrg = (e, f, s = 0, d = 1) => { for (let i = s; d > 0 ? i < e : i > e; i += d) f(i) }
$.maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
$.forin = (o, f) => { for (const k in o) f(o[k], k) }
$.forof = (o, f) => { for (const v of o) f(v) }
$.cases = (h, ...t) => ((m, d) => (c, ...a) => m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
$.panic = e => { throw isstr(e) ? Error(e) : e }

$.proto = Object.getPrototypeOf, $.property = Object.defineProperty
$.assign = Object.assign, $.create = Object.create
$.deletep = (o, s) => (forof(s.split(" "), k => delete o[k]), o)
$.extract = (o, s, r = {}) => (forof(s.split(" "), k => r[k] = o[k]), r)
$.exclude = (o, s) => deletep({ ...o }, s)
$.scope = (o, e = create(o)) => property(e, "$", { value: e })

brwspec($)
envjs($)