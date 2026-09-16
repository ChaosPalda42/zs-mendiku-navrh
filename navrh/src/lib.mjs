// Sdílené stavební kameny návrhu: layout, hlavička, patička, ikony, helpery.
import { readFile } from 'node:fs/promises';

export const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MONTHS = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
const MONTHS_SHORT = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'];
export const fmtDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}. ${MONTHS[m - 1]} ${y}`; };
export const fmtShort = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d}. ${m}.`; };
export const dateParts = (iso) => { const [, m, d] = iso.split('-').map(Number); return { d, m: MONTHS_SHORT[m - 1] }; };
export const initials = (name) => name.replace(/^(Mgr\.|Bc\.|PhDr\.|Ing\.|PaedDr\.|Mgr\. et Mgr\.|DiS\.)\s*/g, '').replace(/,.*$/, '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
export const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const items = (d) => (Array.isArray(d) ? d : d.items);

// ---- ikony (lucide-style, 24px, stroke)
const I = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  chevronR: '<path d="m9 6 6 6-6 6"/>',
  chevronL: '<path d="m15 6-6 6 6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  home: '<path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  sparkles: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM5 19l.7 1.8L7.5 21.5l-1.8.7L5 24l-.7-1.8-1.8-.7 1.8-.7z"/>',
  bridge: '<path d="M2 20h20M4 20v-8M20 20v-8M2 12c3 0 5-4 10-4s7 4 10 4M8 20v-6M16 20v-6M12 20v-8"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  lab: '<path d="M9 3h6M10 3v6.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7 16h10"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
  backpack: '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 6V4a3 3 0 0 1 6 0v2M8 21v-5h8v5M8 12h8"/>',
  sunrise: '<path d="M12 2v4M4.2 8.2l2.8 2.8M2 16h4M18 16h4M17 11l2.8-2.8M6 20h12M4 16a8 8 0 0 1 16 0"/>',
  puzzle: '<path d="M19.4 13.6a1.2 1.2 0 0 1 0-1.7l1.1-1.1a1.5 1.5 0 0 0-2.1-2.1l-1.1 1.1a1.2 1.2 0 0 1-1.7 0 1.2 1.2 0 0 1-.4-.9V6.6a1.5 1.5 0 0 0-3 0v2.3a1.2 1.2 0 0 1-2.1.9L9 8.7a1.5 1.5 0 0 0-2.1 2.1l1.1 1.1a1.2 1.2 0 0 1 0 1.7 1.2 1.2 0 0 1-.9.4H4.8a1.5 1.5 0 0 0 0 3h2.3a1.2 1.2 0 0 1 .9 2.1L6.9 20a1.5 1.5 0 0 0 2.1 2.1l1.1-1.1a1.2 1.2 0 0 1 2.1.9v.2"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3a2 2 0 0 1-2 4M7 5H4a2 2 0 0 0 2 4"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.5 5-6"/>',
  ms: '<path d="M12 3 2 9l10 6 10-6-10-6z"/><path d="M6 11.5V17c0 1 3 3 6 3s6-2 6-3v-5.5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  microsoft: '<rect x="3" y="3" width="8" height="8" fill="#f25022" stroke="none"/><rect x="13" y="3" width="8" height="8" fill="#7fba00" stroke="none"/><rect x="3" y="13" width="8" height="8" fill="#00a4ef" stroke="none"/><rect x="13" y="13" width="8" height="8" fill="#ffb900" stroke="none"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 4 4 5-6"/>',
  filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  drag: '<circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>',
  ical: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>',
  map: '<path d="m1 6 7-3 8 3 7-3v15l-7 3-8-3-7 3z"/><path d="M8 3v15M16 6v15"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  translate: '<path d="M5 8h8M9 5v3M7 15c2-2 4-5 4.5-7M4 16c2-1 4.5-4 5.5-8"/><path d="m13 21 4-9 4 9M14.5 17.5h5"/>',
  medal: '<circle cx="12" cy="15" r="6"/><path d="M8.5 9.5 6 2h12l-2.5 7.5"/>',
};
export const icon = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;

