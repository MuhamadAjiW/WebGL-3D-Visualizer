// Source https://www.cs.toronto.edu/~jacobson/phong-demo/

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_normalMat;
uniform vec3 u_lightPos;        // Light position
uniform vec3 u_cameraPos;
uniform bool u_displacementActive;
uniform sampler2D u_displacementTexture;
uniform float u_displacementHeight;

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
    // Pass base data to fragment shader
    v_texCoord = a_texCoord;
    v_lightPos = u_lightPos;
    v_normal = normalize(vec3(mat3(u_normalMat) * a_normal));

    // Calculate tbn
    mat3 normalMat = mat3(u_normalMat);
    vec3 t = normalize(vec3(normalMat * a_tangent));
    // vec3 b = normalize(vec3(u_world * vec4(a_bitangent, 0.0)));
    vec3 n = normalize(vec3(normalMat * a_normal));
    // t = normalize(t - dot(t, n) * n);
    vec3 b = cross(n, t);

    v_TBN = transpose(mat3(t, b, n));

    // Calculate displacement
    vec4 vertPos4 = u_world * vec4(a_position, 1.0);
    if(u_displacementActive) {
        float d = texture2D(u_displacementTexture, a_texCoord).r;
        vertPos4.xyz += d * u_displacementHeight * n;
        v_normal = n;
    }
    v_position = vec3(vertPos4);

    v_tangentLightPos = v_TBN * u_lightPos;
    v_tangentViewPos = v_TBN * -u_cameraPos;
    v_tangentFragPos = v_TBN * vertPos4.xyz;

    v_TBN = transpose(v_TBN);

    // Finalize
    gl_Position = u_projection * u_view * vertPos4;
}
