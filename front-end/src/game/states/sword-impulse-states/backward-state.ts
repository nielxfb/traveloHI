import { SwordImpulse } from "../../player/sword-impulse";
import { PlayerState } from "../player-state";

export class BackwardState implements PlayerState {
  public update(player: SwordImpulse, context: CanvasRenderingContext2D): void {
    player.x -= player.speed;
    player.currAnimation = player.backwardAnimation;
    player.currAnimation.drawImage(context, player.x, player.y);
  }
}
