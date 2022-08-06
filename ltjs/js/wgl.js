$.wgc = {}, $.wgc2 = {}
bindall(ctx, (v, k) => isobj(v) ? 0 : wgc[v] ? wgc2[v] = k : wgc[v] = k)
forin(ctx, (v, k) => $[k] = v)

const buffer = ({ size, data, target = ARRAY_BUFFER } = {}) => {
  const b = createBuffer()
  return b
}
const vertexArray = () => { }
const framebuffer = () => { }
const renderbuffer = () => { }
const query = () => { }
const sampler = () => { }
const texture = () => { }
const program = () => { }
const shader = () => { }
const transformFeedback = () => { }

const _ = assign({}, { buffer, framebuffer, renderbuffer, sampler, texture })
assign(_, { program, shader, query, transformFeedback, vertexArray }); return _

const hyph = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
const statistic = {}, statisti2 = {}
forin(ctx, (v, k, n = hyph(k).split(/-|[0-9]/)[0]) => (
  n === "vertex" ? n = "vertexAttrib" : 0, !isfct(v) ? 0 : (
    (statistic[n] ??= []).push(k.slice(n.length)),
    (statisti2[k.slice(n.length)] ??= []).push(n))))

forin(statistic, (v, k) => log(k, "-", ...v.map(v => v === "" ? `""` : v)))
// log("-".repeat(100))
// forin(statisti2, (v, k) => log(k, "-", ...v.map(v => v === "" ? `""` : v)))