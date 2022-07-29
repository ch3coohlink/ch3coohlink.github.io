const $ = {}
with ($) {
  $.fct2str = (f, s = String(f)) => {
    const t = s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"))
    const a = t.split(/\r?\n/); if (a[0] === "" && a.length > 1) a.shift()
    const n = a[0].match(/^[\s]+/)?.[0].length ?? 0
    return a.map(v => v.slice(n)).join("\r\n").trim()
  }
  $.htmltext = s => {
    const text = document.createTextNode(s)
    const div = document.createElement("div")
    div.append(text); return div.innerHTML
  }
  $.code = f => (f(), "<pre>" + htmltext(fct2str(f)) + "</pre>")
  document.body.innerHTML = `
<style>
body {
  min-width: 400px;
  max-width: 1000px;
  margin: 50px auto 500px auto;
  padding: 0 1em;
}
pre, .log {
  line-height: 20px;
  font-size: 1em;
  font-family: consolas, Microsoft YaHei, monospace, Apple Color Emoji, Segoe UI Emoji;
  white-space: pre-wrap;
  background: #1d191d;
  color: #cbd3d2;
  margin: 0.2em 0;
  padding: 0.2em 0;
  padding-left: 1em;
}
.right {
  text-align: right;
  margin: 1em;
}
.spbar {
  width: calc(100% - 2em);
  margin: 1em;
  height: 1px;
  background-color: black;
}
.log {
  background: #808080;
  color: #e7e7e7;
}
</style>
<h1>文学编程工具元页面</h1>
<div class="right">ch3coohlink@2022</div>
这个页面的内容是通过文学编程方法开发文学编程工具，因而是一种元页面。 <br>
具体一些来讲，目前我的文学编程工具中有一个很关键的组件是JS沙盒，而我很难在沙盒的内部去测试沙盒的功能，所以有了这个页面。
<h2>全局环境</h2>
这个文档中的代码会有一些和常规的js不同的地方，让我提前解释一下：
<pre>const $ = {}
with ($) {
  // 这里面的代码就可以使用$作为全局环境了
  // 接下来你所看到的代码都是存在于这个环境里的
  // 比如这样在全局环境中定义一个变量a
  $.a = 0
  // 后面就能直接用a这个名字访问到它
  $.b = a + 1
  // 当然普通的变量定义方法还是有效的，但要记住它们的作用范围只在当前作用域里
  const c = a + b
  // 而且它们会覆盖掉$中的定义
  $.c = a - b
  // 这里访问变量c，读到的是第一个定义，第二个定义只能通过$.c访问
  c // 1
  $.c // -1
}</pre>
<h2>文学编程最小工具</h2>
本段旨在创建一个最小的文学编程工具组合，减轻一些编写本文档的繁琐之处。
<div class="spbar"></div>
它包含一个将函数体转化为字符串的函数，该函数会对文本开头的缩进做一些处理：
<pre>const fct2str = ${fct2str.toString()}</pre>
${htmltext("一个转义HTML实体的函数：")}
<pre>const htmltext = ${htmltext.toString()}</pre>
以及一个执行输入的函数并返回其代码的函数：
<pre>const code = ${htmltext(code.toString())}</pre>
之后就可以使用
<pre>code(() => {/*函数体会被运行，同时内容也会被显示出来*/})</pre>
的形式编写代码了。
<div class="spbar"></div>
P.S. 由于需要打印测试结果，因此需要在代码块里提供打印功能，为此增加一个函数test：
${code(() => {
    const r = crypto.getRandomValues.bind(crypto)
    $.getid = (l = 32) => [...r(new Uint8Array(l))].map(v => (v % 16).toString(16)).join("")
    const rpkey = (o, f, t = {}) => {
      for (const k in o) { t[k] = [k in $, $[k]], $[k] = o[k] } f()
      for (const k in o) { t[k][0] ? $[k] = t[k][1] : delete $[k] }
    }
    $.code = (f, extra = "") => {
      const fs = fct2str(f), id = getid()
      setTimeout(() => {
        const d = document.getElementById(id)
        const log = (...a) => d.innerText += a.join("")
        rpkey({ log }, f)
      })
      return `<pre>${htmltext(fs)}</pre><div class="log" id="${id}"></div>`
    }
    $.test = f => isfct(f) ? log(f() ? "\u2714" : "\u274c", " ", f, "\n")
      : log("\u2757 test must be a function\n")
  })}
<h2>JS基础库</h2>
这个部分包含了对JavaScript功能的封装，为后面编写沙盒做好准备。<br>
首先是一些和类型相关的函数：
${code(() => {
    $.isnum = o => typeof o == "number", $.isfct = o => typeof o == "function"
    $.isstr = o => typeof o == "string", $.isbgi = o => typeof o == "bigint"
    $.isudf = o => o === undefined, $.isnth = o => isudf(o) || isnul(o)
    $.isobj = o => !!o && typeof o == "object", $.isnul = o => o === null
    $.isarr = Array.isArray, $.asarr = v => isarr(v) ? v : [v]
    $.isnumstr = s => isstr(s) && !isNaN(Number(s))
  })}
简单测试一下：
${code(() => {
    test(() => isnum(1) === true)
    test(() => isnum(NaN) === true)
    test(() => isnum({}) === false)
    test(() => isfct(() => { }) === true)
    test(() => isfct({}) === false)
    test(() => isstr("") === true)
    test(() => isstr({}) === false)
    test(() => isbgi(100n) === true)
    test(() => isbgi(100) === false)
    test(() => isbgi({}) === false)
    test(() => isudf(undefined) === true)
    test(() => isudf(null) === false)
    test(() => isudf(NaN) === false)
    test(() => isudf({}) === false)
    test(() => isnul(null) === true)
    test(() => isnul(undefined) === false)
    test(() => isnul(NaN) === false)
    test(() => isnul({}) === false)
    test(() => isnth(null) === true)
    test(() => isnth(undefined) === true)
    test(() => isnth(NaN) === false)
    test(() => isnth({}) === false)
    test(() => isobj({}) === true)
    test(() => isobj(null) === false)
    test(() => isobj(undefined) === false)
    test(() => isarr([]) === true)
    test(() => isarr(new Uint8Array(10)) === false)
    test(() => isarr({ 0: 1, length: 1 }) === false)
    test(() => isarr({ 0: 1, length: 0 }) === false)
    test(() => isarr({ length: 0 }) === false)
    test(() => asarr(123).join("") === "123")
    test(() => asarr([123]).join("") === "123")
    test(() => isnumstr("1234") === true)
    test(() => isnumstr("1234.123") === true)
    test(() => isnumstr("1.324e123") === true)
    test(() => isnumstr("1234notanything") === false)
    test(() => isnumstr(123) === false)
  })}
然后是一些控制流函数：
${code(() => {
    $.forrg = (e, f, s = 0, d = 1) => { for (let i = s; d > 0 ? i < e : i > e; i += d) f(i) }
    $.maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
    $.forin = (o, f) => { for (const k in o) f(o[k], k) }
    $.forof = (o, f) => { for (const v of o) f(v) }
    $.cases = (h, ...t) => ((m, d) => (c, ...a) => m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
    $.trycatch = (t, c, f) => { try { t() } catch (e) { c?.(e) } finally { f?.() } }
    $.panic = e => { throw isstr(e) ? Error(e) : e }
  })}
我一直很好奇它们的效率和实际手写的控制流有多大区别，现在可以进行一些测试了：
${code(() => {

  })}
还有一些对object的操作函数：
${code(() => {
    $.proto = Object.getPrototypeOf, $.property = Object.defineProperty
    $.assign = Object.assign, $.create = Object.create
    $.deletep = (o, s) => (forof(s.split(" "), k => delete o[k]), o)
    $.extract = (o, s, r = {}) => (forof(s.split(" "), k => r[k] = o[k]), r)
    $.exclude = (o, s) => deletep({ ...o }, s)
    $.scope = (o, e = create(o)) => property(e, "$", { value: e })
    $.bindall = (o, f) => forin(o, (v, k) => isfct(v) ? o[k] = v.bind(o) : f ? f(v, k) : 0)
  })}
${code(() => { })}
<h2>浏览器沙箱</h2>
下面测试浏览器沙箱的内存泄露状况
${code(() => {
    // everything that not gc should be concerned
    // (so maybe add URL.createObjectURL etc...)
    $.pack = (n, [a, b] = n.split(" "), m = new WeakMap, d = new Set
      , r = $[a], c = $[b], rg = new FinalizationRegistry(d.delete.bind(d))) => (
      $[a] = (f, t) => (i => (rg.register(f, i), m.has(f)
        ? d.delete(m.get(f)) : 0, m.set(f, i), d.add(i), i))(r(f, t)),
      $[b] = i => (c(i), d.delete(i)), () => forof(d, $[b]))
    pack("requestAnimationFrame cancelAnimationFrame")
  })}
${code(() => {

  })}
`
}