const body = document.body; body.innerHTML = ""//, clear()

const fct2str = (f, s = String(f)) => {
  const t = s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"))
  const a = t.split(/\r?\n/); if (a[0] === "") a.shift()
  const n = a[0].match(/^[\s]+/)[0].length
  return a.map(v => v.slice(n)).join("\r\n").trim()
}
const exec = (f, r) => Function("$", `with($){\n${f}\n}`)(r)
const completerefresh = (d, e, s) => () => (s ? s.destroy() : 0,
  s = sandbox(assign(scope($), { root: d })), exec(e.value, s))
const jsenv = (f, o) => {
  let edt, but, exc, hst, ret = dom({
    style: { display: "flex" }, child: [
      edt = dom({ tag: "textarea", spellcheck: false }),
      but = dom({ tag: "button", child: "▶", style: { userSelect: "none" } }),
      exc = dom({ child: hst = dom({}) })]
  }), d = isfct(f) ? fct2str(f) : isnth(f) ? "" : String(f)
  style(ret, { overflow: "hidden", height: 200, whiteSpace: "pre" })
  style(edt, { resize: "none", width: "100%", boxSizing: "border-box" },
    { fontFamily: "consolas monospace", whiteSpace: "pre" })
  style(exc, { width: "100%", boxSizing: "border-box", border: "grey 0.5px solid" })
  style(hst, { height: "200%", width: "200%" },
    { transform: "scale(0.5)", transformOrigin: "left top" })
  elm(edt, { value: d }), o ??= completerefresh(hst, edt)
  elm(but, { onclick: o }); return ret
}

const string_editor = d => {
  const oninput = e => d.d.textContent = e.target.value
  const edt = dom({ tag: "input", value: d.v, oninput, spellcheck: false })
  elm(d.e, { append: [edt] }), d.d = dom({ child: d.v }), style(edt, { width: "100%" })
}
const change_tag = (t, o, n = dom({ tag: t })) => (
  o.before(n), n.append(...o.childNodes), o.remove(), n)
