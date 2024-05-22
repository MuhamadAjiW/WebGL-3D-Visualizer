import { AnimationEasingType } from "../class/animation/animation-easing";

export type AnimationControllerType = {
  play: boolean;
  pause: boolean;
  reverse: boolean;
  playback: boolean;
  manualUpdate: boolean;
  currentFrame: number;
  maxFrame: number;
  fps: number;
  easing: AnimationEasingType;
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
