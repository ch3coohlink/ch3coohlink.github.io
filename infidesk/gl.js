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

$.gldict = {}, $.ucache = {}, Object.keys(proto(gl)).forEach(n =>
  (n.match(/^[A-Z]/) && !gldict[gl[n]]) ? gldict[gl[n]] = n :
    n.match(/^uniform/) ? $.ucache[n] = gl[n].bind(gl) : 0)

const infoarr = (p, t, b = t === "Attrib", a = []) => {
  const l = gl.getProgramParameter(p, b ? gl.ACTIVE_ATTRIBUTES : gl.ACTIVE_UNIFORMS)
  const f = gl["getActive" + t].bind(gl), g = gl[`get${t}Location`].bind(gl)
  const m = {}; for (let i = 0, e, r, n; i < l; i++) {
    e = f(p, i), r = { i }, n = r.name = e.name, r.size = e.size
    r.type = gldict[e.type], r.loc = g(p, n); if (!b) {
      const [, t, m, a0, a1] = r.type.match(/([A-Z]+)(?:_([A-Z]+)(\d+)(?:x(\d+))?)?/)
      const tn = t === "FLOAT" ? "f" : t === "INT" ? "i" : "ui"
      const mb = m === "MAT", fn = "uniform" + (mb ?
        `Matrix${a0 === a1 ? a0 : a0 + "x" + a1}${tn}v` :
        `${a0 ?? 1}${tn}${a0 ? "v" : ""}`)
      r.func = ucache[fn], r.fn = fn, r.m = mb
    } else { r.item = gl[r.type.match(/([A-Z]+)(?:_([A-Z]+)(\d+))?/)[1]] }
    m[n] = r, a.push(r)
  } return [a, m]
}
$.getproginfo = p => [infoarr(p, "Attrib"), infoarr(p, "Uniform")]

$.newprogram = (vs, fs, p = rawprogram(newvs(vs), newfs(fs))) =>
  (p.info = getproginfo(p), p)

$.definebuffers = o => {
  const r = {}; for (const k in o) {
    let v = o[k], b = gl.createBuffer()
    if (!istarr(v)) { v = new Float32Array(v) }
    gl.bindBuffer(gl.ARRAY_BUFFER, r[k] = b)
    gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW)
  } return r
}

$.definevao = (o, p) => {
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  bindAttrib(definebuffers(o), p)
  return vao
}

$.bindAttrib = (b, p) => {
  const [[, ai]] = p.info; for (const k in b) {
    const v = b[k], i = ai[k]; if (!i) { throw `no "${k}" attribute` }
    gl.bindBuffer(gl.ARRAY_BUFFER, v), gl.enableVertexAttribArray(i.loc)
    gl.vertexAttribPointer(i.loc, i.num ?? 3,
      i.item, i.normal ?? false, i.stride ?? 0, 0)
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