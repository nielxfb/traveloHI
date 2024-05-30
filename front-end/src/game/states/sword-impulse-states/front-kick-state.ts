import { SwordImpulse } from "../../player/sword-impulse";
import { PlayerState } from "../player-state";

export class FrontKickState implements PlayerState {
    update(player: SwordImpulse, context: CanvasRenderingContext2D): void {
        player.currAnimation = player.frontKickAnimation;
        player.currAnimation.drawImage(context, player.x, player.y);
    }
}