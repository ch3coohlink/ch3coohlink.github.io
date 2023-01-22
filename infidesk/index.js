[, , $.newidb, $.glutil] = await Promise.all([
  loadsym("./basic.js"), loadsym("./comp.js"),
  require("./idb.js"), require("./gl.js")
])

$.idb = newidb($, { name: "infidesk" })
$.save = idb.saveobj("lmm6keutnfvlhnuj08vq1nu1mhsfjrtm")
await save.init

const body = document.body
compappend(body, $.cvs = canvas())
$.gl = cvs.cvs.getContext("webgl2")
glutil(_, _, $)

const p = newprogram(`
in vec4 position;

void main() {
  gl_Position = position;
}`, `
precision mediump float;

uniform vec2 resolution;
uniform float time;

out vec4 fragColor;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float color = 0.0;

  color += sin( uv.x * cos( time / 3.0 ) * 60.0 ) + cos( uv.y * cos( time / 2.80 ) * 10.0 );
  color += sin( uv.y * sin( time / 2.0 ) * 40.0 ) + cos( uv.x * sin( time / 1.70 ) * 40.0 );
  color += sin( uv.x * sin( time / 1.0 ) * 10.0 ) + sin( uv.y * sin( time / 3.50 ) * 80.0 );
  color *= sin( time / 10.0 ) * 0.5;

  fragColor = vec4( vec3( color * 0.5, sin( color + time / 2.5 ) * 0.75, color ), 1.0 );
}`)

const position = [1, 1, -1, 1, 1, -1, -1, -1]
const s = 2, l = position.length / s
const a = defvao({ position }, { position: { size: s } }, p)
log(...Object.keys(p).map(k => [k, p[k]]).flat())

let i = 0; frame(t => {
  const fc = i++, st = pnow(); begintimer()

  const w = gl.canvas.width, h = gl.canvas.height
  gl.viewport(0, 0, w, h)
  shaderinput(p, a, { time: t * 0.001, resolution: [w, h] })
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, l)

  const et = pnow(); endtimer().then(t => {
    log(`frame ${fc} gpu time:` + t.toFixed(5) + "ms", "\n",
      `frame ${fc} cpu time:` + (et - st).toFixed(5) + "ms")
  })
})