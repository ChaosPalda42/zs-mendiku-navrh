import { layout, icon, esc, fmtDate, fmtShort, dateParts, items, slug, crumbs, pageHead, fileItem, catChip, initials, eventCard } from './lib.mjs';

export function classesPage(D, pic) {
  const cl = items(D.classes);
  const groups = [['1', '1. stupeň'], ['2', '2. stupeň'], ['pripravna', 'Přípravná třída']];
  const body = `
${crumbs([['Úvod', 'index.html'], ['Pro rodiče'], ['Třídní stránky']])}
${pageHead('Třídní stránky', 'Každá třída má vlastní stránku se zprávami od třídního učitele, fotkami, soubory a kontakty. Obsah jen pro rodiče třídy je chráněný heslem, které dostanete na třídních schůzkách.')}
<div class="wrap">
  ${groups.map(([lv, name]) => { const list = cl.filter((c) => c.level === lv); return list.length ? `<div class="reveal" style="margin-bottom:2rem"><div class="section-head"><h2 style="font-size:var(--step-2)">${name}</h2><span class="mute small">${list.length} ${list.length === 1 ? 'třída' : list.length < 5 ? 'třídy' : 'tříd'}</span></div>
  <div class="class-grid reveal-stagger" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr))">${list.map((c) => `<a class="class-tile big" href="trida-${slug(c.name)}.html"><b>${c.name}</b><span><strong style="color:var(--text)">${esc(c.teacher)}</strong><br>${esc(c.room)} · ${c.pupils} žáků</span><span class="chip chip-mute" style="margin-top:.4rem;align-self:flex-start">${icon('bell')} 3 nové zprávy</span></a>`).join('')}</div></div>` : ''; }).join('')}
  <div class="band reveal"><div class="deco"></div><div class="grid grid-2"><div><span class="eyebrow" style="color:#fff">Mateřská škola</span><h2 style="font-size:var(--step-2)">Oddělení MŠ</h2><p>Koťátka, Berušky a Sluníčka mají své stránky v sekci mateřské školy.</p></div><div class="row" style="justify-content:flex-end"><a class="btn btn-white" href="ms-tridy.html">Třídy MŠ ${icon('arrow')}</a></div></div></div>
</div>`;
  return layout({ title: 'Třídní stránky', body });
}

export function classPage(D, pic, c) {
  const news = items(D.news_trida).sort((a, b) => b.date.localeCompare(a.date));
  const gal = items(D.galleries).filter((g) => g.section === 'trida');
  const events = items(D.events).filter((e) => e.start >= '2026-09-16' && (e.audience.includes('1.') || e.audience === 'všichni' || e.audience === 'rodiče')).slice(0, 3);
  const body = `
${crumbs([['Úvod', 'index.html'], ['Třídní stránky', 'tridy.html'], [`Třída ${c.name}`]])}
<div class="page-head-bg"><div class="wrap page-head" style="display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:center">
  <div><span class="eyebrow">${c.level === '1' ? '1. stupeň' : c.level === '2' ? '2. stupeň' : 'Přípravná třída'} · školní rok 2026/2027</span><h1>Třída ${c.name}</h1><p class="lead">„${esc(c.motto)}“</p>
    <div class="row" style="margin-top:.8rem"><span class="chip chip-mute">${icon('pin')} ${esc(c.room)}</span><span class="chip chip-mute">${icon('users')} ${c.pupils} žáků</span>${c.assistant ? `<span class="chip chip-mute">asistent: ${esc(c.assistant)}</span>` : ''}</div></div>
  <div class="card card-pad teacher-card" style="min-width:300px"><span class="avatar lg">${initials(c.teacher)}</span><div><span class="small mute">${/(ová|á)$/.test(c.teacher.trim()) ? 'Třídní učitelka' : 'Třídní učitel'}</span><b style="display:block;font-size:1.05rem">${esc(c.teacher)}</b><div class="contact-lines"><a href="#" data-demo="E-mail – v ukázce neaktivní.">${icon('mail')} ${esc(c.email)}</a><br><a href="#" data-demo="Telefon – v ukázce neaktivní.">${icon('phone')} ${esc(c.phone)}</a></div><span class="small mute">Konzultace: úterý 14:00–15:00</span></div></div>
