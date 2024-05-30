import { Animations } from "../animation";
import { backwardSprites } from "../blast-impulse-sprites/backward-sprites";

export class BackwardAnimation extends Animations {
  constructor() {
    super(backwardSprites, 10);
  }
}
