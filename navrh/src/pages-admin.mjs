import { layout, icon, esc, fmtDate, fmtShort, items, slug, initials } from './lib.mjs';

const adminLayout = ({ title, body, section = 'zs' }) => layout({ title, section, noChrome: true, bodyClass: 'admin', body: `<link rel="stylesheet" href="assets/admin.css">${body}` });

export function adminLoginPage() {
  const body = `
<div class="login">
  <div class="l">
    <a class="brand" href="index.html" style="margin-bottom:2.5rem"><span class="brand-mark">M</span><span>ZŠ a MŠ Mendíků<small>Administrace webu</small></span></a>
    <h1 style="font-size:var(--step-3)">Přihlášení do administrace</h1>
    <p class="lead" style="margin-bottom:1.6rem">Přihlaste se školním účtem Microsoft. Žádné další heslo si pamatovat nemusíte – ověření probíhá v Microsoft Entra ID, oprávnění se řídí na webu.</p>
    <a class="ms-btn" href="admin-index.html">${icon('microsoft')} Přihlásit se účtem Microsoft</a>
    <p class="small mute" style="margin-top:1.4rem">Přístup mají jen účty ze školního tenantu <b>@skola-ukazka.cz</b>, kterým správce přidělil roli. Přihlášení se loguje (kdo, kdy, odkud).</p>
    <div class="row" style="margin-top:2rem"><a class="small" href="index.html">← Zpět na web</a><a class="small" href="#" data-demo="Nápověda pro editory – v ostré verzi.">Nápověda pro editory</a></div>
  </div>
  <div class="r"><div class="blob blob-2" style="opacity:.35"></div>
    <span class="eyebrow" style="color:#fff">Co administrace umí</span><h2 style="font-size:var(--step-3)">Jedno místo pro všechno, co je na webu</h2><p>Každý vidí jen to, co má na starosti: učitel svou třídu, jídelna jídelníček, družina svou sekci, vedení všechno.</p>
    <ul>${['Aktuality s kategoriemi, přílohami, plánovaným zveřejněním a označením „důležité“', 'Kalendář akcí s exportem pro rodiče', 'Třídní stránky – učitel spravuje sám, včetně hesla pro rodiče', 'Hromadné nahrávání fotek, náhledy se vyrobí samy', 'Jídelníček a kroužky jako strukturované tabulky, ne soubory', 'Úřední deska s datem vyvěšení a sejmutí', 'Historie změn – vidíte, kdo co upravil'].map((t) => `<li>${icon('check')}<span>${t}</span></li>`).join('')}</ul>
  </div>
</div>`;
  return adminLayout({ title: 'Přihlášení do administrace', body });
}

