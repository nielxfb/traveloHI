import { Animations } from "../animation";
import jumpSprites from "../blast-impulse-sprites/jump-sprites";

export class JumpAnimation extends Animations {
  constructor() {
    super(jumpSprites, 10);
  }
}
