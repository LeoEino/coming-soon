export class PhysicsBody {
  constructor({ x = 0, y = 0, vx = 0, vy = 0, width = 20, height = 20, gravity = 900, jumpForce = 420 } = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = width;
    this.height = height;
    this.gravity = gravity;
    this.jumpForce = jumpForce;
    this.onGround = false;
  }

  applyGravity(delta) {
    this.vy += this.gravity * delta;
  }

  jump() {
    if (!this.onGround) {
      return false;
    }

    this.vy = -this.jumpForce;
    this.onGround = false;
    return true;
  }

  integrate(delta) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
  }

  update(delta) {
    this.onGround = false;
    this.applyGravity(delta);
    this.integrate(delta);
  }
}
