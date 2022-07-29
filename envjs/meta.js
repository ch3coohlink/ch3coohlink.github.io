const $ = {}
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
with ($) {
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
  margin: 0.4em 0;
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
这个页面的内容是通过文学编程方法开发文学编程工具，因而被称为元页面。 <br>
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
之所以这样做，是为了让分段的代码可以共享一个全局名称空间。<br>
比如上面的例子里，我就可以将对a和b的定义放在两个不同的代码段里。<br>
<h2>（极其简陋的）文学编程工具函数</h2>
本段旨在创建一些工具函数，减轻一点编写本文档的繁琐之处。
<div class="spbar"></div>
我们需要一个将函数体转化为字符串的函数，该函数会对文本开头的缩进做一些处理：
<pre>$.fct2str = ${fct2str.toString()}</pre>
${htmltext("一个转义HTML实体的函数：")}
<pre>$.htmltext = ${htmltext.toString()}</pre>
以及一个执行输入的函数并返回其代码的函数：
<pre>$.code = ${htmltext(code.toString())}</pre>
之后就可以使用
<pre>code(() => {/*函数体会被运行，同时内容也会被显示出来*/})</pre>
的形式编写代码了。
<h2>JS基础库</h2>
这个部分包含了一些语言基础功能的封装，会使代码非常具有我的风格。<br>
（读者可以先跳过这个部分的内容，如果有需要再在这里查找函数）<br>
<br>
调试功能：
${code(() => { $.log = console.log })}
一些和类型相关的函数：
${code(() => {
    $.isnum = o => typeof o == "number", $.isfct = o => typeof o == "function"
    $.isstr = o => typeof o == "string", $.isbgi = o => typeof o == "bigint"
    $.isudf = o => o === undefined, $.isnth = o => isudf(o) || isnul(o)
    $.isobj = o => !!o && typeof o == "object", $.isnul = o => o === null
    $.isarr = Array.isArray, $.asarr = v => isarr(v) ? v : [v]
    $.isnumstr = s => isstr(s) && !isNaN(Number(s))
  })}
一些控制流函数：
${code(() => {
    $.forrg = (e, f, s = 0, d = 1) => { for (let i = s; d > 0 ? i < e : i > e; i += d) f(i) }
    $.maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
    $.forin = (o, f) => { for (const k in o) f(o[k], k) }
    $.forof = (o, f) => { for (const v of o) f(v) }
    $.cases = (h, ...t) => ((m, d) => (c, ...a) => m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
    $.trycatch = (t, c, f) => { try { t() } catch (e) { c?.(e) } finally { f?.() } }
    $.panic = e => { throw isstr(e) ? Error(e) : e }
  })}
一些对object的操作函数：
${code(() => {
    $.proto = Object.getPrototypeOf, $.property = Object.defineProperty
    $.assign = Object.assign, $.create = Object.create
    $.deletep = (o, s) => (forof(s.split(" "), k => delete o[k]), o)
    $.extract = (o, s, r = {}) => (forof(s.split(" "), k => r[k] = o[k]), r)
    $.exclude = (o, s) => deletep({ ...o }, s)
    $.scope = (o, e = create(o)) => property(e, "$", { value: e })
    $.bindall = (o, f) => forin(o, (v, k) => isfct(v) ? o[k] = v.bind(o) : f ? f(v, k) : 0)
  })}
一个生成随机id的函数
${code(() => {
    const r = crypto.getRandomValues.bind(crypto)
    $.genid = (l = 32, b = 16) => [...r(new Uint8Array(l))]
      .map(v => (v % b).toString(b)).join("")
  })}
<h2>封闭运行环境</h2>
在正式编程之前，先明确文学编程工具的最基本要素。<br>
<div class="spbar"></div>
要实现文学编程，首先要有一个封闭的程序运行环境，所谓封闭，是指：<br>
${code(() => {
    const $ = {}
    with ($) {
      //这里的$覆盖了整个文档最顶层定义的$
      // 此时调用 console.log($) 输出 {}
      $.a = 1
      // 此时调用 console.log($) 输出 {a: 1}
      // 由于这个大括号内的代码无法对外界造成影响
      // 因此可以称为是封闭的
    }
  })}
像上面的代码，不论运行多少次，对全局的环境都不造成任何影响。<br>
一个封闭的程序运行环境，就是要做到让其中的代码不论如何运行，都不会影响到外面。<br>
<div class="spbar"></div>
一个最简陋的封闭环境就像上面给出的例子那样，用同名的$变量覆盖掉外部的$，实现了一个局部名称空间。<br>
但这样做有一个很严重的问题，浏览器环境里有很多具有副作用的API，对这些API的调用是可以修改到全局环境的。<br>
举例而言，现在我们没有提供任何对DOM功能的包装，也就是说每一段代码都是对整个文档的DOM进行全局修改的，这显然不符合我们对封闭环境的期望。<br>
<br>
为了解决这个问题，我们需要为每段代码提供一个封闭的浏览器API环境，就好像这些代码运行在一个小页面里那样。
<div class="spbar"></div>
目前的code函数是无法实现这个功能的，因为它根本不包含一个局部的DOM环境，让我们修改一下它的定义：
${($.temp = () => {
      $.codesrc = (fs, id) => `with($) { const $ = {};
        $.root = document.getElementById("${id}"); with ($) {\n${fs}\n}}`
      $.codert = (fs, id) => "<pre>" + htmltext(fs) + `</pre><div id="${id}"></div>`
      $.code = f => {
        const fs = fct2str(f), id = genid(16, 36)
        setTimeout(new Function(codesrc(fs, id)))
        return codert(fs, id)
      }
    }, temp(), "<pre>" + htmltext(fct2str(temp)) + "</pre>")}
现在每个代码段都拥有一个独立的div作为页面的根节点了，在代码中使用root访问它。<br>
下面的例子将在创建的子页面中添加一条信息：
${code(() => {
      const p = document.createElement("span")
      p.textContent = "这条信息存在于子页面中!"
      p.style.color = "red"
      root.append(p)
    })}
<div class="spbar"></div>
`
}
// 启动时滑至页面底部（开发用）
setTimeout(() => {
  const html = document.documentElement
  html.scroll(0, html.scrollHeight + 1000)
}, 100);