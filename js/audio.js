export class AudioSystem {
  constructor() {
    this.enabled = true;
    this.context = null;
  }

  init() {
    if (this.context) {
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      this.enabled = false;
      return;
    }

    this.context = new AudioCtx();
  }

  beep(type = "jump") {
    if (!this.enabled || !this.context) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.connect(gain);
    gain.connect(this.context.destination);

    const frequency = type === "collect" ? 880 : 660;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.03;

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.12);
    oscillator.stop(this.context.currentTime + 0.12);
  }
}
