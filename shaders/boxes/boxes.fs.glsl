#version 300 es
precision mediump float;
uniform vec3 userColor;
out vec4 color;
void main(){
  color=vec4(userColor,1.0);
}
