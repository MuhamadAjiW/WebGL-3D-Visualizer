export class VertexBuilder {
  public static generateRectangle(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    length: number,

    axis: string
  ): number[] {
    switch (axis) {
      case "yx":
        return [
          x,
          y,
          z,
          x + width,
          y,
          z,
          x,
          y + height,
          z,

          x + width,
          y + height,
          z,
          x,
          y + height,
          z,
          x + width,
          y,
          z,
        ];
      case "xy":
        return [
          x + width,
          y,
          z,
          x,
          y,
          z,
          x + width,
          y + height,
          z,

          x,
          y + height,
          z,
          x + width,
          y + height,
          z,
          x,
          y,
          z,
        ];
      case "zy":
        return [
          x,
          y,
          z,
          x,
          y,
          z - length,
          x,
          y + height,
          z,

          x,
          y + height,
          z - length,
          x,
          y + height,
          z,
          x,
          y,
          z - length,
        ];
      case "yz":
        return [
          x,
          y,
          z - length,
          x,
          y,
          z,
          x,
          y + height,
          z - length,

          x,
          y + height,
          z,
          x,
          y + height,
          z - length,
          x,
          y,
          z,
        ];
      case "xz":
        return [
          x,
          y,
          z - length,
          x + width,
          y,
          z - length,
          x,
          y,
          z,

          x + width,
          y,
          z,
          x,
          y,
          z,
          x + width,
          y,
          z - length,
        ];
      case "zx":
        return [
          x,
          y,
          z,
          x + width,
          y,
          z,
          x,
          y,
          z - length,

          x + width,
          y,
          z - length,
          x,
          y,
          z - length,
          x + width,
          y,
          z,
        ];
      default:
        throw new Error("Invalid axis in vertex rectangle generation");
    }
  }
}
