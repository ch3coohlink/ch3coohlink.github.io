$.fadein = () => [{ opacity: "0" }, { opacity: "1" }]
$.fadeout = () => [{ opacity: "1" }, { opacity: "0" }]
$.flyin = () => [{ transform: "translateY(1000%)" }, { transform: "" }]
$.flyout = () => [{ transform: "" }, { transform: "translateY(-1000%)" }]

css("body", { overflow: "hidden" })
css(".page", { position: "absolute" })

const o = { i: 1 }
css(".button", { all: "initial", position: "absolute", bottom: 0 },
  { fontSize: 100, userSelect: "none", zIndex: "1000", right: 0 })
dom({ class: "button", child: "➡", onclick: () => jump(o, o.i + 1) }, body, "button")
dom({ class: "button", child: "⬅", style: { right: 116 }, onclick: () => jump(o, o.i - 1, true) }, body, "button")

$.pdiv = dom({ style: { height: "100%", padding: "10%" } }, body)
init(() => {
  $.top = dom({
    child: [
      $.title = dom({ child: "Web Speech API" }),
      $.author = dom({ child: "ch3coohlink@Dec 25/2021" })
    ], class: "page"
  }, pdiv)
}, 0)
step(() => {
  trans(fadein, pdiv)
  trans(flyin, top)
  trans(fadein, title)
  wait(1000)
  trans(fadein, author)
}, 0)

init(() => {
  $.top = dom({
    child: [
      $.p0 = dom({ child: "The Web Speech API enables you to incorporate voice data into web apps." }),
      $.p1 = dom({ child: "It consists of 2 parts:" }),
      dom({
        child: [
          $.p2 = dom({ child: "SpeechRecognition (Asynchronous Speech Recognition)" }),
          $.p3 = dom({ child: "SpeechSynthesis (Text-to-Speech)" }),
        ]
      })
    ]
  }, pdiv)
}, 1)
step(() => {
  trans(flyout, top)
}, 0, () => {
  trans(flyin, top)
  trans(fadein, top)
  wait(500)
  trans(fadein, p0)
  trans(fadein, p1)
}, 1)
step(() => {
  trans(fadein, p2)
}, 1)
step(() => {
  trans(fadein, p3)
}, 1)