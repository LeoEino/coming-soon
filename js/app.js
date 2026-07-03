import { initCountdown } from "./countdown.js";
import { initParticles } from "./particles.js";
import { initUI } from "./ui.js";
import { initStorage } from "./storage.js";
import { initEasterEggs } from "./easterEggs.js";

// Bootstraps the website experience separately from the game engine.
export function initApp() {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    root.classList.add("reduced-motion-ready");
  }

  initStorage();
  initCountdown();
  initParticles();
  initUI();
  initEasterEggs();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initApp(), { once: true });
  } else {
    initApp();
  }
}
