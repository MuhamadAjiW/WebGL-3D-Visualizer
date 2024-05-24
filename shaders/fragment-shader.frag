// Source https://www.cs.toronto.edu/~jacobson/phong-demo/

precision mediump float;

varying vec3 v_normal;          // Surface normal
varying vec3 v_position;        // Vertex position
varying vec2 v_texCoord;        // Texture mapping
varying mat3 v_TBN;        // TBN Matrix

// Material color
uniform sampler2D u_textureDiffuse;
uniform sampler2D u_textureSpecular;
uniform sampler2D u_textureNormal;
uniform sampler2D u_textureParallax;
uniform vec4 u_ambient;
uniform vec4 u_diffuse;
uniform vec4 u_specular;
uniform float u_shininess;      // Shininess
uniform int u_materialType;
uniform bool u_useNormalTex;

uniform vec3 u_lightPos;        // Light position

void main() {
    vec4 textureDiffuse = texture2D(u_textureDiffuse, v_texCoord);
    vec4 textureSpecular = texture2D(u_textureSpecular, v_texCoord);

    vec3 N;
    if(u_useNormalTex){
        N = texture2D(u_textureNormal, v_texCoord).rgb;
        N = N * 2.0 - 1.0;
        N = normalize(v_TBN * N);
    }
    else{
        N = normalize(v_normal);
    }
    vec4 textureParallax = texture2D(u_textureParallax, v_texCoord);


    vec4 outColor;
    if(u_materialType == 0){
        outColor = u_diffuse * textureDiffuse;
        
    } else if (u_materialType == 1){
        vec3 L = normalize(u_lightPos - v_position);

        // Lambert's cosine law
        float lambertian = max(dot(N, L), 0.0);
        float specular = 0.0;
        if(lambertian > 0.0) {
            vec3 R = reflect(-L, N);      // Reflected light vector
            vec3 V = normalize(-v_position); // Vector to viewer
            // Compute the specular term
            float specAngle = max(dot(R, V), 0.0);
            specular = pow(specAngle, u_shininess);
        }

        outColor = (u_ambient +
                    lambertian * u_diffuse) * textureDiffuse +
                    (specular * u_specular) * textureSpecular;
    }

    gl_FragColor = outColor;
}
