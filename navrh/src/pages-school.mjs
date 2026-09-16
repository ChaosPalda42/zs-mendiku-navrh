import { layout, icon, esc, fmtDate, fmtShort, items, slug, crumbs, pageHead, fileItem, initials } from './lib.mjs';

export function aboutPage(D, pic) {
  const a = D.about;
  const body = `
${crumbs([['Úvod', 'index.html'], ['O škole']])}
<div class="page-head-bg"><div class="wrap page-head"><div class="grid grid-2" style="align-items:center"><div><span class="eyebrow">Od roku 1930</span><h1>O naší škole</h1><div class="lead">${a.intro}</div></div><div class="card-media" style="border-radius:var(--r-xl);aspect-ratio:4/3">${pic('about-1', 'Budova školy')}</div></div></div></div>
<div class="wrap">
  <div class="stats reveal-stagger">${a.numbers.map((n) => `<div class="card stat"><b data-count>${esc(n.value)}</b><span>${esc(n.label)}</span></div>`).join('')}</div>
  <div class="section-tight"><div class="section-head"><h2 style="font-size:var(--step-2)">Na čem nám záleží</h2></div><div class="grid grid-4 reveal-stagger">${a.values.map((v) => `<div class="card value"><span class="ico">${icon(v.icon)}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join('')}</div></div>
  <div class="section-tight grid grid-2" style="gap:3rem">
    <div class="reveal"><h2 id="historie" style="font-size:var(--step-2)">Historie školy</h2><div class="timeline">${a.timeline.map((t) => `<div class="tl"><b>${esc(t.year)}</b><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div>`).join('')}</div></div>
    <div class="stack">
      <div class="card card-pad reveal" id="jazyky"><span class="eyebrow">Výuka jazyků</span><table class="table" style="min-width:0">${a.languages.map((l) => `<tr><td><b>${esc(l.grade)}</b></td><td class="mute small">${esc(l.text)}</td></tr>`).join('')}</table></div>
      <div class="card card-pad reveal" id="pobyty"><span class="eyebrow">Školy v přírodě a pobyty</span>${a.stays.map((s) => `<p class="small" style="margin:.4rem 0"><b>${esc(s.title)}</b> – ${esc(s.text)}</p>`).join('')}</div>
      <div class="card card-pad reveal" id="ekoskola"><span class="eyebrow">Ekoškola a žákovský parlament</span><p class="small" style="margin:0" id="parlament">Jsme držiteli mezinárodního titulu Ekoškola. Ekotým žáků a žákovský parlament mají vlastní stránky se zprávami a fotkami – v novém webu fungují stejně jako třídní stránky.</p><div class="row" style="margin-top:.8rem"><a class="btn btn-sm btn-soft" href="trida-4-a.html">Ukázka stránky skupiny</a></div></div>
      <div class="card card-pad reveal"><span class="eyebrow">Virtuální prohlídka</span><div class="card-media" style="border-radius:var(--r);aspect-ratio:16/9;display:grid;place-items:center">${pic('about-2', 'Prohlídka školy')}<a href="#" class="btn btn-white" style="position:absolute" data-demo="Virtuální prohlídka (Matterport) – vloží se v ostré verzi.">${icon('play')} Spustit prohlídku</a></div></div>
    </div>
  </div>
  <div class="section-tight grid grid-2">
    <div class="card card-pad reveal" id="gdpr"><h2 style="font-size:var(--step-1)">Ochrana osobních údajů</h2><p class="small mute">Pověřenec pro ochranu osobních údajů: <b>Mgr. Jana Vzorová</b>, poverenec@skola-ukazka.cz, 2xx xxx xxx.</p><div class="files">${[{ name: 'Informace pro zákonné zástupce', type: 'pdf', size: '160 kB' }, { name: 'Informovaný souhlas – fotografie', type: 'pdf', size: '95 kB' }].map(fileItem).join('')}</div></div>
    <div class="card card-pad reveal" id="pristupnost"><h2 style="font-size:var(--step-1)">Prohlášení o přístupnosti</h2><p class="small mute" style="margin:0">Web je navržen v souladu se zákonem č. 99/2019 Sb. a standardem WCAG 2.1 AA: ovládání klávesnicí, dostatečný kontrast, textové alternativy, responzivní zobrazení a možnost zvětšení písma. Prohlášení bude doplněno při spuštění.</p></div>
  </div>
</div>`;
  return layout({ title: 'O škole', body });
}

export function peoplePage(D) {
  const p = items(D.people), cl = items(D.classes).filter((c) => c.level !== 'ms');
  const groups = [...new Set(p.map((x) => x.group))];
  const body = `