// ---- navigace (ZŠ)
export const NAV = [
  { label: 'Aktuality', href: 'aktuality.html' },
  { label: 'Kalendář', href: 'kalendar.html' },
  {
    label: 'Pro rodiče', group: 'rodice', hint: 'Vše, co potřebujete k běžnému provozu', items: [
      ['tridy.html', 'users', 'Třídní stránky', 'Aktuality, fotky a soubory vaší třídy'],
      ['jidelna.html', 'utensils', 'Jídelna a jídelníček', 'Co se vaří, ceny, odhlašování'],
      ['druzina.html', 'sunrise', 'Školní družina', 'Provoz, platby, oddělení, akce'],
      ['krouzky.html', 'puzzle', 'Kroužky', 'Nabídka a přihlášky na tento rok'],
      ['skolni-rok.html', 'calendar', 'Organizace školního roku', 'Prázdniny, schůzky, pravidla omlouvání'],
      ['zapis.html', 'backpack', 'Zápis do 1. třídy', 'Termíny, dokumenty, časté otázky'],
      ['https://bakalari.example', 'external', 'Bakaláři', 'Známky, rozvrh, suplování, omluvenky', true],
    ],
  },
  {
    label: 'Život školy', group: 'zivot', hint: 'Co se u nás děje', items: [
      ['fotogalerie.html', 'camera', 'Fotogalerie', 'Fotky z akcí, výletů a projektů'],
      ['projekty.html', 'sparkles', 'Projekty a projektové dny', 'Projektové vyučování, Erasmus+, Ekoškola'],
      ['aktuality.html#uspechy', 'trophy', 'Úspěchy žáků', 'Soutěže, olympiády, sport'],
      ['o-skole.html#jazyky', 'globe', 'Výuka jazyků a pobyty', 'Angličtina od 1. třídy, zahraniční zájezdy'],
      ['o-skole.html#parlament', 'users', 'Žákovský parlament', 'Hlas žáků ve škole'],
      ['o-skole.html#ekoskola', 'leaf', 'Ekoškola', 'Mezinárodní program a náš ekotým'],
    ],
  },
  {
    label: 'O škole', group: 'skola', hint: 'Kdo jsme a jak fungujeme', items: [
      ['o-skole.html', 'home', 'Základní informace', 'Historie, hodnoty, ŠVP'],
      ['lide.html', 'users', 'Lidé ve škole', 'Vedení, učitelé, poradenské pracoviště'],
      ['uredni-deska.html', 'file', 'Úřední deska', 'Dokumenty, řády, výroční zprávy, rozpočet'],
      ['ms-index.html', 'ms', 'Mateřská škola', 'Vlastní sekce školky'],
      ['kontakt.html', 'mail', 'Kontakt', 'Adresa, telefony, formulář, mapa'],
      ['o-skole.html#gdpr', 'shield', 'Ochrana osobních údajů', 'Pověřenec, dokumenty GDPR'],
    ],
  },
  { label: 'Kontakt', href: 'kontakt.html' },
];
export const NAV_MS = [
  { label: 'Aktuality', href: 'ms-aktuality.html' },
  { label: 'Třídy', href: 'ms-tridy.html' },
  { label: 'Jídelníček', href: 'ms-jidelna.html' },
  { label: 'Kroužky', href: 'ms-krouzky.html' },
  { label: 'Zápis do MŠ', href: 'ms-zapis.html' },
  { label: 'Kontakt', href: 'kontakt.html' },
];

