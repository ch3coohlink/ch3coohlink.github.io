$.data = []
$.get = i => data[i]
$.item = (s = "") => ({ id: uuid(), v: s.split(/\n|\r\n/) })

$.view = []
$.upd = () => {
  if (data.length === 0) { data.push(item()) }
}
$.upd1 = (v, i) => {

}


$.render = () => { }