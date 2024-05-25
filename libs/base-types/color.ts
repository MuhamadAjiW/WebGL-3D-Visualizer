export class Color {
  public static WHITE = new Color(255, 255, 255, 255);
  public static BLACK = new Color(0, 0, 0, 255);

  // Attributes
  public r: number = 0;
  public g: number = 0;
  public b: number = 0;
  public a: number = 255;

  // Constructor
  constructor(rgba: number);
  constructor(r: number, g: number, b: number, a: number);
  constructor(point: number[]);
  constructor(
    arg1: number | number[],
    arg2?: number,
    arg3?: number,
    arg4?: number
  ) {
    if (Array.isArray(arg1)) {
      if (arg1.length !== 4) {
        throw new Error(
          "Point array must contain exactly four elements (w, x, y, z)."
        );
      }
      this.r = arg1[0];
      this.g = arg1[1];
      this.b = arg1[2];
      this.a = arg1[3];
    } else {
      if (arg1 && !arg2 && !arg3 && !arg4) {
        this.r = (arg1 >> 24) & 0xff;
        this.g = (arg1 >> 16) & 0xff;
        this.b = (arg1 >> 8) & 0xff;
        this.a = (arg1 >> 0) & 0xff;
      } else {
        this.r = arg1 || 0;
        this.g = arg2 || 0;
        this.b = arg3 || 0;
        this.a = arg4 || 255;
      }
    }
  }

  // Set-getter
  public get(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }

  public getNormalized(): [number, number, number, number] {
    return [this.r / 255, this.g / 255, this.b / 255, this.a / 255];
  }

  public getNumber(): number {
    return (
      ((this.r & 0xff) << 24) |
      ((this.g & 0xff) << 16) |
      ((this.b & 0xff) << 8) |
      (this.a & 0xff)
    );
  }

  public getHexString(): string {
    const number =
      (((this.r & 0xff) << 24) |
        ((this.g & 0xff) << 16) |
        ((this.b & 0xff) << 8) |
        (this.a & 0xff)) >>>
      0;

    return "#" + number.toString(16).padStart(8, "0");
  }

  public set(w: number, x: number, y: number, z: number): void {
    this.r = w;
    this.g = x;
    this.b = y;
    this.a = z;
  }

  public setAttribute(key: string, value: number): void {
    switch (key) {
      case "w":
        this.r = value;
        break;
      case "x":
        this.g = value;
        break;
      case "y":
        this.b = value;
        break;
      case "z":
        this.a = value;
        break;
      default:
        throw new Error("Invalid Key");
    }
  }

  public toString(): string {
    return `(${this.r},${this.g},${this.b},${this.a})`;
  }

  public toJson(): string {
    return JSON.stringify({ r: this.r, g: this.g, b: this.b, a: this.a });
  }

  public static fromJson(json: string): Color {
    const { r, g, b, a } = JSON.parse(json);
    return new Color(r, g, b, a);
  }
}
