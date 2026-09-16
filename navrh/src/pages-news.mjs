import { layout, icon, esc, fmtDate, fmtShort, dateParts, newsCard, eventCard, items, slug, crumbs, pageHead, fileItem, catChip, initials, EVENT_RENDER_JS } from './lib.mjs';

export function newsListPage(D, pic) {
  const news = items(D.news_zs).sort((a, b) => b.date.localeCompare(a.date));
  const dru = items(D.news_druzina).map((n) => ({ ...n, category: 'Družina', slug: 'druzina-' + n.slug }));
  const all = [...news, ...dru].sort((a, b) => b.date.localeCompare(a.date));
  const cats = ['Důležité', 'Pro rodiče', 'Akce', 'Družina', 'Projekty', 'Úspěchy žáků', 'Erasmus+'];
  const body = `
${crumbs([['Úvod', 'index.html'], ['Aktuality']])}
${pageHead('Aktuality', 'Všechny zprávy ze školy, družiny i projektů. Důležitá sdělení pro rodiče jsou vždy nahoře a označená.', `<div class="row" style="margin-top:1.2rem"><a class="btn btn-sm btn-soft" href="#" data-demo="Odběr novinek e-mailem – bude v ostré verzi.">${icon('bell')} Odebírat e-mailem</a><a class="btn btn-sm btn-ghost" href="#" data-demo="RSS kanál – bude v ostré verzi.">RSS</a></div>`)}
<div class="wrap">
  <div class="filters reveal" data-filters="#news-all" style="margin-bottom:1.4rem"><button class="filter is-active" data-filter="all">Vše (${all.length})</button>${cats.map((c) => `<button class="filter" data-filter="${slug(c)}" ${c === 'Úspěchy žáků' ? 'id="uspechy"' : ''}>${c}</button>`).join('')}<button class="filter" data-filter="dulezite">${icon('alert')} Jen důležité</button></div>
  <div class="news-list reveal-stagger" id="news-all">
    ${all.map((n) => { const p = dateParts(n.date); return `<article class="card card-hover news-row" data-cat="${slug(n.category)}${n.important ? ' dulezite' : ''}"><div class="date"><b>${p.d}</b><span>${p.m}</span></div><div><h3><a href="aktualita-${n.slug}.html">${esc(n.title)}</a></h3><p>${esc(n.excerpt)}</p><div class="chips">${catChip(n.category)}${n.important && n.category !== 'Důležité' ? '<span class="chip chip-danger">důležité</span>' : ''}${n.attachments?.length ? `<span class="chip chip-mute">${icon('file')} ${n.attachments.length} příloh${n.attachments.length === 1 ? 'a' : 'y'}</span>` : ''}${n.hasGallery ? `<span class="chip chip-mute">${icon('camera')} fotogalerie</span>` : ''}</div></div><a class="btn btn-sm btn-soft" href="aktualita-${n.slug}.html">Číst</a></article>`; }).join('')}
    <p data-empty class="mute" style="display:none">V této kategorii teď nic není.</p>
  </div>
  <div class="row" style="justify-content:center;margin-top:2rem"><a class="btn btn-ghost" href="#" data-demo="Starší aktuality – v ostré verzi archiv po školních rocích.">Zobrazit starší aktuality</a></div>
</div>`;
  return layout({ title: 'Aktuality', active: 'aktuality.html', body });
}

