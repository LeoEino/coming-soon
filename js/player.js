export class Player {
  constructor({ x = 80, y = 120, width = 34, height = 48 } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 900;
    this.jumpForce = 420;
    this.onGround = false;
    this.runningFrame = 0;
    this.frameTimer = 0;
    this.jumpBuffer = 0;
    this.coyoteTime = 0;
    this.invulnerable = false;
    this.powerUps = new Set();
    this.scoreBoost = 1;
  }

  update(delta, input) {
    this.frameTimer += delta;
    if (this.frameTimer >= 0.1) {
      this.frameTimer = 0;
      this.runningFrame = (this.runningFrame + 1) % 4;
    }

    if (input.jumpPressed) {
      this.jumpBuffer = 0.12;
    } else if (this.jumpBuffer > 0) {
      this.jumpBuffer -= delta;
    }

    if (this.onGround) {
      this.coyoteTime = 0.1;
    } else if (this.coyoteTime > 0) {
      this.coyoteTime -= delta;
    }

    if ((this.jumpBuffer > 0 && this.coyoteTime > 0) || (input.jumpHeld && this.onGround)) {
      this.vy = -this.jumpForce;
      this.onGround = false;
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
    }

    this.vy += this.gravity * delta;
    this.y += this.vy * delta;
    this.x += this.vx * delta;

    if (this.y > 360) {
      this.y = 360;
      this.vy = 0;
      this.onGround = true;
    }
  }

  jump() {
    if (!this.onGround) {
      return false;
    }

    this.vy = -this.jumpForce;
    this.onGround = false;
    return true;
  }

  applyPowerUp(type) {
    this.powerUps.add(type);
    if (type === "double") {
      this.scoreBoost = 2;
    }
    if (type === "shield") {
      this.invulnerable = true;
    }
  }

  removePowerUp(type) {
    this.powerUps.delete(type);
    if (type === "double") {
      this.scoreBoost = 1;
    }
    if (type === "shield") {
      this.invulnerable = false;
    }
  }

  render(ctx, cameraX = 0) {
    const offsetX = this.x - cameraX;
    ctx.save();
    ctx.translate(offsetX, this.y);
    ctx.fillStyle = this.invulnerable ? "#f5d76e" : "#f2f2f2";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = "#960018";
    ctx.fillRect(this.width - 10, 8, 10, 10);
    ctx.restore();
  }
}
