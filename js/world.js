export class World {
  constructor(width = 2400, height = 420) {
    this.width = width;
    this.height = height;
    this.cameraX = 0;
    this.speed = 260;
    this.baseSpeed = 260;
    this.distance = 0;
    this.progress = 0;
    this.sections = [];
    this.generateInitialSections();
  }

  generateInitialSections() {
    for (let index = 0; index < 6; index += 1) {
      this.sections.push(this.generateSection(index * 350));
    }
  }

  generateSection(offsetX) {
    const platforms = [];
    const count = 3 + Math.floor(Math.random() * 2);

    for (let index = 0; index < count; index += 1) {
      platforms.push({
        x: offsetX + 120 + index * 180 + Math.random() * 40,
        y: 260 + Math.random() * 70,
        width: 80 + Math.random() * 80,
        height: 18,
      });
    }

    return { offsetX, platforms };
  }

  update(delta, player) {
    this.distance += this.speed * delta;
    this.progress = this.distance / 1000;
    this.speed = this.baseSpeed + this.progress * 40;
    this.cameraX = Math.max(0, player.x - 200);
  }

  getVisiblePlatforms() {
    return this.sections.flatMap((section) => section.platforms).filter((platform) => platform.x + platform.width > this.cameraX - 220);
  }
}
