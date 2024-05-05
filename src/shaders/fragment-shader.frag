// Source: https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

precision mediump float;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

uniform vec4 u_lightColor;
uniform vec4 u_ambient;
uniform sampler2D u_texture;
uniform vec4 u_specular;
uniform float u_shininess;
uniform float u_specularFactor;
uniform int u_materialType;

// Light calculation (_, diffuse, specular, _)
vec4 lit(float light, float halfVector, float shinyness){
    return vec4(1.0, 
                max(light, 0.0), 
                (light > 0.0) ? pow(max(0.0, halfVector), shinyness) : 0.0, 
                1.0);
}

void main() {
    // Get color from texture coordinates
    vec4 diffuseColor = texture2D(u_texture, v_texCoord);
    
    // Get normal vector from vertex shader
    vec3 a_normal = normalize(v_normal);

    vec4 outColor;

    // // Basic
    if(u_materialType == 0) {
        // Only diffuse color here
        outColor = diffuseColor;
    }

    // Phong
    else if (u_materialType == 0){        
        // Get light direction vector from vertex shader
        vec3 surfaceToLight = normalize(v_surfaceToLight);
        
        // Get viewer direction vector from vertex shader
        vec3 surfaceToView = normalize(v_surfaceToView);

        // Get half vector
        vec3 halfVector = normalize(surfaceToLight + surfaceToView);

        // Calculate light values
        vec4 litR = lit(dot(a_normal, surfaceToLight)
                        , dot(a_normal, halfVector), u_shininess);

        // Get final color
        outColor = vec4(
            (u_lightColor * (
                diffuseColor * u_ambient +
                diffuseColor * litR.y + 
                u_specular * litR.z * u_specularFactor)).rgb,
            diffuseColor.a
        );
    }

    // Get light direction vector from vertex shader
    // vec3 surfaceToLight = normalize(v_surfaceToLight);
    
    // // Get viewer direction vector from vertex shader
    // vec3 surfaceToView = normalize(v_surfaceToView);

    // // Get half vector
    // vec3 halfVector = normalize(surfaceToLight + surfaceToView);

    // // Calculate light values
    // vec4 litR = lit(dot(a_normal, surfaceToLight)
    //                 , dot(a_normal, halfVector), u_shininess);

    // // Get final color
    // outColor = vec4(
    //     (u_lightColor * (
    //         diffuseColor * u_ambient +
    //         diffuseColor * litR.y + 
    //         u_specular * litR.z * u_specularFactor)).rgb,
    //     diffuseColor.a
    // );

    // outColor = diffuseColor;


    gl_FragColor = outColor;
}