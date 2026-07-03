export class Collectible {
  constructor({ x = 0, y = 0, width = 18, height = 18, type = "spark" } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.active = true;
    this.t = 0;
  }

  update(delta, worldSpeed) {
    this.x -= worldSpeed * delta;
    this.t += delta;
    if (this.x + this.width < 0) {
      this.active = false;
    }
  }

  render(ctx, cameraX = 0) {
    const offsetX = this.x - cameraX;
    const bob = Math.sin(this.t * 6) * 4;
    ctx.save();
    ctx.fillStyle = this.type === "shield" ? "#f5d76e" : "#2ecc71";
    ctx.fillRect(offsetX, this.y + bob, this.width, this.height);
    ctx.restore();
  }
}
