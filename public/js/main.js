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

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories/Get_categories");
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const categories = Array.isArray(data.categories) ? data.categories : [];
      const links = categories
        .filter((category) => category.category_name && category.page_path)
        .map((category) => {
          const link = document.createElement("a");
          link.href = category.page_path;
          link.textContent = category.category_name;
          return link;
        });

      productsDropdown.replaceChildren(...links);
      if (links.length === 0) {
        productsDropdown.textContent = "No categories available";
      }
    } catch (error) {
      console.error("Could not load product menu categories:", error);
      productsDropdown.textContent = "Categories unavailable";
    }
  };

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

  loadCategories();
};

const setupLanguageMenu = () => {
  const navs = document.querySelectorAll(".nav, .product-nav");
  const languages = ["Danish", "Japanese", "Italian", "English"];

  navs.forEach((nav) => {
    const menu = document.createElement("div");
    menu.className = "language-menu";

    const toggle = document.createElement("button");
    toggle.className = "language-toggle";
    toggle.type = "button";
    toggle.textContent = "Language";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-haspopup", "true");

    const dropdown = document.createElement("div");
    dropdown.className = "language-dropdown";
    dropdown.setAttribute("aria-label", "Language options");

    languages.forEach((language) => {
      const option = document.createElement("span");
      option.className = "language-option";
      option.textContent = language;
      dropdown.appendChild(option);
    });

    menu.append(toggle, dropdown);
    const productsItem = nav.querySelector(".products-menu");
    if (productsItem) {
      productsItem.after(menu);
    } else {
      nav.appendChild(menu);
    }

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
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
setupLanguageMenu();
setupRouteActions();

