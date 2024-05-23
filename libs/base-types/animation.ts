type AnimationTRS = {
  translation?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

type AnimationPath = {
  id?: string;
  keyframe?: AnimationTRS;
  children?: {
    [childName: string]: AnimationPath;
  };
};

type AnimationClip = {
  name: string;
  frames: AnimationPath[];
};

export type { AnimationTRS, AnimationPath, AnimationClip };
