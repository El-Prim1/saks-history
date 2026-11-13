(() => {
  const labels = {
    menuOpen: 'Открыть меню', menuClose: 'Закрыть меню',
    timelineSelected: 'Выбранный период',
    year: new Date().getFullYear()
  };
  const data = window.SAKA_CONTENT;
  const tabs = document.querySelector('#timeline-tabs');
  const detail = document.querySelector('#timeline-detail');
  data.timeline.forEach((period, index) => {
    const button = document.createElement('button');
    button.className = 'time-tab';
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(index === 0));
    button.setAttribute('aria-controls', 'timeline-detail');
    button.tabIndex = index === 0 ? 0 : -1;
    button.textContent = period.date;
    button.addEventListener('click', () => showPeriod(index));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const current = [...tabs.children].indexOf(button);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? data.timeline.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : data.timeline.length - 1)) % data.timeline.length;
      tabs.children[next].focus();
      showPeriod(next);
    });
    tabs.append(button);
  });
  function showPeriod(index) {
    const item = data.timeline[index];
    [...tabs.children].forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(tabIndex === index));
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });
    detail.innerHTML = `<div class="timeline-date">${item.date}</div><div><h3>${item.title}</h3><p>${item.text}</p></div>`;
  }
  showPeriod(0);
  const siteGrid = document.querySelector('#site-cards');
  data.sites.forEach((site, index) => {
    const card = document.createElement('article');
    card.className = 'site-card';
    card.innerHTML = `<div class="site-visual" role="img" aria-label="${site.alt}" style="background-image:url('${site.image}')"><span class="site-index">ПАМЯТНИК 0${index + 1}</span></div><div class="site-card-content"><span class="site-region">${site.place}</span><h3>${site.name}</h3><p>${site.text}</p></div>`;
    siteGrid.append(card);
  });
  const sourceList = document.querySelector('#source-list');
  data.sources.forEach(source => {
    const item = document.createElement('li');
    const text = source.url ? `<a href="${source.url}" target="_blank" rel="noreferrer">${source.text}</a>` : source.text;
    item.innerHTML = text;
    sourceList.append(item);
  });
  document.querySelector('#year').textContent = labels.year;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? labels.menuClose : labels.menuOpen);
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', labels.menuOpen);
  }));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll('.section-heading,.intro-grid,.fact-strip,.origin-columns,.note,.map-layout,.peoples-grid,.people-cards,.culture-grid,.site-grid,.source-list').forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  }
})();
