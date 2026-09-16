// Generuje vzorový (fiktivní) obsah pro návrh webu přes lokální LLM v LM Studiu.
// Spuštění: node tools/gen-content.mjs [jen-nazev-ukolu]
// Výstup: data/*.json
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const API = 'http://localhost:1234/v1/chat/completions';
const MODEL = process.env.MODEL || 'openai/gpt-oss-120b';
const CONCURRENCY = Number(process.env.CONC || 4);
const OUT = new URL('../data/', import.meta.url);
await mkdir(OUT, { recursive: true });

const SYSTEM = `Jsi copywriter, který připravuje VZOROVÝ obsah pro návrh nového webu základní a mateřské školy "ZŠ a MŠ Mendíků" v Praze 4.
Pravidla:
- Piš česky, přirozeně, přátelsky k rodičům, spisovně, bez pravopisných chyb, s českou typografií (uvozovky „“, pomlčky –, nezlomitelné mezery netřeba).
- VŠECHNA data jsou smyšlená: jména osob, telefony, e-maily, čísla účtů, ceny. Nepoužívej žádné reálné osoby ani reálné údaje o této škole. E-maily ve tvaru prijmeni.jmeno@skola-ukazka.cz, telefony ve tvaru 2xx xxx xxx nebo 7xx xxx xxx (smyšlené).
- Data používej v rozsahu školního roku 2026/2027 (září 2026 – červen 2027), dnes je 16. 9. 2026.
- Odpovídej POUZE validním JSON přesně podle zadané struktury, bez komentářů a bez markdownu.`;

async function ask(name, prompt, schema) {
  const body = {
    model: MODEL,
    temperature: 0.9,
    max_tokens: 12000,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_schema', json_schema: { name, strict: false, schema } },
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const t0 = Date.now();
      const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json();
      let txt = j.choices?.[0]?.message?.content ?? '';
      txt = txt.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
      const data = JSON.parse(txt);
      console.log(`✓ ${name} (${((Date.now() - t0) / 1000).toFixed(0)}s, ${j.usage?.completion_tokens} tok)`);
      return data;
    } catch (e) {
      console.warn(`… ${name} pokus ${attempt} selhal: ${e.message}`);
    }
  }
  throw new Error(`Úkol ${name} se nepodařil.`);
}

// ---- pomocné schéma-šablony
const str = { type: 'string' };
const num = { type: 'number' };
const bool = { type: 'boolean' };
const arr = (items) => ({ type: 'array', items });
const obj = (props, required = Object.keys(props)) => ({ type: 'object', properties: props, required, additionalProperties: false });

const newsSchema = (cats) => obj({
  items: arr(obj({
    slug: str, title: str, date: str, category: { type: 'string', enum: cats }, important: bool,
    excerpt: str, body: str, attachments: arr(obj({ name: str, type: { type: 'string', enum: ['pdf', 'docx', 'xlsx'] }, size: str })), hasGallery: bool,
  })),
});
const newsPrompt = (n, ctx, cats) => `Vymysli ${n} aktualit ${ctx}. Kategorie vybírej z: ${cats.join(', ')}. Datum ve formátu YYYY-MM-DD, od 2026-08-25 do 2026-09-16, seřazeno od nejnovější. slug = URL bez diakritiky s pomlčkami. excerpt = 1–2 věty. body = 3–5 odstavců v HTML (<p>, případně <ul><li>, <strong>), 120–220 slov, konkrétní a užitečné pro rodiče (časy, místa, co vzít s sebou, kontakt). U 1–2 aktualit nastav important=true (např. ředitelské volno, změna provozu, platba). Přílohy: 0–2 na aktualitu (název souboru s příponou, typ, velikost jako "245 kB"). hasGallery=true u zhruba třetiny.`;

