
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileBackdrop = document.querySelector('[data-mobile-backdrop]');
  const mobileRows = document.querySelector('[data-mobile-rows]');
  const mobileLinks = [...document.querySelectorAll('[data-mobile-link]')];
  const mobileClock = document.querySelector('[data-mobile-clock]');

  let mobileOpen = false;
  let mobileHoverTimer = null;

  function setMobileOpen(next) {
    mobileOpen = next;
    mobileNav.classList.toggle('mobile-open', mobileOpen);
    document.body.classList.toggle('mobile-menu-open', mobileOpen);
    mobileToggle.setAttribute('aria-expanded', String(mobileOpen));
    mobileToggle.setAttribute('aria-label', mobileOpen ? 'Close menu' : 'Open menu');
  }

  mobileToggle.addEventListener('click', () => setMobileOpen(!mobileOpen));
  mobileBackdrop.addEventListener('click', () => setMobileOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileOpen) setMobileOpen(false);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      clearTimeout(mobileHoverTimer);
      mobileHoverTimer = setTimeout(() => {
        mobileRows.classList.add('mobile-is-spotlight');
        mobileLinks.forEach((item) => item.classList.remove('mobile-active'));
        link.classList.add('mobile-active');
      }, 60);
    });

    link.addEventListener('focus', () => {
      mobileRows.classList.add('mobile-is-spotlight');
      mobileLinks.forEach((item) => item.classList.remove('mobile-active'));
      link.classList.add('mobile-active');
    });

    link.addEventListener('click', () => setMobileOpen(false));
  });

  mobileRows.addEventListener('mouseleave', () => {
    clearTimeout(mobileHoverTimer);
    mobileRows.classList.remove('mobile-is-spotlight');
    mobileLinks.forEach((item) => item.classList.remove('mobile-active'));
  });

  mobileRows.addEventListener('focusout', (event) => {
    if (!mobileRows.contains(event.relatedTarget)) {
      mobileRows.classList.remove('mobile-is-spotlight');
      mobileLinks.forEach((item) => item.classList.remove('mobile-active'));
    }
  });

  function updateMobileClock() {
    const now = new Date();
    mobileClock.textContent = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  updateMobileClock();
  setInterval(updateMobileClock, 1000);
