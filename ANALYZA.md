# Analýza současného webu www.zsmendiku.cz

Datum: 16. 9. 2026

## 1. Technický stav

| Oblast | Zjištění |
|---|---|
| Platforma | Vlastní CMS postavené na **Laravelu** (cookie `laravel_session`), administrace na `/administrace` (jméno + heslo) |
| Frontend | jQuery 1.11 (2014), prettyPhoto lightbox, layout přes tabulky, pevná šířka ~1000 px |
| Responzivita | **Žádná** – na mobilu se zobrazuje desktop layout zmenšený (nutné zoomovat) |
| Rychlost serveru | TTFB ~0,16 s (OK), ale stránky jsou obrovské: výpis aktualit ZŠ 210 kB HTML, **aktuality MŠ 2,9 MB** (vše na jedné stránce) |
| Fotky | Originály ~840 kB/kus bez optimalizace, miniatury ~25 kB; žádný lazy‑loading, WebP apod. |
| SEO | Aktuality nemají vlastní detailní URL (jen výpis po 50 ks) → nelze sdílet odkaz na konkrétní zprávu |
| Přístupnost | Prohlášení o přístupnosti existuje, ale web nesplňuje WCAG (layout tabulkami, malý kontrast, žádná mobilní verze) |
| Údržba obsahu | Redaktoři „mažou“ obsah tak, že ho zakomentují v HTML – do stránky tečou zbytky `-->`; MŠ „Tento školní rok“ obsahuje data z roku **2014/2015** |
| Vyhledávání | Žádné |

## 2. Struktura webu a funkce (co musí nový web zachovat)

Web je fakticky **dva weby v jednom** – ZŠ (hlavní) a MŠ (`/materska-skola/*`) s vlastním menu a obsahem.

### 2.1 ZŠ – hlavní menu
| Sekce | Obsah / funkce | Typ v adminu |
|---|---|---|
| Úvod | Text o škole + 3 poslední aktuality | statická stránka |
| Aktuality | ~2 400 zpráv (48 stránek × 50), každá: nadpis, WYSIWYG text, datum, přílohy (docx/pdf s velikostí), odkaz na fotogalerii | modul Aktuality |
| Personální obsazení | 3 tabulky: vedení (funkce, tel., e‑mail), třídní učitelé (třída → jméno, e‑mail), ostatní kontakty | modul Lidé |
| Třídní stránky | 23 tříd (1.A–9.B, Adaptační skupina UA, Ekoškola, Přípravná třída). Každá třída: třídní učitel + kontakt, vlastní aktuality (stránkované), vlastní fotogalerie (po školních rocích), „Pracovní listy“ (soubory). Odkaz „Správa třídních stránek“ → učitelé si spravují sami | modul Třídy |
| Tento školní rok | Tabulky: dny otevřených dveří, prázdniny, třídní schůzky, pedagogické rady, akce (jarmark, zápis, pouť, plavání, lyžák), texty: uvolňování žáků, konzultační hodiny | strukturovaný obsah |
| Družina | Provoz, platby, celoroční plán + podsekce **Zprávy z družiny** (12 stránek, vč. nabídky kroužků ŠD) a **Fotogalerie družiny** (108 galerií / 2 590 fotek) | modul Družina (aktuality + galerie) |
| Jídelna | Statické info (výdej, ceník, platby, odhlašování) + odkaz na **jidelna.cz** (externí jídelníček, id 89) + PDF alergenů + odkaz na mobilní app | stránka + jídelníček |
| Zápis do 1. třídy | Termíny, 3 podstránky (FAQ, co má dítě znát, knihy), 20 souborů ke stažení, banner na **zapisyonline.cz** | stránka + soubory |
| Fotogalerie | Veřejně jen 2025/26 a 2026/27: 91 galerií / 4 372 fotek; starší „na vyžádání u třídního“ | modul Galerie |
| Úřední deska | ~68 dokumentů v kategoriích (ŠVP, výroční zprávy, dokumenty školy, rozpočty…) s typem a velikostí | modul Dokumenty |
| Projekty | 40 projektů (text + fotky) + úvodní text + „Další informace o programu“ | modul Projekty |
| Projekty EU | NPO, Šablony, doučování – texty + povinná publicita (docx) | stránka + soubory |
| Rozvrhy | Jen odkaz do Bakalářů | odkaz |
| Kroužky | Aktuálně jen odkaz na soubor (placeholder „aktualizujeme v září“) | modul Kroužky |
| Výuka jazyků | Tabulka + text | stránka |
| Školy v přírodě | Tabulky (druhy pobytů, historie zájezdů 2000–2022) | stránka |
| Žákovský parlament | externí odkaz (skolniparlament.eu) | odkaz |
| EKO škola | ve skutečnosti „třídní stránka“ č. 117 | třída/skupina |
| Úspěchy našich žáků | zprávy ve stylu aktualit | kategorie aktualit |
| ERASMUS | zprávy ve stylu aktualit | kategorie aktualit |
| 95 let ZŠ Mendíků | historie školy (původně „Co nás čeká“ – měsíční kalendář akcí) | stránka |
| Prohlášení o přístupnosti, GDPR | text + kontakty na pověřence + 7 dokumentů | stránky |
| První pomoc | prázdná stránka (skrytá v menu) | – |

