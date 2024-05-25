precision mediump float;

varying vec3 v_normal;          // Surface normal
varying vec3 v_position;        // Vertex position
varying vec2 v_texCoord;        // Texture mapping
varying mat3 v_TBN;        // TBN Matrix
varying vec3 v_lightPos;        // Light position
varying vec3 v_tangentLightPos;
varying vec3 v_tangentViewPos;
varying vec3 v_tangentFragPos;

uniform sampler2D u_diffuseTexture;
uniform sampler2D u_specularTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_parallaxTexture;
uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;      // Shininess
uniform int u_materialType;
uniform bool u_normalActive;
uniform bool u_parallaxActive;
uniform float u_parallaxHeight;

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir) {
    float height = texture2D(u_parallaxTexture, texCoords).r;
    vec2 p = viewDir.xy / viewDir.z * (height * u_parallaxHeight);
    return texCoords - p;
}

void main() {
    vec3 viewDir = normalize(v_tangentViewPos - v_tangentFragPos);
    // vec3 lightDir = normalize(v_tangentLightPos - v_tangentFragPos);
    vec3 lightDir = normalize(v_lightPos - v_position);

    vec2 uv = v_texCoord;

    if(u_parallaxActive){
        uv = ParallaxMapping(v_texCoord, viewDir);
    }

    vec3 N;
    if(u_normalActive){
        N = texture2D(u_normalTexture, uv).rgb;
        N = N * 2.0 - 1.0;
        N = normalize(v_TBN * N);
    }
    else{
        N = normalize(v_normal);
    }

    vec4 textureDiffuse = texture2D(u_diffuseTexture, uv);

    vec4 outColor;
    if(u_materialType == 0){
        outColor = u_diffuseColor * textureDiffuse;
    } else if (u_materialType == 1){
        // Source https://www.cs.toronto.edu/~jacobson/phong-demo/
        vec4 textureSpecular = texture2D(u_specularTexture, uv);
        
        // Lambert's cosine law
        float lambertian = max(dot(N, lightDir), 0.0);
        float specular = 0.0;
        if(lambertian > 0.0) {
            vec3 reflect = reflect(-lightDir, N);      // Reflected light vector

            // Compute the specular term
            float specAngle = max(dot(reflect, viewDir), 0.0);
            specular = pow(specAngle, u_shininess);
        }

        outColor = (u_ambientColor +
                    lambertian * u_diffuseColor) * textureDiffuse +
                    (specular * u_specularColor) * textureSpecular;

        // Ini kalo ngikutin guidebook
        // vec4 ambient = u_ambientColor * vec4(1.0, 1.0, 1.0, 1.0) * 0.3;
        // vec4 diffuse =
        //     u_diffuseColor *
        //     max(dot(-lightDir, N), 0.0) *
        //     texture2D(u_diffuseTexture, v_texCoord);
        // vec4 specular =
        //     u_specularColor *
        //     pow(max(dot(N, lightDir + viewDir), 0.0), u_shininess) *
        //     texture2D(u_specularTexture, v_texCoord);


        // float attenuation = 1.0;
        // outColor = attenuation * (diffuse + specular) + ambient;
    }

    gl_FragColor = outColor;
    // gl_FragColor = vec4(viewDir.z, 0, 0, 1.0);
}
