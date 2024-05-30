import { SwordImpulse } from "../../player/sword-impulse";
import { PlayerState } from "../player-state";

export class IdleState implements PlayerState {
    public update (player: SwordImpulse, context: CanvasRenderingContext2D) {
        player.currAnimation = player.idleAnimation;
        player.currAnimation.drawImage(context, player.x, player.y)
    }
}