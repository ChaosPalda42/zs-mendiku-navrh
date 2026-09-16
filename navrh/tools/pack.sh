#!/bin/bash
# Sestaví web a zabalí ukázku do _balicek/ZS-Mendiku-ukazka.zip
set -e
cd "$(dirname "$0")/.."
node build.mjs
DST="../_balicek/ZS-Mendiku-ukazka"
rm -rf "$DST"; mkdir -p "$DST/dokumenty"
cp -r out/web "$DST/web"
cp balicek/PRECTI-ME.txt balicek/OTEVRIT-UKAZKU.html "$DST/"
cp ../ANALYZA.md "$DST/dokumenty/analyza-soucasneho-webu.md"
node tools/md2html.mjs ../ANALYZA.md "$DST/dokumenty/analyza-soucasneho-webu.html" "Analýza současného webu"
find "$DST" -name .DS_Store -delete
(cd ../_balicek && rm -f ZS-Mendiku-ukazka.zip && zip -qr ZS-Mendiku-ukazka.zip ZS-Mendiku-ukazka)
du -sh ../_balicek/ZS-Mendiku-ukazka.zip
