// Sestaví statickou ukázku do out/web (funguje z file://).
import { mkdir, writeFile, cp, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { loadData, items, slug, addSearch, esc } from './src/lib.mjs';
import { homePage, enPage } from './src/pages-home.mjs';
import { newsListPage, newsDetailPage, calendarPage, schoolYearPage } from './src/pages-news.mjs';
import { classesPage, classPage, canteenPage, afterSchoolPage, clubsPage, enrolmentPage } from './src/pages-parents.mjs';
import { aboutPage, peoplePage, boardPage, projectsPage, projectPage, galleryListPage, galleryPage, contactPage, notFoundPage } from './src/pages-school.mjs';
import { msHomePage, msNewsPage, msClassesPage } from './src/pages-ms.mjs';
import { adminLoginPage, adminPage } from './src/pages-admin.mjs';

const OUT = new URL('./out/web/', import.meta.url);
await mkdir(new URL('assets/img/', OUT), { recursive: true });
const D = await loadData();

// obrázky: pokud existuje assets/img/<name>.webp, vloží <img>, jinak barevný placeholder
const IMG_DIR = new URL('./src/assets/img/', import.meta.url);
const hues = [['#2457f5', '#6d5cff'], ['#0f9d8a', '#38c7a1'], ['#ff7a59', '#ffb703'], ['#7c3aed', '#db2777'], ['#0891b2', '#2457f5'], ['#ea580c', '#ffb703']];
const pic = (name, alt = '', cls = '') => {
  const f = `${name}.webp`;
  if (existsSync(new URL(f, IMG_DIR))) return `<img src="assets/img/${f}" alt="${esc(alt)}" loading="lazy" class="${cls}">`;
  const h = hues[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length];
  return `<div class="ph ${cls}" style="--ph-a:${h[0]};--ph-b:${h[1]};width:100%;height:100%;min-height:120px" role="img" aria-label="${esc(alt)}"></div>`;
};
pic.src = (name) => (existsSync(new URL(`${name}.webp`, IMG_DIR)) ? `assets/img/${name}.webp` : `assets/ph.svg`);

// index vyhledávání
const news = items(D.news_zs);
addSearch([
  ...news.map((n) => ({ t: n.title, d: n.excerpt, u: `aktualita-${n.slug}.html`, k: 'aktualita' })),
  ...items(D.classes).filter((c) => c.level !== 'ms').map((c) => ({ t: `Třída ${c.name}`, d: c.teacher, u: `trida-${slug(c.name)}.html`, k: 'třída' })),
  ...items(D.people).map((p) => ({ t: p.name, d: p.role, u: 'lide.html', k: 'osoba' })),
  ...items(D.documents).map((d) => ({ t: d.title, d: d.category, u: 'uredni-deska.html', k: 'dokument' })),
  ...items(D.projekty).map((p) => ({ t: p.title, d: p.summary, u: `projekt-${p.slug}.html`, k: 'projekt' })),
  ...items(D.krouzky_zs).map((k) => ({ t: k.name, d: `${k.day} ${k.time} · ${k.grades}`, u: 'krouzky.html', k: 'kroužek' })),
  { t: 'Jídelníček', d: 'Co se vaří tento týden', u: 'jidelna.html', k: 'stránka' }, { t: 'Školní družina', d: 'Provoz, platby, oddělení', u: 'druzina.html', k: 'stránka' }, { t: 'Zápis do 1. třídy', d: 'Termíny a dokumenty', u: 'zapis.html', k: 'stránka' }, { t: 'Kalendář akcí', d: 'Prázdniny, schůzky, akce', u: 'kalendar.html', k: 'stránka' }, { t: 'Kontakt', d: 'Adresa, telefony, formulář', u: 'kontakt.html', k: 'stránka' },
]);

const pages = {
  'index.html': () => homePage(D, pic),
  'en-index.html': () => enPage(D, pic),
  'aktuality.html': () => newsListPage(D, pic),
  'kalendar.html': () => calendarPage(D),
  'skolni-rok.html': () => schoolYearPage(D),
  'tridy.html': () => classesPage(D, pic),
  'jidelna.html': () => canteenPage(D, pic),
  'druzina.html': () => afterSchoolPage(D, pic),
  'krouzky.html': () => clubsPage(D, pic),
  'zapis.html': () => enrolmentPage(D, pic),
  'o-skole.html': () => aboutPage(D, pic),
  'lide.html': () => peoplePage(D),
  'uredni-deska.html': () => boardPage(D),
  'projekty.html': () => projectsPage(D, pic),
  'fotogalerie.html': () => galleryListPage(D, pic),
  'galerie.html': () => galleryPage(D, pic),
  'kontakt.html': () => contactPage(D, pic),
  '404.html': () => notFoundPage(),
  'ms-index.html': () => msHomePage(D, pic),
  'ms-aktuality.html': () => msNewsPage(D, pic),
  'ms-tridy.html': () => msClassesPage(D, pic),
  'ms-jidelna.html': () => canteenPage(D, pic, { section: 'ms' }),
  'ms-krouzky.html': () => clubsPage(D, pic, { section: 'ms' }),
  'ms-zapis.html': () => enrolmentPage(D, pic, { section: 'ms' }),
  'ms-fotogalerie.html': () => galleryListPage(D, pic, { section: 'ms' }),
  'admin-login.html': () => adminLoginPage(),
  'admin-index.html': () => adminPage(D, pic),
};
const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
for (const n of sorted) pages[`aktualita-${n.slug}.html`] = () => newsDetailPage(D, pic, n, { related: sorted.filter((x) => x !== n).slice(0, 4) });
for (const n of items(D.news_druzina)) pages[`aktualita-druzina-${n.slug}.html`] = () => newsDetailPage(D, pic, { ...n, category: 'Družina' }, { back: ['Družina', 'druzina.html'], author: 'Školní družina' });
for (const n of items(D.news_trida)) pages[`aktualita-trida-${n.slug}.html`] = () => newsDetailPage(D, pic, { ...n, category: 'Třída 4.A' }, { back: ['Třída 4.A', 'trida-4-a.html'], author: items(D.classes).find((c) => c.name === '4.A').teacher });
for (const n of items(D.news_ms)) pages[`ms-aktualita-${n.slug}.html`] = () => newsDetailPage(D, pic, n, { back: ['Aktuality MŠ', 'ms-aktuality.html'], section: 'ms', author: 'Mateřská škola' });
for (const c of items(D.classes).filter((c) => c.level !== 'ms')) pages[`trida-${slug(c.name)}.html`] = () => classPage(D, pic, c);
items(D.projekty).forEach((p, i) => { pages[`projekt-${p.slug}.html`] = () => projectPage(D, pic, p, i); });

let n = 0;
for (const [file, fn] of Object.entries(pages)) { await writeFile(new URL(file, OUT), fn()); n++; }
await cp(new URL('./src/assets/', import.meta.url), new URL('assets/', OUT), { recursive: true });
await writeFile(new URL('assets/ph.svg', OUT), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#2457f5"/><stop offset="1" stop-color="#6d5cff"/></linearGradient></defs><rect width="16" height="10" fill="url(#g)"/></svg>`);
console.log(`Sestaveno ${n} stránek → out/web`);
