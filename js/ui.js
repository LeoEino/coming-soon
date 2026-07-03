export function initUI() {
  const buttons = document.querySelectorAll(".button, .icon-button, .social-links a");
  const hero = document.querySelector(".hero");
  const cards = document.querySelectorAll(".countdown-item, .modal-dialog");
  const modalElements = document.querySelectorAll(".modal");
  const settingsButton = document.querySelector("[aria-controls='settings-modal']");
  const settingsModal = document.getElementById("settings-modal");
  const closeButtons = document.querySelectorAll(".modal-close");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => button.classList.add("is-hovered"));
    button.addEventListener("mouseleave", () => button.classList.remove("is-hovered"));
  });

  if (hero) {
    hero.classList.add("is-ready");
  }

  cards.forEach((card, index) => {
    card.style.setProperty("--delay", `${index * 90}ms`);
  });

  const toggleModal = (modal, open) => {
    if (!modal) {
      return;
    }
    modal.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("modal-open", open);
  };

  settingsButton?.addEventListener("click", () => toggleModal(settingsModal, true));
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      toggleModal(modal, false);
    });
  });

  document.removeEventListener("keydown", handleEscape);
  document.addEventListener("keydown", handleEscape);

  function handleEscape(event) {
    if (event.key === "Escape") {
      modalElements.forEach((modal) => toggleModal(modal, false));
    }
  }
}