${crumbs([['Úvod', 'index.html'], ['O škole'], ['Lidé ve škole']])}
${pageHead('Lidé ve škole', 'Vedení, poradenské pracoviště, třídní i netřídní učitelé, družina a provoz. Kontakty se aktualizují přímo v administraci – každý učitel může upravit svůj profil.', `<div class="row" style="margin-top:1rem"><button class="btn btn-sm btn-ghost" type="button" data-search-open>${icon('search')} Hledat osobu</button></div>`)}
<div class="wrap">
  <div class="filters reveal" style="margin-bottom:1.4rem" data-filters="#people"><button class="filter is-active" data-filter="all">Všichni</button>${groups.map((g) => `<button class="filter" data-filter="${slug(g)}">${g}</button>`).join('')}<button class="filter" data-filter="tridni">Třídní učitelé</button></div>
  <div id="people">
    <div class="grid grid-3 reveal-stagger">
    ${p.map((x) => `<div class="card person" data-cat="${slug(x.group)}"><span class="avatar">${initials(x.name)}</span><div><b>${esc(x.name)}</b><span>${esc(x.role)}</span>${x.note ? `<span class="small">${esc(x.note)}</span>` : ''}<div class="cl">${x.email ? `<a href="#" data-demo="E-mail – v ukázce neaktivní.">${esc(x.email)}</a>` : ''}${x.phone ? `<a href="#">${esc(x.phone)}</a>` : ''}</div></div></div>`).join('')}
    ${cl.map((c) => `<div class="card person" data-cat="tridni"><span class="avatar">${initials(c.teacher)}</span><div><b>${esc(c.teacher)}</b><span>třídní učitel/ka ${c.name}</span><div class="cl"><a href="#">${esc(c.email)}</a><a href="trida-${slug(c.name)}.html">Stránka třídy →</a></div></div></div>`).join('')}
    </div>
  </div>
</div>`;
  return layout({ title: 'Lidé ve škole', body });
}

export function boardPage(D) {
  const docs = items(D.documents);
  const cats = [...new Set(docs.map((d) => d.category))];
  const body = `
${crumbs([['Úvod', 'index.html'], ['O škole'], ['Úřední deska']])}
${pageHead('Elektronická úřední deska', 'Oficiální dokumenty školy s datem vyvěšení a platností: školní vzdělávací programy, řády, výroční zprávy, rozpočet a povinně zveřejňované informace podle zákona č. 106/1999 Sb.', `<div class="row" style="margin-top:1rem"><span class="chip chip-ok">${icon('check')} Aktuálně vyvěšeno: ${docs.filter((d) => !d.expires || d.expires > '2026-09-16').length} dokumentů</span><span class="chip chip-mute">Archiv sejmutých dokumentů se uchovává</span></div>`)}
<div class="wrap article-layout">
  <div>
    <div class="filters reveal" style="margin-bottom:1.2rem" data-filters="#docs"><button class="filter is-active" data-filter="all">Vše</button>${cats.map((c) => `<button class="filter" data-filter="${slug(c)}">${c}</button>`).join('')}</div>
    <div id="docs">
    ${cats.map((c) => `<div class="reveal" data-cat="${slug(c)}" style="margin-bottom:2rem"><h2 style="font-size:var(--step-1)" id="${slug(c)}">${c}</h2><div class="table-wrap"><table class="table"><thead><tr><th>Dokument</th><th>Vyvěšeno</th><th>Platnost</th><th></th></tr></thead><tbody>${docs.filter((d) => d.category === c).map((d) => `<tr><td><b>${esc(d.title)}</b>${d.note ? `<br><span class="small mute">${esc(d.note)}</span>` : ''}</td><td class="mute" style="white-space:nowrap">${fmtShort(d.published)} ${d.published.slice(0, 4)}</td><td class="mute small">${d.validFrom ? esc(d.validFrom) : '—'}${d.expires ? `<br>sejmutí ${fmtShort(d.expires)} ${d.expires.slice(0, 4)}` : ''}</td><td><a class="btn btn-sm btn-soft" href="#" data-demo="Stažení „${esc(d.title)}“ – v ukázce neaktivní.">${icon('download')} ${d.type.toUpperCase()} · ${d.size}</a></td></tr>`).join('')}</tbody></table></div></div>`).join('')}
    </div>
  </div>
  <aside class="aside">
    <div class="card card-pad"><h4>Povinně zveřejňované informace</h4><p class="small mute">Podle zákona č. 106/1999 Sb. a vyhlášky č. 515/2020 Sb. zveřejňujeme v předepsané struktuře:</p><ol class="small" style="padding-left:1.2em;margin:0">${['Název', 'Důvod a způsob založení', 'Organizační struktura', 'Kontaktní spojení', 'Případné platby', 'IČ', 'DIČ', 'Dokumenty', 'Žádosti o informace', 'Příjem podání a podnětů', 'Předpisy', 'Úhrady za poskytování informací', 'Licenční smlouvy', 'Výroční zpráva podle zákona o svobodném přístupu k informacím'].map((s) => `<li>${s}</li>`).join('')}</ol></div>
    <div class="card card-pad" style="background:var(--primary-soft);border-color:transparent"><h4>Jak deska funguje v administraci</h4><p class="small" style="margin:0">Dokument se nahraje, zařadí do kategorie, nastaví se datum vyvěšení a sejmutí. Po sejmutí zůstává v archivu s historií – to je důležité pro kontrolu ze strany zřizovatele.</p></div>
  </aside>
