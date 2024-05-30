import { BlastImpulse } from "../player/blast-impulse";
import { SwordImpulse } from "../player/sword-impulse";

export interface PlayerState {
  update(
    player: BlastImpulse | SwordImpulse,
    context: CanvasRenderingContext2D
  ): void;
}
