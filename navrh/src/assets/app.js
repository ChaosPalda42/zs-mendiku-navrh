/* ZŠ a MŠ Mendíků – návrh webu: interakce (bez závislostí, funguje i z file://) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  // ---- téma
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
  $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
    const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme);
  }));

  // ---- hlavička při scrollu
  const header = $('.header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- mobilní menu
  const drawer = $('.drawer');
  $$('[data-drawer-open]').forEach((b) => b.addEventListener('click', () => { drawer.classList.add('is-open'); document.body.style.overflow = 'hidden'; }));
  $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', () => { drawer.classList.remove('is-open'); document.body.style.overflow = ''; }));

  // ---- lišta upozornění (zavření si pamatuje)
  $$('.alert-bar').forEach((bar) => {
    const key = 'alert-' + bar.dataset.id;
    if (sessionStorage.getItem(key)) bar.remove();
    $('.x', bar)?.addEventListener('click', () => { sessionStorage.setItem(key, '1'); bar.style.transition = 'opacity .3s'; bar.style.opacity = 0; setTimeout(() => bar.remove(), 300); });
  });

  // ---- reveal při scrollu
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px' });
  $$('.reveal, .reveal-stagger').forEach((el) => io.observe(el));

  // ---- počítadla
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, txt = el.textContent.trim(), m = txt.match(/^(\D*)(\d+)(.*)$/); if (!m) return;
    const to = +m[2], t0 = performance.now();
    const tick = (t) => { const p = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = m[1] + v + m[3]; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach((el) => cio.observe(el));

  // ---- toast
  const toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast);
  const say = (t) => { toast.textContent = t; toast.classList.add('is-on'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('is-on'), 2600); };
  window.demoToast = say;
  $$('[data-demo]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); say(el.dataset.demo || 'V ukázce tato akce nic neodešle.'); }));

  // ---- filtry (data-filter na tlačítku, data-cat na položkách)
  $$('[data-filters]').forEach((box) => {
    const target = $(box.dataset.filters);
    $$('.filter', box).forEach((b) => b.addEventListener('click', () => {
      $$('.filter', box).forEach((x) => x.classList.remove('is-active')); b.classList.add('is-active');
      const f = b.dataset.filter; let n = 0;
      $$('[data-cat]', target).forEach((it) => { const show = f === 'all' || it.dataset.cat.split(' ').includes(f); it.style.display = show ? '' : 'none'; if (show) n++; });
      const empty = $('[data-empty]', target); if (empty) empty.style.display = n ? 'none' : '';
    }));
  });

  // ---- taby (jídelníček, třídy…)
  $$('[data-tabs]').forEach((box) => {
    const btns = $$('[data-tab]', box), panes = $$('[data-pane]', box);
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.toggle('is-active', x === b));
      panes.forEach((p) => { p.hidden = p.dataset.pane !== b.dataset.tab; if (!p.hidden) { p.classList.remove('is-in'); requestAnimationFrame(() => p.classList.add('is-in')); } });
    }));
  });

  // ---- zámek chráněné části (ukázka: heslo "rodice")
  $$('form[data-lock]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = $('input', f).value.trim().toLowerCase();
    if (val === (f.dataset.lock || 'rodice')) { const box = f.closest('.lock-box'); const target = $(box.dataset.unlock); box.style.display = 'none'; target.hidden = false; target.classList.add('reveal'); requestAnimationFrame(() => target.classList.add('is-in')); say('Odemčeno – toto vidí jen rodiče třídy.'); }
    else { say('Nesprávné heslo. V ukázce je heslo „rodice“.'); $('input', f).focus(); }
  }));

  // ---- lightbox
  const lb = $('.lightbox');
  if (lb) {
    let items = [], i = 0;
    const img = $('img', lb), cap = $('.cap', lb);
    const show = (k) => { i = (k + items.length) % items.length; img.src = items[i].href; cap.textContent = items[i].dataset.cap || ''; };
    $$('[data-lightbox]').forEach((g) => $$('a', g).forEach((a, k) => a.addEventListener('click', (e) => { e.preventDefault(); items = $$('a', g); show(k); lb.classList.add('is-open'); })));
    $('.lb-close', lb).addEventListener('click', () => lb.classList.remove('is-open'));
    $('.lb-prev', lb).addEventListener('click', () => show(i - 1));
    $('.lb-next', lb).addEventListener('click', () => show(i + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('is-open'); });
    addEventListener('keydown', (e) => { if (!lb.classList.contains('is-open')) return; if (e.key === 'Escape') lb.classList.remove('is-open'); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
  }

  // ---- vyhledávání (index vložený do stránky)
  const sm = $('.search-modal');
  if (sm) {
    const input = $('input', sm), res = $('.search-res', sm), idx = window.SEARCH_INDEX || [];
    const open = () => { sm.classList.add('is-open'); setTimeout(() => input.focus(), 30); };
    const close = () => sm.classList.remove('is-open');
    $$('[data-search-open]').forEach((b) => b.addEventListener('click', open));
    sm.addEventListener('click', (e) => { if (e.target === sm) close(); });
    addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open(); } if (e.key === 'Escape') close(); });
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const render = (q) => {
      const n = norm(q.trim());
      const hits = n.length < 2 ? idx.slice(0, 6) : idx.filter((it) => norm(it.t + ' ' + (it.d || '')).includes(n)).slice(0, 10);
      res.innerHTML = hits.length ? hits.map((h) => `<a href="${h.u}"><div><b>${h.t}</b><span>${h.d || ''}</span></div><span class="k">${h.k}</span></a>`).join('') : `<div class="empty">Nic jsme nenašli. Zkuste jiné slovo.</div>`;
    };
    input.addEventListener('input', () => render(input.value)); render('');
  }

  // ---- kalendář (měsíční mřížka + seznam)
  const cal = $('[data-calendar]');
  if (cal && window.EVENTS) {
    const EV = window.EVENTS, months = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
    let cur = new Date(2026, 8, 1), filter = 'all';
    const title = $('[data-cal-title]', cal), grid = $('.cal-grid', cal), list = $('[data-cal-list]');
    const fmt = (d) => d.toISOString().slice(0, 10);
    const draw = () => {
      title.textContent = `${months[cur.getMonth()]} ${cur.getFullYear()}`;
      const y = cur.getFullYear(), m = cur.getMonth(), first = new Date(y, m, 1), start = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      let html = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map((d) => `<div class="dow">${d}</div>`).join('');
      const today = '2026-09-16';
      for (let c = 0; c < Math.ceil((start + days) / 7) * 7; c++) {
        const d = new Date(y, m, c - start + 1), iso = fmt(new Date(d.getTime() - d.getTimezoneOffset() * 60000)), other = d.getMonth() !== m;
        const evs = EV.filter((e) => (filter === 'all' || e.type === filter) && e.start <= iso && e.end >= iso);
        html += `<div class="cal-day ${other ? 'other' : ''} ${iso === today ? 'today' : ''}"><span class="n">${d.getDate()}</span>${evs.map((e) => `<span class="cal-ev ${e.type}" title="${e.title}" data-ev="${e.id}">${e.title}</span>`).join('')}</div>`;
      }
      grid.innerHTML = html;
      $$('.cal-ev', grid).forEach((el) => el.addEventListener('click', () => { const e = EV.find((x) => x.id == el.dataset.ev); say(`${e.title} · ${e.time || 'celý den'} · ${e.place}`); }));
      if (list) {
        const mm = EV.filter((e) => (filter === 'all' || e.type === filter) && e.start.slice(0, 7) === `${y}-${String(m + 1).padStart(2, '0')}`);
        list.innerHTML = mm.length ? mm.map((e) => window.renderEvent(e)).join('') : `<p class="mute">V tomto měsíci nejsou žádné události.</p>`;
      }
    };
    $('[data-cal-prev]', cal).addEventListener('click', () => { cur = new Date(cur.getFullYear(), cur.getMonth() - 1, 1); draw(); });
    $('[data-cal-next]', cal).addEventListener('click', () => { cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1); draw(); });
    $$('[data-cal-filter]').forEach((b) => b.addEventListener('click', () => { $$('[data-cal-filter]').forEach((x) => x.classList.remove('is-active')); b.classList.add('is-active'); filter = b.dataset.calFilter; draw(); }));
    draw();
  }

  // ---- admin ukázka: přepínání pohledů
  $$('[data-admin-nav]').forEach((a) => a.addEventListener('click', (e) => {
    const t = a.getAttribute('href'); if (!t || !t.startsWith('#')) return; e.preventDefault();
    $$('[data-admin-nav]').forEach((x) => x.classList.remove('is-active')); a.classList.add('is-active');
    $$('[data-admin-view]').forEach((v) => { v.hidden = '#' + v.dataset.adminView !== t; });
    scrollTo({ top: 0, behavior: 'smooth' });
  }));
  if (location.hash && $(`[data-admin-view="${location.hash.slice(1)}"]`)) $(`[data-admin-nav][href="${location.hash}"]`)?.click();
})();
