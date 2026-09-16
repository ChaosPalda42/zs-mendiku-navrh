import { layout, icon, esc, fmtDate, fmtShort, newsCard, eventCard, items, slug, EVENT_RENDER_JS } from './lib.mjs';

export function homePage(D, pic) {
  const news = items(D.news_zs).sort((a, b) => b.date.localeCompare(a.date));
  const important = news.filter((n) => n.important).slice(0, 2);
  const rest = news.filter((n) => !important.includes(n)).slice(0, 5);
  const events = items(D.events).filter((e) => e.start >= '2026-09-16').sort((a, b) => a.start.localeCompare(b.start)).slice(0, 5);
  const classes = items(D.classes).filter((c) => c.level === '1' || c.level === '2');
  const today = D.jidelnicek.weeks.flatMap((w) => w.days).find((d) => d.date === '2026-09-16') || D.jidelnicek.weeks[0].days[2];
  const alert = { title: 'Ředitelské volno 16. 11. 2026', text: 'škola, družina i jídelna budou zavřené – obědy jsou automaticky odhlášeny', link: 'Podrobnosti', level: 'warning' };
  const about = D.about;

  const body = `
<div class="alert-bar ${alert.level === 'info' ? 'info' : ''}" data-id="a1"><div class="wrap">${icon('alert')}<span><b>${esc(alert.title)}</b> · ${esc(alert.text)}</span><a href="aktuality.html">${esc(alert.link)} →</a><button class="x" type="button" aria-label="Zavřít">×</button></div></div>

<section class="hero"><div class="hero-bg"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div></div>
<div class="wrap hero-grid">
  <div class="reveal is-in">
    <span class="eyebrow">Základní a mateřská škola · Praha 4</span>
    <h1>Škola s <em>mosty</em> do života</h1>
    <p class="lead">Úplná základní škola s 1.–9. ročníkem, přípravnou třídou, družinou a mateřskou školou. Od 6. ročníku třídy s rozšířenou výukou matematiky. Všechno, co jako rodič potřebujete, najdete na jednom místě.</p>
    <div class="hero-actions"><a class="btn btn-lg" href="aktuality.html">Aktuality pro rodiče ${icon('arrow')}</a><a class="btn btn-lg btn-ghost" href="zapis.html">${icon('backpack')} Zápis do 1. třídy</a></div>
    <div class="row" style="margin-top:1.6rem;gap:1.4rem"><span class="small mute">${icon('check', 'ic')} ${about.numbers[0].value} žáků</span><span class="small mute">Založeno 1930</span><span class="small mute">Ekoškola · Erasmus+</span></div>
  </div>
  <div class="hero-visual reveal is-in">
    <div class="hero-photo">${pic('hero-zs', 'Děti ve škole')}</div>
    <div class="float-card fc-1">${icon('utensils')}<div><b>Dnes v jídelně</b><span>${esc(today.meal1)}</span></div></div>
    <div class="float-card fc-2">${icon('calendar')}<div><b>${esc(events[0].title)}</b><span>${fmtShort(events[0].start)} · ${events[0].time || 'celý den'}</span></div></div>
    <div class="float-card fc-3">${icon('bell')}<div><b>${news.length} nových aktualit</b><span>tento týden</span></div></div>
  </div>
</div></section>

<section class="section-tight"><div class="wrap">
  <div class="quick reveal-stagger">
    <a href="https://bakalari.example" class="ext" data-demo="Bakaláři – v ukázce neaktivní."><span class="ico">${icon('external')}</span>Bakaláři<small>známky, rozvrh, omluvenky</small></a>
    <a href="jidelna.html"><span class="ico">${icon('utensils')}</span>Jídelníček<small>dnes a celý týden</small></a>
    <a href="tridy.html"><span class="ico">${icon('users')}</span>Třídní stránky<small>informace vaší třídy</small></a>
    <a href="druzina.html"><span class="ico">${icon('sunrise')}</span>Družina<small>provoz 6:30–17:30</small></a>
    <a href="kalendar.html"><span class="ico">${icon('calendar')}</span>Kalendář<small>akce, prázdniny, schůzky</small></a>
    <a href="kontakt.html"><span class="ico">${icon('phone')}</span>Kontakty<small>kancelář, učitelé, jídelna</small></a>
  </div>
</div></section>

<section class="section-tight"><div class="wrap">
  <div class="section-head reveal"><div><span class="eyebrow">Důležité pro rodiče</span><h2>Nepřehlédněte</h2></div><a class="btn btn-ghost btn-sm" href="aktuality.html">Všechny aktuality ${icon('arrow')}</a></div>
  <div class="grid grid-2 reveal-stagger">
    ${important.map((n) => `<div class="notice"><span>${icon('alert')}</span><div><b>${esc(n.title)}</b><p>${esc(n.excerpt)}</p><div class="meta">${fmtDate(n.date)} · <a href="aktualita-${n.slug}.html">Číst celé</a></div></div></div>`).join('')}
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head reveal"><div><span class="eyebrow">Ze života školy</span><h2>Aktuality</h2></div>
    <div class="filters" data-filters="#home-news"><button class="filter is-active" data-filter="all">Vše</button><button class="filter" data-filter="pro-rodice">Pro rodiče</button><button class="filter" data-filter="akce">Akce</button><button class="filter" data-filter="uspechy-zaku">Úspěchy</button><button class="filter" data-filter="projekty">Projekty</button></div></div>
  <div class="news-grid reveal-stagger" id="home-news">
    ${rest.map((n, i) => newsCard(n, { href: `aktualita-${n.slug}.html`, img: pic.src(`news-${(i % 8) + 1}`), featured: i === 0 })).join('')}
    <p data-empty class="mute" style="display:none;grid-column:1/-1">V této kategorii teď nic není.</p>
  </div>
</div></section>

<section class="section-tight"><div class="wrap">
  <div class="section-head reveal"><div><span class="eyebrow">Kalendář</span><h2>Co nás čeká</h2></div><div class="row"><a class="btn btn-ghost btn-sm" href="#" data-demo="Export do kalendáře (iCal) – v ostré verzi se přidá do mobilu.">${icon('ical')} Přidat do kalendáře</a><a class="btn btn-soft btn-sm" href="kalendar.html">Celý kalendář ${icon('arrow')}</a></div></div>
  <div class="events-strip reveal-stagger">${events.map(eventCard).join('')}</div>
</div></section>

<section class="section"><div class="wrap">
  <div class="band blue reveal"><div class="deco"></div><div class="deco deco-2"></div>
    <div class="grid grid-2"><div><span class="eyebrow" style="color:#fff">Třídní stránky</span><h2>Vaše třída na jednom místě</h2><p>Každá třída má vlastní stránku: zprávy od třídní učitelky, fotky z akcí, soubory k výuce a kontakty. Část obsahu je jen pro rodiče třídy – chráněná heslem.</p><a class="btn btn-white" href="tridy.html">Přehled tříd ${icon('arrow')}</a></div>
    <div class="class-grid">${classes.slice(0, 12).map((c) => `<a class="class-tile" href="trida-${slug(c.name)}.html" style="background:rgb(255 255 255/.12);border-color:rgb(255 255 255/.2);color:#fff"><b style="color:#fff">${c.name}</b><span style="color:rgb(255 255 255/.75)">${esc(c.teacher)}</span></a>`).join('')}</div></div>
  </div>
</div></section>

<section class="section-tight"><div class="wrap">
  <div class="grid grid-2" style="align-items:stretch">
    <div class="card card-pad reveal" style="display:grid;grid-template-columns:auto 1fr;gap:1.2rem;align-items:center">
      <div class="today-box"><h3 style="font-size:1rem">Dnes v jídelně</h3><div class="m"><div><i>polévka</i>${esc(today.soup)}</div><div><i>oběd 1</i>${esc(today.meal1)}</div><div><i>oběd 2</i>${esc(today.meal2)}</div></div></div>
      <div><h3>Jídelníček a odhlašování</h3><p class="mute small">Jídelníček na celý týden, alergeny, ceny a návod, jak odhlásit oběd do 14:00 předchozího dne.</p><a class="btn btn-sm btn-soft" href="jidelna.html">Celý týden ${icon('arrow')}</a></div>
    </div>
    <div class="band reveal" style="padding:clamp(1.4rem,3vw,2.2rem)"><div class="deco"></div>
      <div class="row between"><div><span class="eyebrow" style="color:#fff">Mateřská škola</span><h3 style="font-size:var(--step-2)">MŠ Mendíků – Cestička do školy</h3><p>Tři oddělení, vlastní zahrada, aktuality a jídelníček školky, zápis do MŠ.</p><a class="btn btn-white btn-sm" href="ms-index.html">Přejít do sekce MŠ ${icon('arrow')}</a></div></div>
    </div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head reveal"><div><span class="eyebrow">Naše škola</span><h2>Proč Mendíků</h2></div><a class="btn btn-ghost btn-sm" href="o-skole.html">Více o škole ${icon('arrow')}</a></div>
  <div class="grid grid-4 reveal-stagger">${about.values.map((v) => `<div class="card value"><span class="ico">${icon(v.icon)}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join('')}</div>
  <div class="stats reveal-stagger" style="margin-top:1.5rem">${about.numbers.map((n) => `<div class="card stat"><b data-count>${esc(n.value)}</b><span>${esc(n.label)}</span></div>`).join('')}</div>
