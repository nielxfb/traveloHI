import { Animations } from "../animation";
import { lowKickSprites } from "../sword-impulse-sprites/low-kick-sprites";

export class LowKickAnimation extends Animations {
  constructor() {
    super(lowKickSprites, 10);
  }
}