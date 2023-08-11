writefile("file.js", () => {
  if (fileiswrong) {
    writefile("file2.js", () => {
      writefile("file3.js", () => {
        writefile("file4.js", () => {

        })
      })
    })
  } else {
    readfile("file5.js", () => { })
  }
})
// file not written

const promisify = writefile => (...a) => new Promise(
  (resolve) => {
    writefile(...a, resolve)
  })
const writefile_promise = promisify(writefile)

writefile_promise("file.js")
  .then(() => {
    if (fileiswrong) { return writefile_promise("file2.js") }
    else { return readfile_promise("file5.js") }
  })
  .then(() => writefile_promise("file3.js"))
  .then(() => writefile_promise("file4.js"))
// file not written

await writefile_promise("file.js")
if (fileiswrong) await writefile_promise("file2.js")
else await readfile_promise("file5.js")
await writefile_promise("file3.js")
await writefile_promise("file4.js")