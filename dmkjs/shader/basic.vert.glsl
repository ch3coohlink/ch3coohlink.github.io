uniform mat4 u_viewProjection;
uniform vec3 u_lightWorldPos;
uniform mat4 u_viewInverse;

attribute vec4 instanceColor;
attribute mat4 instanceWorld;
attribute vec4 position;
attribute vec3 normal;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;
varying vec4 v_color;

void main() {
  v_color = instanceColor;
  vec4 worldPosition = instanceWorld * position;
  v_position = u_viewProjection * worldPosition;
  v_normal = (instanceWorld * vec4(normal, 0)).xyz;
  v_surfaceToLight = u_lightWorldPos - worldPosition.xyz;
  v_surfaceToView = u_viewInverse[3].xyz - worldPosition.xyz;
  gl_Position = v_position;
}