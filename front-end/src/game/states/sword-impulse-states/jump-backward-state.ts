import { SwordImpulse } from "../../player/sword-impulse";
import { PlayerState } from "../player-state";

export class JumpBackwardState implements PlayerState {
  update(player: SwordImpulse, context: CanvasRenderingContext2D): void {
    player.x -= player.speed;
    player.currAnimation = player.jumpAnimation;
    player.y += player.jumpSpeed;
    player.jumpSpeed += player.gravity;
    player.currAnimation.drawImage(context, player.x, player.y);

    if (player.y >= window.innerHeight - 350) {
      player.currState = player.idleState;
      player.jumpSpeed = -15;
    }
  }
}
