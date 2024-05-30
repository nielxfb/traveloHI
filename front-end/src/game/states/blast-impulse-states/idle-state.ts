import { BlastImpulse } from "../../player/blast-impulse";
import { PlayerState } from "../player-state";

export class IdleState implements PlayerState {
    public update (player: BlastImpulse, context: CanvasRenderingContext2D) {
        player.currAnimation = player.idleAnimation;
        player.currAnimation.drawImage(context, player.x, player.y)
    }
}