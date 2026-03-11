(() => {
  const cards = Array.from(document.querySelectorAll('.parallax-card'));

  if (!cards.length) {
    return;
  }

  let ticking = false;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight || 0;
    const viewportCenter = viewportHeight / 2;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const strength = Number(card.dataset.strength || 0.45);
      const cardCenter = rect.top + rect.height / 2;
      const distance = viewportCenter - cardCenter;
      const offset = distance * strength;
      card.style.setProperty('--parallax', `${offset}px`);
      card.style.setProperty('--parallax-soft', `${offset * 0.6}px`);
      card.style.setProperty('--parallax-far', `${offset * 0.9}px`);

      const ornaments = card.querySelectorAll('.parallax-ornament');
      ornaments.forEach((ornament) => {
        const depth = Number(ornament.dataset.depth || 0.5);
        ornament.style.transform = `translate3d(0, ${offset * depth}px, 0)`;
      });
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-fading', !entry.isIntersecting);
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    }
  );

  cards.forEach((card) => {
    if (!card.querySelector('.parallax-ornament')) {
      const ornamentA = document.createElement('div');
      ornamentA.className = 'parallax-ornament ornament-a';
      ornamentA.dataset.depth = '0.9';

      const ornamentB = document.createElement('div');
      ornamentB.className = 'parallax-ornament ornament-b';
      ornamentB.dataset.depth = '0.6';

      const ornamentC = document.createElement('div');
      ornamentC.className = 'parallax-ornament ornament-c';
      ornamentC.dataset.depth = '0.35';

      card.append(ornamentA, ornamentB, ornamentC);
    }
    observer.observe(card);
  });

  updateParallax();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateParallax);
})();
