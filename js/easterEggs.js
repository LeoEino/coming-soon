export function initEasterEggs() {
  const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let index = 0;
  const egg = document.getElementById("easter-egg");

  const showToast = (message) => {
    const container = document.getElementById("toast-container");
    if (!container) {
      return;
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    container.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2200);
  };

  document.addEventListener("keydown", (event) => {
    const key = event.key;
    const expected = sequence[index];

    if (key === expected) {
      index += 1;
      if (index === sequence.length) {
        index = 0;
        if (egg) {
          egg.hidden = false;
          egg.setAttribute("aria-hidden", "false");
        }
        showToast("Hidden character unlocked");
      }
    } else {
      index = 0;
    }
  });
}
