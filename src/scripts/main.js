(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* reveal */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .18, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => io.observe(el));

  /* nav + progress + active section */
  const nav = $('#nav'), prog = $('#prog');
  const links = $$('.nav ol a');
  const secs = links.map(a => $(a.getAttribute('href')));
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    nav.classList.toggle('solid', y > innerHeight * .75);
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* counter */
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    o.observe(el);
  });

  /* tabs */
  const tabs = $$('.feat-tabs button');
  tabs.forEach(b => b.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-selected', x === b));
    $$('.demo').forEach(d => { d.classList.toggle('on', d.id === b.dataset.tab); d.classList.add('in'); });
  }));

  /* concrete classes */
  const CC = [
    ['C8/10', 10, 'Подложен бетон, изравнителни слоеве', 1],
    ['C12/15', 15, 'Подложни бетони, ненатоварени настилки', 1],
    ['C16/20', 20, 'Фундаменти на малки сгради, тротоари', 2],
    ['C20/25', 25, 'Фундаменти, плочи и стени в жилищно строителство', 3],
    ['C25/30', 30, 'Стоманобетонни плочи, колони и греди', 3],
    ['C30/37', 37, 'Натоварени конструкции, паркинги, външни елементи', 4],
    ['C35/45', 45, 'Индустриални подове, мостови и сглобяеми елементи', 5],
    ['C40/50', 50, 'Високоякостни и специални конструкции', 5],
  ];
  const cBox = $('#classes'), chart = $('#ccChart'), axis = $('#ccAxis');
  CC.forEach((c, i) => {
    const b = document.createElement('button'); b.textContent = c[0]; b.onclick = () => pick(i); cBox.append(b);
    const bar = document.createElement('i'); bar.onclick = () => pick(i); chart.append(bar);
    const s = document.createElement('span'); s.textContent = c[1]; axis.append(s);
  });
  let mpaNow = 30;
  function pick(i) {
    const c = CC[i];
    $$('button', cBox).forEach((b, j) => b.classList.toggle('on', j === i));
    $$('i', chart).forEach((b, j) => { b.classList.toggle('on', j === i); b.style.height = (CC[j][1] / 50 * 100) + '%'; });
    $('#ccName').textContent = c[0];
    $('#ccUse').textContent = c[2];
    $$('#ccLoad i').forEach((d, j) => d.classList.toggle('on', j < c[3]));
    const from = mpaNow, to = c[1], t0 = performance.now(), el = $('#ccMpa');
    const tick = t => { const p = Math.min(1, (t - t0) / 500); el.textContent = Math.round(from + (to - from) * p); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); mpaNow = to;
  }
  const ccIO = new IntersectionObserver(([e]) => { if (e.isIntersecting) { pick(4); ccIO.disconnect(); } });
  ccIO.observe(chart);

  /* map */
  const CITIES = [
    { n: 'София', lon: 23.32, lat: 42.70, b: 4, s: 'sofia', d: 'Люлин · Горубляне · Илиянци · Гара Искър' },
    { n: 'Пловдив', lon: 24.75, lat: 42.15, b: 2, s: 'plovdiv', d: 'Две бази в района на Пловдив' },
    { n: 'Плевен', lon: 24.62, lat: 43.42, b: 1, s: 'pleven', d: 'База Плевен' },
    { n: 'Бургас', lon: 27.47, lat: 42.50, b: 1, s: 'burgas', d: 'База Бургас' },
    { n: 'Варна', lon: 27.91, lat: 43.21, b: 1, s: 'varna', d: 'База Варна' },
  ];
  const BG = [[22.67,44.21],[23.0,43.85],[24.0,43.70],[24.6,43.72],[25.4,43.62],[26.1,43.95],[26.6,44.05],[27.26,44.12],[27.7,43.98],[28.58,43.74],[28.45,43.40],[28.05,43.30],[27.95,43.05],[27.88,42.85],[27.73,42.68],[27.52,42.55],[27.46,42.46],[27.72,42.38],[28.03,41.98],[27.55,42.00],[27.05,42.08],[26.60,41.95],[26.30,41.73],[26.10,41.40],[25.60,41.32],[25.10,41.33],[24.55,41.55],[24.05,41.48],[23.62,41.38],[22.93,41.34],[22.95,41.70],[22.85,42.05],[22.50,42.30],[22.45,42.55],[22.53,42.85],[22.75,43.00],[22.90,43.20],[22.50,43.45],[22.40,43.80],[22.67,44.21]];
  const k = 93.75, kl = 127.5;
  const P = (lon, lat) => [20 + (lon - 22.3) * k, 20 + (44.3 - lat) * kl];
  const svgNS = 'http://www.w3.org/2000/svg', map = $('#map');
  const d = 'M' + BG.map(p => P(...p).map(v => v.toFixed(1)).join(',')).join('L') + 'Z';
  map.innerHTML = `<path class="land-bg" d="${d}"/><path class="land" d="${d}"/>`;
  CITIES.forEach((c, i) => {
    const [x, y] = P(c.lon, c.lat);
    const g = document.createElementNS(svgNS, 'g'); g.setAttribute('class', 'city'); g.setAttribute('tabindex', '0');
    const left = c.lon > 27 ? -1 : 1;
    g.innerHTML = `<circle class="pulse" cx="${x}" cy="${y}" r="${10 + c.b * 3}"/><circle class="dot" cx="${x}" cy="${y}" r="${7 + c.b * 1.5}"/>` +
      `<text x="${x + left * 18}" y="${y - 4}" text-anchor="${left < 0 ? 'end' : 'start'}">${c.n}</text>` +
      `<text class="cnt" x="${x + left * 18}" y="${y + 12}" text-anchor="${left < 0 ? 'end' : 'start'}">${c.b} ${c.b > 1 ? 'бази' : 'база'}</text>`;
    g.addEventListener('click', () => sel(i)); g.addEventListener('mouseenter', () => sel(i));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(i); } });
    map.append(g);
  });
  function sel(i) {
    const c = CITIES[i];
    $$('.city', map).forEach((g, j) => g.classList.toggle('on', j === i));
    $('#mapCard').innerHTML = `<h4>Бетон ${c.n}</h4><p>${c.d}</p><span class="url">hidrobeton.com/${c.s}</span><div class="bn"><b>${c.b}</b><span>${c.b > 1 ? 'бази' : 'база'}</span></div>`;
  }
  sel(0);

  /* contacts demo */
  const CT = {
    'София': ['Люлин', 'Горубляне', 'Илиянци', 'Гара Искър'],
    'Пловдив': ['Коматево', 'Северна индустриална зона'],
    'Плевен': ['Плевен'], 'Бургас': ['Бургас'], 'Варна': ['Варна'],
  };
  const chips = $('#ctChips'), list = $('#ctList');
  const ico = {
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };
  Object.keys(CT).forEach((city, i) => {
    const b = document.createElement('button'); b.textContent = city;
    b.onclick = () => showCity(city); chips.append(b);
  });
  function showCity(city) {
    $$('button', chips).forEach(b => b.classList.toggle('on', b.textContent === city));
    list.innerHTML = CT[city].map(n => `<div class="ct-row"><b>База ${n}</b><span>Диспечер · Продажби · Управител</span><span class="btns"><i>${ico.tel}</i><i>${ico.mail}</i><i>${ico.pin}</i></span></div>`).join('');
  }
  showCity('София');

  /* faq accordion */
  $$('.faq-item').forEach(it => $('.faq-q', it).addEventListener('click', () => {
    const open = !it.classList.contains('open');
    $$('.faq-item').forEach(x => { x.classList.remove('open'); $('.faq-q', x).setAttribute('aria-expanded', 'false'); });
    if (open) { it.classList.add('open'); $('.faq-q', it).setAttribute('aria-expanded', 'true'); }
  }));

  /* uptime bars */
  const up = $('#uptime');
  for (let i = 0; i < 30; i++) { const b = document.createElement('i'); b.style.setProperty('--i', i); up.append(b); }

  /* needs checklist */
  const needs = $$('.need'), bar = $('#readyBar'), txt = $('#readyTxt');
  const upd = () => { const n = needs.filter(x => x.classList.contains('done')).length; bar.style.width = n / needs.length * 100 + '%'; txt.textContent = `${n} / ${needs.length} готови`; };
  needs.forEach(b => b.addEventListener('click', () => { b.classList.toggle('done'); b.setAttribute('aria-pressed', b.classList.contains('done')); upd(); }));

  /* demo showcase */
  const demo = $('.dshow');
  if (demo) {
    const its = $$('.dm-it', demo), shots = $$('.dm-shots img', demo), cap = $('.dm-cap', demo);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = 0, timer = null, seen = false;
    const DUR = 6000;
    const show = (i, auto) => {
      cur = (i + its.length) % its.length;
      its.forEach((b, k) => { b.classList.toggle('on', k === cur); b.classList.remove('run'); b.setAttribute('aria-pressed', k === cur); });
      shots.forEach((im, k) => im.classList.toggle('on', k === cur));
      cap.innerHTML = '<span class="mono">' + String(cur + 1).padStart(2, '0') + ' / ' + String(its.length).padStart(2, '0') + '</span> <b>' + $('b', its[cur]).textContent + '</b><span class="dm-cd">' + $('small', its[cur]).textContent + '</span>';
      if (!auto && innerWidth <= 980) its[cur].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      play();
    };
    const play = () => {
      clearTimeout(timer);
      if (reduce || !seen) return;
      const b = its[cur]; void b.offsetWidth; b.classList.add('run');
      b.style.setProperty('--dur', DUR + 'ms');
      timer = setTimeout(() => { if (!demo.classList.contains('paused')) show(cur + 1, true); }, DUR);
    };
    its.forEach((b, i) => b.addEventListener('click', () => show(i)));
    demo.addEventListener('mouseenter', () => { demo.classList.add('paused'); clearTimeout(timer); });
    demo.addEventListener('mouseleave', () => { demo.classList.remove('paused'); its[cur].classList.remove('run'); play(); });
    new IntersectionObserver(es => es.forEach(e => {
      seen = e.isIntersecting;
      if (seen && !demo.classList.contains('paused')) play(); else clearTimeout(timer);
    }), { threshold: .35 }).observe(demo);
  }

  /* print: open all */
  addEventListener('beforeprint', () => $$('.rv').forEach(el => el.classList.add('in')));
})();
