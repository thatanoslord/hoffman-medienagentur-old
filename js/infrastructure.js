document.addEventListener("DOMContentLoaded", () => {
        const navBar = document.getElementById("navBar");
        const servicesItem = document.querySelector(".nav-item--services");
        const servicesTrigger = servicesItem?.querySelector(".nav-trigger");

        if (navBar) {
          const regularNavItems = navBar.querySelectorAll(
            ".nav-item:not(.nav-item--services)",
          );

          regularNavItems.forEach((item) => {
            item.addEventListener("click", () => {
              regularNavItems.forEach((link) => {
                link.classList.remove("active");

                const oldLamp = link.querySelector(".lamp");
                if (oldLamp) oldLamp.remove();
              });

              item.classList.add("active");

              const lamp = document.createElement("span");
              lamp.className = "lamp";
              lamp.innerHTML = `
            <span class="lamp-top">
              <span class="glow glow-1"></span>
              <span class="glow glow-2"></span>
              <span class="glow glow-3"></span>
            </span>
          `;

              item.appendChild(lamp);
            });
          });
        }

        if (!servicesItem || !servicesTrigger) return;

        function closeServicesMenu() {
          servicesItem.classList.remove("is-open");
          servicesTrigger.setAttribute("aria-expanded", "false");
        }

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
      });
    
;

      (function () {
        const revealItems = document.querySelectorAll(
          ".reveal-footer-up, .reveal-footer-link, .reveal-footer-brand, .reveal-footer-copy, .reveal-grid",
        );

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.5,
          },
        );

        revealItems.forEach((item) => observer.observe(item));
      })();
