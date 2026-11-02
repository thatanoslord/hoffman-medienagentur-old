
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
        const title = document.querySelector(".js-rise-title");
        if (!title) return;

        const text = title.textContent.trim();
        title.textContent = "";

        [...text].forEach((char, index) => {
          const span = document.createElement("span");
          span.className = "char";
          span.style.setProperty("--char-index", index);
          span.textContent = char === " " ? "\u00A0" : char;
          title.appendChild(span);
        });

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
            rootMargin: "0px 0px -40px 0px",
          },
        );

        observer.observe(title);
      })();
    
;

      (function () {
        var content = document.getElementById("brandContent");
        var wrapper = document.getElementById("tickerWrapper");

        if (!content || !wrapper) return;

        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                if (entry.target === content) content.classList.add("in-view");
                if (entry.target === wrapper) wrapper.classList.add("in-view");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 },
        );

        observer.observe(content);
        observer.observe(wrapper);
      })();
    
;

      (function () {
        function initTicker(trackId, baseSpeed) {
          var track = document.getElementById(trackId);
          if (!track) return;

          var group = track.querySelector(".brands-strip__group");
          var viewport = track.parentElement;
          if (!group || !viewport) return;

          var direction = track.dataset.direction === "left" ? -1 : 1;
          var pos = 0;
          var loopWidth = 0;
          var rafId = null;

          function measure() {
            loopWidth =
              group.getBoundingClientRect().width +
              parseFloat(getComputedStyle(track).columnGap || "0");
            if (loopWidth <= 0) return;

            while (track.scrollWidth <= viewport.clientWidth + loopWidth) {
              var duplicate = group.cloneNode(true);
              duplicate.setAttribute("aria-hidden", "true");
              track.appendChild(duplicate);
            }

            if (direction === 1) {
              pos = -loopWidth;
            } else {
              pos = 0;
            }
            track.style.transform = "translateX(" + pos + "px)";
          }

          function animate() {
            pos += direction * baseSpeed;

            if (direction === -1 && pos <= -loopWidth) {
              pos = 0;
            }

            if (direction === 1 && pos >= 0) {
              pos = -loopWidth;
            }

            track.style.transform = "translateX(" + pos + "px)";
            rafId = requestAnimationFrame(animate);
          }

          measure();
          window.addEventListener("resize", measure);
          rafId = requestAnimationFrame(animate);
        }

        initTicker("trackTop", 0.6);
      })();
    
;

      const counters = document.querySelectorAll("[data-count]");

      const animateCounter = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        const startTime = performance.now();

        const update = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        };

        requestAnimationFrame(update);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.5,
        },
      );

      counters.forEach((counter) => observer.observe(counter));
    
;

      (function () {
        const title = document.querySelector(".facts-story__title");
        if (!title) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        function splitNode(node, words) {
          if (node.nodeType === 3) {
            const text = node.textContent;
            const parts = text.split(/(\s+)/);

            parts.forEach((part) => {
              if (!part) return;

              if (/^\s+$/.test(part)) {
                words.push(document.createTextNode(part));
              } else {
                const span = document.createElement("span");
                span.className = "word";
                span.textContent = part;
                words.push(span);
              }
            });
            return;
          }

          if (node.nodeType === 1) {
            const clone = node.cloneNode(false);
            const childParts = [];
            node.childNodes.forEach((child) => splitNode(child, childParts));
            childParts.forEach((child) => clone.appendChild(child));
            words.push(clone);
          }
        }

        const fragments = [];
        title.childNodes.forEach((node) => splitNode(node, fragments));
        title.innerHTML = "";
        fragments.forEach((node) => title.appendChild(node));

        const wordEls = title.querySelectorAll(".word");

        if (reduceMotion) {
          title.classList.add("is-visible");
          wordEls.forEach((word) => {
            word.style.opacity = "1";
            word.style.transform = "none";
            word.style.filter = "none";
            word.style.transition = "none";
          });
          return;
        }

        wordEls.forEach((word, index) => {
          word.style.transitionDelay = index * 0.05 + "s";
        });

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
            rootMargin: "0px 0px -10% 0px",
          },
        );

        observer.observe(title);
      })();
    
;

      (function () {
        const elements = document.querySelectorAll(".about-copy, .about-card");
        if (!elements.length) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reduceMotion) {
          elements.forEach((el) => el.classList.add("is-visible"));
          return;
        }

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            });
          },
          {
            threshold: 0.2,
            rootMargin: "0px 0px -8% 0px",
          },
        );

        elements.forEach((el) => observer.observe(el));
      })();
    