const NAV_EN = [
  { label: 'News', href: '#news' }, { label: 'Calendar', href: 'kalendar.html' }, { label: 'Classes', href: 'tridy.html' }, { label: 'Canteen', href: 'jidelna.html' }, { label: 'After-school club', href: 'druzina.html' }, { label: 'Enrolment', href: 'zapis.html' }, { label: 'Contact', href: 'kontakt.html' },
];
function header({ section, active, lang }) {
  const isMs = section === 'ms';
  const en = lang === 'en';
  const nav = en ? NAV_EN : isMs ? NAV_MS : NAV;
  const navHtml = nav.map((n) => {
    if (n.items) {
      return `<li><button type="button" aria-haspopup="true">${n.label}${icon('chevron')}</button>
        <div class="mega" role="menu"><div class="mega-head"><span>${n.hint}</span></div>
        ${n.items.map(([h, ic, t, d, ext]) => `<a href="${h}" ${ext ? 'target="_blank" rel="noopener" data-demo="Externí odkaz – v ukázce neaktivní."' : ''}><span class="ico">${icon(ic)}</span><span><b>${t}</b><span>${d}</span></span></a>`).join('')}</div></li>`;
    }
    return `<li><a href="${n.href}" class="${active === n.href ? 'is-active' : ''}">${n.label}</a></li>`;
  }).join('');
  const drawerHtml = nav.map((n) => n.items
    ? `<h4>${n.label}</h4>${n.items.map(([h, , t]) => `<a href="${h}">${t}</a>`).join('')}`
    : `<a href="${n.href}"><b>${n.label}</b></a>`).join('');
  return `
<a class="skip" href="#obsah">Přeskočit na obsah</a>
<div class="topbar"><div class="wrap">
  <div class="row"><span class="switch"><a href="index.html" class="${!isMs ? 'is-active' : ''}">${en ? 'Primary school' : 'Základní škola'}</a><a href="ms-index.html" class="${isMs ? 'is-active' : ''}">${en ? 'Kindergarten' : 'Mateřská škola'}</a></span></div>
  <div class="row"><a class="hide-m" href="https://bakalari.example" data-demo="Odkaz do Bakalářů – v ukázce neaktivní.">${icon('external')} Bakaláři</a><a class="hide-m" href="kontakt.html">${icon('phone')} 2xx xxx xxx</a><span class="lang"><a href="${lang === 'en' ? 'index.html' : '#'}" class="${lang !== 'en' ? 'is-active' : ''}">CS</a><a href="en-index.html" class="${lang === 'en' ? 'is-active' : ''}">EN</a></span></div>
</div></div>
<header class="header"><div class="wrap">
  <a class="brand" href="${isMs ? 'ms-index.html' : 'index.html'}"><span class="brand-mark">M</span><span>${isMs ? 'MŠ Mendíků' : 'ZŠ Mendíků'}<small>${en ? 'School with bridges to life' : isMs ? 'Cestička do školy' : 'Škola s mosty do života'}</small></span></a>
  <ul class="nav">${navHtml}</ul>
  <div class="hdr-actions">
    <button class="icon-btn" type="button" data-search-open aria-label="Hledat">${icon('search')}</button>
    <button class="icon-btn" type="button" data-theme-toggle aria-label="Přepnout světlý / tmavý režim">${icon('sun')}</button>
    <a class="btn btn-sm hdr-cta" href="${isMs ? 'ms-zapis.html' : 'zapis.html'}">${en ? 'Enrolment' : isMs ? 'Zápis do MŠ' : 'Zápis do 1. třídy'}</a>
    <button class="icon-btn burger" type="button" data-drawer-open aria-label="Menu">${icon('menu')}</button>
  </div>
</div></header>
<div class="drawer"><div class="drawer-bg" data-drawer-close></div><div class="drawer-panel">
  <div class="drawer-top"><a class="brand" href="index.html"><span class="brand-mark">M</span><span>${isMs ? 'MŠ Mendíků' : 'ZŠ Mendíků'}</span></a><button class="icon-btn" type="button" data-drawer-close aria-label="Zavřít">${icon('x')}</button></div>
  <div class="row" style="margin-top:1rem"><span class="switch" style="background:var(--bg-soft)"><a href="index.html" class="${!isMs ? 'is-active' : ''}">ZŠ</a><a href="ms-index.html" class="${isMs ? 'is-active' : ''}">MŠ</a></span><a href="en-index.html" class="chip chip-mute">EN</a></div>
  ${drawerHtml}
  <h4>Rychle</h4><a href="https://bakalari.example" data-demo="Odkaz do Bakalářů – v ukázce neaktivní.">Bakaláři</a><a href="jidelna.html">Dnešní jídelníček</a><a href="kontakt.html">Kontakt</a>
</div></div>`;
}

