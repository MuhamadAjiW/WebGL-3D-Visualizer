// Source https://www.cs.toronto.edu/~jacobson/phong-demo/

precision mediump float;

varying vec3 v_normal;          // Surface normal
varying vec3 v_position;        // Vertex position
varying vec2 v_texCoord;        // Texture mapping
varying mat3 v_TBN;        // TBN Matrix
varying vec3 v_lightPos;        // Light position
varying vec3 v_tangentLightPos;
varying vec3 v_tangentViewPos;
varying vec3 v_tangentFragPos;

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
uniform bool u_useParallaxTex;

uniform float u_parallaxScale;

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir) {
    float height = texture2D(u_textureParallax, texCoords).r;
    vec2 p = viewDir.xy / viewDir.z * (height * 0.1);
    return texCoords - p;
}

void main() {
    vec3 viewDir = normalize(v_tangentViewPos - v_tangentFragPos);
    vec3 lightDir = normalize(v_tangentLightPos - v_tangentFragPos);

    vec2 uv = v_texCoord;

    // if(true){
        uv = ParallaxMapping(v_texCoord, viewDir);
    // }

    vec3 N;
    if(u_useNormalTex){
        N = texture2D(u_textureNormal, uv).rgb;
        N = N * 2.0 - 1.0;
        N = normalize(v_TBN * N);
    }
    else{
        N = normalize(v_normal);
    }

    vec4 textureDiffuse = texture2D(u_textureDiffuse, uv);

    vec4 outColor;
    if(u_materialType == 0){
        outColor = u_diffuse * textureDiffuse;
    } else if (u_materialType == 1){
        vec4 textureSpecular = texture2D(u_textureSpecular, uv);
        
        // Lambert's cosine law
        float lambertian = max(dot(N, lightDir), 0.0);
        float specular = 0.0;
        if(lambertian > 0.0) {
            vec3 reflect = reflect(-lightDir, N);      // Reflected light vector

            // Compute the specular term
            float specAngle = max(dot(reflect, viewDir), 0.0);
            specular = pow(specAngle, u_shininess);
        }

        outColor = (u_ambient +
                    lambertian * u_diffuse) * textureDiffuse +
                    (specular * u_specular) * textureSpecular;
    
        // float diff = max(dot(lightDir, N), 0.0);
        // outColor = vec4(diff * textureDiffuse + u_ambient);
    }

    gl_FragColor = outColor;
    // gl_FragColor = vec4(viewDir.z, 0, 0, 1.0);
}
