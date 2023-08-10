let idb = () => {
  let counter = 0
  let add = () => counter++
  return { add }
}

const sobj = idb() // { add }
sobj.add() // counter + 1 // 0
sobj.add() // counter + 1 // 1
sobj.add() // counter + 1 // 2
sobj.add() // counter + 1 // 3

const sobj2 = idb()
sobj2.add() // counter + 1 // 0
sobj2.add() // counter + 1 // 1
sobj2.add() // counter + 1 // 2
