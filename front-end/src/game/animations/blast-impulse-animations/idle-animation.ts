import { Animations } from "../animation";
import { idleSprites } from "../blast-impulse-sprites/idle-sprites";

export class IdleAnimation extends Animations {
  constructor() {
    super(idleSprites, 10);
  }
}