function footer({ section }) {
  return `
<footer class="footer"><div class="wrap">
  <div class="footer-main">
    <div><a class="brand" href="index.html"><span class="brand-mark">M</span><span>ZŠ a MŠ Mendíků<small>Praha 4 · Škola s mosty do života</small></span></a>
      <p>Úplná základní škola s 1.–9. ročníkem, přípravnou třídou, školní družinou a mateřskou školou. Ukázková data – všechny kontakty a jména jsou smyšlené.</p>
      <div class="partners"><span class="partner"><i></i>Ekoškola</span><span class="partner"><i></i>Ovoce do škol</span><span class="partner"><i></i>MAP Praha 4</span><span class="partner"><i></i>Erasmus+</span></div></div>
    <div><h4>Pro rodiče</h4><ul><li><a href="aktuality.html">Aktuality</a></li><li><a href="kalendar.html">Kalendář akcí</a></li><li><a href="tridy.html">Třídní stránky</a></li><li><a href="jidelna.html">Jídelníček</a></li><li><a href="druzina.html">Družina</a></li><li><a href="krouzky.html">Kroužky</a></li><li><a href="zapis.html">Zápis do 1. třídy</a></li></ul></div>
    <div><h4>Škola</h4><ul><li><a href="o-skole.html">O škole</a></li><li><a href="lide.html">Lidé ve škole</a></li><li><a href="projekty.html">Projekty</a></li><li><a href="fotogalerie.html">Fotogalerie</a></li><li><a href="uredni-deska.html">Úřední deska</a></li><li><a href="ms-index.html">Mateřská škola</a></li><li><a href="admin-index.html">Administrace</a></li></ul></div>
    <div><h4>Kontakt</h4><ul><li>ZŠ a MŠ Mendíků<br>Ukázková 123/4, 140 00 Praha 4</li><li>${icon('phone', 'ic')} 2xx xxx xxx</li><li>${icon('mail', 'ic')} skola@skola-ukazka.cz</li><li>IČ: 00000000 · Datová schránka: xxxxxxx</li><li><a href="kontakt.html" class="btn btn-sm btn-accent" style="margin-top:.4rem">Napište nám ${icon('arrow')}</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© 2026 ZŠ a MŠ Mendíků · Návrh nového webu</span><span class="row"><a href="o-skole.html#pristupnost">Prohlášení o přístupnosti</a><a href="o-skole.html#gdpr">Ochrana osobních údajů</a><a href="uredni-deska.html">Povinně zveřejňované informace</a></span></div>
</div></footer>
<div class="search-modal" role="dialog" aria-label="Vyhledávání"><div class="search-box"><div class="in">${icon('search')}<input type="search" placeholder="Hledat aktuality, třídy, dokumenty, lidi…" aria-label="Hledat"><kbd>Esc</kbd></div><div class="search-res"></div></div></div>
<div class="lightbox" role="dialog" aria-label="Fotografie"><button class="lb-close" type="button" aria-label="Zavřít">${icon('x')}</button><button class="lb-prev" type="button" aria-label="Předchozí">${icon('chevronL')}</button><img alt=""><button class="lb-next" type="button" aria-label="Další">${icon('chevronR')}</button><div class="cap"></div></div>
<div class="demo-tag"><i></i>Ukázka návrhu · vzorová data</div>`;
}

export function crumbs(list) {
  return `<nav class="crumbs wrap" aria-label="Drobečková navigace">${list.map((c, i) => (i < list.length - 1 ? `${c[1] ? `<a href="${c[1]}">${c[0]}</a>` : `<span>${c[0]}</span>`}${icon('chevronR')}` : `<span>${c[0]}</span>`)).join('')}</nav>`;
}
export function pageHead(title, lead = '', extra = '') {
  return `<div class="page-head wrap"><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div>`;
}

let SEARCH = [];
export const addSearch = (entries) => SEARCH.push(...entries);
export const getSearch = () => SEARCH;

