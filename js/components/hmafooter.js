
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



    // navbar scroll effect
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
