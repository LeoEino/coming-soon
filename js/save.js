export class SaveSystem {
  constructor(key = "eino-studio-highscore") {
    this.key = key;
  }

  getHighScore() {
    const value = localStorage.getItem(this.key);
    return value ? Number(value) : 0;
  }

  saveHighScore(score) {
    localStorage.setItem(this.key, String(score));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
