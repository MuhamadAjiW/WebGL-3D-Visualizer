// Source https://www.cs.toronto.edu/~jacobson/phong-demo/

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_normalMat;
uniform vec3 u_lightPos;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texCoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;

varying vec3 v_normal;
varying vec3 v_position;
varying vec2 v_texCoord;
varying mat3 v_TBN;
varying vec3 v_tangentLightPos;
varying vec3 v_tangentViewPos;
varying vec3 v_tangentFragPos;
varying vec3 v_lightPos;

void main() {
    vec4 vertPos4 = u_world * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
    v_lightPos = u_lightPos;

    vec3 tangent = normalize((u_normalMat * vec4(a_tangent, 0.0)).xyz);
    vec3 bitangent = normalize((u_normalMat * vec4(a_bitangent, 0.0)).xyz);
    vec3 normal = normalize((u_normalMat * vec4(a_normal, 0.0)).xyz);

    v_TBN = mat3(tangent, bitangent, normal);

    v_position = vec3(vertPos4) / vertPos4.w;
    v_normal = vec3(u_normalMat * vec4(a_normal, 0.0));

    v_tangentLightPos = v_TBN * u_lightPos;
    v_tangentViewPos = v_TBN * vec3(u_view);
    v_tangentFragPos = v_TBN * vec3(vertPos4);
    gl_Position = u_projection * u_view * vertPos4;
}
