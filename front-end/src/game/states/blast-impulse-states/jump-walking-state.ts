import { BlastImpulse } from "../../player/blast-impulse";
import { PlayerState } from "../player-state";

export class JumpWalkingState implements PlayerState {
  update(player: BlastImpulse, context: CanvasRenderingContext2D): void {
    player.x += player.speed;
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