</div>`;
  return layout({ title: 'Úřední deska', body });
}

export function projectsPage(D, pic) {
  const pr = items(D.projekty);
  const body = `
${crumbs([['Úvod', 'index.html'], ['Život školy'], ['Projekty']])}
${pageHead('Projekty a projektové vyučování', 'Několikrát ročně probíhá celoškolní projektové vyučování. Tady najdete, co se dětem povedlo – a co právě připravujeme. Mezinárodní projekty Erasmus+ a program Ekoškola mají vlastní sekce.')}
<div class="wrap">
  <div class="filters reveal" style="margin-bottom:1.2rem" data-filters="#projects"><button class="filter is-active" data-filter="all">Vše</button><button class="filter" data-filter="probiha">Probíhá</button><button class="filter" data-filter="pripravujeme">Připravujeme</button><button class="filter" data-filter="ukoncen">Ukončené</button></div>
  <div class="news-grid reveal-stagger" id="projects">${pr.map((p, i) => `<article class="card card-hover link news-card" data-cat="${slug(p.status)}"><div class="card-media">${pic(`projekt-${(i % 4) + 1}`, '')}<span class="chip ${p.status === 'probíhá' ? 'chip-ok' : p.status === 'připravujeme' ? 'chip-accent' : 'chip-mute'}">${p.status}</span></div><div class="card-pad"><div class="meta"><span>${esc(p.year)}</span><span>·</span><span>${esc(p.grades)}</span></div><h3><a href="projekt-${p.slug}.html">${esc(p.title)}</a></h3><p>${esc(p.summary)}</p><div class="chips">${p.tags.map((t) => `<span class="chip chip-mute">${esc(t)}</span>`).join('')}</div></div></article>`).join('')}</div>
  <div class="section-tight grid grid-2">
    <div class="band reveal"><div class="deco"></div><span class="eyebrow" style="color:#fff">Erasmus+</span><h2 style="font-size:var(--step-2)">Mezinárodní projekty</h2><p>Výměny žáků, přípravné cesty učitelů a reportáže přímo z cest – vše na jednom místě včetně fotogalerií.</p><a class="btn btn-white btn-sm" href="aktuality.html">Reportáže z cest ${icon('arrow')}</a></div>
    <div class="band dark reveal"><div class="deco"></div><span class="eyebrow" style="color:#fff">Dotace a publicita</span><h2 style="font-size:var(--step-2)">Projekty EU a NPO</h2><p>Národní plán obnovy, Šablony, doučování – včetně povinné publicity ke stažení.</p><a class="btn btn-white btn-sm" href="uredni-deska.html">Dokumenty ${icon('arrow')}</a></div>
  </div>
</div>`;
  return layout({ title: 'Projekty', body });
}

export function projectPage(D, pic, p, i) {
  const body = `
