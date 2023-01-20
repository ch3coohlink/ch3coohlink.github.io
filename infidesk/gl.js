$.newshader = (type, source) => {
  const s = gl.createShader(type)
  gl.shaderSource(s, source), gl.compileShader(s)
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return s }
  log(gl.getShaderInfoLog(s)), gl.deleteShader(s)
}
$.newvs = s => newshader(gl.VERTEX_SHADER, s)
$.newfs = s => newshader(gl.FRAGMENT_SHADER, s)

$.rawprogram = (vs, fs) => {
  const p = gl.createProgram()
  gl.attachShader(p, vs), gl.attachShader(p, fs), gl.linkProgram(p)
  if (gl.getProgramParameter(p, gl.LINK_STATUS)) { return p }
  log(gl.getProgramInfoLog(p)), gl.deleteProgram(p)
}

if (!gl.hasbind) {
  Object.keys(proto(gl)).forEach(n =>
    n.match(/^[A-Z]/) && !gl[gl[n]] ? gl[gl[n]] = n :
      n.match(/^(?:uniform|get)/) ? gl[n] = gl[n].bind(gl) : 0)
  gl.hasbind = true
}

const infoarr = (p, t, b = t === "Attrib", a = []) => {
  const l = gl.getProgramParameter(p, b ? gl.ACTIVE_ATTRIBUTES : gl.ACTIVE_UNIFORMS)
  const f = gl["getActive" + t], g = gl[`get${t}Location`]
  const m = {}; for (let i = 0, e, r, n; i < l; i++) {
    e = f(p, i), r = { i }, n = r.name = e.name, r.size = e.size
    r.type = gl[e.type], r.loc = g(p, n); if (!b) {
      const [, t, m, a0, a1] = r.type.match(/([A-Z]+)(?:_([A-Z]+)(\d+)(?:x(\d+))?)?/)
      const tn = t === "FLOAT" ? "f" : t === "INT" ? "i" : "ui"
      const mb = m === "MAT", fn = "uniform" + (mb ?
        `Matrix${a0 === a1 ? a0 : a0 + "x" + a1}${tn}v` :
        `${a0 ?? 1}${tn}${a0 ? "v" : ""}`)
      r.func = gl[fn], r.fn = fn, r.m = mb
    } m[n] = r, a.push(r)
  } return [a, m]
}
$.getproginfo = p => [infoarr(p, "Attrib"), infoarr(p, "Uniform")]

$.newprogram = (vs, fs, p = rawprogram(newvs(vs), newfs(fs))) =>
  (p.info = getproginfo(p), p)

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
  if (p instanceof WebGLProgram) { p = p.info[0][1] }
  for (const k in b) { d[k] ??= {} } for (const k in d) {
    const v = d[k], i = p[k]; if (!i) { throw `no "${k}" attribute` }
    gl.bindBuffer(gl.ARRAY_BUFFER, b[v.buffer ?? k])
    gl.enableVertexAttribArray(i.loc)
    gl.vertexAttribPointer(i.loc, v.size ?? 3, v.type ?? gl.FLOAT,
      v.normalize ?? false, v.stride ?? 0, v.offset ?? 0)
  }
}

$.bindUniform = (u, p) => {
  const [, [, ui]] = p.info; for (const k in u) {
    const v = u[k], i = ui[k]; if (!i) { throw `no "${k}" uniform` }
    i.m ? i.func(i.loc, false, v) : i.func(i.loc, v)
  }
}

$.shaderinput = (p, b = {}, u = {}) => {
  gl.useProgram(p)
  if (b instanceof WebGLVertexArrayObject) { gl.bindVertexArray(b) }
  else { bindAttrib(b, p) } bindUniform(u, p)
}