export class Timer {
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  time: number;

  constructor(ctx: CanvasRenderingContext2D, time: number) {
    this.x = window.innerWidth / 2 - 15;
    this.y = 70;
    this.ctx = ctx;
    this.time = time;
  }

  render() {
    const formattedTime = this.time.toString().padStart(3, "0");
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(formattedTime, this.x, this.y);
    this.ctx.fillStyle = "black";
  }

  countdown() {
    const interval = setInterval(() => {
      this.time -= 1;
      if (this.time <= 0) {
        clearInterval(interval);
      }
      this.render();
    }, 1000);
  }
}
