export type InputOptions = {
  name: string;
  value: string | number;
};

export type SceneSchema = {
  id: string;
  name: string;
  children?: NodeSchema[];
};

export type NodeSchema = {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  children?: NodeSchema[];
};

export type AnimationController = {
  play: boolean;
  pause: boolean;
  reverse: boolean;
  playback: boolean;
};
