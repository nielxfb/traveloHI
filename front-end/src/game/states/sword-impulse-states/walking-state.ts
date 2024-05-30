import { SwordImpulse } from "../../player/sword-impulse";
import { PlayerState } from "../player-state";

export class WalkingState implements PlayerState {
  update(player: SwordImpulse, context: CanvasRenderingContext2D): void {
    player.x += player.speed;
    player.currAnimation = player.walkingAnimation;
    player.currAnimation.drawImage(context, player.x, player.y);
  }
}
