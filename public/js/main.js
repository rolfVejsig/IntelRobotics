const detailsPanel = document.querySelector(".details-panel");
const detailsTitle = detailsPanel.querySelector("h2");
const detailsCopy = detailsPanel.querySelector("p");
const closeButton = detailsPanel.querySelector(".details-close");
let lastTrigger = null;

function closeDetails() {
  detailsPanel.hidden = true;
  if (lastTrigger) {
    lastTrigger.focus();
  }
}

document.querySelectorAll(".card-action").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    lastTrigger = trigger;
    detailsTitle.textContent = trigger.dataset.title;
    detailsCopy.textContent = trigger.dataset.copy;
    detailsPanel.hidden = false;
    closeButton.focus();
  });
});

closeButton.addEventListener("click", closeDetails);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !detailsPanel.hidden) {
    closeDetails();
  }
});