export function layout({ title, description = '', section = 'zs', active = '', lang = 'cs', body, scripts = '', noChrome = false, bodyClass = '' }) {
  return `<!doctype html>
<html lang="${lang}" data-section="${section}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} – ZŠ a MŠ Mendíků</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="assets/favicon.svg">
<link rel="stylesheet" href="assets/fonts.css">
<link rel="stylesheet" href="assets/style.css">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
</head>
<body class="${bodyClass}">
${noChrome ? '' : header({ section, active, lang })}
<main id="obsah">
${body}
</main>
${noChrome ? '' : footer({ section })}
<script>window.SEARCH_INDEX=${JSON.stringify(SEARCH)};</script>
${scripts}
<script src="assets/app.js"></script>
</body>
</html>`;
}

// ---- drobné komponenty
export const fileItem = (f) => `<a class="file" href="#" data-demo="Stažení souboru „${esc(f.name)}“ – v ukázce neaktivní."><span class="ft ${f.type}">${f.type.toUpperCase()}</span><span><b>${esc(f.name)}</b><small>${f.type.toUpperCase()} · ${f.size}${f.published ? ' · vyvěšeno ' + fmtShort(f.published) : ''}</small></span>${icon('download')}</a>`;
export const catChip = (c) => {
  const map = { 'Důležité': 'chip-danger', 'Pro rodiče': 'chip', 'Akce': 'chip-accent', 'Projekty': 'chip', 'Úspěchy žáků': 'chip-ok', 'Erasmus+': 'chip', 'Družina': 'chip-warn', 'Třída': 'chip' };
  return `<span class="chip ${map[c] || 'chip-mute'}">${c}</span>`;
};
export const newsCard = (n, { href, img, featured = false } = {}) => `
<article class="card card-hover link news-card ${featured ? 'news-featured' : ''}" data-cat="${slug(n.category)}${n.important ? ' dulezite' : ''}">
  ${img ? `<div class="card-media"><img src="${img}" alt="" loading="lazy">${catChip(n.category)}</div>` : ''}
  <div class="card-pad">
    <div class="meta">${!img ? catChip(n.category) : ''}<span>${fmtDate(n.date)}</span>${n.important && n.category !== 'Důležité' ? `<span class="chip chip-danger">${icon('alert')} důležité</span>` : ''}</div>
    <h3><a href="${href}">${esc(n.title)}</a></h3>
    <p>${esc(n.excerpt)}</p>
    <span class="more">Číst dál ${icon('arrow')}</span>
  </div>
</article>`;
export const eventCard = (e) => { const p = dateParts(e.start); const multi = e.end !== e.start; return `<article class="card event ev-${e.type}"><div class="date"><b>${p.d}</b><span>${p.m}</span></div><div><h3>${esc(e.title)}</h3><p>${multi ? `${fmtShort(e.start)} – ${fmtShort(e.end)}` : e.time || 'celý den'}${e.place ? ' · ' + esc(e.place) : ''}</p><span class="chip chip-mute">${e.audience}</span></div></article>`; };
export const EVENT_RENDER_JS = `window.renderEvent=function(e){var m=['led','úno','bře','dub','kvě','čvn','čvc','srp','zář','říj','lis','pro'];var d=e.start.split('-');var s=function(x){var p=x.split('-');return +p[2]+'. '+ +p[1]+'.'};return '<article class="card event ev-'+e.type+'"><div class="date"><b>'+ +d[2]+'</b><span>'+m[+d[1]-1]+'</span></div><div><h3>'+e.title+'</h3><p>'+(e.end!==e.start?s(e.start)+' – '+s(e.end):(e.time||'celý den'))+(e.place?' · '+e.place:'')+'</p><span class="chip chip-mute">'+e.audience+'</span></div></article>'};`;

export async function loadData() {
  const dir = new URL('../data/', import.meta.url);
  const names = ['news_zs', 'news_ms', 'news_druzina', 'news_trida', 'events', 'classes', 'people', 'krouzky_zs', 'krouzky_ms', 'jidelnicek', 'projekty', 'zapis', 'documents', 'galleries', 'about', 'druzina', 'ms', 'jidelna_info', 'alerts', 'en'];
  const out = {};
  for (const n of names) {
    try { out[n] = JSON.parse(await readFile(new URL(`${n}.json`, dir), 'utf8')); } catch { out[n] = null; console.warn(`! chybí data/${n}.json`); }
  }
  return out;
}
