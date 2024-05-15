export class UniformKeys {
  public static AMBIENT: string = "u_ambient";
  public static DIFFUSE: string = "u_diffuse";
  public static SPECULAR: string = "u_specular";
  public static SHINYNESS: string = "u_shininess";
  public static MATERIAL_TYPE: string = "u_materialType";
  
  public static LIGHT_POSITION: string = "u_lightPos";

  public static PROJECTION_MATRIX: string = "u_projection";
  public static VIEW_MATRIX: string = "u_view";
  public static WORLD_MATRIX: string = "u_world";
  public static NORMAL_MATRIX: string = "u_normalMat";
}

export class AttributeKeys {
  public static POSITION: string = "a_position";
  public static NORMAL: string = "a_normal";
  public static TEXTURE_COORDS: string = "a_texCoord";
}