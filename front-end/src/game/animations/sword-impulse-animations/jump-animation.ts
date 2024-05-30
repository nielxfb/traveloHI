import { Animations } from "../animation";
import { jumpSprites } from "../sword-impulse-sprites/jump-sprites";

export class JumpAnimation extends Animations {
  constructor() {
    super(jumpSprites, 10);
  }
}