export function initStorage() {
  const storageKey = "eino-studio-preferences";
  const defaults = { darkMode: true, sound: true, challengeMode: false };

  try {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      localStorage.setItem(storageKey, JSON.stringify(defaults));
      return;
    }

    const parsed = JSON.parse(saved);
    document.documentElement.dataset.theme = parsed.darkMode ? "dark" : "light";
    document.documentElement.dataset.sound = parsed.sound ? "on" : "off";
  } catch {
    localStorage.setItem(storageKey, JSON.stringify(defaults));
  }
}
