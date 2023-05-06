let [, newidb] = await Promise.all([
  loadsym("./basic.js"), require("./idb.js")
])

const main = async () => {
  $.idb = newidb($, { name: "idbtest_kdfaiodfhwiof" })

  $.db = await idb.dbp
  console.log(db.objectStoreNames, db.version)

  await idb.upgrade(async db => {
    const o2 = db.createObjectStore("default2")
  })
  
  $.db = await idb.dbp
  console.log(db.objectStoreNames, db.version)
  
  await idb.set("", "testvalue")
  console.log(await idb.get(""))

  await idb.action("readwrite", async t => {
    const o = t.objectStore("default2")
  }, null)

  idb.deletedatabase()
}
main()