</div></section>

<section class="section-tight"><div class="wrap">
  <div class="section-head reveal"><div><span class="eyebrow">Fotogalerie</span><h2>Momentky ze školy</h2></div><a class="btn btn-ghost btn-sm" href="fotogalerie.html">Všechny galerie ${icon('arrow')}</a></div>
  <div class="gallery-grid reveal-stagger" data-lightbox>${[1, 2, 3, 4, 5, 6].map((i) => `<a href="${pic.src(`gallery-${i}`)}" data-cap="Ukázková fotografie ${i}">${pic(`gallery-${i}`, '')}</a>`).join('')}</div>
</div></section>
`;
  return layout({ title: 'Úvod', description: 'Základní a mateřská škola Mendíků, Praha 4', active: 'index.html', body, scripts: `<script>${EVENT_RENDER_JS}</script>` });
}

export function enPage(D, pic) {
  const en = D.en;
  const events = items(D.events).filter((e) => e.start >= '2026-09-16').sort((a, b) => a.start.localeCompare(b.start)).slice(0, 4);
  const body = `
<div class="alert-bar info" data-id="en1"><div class="wrap">${icon('info')}<span>${esc(en.notice)}</span><a href="kontakt.html">Contact us →</a></div></div>
<section class="hero"><div class="hero-bg"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div></div>
<div class="wrap hero-grid"><div class="reveal is-in"><span class="eyebrow">Primary school &amp; kindergarten · Prague 4</span><h1>${esc(en.hero.title).replace(/(\w+)$/, '<em>$1</em>')}</h1><p class="lead">${esc(en.hero.subtitle)}</p>
<div class="hero-actions"><a class="btn btn-lg" href="#news">${esc(en.sections.news)} ${icon('arrow')}</a><a class="btn btn-lg btn-ghost" href="kontakt.html">${esc(en.sections.contact)}</a></div></div>
<div class="hero-visual reveal is-in"><div class="hero-photo">${pic('hero-zs', 'Children at school')}</div></div></div></section>
<section class="section-tight"><div class="wrap"><div class="quick reveal-stagger">
  ${[['external', en.nav[0] === 'Home' ? 'Bakaláři' : 'Bakaláři', 'grades & timetable'], ['utensils', en.nav[5], 'weekly menu'], ['users', en.nav[3], 'class pages'], ['sunrise', en.nav[4], 'until 17:30'], ['calendar', en.nav[2], 'events & holidays'], ['backpack', en.nav[6], 'how to enrol']].map(([ic, t, s]) => `<a href="#"><span class="ico">${icon(ic)}</span>${esc(t)}<small>${s}</small></a>`).join('')}
</div></div></section>
<section class="section" id="news"><div class="wrap"><div class="section-head reveal"><div><span class="eyebrow">School life</span><h2>${esc(en.sections.news)}</h2></div></div>
<div class="news-grid reveal-stagger">${en.news.map((n, i) => `<article class="card card-hover news-card"><div class="card-media"><img src="${pic.src(`news-${i + 1}`)}" alt="" loading="lazy"></div><div class="card-pad"><div class="meta"><span>${n.date}</span></div><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p><span class="more">Read more ${icon('arrow')}</span></div></article>`).join('')}</div></div></section>
<section class="section-tight"><div class="wrap"><div class="section-head reveal"><div><span class="eyebrow">Calendar</span><h2>${esc(en.sections.events)}</h2></div></div><div class="events-strip reveal-stagger">${events.map(eventCard).join('')}</div>
<p class="mute small" style="margin-top:1rem">In this demo the EN version shows only the homepage. The final website will have a full English mirror of key pages for international families (managed from the same admin).</p></div></section>`;
  return layout({ title: 'Home (EN)', lang: 'en', body, scripts: `<script>${EVENT_RENDER_JS}</script>` });
}
