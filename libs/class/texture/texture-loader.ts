import { Texture } from "./texture";

export class TextureLoader {
  public static async load(imagePath: string): Promise<Texture> {
    let texture: Texture;

    if (imagePath == "") {
      texture = new Texture();
      return texture;
    }

    let image: HTMLImageElement = new Image();
    image.src = imagePath;
    await this.loadImage(image);

    texture = new Texture({ image: image });
    texture.image_path = imagePath;

    return texture;
  }

  private static async loadImage(img: HTMLImageElement) {
    return new Promise((resolve) => {
      img.onload = async () => {
        resolve(true);
      };
    });
  }
}
