import { Texture } from "./texture";

export class TextureLoader{
    public static async load(imagePath: string) : Promise<Texture> {
        let texture = new Texture();

        if(imagePath){
            texture.image = new Image();
            texture.image.src = imagePath;
            await this.loadImage(texture.image);
        }
        
        return texture;
    }

    public static create() : Texture {
        return new Texture();
    }


    private static async loadImage(img: HTMLImageElement) {
        return new Promise((resolve, reject) => {
            img.onload = async () => {
                console.log("Image Loaded");
                resolve(true);
            };
        });
    };
}