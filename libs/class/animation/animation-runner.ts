import { AnimationClip } from "../../base-types/animation";
import Object3D from "../object3d";
import Vector3 from "../../base-types/vector3";
import { Euler } from "../../base-types/euler";
import { Quaternion } from "../../base-types/quaternion";
import { AnimationEasingFunc, AnimationEasingType } from "./animation-easing";

export class AnimationRunner {
  isPlaying: boolean = false;
  fpkey: number = 30;
  easing: AnimationEasingType = AnimationEasingType.LINEAR;
  private root: Object3D;
  private currentFrame: number = 0;
  private deltaFrame: number = 0;
  private currentAnimation?: AnimationClip;

  constructor(
    clip: AnimationClip,
    root: Object3D,
    options: {
      fpkey?: number;
      easing?: AnimationEasingType;
    } = {}
  ) {
    this.currentAnimation = clip;
    this.root = root;
    this.fpkey = options.fpkey || 144;
    this.easing = options.easing || AnimationEasingType.LINEAR;
  }

  get CurrentFrame() {
    return this.currentFrame;
  }

  get length() {
    return this.currentAnimation!.frames.length;
  }

  private get frame() {
    return this.currentAnimation!.frames[this.currentFrame];
  }

  update() {
    if (this.isPlaying) {
      const progress = this.deltaFrame / this.fpkey;
      const modifier = AnimationEasingFunc[this.easing](progress);

      this.updateSceneGraph(modifier);

      if (progress >= 1) {
        this.deltaFrame = 0;

        if (this.currentFrame == this.currentAnimation!.frames.length - 1) {
          this.currentFrame = 0;
        } else {
          this.currentFrame++;
        }
      }
      this.deltaFrame++;
    }
  }

  private updateSceneGraph(modifier: number) {
    // Update scene graph with current frame
    const frame = this.frame;
    const nextFrame =
      this.currentAnimation!.frames[(this.currentFrame + 1) % this.length];

    // Use root as the parent and traverse according to the frame
    // TODO: Optimize

    // Translation
    if (nextFrame.keyframe?.translation) {
      const start = frame.keyframe?.translation
        ? new Vector3(frame.keyframe?.translation)
        : this.root.position;
      const end = new Vector3(nextFrame.keyframe?.translation);

      this.root.position = start.add(
        end.substract(start).multiplyScalar(modifier)
      );
    }

    // Rotation
    if (nextFrame.keyframe?.rotation) {
      let start: Vector3;
      if (frame.keyframe?.rotation) {
        start = new Vector3(frame.keyframe?.rotation);
      } else {
        const euler: Euler = new Euler();
        euler.setFromQuaternion(this.root.rotation as Quaternion);

        start = new Vector3(euler.x, euler.y, euler.z);
      }
      const end = new Vector3(nextFrame.keyframe?.rotation);
      const euler = start.add(end.substract(start).multiplyScalar(modifier));

      this.root.rotation = Quaternion.Euler(
        new Euler(...euler.getVector(), "xyz")
      );
    }

    // Scale
    if (nextFrame.keyframe?.scale) {
      const start = frame.keyframe?.scale
        ? new Vector3(frame.keyframe?.scale)
        : this.root.position;
      const end = new Vector3(nextFrame.keyframe?.scale);

      this.root.position = start.add(
        end.substract(start).multiplyScalar(modifier)
      );
    }

    // this.root.children.forEach((child) => {
    //   this.updateSceneGraphTraverse(child, modifier);
    // });
  }

  private updateSceneGraphTraverse(node: Object3D, modifier: number) {
    // Update scene graph with current frame
    const frame = this.frame;
    const nextFrame =
      this.currentAnimation!.frames[(this.currentFrame + 1) % this.length];

    // Use root as the parent and traverse according to the frame
    // TODO: Optimize

    // Translation
    if (nextFrame.keyframe?.translation) {
      const start = frame.keyframe?.translation
        ? new Vector3(frame.keyframe?.translation)
        : node.position;
      const end = new Vector3(nextFrame.keyframe?.translation);

      node.position = start.add(end.substract(start).multiplyScalar(modifier));
    }

    // Rotation
    if (nextFrame.keyframe?.rotation) {
      let start: Vector3;
      if (frame.keyframe?.rotation) {
        start = new Vector3(frame.keyframe?.rotation);
      } else {
        const euler: Euler = new Euler();
        euler.setFromQuaternion(node.rotation as Quaternion);

        start = new Vector3(euler.x, euler.y, euler.z);
      }
      const end = new Vector3(nextFrame.keyframe?.rotation);
      const euler = start.add(end.substract(start).multiplyScalar(modifier));

      node.rotation = Quaternion.Euler(new Euler(...euler.getVector(), "xyz"));
    }

    // Scale
    if (nextFrame.keyframe?.scale) {
      const start = frame.keyframe?.scale
        ? new Vector3(frame.keyframe?.scale)
        : node.position;
      const end = new Vector3(nextFrame.keyframe?.scale);

      node.position = start.add(end.substract(start).multiplyScalar(modifier));
    }

    node.children.forEach((child) => {
      this.updateSceneGraphTraverse(child, modifier);
    });
  }

  private load(animFile: string): AnimationClip | undefined {
    // TODO: load animation from file
    return;
  }
}