</div></div>
<div class="wrap article-layout">
  <div>
    <div class="section-head"><h2 style="font-size:var(--step-2)">Zprávy od ${/(ová|á)$/.test(c.teacher.trim()) ? 'třídní učitelky' : 'třídního učitele'}</h2><a class="btn btn-sm btn-ghost" href="#" data-demo="Archiv zpráv třídy.">Starší zprávy</a></div>
    <div class="news-list reveal-stagger">${news.map((n) => { const p = dateParts(n.date); return `<article class="card card-hover news-row"><div class="date"><b>${p.d}</b><span>${p.m}</span></div><div><h3><a href="aktualita-trida-${n.slug}.html">${esc(n.title)}</a></h3><p>${esc(n.excerpt)}</p><div class="chips">${catChip(n.category)}${n.attachments?.length ? `<span class="chip chip-mute">${icon('file')} příloha</span>` : ''}</div></div><a class="btn btn-sm btn-soft" href="aktualita-trida-${n.slug}.html">Číst</a></article>`; }).join('')}</div>

    <div class="section-head" style="margin-top:2.5rem"><h2 style="font-size:var(--step-2)">Fotogalerie třídy</h2></div>
    <div class="lock-box reveal" data-unlock="#trida-chraneno"><span class="lock">${icon('lock')}</span><h3>Jen pro rodiče třídy ${c.name}</h3><p class="mute" style="max-width:48ch;margin-inline:auto">Fotografie dětí a soubory k výuce jsou chráněné heslem, které jste dostali na třídních schůzkách. Heslo si učitel může kdykoli změnit v administraci.</p>
      <form data-lock="rodice"><input class="input" type="password" placeholder="Heslo pro rodiče" aria-label="Heslo"><button class="btn" type="submit">Odemknout ${icon('arrow')}</button></form><p class="small mute" style="margin:.8rem 0 0">V ukázce použijte heslo <b>rodice</b>.</p></div>
    <div id="trida-chraneno" hidden>
      <div class="grid grid-3">${gal.map((g, i) => `<a class="card card-hover album link" href="galerie.html"><div class="card-media">${pic(`gallery-${i + 7}`, '')}<span class="count">${icon('camera')} ${g.count}</span></div><div class="card-pad"><h3>${esc(g.title)}</h3><small>${fmtDate(g.date)}</small></div></a>`).join('')}</div>
      <h3 style="margin-top:2rem">Soubory k výuce</h3>
      <div class="files">${[{ name: 'Týdenní plán 14.–18. 9.', type: 'pdf', size: '180 kB' }, { name: 'Pracovní list – násobilka 6 a 7', type: 'pdf', size: '320 kB' }, { name: 'Seznam pomůcek na výtvarnou výchovu', type: 'docx', size: '45 kB' }].map(fileItem).join('')}</div>
    </div>
  </div>
  <aside class="aside">
    <div class="card card-pad"><h4>Nejbližší termíny</h4><div class="cal-list">${events.map(eventCard).join('')}</div><a class="btn btn-sm btn-ghost" style="margin-top:.8rem" href="kalendar.html">Kalendář ${icon('arrow')}</a></div>
    <div class="card card-pad"><h4>Rychlé odkazy</h4><ul><li><a href="#" data-demo="Rozvrh je v Bakalářích.">Rozvrh třídy (Bakaláři)</a></li><li><a href="jidelna.html">Jídelníček</a></li><li><a href="druzina.html">Družina</a></li><li><a href="krouzky.html">Kroužky</a></li><li><a href="skolni-rok.html">Omlouvání absencí</a></li></ul></div>
    <div class="card card-pad" style="background:var(--primary-soft);border-color:transparent"><h4 style="margin-bottom:.3rem">Novinky třídy e-mailem</h4><p class="small" style="margin:0 0 .7rem">Dostávejte zprávy třídní učitelky do schránky.</p><a class="btn btn-sm" href="#" data-demo="Odběr – bude v ostré verzi.">Přihlásit odběr</a></div>
  </aside>
