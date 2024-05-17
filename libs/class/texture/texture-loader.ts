import { Texture } from "./texture";

export class TextureLoader {
  public static async load(imagePath: string): Promise<Texture> {
    let image: HTMLImageElement = new Image();
    image.src = imagePath;
    await this.loadImage(image);

    let texture = new Texture({ image: image });
    texture.image_path = imagePath;

    return texture;
  }

  private static async loadImage(img: HTMLImageElement) {
    console.log(`Loading image: ${img.src}`);
    return new Promise((resolve) => {
      img.onload = async () => {
        console.log("Image Loaded");
        resolve(true);
      };
    });
  }
}
