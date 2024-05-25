// Source https://www.cs.toronto.edu/~jacobson/phong-demo/

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_normalMat;
uniform vec3 u_lightPos;        // Light position

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texCoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;

varying vec3 v_normal;
varying vec3 v_position;
varying vec2 v_texCoord;
varying mat3 v_TBN;
varying vec3 v_lightPos;        // Light position
varying vec3 v_tangentLightPos;
varying vec3 v_tangentViewPos;
varying vec3 v_tangentFragPos;

mat3 transpose(in mat3 inMatrix) {
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(vec3(i0.x, i1.x, i2.x), vec3(i0.y, i1.y, i2.y), vec3(i0.z, i1.z, i2.z));

    return outMatrix;
}

void main() {
    vec4 vertPos4 = u_world * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
    v_lightPos = u_lightPos;
    v_position = vec3(vertPos4);
    v_normal = vec3(mat3(u_normalMat) * a_normal);

    vec3 t = normalize(vec3(u_world * vec4(a_tangent, 0.0)));
    vec3 b = normalize(vec3(u_world * vec4(a_bitangent, 0.0)));
    vec3 n = normalize(vec3(u_world * vec4(a_normal, 0.0)));
    v_TBN = transpose(mat3(t, b, n));

    v_tangentLightPos = v_TBN * u_lightPos;
    v_tangentViewPos = v_TBN * vec3(u_view[3]);
    v_tangentFragPos = v_TBN * vec3(vertPos4);

    v_TBN = transpose(v_TBN);

    gl_Position = u_projection * u_view * vertPos4;
}
