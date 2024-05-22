import { Euler } from "@/libs/base-types/euler";
import Vector3 from "@/libs/base-types/vector3";

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

export type AnimationControllerType = {
  play: boolean;
  pause: boolean;
  reverse: boolean;
  playback: boolean;
  currentFrame: number;
  maxFrame: number;
};

export type ComponentControllerType = {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
};

export type CameraControllerType = {
  type: string;
  distance: number;
};
