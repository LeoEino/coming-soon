import { Engine, ObjectPool } from "./engine.js";
import { Renderer } from "./renderer.js";
import { Player } from "./player.js";
import { World } from "./world.js";
import { Obstacle } from "./obstacle.js";
import { Collectible } from "./collectible.js";
import { AudioSystem } from "./audio.js";
import { SaveSystem } from "./save.js";
import { InputManager } from "./input.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.input = new InputManager();
    this.engine = new Engine({
      canvas,
      onFrame: this.handleFrame.bind(this),
      onResize: this.handleResize.bind(this),
    });

    this.player = new Player({ x: 80, y: 120, width: 32, height: 48 });
    this.world = new World();
    this.audio = new AudioSystem();
    this.save = new SaveSystem();
    this.obstacles = [];
    this.collectibles = [];
    this.obstaclePool = new ObjectPool(() => new Obstacle(), 24);
    this.collectiblePool = new ObjectPool(() => new Collectible(), 24);
    this.state = {
      running: false,
      paused: false,
      over: false,
      score: 0,
      highScore: this.save.getHighScore(),
      challengeMode: false,
      achievements: new Set(),
      quoteTimer: 0,
      spawnTimer: 0,
      collectibleTimer: 0,
      difficulty: 1,
    };
    this.quotes = [
      "Ideas become worlds when they move.",
      "Story beats are built one step at a time.",
      "Every frame is a new possibility.",
    ];
    this.rooms = ["Idea Room", "Sketch Room", "Storyboard Hall", "Animation Department", "Color Department", "VFX Department", "Render Farm", "Premiere Theater"];
    this.audio.init();
    this.bindInput();
  }

  bindInput() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.togglePause();
      }
      if (event.key.toLowerCase() === "r") {
        this.restart();
      }
    });
  }

  start() {
    this.state.running = true;
    this.engine.bindEvents();
    this.engine.start();
  }

  stop() {
    this.state.running = false;
    this.engine.stop();
    this.engine.unbindEvents();
  }

  togglePause() {
    if (this.state.over) {
      return;
    }
    this.state.paused = !this.state.paused;
  }

  restart() {
    this.player = new Player({ x: 80, y: 120, width: 32, height: 48 });
    this.world = new World();
    this.obstacles = [];
    this.collectibles = [];
    this.state.score = 0;
    this.state.paused = false;
    this.state.over = false;
    this.state.spawnTimer = 0;
    this.state.collectibleTimer = 0;
    this.state.difficulty = 1;
    this.state.quoteTimer = 0;
    this.state.challengeMode = false;
    this.state.achievements.clear();
    this.state.highScore = this.save.getHighScore();
    this.input.resetTap();
  }

  handleResize() {
    this.renderer.resize();
  }

  handleFrame(event) {
    if (!this.state.running) {
      return;
    }

    if (event.type === "step" && !this.state.paused && !this.state.over) {
      this.update(event.delta);
    }

    if (event.type === "render") {
      this.render();
    }
  }

  update(delta) {
    const jumpPressed = this.input.isPressed(" ") || this.input.isPressed("ArrowUp") || this.input.isPressed("w") || this.input.isPressed("W") || this.input.isTouchActive() || this.input.isTapDouble();
    const input = {
      jumpPressed,
      jumpHeld: this.input.isPressed(" ") || this.input.isPressed("ArrowUp") || this.input.isTouchActive(),
    };
    this.input.resetTap();

    this.player.update(delta, input);
    this.world.update(delta, this.player);
    this.state.spawnTimer += delta;
    this.state.collectibleTimer += delta;
    this.state.quoteTimer += delta;
    this.state.score += Math.round(delta * 80 * this.player.scoreBoost);

    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
    }

    if (this.state.score > 0 && this.state.score % 100 === 0 && this.state.quoteTimer > 1.2) {
      this.state.quoteTimer = 0;
      this.showQuote();
    }

    this.state.difficulty = 1 + Math.min(4, Math.floor(this.state.score / 250) * 0.2);
    this.state.challengeMode = this.state.score > 450;
    this.world.speed = this.world.baseSpeed + this.state.difficulty * 24;

    if (this.state.spawnTimer > (1.2 / this.state.difficulty)) {
      this.state.spawnTimer = 0;
      this.spawnObstacle();
    }

    if (this.state.collectibleTimer > (2.2 / this.state.difficulty)) {
      this.state.collectibleTimer = 0;
      this.spawnCollectible();
    }

    this.updateObstacles(delta);
    this.updateCollectibles(delta);
    this.checkCollisions();

    if (this.player.y > this.renderer.height + 140) {
      this.gameOver();
    }
  }

  spawnObstacle() {
    const obstacle = this.obstaclePool.acquire();
    obstacle.x = this.renderer.width + 80;
    obstacle.y = 330;
    obstacle.width = 24 + Math.random() * 18;
    obstacle.height = 24 + Math.random() * 12;
    obstacle.kind = Math.random() > 0.6 ? "beam" : "crate";
    obstacle.active = true;
    this.obstacles.push(obstacle);
  }

  spawnCollectible() {
    const collectible = this.collectiblePool.acquire();
    collectible.x = this.renderer.width + 80;
    collectible.y = 260 + Math.random() * 70;
    collectible.type = Math.random() > 0.7 ? "shield" : "spark";
    collectible.active = true;
    collectible.t = 0;
    this.collectibles.push(collectible);
  }

  updateObstacles(delta) {
    for (const obstacle of this.obstacles) {
      obstacle.update(delta, this.world.speed);
    }
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (!obstacle.active) {
        this.obstaclePool.release(obstacle);
        return false;
      }
      return true;
    });
  }

  updateCollectibles(delta) {
    for (const collectible of this.collectibles) {
      collectible.update(delta, this.world.speed);
    }
    this.collectibles = this.collectibles.filter((collectible) => {
      if (!collectible.active) {
        this.collectiblePool.release(collectible);
        return false;
      }
      return true;
    });
  }

  checkCollisions() {
    if (this.state.paused || this.state.over) {
      return;
    }

    for (const obstacle of this.obstacles) {
      const hit = obstacle.x < this.player.x + this.player.width && obstacle.x + obstacle.width > this.player.x && obstacle.y < this.player.y + this.player.height && obstacle.y + obstacle.height > this.player.y;
      if (hit) {
        if (!this.player.invulnerable) {
          this.gameOver();
        }
      }
    }

    for (const collectible of this.collectibles) {
      const hit = collectible.x < this.player.x + this.player.width && collectible.x + collectible.width > this.player.x && collectible.y < this.player.y + this.player.height && collectible.y + collectible.height > this.player.y;
      if (hit) {
        collectible.active = false;
        this.audio.beep("collect");
        this.player.applyPowerUp(collectible.type === "shield" ? "shield" : "double");
        this.unlockAchievement(collectible.type === "shield" ? "Shielded" : "Boosted");
      }
    }
  }

  showQuote() {
    const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    if (typeof console !== "undefined") {
      console.log(quote);
    }
  }

  unlockAchievement(name) {
    if (!this.state.achievements.has(name)) {
      this.state.achievements.add(name);
      this.audio.beep("collect");
    }
  }

  gameOver() {
    this.state.over = true;
    this.state.paused = false;
    this.save.saveHighScore(this.state.highScore);
  }

  render() {
    this.renderer.drawFrame();

    this.renderer.ctx.save();
    this.renderer.ctx.translate(-this.world.cameraX, 0);

    this.renderer.ctx.fillStyle = "#0d0d12";
    this.renderer.ctx.fillRect(0, 0, this.world.width, this.renderer.height);

    for (const platform of this.world.getVisiblePlatforms()) {
      this.renderer.ctx.fillStyle = "#2e2e35";
      this.renderer.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    for (const obstacle of this.obstacles) {
      obstacle.render(this.renderer.ctx, this.world.cameraX);
    }

    for (const collectible of this.collectibles) {
      collectible.render(this.renderer.ctx, this.world.cameraX);
    }

    this.player.render(this.renderer.ctx, this.world.cameraX);
    this.renderer.ctx.restore();

    this.renderer.ctx.fillStyle = "rgba(255,255,255,0.9)";
    this.renderer.ctx.font = "14px sans-serif";
    this.renderer.ctx.fillText(`Score: ${Math.floor(this.state.score)}`, 14, 24);
    this.renderer.ctx.fillText(`High Score: ${Math.floor(this.state.highScore)}`, 14, 44);
    this.renderer.ctx.fillText(`Room: ${this.rooms[Math.min(this.rooms.length - 1, Math.floor(this.state.score / 220))]}`, 14, 64);
    this.renderer.ctx.fillText(`Mode: ${this.state.challengeMode ? "Challenge" : "Standard"}`, 14, 84);

    if (this.state.paused) {
      this.renderer.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.renderer.ctx.fillRect(0, 0, this.renderer.width, this.renderer.height);
      this.renderer.ctx.fillStyle = "#ffffff";
      this.renderer.ctx.fillText("Paused", this.renderer.width / 2 - 24, this.renderer.height / 2 - 10);
    }

    if (this.state.over) {
      this.renderer.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.renderer.ctx.fillRect(0, 0, this.renderer.width, this.renderer.height);
      this.renderer.ctx.fillStyle = "#ffffff";
      this.renderer.ctx.fillText("Game Over", this.renderer.width / 2 - 34, this.renderer.height / 2 - 8);
    }
  }
}