${crumbs([['Úvod', 'index.html'], ['Projekty', 'projekty.html'], [p.title]])}
<div class="wrap article-head reveal is-in"><div class="chips" style="margin-bottom:1rem"><span class="chip ${p.status === 'probíhá' ? 'chip-ok' : 'chip-mute'}">${p.status}</span>${p.tags.map((t) => `<span class="chip chip-mute">${esc(t)}</span>`).join('')}</div><h1>${esc(p.title)}</h1><div class="article-meta"><span>${esc(p.year)}</span><span>·</span><span>${esc(p.grades)}</span>${p.partner ? `<span>·</span><span>partner: ${esc(p.partner)}</span>` : ''}</div></div>
<div class="wrap article-layout"><article><div class="card-media" style="border-radius:var(--r-lg);aspect-ratio:21/9;margin-bottom:1.8rem">${pic(`projekt-${(i % 4) + 1}`, '')}</div><div class="prose"><p class="lead">${esc(p.summary)}</p>${p.body}</div>
<h3 style="margin-top:2rem">Fotografie z projektu</h3><div class="gallery-grid" data-lightbox>${[1, 2, 3, 4].map((k) => `<a href="${pic.src(`gallery-${((i + k) % 12) + 1}`)}" data-cap="${esc(p.title)}">${pic(`gallery-${((i + k) % 12) + 1}`, '')}</a>`).join('')}</div></article>
<aside class="aside"><div class="card card-pad"><h4>Další projekty</h4><ul>${items(D.projekty).filter((x) => x !== p).slice(0, 5).map((x) => `<li><a href="projekt-${x.slug}.html">${esc(x.title)}<small>${esc(x.year)}</small></a></li>`).join('')}</ul></div></aside></div>`;
  return layout({ title: p.title, body });
}

export function galleryListPage(D, pic, { section = 'zs' } = {}) {
  const isMs = section === 'ms';
  const gal = items(D.galleries).filter((g) => isMs ? g.section === 'ms' : g.section !== 'ms');
  const years = [...new Set(gal.map((g) => g.year))].sort().reverse();
  const body = `
${crumbs([['Úvod', isMs ? 'ms-index.html' : 'index.html'], ['Fotogalerie']])}
${pageHead(isMs ? 'Fotogalerie MŠ' : 'Fotogalerie', 'Fotky z akcí, výletů, projektů a družiny řazené podle školních roků. Fotky se nahrávají hromadně v administraci a web si sám vyrobí náhledy – načítá se rychle i na mobilu.')}
<div class="wrap">
  <div class="row between reveal" style="margin-bottom:1.2rem"><div class="filters" data-filters="#gal">${isMs ? '' : `<button class="filter is-active" data-filter="all">Vše</button><button class="filter" data-filter="zs">Škola</button><button class="filter" data-filter="druzina">Družina</button><button class="filter" data-filter="trida">Třídy (chráněné)</button>`}</div><div class="filters">${years.map((y, i) => `<a class="filter ${i === 0 ? 'is-active' : ''}" href="#rok-${y.replace('/', '-')}">${y}</a>`).join('')}</div></div>
  <div id="gal">${years.map((y) => `<div style="margin-bottom:2rem" id="rok-${y.replace('/', '-')}"><h2 style="font-size:var(--step-2)">Školní rok ${y}</h2><div class="grid grid-4 reveal-stagger">${gal.filter((g) => g.year === y).map((g, i) => `<a class="card card-hover album link" href="galerie.html" data-cat="${g.section}"><div class="card-media">${pic(`gallery-${((g.slug.length + i) % 12) + 1}`, '')}${g.protected ? `<span class="chip chip-accent">${icon('lock')} rodiče třídy</span>` : ''}<span class="count">${icon('camera')} ${g.count}</span></div><div class="card-pad"><h3>${esc(g.title)}</h3><small>${fmtDate(g.date)}</small></div></a>`).join('')}</div></div>`).join('')}</div>
</div>`;
  return layout({ title: 'Fotogalerie', section, body });
}

export function galleryPage(D, pic) {
  const g = items(D.galleries)[0];
  const body = `
${crumbs([['Úvod', 'index.html'], ['Fotogalerie', 'fotogalerie.html'], [g.title]])}
${pageHead(g.title, g.description, `<div class="row" style="margin-top:.8rem"><span class="chip chip-mute">${fmtDate(g.date)}</span><span class="chip chip-mute">${icon('camera')} ${g.count} fotografií</span><a class="btn btn-sm btn-ghost" href="#" data-demo="Stažení celé galerie jako ZIP.">${icon('download')} Stáhnout vše</a></div>`)}
<div class="wrap"><div class="gallery-grid reveal-stagger" data-lightbox style="grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr))">${Array.from({ length: 12 }, (_, i) => `<a href="${pic.src(`gallery-${i + 1}`)}" data-cap="${esc(g.title)} · ${i + 1}/${g.count}">${pic(`gallery-${i + 1}`, '')}</a>`).join('')}</div>
<p class="mute small center" style="margin-top:1.5rem">Klikněte na fotku – prohlížení šipkami, zavření klávesou Esc. V ostré verzi se načítají další fotky průběžně při rolování.</p></div>`;
  return layout({ title: g.title, body });
}

export function contactPage(D, pic) {
  const p = items(D.people).filter((x) => x.group === 'Vedení školy' || x.group === 'Provoz a administrativa').slice(0, 6);
  const body = `
