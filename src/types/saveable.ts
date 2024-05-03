interface Saveable {
  fromJSON(json: string): Saveable;
  toJSON(): string;
}