const TASKS = {
  news_zs: () => ask('news_zs', newsPrompt(14, 'pro hlavní web základní školy (1.–9. ročník). Témata: organizace školního roku, třídní schůzky, sběr papíru, sportovní turnaj, projektový den, výlet, divadlo, platby, provoz jídelny, kroužky, olympiáda, exkurze, spolupráce s rodiči', ['Důležité', 'Pro rodiče', 'Akce', 'Projekty', 'Úspěchy žáků', 'Erasmus+']),
    ['Důležité', 'Pro rodiče', 'Akce', 'Projekty', 'Úspěchy žáků', 'Erasmus+']),
  news_ms: () => ask('news_ms', newsPrompt(6, 'pro sekci mateřské školy (děti 3–6 let): adaptace, divadlo ve školce, focení, platby stravného, zahradní slavnost, logopedie', ['Důležité', 'Pro rodiče', 'Akce']), ['Důležité', 'Pro rodiče', 'Akce']),
  news_druzina: () => ask('news_druzina', newsPrompt(6, 'pro školní družinu (1.–4. třída): vycházky, tvoření, změna vychovatelky, lampionový průvod, provoz o prázdninách, kroužky družiny', ['Družina', 'Akce', 'Důležité']), ['Družina', 'Akce', 'Důležité']),
  news_trida: () => ask('news_trida', newsPrompt(5, 'psaných třídní učitelkou třídy 4.A svým rodičům (osobní tón, podpis „Vaše třídní učitelka“): co jsme probrali, výlet, pomůcky, testování, fotky z akce', ['Třída', 'Pro rodiče']), ['Třída', 'Pro rodiče']),

  events: () => ask('events', `Vymysli 34 událostí do kalendáře školy pro školní rok 2026/2027 (od 2026-09-01 do 2027-06-30) – rovnoměrně po měsících, min. 3 v září 2026 po 16. 9. Typy: "prazdniny" (podzimní, vánoční, pololetní, jarní, velikonoční, hlavní), "reditelske-volno" (2×), "schuzky" (třídní schůzky 4×, konzultace), "akce" (jarmark, den otevřených dveří, pouť, sportovní den, projektový den), "vylet" (ŠVP, lyžák, exkurze, Erasmus), "zapis" (zápis do 1. třídy, zápis do MŠ), "ms" (akce školky), "druzina". Pole: id (číslo), title, type, start (YYYY-MM-DD), end (YYYY-MM-DD, u jednodenní stejné), time (např. "16:30–18:00" nebo ""), place, audience (např. "1. stupeň", "rodiče", "MŠ", "všichni"), description (1–2 věty).`,
    obj({ items: arr(obj({ id: num, title: str, type: str, start: str, end: str, time: str, place: str, audience: str, description: str })) })),

  classes: () => ask('classes', `Vymysli seznam tříd ZŠ: 1.A, 1.B, 1.C, 2.A, 2.B, 3.A, 3.B, 4.A, 4.B, 4.C, 5.A, 5.B, 6.A, 6.B, 7.A, 7.B, 8.A, 8.B, 9.A, 9.B, Přípravná třída – a 3 oddělení MŠ (Koťátka, Berušky, Sluníčka). Pro každou: name, level ("1" = 1. stupeň, "2" = 2. stupeň, "ms", "pripravna"), teacher (smyšlené jméno s titulem, ženy i muži), email, phone, room (např. "2. patro, učebna 214"), pupils (počet 18–29, MŠ 20–25), motto (krátké heslo třídy, hravé), assistant (jméno asistenta nebo "").`,
    obj({ items: arr(obj({ name: str, level: str, teacher: str, email: str, phone: str, room: str, pupils: num, motto: str, assistant: str })) })),

  people: () => ask('people', `Vymysli personální obsazení školy (smyšlená jména). Skupiny (group): "Vedení školy" (ředitelka, statutární zástupkyně, zástupce pro 1. stupeň, zástupce pro 2. stupeň, zástupkyně pro MŠ), "Školní poradenské pracoviště" (výchovná poradkyně, metodik prevence, školní psycholog, speciální pedagog, sociální pedagog), "Provoz a administrativa" (hospodářka, vedoucí školní jídelny, školník, vedoucí vychovatelka ŠD, koordinátor ICT), "Netřídní učitelé" (6 osob s aprobací), "Vychovatelky ŠD" (5), "Učitelky MŠ" (6). Pole: name, role, group, email, phone (u vedení a provozu, jinak ""), note (např. konzultační hodiny "úterý 14:00–15:00" nebo aprobace, může být "").`,
    obj({ items: arr(obj({ name: str, role: str, group: str, email: str, phone: str, note: str })) })),

  krouzky_zs: () => ask('krouzky_zs', `Vymysli 16 zájmových kroužků ZŠ pro rok 2026/2027: sport (florbal, kin-ball, atletika), umění (keramika, výtvarka, dramaťák, sborový zpěv), věda (robotika, 3D tisk, programování, věda pokusy), jazyky (angličtina hravě, španělština), ostatní (šachy, vaření, deskové hry, doučování). Pole: name, category ("sport"|"umeni"|"veda"|"jazyky"|"ostatni"), day (pondělí…pátek), time ("14:00–15:00"), grades ("1.–3. třída" apod.), lector, price (Kč za pololetí, číslo), capacity (číslo), free (volná místa 0–8), place, description (1 věta), registrationOpen (bool).`,
    obj({ items: arr(obj({ name: str, category: str, day: str, time: str, grades: str, lector: str, price: num, capacity: num, free: num, place: str, description: str, registrationOpen: bool })) })),

  krouzky_ms: () => ask('krouzky_ms', `Vymysli 7 kroužků mateřské školy (děti 3–6 let): angličtina hrou, tanečky, keramika, předškolácká příprava, malý sportovec, flétnička, logopedické chvilky. Pole: name, day, time, ages ("4–6 let"), lector, price (Kč/pololetí), capacity, free, place, description (1 věta).`,
    obj({ items: arr(obj({ name: str, day: str, time: str, ages: str, lector: str, price: num, capacity: num, free: num, place: str, description: str })) })),

  jidelnicek: () => ask('jidelnicek', `Vymysli jídelníček školní jídelny. weeks: 2 týdny ZŠ (od pondělí 2026-09-14 a 2026-09-21), každý den: date, day (název dne), soup, meal1, meal2, dessert (nebo ""), allergens1 (např. "1,3,7"), allergens2. Dále ms: 1 týden MŠ (od 2026-09-14): date, day, snackAm, soup, meal, snackPm. Jídla ať jsou realistická pro české školní jídelny, pestrá, s ovocem/zeleninou.`,
    obj({ weeks: arr(obj({ from: str, days: arr(obj({ date: str, day: str, soup: str, meal1: str, meal2: str, dessert: str, allergens1: str, allergens2: str })) })), ms: obj({ from: str, days: arr(obj({ date: str, day: str, snackAm: str, soup: str, meal: str, snackPm: str })) }) })),

  projekty: () => ask('projekty', `Vymysli 9 školních projektů (projektové vyučování): např. Věda u nás, Pravěk na vlastní kůži, Finanční gramotnost, Vltava, Noc ve škole, Ekoškola – půjčovna pomůcek, Erasmus+ Proč lidé migrují, Adopce na dálku, Vánoční jarmark. Pole: slug, title, year ("2025/2026"), grades ("1.–5. ročník"), tags (2–3 štítky), summary (1–2 věty), body (HTML, 4–6 odstavců, 200–300 slov: cíl, průběh, výstupy, co se děti naučily), partner (organizace nebo ""), status ("probíhá"|"ukončen"|"připravujeme").`,
    obj({ items: arr(obj({ slug: str, title: str, year: str, grades: str, tags: arr(str), summary: str, body: str, partner: str, status: str })) })),

  zapis: () => ask('zapis', `Připrav obsah pro stránku Zápis do 1. třídy. faq: 9 otázek a odpovědí rodičů (spádovost, odklad, co s sebou, přípravná třída, cizinci, kritéria přijetí, kdy výsledky, den otevřených dveří, co má dítě umět) – answer v HTML (<p>, <ul>). steps: 4 kroky zápisu (title, text). skills: 10 dovedností „co by mělo dítě znát“ (krátké). documents: 6 dokumentů ke stažení (name, type pdf/docx, size). msFaq: 5 otázek k zápisu do MŠ.`,
    obj({ faq: arr(obj({ q: str, answer: str })), steps: arr(obj({ title: str, text: str })), skills: arr(str), documents: arr(obj({ name: str, type: str, size: str })), msFaq: arr(obj({ q: str, answer: str })) })),

  documents: () => ask('documents', `Vymysli 26 dokumentů pro elektronickou úřední desku školy. Kategorie (category): "Školní vzdělávací programy" (3), "Výroční zprávy" (4), "Řády a směrnice" (7: školní řád, řád ŠD, řád MŠ, provozní řád jídelny, směrnice o úplatě…), "Rozpočet a hospodaření" (4: rozpočet, střednědobý výhled, účetní závěrka), "Povinně zveřejňované informace" (5: zřizovací listina, organizační struktura, oznámení pověřence, výroční zpráva o poskytování informací dle z. 106/1999, sazebník úhrad), "Ochrana osobních údajů" (3). Pole: title, category, type (pdf/docx), size ("1,2 MB"), published (YYYY-MM-DD v letech 2024–2026), validFrom ("od 1. 9. 2026" nebo ""), expires (YYYY-MM-DD nebo ""), note (krátká poznámka nebo "").`,
    obj({ items: arr(obj({ title: str, category: str, type: str, size: str, published: str, validFrom: str, expires: str, note: str })) })),

  galleries: () => ask('galleries', `Vymysli 20 fotogalerií: section "zs" (10, např. Sportovní den, Poznávací zájezd, Poslední zvonění, Vánoční jarmark, Projektový den…), "druzina" (4), "ms" (4), "trida" (2, třída 4.A). Pole: slug, title, section, date (YYYY-MM-DD, září 2025 – září 2026), count (8–140), year ("2026/2027" nebo "2025/2026"), description (1 věta), protected (bool – true jen u sekce trida).`,
    obj({ items: arr(obj({ slug: str, title: str, section: str, date: str, count: num, year: str, description: str, protected: bool })) })),

  about: () => ask('about', `Připrav obsah stránky O škole. intro: 2 odstavce HTML o škole (založena 1930, dvě propojené budovy, cca 500 žáků ZŠ a 80 dětí MŠ, třídy s rozšířenou výukou matematiky od 6. ročníku, ŠVP „Škola s mosty do života“, MŠ „Cestička do školy“, moderní polytechnická učebna s 3D tiskárnou). values: 4 hodnoty (title, text 1 věta, icon jedno z: "bridge","heart","lab","globe"). numbers: 4 čísla (value např. "500+", label). timeline: 12 milníků 1930–2026 (year, title, text 1 věta – smyšlené, ale uvěřitelné). languages: tabulka výuky jazyků 6 řádků (grade, text). stays: 3 druhy pobytů (title, text). schoolYear: prázdniny 6× (name, term), meetings 4× (quarter, date), openDays 2× (date, note), rules: 3 odstavce HTML o omlouvání a uvolňování žáků a konzultacích.`,
    obj({ intro: str, values: arr(obj({ title: str, text: str, icon: str })), numbers: arr(obj({ value: str, label: str })), timeline: arr(obj({ year: str, title: str, text: str })), languages: arr(obj({ grade: str, text: str })), stays: arr(obj({ title: str, text: str })), schoolYear: obj({ holidays: arr(obj({ name: str, term: str })), meetings: arr(obj({ quarter: str, date: str })), openDays: arr(obj({ date: str, note: str })) }), rules: str })),

  druzina: () => ask('druzina', `Připrav obsah stránky Školní družina. hours: ranní a odpolední provoz (morning, afternoon, pickup – texty). payment: 2 odstavce HTML o platbě (smyšlené číslo účtu, částka). plan: 5 dvojic měsíců (months, activities: 4–6 aktivit). departments: 6 oddělení (name, teacher, classes, room). clubs: 6 družinových kroužků (name, day, time, lector). rules: 4 pravidla vyzvedávání (krátké věty).`,
    obj({ hours: obj({ morning: str, afternoon: str, pickup: str }), payment: str, plan: arr(obj({ months: str, activities: arr(str) })), departments: arr(obj({ name: str, teacher: str, classes: str, room: str })), clubs: arr(obj({ name: str, day: str, time: str, lector: str })), rules: arr(str) })),

  ms: () => ask('ms', `Připrav obsah pro sekci Mateřská škola. intro: 2 odstavce HTML (3 oddělení, zahrada, ŠVP „Cestička do školy“). daySchedule: 8 položek režimu dne (time, activity). needs: 8 věcí, které děti do MŠ potřebují. fees: 2 odstavce HTML o úplatě a stravném (smyšlené částky). events: 5 akcí MŠ v roce (title, when, text).`,
    obj({ intro: str, daySchedule: arr(obj({ time: str, activity: str })), needs: arr(str), fees: str, events: arr(obj({ title: str, when: str, text: str })) })),

  jidelna_info: () => ask('jidelna_info', `Připrav obsah stránky Školní jídelna. intro: 2 odstavce HTML (čip, výdej, volba jídla). hours: 3 položky výdeje (who, time). prices: 5 řádků ceníku (age, perMeal, perMonth – Kč, čísla). payment: odstavec HTML (smyšlené číslo účtu, do 25. dne). cancel: 3 odstavce HTML o odhlašování. allergens: 14 alergenů (code, name) dle EU.`,
    obj({ intro: str, hours: arr(obj({ who: str, time: str })), prices: arr(obj({ age: str, perMeal: num, perMonth: num })), payment: str, cancel: str, allergens: arr(obj({ code: str, name: str })) })),

  alerts: () => ask('alerts', `Vymysli 2 kritická upozornění pro lištu na homepage školy (např. ředitelské volno, změna provozu družiny, havárie vody) – pole: title (do 60 znaků), text (1 věta), link (text odkazu), level ("warning"|"info"). A 3 rychlé „vzkazy dne“ pro rodiče (short: do 80 znaků).`,
    obj({ alerts: arr(obj({ title: str, text: str, link: str, level: str })), tips: arr(str) })),

  en: () => ask('en', `Prepare English UI strings for the school website (for the EN language version). Return: nav (array of 8 short labels: Home, News, Calendar, Classes, After-school club, Canteen, Enrolment, Contact), hero (title max 8 words, subtitle 1 sentence), sections (object with keys news, events, quickLinks, classes, kindergarten, contact – short headings), news (4 sample school news items: title, date "2026-09-..", excerpt), notice (1 sentence for international families about Czech-as-second-language support), footer (1 sentence).`,
    obj({ nav: arr(str), hero: obj({ title: str, subtitle: str }), sections: obj({ news: str, events: str, quickLinks: str, classes: str, kindergarten: str, contact: str }), news: arr(obj({ title: str, date: str, excerpt: str })), notice: str, footer: str })),
};

const only = process.argv[2];
const names = Object.keys(TASKS).filter((n) => !only || n === only);
const queue = [...names];
let failed = 0;
async function worker() {
  while (queue.length) {
    const n = queue.shift();
    const file = new URL(`${n}.json`, OUT);
    if (!only && existsSync(file)) { console.log(`= ${n} už existuje, přeskakuji`); continue; }
    try {
      const data = await TASKS[n]();
      await writeFile(file, JSON.stringify(data, null, 2));
    } catch (e) { failed++; console.error(`✗ ${n}: ${e.message}`); }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(failed ? `Hotovo s ${failed} chybami.` : 'Hotovo.');
