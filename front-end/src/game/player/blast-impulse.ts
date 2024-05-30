import { Animations } from "../animations/animation";
import { BackwardAnimation } from "../animations/blast-impulse-animations/backward-animation";
import { FrontKickAnimation } from "../animations/blast-impulse-animations/front-kick-animation";
import { IdleAnimation } from "../animations/blast-impulse-animations/idle-animation";
import { JumpAnimation } from "../animations/blast-impulse-animations/jump-animation";
import { LowKickAnimation } from "../animations/blast-impulse-animations/low-kick-animation";
import { WalkingAnimation } from "../animations/blast-impulse-animations/walking-animation";
import { BackwardState } from "../states/blast-impulse-states/backward-state";
import { FrontKickState } from "../states/blast-impulse-states/front-kick-state";
import { IdleState } from "../states/blast-impulse-states/idle-state";
import { JumpBackwardState } from "../states/blast-impulse-states/jump-backward-state";
import { JumpState } from "../states/blast-impulse-states/jump-state";
import { JumpWalkingState } from "../states/blast-impulse-states/jump-walking-state";
import { LowKickState } from "../states/blast-impulse-states/low-kick-state";
import { PlayerState } from "../states/player-state";
import { WalkingState } from "../states/blast-impulse-states/walking-state";

export class BlastImpulse {
  public context: CanvasRenderingContext2D;
  public healthPoint: number;
  public lowKickAP: number;
  public frontKickAP: number;
  public x: number;
  public y: number;
  public speed: number;
  public jumpSpeed: number;
  public gravity: number;
  public currAnimation: Animations;
  public idleAnimation: IdleAnimation;
  public jumpAnimation: JumpAnimation;
  public walkingAnimation: WalkingAnimation;
  public backwardAnimation: BackwardAnimation;
  public frontKickAnimation: FrontKickAnimation;
  public lowKickAnimation: LowKickAnimation;
  public currState: PlayerState;
  public idleState: IdleState;
  public jumpState: JumpState;
  public walkingState: WalkingState;
  public backwardState: BackwardState;
  public jumpWalkingState: JumpWalkingState;
  public jumpBackwardState: JumpBackwardState;
  public frontKickState: FrontKickState;
  public lowKickState: LowKickState;

  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    this.context = context;
    this.healthPoint = 100;
    this.lowKickAP = 15;
    this.frontKickAP = 10;
    this.x = x;
    this.y = y;
    this.speed = 4;
    this.jumpSpeed = -15;
    this.gravity = 0.5;
    this.idleAnimation = new IdleAnimation();
    this.jumpAnimation = new JumpAnimation();
    this.walkingAnimation = new WalkingAnimation();
    this.backwardAnimation = new BackwardAnimation();
    this.frontKickAnimation = new FrontKickAnimation();
    this.lowKickAnimation = new LowKickAnimation();
    this.currAnimation = this.idleAnimation;
    this.idleState = new IdleState();
    this.jumpState = new JumpState();
    this.walkingState = new WalkingState();
    this.backwardState = new BackwardState();
    this.jumpWalkingState = new JumpWalkingState();
    this.jumpBackwardState = new JumpBackwardState();
    this.frontKickState = new FrontKickState();
    this.lowKickState = new LowKickState();
    this.currState = this.idleState;
  }

  public update = () => {
    this.currState.update(this, this.context)
  }
}
