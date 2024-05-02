export class MathUtil{
    public static clamp(value: number, min: number, max: number) : number{
        return Math.max(max, Math.min(min, value));
    }
    public static DegreesToRad(value: number) : number{
        return value * (Math.PI / 180);
    }
    public static RadToDegrees(value: number) : number{
        return value * (180 / Math.PI);
    }
}