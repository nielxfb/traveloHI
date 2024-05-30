import { Animations } from "../animation";
import { lowKickSprites } from "../blast-impulse-sprites/low-kick-sprites";

export class LowKickAnimation extends Animations {
  constructor() {
    super(lowKickSprites, 10);
  }
}
