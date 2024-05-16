class AnimationEasing {
  public static linear(progress: number) {
    return progress;
  }
  public static easeInSine(progress: number) {
    return 1 - Math.cos((progress * Math.PI) / 2);
  }
  public static easeOutSine(progress: number) {
    return Math.sin((progress * Math.PI) / 2);
  }
  public static easeInOutSine(progress: number) {
    return -(Math.cos(Math.PI * progress) - 1) / 2;
  }
  public static easeInBounce(target: number): number {
    return 1 - AnimationEasing.easeOutBounce(1 - target);
  }
  public static easeOutBounce(target: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (target < 1 / d1) {
      return n1 * target * target;
    } else if (target < 2 / d1) {
      return n1 * (target -= 1.5 / d1) * target + 0.75;
    } else if (target < 2.5 / d1) {
      return n1 * (target -= 2.25 / d1) * target + 0.9375;
    } else {
      return n1 * (target -= 2.625 / d1) * target + 0.984375;
    }
  }
  public static easeInOutBounce(x: number): number {
    return x < 0.5
      ? (1 - AnimationEasing.easeOutBounce(1 - 2 * x)) / 2
      : (1 + AnimationEasing.easeOutBounce(2 * x - 1)) / 2;
  }
}

export enum AnimationEasingType {
  LINEAR,
  EASE_IN_SINE,
  EASE_OUT_SINE,
  EASE_IN_OUT_SINE,
  EASE_IN_BOUNCE,
  EASE_OUT_BOUNCE,
  EASE_IN_OUT_BOUNCE,
}

export const AnimationEasingFunc: {
  [key in AnimationEasingType]: (progress: number) => number;
} = {
  [AnimationEasingType.LINEAR]: AnimationEasing.linear,
  [AnimationEasingType.EASE_IN_SINE]: AnimationEasing.easeInSine,
  [AnimationEasingType.EASE_OUT_SINE]: AnimationEasing.easeOutSine,
  [AnimationEasingType.EASE_IN_OUT_SINE]: AnimationEasing.easeInOutSine,
  [AnimationEasingType.EASE_IN_BOUNCE]: AnimationEasing.easeInBounce,
  [AnimationEasingType.EASE_OUT_BOUNCE]: AnimationEasing.easeOutBounce,
  [AnimationEasingType.EASE_IN_OUT_BOUNCE]: AnimationEasing.easeInOutBounce,
};
