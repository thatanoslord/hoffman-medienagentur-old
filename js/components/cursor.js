
  (() => {
    const cursor = document.querySelector('.card-hover-cursor');
    const hoverTargets = document.querySelectorAll('.card, .recent-blog-card');

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

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    hoverTargets.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        active = true;
        cursor.classList.add('is-visible');
      });

      item.addEventListener('mouseleave', () => {
        active = false;
        cursor.classList.remove('is-visible');
      });
    });

    window.addEventListener('mousedown', () => {
      if (active) cursor.style.opacity = '0.9';
    });

    window.addEventListener('mouseup', () => {
      if (active) cursor.style.opacity = '1';
    });
  })();
