export class InputManager {
  constructor() {
    this.keys = new Set();
    this.touches = new Set();
    this.tapCount = 0;
    this.lastTapTime = 0;
    this.preventScroll = true;
    this.bindEvents();
  }

  normalizeKey(event) {
    const code = event.code || "";

    if (code === "Space") {
      return " ";
    }

    if (code === "ArrowUp") {
      return "ArrowUp";
    }

    if (code === "ArrowDown") {
      return "ArrowDown";
    }

    if (code === "ArrowLeft") {
      return "ArrowLeft";
    }

    if (code === "ArrowRight") {
      return "ArrowRight";
    }

    if (code === "Escape") {
      return "Escape";
    }

    return event.key || "";
  }

  bindEvents() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
    window.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: false });
    window.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: false });
    window.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: false });
  }

  handleKeyDown(event) {
    const key = this.normalizeKey(event);

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Escape", "r", "R"].includes(key)) {
      event.preventDefault();
    }

    this.keys.add(key);
  }

  handleKeyUp(event) {
    const key = this.normalizeKey(event);
    this.keys.delete(key);
  }

  handleTouchStart(event) {
    if (this.preventScroll) {
      event.preventDefault();
    }

    const now = performance.now();
    if (now - this.lastTapTime < 280) {
      this.tapCount += 1;
    } else {
      this.tapCount = 1;
    }

    this.lastTapTime = now;
    this.touches.add("tap");
  }

  handleTouchEnd(event) {
    if (this.preventScroll) {
      event.preventDefault();
    }

    this.touches.delete("tap");
  }

  handleTouchMove(event) {
    if (this.preventScroll) {
      event.preventDefault();
    }
  }

  isPressed(key) {
    return this.keys.has(key);
  }

  isTouchActive() {
    return this.touches.size > 0;
  }

  isTapDouble() {
    return this.tapCount >= 2;
  }

  resetTap() {
    this.tapCount = 0;
  }
}
