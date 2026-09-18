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

document.querySelectorAll(".card-action, .text-link").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    lastTrigger = trigger;
    detailsTitle.textContent = trigger.dataset.title;
    detailsCopy.textContent = trigger.dataset.copy;
    detailsPanel.hidden = false;
    closeButton.focus();
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const partnerList = document.querySelector(".partner-list");

document.querySelectorAll(".strip-arrow").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.stripDirection === "next" ? 1 : -1;
    partnerList.scrollBy({ left: direction * 260, behavior: "smooth" });
  });
});

closeButton.addEventListener("click", closeDetails);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !detailsPanel.hidden) {
    closeDetails();
  }
});
