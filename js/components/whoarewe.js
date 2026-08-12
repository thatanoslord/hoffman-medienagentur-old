
    const section = document.getElementById("zoomParallax");
    const items = document.querySelectorAll(".parallax-item");
    const mainItem = document.querySelector(".item-1");

    const pushConfig = [
      { selector: ".item-2", x: 110, y: -90 },
      { selector: ".item-3", x: -120, y: -40 },
      { selector: ".item-4", x: 120, y: 0 },
      { selector: ".item-5", x: 80, y: 100 },
      { selector: ".item-6", x: -110, y: 110 },
      { selector: ".item-7", x: 95, y: 70 }
    ];

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function updateParallax() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollDistance = Math.max(sectionHeight - viewportHeight, 1);
      const progress = clamp((-rect.top) / scrollDistance, 0, 1);

      items.forEach((item) => {
        const endScale = parseFloat(item.dataset.scaleEnd || "1");
        const scale = 1 + (endScale - 1) * progress;

        if (item.classList.contains("item-1")) {
          item.style.transform = `scale(${scale})`;
        } else {
          const cfg = pushConfig.find((entry) => item.matches(entry.selector));
          const pushStrength = parseFloat(item.dataset.push || "1");
          const mainScale = 1 + ((parseFloat(mainItem.dataset.scaleEnd || "1") - 1) * progress);
          const pushAmount = (mainScale - 1) * 55 * pushStrength;
          const offsetX = cfg ? cfg.x * (pushAmount / 100) : 0;
          const offsetY = cfg ? cfg.y * (pushAmount / 100) : 0;

          item.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
      });
    }

    function animate() {
      updateParallax();
      requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("resize", updateParallax);
    window.addEventListener("scroll", updateParallax, { passive: true });
  