</div>`;
  return layout({ title: `Třída ${c.name}`, body });
}

export function canteenPage(D, pic, { section = 'zs' } = {}) {
  const isMs = section === 'ms';
  const J = D.jidelnicek, info = D.jidelna_info;
  const today = '2026-09-16';
  const weekHtml = (w, idx) => `<div class="card card-pad" data-pane="w${idx}" ${idx ? 'hidden' : ''}>${w.days.map((d) => `<div class="menu-day ${d.date === today ? 'today' : ''}"><div class="d"><b>${esc(d.day)}</b><span>${fmtShort(d.date)}${d.date === today ? ' · dnes' : ''}</span></div><div class="m"><div><i>polévka</i><span>${esc(d.soup)}</span></div><div><i>oběd 1</i><span>${esc(d.meal1)}<span class="al">${d.allergens1 ? 'alergeny ' + d.allergens1 : ''}</span></span></div><div><i>oběd 2</i><span>${esc(d.meal2)}<span class="al">${d.allergens2 ? 'alergeny ' + d.allergens2 : ''}</span></span></div>${d.dessert ? `<div><i>dezert</i><span>${esc(d.dessert)}</span></div>` : ''}</div></div>`).join('')}</div>`;
  const msHtml = `<div class="card card-pad">${J.ms.days.map((d) => `<div class="menu-day ${d.date === today ? 'today' : ''}"><div class="d"><b>${esc(d.day)}</b><span>${fmtShort(d.date)}</span></div><div class="m"><div><i>svačina</i><span>${esc(d.snackAm)}</span></div><div><i>polévka</i><span>${esc(d.soup)}</span></div><div><i>oběd</i><span>${esc(d.meal)}</span></div><div><i>svačina</i><span>${esc(d.snackPm)}</span></div></div></div>`).join('')}</div>`;
  const body = `
${crumbs([['Úvod', isMs ? 'ms-index.html' : 'index.html'], [isMs ? 'Jídelníček MŠ' : 'Školní jídelna']])}
${pageHead(isMs ? 'Jídelníček mateřské školy' : 'Školní jídelna', isMs ? 'Co děti ve školce jedí tento týden, ceny stravného a jak odhlásit oběd.' : 'Jídelníček na aktuální i příští týden, ceny obědů, platby a odhlašování. Jídelníček zadává vedoucí jídelny přímo v administraci webu – žádné soubory ke stažení.', `<div class="row" style="margin-top:1.2rem"><a class="btn btn-sm" href="#" data-demo="Objednávání a odhlašování obědů – odkaz na jidelna.cz / mobilní aplikaci.">${icon('external')} Objednat / odhlásit oběd</a><a class="btn btn-sm btn-ghost" href="#" data-demo="Tisk jídelníčku.">Tisknout</a><a class="btn btn-sm btn-ghost" href="#alergeny">Seznam alergenů</a></div>`)}
<div class="wrap article-layout">
  <div>
    ${isMs ? msHtml : `<div data-tabs><div class="menu-tabs" style="margin-bottom:1rem"><button type="button" class="is-active" data-tab="w0">Tento týden (${fmtShort(J.weeks[0].from)})</button><button type="button" data-tab="w1">Příští týden (${fmtShort(J.weeks[1].from)})</button><button type="button" data-tab="ms">Mateřská škola</button></div>${J.weeks.map(weekHtml).join('')}<div data-pane="ms" hidden>${msHtml}</div></div>`}
    <div class="section-tight"><div class="grid grid-2">
      <div class="card card-pad"><h3>Výdej obědů</h3><table class="table" style="min-width:0">${info.hours.map((h) => `<tr><td><b>${esc(h.who)}</b></td><td class="mute">${esc(h.time)}</td></tr>`).join('')}</table></div>
      <div class="card card-pad"><h3>Ceník obědů</h3><table class="table" style="min-width:0"><tr><th>Věk</th><th class="num">1 oběd</th><th class="num">Měsíc</th></tr>${info.prices.map((p) => `<tr><td>${esc(p.age)}</td><td class="num">${p.perMeal} Kč</td><td class="num">${p.perMonth} Kč</td></tr>`).join('')}</table></div>
    </div></div>
    <div class="prose"><h2 id="platby">Jak to u nás funguje</h2>${info.intro}<h3>Placení stravného</h3>${info.payment}<h3>Odhlašování obědů</h3>${info.cancel}</div>
    <h2 id="alergeny" style="font-size:var(--step-2);margin-top:2rem">Seznam alergenů</h2>
    <div class="chips">${info.allergens.map((a) => `<span class="chip chip-mute"><b>${a.code}</b>&nbsp;${esc(a.name)}</span>`).join('')}</div>
  </div>
  <aside class="aside">
    <div class="today-box"><h3>Dnes ${fmtShort(today)}</h3><div class="m">${(() => { const d = J.weeks[0].days.find((x) => x.date === today) || J.weeks[0].days[2]; return `<div><i>polévka</i> ${esc(d.soup)}</div><div><i>oběd 1</i> ${esc(d.meal1)}</div><div><i>oběd 2</i> ${esc(d.meal2)}</div>`; })()}</div></div>
    <div class="card card-pad"><h4>Kancelář jídelny</h4><div class="teacher-card"><span class="avatar">JV</span><div><b style="display:block">Jana Veselá</b><span class="small mute" style="display:block">vedoucí školní jídelny</span><div class="contact-lines"><a href="#">${icon('phone')} 2xx xxx xxx</a><br><a href="#">${icon('mail')} jidelna@skola-ukazka.cz</a></div></div></div><p class="small mute" style="margin:.8rem 0 0">Odhlášky SMS: 7xx xxx xxx (do 14:00 předchozího dne)</p></div>
    <div class="card card-pad"><h4>Dokumenty</h4><div class="files">${[{ name: 'Přihláška ke stravování', type: 'pdf', size: '210 kB' }, { name: 'Provozní řád školní jídelny', type: 'pdf', size: '240 kB' }].map(fileItem).join('')}</div></div>
  </aside>
