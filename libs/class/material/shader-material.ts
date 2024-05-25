import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";

export abstract class ShaderMaterial {
  // This is internal and really should not be changed outside of texture or texture loader
  public id: string;
  public materialType: number = 0;
  public registeredRenderers: WebGLRenderer[] = [];

  public useNormalTex: boolean = false;
  public useParallaxTex: boolean = false;
  public normalTexture: Texture;
  public parallaxTexture: Texture;
  public needsUpdate: boolean = false;
  public parallaxScale: number = 0.1;

  constructor(
    materialType: number,
    options?: {
      normalTexture?: Texture;
      parallaxTexture?: Texture;
      useNormalTex?: boolean;
      useParallaxTex?: boolean;
      parallaxScale?: number;
    }
  ) {
    this.id = this.generateId();
    this.materialType = materialType;
    this.normalTexture = options?.normalTexture || new Texture();
    this.parallaxTexture = options?.parallaxTexture || new Texture();
    this.useNormalTex = options?.useNormalTex || false;
    this.useParallaxTex = options?.useParallaxTex || false;
    this.parallaxScale = options?.parallaxScale || 0.1;
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
    // this.loadTexture(this.registeredRenderers[0]);
    // this.loadTexture(this.registeredRenderers[1]);
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
