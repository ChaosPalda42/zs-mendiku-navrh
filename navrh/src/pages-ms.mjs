import { layout, icon, esc, fmtDate, fmtShort, dateParts, newsCard, eventCard, items, slug, crumbs, pageHead, catChip, initials, EVENT_RENDER_JS } from './lib.mjs';

export function msHomePage(D, pic) {
  const m = D.ms;
  const news = items(D.news_ms).sort((a, b) => b.date.localeCompare(a.date));
  const events = items(D.events).filter((e) => e.type === 'ms' || e.audience.toLowerCase().includes('mš') || e.type === 'prazdniny').filter((e) => e.start >= '2026-09-16').slice(0, 4);
  const cl = items(D.classes).filter((c) => c.level === 'ms');
  const today = D.jidelnicek.ms.days.find((d) => d.date === '2026-09-16') || D.jidelnicek.ms.days[2];
  const body = `
<section class="hero"><div class="hero-bg"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div></div>
<div class="wrap hero-grid">
  <div class="reveal is-in"><span class="eyebrow">Mateřská škola · Praha 4</span><h1>Cestička <em>do školy</em> začíná u nás</h1><p class="lead">Tři oddělení, vlastní zahrada a program, který děti hravě připraví na první třídu. Sekce školky má vlastní aktuality, jídelníček i kroužky – ale stejný přehledný design jako web školy.</p>
  <div class="hero-actions"><a class="btn btn-lg" href="ms-aktuality.html">Aktuality školky ${icon('arrow')}</a><a class="btn btn-lg btn-ghost" href="ms-zapis.html">Zápis do MŠ</a></div></div>
  <div class="hero-visual reveal is-in"><div class="hero-photo">${pic('hero-ms', 'Děti ve školce')}</div>
    <div class="float-card fc-1">${icon('utensils')}<div><b>Dnes k obědu</b><span>${esc(today.meal)}</span></div></div>
    <div class="float-card fc-2">${icon('clock')}<div><b>Provoz</b><span>7:00–17:30</span></div></div></div>
</div></section>
<section class="section-tight"><div class="wrap"><div class="quick reveal-stagger">
  <a href="ms-aktuality.html"><span class="ico">${icon('bell')}</span>Aktuality<small>zprávy pro rodiče</small></a>
  <a href="ms-jidelna.html"><span class="ico">${icon('utensils')}</span>Jídelníček<small>svačiny a obědy</small></a>
  <a href="ms-tridy.html"><span class="ico">${icon('users')}</span>Oddělení<small>Koťátka · Berušky · Sluníčka</small></a>
  <a href="ms-krouzky.html"><span class="ico">${icon('puzzle')}</span>Kroužky<small>odpolední aktivity</small></a>
  <a href="#" class="ext" data-demo="Aplikace NAŠE MŠ – externí odkaz."><span class="ico">${icon('external')}</span>Aplikace Naše MŠ<small>omluvenky, docházka</small></a>
  <a href="kontakt.html"><span class="ico">${icon('phone')}</span>Kontakt<small>MŠ a kancelář</small></a>
</div></div></section>
<section class="section"><div class="wrap"><div class="section-head reveal"><div><span class="eyebrow">Ze školky</span><h2>Aktuality</h2></div><a class="btn btn-ghost btn-sm" href="ms-aktuality.html">Všechny ${icon('arrow')}</a></div>
<div class="news-grid reveal-stagger">${news.slice(0, 3).map((n, i) => newsCard(n, { href: `ms-aktualita-${n.slug}.html`, img: pic.src(`ms-${(i % 3) + 1}`) })).join('')}</div></div></section>
<section class="section-tight"><div class="wrap grid grid-2">
  <div class="card card-pad reveal"><span class="eyebrow">Režim dne</span><table class="table" style="min-width:0">${m.daySchedule.map((s) => `<tr><td style="white-space:nowrap"><b>${esc(s.time)}</b></td><td class="mute">${esc(s.activity)}</td></tr>`).join('')}</table></div>
  <div class="stack"><div class="card card-pad reveal"><span class="eyebrow">Co děti do školky potřebují</span><div class="grid grid-2" style="gap:.4rem">${m.needs.map((n) => `<span class="row small" style="gap:.5rem">${icon('check', 'ic')}${esc(n)}</span>`).join('')}</div></div>
  <div class="card card-pad reveal"><span class="eyebrow">Úplata a stravné</span><div class="small">${m.fees}</div></div></div>
</div></section>
<section class="section-tight"><div class="wrap"><div class="section-head reveal"><div><span class="eyebrow">Oddělení</span><h2>Naše třídy</h2></div><a class="btn btn-ghost btn-sm" href="ms-tridy.html">Stránky oddělení ${icon('arrow')}</a></div>
<div class="grid grid-3 reveal-stagger">${cl.map((c, i) => `<a class="card card-hover link album" href="ms-tridy.html"><div class="card-media">${pic(`ms-${i + 1}`, '')}</div><div class="card-pad"><h3>${esc(c.name)}</h3><small>${esc(c.teacher)} · ${c.pupils} dětí</small></div></a>`).join('')}</div></div></section>
<section class="section-tight"><div class="wrap"><div class="section-head reveal"><div><span class="eyebrow">Kalendář</span><h2>Co nás čeká</h2></div><a class="btn btn-soft btn-sm" href="kalendar.html">Celý kalendář ${icon('arrow')}</a></div><div class="events-strip reveal-stagger">${events.map(eventCard).join('')}</div></div></section>`;
  return layout({ title: 'Mateřská škola', section: 'ms', active: 'ms-index.html', body, scripts: `<script>${EVENT_RENDER_JS}</script>` });
}

