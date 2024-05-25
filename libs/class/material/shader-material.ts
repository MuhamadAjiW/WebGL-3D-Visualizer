import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";

export abstract class ShaderMaterial {
  // This is internal and really should not be changed outside of texture or texture loader
  public id: string;
  public materialType: number = 0;
  public registeredRenderers: WebGLRenderer[] = [];

  public needsUpdate: boolean = false;

  public normalActive: boolean = false;
  public normalTexture: Texture;

  public parallaxActive: boolean = false;
  public parallaxTexture: Texture;
  public parallaxHeight: number = 0.1;

  public displacementTexture: Texture;
  public displacementHeight: number = 0;
  public displacementActive: boolean = false;

  constructor(
    materialType: number,
    options?: {
      normalActive?: boolean;
      normalTexture?: Texture;

      parallaxActive?: boolean;
      parallaxTexture?: Texture;
      parallaxHeight?: number;

      displacementActive?: boolean;
      displacementTexture?: Texture;
      displacementHeight?: number;
    }
  ) {
    this.id = this.generateId();
    this.materialType = materialType;

    this.normalTexture = options?.normalTexture || new Texture();
    this.normalActive = options?.normalActive || false;

    this.parallaxActive = options?.parallaxActive || false;
    this.parallaxTexture = options?.parallaxTexture || new Texture();
    this.parallaxHeight = options?.parallaxHeight || 0.1;

    this.displacementActive = options?.displacementActive || false;
    this.displacementTexture = options?.displacementTexture || new Texture();
    this.displacementHeight = options?.displacementHeight || 0;
  }

  public register(renderer: WebGLRenderer) {
    this.registeredRenderers.push(renderer);
  }
  public unregister(renderer: WebGLRenderer) {
    this.unloadTexture(renderer);
    this.registeredRenderers = this.registeredRenderers.filter(
      (r) => r !== renderer
    );
  }

  public refreshTextures() {
    this.registeredRenderers.forEach((renderer) => {
      this.loadTexture(renderer);
    });
  }

  protected abstract generateId(): string;
  public abstract loadTexture(renderer: WebGLRenderer): void;
  public abstract unloadTexture(renderer: WebGLRenderer): void;
  public abstract loadUniform(renderer: WebGLRenderer): void;
  public abstract toJson(): string;
  public setNeedsUpdate() {
    this.needsUpdate = true;
  }

  // public static fromJson(json: string) : ShaderMaterial{
  //   const material = JSON.parse(json);
  //   switch (material.materialType) {
  //     case 0:
  //       return BasicMaterial.fromJson(json);

  //     case 1:
  //       return PhongMaterial.fromJson(json);

  //     default:
  //       throw new Error("Invalid material type index method not implemented");
  //   }
  // };
}