</div>`;
  return layout({ title: isMs ? 'Jídelníček MŠ' : 'Školní jídelna', section, active: isMs ? 'ms-jidelna.html' : '', body });
}

export function afterSchoolPage(D, pic) {
  const d = D.druzina;
  const news = items(D.news_druzina).sort((a, b) => b.date.localeCompare(a.date));
  const gal = items(D.galleries).filter((g) => g.section === 'druzina');
  const body = `
${crumbs([['Úvod', 'index.html'], ['Pro rodiče'], ['Školní družina']])}
<div class="page-head-bg"><div class="wrap page-head"><div class="grid grid-2" style="align-items:center"><div><span class="eyebrow">Pro 1.–4. třídu</span><h1>Školní družina</h1><p class="lead">Ranní i odpolední provoz, každý den vycházka ven, kroužky a spousta akcí. Vše důležité pro rodiče na jedné stránce.</p>
  <div class="row" style="margin-top:1rem"><span class="chip">${icon('clock')} ráno ${esc(d.hours.morning)}</span><span class="chip">${icon('clock')} odpoledne ${esc(d.hours.afternoon)}</span></div></div>
  <div class="card-media" style="border-radius:var(--r-xl);aspect-ratio:4/3">${pic('druzina', 'Děti v družině')}</div></div></div></div>
