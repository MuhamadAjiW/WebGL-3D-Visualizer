// Source: https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

uniform mat4 u_projectionMatrix;
uniform vec3 u_lightWorldPos;
uniform mat4 u_world;
uniform mat4 u_viewInverse;
uniform mat4 u_worldInverseTranspose;

attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

void main(){
    // Pass texture coordinate to fragment shader for textures
    v_texCoord = a_texcoord;

    // Pass normal vector to fragment shader for reflections
    v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
    
    // Pass light direction vector to fragment shader for reflections
    v_surfaceToLight = u_lightWorldPos - (u_world * a_position).xyz;
    
    // Pass viewer direction vector to fragment shader for reflections
    v_surfaceToView = (u_viewInverse[3] - (u_world * a_position)).xyz;
    
    // Set viewer position based on projection and world
    v_position = (u_projectionMatrix * u_world * a_position);
    gl_Position = v_position;

    // gl_Position = a_position;
}