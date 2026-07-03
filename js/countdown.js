export function initCountdown() {
  const countdownRoot = document.querySelector(".countdown");
  if (!countdownRoot) {
    return;
  }

  const targetDate = new Date(2027, 3, 1, 0, 0, 0);
  const values = Array.from(countdownRoot.querySelectorAll("[data-countdown]"));

  const update = () => {
    const now = new Date();
    const diff = Math.max(0, targetDate - now);

    const parts = [
      Math.floor(diff / (1000 * 60 * 60 * 24)),
      Math.floor((diff / (1000 * 60 * 60)) % 24),
      Math.floor((diff / (1000 * 60)) % 60),
      Math.floor((diff / 1000) % 60),
    ];

    values.forEach((value, index) => {
      value.textContent = String(parts[index]).padStart(2, "0");
    });
  };

  update();
  window.setInterval(update, 1000);
}
