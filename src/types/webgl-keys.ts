export class UniformKeys {
  public static LIGHT_COLOR: string = "u_lightColor";
  public static AMBIENT: string = "u_ambient";
  public static TEXTURE: string = "u_texture";
  public static SPECULAR: string = "u_specular";
  public static SHINYNESS: string = "u_shininess";
  public static SPECULAR_FACTOR: string = "u_specularFactor";
  public static PROJECTION_MATRIX: string = "u_projectionMatrix";
  public static LIGHT_WORLD_POSITION: string = "u_lightWorldPos";
  public static WORLD: string = "u_world";
  public static VIEW_INVERSE: string = "u_viewInverse";
  public static WORLD_INVERSE_TRANSPOSE: string = "u_worldInverseTranspose";
}

export class AttributeKeys {
  public static POSITION: string = "a_position";
  public static NORMAL: string = "a_normal";
  public static TEXTURE_COORDS: string = "a_texcoord";
}