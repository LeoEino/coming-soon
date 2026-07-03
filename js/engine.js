export class ObjectPool {
  constructor(factory, size = 8) {
    this.factory = factory;
    this.pool = [];

    for (let index = 0; index < size; index += 1) {
      this.pool.push(factory());
    }
  }

  acquire() {
    return this.pool.pop() || this.factory();
  }

  release(item) {
    this.pool.push(item);
  }
}

export class Engine {
  constructor({ canvas, onFrame, onResize } = {}) {
    this.canvas = canvas;
    this.onFrame = onFrame;
    this.onResize = onResize;
    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedStep = 1000 / 60;
    this.frameId = null;
    this.resizeHandler = this.handleResize.bind(this);
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.accumulator = 0;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    if (!this.running) {
      return;
    }

    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  loop(timestamp) {
    if (!this.running) {
      return;
    }

    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.accumulator += Math.min(delta, 250);

    while (this.accumulator >= this.fixedStep) {
      this.step(this.fixedStep / 1000);
      this.accumulator -= this.fixedStep;
    }

    this.render(delta / 1000);
    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }

  step(delta) {
    if (typeof this.onFrame === "function") {
      this.onFrame({ type: "step", delta });
    }
  }

  render(delta) {
    if (typeof this.onFrame === "function") {
      this.onFrame({ type: "render", delta });
    }
  }

  handleResize() {
    if (typeof this.onResize === "function") {
      this.onResize(this.canvas);
    }
  }

  bindEvents() {
    window.addEventListener("resize", this.resizeHandler);
  }

  unbindEvents() {
    window.removeEventListener("resize", this.resizeHandler);
  }
}