<div class="wrap">
  <div class="grid grid-3 reveal-stagger">
    <div class="card card-pad"><span class="eyebrow">Vyzvedávání</span><p class="small" style="margin:0 0 .6rem">${esc(d.hours.pickup)}</p><ul class="small" style="margin:0;padding-left:1.1em">${d.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
    <div class="card card-pad"><span class="eyebrow">Platba</span><div class="small">${d.payment}</div></div>
    <div class="card card-pad"><span class="eyebrow">Kontakt</span><div class="teacher-card"><span class="avatar">${initials(d.departments[0].teacher)}</span><div><b style="display:block">${esc(d.departments[0].teacher)}</b><span class="small mute" style="display:block">vedoucí vychovatelka</span><div class="contact-lines"><a href="#">${icon('phone')} 7xx xxx xxx</a></div></div></div><a class="btn btn-sm btn-soft" style="margin-top:.8rem" href="#" data-demo="Přihláška do družiny – bude jako formulář v ostré verzi.">Přihláška do ŠD</a></div>
  </div>
  <div class="section-tight"><div class="section-head"><h2 style="font-size:var(--step-2)">Oddělení</h2></div>
    <div class="table-wrap"><table class="table"><thead><tr><th>Oddělení</th><th>Vychovatel/ka</th><th>Třídy</th><th>Místnost</th></tr></thead><tbody>${d.departments.map((x) => `<tr><td><b>${esc(x.name)}</b></td><td>${esc(x.teacher)}</td><td>${esc(x.classes)}</td><td class="mute">${esc(x.room)}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="section-tight grid grid-2">
    <div><div class="section-head"><h2 style="font-size:var(--step-2)">Zprávy z družiny</h2><a class="btn btn-sm btn-ghost" href="aktuality.html">Vše</a></div><div class="news-list reveal-stagger">${news.slice(0, 4).map((n) => { const p = dateParts(n.date); return `<article class="card card-hover news-row"><div class="date"><b>${p.d}</b><span>${p.m}</span></div><div><h3><a href="aktualita-druzina-${n.slug}.html">${esc(n.title)}</a></h3><p>${esc(n.excerpt)}</p></div></article>`; }).join('')}</div></div>
    <div><div class="section-head"><h2 style="font-size:var(--step-2)">Kroužky v družině</h2></div><div class="table-wrap"><table class="table" style="min-width:0"><thead><tr><th>Kroužek</th><th>Den</th><th>Čas</th><th>Vede</th></tr></thead><tbody>${d.clubs.map((c) => `<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.day)}</td><td class="mute">${esc(c.time)}</td><td class="mute">${esc(c.lector)}</td></tr>`).join('')}</tbody></table></div></div>
  </div>
  <div class="section-tight"><div class="section-head"><h2 style="font-size:var(--step-2)">Celoroční plán</h2></div><div class="grid grid-3 reveal-stagger">${d.plan.map((p) => `<div class="card card-pad"><b style="font-family:var(--font-display);color:var(--primary)">${esc(p.months)}</b><ul class="small" style="margin:.5rem 0 0;padding-left:1.1em">${p.activities.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>`).join('')}</div></div>
  <div class="section-tight"><div class="section-head"><h2 style="font-size:var(--step-2)">Fotogalerie družiny</h2><a class="btn btn-sm btn-ghost" href="fotogalerie.html">Všechny</a></div><div class="grid grid-4 reveal-stagger">${gal.map((g, i) => `<a class="card card-hover album link" href="galerie.html"><div class="card-media">${pic(`gallery-${i + 3}`, '')}<span class="count">${icon('camera')} ${g.count}</span></div><div class="card-pad"><h3>${esc(g.title)}</h3><small>${fmtDate(g.date)}</small></div></a>`).join('')}</div></div>
</div>`;
  return layout({ title: 'Školní družina', body });
}

export function clubsPage(D, pic, { section = 'zs' } = {}) {
  const isMs = section === 'ms';
  const list = isMs ? items(D.krouzky_ms).map((k) => ({ ...k, category: 'ostatni', grades: k.ages, registrationOpen: true })) : items(D.krouzky_zs);
  const cats = [['sport', 'Sport'], ['umeni', 'Umění'], ['veda', 'Věda a technika'], ['jazyky', 'Jazyky'], ['ostatni', 'Ostatní']];
  const days = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek'];
  const body = `
${crumbs([['Úvod', isMs ? 'ms-index.html' : 'index.html'], [isMs ? 'Kroužky MŠ' : 'Kroužky']])}
${pageHead(isMs ? 'Kroužky v mateřské škole' : 'Zájmové kroužky 2026/2027', isMs ? 'Odpolední aktivity pro děti ve školce. Přihlášky vyřizuje třídní učitelka.' : 'Přehled všech kroužků s dny, časy, cenou a volnými místy. Přihlásit dítě lze online – kapacita se aktualizuje automaticky.', `<div class="row" style="margin-top:1.2rem"><a class="btn btn-sm" href="#" data-demo="Online přihláška na kroužek – v ostré verzi formulář s výběrem kroužku.">${icon('edit')} Přihlásit dítě</a><a class="btn btn-sm btn-ghost" href="#" data-demo="Tisk přehledu kroužků.">Tisknout přehled</a></div>`)}
<div class="wrap">
  ${isMs ? '' : `<div class="row between reveal" style="margin-bottom:1.2rem"><div class="filters" data-filters="#clubs"><button class="filter is-active" data-filter="all">Vše</button>${cats.map(([k, l]) => `<button class="filter" data-filter="${k}">${l}</button>`).join('')}</div><div class="filters" data-filters="#clubs">${days.map((d) => `<button class="filter" data-filter="${d}">${d.slice(0, 2)}</button>`).join('')}</div></div>`}
  <div class="grid grid-3 reveal-stagger" id="clubs">
    ${list.map((k) => { const pct = Math.round((1 - k.free / k.capacity) * 100); return `<article class="card card-pad club cat-${k.category}" data-cat="${k.category} ${k.day}"><div class="top"><h3>${esc(k.name)}</h3><span class="chip cat">${cats.find((c) => c[0] === k.category)?.[1] || ''}</span></div><p class="small mute" style="margin:0">${esc(k.description)}</p><div class="facts"><span><b>${esc(k.day)}</b> ${esc(k.time)}</span><span>${esc(k.grades)}</span><span>${esc(k.lector)}</span><span class="mute">${esc(k.place)}</span></div><div class="foot"><span class="price">${k.price} Kč<span class="small mute" style="font-weight:400"> / pololetí</span></span>${k.free > 0 ? `<span class="cap"><i><b style="width:${pct}%;${pct > 80 ? 'background:var(--warn)' : ''}"></b></i>${k.free} volných</span>` : '<span class="chip chip-danger">obsazeno</span>'}</div>${k.registrationOpen && k.free > 0 ? `<a class="btn btn-sm btn-soft" href="#" data-demo="Přihláška na kroužek „${esc(k.name)}“ – v ostré verzi online formulář.">Přihlásit ${icon('arrow')}</a>` : ''}</article>`; }).join('')}
    <p data-empty class="mute" style="display:none;grid-column:1/-1">Žádný kroužek neodpovídá filtru.</p>
  </div>
  <div class="section-tight"><div class="card card-pad grid grid-2" style="align-items:center"><div><h3>Jak přihlašování funguje</h3><p class="small mute" style="margin:0">Rodič vyplní krátký formulář, dostane potvrzení e-mailem a kroužek se mu zobrazí na třídní stránce. Vedoucí kroužku vidí přihlášky v administraci, kapacita se hlídá sama. Platba převodem s variabilním symbolem, který přijde v potvrzení.</p></div><div class="steps" style="grid-template-columns:1fr 1fr">${['Vyberete kroužek', 'Vyplníte přihlášku', 'Přijde potvrzení', 'Zaplatíte převodem'].map((s) => `<div class="card step" style="padding:1rem"><h3 style="font-size:.92rem">${s}</h3></div>`).join('')}</div></div></div>
</div>`;
  return layout({ title: isMs ? 'Kroužky MŠ' : 'Kroužky', section, active: isMs ? 'ms-krouzky.html' : '', body });
}

export function enrolmentPage(D, pic, { section = 'zs' } = {}) {
  const isMs = section === 'ms';
  const z = D.zapis;
  const ev = items(D.events).filter((e) => e.type === 'zapis');
  const body = `
${crumbs([['Úvod', isMs ? 'ms-index.html' : 'index.html'], [isMs ? 'Zápis do MŠ' : 'Zápis do 1. třídy']])}
<div class="page-head-bg"><div class="wrap page-head"><div class="grid grid-2" style="align-items:center"><div><span class="eyebrow">Školní rok 2027/2028</span><h1>${isMs ? 'Zápis do mateřské školy' : 'Zápis do 1. třídy'}</h1><p class="lead">${isMs ? 'Vše k zápisu do MŠ: termíny, kritéria přijetí, dokumenty a odpovědi na časté otázky.' : 'Termíny, co vzít s sebou, kritéria přijetí a odpovědi na nejčastější otázky rodičů budoucích prvňáčků. Přihlášku vyplníte online.'}</p>
  <div class="hero-actions"><a class="btn btn-lg btn-accent" href="#" data-demo="Online zápis – propojení na systém zápisů (zapisyonline.cz).">${icon('edit')} Online přihláška</a><a class="btn btn-lg btn-ghost" href="#faq">Časté otázky</a></div></div>
  <div class="card card-pad" style="background:var(--text);color:var(--bg)"><span class="eyebrow" style="color:var(--accent)">Termíny zápisu</span>${ev.filter((e) => e.title.startsWith('Zápis') && (isMs ? e.title.includes('mateř') : !e.title.includes('mateř'))).concat(ev.filter((e) => e.title.startsWith('Den'))).slice(0, 2).map((e) => `<div style="padding:.6rem 0;border-top:1px solid rgb(255 255 255/.12)"><b style="font-family:var(--font-display);font-size:1.2rem">${fmtDate(e.start)}${e.end !== e.start ? ' – ' + fmtDate(e.end) : ''}</b><br><span class="small" style="opacity:.8">${e.time || 'celý den'} · ${esc(e.place)}</span></div>`).join('')}<p class="small" style="opacity:.75;margin:.8rem 0 0">Náhradní termín po domluvě s kanceláří školy.</p></div></div></div></div>
<div class="wrap">
  <div class="section-tight"><div class="section-head"><h2 style="font-size:var(--step-2)">Jak zápis probíhá</h2></div><div class="steps reveal-stagger">${z.steps.map((s) => `<div class="card step"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div></div>
  <div class="section-tight article-layout">
    <div><h2 id="faq" style="font-size:var(--step-2)">Časté otázky rodičů</h2>${(isMs ? z.msFaq : z.faq).map((f, i) => `<details class="acc" ${i === 0 ? 'open' : ''}><summary>${esc(f.q)}</summary><div class="body">${f.answer}</div></details>`).join('')}
      ${isMs ? '' : `<h2 style="font-size:var(--step-2);margin-top:2.5rem">Co by mělo dítě znát před nástupem</h2><div class="grid grid-2">${z.skills.map((s) => `<div class="row" style="gap:.6rem;align-items:flex-start"><span class="chip chip-ok" style="padding:.3rem">${icon('check')}</span><span class="small">${esc(s)}</span></div>`).join('')}</div>`}
    </div>
    <aside class="aside"><div class="card card-pad"><h4>Dokumenty ke stažení</h4><div class="files">${z.documents.map(fileItem).join('')}</div></div>
      <div class="card card-pad"><h4>Kontakt pro zápis</h4><div class="teacher-card"><span class="avatar">KŠ</span><div><b>Kancelář školy</b><div class="contact-lines"><a href="#">${icon('phone')} 2xx xxx xxx</a><br><a href="#">${icon('mail')} zapis@skola-ukazka.cz</a></div></div></div></div>
      <div class="card card-pad" style="background:var(--accent-soft);border-color:transparent"><h4>Den otevřených dveří</h4><p class="small" style="margin:0 0 .6rem">${(() => { const o = items(D.events).find((e) => e.title.startsWith('Den otevřených dveří pro')) || items(D.events).find((e) => e.title.startsWith('Den otevřených')); return `${fmtDate(o.start)}, ${o.time} – ${esc(o.description)}`; })()}</p><a class="btn btn-sm btn-accent" href="kalendar.html">Do kalendáře</a></div></aside>
  </div>
</div>`;
  return layout({ title: isMs ? 'Zápis do MŠ' : 'Zápis do 1. třídy', section, active: isMs ? 'ms-zapis.html' : '', body });
}