const tag_editor = d => {
  const oninput = () => d.d.textContent = text.value
  const changetag = (_, n = tag.value) => d.d.tagName.toLowerCase() === n
    ? 0 : elm(d.d = change_tag(n, d.d), { append: text.value })
  const tag = dom({ tag: "input", value: d.v[0], oninput: changetag })
  const text = dom({ tag: "input", value: d.v[1], oninput, spellcheck: false })
  elm(tag, { spellcheck: false, style: { width: 60 } }), style(text, { width: "100%" })
  elm(d.e, { append: [tag, text] }), changetag(0, d.v[0])
}
const dom_editor = d => {
  const resize = () => style(ctn, { height: js.value.split(/\r?\n/).length * 16 + 4 })
  const updateelm = (c = js.value) => {
    const o = Function("$", `with($){\nreturn {\n${c}\n}\n}`)(d.s()), t = o.tag ?? "div"
    if (d.d.tagName.toLowerCase() !== t) d.d = change_tag(t, d.d); elm(d.d, deletep(o, "tag"))
  }, oninput = () => (resize(), updateelm())
  const js = dom({ tag: "textarea", value: d.v, oninput, spellcheck: false, class: "nool" })
  style(js, { resize: "none", width: "100%", padding: 0, lineHeight: 16 },
    { fontFamily: "inherit", whiteSpace: "inherit", overflow: "hidden", border: "none" },
    { height: "100%", display: "block" }) // all these hassle to fixup a little padding problem...
  elm(js, { onfocus: () => style(ctn, { outline: "auto 1px" }) })
  elm(js, { onblur: () => style(ctn, { outline: "" }) })
  const ctn = style(dom({ append: js }), { width: "100%", padding: 2, lineHeight: 16 },
    { boxSizing: "border-box", border: "grey 0.5px solid", minHeight: 24 })
  elm(d.e, { append: ctn }), setTimeout(oninput, 10)
}
const array_item = f => (add, remove, swap) => (v, s) => {
  const d = { v, s }, append = [
    dom({ tag: "button", child: "⬆", style: { width: 30 }, onclick: () => swap(d.i, -1) }),
    dom({ tag: "button", child: "⬇", style: { width: 30 }, onclick: () => swap(d.i, +1) }),
    dom({ tag: "button", child: "+", style: { width: 30 }, onclick: () => add(d.i) }),
    dom({ tag: "button", child: "-", style: { width: 30 }, onclick: () => remove(d.i) })]
  d.e = dom(), d.d = dom(), f(d), elm(d.e, { append }), style(d.e,
    { display: "flex", transition: "all 0.3s" },
    { transform: "translateX(1000px)", opacity: "0" })
  setTimeout(() => { style(d.e, { transform: "", opacity: "" }) }, 40); return d
}
const array_editor = (a = [], citem = array_item(string_editor), def = () => "", h = 200) => {
  const add = i => (data.splice(i + 1, 0, item(def(), () => sdbx)), sync())
  const remove = i => data.length > 1 ? (data.splice(i, 1), sync()) : 0
  const swap = (i, d) => i in data && i + d in data ?
    ([data[i], data[i + d]] = [data[i + d], data[i]], sync()) : 0
  let sdbx, edt, hst, item = citem(add, remove, swap), sync = () => (
    forrg(data.length, i => data[i].i = i),
    elm(edt, { child: data.map(v => v.e) }),
    elm(sdbx.document.body, { child: data.map(v => v.d) }))
  const data = (a.length === 0 ? a.push(def()) : 0, a.map(v => item(v, () => sdbx)))
  const ret = dom({ child: [edt = dom(), hst = dom()] })
  style(ret, { display: "flex", overflow: "hidden", height: h, whiteSpace: "pre" })
  style(edt, { width: "100%", boxSizing: "border-box", overflow: "hidden scroll" },
    { fontFamily: "consolas monospace", border: "grey 0.5px solid" })
  style(hst, { width: "100%", boxSizing: "border-box", border: "grey 0.5px solid" })
  setTimeout(() => (sdbx = sandbox(assign(scope($), { root: hst })), sync()))
  return ret
}
const tree_item = f => (add, remove, swap) => (v, s, i = 0) => {
  const d = { v, s }, append = [
    dom({ tag: "button", child: "⬆", style: { width: 30 }, onclick: () => swap(d.i, -1) }),
    dom({ tag: "button", child: "⬇", style: { width: 30 }, onclick: () => swap(d.i, +1) }),
    dom({ tag: "button", child: "⫟", style: { width: 30 }, onclick: () => cadd(-1) }),
    dom({ tag: "button", child: "+", style: { width: 30 }, onclick: () => add(d.i) }),
    dom({ tag: "button", child: "-", style: { width: 30 }, onclick: () => remove(d.i) })]
  const cadd = i => (data.splice(i + 1, 0, item([], d.s, i + 1)), sync())
  const cremove = i => (data.splice(i, 1), sync())
  const cswap = (i, d) => i in data && i + d in data ?
    ([data[i], data[i + d]] = [data[i + d], data[i]], sync()) : 0
  const item = tree_item(f)(cadd, cremove, cswap)
  const sync = () => (forrg(data.length, i => data[i].i = i),
    elm(cdiv, { child: data.map(v => v.e) }), elm(c.d, { child: data.map(v => v.d) }))
  const data = isarr(v) ? v.map(v => item(v, d.s, i + 1)) : []
  const cdiv = dom({ style: { paddingLeft: 5, background: "#0000004a" } })
  const c = isarr(v) ? { v: "", s: d.s } : { ...d }; c.e = dom({ style: { display: "flex" } })
  c.d = dom(), f(c), elm(c.e, { append }), d.e = dom({ child: [c.e, cdiv] })
  style(d.e, { transition: "all 0.3s", transform: "translateX(1000px)", opacity: "0" })
  setTimeout(() => { style(d.e, { transform: "", opacity: "" }) }, 40)
  setTimeout(() => sync()), property(d, "d", { get: () => c.d }); return d
}

