const detailsPanel = document.querySelector(".details-panel");
const detailsTitle = detailsPanel?.querySelector("h2");
const detailsCopy = detailsPanel?.querySelector("p");
const closeButton = detailsPanel?.querySelector(".details-close");
let lastTrigger = null;

function closeDetails() {
  if (!detailsPanel) return;
  detailsPanel.hidden = true;
  if (lastTrigger) {
    lastTrigger.focus();
  }
}

document.querySelectorAll(".card-action, .text-link").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!detailsPanel) return;
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
    if (!partnerList) return;
    const direction = button.dataset.stripDirection === "next" ? 1 : -1;
    partnerList.scrollBy({ left: direction * 260, behavior: "smooth" });
  });
});

closeButton?.addEventListener("click", closeDetails);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && detailsPanel && !detailsPanel.hidden) {
    closeDetails();
  }
});

const productsMenu = document.querySelector(".products-menu");
const productsToggle = document.querySelector(".products-toggle");
const productsDropdown = document.querySelector(".products-dropdown");

function closeProductsMenu() {
  if (!productsMenu || !productsToggle || !productsDropdown) return;
  productsMenu.classList.remove("is-open");
  productsToggle.setAttribute("aria-expanded", "false");
}

productsToggle?.addEventListener("click", () => {
  const isOpen = productsMenu.classList.toggle("is-open");
  productsToggle.setAttribute("aria-expanded", String(isOpen));
});

productsDropdown?.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  event.stopPropagation();
  window.location.assign(link.href);
});

document.addEventListener("click", (event) => {
  if (productsMenu && !productsMenu.contains(event.target)) {
    closeProductsMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductsMenu();
  }
});

const productToast = document.querySelector(".product-toast");

document.querySelectorAll(".sales-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (!productToast) return;
    productToast.textContent = `${button.dataset.product} selected. Our team will be in touch.`;
    productToast.hidden = false;
    window.setTimeout(() => {
      productToast.hidden = true;
    }, 3500);
  });
});
