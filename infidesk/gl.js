$.newshader = (t, src) => {
  const s = gl.createShader(t); src = "#version 300 es\n" + src
  gl.shaderSource(s, src), gl.compileShader(s)
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return s }
  console.error(gl.getShaderInfoLog(s), "\n", src), gl.deleteShader(s)
}
$.newvs = s => newshader(gl.VERTEX_SHADER, s)
$.newfs = s => newshader(gl.FRAGMENT_SHADER, s)

$.rawprogram = (vs, fs) => {
  const p = gl.createProgram()
  gl.attachShader(p, vs), gl.attachShader(p, fs), gl.linkProgram(p)
  if (gl.getProgramParameter(p, gl.LINK_STATUS)) { return p }
  console.error(gl.getProgramInfoLog(p)), gl.deleteProgram(p)
}

if (!gl.hasbind) {
  Object.keys(proto(gl)).forEach(n =>
    n.match(/^[A-Z]/) && !gl[gl[n]] ? gl[gl[n]] = n :
      n.match(/^(?:uniform|get)/) ? gl[n] = gl[n].bind(gl) : 0)
  gl.hasbind = true
}

const initattrib = (p, a = [], m = {}) => {
  const l = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES)
  for (let i = 0, e, r, n; i < l; i++) {
    e = gl.getActiveAttrib(p, i)
    r = { i }, n = r.name = e.name, r.size = e.size
    r.type = gl[e.type], r.loc = gl.getAttribLocation(p, n)
    m[n] = r, a.push(r)
  } p.aa = a, p.am = m
}

const ubp = [
  [gl.UNIFORM_BLOCK_BINDING, "loc"],
  [gl.UNIFORM_BLOCK_DATA_SIZE, "size"],
  [gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS, "paramnum"],
  [gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES, "indices"],
  [gl.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER, "vertref"],
  [gl.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER, "fragref"]]

let uboindex = 0, newubo = size => {
  const ubo = gl.createBuffer(), i = uboindex++
  gl.bindBuffer(gl.UNIFORM_BUFFER, ubo)
  gl.bufferData(gl.UNIFORM_BUFFER, size, gl.DYNAMIC_DRAW)
  gl.bindBufferBase(gl.UNIFORM_BUFFER, i, ubo)
  ubo.index = i; return ubo
}

const inituniform = (p, u = {}, a = [], m = {}) => {
  const l = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  const q = [...Array(l).keys()]
  const bi = gl.getActiveUniforms(p, q, gl.UNIFORM_BLOCK_INDEX)
  const oft = gl.getActiveUniforms(p, q, gl.UNIFORM_OFFSET)
  const bs = new Set(bi), ba = [], bm = {}; bs.delete(-1)
  p.ua = a, p.um = m, p.ba = ba, p.bm = bm, p.ubos = u

  for (const i of bs) {
    const n = gl.getActiveUniformBlockName(p, i)
    const r = { i }; for (const [e, k] of ubp) {
      r[k] = gl.getActiveUniformBlockParameter(p, i, e)
    } r.ubo = u[n] ??= newubo(r.size)
    gl.uniformBlockBinding(p, r.ubo.index, r.loc)
    r.param = {}, r.name = n, bm[n] = r, ba.push(r)
  }

  for (let i = 0; i < l; i++) {
    let e = gl.getActiveUniform(p, i), b = bi[i]
    let r = { i }, n = r.name = e.name; r.size = e.size
    r.type = gl[e.type], r.loc = gl.getUniformLocation(p, n)
    r.block = b, r.offset = oft[i]

    const [, t, ms, a0, a1] = r.type.match(/([A-Z]+)(?:_([A-Z]+)(\d+)(?:x(\d+))?)?/)
    const tn = t === "FLOAT" ? "f" : t === "INT" ? "i" : "ui"
    const ism = ms === "MAT", fn = "uniform" + (ism ?
      `Matrix${a0 === a1 ? a0 : a0 + "x" + a1}${tn}v` :
      `${a0 ?? 1}${tn}${a0 ? "v" : ""}`)
    r.func = gl[fn], r.fn = fn, r.ism = ism

    if (b !== -1) { ba[b].param[n] = r } else { m[n] = r, a.push(r) }
  }
}
$.initshaderinput = (p, u) => (initattrib(p), inituniform(p, u), p)

$.newprogram = (vs, fs, u) =>
  initshaderinput(rawprogram(newvs(vs), newfs(fs)), u)

$.defbuffers = o => {
  const r = {}; for (const k in o) {
    let v = o[k], b = gl.createBuffer()
    if (!istarr(v)) { v = new Float32Array(v) }
    gl.bindBuffer(gl.ARRAY_BUFFER, r[k] = b)
    gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW)
  } return r
}

$.defvao = (o, p, d) => {
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  bindAttrib(defbuffers(o), p, d)
  return vao
}

$.bindAttrib = (b, p, d = {}) => {
  if (p instanceof WebGLProgram) { p = p.am }
  for (const k in b) { d[k] ??= {} } for (const k in d) {
    const v = d[k], i = p[k]; if (!i) { throw `no "${k}" attribute` }
    gl.bindBuffer(gl.ARRAY_BUFFER, b[v.buffer ?? k])
    gl.enableVertexAttribArray(i.loc)
    gl.vertexAttribPointer(i.loc, v.size ?? 3, v.type ?? gl.FLOAT,
      v.normalize ?? false, v.stride ?? 0, v.offset ?? 0)
  }
}

$.bindUniform = (u, p) => {
  const { um, bm } = p
  for (const k in u) {
    const v = u[k], i = um[k], b = bm[k]
    if (!i && !b) { throw `no "${k}" uniform` }
    if (i) { i.ism ? i.func(i.loc, false, v) : i.func(i.loc, v) }
    if (b) { }
  }
}

$.shaderinput = (p, b = {}, u = {}) => {
  gl.useProgram(p)
  if (b instanceof WebGLVertexArrayObject) { gl.bindVertexArray(b) }
  else { bindAttrib(b, p) } bindUniform(u, p)
}