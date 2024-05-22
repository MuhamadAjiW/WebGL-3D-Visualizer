import { Euler } from "@/libs/base-types/euler";
import Vector3 from "@/libs/base-types/vector3";
import Object3D from "@/libs/class/object3d";

export type AnimationControllerType = {
  play: boolean;
  pause: boolean;
  reverse: boolean;
  playback: boolean;
  currentFrame: number;
  maxFrame: number;
};

export type CameraControllerType = {
  type: string;
  distance: number;
  reset: boolean;
};

export function checkAnimationUpdate(
  newControllerState: AnimationControllerType,
  animationController: AnimationControllerType
): boolean {
  return (
    newControllerState.currentFrame != animationController.currentFrame ||
    newControllerState.maxFrame != animationController.maxFrame ||
    newControllerState.pause != animationController.pause ||
    newControllerState.play != animationController.play ||
    newControllerState.playback != animationController.playback ||
    newControllerState.reverse != animationController.reverse
  );
}

export function checkCameraUpdate(
  newControllerState: CameraControllerType,
  cameraController: CameraControllerType
): boolean {
  return (
    newControllerState.distance != cameraController.distance ||
    newControllerState.type != cameraController.type ||
    newControllerState.reset != cameraController.reset
  );
}
