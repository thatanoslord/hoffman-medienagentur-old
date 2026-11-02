
      const navBar = document.getElementById("navBar");
      const navItems = navBar.querySelectorAll(".nav-item");

      navItems.forEach((item) => {
        item.addEventListener("click", () => {
          navItems.forEach((link) => {
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
    
;

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
        const rows = document.querySelectorAll(".faq-row");
        const revealItems = document.querySelectorAll(
          ".reveal-up, .reveal-row",
        );

        rows.forEach((row) => {
          const trigger = row.querySelector(".faq-trigger");

          trigger.addEventListener("click", function () {
            const isOpen = row.classList.contains("is-open");

            rows.forEach((item) => {
              item.classList.remove("is-open");
              const btn = item.querySelector(".faq-trigger");
              if (btn) btn.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
              row.classList.add("is-open");
              trigger.setAttribute("aria-expanded", "true");
            }
          });
        });

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

      (() => {
        const cursor = document.querySelector(".card-hover-cursor");
        const hoverTargets = document.querySelectorAll(
          ".card, .recent-blog-card",
        );

        if (!cursor || !hoverTargets.length) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let active = false;

        const moveCursor = () => {
          currentX += (mouseX - currentX) * 0.18;
          currentY += (mouseY - currentY) * 0.18;
          cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${active ? 1 : 0.78})`;
          requestAnimationFrame(moveCursor);
        };

        requestAnimationFrame(moveCursor);

        window.addEventListener("mousemove", (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        });

        hoverTargets.forEach((item) => {
          item.addEventListener("mouseenter", () => {
            active = true;
            cursor.classList.add("is-visible");
          });

          item.addEventListener("mouseleave", () => {
            active = false;
            cursor.classList.remove("is-visible");
          });
        });

        window.addEventListener("mousedown", () => {
          if (active) cursor.style.opacity = "0.9";
        });

        window.addEventListener("mouseup", () => {
          if (active) cursor.style.opacity = "1";
        });
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

      (function () {
        // Category filters
        const pills = document.querySelectorAll(".filter-pill");
        const cards = document.querySelectorAll(".blog-grid .card");
        const blogGrid = document.querySelector(".blog-grid");

        pills.forEach((pill) => {
          pill.addEventListener("click", () => {
            pills.forEach((p) => p.classList.remove("is-active"));
            pill.classList.add("is-active");

            const filter = pill.dataset.filter;

            // "All" keeps the bento layout; any other tab switches to a uniform grid
            if (blogGrid) {
              blogGrid.classList.toggle("is-filtered", filter !== "all");
            }

            cards.forEach((card) => {
              const match =
                filter === "all" || card.dataset.category === filter;
              card.style.display = match ? "" : "none";
            });
          });
        });

        // Load more (demo state, wire up to real pagination/API as needed)
        const loadMoreBtn = document.getElementById("loadMoreBtn");
        if (loadMoreBtn) {
          loadMoreBtn.addEventListener("click", () => {
            loadMoreBtn.querySelector("span").textContent = "Loading...";
            setTimeout(() => {
              loadMoreBtn.querySelector("span").textContent =
                "No more articles";
              loadMoreBtn.disabled = true;
              loadMoreBtn.style.opacity = ".6";
              loadMoreBtn.style.cursor = "default";
            }, 700);
          });
        }

        // Newsletter form (demo state, wire up to real endpoint as needed)
        const newsletterForm = document.getElementById("newsletterForm");
        if (newsletterForm) {
          newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector(".newsletter-btn span");
            const original = btn.textContent;
            btn.textContent = "Subscribed!";
            newsletterForm.reset();
            setTimeout(() => {
              btn.textContent = original;
            }, 2500);
          });
        }
      })();
    
;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hero = document.querySelector(".hero");
    const recentSection = document.querySelector(".recent-blogs-section");
    const allBlogsSection = document.querySelector(".blog-wrap");

    /*
      Makes an element a reveal target.
      A delay is added as inline style for staggered animation.
    */
    function prepareReveal(element, delay = 0) {
      if (!element) return;

      element.classList.add("blog-reveal");
      element.style.transitionDelay = `${delay}ms`;
    }

    /*
      Shows all targets inside a section.
      Useful for reduced-motion users and old-browser fallback.
    */
    function showAll(section) {
      if (!section) return;

      section.querySelectorAll(".blog-reveal").forEach((element) => {
        element.classList.add("is-revealed");
      });
    }

    /* -------------------------------------
       HERO — immediate intro animation
    ------------------------------------- */

    if (hero) {
      if (reducedMotion) {
        hero.classList.add("is-visible");
      } else {
        setTimeout(() => {
          hero.classList.add("is-visible");
        }, 100);
      }
    }

    /* -------------------------------------
       RECENT BLOGS — targets + delays
    ------------------------------------- */

    if (recentSection) {
      const recentLabel = recentSection.querySelector(
        ".section-label--light"
      );
      const recentTitle = recentSection.querySelector(
        "#recent-blogs-title"
      );
      const recentLink = recentSection.querySelector(
        ".recent-blogs-link"
      );
      const recentCards = [
        ...recentSection.querySelectorAll(".recent-blog-card"),
      ];

      prepareReveal(recentLabel, 0);
      prepareReveal(recentTitle, 100);
      prepareReveal(recentLink, 180);

      recentCards.forEach((card, index) => {
        prepareReveal(card, 260 + index * 130);
      });
    }

    /* -------------------------------------
       ALL BLOGS — targets + delays
    ------------------------------------- */

    if (allBlogsSection) {
      const allLabel = allBlogsSection.querySelector(
        ".all-blogs-label"
      );
      const allTitle = allBlogsSection.querySelector(
        "#all-blogs-title"
      );
      const filterButtons = [
        ...allBlogsSection.querySelectorAll(".filter-pill"),
      ];
      const blogCards = [
        ...allBlogsSection.querySelectorAll(".blog-grid .card"),
      ];
      const loadMoreButton = allBlogsSection.querySelector(
        ".load-more-btn"
      );

      prepareReveal(allLabel, 0);
      prepareReveal(allTitle, 100);

      filterButtons.forEach((button, index) => {
        prepareReveal(button, 180 + index * 65);
      });

      blogCards.forEach((card, index) => {
        prepareReveal(card, 300 + index * 110);
      });

      prepareReveal(loadMoreButton, 980);
    }

    /*
      Sections below the hero:
      reveal only when visitor reaches each section.
    */
    const scrollSections = [recentSection, allBlogsSection].filter(Boolean);

    if (reducedMotion || !("IntersectionObserver" in window)) {
      scrollSections.forEach(showAll);
      return;
    }

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          showAll(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -70px 0px",
      }
    );

    scrollSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  });
