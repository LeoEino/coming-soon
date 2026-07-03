export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
  }

  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const ratio = this.devicePixelRatio;

    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.width = width;
    this.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawBackground() {
    this.ctx.fillStyle = "#050505";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawFrame() {
    this.clear();
    this.drawBackground();
  }
}
