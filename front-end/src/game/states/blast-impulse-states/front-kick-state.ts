import { BlastImpulse } from "../../player/blast-impulse";
import { PlayerState } from "../player-state";

export class FrontKickState implements PlayerState {
  update(player: BlastImpulse, context: CanvasRenderingContext2D): void {
    player.currAnimation = player.frontKickAnimation;
    player.currAnimation.drawImage(context, player.x, player.y);
  }
}