export function newsDetailPage(D, pic, n, { back = ['Aktuality', 'aktuality.html'], section = 'zs', author = 'Vedení školy', related = [] } = {}) {
  const imgIdx = (n.slug.length % 8) + 1;
  const body = `
${crumbs([['Úvod', section === 'ms' ? 'ms-index.html' : 'index.html'], back, [n.title.length > 40 ? n.title.slice(0, 40) + '…' : n.title]])}
<div class="wrap article-head reveal is-in">
  <div class="chips" style="margin-bottom:1rem">${catChip(n.category)}${n.important && n.category !== 'Důležité' ? '<span class="chip chip-danger">důležité</span>' : ''}</div>
  <h1>${esc(n.title)}</h1>
  <div class="article-meta"><span class="avatar sm">${initials(author)}</span><span>${esc(author)}</span><span>·</span><span>${fmtDate(n.date)}</span><span>·</span><a href="#" data-demo="Sdílení odkazu – každá aktualita má vlastní adresu.">Sdílet</a><a href="#" data-demo="Tisk stránky.">Tisk</a></div>
</div>
<div class="wrap article-layout">
  <article>
    ${n.hasGallery ? `<div class="card-media" style="border-radius:var(--r-lg);aspect-ratio:21/9;margin-bottom:1.8rem">${pic(`news-${imgIdx}`, '')}</div>` : ''}
    <div class="prose reveal is-in"><p class="lead">${esc(n.excerpt)}</p>${n.body}</div>
    ${n.attachments?.length ? `<h3 style="margin-top:2rem">Přílohy</h3><div class="files">${n.attachments.map(fileItem).join('')}</div>` : ''}
    ${n.hasGallery ? `<h3 style="margin-top:2rem">Fotogalerie</h3><div class="gallery-grid" data-lightbox>${[1, 2, 3, 4, 5].map((i) => `<a href="${pic.src(`gallery-${((imgIdx + i) % 12) + 1}`)}" data-cap="${esc(n.title)}">${pic(`gallery-${((imgIdx + i) % 12) + 1}`, '')}</a>`).join('')}<a href="fotogalerie.html" style="display:grid;place-items:center;background:var(--primary-soft);color:var(--primary-deep);font-weight:700">+ 34</a></div>` : ''}
  </article>
  <aside class="aside">
    <div class="card card-pad"><h4>Kontakt k tomuto sdělení</h4><div class="teacher-card"><span class="avatar">${initials(author)}</span><div><b>${esc(author)}</b><div class="contact-lines"><a href="#">${icon('mail')} skola@skola-ukazka.cz</a></div></div></div></div>
    ${related.length ? `<div class="card card-pad"><h4>Další aktuality</h4><ul>${related.map((r) => `<li><a href="aktualita-${r.slug}.html">${esc(r.title)}<small>${fmtDate(r.date)}</small></a></li>`).join('')}</ul></div>` : ''}
    <div class="card card-pad" style="background:var(--accent-soft);border-color:transparent"><h4 style="margin-bottom:.3rem">Chcete novinky e-mailem?</h4><p class="small" style="margin:0 0 .7rem">Vyberete si třídu a dostanete jen to, co se vás týká.</p><a class="btn btn-sm btn-accent" href="#" data-demo="Odběr novinek – bude v ostré verzi.">Přihlásit odběr</a></div>
  </aside>
</div>`;
  return layout({ title: n.title, section, body });
}

export function calendarPage(D) {
  const events = items(D.events).sort((a, b) => a.start.localeCompare(b.start));
  const types = [['all', 'Vše'], ['akce', 'Akce'], ['schuzky', 'Schůzky'], ['prazdniny', 'Prázdniny'], ['reditelske-volno', 'Ředitelské volno'], ['vylet', 'Výlety a pobyty'], ['zapis', 'Zápis'], ['druzina', 'Družina'], ['ms', 'MŠ']];
  const body = `
${crumbs([['Úvod', 'index.html'], ['Kalendář']])}
${pageHead('Kalendář akcí', 'Prázdniny, třídní schůzky, akce, výlety i ředitelské volno v jednom kalendáři. Přidejte si ho do mobilu – změny se vám promítnou samy.', `<div class="row" style="margin-top:1.2rem"><a class="btn btn-sm" href="#" data-demo="Odběr kalendáře (iCal/Google/Apple) – v ostré verzi jedním klikem.">${icon('ical')} Přidat do mého kalendáře</a><a class="btn btn-sm btn-ghost" href="#" data-demo="Tisk přehledu školního roku.">Tisknout přehled</a><a class="btn btn-sm btn-ghost" href="skolni-rok.html">Organizace školního roku</a></div>`)}
<div class="wrap">
  <div class="filters reveal" style="margin-bottom:1rem">${types.map(([k, l]) => `<button class="filter ${k === 'all' ? 'is-active' : ''}" data-cal-filter="${k}">${l}</button>`).join('')}</div>
  <div class="cal reveal" data-calendar>
    <div class="cal-head"><div class="row"><button class="icon-btn" type="button" data-cal-prev aria-label="Předchozí měsíc">${icon('chevronL')}</button><h3 data-cal-title></h3><button class="icon-btn" type="button" data-cal-next aria-label="Další měsíc">${icon('chevronR')}</button></div>
      <div class="legend"><span><i style="background:var(--accent)"></i>akce</span><span><i style="background:var(--primary)"></i>schůzky</span><span><i style="background:var(--ok)"></i>prázdniny</span><span><i style="background:var(--danger)"></i>volno / zápis</span><span><i style="background:#7c3aed"></i>výlety</span><span><i style="background:#0f9d8a"></i>MŠ</span><span><i style="background:#ea580c"></i>družina</span></div></div>
    <div class="cal-grid"></div>
  </div>
  <div class="section-tight"><div class="section-head"><h2 style="font-size:var(--step-2)">Události v měsíci</h2><span class="mute small">Kliknutím na událost zobrazíte detail</span></div><div class="cal-list" data-cal-list></div></div>
  <div class="section-tight"><div class="section-head"><h2 style="font-size:var(--step-2)">Celý školní rok 2026/2027</h2></div>
    ${groupByMonth(events).map(([m, list]) => `<div class="month-group"><h4>${m}</h4><div class="events-strip">${list.map(eventCard).join('')}</div></div>`).join('')}
  </div>
</div>`;
  return layout({ title: 'Kalendář akcí', active: 'kalendar.html', body, scripts: `<script>window.EVENTS=${JSON.stringify(events)};${EVENT_RENDER_JS}</script>` });
}
const MN = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
function groupByMonth(events) {
  const g = new Map();
  for (const e of events) { const [y, m] = e.start.split('-'); const k = `${MN[+m - 1]} ${y}`; if (!g.has(k)) g.set(k, []); g.get(k).push(e); }
  return [...g.entries()];
}

