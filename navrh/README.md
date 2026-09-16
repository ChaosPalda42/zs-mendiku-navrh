# Návrh webu ZŠ a MŠ Mendíků – generátor ukázky

Statická ukázka (HTML/CSS/JS bez frameworku), která funguje i z `file://`.
Vzorová data jsou smyšlená a vygenerovaná lokálními modely.

```
navrh/
├── build.mjs            # sestaví out/web (všechny stránky + assets)
├── src/
│   ├── lib.mjs          # layout, hlavička, patička, ikony, helpery, menu
│   ├── pages-*.mjs      # šablony stránek (home, news, parents, school, ms, admin)
│   └── assets/          # style.css, admin.css, app.js, fonty, img/ (webp)
├── data/*.json          # vzorový obsah (aktuality, akce, třídy, lidé, kroužky…)
├── img-src/*.png        # vygenerované „fotky“ (FLUX.2 Klein přes mflux)
├── tools/
│   ├── gen-content.mjs  # obsah přes LM Studio (gpt-oss-120b), JSON schema
│   ├── proofread.mjs    # korektura češtiny v data/*.json lokálním modelem
│   ├── gen-images.py    # generování obrázků (mflux-generate-flux2)
│   ├── make-webp.mjs    # PNG → WebP do src/assets/img
│   ├── md2html.mjs      # ANALYZA.md → HTML do balíčku
│   └── pack.sh          # build + zabalení do ../_balicek/ZS-Mendiku-ukazka.zip
└── balicek/             # PRECTI-ME.txt a OTEVRIT-UKAZKU.html pro klienta
```

## Příkazy

```bash
node build.mjs                 # sestavit do out/web
./tools/pack.sh                # sestavit + ZIP pro klienta
node tools/gen-content.mjs     # (znovu) vygenerovat chybějící data/*.json
node tools/gen-content.mjs events   # jen jeden úkol
python3 tools/gen-images.py    # dogenerovat chybějící obrázky do img-src
node tools/make-webp.mjs       # převést do WebP
```

Lokální náhled: `.claude/launch.json` → server `navrh` (python http.server na portu 4173).

## Poznámky

- Stránky jsou „ploché“ (`ms-*.html`, `admin-*.html`, `aktualita-*.html`), aby fungovaly relativní odkazy z `file://`.
- Chráněná část třídní stránky má v ukázce heslo `rodice`.
- Data označená jako kurátorovaná ručně (realistické termíny): `events.json`, `documents.json`, část `druzina.json`, `jidelna_info.json`.
- Před korekturou je záloha dat v `../_nastroje/data-backup-pred-korekturou/`.
