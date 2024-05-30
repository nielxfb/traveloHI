import { BlastImpulse } from "../../player/blast-impulse";
import { PlayerState } from "../player-state";

export class WalkingState implements PlayerState {
  update(player: BlastImpulse, context: CanvasRenderingContext2D): void {
    player.x += player.speed;
    player.currAnimation = player.walkingAnimation;
    player.currAnimation.drawImage(context, player.x, player.y);
  }
}
