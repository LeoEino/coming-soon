export class Obstacle {
  constructor({ x = 0, y = 0, width = 24, height = 24, kind = "crate" } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.kind = kind;
    this.active = true;
    this.speed = 0;
  }

  update(delta, worldSpeed) {
    this.x -= worldSpeed * delta;
    if (this.x + this.width < 0) {
      this.active = false;
    }
  }

  render(ctx, cameraX = 0) {
    const offsetX = this.x - cameraX;
    ctx.save();
    ctx.fillStyle = this.kind === "beam" ? "#7c4dff" : "#960018";
    ctx.fillRect(offsetX, this.y, this.width, this.height);
    ctx.restore();
  }
}