const br = () => dom({ tag: "br" })
style(body, { margin: 80, lineHeight: "2em" })
style(body, { display: "flex", flexDirection: "column", alignItems: "center" })
css(".nool:focus", { outline: "none" }), css(".wtol:focus", { outline: "solid" })
dom({
  style: { width: 900 }, child: [
    dom({ tag: "h1", child: "文学编程示例-网页开发工具" }),
    dom({ style: { textAlign: "right" }, child: "幻想软件研究@12/30/2021" }),
    "让我们来写一个制作网页的工具。", br(),
    "（本文假设读者能够编写JavaScript，了解DOM的基本操作）", br(),
    "（请在电脑上查看本页面）", br(),
    dom({ tag: "h2", child: "1. 沙盒与dom函数" }),
    "下面提供了一个简单的JavaScript运行环境：左边输入代码，右边展示对应的网页结果。", br(),
    "dom这个函数是预先准备好的，它的使用方法如下面几个例子所示：", br(),
    `1. 这个例子将创建一个内容为"hello world"的div标签，将其插入到document.body元素中`, br(),
    jsenv(() => { dom({ child: "hello world" }, document.body) }),
    "2. 如果没有第二个参数，那么dom函数只是返回它所创建的元素，对你来说，好像什么都没有发生", br(),
    jsenv(() => { dom({ child: "hello world" }) }),
    "3. 第一个参数的用法比较灵活，比如使用tag属性创建不同类型的标签（默认创建div标签）", br(),
    "(如果你注意到右边窗口里创建的元素有点小，那其实是因为整个页面被缩小了一倍以装下更多内容)", br(),
    jsenv(() => { dom({ tag: "textarea" }, document.body) }),
    "4. child属性是一个数组，表示往当前节点里添加子节点", br(),
    jsenv(() => {
      dom({
        child: [
          "每个字符串代表一个TextNode节点，",
          "通过数组的形式输入多个子节点",
          dom({ child: "或者使用dom函数生成一个div标签作为子节点" }),
        ]
      }, document.body)
    }),
    "如果给child直接赋值一个标签元素或字符串，相当于一个只有一个元素的数组", br(),
    jsenv(() => {
      dom({ child: "使用单个元素" }, document.body)
      dom({ child: ["和使用只有一个元素的数组"] }, document.body)
      dom({ child: "是一回事" }, document.body)
    }),
    "5. style属性可以在标签上创建行内样式", br(),
    jsenv(() => {
      dom({
        style: { color: "red" },
        child: "这行字应该是红色的"
      }, document.body)
    }),
    "6. 其余属性和通常在js里访问标签属性一致，例如：onclick", br(),
    jsenv(() => {
      let i = 0
      dom({
        tag: "button",
        child: "每按一下增加一个div的按钮",
        onclick: () => {
          dom({ child: String(++i) }, document.body)
        }
      }, document.body)
    }),
    "总的来讲，dom函数是一个更好用的document.createElement。", br(),
    dom({ tag: "h2", child: "2. 更方便地操作DOM" }),
    "理论上来讲，只要有一个JavaScript编辑环境，我们已经可以实现任何想要的网页了，但更直观的工具可以让这份工作轻松许多，让我们从简单的情形开始考虑：", br(),
    "下面提供了一个简单的数组编辑工具，虽然非常简陋，但已经包含了编辑一个字符串数组的全部要素。", br(),
    array_editor(["在文本框中编辑文本", "上下按钮交换元素顺序", "加减按钮添加删除元素", "试试看！"]),
    "但DOM不只是字符串而已！让我们想想DOM元素的基本要素，除了字符串以外，至少还有各种各样不同类型的标签。", br(),
    "让我们把标签类型加入到工具里：", br(),
    array_editor([
      ["h1", "这是标题"], ["p", "这是一个段落。"],
      ["span", "这是其中的一小节，有些文字是"], ["b", "粗体"], ["span", "的，有些文字是"], ["i", "斜体"], ["span", "的，有些文字是"], ["del", "删除记号"], ["span", "。"],
      ["li", "要点1"], ["li", "要点2"], ["li", "要点3"],
    ], array_item(tag_editor), () => ["div", ""], 400),
    "还记得dom函数的第一个参数吗，我们可以利用它编辑元素的所有属性：", br(),
    array_editor([
      `child: \`这个编辑框中代码的格式和dom函数的第一个参数一样\``,
      `child: \`试着编辑这个元素的字体大小\`,
style: {
  transition: "all 1s",
  fontSize: 60,
  color: "#f00",
}`], array_item(dom_editor), () => "", 300),
    "借助上面的这个编辑器，我们已经可以编辑任何", dom({ child: "数组形式", tag: "b" }), "的DOM了，", br(),
    "很自然地，我们会想把这种编辑方式拓展到树形结构：", br(),
    array_editor([], tree_item(dom_editor), () => "", 300),
    "(TODO：缺用例，编辑器初始化逻辑需要修改)", br(),
    dom({ tag: "h2", child: "3. 自定义标签，动态作用域" }),
    "一个有用的GUI程序除了DOM结构以及样式之外，最重要的还是要通过脚本具有相应的行为。", br(),
    "那么，要如何把DOM编辑与JavaScript结合起来？", br(),
    "一种可能的方法是将每个编辑的DOM片段保存下来，定义为一个自定义标签，以对其进行组合或拓展。", br(),
    "下面是一个自定义标签编辑器：", br(),
  ]
}, body)

window.scrollTo(0, document.body.scrollHeight)