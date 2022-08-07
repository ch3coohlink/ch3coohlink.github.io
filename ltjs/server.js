const fs = require("fs")
const ws = require("ws")
const http = require("http")
const path = require("path")

http.createServer((rq, rs) => {
  const filePath = "." + rq.url
  const contentType = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".wav": "audio/wav",
  }[path.extname(filePath)] ?? "text/plain"
  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./404.html", function (_, content) {
          rs.writeHead(200, { "Content-Type": contentType })
          rs.end(content, "utf-8")
        })
      }
      else {
        rs.writeHead(500)
        rs.end("Sorry, check with the site admin for error: " + error.code + " ..\n")
        rs.end()
      }
    }
    else {
      rs.writeHead(200, { "Content-Type": contentType })
      rs.end(content, "utf-8")
    }
  })
}).listen(8080)

const { log: _lg } = console
const log = (v, ...a) => (_lg(v, ...a), v)
const debounce = (f, d = 100, c = true, cf = () => c = true) =>
  (...a) => c ? (c = false, setTimeout(cf, d), f(...a)) : undefined
const update = debounce(() => {

  fs.readFile("./ltjs/index.dat", "utf8", (_, data) => {

    let state = "html", parts = [], $ = { ws }
    for (const line of data.split(/\r?\n/)) {
      if (line.startsWith("###")) {
        state = line.slice(3).trim()
        if (state.length === 0) state = "html"
        parts.push({ state, data: [] })
      } else {
        if (parts.length === 0) parts.push({ state, data: [] })
        parts[parts.length - 1].data.push(line)
      }
    }

    for (let { state, data } of parts) {
      data = data.join("\n")

      switch (state) {
        case "server": {
          try { new Function(`with($){\n${data}\n}`)() }
          catch (e) { console.error(data + "\n", e) }
        } break; default: break
      }
    }
  })

})

update(), fs.watch("./ltjs", update)


// const wss = new ws.Server({ port: 8080 })
// wss.on("connection", ws => {
//   log("new client connected")
//   ws.on("message", data => {
//     log(`Client has sent us: ${data}`)
//   })
//   ws.on("close", () => {
//     log("the client has connected");
//   });
//   ws.onerror = function () {
//     log("Some Error occurred")
//   }
// })