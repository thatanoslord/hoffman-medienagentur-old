
(function () {
  const section = document.getElementById('processSticky');
  const header = document.getElementById('processHeaderReveal');
  const line = document.getElementById('processGoldLine');

  const cards = [
    document.getElementById('processCard1'),
    document.getElementById('processCard2'),
    document.getElementById('processCard3'),
    document.getElementById('processCard4')
  ];

  const desktopStates = [
    [
      { x: 2000, r: 0 },
      { x: 2000, r: 0 },
      { x: 2000, r: 0 },
      { x: 2000, r: 0 }
    ],
    [
      { x: 0, r: 0 },
      { x: 2000, r: 0 },
      { x: 2000, r: 0 },
      { x: 2000, r: 0 }
    ],
    [
      { x: 0, r: 0 },
      { x: 350, r: 0 },
      { x: 2000, r: 0 },
      { x: 2000, r: 0 }
    ],
    [
      { x: 0, r: 0 },
      { x: 350, r: 0 },
      { x: 700, r: 0 },
      { x: 2000, r: 0 }
    ],
    [
      { x: 0, r: 0 },
      { x: 350, r: 0 },
      { x: 700, r: 0 },
      { x: 1050, r: 0 }
    ]
  ];

  const tabletStates = [
    [
      { x: 1500, r: 0 },
      { x: 1500, r: 0 },
      { x: 1500, r: 0 },
      { x: 1500, r: 0 }
    ],
    [
      { x: 20, r: 0 },
      { x: 1500, r: 0 },
      { x: 1500, r: 0 },
      { x: 1500, r: 0 }
    ], 
    [
      { x: 20, r: 0 },
      { x: 230, r: 0 },
      { x: 1500, r: 0 },
      { x: 1500, r: 0 }
    ],
    [ 
      { x: 20, r: 0 },
      { x: 230, r: 0 },
      { x: 430, r: 0 },
      { x: 1500, r: 0 }
    ],
    [
      { x: 20, r: 0 },
      { x: 230, r: 0 },
      { x: 430, r: 0 },
      { x: 630, r: 0 }
    ]
  ];

  const phoneStates = [
    [
      { x: 320, r: 0 },
      { x: 320, r: 0 },
      { x: 320, r: 0 },
      { x: 320, r: 0 }
    ],
    [
      { x: 85, r: 0 },
      { x: 320, r: 0 },
      { x: 320, r: 0 },
      { x: 320, r: 0 }
    ],
    [
      { x: 85, r: 0 },
      { x: 35, r: 0 },
      { x: 320, r: 0 },
      { x: 320, r: 0 }
    ],
    [
      { x: 85, r: 0 },
      { x: 35, r: 0 },
      { x: -15, r: 0 },
      { x: 320, r: 0 }
    ],
    [
      { x: 85, r: 0 },
      { x: 35, r: 0 },
      { x: -15, r: 0 },
      { x: -65, r: 0 }
    ]
  ];

  const linePositions = {
    desktop: [-2000, -1040, -760, -430, -110, 100],
    tablet:  [-1300, -700, -500, -280, -90, 0],
    phone:   [-520, -390, -260, -140, -60, 0]
  };

  let headerShown = false;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function getMode() {
    if (window.innerWidth <= 767.98) return 'phone';
    if (window.innerWidth <= 1199.98) return 'tablet';
    return 'desktop';
  }

  function getStates(mode) {
    if (mode === 'phone') return phoneStates;
    if (mode === 'tablet') return tabletStates;
    return desktopStates;
  }

  function getLinePositions(mode) {
    if (mode === 'phone') return linePositions.phone;
    if (mode === 'tablet') return linePositions.tablet;
    return linePositions.desktop;
  }

  function applyState(progress) {
    const mode = getMode();
    const states = getStates(mode);
    const lineStops = getLinePositions(mode);

    const stageProgress = clamp(progress * 4, 0, 3.999);
    const stageIndex = Math.floor(stageProgress);
    const stageT = stageProgress - stageIndex;

    const current = states[stageIndex];
    const next = states[Math.min(stageIndex + 1, states.length - 1)];

    cards.forEach((card, i) => {
      const x = lerp(current[i].x, next[i].x, stageT);
      const r = lerp(current[i].r, next[i].r, stageT);
      card.style.transform = `translateX(${x}px) rotate(${r}deg)`;
    });

    const lineCurrent = lineStops[stageIndex];
    const lineNext = lineStops[Math.min(stageIndex + 1, lineStops.length - 1)];
    const lineX = lerp(lineCurrent, lineNext, stageT);
    line.style.transform = `translateX(${lineX}px)`;
  }

  function onScroll() {
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const traveled = clamp(-rect.top, 0, total);
    const progress = total > 0 ? traveled / total : 0;

    if (!headerShown) {
      const revealPoint = window.innerHeight * 0.85;
      if (rect.top < revealPoint) {
        header.classList.add('is-visible');
        headerShown = true;
      }
    }

    applyState(progress);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