export function msNewsPage(D, pic) {
  const news = items(D.news_ms).sort((a, b) => b.date.localeCompare(a.date));
  const body = `
${crumbs([['MŠ', 'ms-index.html'], ['Aktuality']])}
${pageHead('Aktuality mateřské školy', 'Zprávy pro rodiče dětí ze školky. Důležitá sdělení jsou označená a zobrazují se i na úvodní stránce.')}
<div class="wrap"><div class="news-list reveal-stagger">${news.map((n) => { const p = dateParts(n.date); return `<article class="card card-hover news-row"><div class="date"><b>${p.d}</b><span>${p.m}</span></div><div><h3><a href="ms-aktualita-${n.slug}.html">${esc(n.title)}</a></h3><p>${esc(n.excerpt)}</p><div class="chips">${catChip(n.category)}${n.important && n.category !== 'Důležité' ? '<span class="chip chip-danger">důležité</span>' : ''}</div></div><a class="btn btn-sm btn-soft" href="ms-aktualita-${n.slug}.html">Číst</a></article>`; }).join('')}</div></div>`;
  return layout({ title: 'Aktuality MŠ', section: 'ms', active: 'ms-aktuality.html', body });
}

export function msClassesPage(D, pic) {
  const cl = items(D.classes).filter((c) => c.level === 'ms');
  const body = `
${crumbs([['MŠ', 'ms-index.html'], ['Oddělení']])}
${pageHead('Oddělení mateřské školy', 'Každé oddělení má vlastní stránku se zprávami učitelek, fotkami (chráněnými heslem) a týdenním plánem.')}
<div class="wrap grid grid-3 reveal-stagger">${cl.map((c, i) => `<article class="card card-hover"><div class="card-media">${pic(`ms-${i + 1}`, '')}</div><div class="card-pad"><h3>${esc(c.name)}</h3><p class="small mute">„${esc(c.motto)}“</p><div class="teacher-card"><span class="avatar sm">${initials(c.teacher)}</span><div class="small"><b>${esc(c.teacher)}</b><br><span class="mute">${c.pupils} dětí · ${esc(c.room)}</span></div></div><div class="row" style="margin-top:1rem"><a class="btn btn-sm btn-soft" href="trida-4-a.html">Stránka oddělení ${icon('arrow')}</a></div></div></article>`).join('')}</div>
<div class="wrap section-tight"><p class="mute small">Ukázka stránky oddělení je stejná jako u třídy ZŠ (zprávy, chráněná galerie, soubory) – v ostré verzi bude mít MŠ zelený vzhled.</p></div>`;
  return layout({ title: 'Oddělení MŠ', section: 'ms', active: 'ms-tridy.html', body });
}
