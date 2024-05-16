// Source https://www.cs.toronto.edu/~jacobson/phong-demo/

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_normalMat;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texCoord;

varying vec3 v_normal;
varying vec3 v_position;
varying vec2 v_texCoord;

void main() {
    vec4 vertPos4 = u_world * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;

    v_position = vec3(vertPos4) / vertPos4.w;
    v_normal = vec3(u_normalMat * vec4(a_normal, 0.0));

    gl_Position = u_projection * u_view * vertPos4;
}
