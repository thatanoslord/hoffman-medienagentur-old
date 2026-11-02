
      document.querySelectorAll(".accordion-head").forEach((head) => {
        head.addEventListener("click", () => {
          const item = head.parentElement;
          const isOpen = item.classList.contains("open");
          item.parentElement
            .querySelectorAll(".accordion-item")
            .forEach((i) => {
              i.classList.remove("open");
              i.querySelector(".plus").textContent = "+";
              i.querySelector(".accordion-body").style.maxHeight = null;
            });
          if (!isOpen) {
            item.classList.add("open");
            item.querySelector(".plus").textContent = "−";
            const body = item.querySelector(".accordion-body");
            body.style.maxHeight = body.scrollHeight + "px";
          }
        });
      });

      // Show more prices
      const extra = [
        [".xyz", "$0.99", "$14.99/yr", "$9.99"],
        [".live", "$0.99", "$29.99/yr", "$24.99"],
        [".website", "$0.99", "$29.99/yr", "$24.99"],
        [".fun", "$0.99", "$22.99/yr", "$17.99"],
        [".club", "$0.99", "$19.99/yr", "$14.99"],
      ];
      const showMoreButton = document.getElementById("showMoreBtn");
      const priceTable = document.getElementById("priceTable");
      if (showMoreButton && priceTable) {
        showMoreButton.addEventListener("click", function () {
          extra.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td>`;
            priceTable.appendChild(tr);
          });
          this.style.display = "none";
        });
      }
    
;

      (function () {
        const titles = document.querySelectorAll(
          ".js-faq-title, .js-faq-contact-title",
        );

        titles.forEach((title) => {
          const text = title.textContent.trim();
          const words = text.split(" ");

          title.innerHTML = words
            .map((word, index) => {
              return (
                '<span class="word" style="transition-delay:' +
                index * 0.08 +
                's">' +
                word +
                "</span>"
              );
            })
            .join(" ");

          const observer = new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
              });
            },
            {
              threshold: 0.35,
              rootMargin: "0px 0px -20px 0px",
            },
          );

          observer.observe(title);
        });
      })();
    
;

      (function () {
        const accordion = document.querySelector("[data-faq-accordion]");
        if (!accordion) return;

        const items = Array.from(accordion.querySelectorAll(".faq-item"));

        function openItem(item) {
          const button = item.querySelector(".faq-item__trigger");
          const panel = item.querySelector(".faq-item__panel");

          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }

        function closeItem(item) {
          const button = item.querySelector(".faq-item__trigger");
          const panel = item.querySelector(".faq-item__panel");

          item.classList.remove("is-open");
          button.setAttribute("aria-expanded", "false");
        }

        items.forEach((item) => {
          const button = item.querySelector(".faq-item__trigger");

          button.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");

            items.forEach(closeItem);

            if (!isOpen) {
              openItem(item);
            }
          });
        });

        items.forEach((item) => {
          if (item.classList.contains("is-open")) {
            openItem(item);
          } else {
            closeItem(item);
          }
        });
      })();
    
;

      (function () {
        const items = document.querySelectorAll(".faq-accordion .faq-item");
        if (!items.length) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reduceMotion) {
          items.forEach((item) => item.classList.add("is-revealed"));
          return;
        }

        items.forEach((item, index) => {
          item.style.transitionDelay = index * 0.12 + "s";
        });

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-revealed");
              obs.unobserve(entry.target);
            });
          },
          {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px",
          },
        );

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

      (function () {
        const RESULTS_PAGE = "domain-results.html"; // the results page file

        const form = document.getElementById("domainSearchForm");
        const input = document.getElementById("domainSearchInput");
        const result = document.getElementById("domainSearchResult");
        if (!form || !input || !result) return;

        const escapeHtml = (v) =>
          String(v).replace(
            /[&<>'"]/g,
            (c) =>
              ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;",
              })[c],
          );

        function normalizeDomain(v) {
          return v
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/[\/?#].*$/, "")
            .replace(/\s+/g, "");
        }

        function showError(text) {
          result.className = "domain-search-result";
          result.innerHTML =
            '<div class="domain-result-card is-error"><div class="domain-result-main">' +
            '<span class="domain-result-domain">Check input</span>' +
            '<span class="domain-result-text">' +
            escapeHtml(text) +
            "</span></div></div>";
        }

        form.addEventListener("submit", function (event) {
          event.preventDefault();
          const value = normalizeDomain(input.value);
          const name = value.split(".")[0];

          if (!name || !/^[a-z0-9-]+$/.test(name)) {
            showError(
              "Enter a name like zeb or a full domain like zeb.com (letters, numbers and hyphens only).",
            );
            input.focus();
            return;
          }
          window.location.href =
            RESULTS_PAGE + "?q=" + encodeURIComponent(value);
        });
      })();
    
;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hero = document.querySelector(".hero");
    const lostSection = document.querySelector(".lost");

    /* Hero: it is visible immediately when the page opens */
    if (hero) {
      if (reducedMotion) {
        hero.classList.add("is-visible");
      } else {
        setTimeout(() => {
          hero.classList.add("is-visible");
        }, 120);
      }
    }

    /* Lost section: reveal when it enters the viewport */
    if (lostSection) {
      if (reducedMotion) {
        lostSection.classList.add("is-visible");
      } else {
        const sectionObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.18,
            rootMargin: "0px 0px -80px 0px",
          }
        );

        sectionObserver.observe(lostSection);
      }
    }
  });

;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const lostSection = document.querySelector(".lost");

    if (!lostSection) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Show content normally for visitors who prefer reduced motion */
    if (reducedMotion) {
      lostSection.classList.add("is-visible");
      return;
    }

    const revealLostSection = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    revealLostSection.observe(lostSection);
  });

;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hero = document.querySelector(".hero");
    const lostSection = document.querySelector(".lost");
    const howtoSection = document.querySelector(".howto");

    /* Hero animation on page load */
    if (hero) {
      if (reducedMotion) {
        hero.classList.add("is-visible");
      } else {
        setTimeout(() => {
          hero.classList.add("is-visible");
        }, 120);
      }
    }

    /* Sections that animate when they enter the screen */
    const scrollSections = [lostSection, howtoSection].filter(Boolean);

    if (reducedMotion) {
      scrollSections.forEach((section) => {
        section.classList.add("is-visible");
      });
      return;
    }

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    scrollSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  });
