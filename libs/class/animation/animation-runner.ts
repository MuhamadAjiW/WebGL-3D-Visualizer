import { AnimationClip, AnimationPath } from "../../base-types/animation";
import Object3D from "../object3d";
import Vector3 from "../../base-types/vector3";
import { Euler } from "../../base-types/euler";
import { Quaternion } from "../../base-types/quaternion";
import { AnimationEasingFunc, AnimationEasingType } from "./animation-easing";

export class AnimationRunner {
  isPlaying: boolean = false;
  loop: boolean = false;
  reverse: boolean = false;
  fps: number = 1;
  fpkey: number = 30;
  easing: AnimationEasingType = AnimationEasingType.LINEAR;
  private root: Object3D;
  private currentFrame: number = 0;
  private deltaFrame: number = 0;
  private currentAnimation?: AnimationClip;
  private snapshot: Object3D = new Object3D();

  constructor(
    clip: AnimationClip,
    root: Object3D,
    options: {
      fps?: number;
      fpkey?: number;
      easing?: AnimationEasingType;
      loop?: boolean;
      reverse?: boolean;
    } = {}
  ) {
    this.currentAnimation = clip;
    this.root = root;
    this.fps = options.fps || 1;
    this.fpkey = options.fpkey || 144;
    this.easing = options.easing || AnimationEasingType.LINEAR;
    this.loop = options.loop || false;
    this.reverse = options.reverse || false;

    // const snapshot = this.root;
    // snapshot.name = "Snapshot";
    // console.log(snapshot.name);
    // console.log(this.root.name);
  }

  private createSnapshot() {
    this.snapshot = this.root.cloneOrientation();
    this.root.children.forEach((child) => {
      const branch = child.cloneOrientation();
      this.snapshot.add(branch);
    });
  }

  get CurrentFrame() {
    return this.currentFrame;
  }

  set CurrentFrame(val: number) {
    if (val < 0) {
      this.currentFrame = this.length - 1;
      return;
    }
    if (val >= this.length) {
      this.currentFrame = 0;
      return;
    }

    this.currentFrame = val;
  }

  get length() {
    return this.currentAnimation!.frames.length;
  }

  private get frame() {
    return this.currentAnimation!.frames[this.currentFrame];
  }

  private get nextFrame() {
    let index = this.reverse ? this.currentFrame - 1 : this.currentFrame + 1;
    if (index < 0) {
      index = this.length - 1;
    } else if (index >= this.length) {
      index = 0;
    }
    return this.currentAnimation!.frames[index];
  }

  update() {
    if (this.isPlaying) {
      const progress = (this.deltaFrame / this.fpkey) * this.fps;
      const modifier = AnimationEasingFunc[this.easing](progress);
      console.log(modifier);

      this.updateSceneGraph(this.root, this.snapshot, this.nextFrame, modifier);

      if (progress >= 1) {
        this.createSnapshot();

        console.log(progress);
        this.deltaFrame = 0;

        this.CurrentFrame += this.reverse ? -1 : 1;
        if (
          !this.loop &&
          ((this.currentFrame == this.currentAnimation!.frames.length - 1 &&
            !this.reverse) ||
            (this.currentFrame == 0 && this.reverse))
        ) {
          this.isPlaying = false;
          this.currentFrame = 0;
          return;
        }
      }

      this.deltaFrame++;
    }
  }

  public playAnimation() {
    console.log("Animation: Playing");
    this.isPlaying = true;
    // this.currentFrame = 0;
    this.createSnapshot()
  }

  public Pause() {
    console.log("Animation: Pausing");
    this.isPlaying = false;
  }

  public Reverse() {
    console.log("Animation: Reversing");
    this.reverse = this.reverse;
  }

  public Loop() {
    console.log("Animation: Looping");
    this.loop = true;
  }

  private updateSceneGraph(
    node: Object3D,
    snapshotNode: Object3D,
    path: AnimationPath,
    modifier: number
  ) {
    // Use root as the parent and traverse according to the frame
    // TODO: Optimize

    // Translation
    if (path.keyframe?.translation) {
      const start = snapshotNode.position;
      const end = new Vector3(path.keyframe?.translation);

      node.position = start.add(end.substract(start).multiplyScalar(modifier));
    }

    // Rotation
    if (path.keyframe?.rotation) {
      const initialRotation: Euler = new Euler();
      initialRotation.setFromQuaternion(snapshotNode.rotation as Quaternion);

      const start = new Vector3(
        initialRotation.x,
        initialRotation.y,
        initialRotation.z
      );
      const end = new Vector3(path.keyframe?.rotation);
      const euler = start.add(end.substract(start).multiplyScalar(modifier));

      node.rotation = Quaternion.Euler(new Euler(...euler.getVector(), "xyz"));
    }

    // Scale
    if (path.keyframe?.scale) {
      const start = snapshotNode.position;
      const end = new Vector3(path.keyframe?.scale);

      node.scale = start.add(end.substract(start).multiplyScalar(modifier));
    }

    for (let animChild in path.children) {
      const childNode = node.getChild(animChild);
      const childSnapshot = snapshotNode.getChild(animChild);

      for (let i = 0; i < childNode.length; i++) {
        const element = childNode[i];
        this.updateSceneGraph(
          childNode[i],
          childSnapshot[i],
          path.children![animChild] as AnimationPath,
          modifier
        );
      }
    }
  }

  private initialize(
    node: Object3D = this.root,
    path: AnimationPath = this.reverse
      ? this.currentAnimation!.frames[this.length - 1]
      : this.currentAnimation!.frames[0]
  ) {
    // Update scene graph with current frame
    // Use root as the parent and traverse according to the frame
    // TODO: Optimize

    // Translation
    if (path.keyframe?.translation) {
      node.position = new Vector3(path.keyframe?.translation);
    }

    // Rotation
    if (path.keyframe?.rotation) {
      node.rotation = Quaternion.Euler(new Euler(...path.keyframe?.rotation));
    }

    // Scale
    if (path.keyframe?.scale) {
      node.position = new Vector3(path.keyframe?.scale);
    }

    for (let animChild in this.frame.children) {
      for (let index = 0; index < node.children.length; index++) {
        const element = node.children[index];
        if (animChild == element.name) {
          this.initialize(element, path.children![animChild] as AnimationPath);
          break;
        }
      }
    }

    this.createSnapshot();
  }

  private load(animFile: string): AnimationClip | undefined {
    // TODO: load animation from file
    return;
  }
}
