import { Texture } from "./texture";

export class TextureLoader{
    public static load(imagePath?: string) : Texture {
        let texture = new Texture();

        if(imagePath){
            texture.image = new Image();
            texture.image.src = imagePath;
        }
        
        return texture;
    }
}