;

      (function () {
        const section = document.getElementById("factsStory");
        const line = document.getElementById("factsTimelineFill");
        const metricOne = document.getElementById("metricOne");
        const metricTwo = document.getElementById("metricTwo");
        const metricThree = document.getElementById("metricThree");
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!section || !line || !metricOne || !metricTwo || !metricThree)
          return;

        function clamp(value, min, max) {
          return Math.min(Math.max(value, min), max);
        }

        function lerp(a, b, t) {
          return a + (b - a) * t;
        }

        function handleFactsProgress() {
          if (window.innerWidth <= 1359.98 || reducedMotion) {
            line.style.transform = "translate(0px, -50%)";
            metricOne.style.transform = "translateY(0px)";
            metricTwo.style.transform = "translateY(0px)";
            metricThree.style.transform = "translateY(0px)";
            return;
          }

          const rect = section.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight + 120;
          const scrolled = clamp(-rect.top, 0, totalScrollable);
          const progress = clamp(scrolled / totalScrollable, 0, 1);

          const stageOne = clamp(progress / 0.33, 0, 1);
          const stageTwo = clamp((progress - 0.33) / 0.33, 0, 1);
          const stageThree = clamp((progress - 0.66) / 0.34, 0, 1);

          let lineX = -790;
          if (progress < 0.33) {
            lineX = lerp(-790, -500, stageOne);
          } else if (progress < 0.66) {
            lineX = lerp(-500, -204, stageTwo);
          } else {
            lineX = lerp(-204, 0, stageThree);
          }

          const metricOneY = lerp(240, 0, stageOne);
          const metricTwoY = lerp(240, 0, stageTwo);
          const metricThreeY = lerp(320, 0, stageThree);

          line.style.transform = "translate(" + lineX + "px, -50%)";
          metricOne.style.transform = "translateY(" + metricOneY + "px)";
          metricTwo.style.transform = "translateY(" + metricTwoY + "px)";
          metricThree.style.transform = "translateY(" + metricThreeY + "px)";
        }

        window.addEventListener("scroll", handleFactsProgress, {
          passive: true,
        });
        window.addEventListener("resize", handleFactsProgress);
        handleFactsProgress();
      })();
    
;

      (function () {
        const title = document.querySelector(".js-history-editorial-title");
        if (!title) return;

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
      })();
    
;

      (function () {
        const card = document.querySelector(".js-history-second-card");
        if (!card) return;

        const supportsViewTimeline = CSS.supports("animation-timeline: view()");
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (supportsViewTimeline || reducedMotion) return;

        function clamp(value, min, max) {
          return Math.min(Math.max(value, min), max);
        }

        function updateCardProgress() {
          if (window.innerWidth < 1360) {
            card.style.transform = "translateY(0px)";
            return;
          }

          const rect = card.getBoundingClientRect();
          const vh = window.innerHeight;

          const start = vh * 0.95;
          const end = vh * 0.35;

          const progress = clamp((start - rect.top) / (start - end), 0, 1);
          const y = -180 + 180 * progress;

          card.style.transform = "translateY(" + y + "px)";
        }

        window.addEventListener("scroll", updateCardProgress, {
          passive: true,
        });
        window.addEventListener("resize", updateCardProgress);
        updateCardProgress();
      })();
    
;

      (function () {
        const cards = document.querySelectorAll(".js-team-card");
        if (!cards.length) return;

        const supportsViewTimeline = CSS.supports("animation-timeline: view()");
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (supportsViewTimeline || reducedMotion) return;

        function clamp(value, min, max) {
          return Math.min(Math.max(value, min), max);
        }

        function updateCards() {
          if (window.innerWidth < 1360) {
            cards.forEach((card) => {
              card.style.transform = "translateY(0px)";
            });
            return;
          }

          const vh = window.innerHeight;
          const start = vh * 0.95;
          const end = vh * 0.35;

          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const progress = clamp((start - rect.top) / (start - end), 0, 1);

            if (card.classList.contains("team-member-card--from-top")) {
              const y = -70 + 70 * progress;
              card.style.transform = "translateY(" + y + "px)";
            } else if (
              card.classList.contains("team-member-card--from-bottom")
            ) {
              const y = 50 - 50 * progress;
              card.style.transform = "translateY(" + y + "px)";
            }
          });
        }

        window.addEventListener("scroll", updateCards, { passive: true });
        window.addEventListener("resize", updateCards);
        updateCards();
      })();
    
;

      (function () {
        const title = document.querySelector(".js-awards-editorial-title");
        if (!title) return;

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
      })();
    
;

      (function () {
        const rows = document.querySelectorAll(".js-award-editorial-row");
        if (!rows.length) return;

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const isDesktop = () => window.innerWidth >= 1360;

        function showStaticRows() {
          rows.forEach((row) => row.classList.add("is-visible"));
        }

        if (!isDesktop() || reducedMotion) {
          showStaticRows();
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
              } else {
                entry.target.classList.remove("is-visible");
              }
            });
          },
          {
            threshold: 0.2,
            rootMargin: "0px 0px -12% 0px",
          },
        );

        rows.forEach((row) => observer.observe(row));

        window.addEventListener("resize", function () {
          if (!isDesktop()) {
            showStaticRows();
          }
        });
      })();
    
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
    