export function adminPage(D, pic) {
  const news = items(D.news_zs).sort((a, b) => b.date.localeCompare(a.date));
  const events = items(D.events).sort((a, b) => a.start.localeCompare(b.start)).slice(0, 8);
  const cl = items(D.classes);
  const week = D.jidelnicek.weeks[1];
  const docs = items(D.documents).slice(0, 8);
  const clubs = items(D.krouzky_zs).slice(0, 8);
  const people = items(D.people);
  const NAVI = [
    ['Přehled', 'dashboard', 'layout'], null,
    ['Aktuality', 'aktuality', 'bell', '3 koncepty'], ['Kalendář akcí', 'kalendar', 'calendar'], ['Stránky', 'stranky', 'file'], ['Fotogalerie', 'galerie', 'image'], null,
    ['Třídy', 'tridy', 'users'], ['Jídelníček', 'jidelna', 'utensils'], ['Kroužky', 'krouzky', 'puzzle', '12 přihl.'], ['Družina', 'druzina', 'sunrise'], ['Mateřská škola', 'ms', 'ms'], null,
    ['Úřední deska', 'deska', 'shield'], ['Lidé a kontakty', 'lide', 'users'], ['Uživatelé a role', 'role', 'lock'], ['Nastavení', 'nastaveni', 'settings'],
  ];
  const side = NAVI.map((n) => (n ? `<a href="#${n[1]}" data-admin-nav class="${n[1] === 'dashboard' ? 'is-active' : ''}">${icon(n[2])}${n[0]}${n[3] ? `<span class="badge">${n[3]}</span>` : ''}</a>` : '<h5></h5>')).join('');
  const view = (id, title, sub, inner, actions = '') => `<section data-admin-view="${id}" ${id !== 'dashboard' ? 'hidden' : ''}><div class="adm-top"><div><h1>${title}</h1><p>${sub}</p></div><div class="row">${actions}</div></div>${inner}</section>`;
  const st = (s) => ({ pub: '<span class="st st-pub">zveřejněno</span>', draft: '<span class="st st-draft">koncept</span>', sched: '<span class="st st-sched">naplánováno</span>', exp: '<span class="st st-exp">po platnosti</span>' }[s]);
  const acts = `<span class="acts"><button title="Upravit">${icon('edit')}</button><button title="Zobrazit na webu">${icon('eye')}</button><button title="Smazat">${icon('trash')}</button></span>`;
  const soon = 'V ukázce administrace nic neukládá – jde o návrh rozhraní.';

  const dashboard = `
<div class="kpis">${[['Návštěvy za 7 dní', '4 812', '+12 %'], ['Aktuality tento měsíc', '17', '3 čekají na zveřejnění'], ['Nahrané fotky', '1 240', 'za září'], ['Přihlášky na kroužky', '86', '12 nových']].map(([l, v, s]) => `<div class="card kpi"><span>${l}</span><b>${v}</b><small>${s}</small></div>`).join('')}</div>
<div class="adm-grid">
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Čeká na vás</h3><a class="small" href="#aktuality" data-admin-nav>Vše</a></div><div class="bd" style="padding:0"><table class="adm-table"><tbody>
      <tr><td><b>${esc(news[3].title)}</b><span class="sub">koncept · Mgr. Petra Králová · 4.A</span></td><td>${st('draft')}</td><td>${acts}</td></tr>
      <tr><td><b>Lampionový průvod – informace</b><span class="sub">naplánováno na 2. 10. 2026 7:00 · družina</span></td><td>${st('sched')}</td><td>${acts}</td></tr>
      <tr><td><b>Směrnice o úplatě za ŠD 2025/2026</b><span class="sub">úřední deska · platnost skončila 31. 8.</span></td><td>${st('exp')}</td><td>${acts}</td></tr>
      <tr><td><b>12 nových přihlášek na kroužky</b><span class="sub">Robotika (5), Keramika (4), Florbal (3)</span></td><td><span class="st st-sched">ke schválení</span></td><td>${acts}</td></tr>
    </tbody></table></div></div>
    <div class="adm-card"><div class="hd"><h3>Poslední aktuality</h3><a class="btn btn-sm" href="#editor" data-admin-nav>${icon('plus')} Nová aktualita</a></div><div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th>Název</th><th>Sekce</th><th>Autor</th><th>Stav</th><th></th></tr></thead><tbody>${news.slice(0, 5).map((n, i) => `<tr><td><b>${esc(n.title)}</b><span class="sub">${fmtDate(n.date)} · ${n.category}${n.important ? ' · důležité' : ''}</span></td><td class="mute">ZŠ</td><td class="mute">${['Vedení školy', 'Mgr. Petra Králová', 'Kancelář', 'Družina', 'Mgr. Jan Tichý'][i]}</td><td>${st(i === 4 ? 'draft' : 'pub')}</td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>
  </div>
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Nejbližší akce</h3><a class="small" href="#kalendar" data-admin-nav>Kalendář</a></div><div class="bd"><ul class="log">${events.filter((e) => e.start >= '2026-09-16').slice(0, 5).map((e) => `<li><span class="t">${fmtShort(e.start)}</span><span><b>${esc(e.title)}</b><br><span class="mute small">${e.time || 'celý den'} · ${esc(e.place)}</span></span></li>`).join('')}</ul></div></div>
    <div class="adm-card"><div class="hd"><h3>Historie změn</h3></div><div class="bd"><ul class="log">${[['10:42', 'Jana Veselá', 'upravila jídelníček na 21.–25. 9.'], ['09:15', 'Mgr. Petra Králová', 'nahrála 38 fotek do galerie „Výlet 4.A“'], ['08:30', 'Kancelář školy', 'zveřejnila aktualitu „Třídní schůzky“'], ['včera', 'Mgr. Jan Tichý', 'změnil heslo rodičů třídy 6.B'], ['včera', 'Správce', 'přidal roli Jídelna uživateli Jana Veselá']].map(([t, w, a]) => `<li><span class="t">${t}</span><span><b>${w}</b> ${a}</span></li>`).join('')}</ul></div></div>
    <div class="adm-card"><div class="hd"><h3>Rychlé akce</h3></div><div class="bd row">${[['plus', 'Aktualita', 'editor'], ['calendar', 'Akce', 'kalendar'], ['upload', 'Fotky', 'galerie'], ['utensils', 'Jídelníček', 'jidelna'], ['alert', 'Upozornění na web', 'editor']].map(([i, t, h]) => `<a class="btn btn-sm btn-soft" href="#${h}" data-admin-nav>${icon(i)} ${t}</a>`).join('')}</div></div>
  </div>
</div>`;

  const aktuality = `
<div class="tabs-line"><button class="is-active">Vše (${news.length + 11})</button><button>ZŠ</button><button>MŠ</button><button>Družina</button><button>Třídy</button><button>Koncepty (3)</button><button>Naplánované (1)</button></div>
<div class="adm-card"><div class="hd"><div class="adm-search">${icon('search')} Hledat v aktualitách…</div><div class="row"><button class="btn btn-sm btn-ghost">${icon('filter')} Filtr</button><a class="btn btn-sm" href="#editor" data-admin-nav>${icon('plus')} Nová aktualita</a></div></div>
<div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th style="width:30px"><input type="checkbox"></th><th>Název</th><th>Kategorie</th><th>Sekce</th><th>Autor</th><th>Zveřejnit</th><th>Stav</th><th></th></tr></thead><tbody>${news.map((n, i) => `<tr><td><input type="checkbox"></td><td><b>${esc(n.title)}</b><span class="sub">${n.attachments?.length ? n.attachments.length + ' příloh · ' : ''}${n.hasGallery ? 'galerie · ' : ''}${n.important ? '<span style="color:var(--danger);font-weight:600">důležité · na homepage</span>' : 'běžná'}</span></td><td>${n.category}</td><td class="mute">${i % 5 === 3 ? 'Družina' : 'ZŠ'}</td><td class="mute">${['Vedení školy', 'Mgr. Petra Králová', 'Kancelář', 'Družina', 'Mgr. Jan Tichý'][i % 5]}</td><td class="mute">${fmtShort(n.date)} 2026</td><td>${st(i === 2 ? 'draft' : i === 6 ? 'sched' : 'pub')}</td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>`;

  const editor = `
<div class="editor">
  <div>
    <div class="adm-card"><div class="bd">
      <div class="field field-title"><input type="text" value="Ředitelské volno 16. 11. 2026 – informace pro rodiče"><div class="h">Adresa: zsmendiku.cz/aktuality/<b>reditelske-volno-16-11-2026</b> (upraví se sama)</div></div>
      <div class="field"><label>Perex (zobrazuje se v přehledu a na úvodní stránce)</label><textarea style="min-height:70px">Ve středu 16. 11. 2026 vyhlašuje ředitelka školy z organizačních důvodů ředitelské volno. Škola, družina i jídelna budou zavřené.</textarea></div>
      <div class="field"><label>Text</label><div class="rte"><div class="tb">${['B', 'I', 'U', '|', 'H2', 'H3', '|', '•', '1.', '|', '🔗', '🖼', '📎', '📊', '|', '❝', '↶', '↷'].map((b) => (b === '|' ? '<i></i>' : `<button type="button" data-demo="${soon}">${b}</button>`)).join('')}</div><div class="body" contenteditable="true"><p>Vážení rodiče,</p><p>na základě § 24 odst. 2 školského zákona vyhlašuji ve středu <strong>16. listopadu 2026</strong> ředitelské volno z organizačních a technických důvodů (výměna rozvodů vody v hlavní budově).</p><p>V tento den <strong>neprobíhá výuka, není v provozu školní družina ani školní jídelna</strong>. Obědy jsou všem strávníkům automaticky odhlášeny.</p><p>Děkujeme za pochopení.</p><p>Mgr. Anna Vzorová, ředitelka školy</p></div></div></div>
      <div class="field"><label>Přílohy</label><div class="dropzone">${icon('upload')}Přetáhněte soubory sem nebo <b>vyberte z počítače</b><br><span class="small">PDF, DOCX, XLSX · max. 20 MB · web je převede na odkaz s velikostí</span></div><div class="files" style="margin-top:.8rem"><a class="file" href="#"><span class="ft pdf">PDF</span><span><b>Rozhodnutí o ředitelském volnu.pdf</b><small>PDF · 120 kB</small></span>${icon('x')}</a></div></div>
      <div class="field"><label>Fotogalerie k aktualitě</label><select><option>— žádná —</option><option>Vybrat existující galerii…</option><option>Vytvořit novou galerii</option></select></div>
    </div></div>
  </div>
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Zveřejnění</h3>${st('draft')}</div><div class="bd">
      <div class="field"><label>Stav</label><select><option>Koncept</option><option>Zveřejnit hned</option><option>Naplánovat zveřejnění</option></select></div>
      <div class="field"><label>Zveřejnit od</label><input type="datetime-local" value="2026-09-17T07:00"></div>
      <div class="field"><label>Zobrazovat do (volitelné)</label><input type="date" value="2026-11-16"><div class="h">Po tomto datu se aktualita přesune do archivu.</div></div>
      <div class="row" style="margin-top:.5rem"><button class="btn" data-demo="${soon}">${icon('check')} Uložit a zveřejnit</button><button class="btn btn-ghost btn-sm" data-demo="${soon}">Náhled</button></div>
    </div></div>
    <div class="adm-card"><div class="hd"><h3>Zařazení</h3></div><div class="bd">
      <div class="field"><label>Sekce</label><select><option>Základní škola</option><option>Mateřská škola</option><option>Družina</option><option>Třída 4.A</option></select></div>
      <div class="field"><label>Kategorie</label><select><option>Důležité</option><option>Pro rodiče</option><option>Akce</option><option>Projekty</option><option>Úspěchy žáků</option><option>Erasmus+</option></select></div>
      <div class="field"><label>Autor / kontakt</label><select><option>Vedení školy</option><option>Kancelář školy</option><option>Mgr. Anna Vzorová</option></select></div>
      <div class="toggle"><span><b>Důležité</b><br><span class="mute small">červené označení, nahoře v přehledu</span></span><span class="sw on"></span></div>
      <div class="toggle"><span><b>Kritické upozornění</b><br><span class="mute small">lišta na úvodní stránce</span></span><span class="sw on"></span></div>
      <div class="toggle"><span><b>Poslat e-mailem odběratelům</b><br><span class="mute small">rodiče přihlášení k odběru</span></span><span class="sw"></span></div>
      <div class="toggle"><span><b>Přidat do kalendáře</b><br><span class="mute small">vytvoří událost 16. 11.</span></span><span class="sw on"></span></div>
    </div></div>
    <div class="adm-card"><div class="hd"><h3>Náhled na webu</h3></div><div class="bd"><div class="prev-frame"><div class="bar"><i></i><i></i><i></i></div><div style="padding:.8rem"><div class="alert-bar" style="border-radius:8px;font-size:.72rem"><div style="display:flex;gap:.5rem;align-items:center;padding:.4rem .6rem">${icon('alert')}<span><b>Ředitelské volno 16. 11.</b> · škola, družina i jídelna zavřené</span></div></div><div class="notice" style="margin-top:.6rem;padding:.6rem .8rem;font-size:.72rem">${icon('alert')}<div><b>Ředitelské volno 16. 11. 2026</b><p style="font-size:.7rem">Ve středu 16. 11. vyhlašuje ředitelka…</p></div></div></div></div></div></div>
  </div>
</div>`;

  const kalendar = `
<div class="adm-grid">
  <div class="adm-card"><div class="hd"><div class="tabs-line" style="margin:0;border:0"><button class="is-active">Seznam</button><button>Měsíc</button><button>Školní rok</button></div><button class="btn btn-sm" data-demo="${soon}">${icon('plus')} Nová událost</button></div>
  <div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th>Datum</th><th>Událost</th><th>Typ</th><th>Pro koho</th><th>Web</th><th></th></tr></thead><tbody>${events.map((e) => `<tr><td style="white-space:nowrap"><b>${fmtShort(e.start)}</b>${e.end !== e.start ? ' – ' + fmtShort(e.end) : ''}<span class="sub">${e.time || 'celý den'}</span></td><td><b>${esc(e.title)}</b><span class="sub">${esc(e.place)}</span></td><td><span class="cal-ev ${e.type}" style="display:inline-block">${e.type}</span></td><td class="mute">${e.audience}</td><td>${st('pub')}</td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Upravit událost</h3></div><div class="bd">
      <div class="field"><label>Název</label><input type="text" value="${esc(events[0].title)}"></div>
      <div class="two grid grid-2"><div class="field"><label>Od</label><input type="date" value="${events[0].start}"></div><div class="field"><label>Do</label><input type="date" value="${events[0].end}"></div></div>
      <div class="two grid grid-2"><div class="field"><label>Čas</label><input type="text" value="${events[0].time}"></div><div class="field"><label>Typ</label><select><option>schůzky</option><option>akce</option><option>prázdniny</option><option>ředitelské volno</option><option>výlet</option><option>zápis</option><option>MŠ</option><option>družina</option></select></div></div>
      <div class="field"><label>Místo</label><input type="text" value="${esc(events[0].place)}"></div>
      <div class="field"><label>Pro koho</label><input type="text" value="${esc(events[0].audience)}"><div class="h">Rodiče si při odběru kalendáře vyberou jen svou třídu / stupeň.</div></div>
      <div class="toggle"><span><b>Zobrazit na úvodní stránce</b></span><span class="sw on"></span></div>
      <div class="toggle"><span><b>Vytvořit i aktualitu</b></span><span class="sw"></span></div>
      <div class="row" style="margin-top:.8rem"><button class="btn btn-sm" data-demo="${soon}">Uložit</button></div>
    </div></div>
    <div class="adm-card"><div class="hd"><h3>Import</h3></div><div class="bd small mute">Termíny prázdnin MŠMT lze naimportovat z připraveného souboru pro každý školní rok. Export pro rodiče: veřejný iCal odkaz + tlačítka Google / Apple / Outlook.</div></div>
  </div>
</div>`;

  const galerie = `
<div class="adm-grid">
  <div class="adm-card"><div class="hd"><h3>Nová galerie: Poznávací zájezd Praha – Brno – Vídeň</h3>${st('draft')}</div><div class="bd">
    <div class="grid grid-2"><div class="field"><label>Název</label><input type="text" value="Poznávací zájezd Praha – Brno – Vídeň"></div><div class="field"><label>Zařadit do</label><select><option>Škola · 2026/2027</option><option>Družina</option><option>Mateřská škola</option><option>Třída 8.A (chráněná)</option></select></div></div>
    <div class="dropzone">${icon('upload')}Přetáhněte fotky sem – klidně 200 najednou<br><span class="small">JPG, PNG, HEIC · web je sám zmenší, otočí a vyrobí náhledy · originály zůstanou uložené</span></div>
    <div class="thumbs">${Array.from({ length: 12 }, (_, i) => `<div><img src="${pic.src(`gallery-${i + 1}`)}" alt=""><span class="h">${icon('drag')}</span>${i > 8 ? `<span class="prog"><b style="width:${[70, 40, 15][i - 9]}%"></b></span>` : ''}</div>`).join('')}</div>
    <p class="small mute" style="margin:.8rem 0 0">Pořadí měníte tažením. 9 z 12 fotek nahráno. Titulní fotka = první.</p>
    <div class="row" style="margin-top:1rem"><button class="btn btn-sm" data-demo="${soon}">Zveřejnit galerii</button><button class="btn btn-sm btn-ghost" data-demo="${soon}">Uložit jako koncept</button></div>
  </div></div>
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Galerie 2026/2027</h3><span class="small mute">4 galerie · 312 fotek</span></div><div class="bd" style="padding:0"><table class="adm-table"><tbody>${items(D.galleries).filter((g) => g.section === 'zs').slice(0, 5).map((g) => `<tr><td><b>${esc(g.title)}</b><span class="sub">${fmtShort(g.date)} · ${g.count} fotek</span></td><td>${st('pub')}</td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="adm-card"><div class="hd"><h3>Nastavení galerií</h3></div><div class="bd">
      <div class="toggle"><span><b>Vodoznak školy</b></span><span class="sw"></span></div>
      <div class="toggle"><span><b>Povolit stažení celé galerie (ZIP)</b></span><span class="sw on"></span></div>
      <div class="toggle"><span><b>Odstranit metadata z fotek (GPS)</b></span><span class="sw on"></span></div>
      <div class="toggle"><span><b>Třídní galerie jen s heslem</b></span><span class="sw on"></span></div>
    </div></div>
  </div>
</div>`;

  const jidelna = `
<div class="adm-grid" style="grid-template-columns:1.6fr 1fr">
  <div class="adm-card"><div class="hd"><div class="tabs-line" style="margin:0;border:0"><button>Tento týden</button><button class="is-active">Příští týden (${fmtShort(week.from)})</button><button>MŠ</button></div><div class="row"><button class="btn btn-sm btn-ghost" data-demo="${soon}">Zkopírovat minulý týden</button><button class="btn btn-sm btn-ghost" data-demo="${soon}">${icon('upload')} Import z jidelna.cz</button></div></div>
  <div class="bd"><div class="week-editor"><span class="dh">Den</span><span class="dh">Polévka</span><span class="dh">Oběd 1</span><span class="dh">Oběd 2</span><span class="dh">Alergeny</span>
  ${week.days.map((d) => `<div class="dn"><b>${esc(d.day)}</b><span>${fmtShort(d.date)}</span></div><input value="${esc(d.soup)}"><input value="${esc(d.meal1)}"><input value="${esc(d.meal2)}"><input value="${esc(d.allergens1)}${d.allergens2 ? ' / ' + esc(d.allergens2) : ''}">`).join('')}</div>
  <div class="row between" style="margin-top:1.2rem"><span class="small mute">Naposledy uložila Jana Veselá dnes 10:42 · rodiče uvidí změny okamžitě</span><div class="row"><button class="btn btn-sm btn-ghost" data-demo="${soon}">Uložit koncept</button><button class="btn btn-sm" data-demo="${soon}">${icon('check')} Zveřejnit týden</button></div></div></div></div>
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Ceník a texty</h3></div><div class="bd">${D.jidelna_info.prices.map((p) => `<div class="week-editor" style="grid-template-columns:1fr 80px 90px;margin-bottom:.4rem"><span class="small">${esc(p.age)}</span><input value="${p.perMeal}"><input value="${p.perMonth}"></div>`).join('')}<p class="small mute" style="margin:.6rem 0 0">Texty „Jak to funguje“, „Placení“ a „Odhlašování“ se upravují jako běžná stránka.</p></div></div>
    <div class="adm-card"><div class="hd"><h3>Výjimky provozu</h3></div><div class="bd small"><div class="notice warn" style="padding:.6rem .8rem">${icon('alert')}<div><b>16. 11. 2026 – jídelna zavřená</b><p class="small">ředitelské volno · převzato z kalendáře</p></div></div></div></div>
  </div>
</div>`;

  const krouzky = `
<div class="adm-card"><div class="hd"><div class="tabs-line" style="margin:0;border:0"><button class="is-active">Kroužky ZŠ (${items(D.krouzky_zs).length})</button><button>Kroužky MŠ</button><button>Družina</button><button>Přihlášky (86)</button></div><div class="row"><button class="btn btn-sm btn-ghost" data-demo="${soon}">${icon('download')} Export přihlášek (XLSX)</button><button class="btn btn-sm" data-demo="${soon}">${icon('plus')} Nový kroužek</button></div></div>
<div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th>Kroužek</th><th>Den a čas</th><th>Pro koho</th><th>Vede</th><th>Cena</th><th>Obsazenost</th><th>Přihlašování</th><th></th></tr></thead><tbody>${clubs.map((k) => `<tr><td><b>${esc(k.name)}</b><span class="sub">${k.category}</span></td><td>${esc(k.day)} ${esc(k.time)}</td><td class="mute">${esc(k.grades)}</td><td class="mute">${esc(k.lector)}</td><td class="num">${k.price} Kč</td><td><span class="cap"><i><b style="width:${Math.round((1 - k.free / k.capacity) * 100)}%"></b></i>${k.capacity - k.free}/${k.capacity}</span></td><td><span class="toggle" style="border:0;padding:0"><span class="sw ${k.registrationOpen ? 'on' : ''}"></span></span></td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>`;

  const tridy = `
<div class="adm-grid">
  <div class="adm-card"><div class="hd"><h3>Třídy 2026/2027</h3><div class="row"><button class="btn btn-sm btn-ghost" data-demo="Na konci roku se třídy posunou o ročník výš, 9. třídy se archivují a vzniknou nové 1. třídy.">${icon('arrow')} Překlopit školní rok</button><button class="btn btn-sm" data-demo="${soon}">${icon('plus')} Nová třída</button></div></div>
  <div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th>Třída</th><th>Třídní učitel</th><th>Editoři</th><th>Heslo rodičů</th><th>Obsah</th><th></th></tr></thead><tbody>${cl.filter((c) => c.level !== 'ms').slice(0, 12).map((c, i) => `<tr><td><b style="font-family:var(--font-display);font-size:1.05rem">${c.name}</b></td><td>${esc(c.teacher)}<span class="sub">${esc(c.email)}</span></td><td class="mute">${c.assistant ? '+ ' + esc(c.assistant) : '—'}</td><td><code style="font-size:.8rem">••••••</code> <button class="btn btn-sm btn-ghost" style="padding:.25rem .6rem" data-demo="Heslo si učitel mění sám, rodičům ho sdělí na schůzkách.">změnit</button></td><td class="mute small">${3 + i} zpráv · ${2 + (i % 4)} galerie · ${i % 3} soubory</td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Co učitel v adminu vidí</h3></div><div class="bd small"><p>Po přihlášení Microsoft účtem vidí učitel jen svou třídu (nebo skupinu – Ekotým, parlament):</p><ul style="padding-left:1.1em;margin:0"><li>zprávy třídy (koncept → zveřejnit → naplánovat)</li><li>fotogalerie třídy (hromadný upload)</li><li>soubory k výuce</li><li>profil a konzultační hodiny</li><li>heslo pro rodiče</li></ul><p style="margin:.8rem 0 0">Vedení vidí všechny třídy a může zastoupit učitele.</p></div></div>
    <div class="adm-card"><div class="hd"><h3>Mateřská škola</h3></div><div class="bd" style="padding:0"><table class="adm-table"><tbody>${cl.filter((c) => c.level === 'ms').map((c) => `<tr><td><b>${esc(c.name)}</b><span class="sub">${esc(c.teacher)}</span></td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>
  </div>
</div>`;

  const deska = `
<div class="adm-card"><div class="hd"><div class="tabs-line" style="margin:0;border:0"><button class="is-active">Vyvěšeno (24)</button><button>Naplánováno (1)</button><button>Archiv (57)</button></div><button class="btn btn-sm" data-demo="${soon}">${icon('upload')} Nahrát dokument</button></div>
<div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th>Dokument</th><th>Kategorie</th><th>Vyvěšeno</th><th>Sejmout</th><th>Kdo</th><th>Stav</th><th></th></tr></thead><tbody>${docs.map((d, i) => `<tr><td><b>${esc(d.title)}</b><span class="sub">${d.type.toUpperCase()} · ${d.size}</span></td><td class="mute small">${esc(d.category)}</td><td class="mute">${fmtShort(d.published)} ${d.published.slice(0, 4)}</td><td class="mute">${d.expires ? fmtShort(d.expires) + ' ' + d.expires.slice(0, 4) : '—'}</td><td class="mute small">Kancelář</td><td>${st(i === 5 ? 'exp' : 'pub')}</td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div>
<p class="small mute" style="margin-top:.8rem">Každé vyvěšení a sejmutí se zapisuje do historie s časem a uživatelem – doložitelné pro zřizovatele. Dokumenty v archivu zůstávají dostupné na původní adrese.</p>`;

  const role = `
<div class="adm-grid" style="grid-template-columns:1fr">
  <div class="adm-card"><div class="hd"><h3>Uživatelé (${people.length + cl.length})</h3><div class="row"><div class="adm-search">${icon('search')} Hledat…</div><button class="btn btn-sm" data-demo="Uživatel se přidá výběrem ze školního Microsoft tenantu – žádné zakládání hesel.">${icon('plus')} Přidat z Microsoft 365</button></div></div>
  <div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th>Uživatel</th><th>Microsoft účet</th><th>Role</th><th>Rozsah</th><th>Poslední přihlášení</th><th></th></tr></thead><tbody>
  ${[['Mgr. Anna Vzorová', 'Správce', 'vše', 'dnes 8:02'], ['Kancelář školy', 'Redakce', 'ZŠ, úřední deska', 'dnes 8:30'], [cl[7].teacher, 'Učitel', 'třída ' + cl[7].name, 'dnes 9:15'], [cl[13].teacher, 'Učitel', 'třída ' + cl[13].name, 'včera'], ['Jana Veselá', 'Jídelna', 'jídelníček, ceník', 'dnes 10:42'], ['Barbora Vzorná', 'Družina', 'sekce družina', 'včera'], [cl[21].teacher, 'MŠ', 'sekce MŠ', 'pondělí'], ['Lucie Zkušební', 'Bez role', '— (čeká na přidělení)', 'nikdy']].map(([n, r, s, l]) => `<tr><td><div class="teacher-card" style="gap:.6rem"><span class="avatar sm">${initials(n)}</span><b>${esc(n)}</b></div></td><td class="mute small">${slug(n.replace(/^(Mgr\.|Bc\.|PhDr\.|Ing\.)\s*/g, '')).replace(/-/g, '.')}@skola-ukazka.cz</td><td><span class="chip ${r === 'Správce' ? 'chip-danger' : r === 'Bez role' ? 'chip-mute' : ''}">${r}</span></td><td class="mute small">${s}</td><td class="mute small">${l}</td><td>${acts}</td></tr>`).join('')}
  </tbody></table></div></div>
  <div class="stack">
    <div class="adm-card"><div class="hd"><h3>Matice oprávnění</h3></div><div class="bd" style="padding:0;overflow:auto"><div class="role-grid" style="min-width:640px">
      <div class="h" style="justify-content:flex-start">Modul</div>${['Správce', 'Redakce', 'Učitel', 'Družina', 'Jídelna', 'MŠ'].map((r) => `<div class="h">${r}</div>`).join('')}
      ${[['Aktuality ZŠ', 'y y n n n n'], ['Aktuality MŠ', 'y y n n n y'], ['Třídní stránky', 'y y o n n o'], ['Družina', 'y y n y n n'], ['Jídelníček', 'y y n n y y'], ['Kalendář', 'y y o o o y'], ['Fotogalerie', 'y y o y n y'], ['Úřední deska', 'y y n n n n'], ['Kroužky', 'y y n y n y'], ['Stránky', 'y y n n n o'], ['Uživatelé a role', 'y n n n n n']].map(([m, p]) => `<div>${m}</div>${p.split(' ').map((c) => `<div class="c ${c === 'y' ? 'yes' : c === 'o' ? 'own' : 'no'}">${icon(c === 'n' ? 'x' : 'check')}</div>`).join('')}`).join('')}
    </div></div><div class="bd small mute">${icon('check', 'ic')} plný přístup · <span style="color:var(--warn)">${icon('check', 'ic')}</span> jen vlastní třída / sekce · role lze kombinovat</div></div>
    <div class="adm-card"><div class="hd"><h3>Přihlášení přes Microsoft</h3></div><div class="bd small"><p>Ověření dělá Microsoft Entra ID školy (jednotné přihlášení, dvoufázové ověření podle politiky školy). Web si drží jen: jméno, e-mail, role a log přihlášení.</p><p style="margin:0">Odchod zaměstnance = zablokování účtu v Microsoft 365 → okamžitě bez přístupu i na web.</p></div></div>
  </div>
</div>`;

  const stranky = `<div class="adm-card"><div class="hd"><h3>Stránky webu</h3><button class="btn btn-sm" data-demo="${soon}">${icon('plus')} Nová stránka</button></div><div class="bd" style="padding:0"><table class="adm-table"><thead><tr><th>Stránka</th><th>Adresa</th><th>Upraveno</th><th>Stav</th><th></th></tr></thead><tbody>${[['Úvodní stránka', '/', 'dnes'], ['O škole', '/o-skole', '3. 9.'], ['Školní družina', '/druzina', '1. 9.'], ['Školní jídelna', '/jidelna', '28. 8.'], ['Zápis do 1. třídy', '/zapis', '25. 8.'], ['Organizace školního roku', '/skolni-rok', '25. 8.'], ['Kontakt', '/kontakt', '20. 6.'], ['Ochrana osobních údajů', '/gdpr', '20. 6.'], ['Prohlášení o přístupnosti', '/pristupnost', '20. 6.'], ['MŠ – úvod', '/ms', '30. 8.']].map(([n, u, d]) => `<tr><td><b>${n}</b></td><td class="mute"><code>${u}</code></td><td class="mute">${d}</td><td>${st('pub')}</td><td>${acts}</td></tr>`).join('')}</tbody></table></div></div><p class="small mute" style="margin-top:.8rem">Stránky se skládají z bloků (text, tabulka, soubory, kontakty, galerie, upozornění, tlačítka) – editor nemusí umět HTML.</p>`;

  const nastaveni = `<div class="adm-grid"><div class="stack"><div class="adm-card"><div class="hd"><h3>Škola</h3></div><div class="bd"><div class="grid grid-2"><div class="field"><label>Název</label><input value="Základní škola a Mateřská škola, Praha 4, Mendíků 2"></div><div class="field"><label>Aktuální školní rok</label><input value="2026/2027"></div><div class="field"><label>Telefon kanceláře</label><input value="2xx xxx xxx"></div><div class="field"><label>E-mail</label><input value="skola@skola-ukazka.cz"></div><div class="field"><label>Odkaz Bakaláři</label><input value="https://zsmendiku.bakalari.cz"></div><div class="field"><label>Odkaz online zápis</label><input value="https://…zapisyonline.cz/…"></div></div></div></div>
  <div class="adm-card"><div class="hd"><h3>Úvodní stránka</h3></div><div class="bd"><div class="toggle"><span><b>Kritické upozornění</b><br><span class="mute small">bere se z aktualit označených „kritické“</span></span><span class="sw on"></span></div><div class="toggle"><span><b>Dnešní jídelníček</b></span><span class="sw on"></span></div><div class="toggle"><span><b>Nejbližší akce (5)</b></span><span class="sw on"></span></div><div class="toggle"><span><b>Banner zápisu (jen leden–duben)</b></span><span class="sw"></span></div><div class="toggle"><span><b>Tmavý režim pro návštěvníky</b></span><span class="sw on"></span></div></div></div></div>
  <div class="stack"><div class="adm-card"><div class="hd"><h3>Přesměrování starých adres</h3></div><div class="bd small"><p>Při migraci se všechny staré adresy (např. <code>/skola-aktuality</code>, <code>/tridni-stranky/trida-skola/183</code>) přesměrují na nové – odkazy z e-mailů a vyhledávačů nepřestanou fungovat.</p><span class="chip chip-ok">${icon('check')} 1 240 přesměrování aktivních</span></div></div>
  <div class="adm-card"><div class="hd"><h3>Zálohy a historie</h3></div><div class="bd small"><p>Denní záloha databáze i souborů, historie verzí u každé stránky a aktuality (obnovit starší verzi jedním klikem).</p><span class="chip chip-ok">${icon('check')} poslední záloha dnes 03:00</span></div></div></div></div>`;

  const simple = (t) => `<div class="adm-card"><div class="bd"><p class="mute">${t}</p></div></div>`;

  const body = `
<div class="adm">
  <aside class="adm-side"><a class="brand" href="index.html"><span class="brand-mark">M</span><span>Mendíků<small>administrace</small></span></a>${side}
    <div class="adm-user"><span class="avatar sm">AV</span><div><b>Mgr. Anna Vzorová</b><span>Správce · Microsoft 365</span></div><a href="admin-login.html" style="margin-left:auto;padding:.3rem" title="Odhlásit">${icon('logout')}</a></div></aside>
  <div class="adm-main">
    ${view('dashboard', 'Dobrý den, Anno', 'Středa 16. září 2026 · přehled toho, co se na webu děje', dashboard, `<a class="btn btn-ghost btn-sm" href="index.html" target="_blank">${icon('eye')} Zobrazit web</a><a class="btn btn-sm" href="#editor" data-admin-nav>${icon('plus')} Nová aktualita</a>`)}
    ${view('aktuality', 'Aktuality', 'Zprávy pro rodiče ze všech sekcí webu', aktuality)}
    ${view('editor', 'Nová aktualita', 'Koncept · automaticky ukládáno před 12 s', editor, `<button class="btn btn-ghost btn-sm" data-demo="${soon}">Zahodit</button><button class="btn btn-sm" data-demo="${soon}">${icon('check')} Uložit a zveřejnit</button>`)}
    ${view('kalendar', 'Kalendář akcí', 'Prázdniny, schůzky, akce – jeden zdroj pro web, homepage i export rodičům', kalendar)}
    ${view('stranky', 'Stránky', 'Statický obsah webu skládaný z bloků', stranky)}
    ${view('galerie', 'Fotogalerie', 'Hromadné nahrávání, řazení, chráněné třídní galerie', galerie)}
    ${view('tridy', 'Třídy a skupiny', 'Třídní stránky, editoři a hesla pro rodiče', tridy)}
    ${view('jidelna', 'Jídelníček', 'Strukturovaný týdenní jídelníček – rodiče ho vidí na webu i v mobilu', jidelna)}
    ${view('krouzky', 'Kroužky', 'Nabídka kroužků a online přihlášky', krouzky)}
    ${view('druzina', 'Družina', 'Sekce družiny – zprávy, oddělení, plán, galerie', simple('Družina má stejné nástroje jako škola (zprávy, kalendář, galerie, kroužky), ale vychovatelky s rolí <b>Družina</b> vidí jen svou sekci.'))}
    ${view('ms', 'Mateřská škola', 'Vlastní sekce MŠ se stejnými nástroji', simple('Učitelky MŠ s rolí <b>MŠ</b> spravují aktuality, jídelníček, kroužky, oddělení a galerie školky. Vzhled sekce MŠ se liší barvou, ovládání je stejné.'))}
    ${view('deska', 'Úřední deska', 'Dokumenty s datem vyvěšení a sejmutí, historie pro zřizovatele', deska)}
    ${view('lide', 'Lidé a kontakty', 'Profily zaměstnanců – učitel si upraví svůj sám', simple('Seznam všech osob s rolí, kontaktem a konzultačními hodinami. Třídní učitelé se propisují ze správy tříd, každý uživatel si může upravit vlastní profil.'))}
    ${view('role', 'Uživatelé a role', 'Ověření přes Microsoft Entra ID, oprávnění se řídí tady', role)}
    ${view('nastaveni', 'Nastavení', 'Údaje školy, úvodní stránka, přesměrování, zálohy', nastaveni)}
  </div>
</div>`;
  return adminLayout({ title: 'Administrace', body });
}
