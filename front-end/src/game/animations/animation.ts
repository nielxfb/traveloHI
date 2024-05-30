export class Animations {
  public sprites: HTMLImageElement[];
  public totalFrames: number;
  public currFrame: number;
  public frameCount: number;
  public frameInterval: number;

  constructor(paths: string[], frameInterval: number) {
    this.sprites = [];
    paths.forEach((path) => {
      let sprite = new Image();
      sprite.src = path;
      this.sprites.push(sprite);
    });
    this.totalFrames = paths.length;
    this.frameInterval = frameInterval;
    this.currFrame = 0;
    this.frameCount = 0;
  }

  public updateFrame() {
    this.frameCount++;

    if (this.frameCount >= this.frameInterval) {
      this.frameCount = 0;
      this.currFrame = (this.currFrame + 1) % this.totalFrames;
    }
  }

  public drawImage(context: CanvasRenderingContext2D, x: number, y: number) {
    context.drawImage(this.sprites[this.currFrame], x, y, 130, 170);
    this.updateFrame();
  }
}
