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
<h1>JavaScript 教程</h1>
<div class="right">ch3coohlink@2022</div>
这篇教程虽然是js教程，但实际上是以JavaScript为载体讲动态语言，所以会忽略很多js里不那么重要的细节。</br>
编程语言可以被分为两个大类，一种是静态语言，一种是动态语言。</br>
什么叫静态语言？简单粗暴的理解就是所有的东西都要标注类型。</br>
什么是动态语言？就是语言中的类型都留到运行时去判断。</br>
这是一个非常粗浅的理解，有很多问题，但是我们先从它开始。</br>
比如Java当中如果我编写了一个类型，然后我去访问一个实例的成员，而这个成员不存在，那么这个时候我们的代码是无法通过编译的。</br>
比如你写了一个类中有a和b两个成员，而你去访问这个类的实例的c成员，由于编译器已经知道这个类里只有a和b两个成员，而不存在c成员，所以编译器可以指出你的代码在逻辑上是有问题的。</br>
<ol>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</ol>
${code(() => {
    let Y = f => (x => x(x))(y => f(x => y(y)(x)))
    let fac = Y(f => n => n > 1 ? n * f(n - 1) : 1)
    log(fac(100))
  })}

  ${code(() => {
    const student = (age, name) => {
      const greet = () => `My name is ${name}, I'm ${age} year old.`
      return { age, name, greet }
    }

    class Student {
      constuctor(age, name) {
        this.age = age
        this.name = name
      }
      greet() {
        return `My name is ${this.name}, I'm ${this.age} year old.`
      }
    }
  })}
`
}