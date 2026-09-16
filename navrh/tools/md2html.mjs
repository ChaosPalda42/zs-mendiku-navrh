// Minimální převod Markdownu (nadpisy, odstavce, tabulky, seznamy) do samostatného HTML se stylem ukázky.
import { readFile, writeFile } from 'node:fs/promises';
const [src, dst, title] = process.argv.slice(2);
const md = await readFile(src, 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
const lines = md.split('\n'); let html = '', i = 0;
while (i < lines.length) {
  const l = lines[i];
  if (/^#{1,3} /.test(l)) { const n = l.match(/^#+/)[0].length; html += `<h${n}>${inline(l.replace(/^#+ /, ''))}</h${n}>`; i++; continue; }
  if (l.startsWith('|')) { const rows = []; while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]); const cells = (r) => r.slice(1, -1).split('|').map((c) => c.trim()); html += `<div class="tw"><table><thead><tr>${cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; continue; }
  if (/^(-|\d+\.) /.test(l)) { const ol = /^\d/.test(l); const items = []; while (i < lines.length && /^(-|\d+\.) /.test(lines[i])) items.push(lines[i++].replace(/^(-|\d+\.) /, '')); html += `<${ol ? 'ol' : 'ul'}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</${ol ? 'ol' : 'ul'}>`; continue; }
  if (l.trim() === '') { i++; continue; }
  const p = []; while (i < lines.length && lines[i].trim() && !/^(#|\||-|\d+\. )/.test(lines[i])) p.push(lines[i++]); html += `<p>${inline(p.join(' '))}</p>`;
}
await writeFile(dst, `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#f5f7fb;color:#0f172a;margin:0;line-height:1.6}main{max-width:960px;margin:0 auto;padding:3rem 1.5rem 5rem}h1{font-size:2.2rem;letter-spacing:-.02em}h2{margin-top:2.5rem;font-size:1.5rem;border-bottom:2px solid #e2e6ef;padding-bottom:.3rem}h3{margin-top:1.8rem}table{border-collapse:collapse;width:100%;font-size:.92rem;background:#fff}th,td{text-align:left;padding:.55rem .7rem;border-bottom:1px solid #e2e6ef;vertical-align:top}th{background:#eceff6;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}.tw{overflow-x:auto;border:1px solid #e2e6ef;border-radius:12px;margin:1rem 0}code{background:#eceff6;padding:.1rem .35rem;border-radius:4px;font-size:.9em}a{color:#2457f5}</style></head><body><main>${html}</main></body></html>`);
