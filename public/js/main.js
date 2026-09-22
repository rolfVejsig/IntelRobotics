const revealItems = document.querySelectorAll(".reveal");
const partnerList = document.querySelector(".partner-list");
const productsMenu = document.querySelector(".products-menu");
const productsToggle = document.querySelector(".products-toggle");
const productsDropdown = document.querySelector(".products-dropdown");

const closeProductsMenu = () => {
  if (!productsMenu || !productsToggle || !productsDropdown) return;
  productsMenu.classList.remove("is-open");
  productsToggle.setAttribute("aria-expanded", "false");
};

const setupRevealAnimations = () => {
  if (!revealItems.length) return;

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
    return;
  }

  revealItems.forEach((item) => item.classList.add("is-visible"));
};

const setupPartnerStrip = () => {
  if (!partnerList) return;

  document.querySelectorAll(".strip-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.stripDirection === "next" ? 1 : -1;
      partnerList.scrollBy({ left: direction * 260, behavior: "smooth" });
    });
  });
};

const setupProductsMenu = () => {
  if (!productsMenu || !productsToggle || !productsDropdown) return;

  productsToggle.addEventListener("click", () => {
    const isOpen = productsMenu.classList.toggle("is-open");
    productsToggle.setAttribute("aria-expanded", String(isOpen));
  });

  productsDropdown.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    event.stopPropagation();
    window.location.assign(link.href);
  });

  document.addEventListener("click", (event) => {
    if (!productsMenu.contains(event.target)) {
      closeProductsMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProductsMenu();
    }
  });
};

const setupRouteActions = () => {
  document.querySelectorAll("[data-route]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      window.location.assign(trigger.dataset.route);
    });
  });

  document.querySelectorAll(".sales-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });
};

setupRevealAnimations();
setupPartnerStrip();
setupProductsMenu();
setupRouteActions();
