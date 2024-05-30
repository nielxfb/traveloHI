import { Animations } from "../animation";
import { walkingSprites } from "../blast-impulse-sprites/walking-sprites";

export class WalkingAnimation extends Animations {
  constructor() {
    super(walkingSprites, 10);
  }
}