${crumbs([['Úvod', 'index.html'], ['Kontakt']])}
${pageHead('Kontakt', 'Kancelář školy, vedení, jídelna a družina. Nebo nám napište přes formulář – odpovíme do dvou pracovních dnů.')}
<div class="wrap grid grid-2" style="gap:2.5rem;align-items:start">
  <div class="stack">
    <div class="card card-pad reveal"><h3>ZŠ a MŠ Mendíků</h3><p class="mute">Ukázková 123/4<br>140 00 Praha 4 – Michle</p><div class="grid grid-2"><div><span class="small mute">Telefon</span><br><b>2xx xxx xxx</b></div><div><span class="small mute">E-mail</span><br><b>skola@skola-ukazka.cz</b></div><div><span class="small mute">IČ</span><br><b>00000000</b></div><div><span class="small mute">Datová schránka</span><br><b>xxxxxxx</b></div><div><span class="small mute">Bankovní spojení</span><br><b>000000-0000000000/0000</b></div><div><span class="small mute">Úřední hodiny kanceláře</span><br><b>Po–Pá 7:30–15:00</b></div></div></div>
    <div class="card card-pad reveal"><h3>Přímé kontakty</h3><div class="grid grid-2">${p.map((x) => `<div class="person" style="padding:.5rem 0"><span class="avatar sm">${initials(x.name)}</span><div><b>${esc(x.name)}</b><span>${esc(x.role)}</span><div class="cl">${x.phone ? `<a href="#">${esc(x.phone)}</a>` : ''}<a href="#" data-demo="E-mail – v ukázce neaktivní.">${esc(x.email)}</a></div></div></div>`).join('')}</div><a class="btn btn-sm btn-ghost" style="margin-top:.8rem" href="lide.html">Všichni zaměstnanci ${icon('arrow')}</a></div>
    <div class="card reveal" style="overflow:hidden"><div class="card-media" style="aspect-ratio:16/9;border-radius:0">${pic('about-1', 'Mapa')}<div style="position:absolute;inset:0;display:grid;place-items:center"><a class="btn btn-white" href="#" data-demo="Mapa (Mapy.cz) – v ostré verzi interaktivní.">${icon('map')} Otevřít v Mapy.cz</a></div></div><div class="card-pad small mute">Metro C Vyšehrad / tram Michelská · parkování v okolních ulicích omezené</div></div>
  </div>
  <div class="card card-pad reveal"><h3>Napište nám</h3><p class="small mute">Zpráva přijde do kanceláře školy. Nepoužívejte pro omlouvání absencí – k tomu slouží Bakaláři nebo třídní učitel.</p>
    <form class="form" data-demo="Formulář v ukázce nic neodesílá."><div class="two"><div><label>Jméno a příjmení</label><input type="text" placeholder="Jana Nováková"></div><div><label>E-mail</label><input type="email" placeholder="jana@email.cz"></div></div><div class="two"><div><label>Telefon (nepovinné)</label><input type="tel" placeholder="7xx xxx xxx"></div><div><label>Komu</label><select><option>Kancelář školy</option><option>Vedení školy</option><option>Školní jídelna</option><option>Školní družina</option><option>Mateřská škola</option><option>Zápis do 1. třídy</option></select></div></div><div><label>Zpráva</label><textarea placeholder="Dobrý den, …"></textarea></div><div class="row between"><span class="hint">Odesláním souhlasíte se zpracováním údajů pro vyřízení dotazu.</span><button class="btn" type="submit" data-demo="V ukázce se zpráva neodesílá. V ostré verzi přijde e-mailem do kanceláře školy.">${icon('send')} Odeslat zprávu</button></div></form></div>
</div>`;
  return layout({ title: 'Kontakt', active: 'kontakt.html', body });
}

export function notFoundPage() {
  const body = `<div class="wrap section center"><div class="big-404 reveal is-in">404</div><h1>Tady nic není</h1><p class="lead">Stránka neexistuje nebo byla přesunuta. Zkuste vyhledávání nebo se vraťte na úvod.</p><div class="row" style="justify-content:center;margin-top:1.5rem"><a class="btn" href="index.html">Na úvod</a><button class="btn btn-ghost" type="button" data-search-open>${icon('search')} Hledat</button></div><p class="small mute" style="margin-top:2rem">Staré adresy z původního webu budou automaticky přesměrovány na nové stránky.</p></div>`;
  return layout({ title: 'Stránka nenalezena', body });
}
