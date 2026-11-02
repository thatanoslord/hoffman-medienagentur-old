
      document.addEventListener("DOMContentLoaded", () => {
        const navBar = document.getElementById("navBar");
        const servicesItem = document.querySelector(".nav-item--services");
        const servicesTrigger = servicesItem?.querySelector(".nav-trigger");

        if (navBar) {
          const regularNavItems = navBar.querySelectorAll(
            ".nav-item:not(.nav-item--services)"
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
        const titles = document.querySelectorAll('.js-faq-title, .js-faq-contact-title');

        titles.forEach((title) => {
          const text = title.textContent.trim();
          const words = text.split(' ');

          title.innerHTML = words
            .map((word, index) => {
              return '<span class="word" style="transition-delay:' + (index * 0.08) + 's">' + word + '</span>';
            })
            .join(' ');

          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            });
          }, {
            threshold: 0.35,
            rootMargin: '0px 0px -20px 0px'
          });

          observer.observe(title);
        });
      })();
    
;

      (function () {
        const accordion = document.querySelector('[data-faq-accordion]');
        if (!accordion) return;

        const items = Array.from(accordion.querySelectorAll('.faq-item'));

        function openItem(item) {
          const button = item.querySelector('.faq-item__trigger');
          const panel = item.querySelector('.faq-item__panel');

          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
        }

        function closeItem(item) {
          const button = item.querySelector('.faq-item__trigger');
          const panel = item.querySelector('.faq-item__panel');

          item.classList.remove('is-open');
          button.setAttribute('aria-expanded', 'false');
        }

        items.forEach((item) => {
          const button = item.querySelector('.faq-item__trigger');

          button.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            items.forEach(closeItem);

            if (!isOpen) {
              openItem(item);
            }
          });
        });

        items.forEach((item) => {
          if (item.classList.contains('is-open')) {
            openItem(item);
          } else {
            closeItem(item);
          }
        });
      })();
    
;

      (function () {
        const items = document.querySelectorAll('.faq-accordion .faq-item');
        if (!items.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
          items.forEach((item) => item.classList.add('is-revealed'));
          return;
        }

        items.forEach((item, index) => {
          item.style.transitionDelay = (index * 0.12) + 's';
        });

        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          });
        }, {
          threshold: 0.18,
          rootMargin: '0px 0px -8% 0px'
        });

        items.forEach((item) => observer.observe(item));
      })();
    
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
    
;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const contactHero = document.querySelector(".contact-hero");

    if (!contactHero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      contactHero.classList.add("is-visible");
      return;
    }

    setTimeout(() => {
      contactHero.classList.add("is-visible");
    }, 120);
  });

;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const contactHero = document.querySelector(".contact-hero");
    const contactSection = document.querySelector(".contact-wrap");

    /* Hero animation: page-load reveal */
    if (contactHero) {
      if (reducedMotion) {
        contactHero.classList.add("is-visible");
      } else {
        setTimeout(() => {
          contactHero.classList.add("is-visible");
        }, 120);
      }
    }

    /* Contact form: reveal once when section enters viewport */
    if (!contactSection) return;

    /* If visitor asks for less movement, show it immediately */
    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      contactSection.classList.add("is-visible");
      return;
    }

    const contactObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -70px 0px",
      }
    );

    contactObserver.observe(contactSection);
  });

;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const contactHero = document.querySelector(".contact-hero");
    const contactSection = document.querySelector(".contact-wrap");
    const contactMap = document.querySelector(".contact-map");
    const mapFrame = document.querySelector(".contact-map iframe");

    /* Hero: reveal on page load */
    if (contactHero) {
      if (reducedMotion) {
        contactHero.classList.add("is-visible");
      } else {
        setTimeout(() => {
          contactHero.classList.add("is-visible");
        }, 120);
      }
    }

    /* Map loader disappears once Google Maps has loaded */
    if (contactMap && mapFrame) {
      mapFrame.addEventListener("load", () => {
        contactMap.classList.add("map-loaded");
      });
    }

    /* Contact form section */
    if (contactSection) {
      if (reducedMotion || !("IntersectionObserver" in window)) {
        contactSection.classList.add("is-visible");
      } else {
        const contactObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.15,
            rootMargin: "0px",
          }
        );

        contactObserver.observe(contactSection);
      }
    }

    /* Map: reveal only after the visitor reaches the map */
    if (contactMap) {
      if (reducedMotion || !("IntersectionObserver" in window)) {
        contactMap.classList.add("is-visible");
      } else {
        const mapObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.25,
            rootMargin: "0px",
          }
        );

        mapObserver.observe(contactMap);
      }
    }
  });
