(() => {
  const nav = document.querySelector('.site-links');
  const toggle = document.querySelector('.mobile-menu-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.prepend(bar);
  const topButton = document.createElement('button');
  topButton.className = 'back-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.textContent = '↑';
  document.body.append(topButton);
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    topButton.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', update, {passive:true});
  update();
  topButton.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  const items = document.querySelectorAll('.br-card, .section-heading, .panel, .stat');
  items.forEach(item => item.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('is-visible'));
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
