document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".ticker-track");

  if (track && !track.dataset.cloned) {
    const items = Array.from(track.children);

    items.forEach(function (item) {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    track.dataset.cloned = "true";
  }

  const fadeSection = document.querySelector(".ticker-section");

  if (fadeSection) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fadeSection.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(fadeSection);
  }

  const description = document.getElementById("cpocCreateDescription");

  if (description) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const originalText = description.textContent.trim();

    function buildWords() {
      const words = originalText.split(/\s+/);
      description.innerHTML = "";

      words.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        wordSpan.textContent = word;
        description.appendChild(wordSpan);

        if (index < words.length - 1) {
          const spaceSpan = document.createElement("span");
          spaceSpan.className = "space";
          spaceSpan.textContent = " ";
          description.appendChild(spaceSpan);
        }
      });
    }

    buildWords();

    const wordNodes = Array.from(description.querySelectorAll(".word"));

    if (reduceMotion) {
      wordNodes.forEach((word) => word.classList.add("is-visible"));
    } else {
      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function updateWordReveal() {
        const rect = description.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;

        const start = viewportH * 0.92;
        const end = viewportH * 0.28;

        const rawProgress = (start - rect.top) / (start - end);
        const progress = clamp(rawProgress, 0, 1);

        const visibleWords = Math.floor(progress * wordNodes.length);

        wordNodes.forEach((word, index) => {
          if (index < visibleWords) {
            word.classList.add("is-visible");
          } else {
            word.classList.remove("is-visible");
          }
        });
      }

      updateWordReveal();
      window.addEventListener("scroll", updateWordReveal, { passive: true });
      window.addEventListener("resize", updateWordReveal);
    }
  }

  const section = document.querySelector(".cs-wrap");
  const header = document.getElementById("csHeader");
  const card = document.getElementById("csCard");

  if (!section || !header || !card) return;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function updateAnimation() {
    const rect = section.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const viewportW = window.innerWidth || document.documentElement.clientWidth;

    const cardCenterY = rect.top + rect.height / 2;
    const viewportCenterY = viewportH / 2;
    const distanceFromCenter = cardCenterY - viewportCenterY;
    const rawProgress = 1 - distanceFromCenter / (viewportH * 0.8);
    const progress = clamp(rawProgress, 0, 1);

    const rotateX = lerp(100, 0, progress);

    const baseWidth = card.offsetWidth;
    const targetScale = viewportW / baseWidth;

    const startScale = isMobile() ? 0.82 : 0.95;
    const endScale = targetScale;

    const scale = lerp(startScale, endScale, progress);

    header.style.transform = "translateY(0px)";
    card.style.transform = "rotateX(" + rotateX + "deg) scale(" + scale + ")";
  }

  updateAnimation();
  window.addEventListener("scroll", updateAnimation, { passive: true });
  window.addEventListener("resize", updateAnimation);
});

// Prevent scroll restoration on page reload

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('load', function () {
    window.scrollTo(0, 0);
  });
