import { BlastImpulse } from "../../player/blast-impulse";
import { PlayerState } from "../player-state";

export class BackwardState implements PlayerState {
  public update(player: BlastImpulse, context: CanvasRenderingContext2D): void {
    player.x -= player.speed;
    player.currAnimation = player.backwardAnimation;
    player.currAnimation.drawImage(context, player.x, player.y);
  }
}