export function schoolYearPage(D) {
  const sy = D.about.schoolYear;
  const events = items(D.events);
  const body = `
${crumbs([['Úvod', 'index.html'], ['Pro rodiče'], ['Organizace školního roku']])}
${pageHead('Školní rok 2026/2027', 'Termíny prázdnin, třídních schůzek a dnů otevřených dveří, pravidla omlouvání a konzultační hodiny. Všechny termíny najdete i v kalendáři.')}
<div class="wrap grid grid-3 reveal-stagger">
  <div class="card card-pad"><span class="eyebrow">Prázdniny a volna</span><table class="table" style="min-width:0">${events.filter((e) => e.type === 'prazdniny' || e.type === 'reditelske-volno').map((e) => `<tr><td><b>${esc(e.title)}</b></td><td class="mute">${fmtShort(e.start)}${e.end !== e.start ? ' – ' + fmtShort(e.end) : ''} ${e.end.slice(0, 4)}</td></tr>`).join('')}</table></div>
  <div class="card card-pad"><span class="eyebrow">Třídní schůzky</span><table class="table" style="min-width:0">${events.filter((e) => e.type === 'schuzky').map((e) => `<tr><td><b>${esc(e.title)}</b></td><td class="mute">${fmtDate(e.start)}, ${e.time}</td></tr>`).join('')}</table><p class="small mute" style="margin-top:.8rem">Konzultační hodiny učitelů najdete u každé třídy na třídní stránce.</p></div>
  <div class="card card-pad"><span class="eyebrow">Dny otevřených dveří</span>${events.filter((e) => e.title.startsWith('Den otevřených')).map((o) => `<div class="notice info" style="margin-bottom:.6rem">${icon('calendar')}<div><b>${fmtDate(o.start)}, ${o.time}</b><p>${esc(o.description)}</p></div></div>`).join('')}<a class="btn btn-sm btn-soft" href="zapis.html">Informace k zápisu ${icon('arrow')}</a></div>
</div>
<div class="wrap section-tight"><div class="grid grid-2">
  <div class="card card-pad reveal"><h2 style="font-size:var(--step-2)">Omlouvání a uvolňování žáků</h2><div class="prose">${D.about.rules}</div></div>
  <div class="reveal"><h2 style="font-size:var(--step-2)">Pravidelné akce roku</h2><div class="events-strip">${events.filter((e) => e.type === 'akce').slice(0, 6).map(eventCard).join('')}</div><a class="btn btn-ghost btn-sm" style="margin-top:1rem" href="kalendar.html">Celý kalendář ${icon('arrow')}</a></div>
</div></div>`;
  return layout({ title: 'Organizace školního roku', body });
}
