import { Animations } from "../animation";
import { frontKickSprites } from "../blast-impulse-sprites/front-kick-sprites";

export class FrontKickAnimation extends Animations {
  constructor() {
    super(frontKickSprites, 10);
  }
}
