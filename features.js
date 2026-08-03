(function () {
  const splitTargets = document.querySelectorAll(".js-word-reveal");

  splitTargets.forEach((el) => {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    const words = text.split(" ");
    el.textContent = "";

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--word-index", index);
      span.textContent = word + (index < words.length - 1 ? " " : "");
      el.appendChild(span);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  document.querySelectorAll(".js-word-reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  const section = document.querySelector(".ai-features");
  const imageTile = document.querySelector(".js-image-settle");
  const image = imageTile ? imageTile.querySelector("img") : null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function updateImageScrollScale() {
    if (!section || !imageTile || !image) return;

    const sectionRect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    const rawProgress = (vh - sectionRect.top) / vh;
    const progress = clamp(rawProgress, 0, 1);

    const startScale = 3;
    const endScale = 1;
    const startX = 0;
    const endX = 0;
    const startY = 0;
    const endY = 0;

    const scale = lerp(startScale, endScale, progress);
    const x = lerp(startX, endX, progress);
    const y = lerp(startY, endY, progress);

    image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateImageScrollScale();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateImageScrollScale();
})();