### 2.2 MŠ (`/materska-skola`)
Úvod (co děti potřebují, režim dne, aktuality), Personální obsazení, Tento školní rok (zastaralé), Aktuality (jedna stránka, 2,9 MB, 221 příloh), **Co nás čeká** (měsíční kalendář akcí s výběrem měsíc/rok), Fotogalerie (86 galerií / 1 799 fotek od 2012), Jídelna (jídelníček jako .doc ke stažení, ceník), Kroužky (tabulka název/den/čas/vyučující), Úřední deska, Třídní stránky (3 oddělení: Koťátka, Berušky, Sluníčka), Zápis do MŠ.

### 2.3 Pravý sloupec / patička (na všech stránkách)
Banner MŠ, Bakaláři, banner Online zápis, rychlé odkazy (fotogalerie, virtuální prohlídka Matterport, třídní stránky), kontakt (adresa, tel., IČ, datová schránka), mapa (mapy.cz), partnerské loga (Ekoškola, Ovoce do škol, MAP Praha 4, Kin‑ball, O2 Chytrá škola).

### 2.4 Externí integrace
Bakaláři (login), zapisyonline.cz, jidelna.cz (jídelníček), aplikace NAŠE MŠ, Matterport, mapy.cz, skolniparlament.eu.

## 3. Objem obsahu k migraci (odhad)
- Aktuality ZŠ ~2 400, MŠ ~několik set, družina ~600, třídní aktuality tisíce
- Fotogalerie: ~285 veřejných galerií / ~8 800 fotek + ~1 300 třídních galerií (odhad 30–50 tis. fotek celkem vč. neveřejných)
- Dokumenty: ~400+ souborů (úřední deska, zápis, GDPR, přílohy aktualit)
- Projekty: 40
- Statické stránky: ~25

## 4. Hlavní problémy pro rodiče (co nový web musí vyřešit)
1. Nefunguje na mobilu (většina rodičů čte web z telefonu).
2. Důležité informace (ředitelské volno, platby, schůzky) se ztrácí v proudu aktualit – chybí „důležité upozornění“, kalendář, filtr podle třídy.
3. Není možné sdílet odkaz na konkrétní zprávu.
4. Duplicity a zastaralý obsah (ZŠ vs. MŠ, komentovaný HTML).
5. Menu má 24 položek bez hierarchie.
6. Chybí vyhledávání.
7. Pomalé stránky s fotkami a dlouhé výpisy.

## 5. Návrh cílového řešení (k diskusi)

### Architektura
- **Frontend + admin: Next.js (App Router, TypeScript)**, statické generování / ISR → rychlost, SEO, CDN cache.
- **Databáze: PostgreSQL**, ORM Prisma/Drizzle.
- **Soubory a fotky: S3‑kompatibilní úložiště** (Cloudflare R2 / Hetzner Object Storage) + automatická konverze do WebP/AVIF, více velikostí, lazy‑loading.
- **Přihlášení do administrace: Microsoft Entra ID (Azure AD) přes OIDC** (např. Auth.js). Role buď z Entra skupin, nebo přiřazené v adminu.
- Hosting: Docker na VPS (Hetzner) nebo Vercel + managed DB – dle preferencí.

### Role v administraci
| Role | Práva |
|---|---|
| Správce | vše, správa uživatelů a rolí |
| Vedení / redakce | aktuality ZŠ, stránky, úřední deska, kalendář, lidé, projekty, kroužky, zápis |
| Učitel | jen svoje třídy: aktuality třídy, galerie třídy, soubory třídy, kontakt |
| Družina | zprávy a galerie družiny, kroužky ŠD |
| Jídelna | jídelníček, ceník, info jídelny |
| MŠ | celá sekce MŠ |

### Moduly administrace
Aktuality (kategorie, štítky, přílohy, galerie, důležité/připnuté, platnost od–do), Kalendář akcí, Stránky (WYSIWYG s bloky), Lidé/kontakty, Třídy (ročníkové překlápění), Fotogalerie (hromadný upload, řazení, viditelnost), Dokumenty/úřední deska (kategorie, datum vyvěšení/sejmutí), Projekty, Kroužky (strukturovaná tabulka), Jídelníček, Zápis, Bannery/partneři, Nastavení (kontakty, školní rok), Přesměrování starých URL.

### Frontend pro rodiče
- Homepage: důležitá upozornění, 3–6 aktualit, nejbližší akce, rychlé odkazy (Bakaláři, jídelníček, družina, kontakty, zápis).
- Menu ve 3–4 skupinách (O škole / Pro rodiče / Život školy / MŠ) + vyhledávání.
- Aktuality s filtrem (ZŠ / MŠ / družina / třída) a detailem.
- Stránka třídy jako rozcestník pro rodiče.
- Kalendář (prázdniny, schůzky, akce), export do iCal.
- WCAG 2.1 AA (zákon č. 99/2019 Sb. – povinné pro školy), Lighthouse 90+.
