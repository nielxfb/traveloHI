import { BlastImpulse } from "../../player/blast-impulse";
import { PlayerState } from "../player-state";

export class LowKickState implements PlayerState {
  update(player: BlastImpulse, context: CanvasRenderingContext2D): void {
    player.currAnimation = player.lowKickAnimation;
    player.currAnimation.drawImage(context, player.x, player.y);
  }
}
