// Korektura českých textů ve vzorových datech lokálním modelem (LM Studio).
// Projde všechny řetězce v data/*.json, opraví pravopis/gramatiku, zachová strukturu a HTML.
import { readdir, readFile, writeFile } from 'node:fs/promises';
const API = 'http://localhost:1234/v1/chat/completions';
const MODEL = process.env.MODEL || 'openai/gpt-oss-120b';
const DIR = new URL('../data/', import.meta.url);
const SKIP_KEYS = new Set(['slug', 'date', 'start', 'end', 'email', 'phone', 'type', 'category', 'level', 'icon', 'size', 'published', 'expires', 'from', 'time', 'allergens1', 'allergens2', 'code', 'status', 'section', 'year', 'id']);
const log = [];

function collect(node, path = [], out = []) {
  if (typeof node === 'string') { if (node.length > 3 && /[a-zA-Zá-ž]/.test(node)) out.push({ path, s: node }); }
  else if (Array.isArray(node)) node.forEach((v, i) => collect(v, [...path, i], out));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) { if (!SKIP_KEYS.has(k)) collect(v, [...path, k], out); }
  return out;
}
const setAt = (obj, path, val) => { let o = obj; for (const p of path.slice(0, -1)) o = o[p]; o[path.at(-1)] = val; };

async function fix(strings, file) {
  const body = {
    model: MODEL, temperature: 0.1, max_tokens: 24000, reasoning_effort: 'low',
    messages: [
      { role: 'system', content: 'Jsi pečlivý český korektor. Dostaneš JSON pole řetězců z webu základní školy. Oprav pravopisné a gramatické chyby, překlepy, špatné skloňování a nepřirozené formulace (např. "V první týdně" → "V prvním týdnu", "e-mailom" → "e-mailem", "Jaký je spádovost" → "Jaká je spádovost"). Zachovej význam, délku, HTML značky, čísla, jména, e-maily, formát dat a českou typografii. Nepřepisuj text jinak, než je nutné. Řetězce, které jsou v angličtině, nech beze změny. Vrať POUZE JSON pole stejné délky a ve stejném pořadí, bez komentářů. /no_think' },
      { role: 'user', content: JSON.stringify(strings) },
    ],
    response_format: { type: 'json_schema', json_schema: { name: 'strings', schema: { type: 'array', items: { type: 'string' } } } },
  };
  let arr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (j.error) { console.warn(`  API: ${JSON.stringify(j.error).slice(0, 200)}`); continue; }
    const txt = (j.choices?.[0]?.message?.content ?? '').replace(/<think>[\s\S]*?<\/think>/g, '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
    try { arr = JSON.parse(txt); break; } catch { console.warn(`  neplatný JSON (finish=${j.choices?.[0]?.finish_reason}, ${txt.length} znaků), pokus ${attempt}`); }
  }
  if (!Array.isArray(arr) || arr.length !== strings.length) throw new Error(`${file}: špatná délka (${arr?.length} vs ${strings.length})`);
  return arr;
}

const files = (await readdir(DIR)).filter((f) => f.endsWith('.json') && f !== 'en.json');
const only = process.argv[2];
for (const f of files) {
  if (only && f !== only) continue;
  const data = JSON.parse(await readFile(new URL(f, DIR), 'utf8'));
  const entries = collect(data);
  let changed = 0;
  for (let i = 0; i < entries.length; i += 25) {
    const batch = entries.slice(i, i + 25);
    try {
      const fixed = await fix(batch.map((e) => e.s), f);
      batch.forEach((e, k) => { if (fixed[k] && fixed[k] !== e.s) { setAt(data, e.path, fixed[k]); changed++; log.push(`${f} ${e.path.join('.')}\n  - ${e.s}\n  + ${fixed[k]}`); } });
    } catch (err) { console.warn(`… ${f} dávka ${i}: ${err.message}`); }
  }
  await writeFile(new URL(f, DIR), JSON.stringify(data, null, 2));
  console.log(`✓ ${f}: ${entries.length} řetězců, ${changed} oprav`);
}
await writeFile(new URL('../../_nastroje/proofread.diff.txt', import.meta.url), log.join('\n\n'));
console.log('Hotovo, změny v _nastroje/proofread.diff.txt');
