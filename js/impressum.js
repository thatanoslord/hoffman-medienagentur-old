document.addEventListener("DOMContentLoaded", () => {
  const servicesItem = document.querySelector(".nav-item--services");
  const servicesTrigger = servicesItem?.querySelector(".nav-trigger");

  if (servicesItem && servicesTrigger) {
    const closeServicesMenu = () => {
      servicesItem.classList.remove("is-open");
      servicesTrigger.setAttribute("aria-expanded", "false");
    };

    servicesTrigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const shouldOpen = !servicesItem.classList.contains("is-open");
      servicesItem.classList.toggle("is-open", shouldOpen);
      servicesTrigger.setAttribute("aria-expanded", String(shouldOpen));
    });

    document.addEventListener("click", (event) => {
      if (!servicesItem.contains(event.target)) {
        closeServicesMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeServicesMenu();
        servicesTrigger.focus();
      }
    });
  }

  const revealItems = document.querySelectorAll(
    ".reveal-footer-up, .reveal-footer-link, .reveal-footer-brand, .reveal-footer-copy, .reveal-grid",
  );

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  revealItems.forEach((item) => observer.observe(item));
});
