const fs = require("fs"), http = require("http")
const ws = require("ws"), path = require("path")
const url = require("url")

http.createServer((rq, rs,
  filePath = "." + url.parse(rq.url, true).pathname, contentType = {
    ".html": "text/html", ".js": "text/javascript",
    ".css": "text/css", ".json": "application/json",
    ".png": "image/png", ".jpg": "image/jpg", ".wav": "audio/wav",
  }[path.extname(filePath)] ?? "text/plain") =>
  fs.readFile(filePath, function (error, content) {
    if (error) rs.writeHead(500), rs.end(error.code); else (rs.writeHead
      (200, { "Content-Type": contentType }), rs.end(content, "utf-8"))
  })).listen(8080)

const debounce = (f, d = 1000, c = true, cf = () => c = true) =>
  (...a) => c ? (c = false, setTimeout(cf, d), f(...a)) : undefined
const _ = {}, update = debounce(() =>
  fs.readFile("./ltjs/index.dat", "utf8", (e, data) => {
    let state = "html", parts = [], $ = { ws, _ }
    for (const line of data.split(/\r?\n/)) {
      if (line.startsWith("###")) {
        state = line.slice(3).trim()
        if (state.length === 0) state = "html"
        parts.push({ state, data: [] })
      } else {
        if (parts.length === 0) parts.push({ state, data: [] })
        parts[parts.length - 1].data.push(line)
      }
    } for (let { state, data } of parts) {
      data = data.join("\n"); switch (state) {
        case "server": new Function("$", `with($){\n${data}\n}`)($);
          break; default: break
      }
    }
  }))

update(), fs.watch("./ltjs", update)
process.on('uncaughtException', e => (console.error(e), update()))