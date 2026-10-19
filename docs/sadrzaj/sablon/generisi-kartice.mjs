// ============================================================
//  generisi-kartice.mjs
//  Čita 01-KARTICE-FRAGMENTI.md i pravi sve-kartice.html
//  (jedna stranica sa svim karticama, spremna za screenshot/PDF)
//
//  Pokretanje:  node docs/sadrzaj/sablon/generisi-kartice.mjs
//  Izlaz:       docs/sadrzaj/sablon/sve-kartice.html
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', '01-KARTICE-FRAGMENTI.md');
const out = join(here, 'sve-kartice.html');

const md = readFileSync(src, 'utf8');

// --- parsiranje: ### FRAG-001 · Rtanj / **EN:** / **SR:** / **Kartica:** (labela ... · 312 DAYS AGO)
const blocks = md.split(/^### /m).slice(1);
const cards = [];

for (const b of blocks) {
  const head = b.match(/^(FRAG-\d+)\s*·\s*(.+)$/m);
  if (!head) continue;
  const en = b.match(/\*\*EN:\*\*\s*"?([\s\S]*?)"?\s*\n/);
  const sr = b.match(/\*\*SR:\*\*\s*"?([\s\S]*?)"?\s*\n/);
  const kartica = b.match(/\*\*Kartica:\*\*\s*(.+)$/m);
  const age = kartica?.[1].match(/(\d+)\s*DAYS?\s*AGO/i);
  cards.push({
    id: head[1],
    node: head[2].trim(),
    en: (en?.[1] ?? '').trim().replace(/\*\*/g, ''),
    sr: (sr?.[1] ?? '').trim().replace(/\*\*/g, ''),
    age: age ? `${age[1]} DAYS AGO` : '—',
  });
}

if (!cards.length) {
  console.error('GREŠKA: nijedna kartica nije nađena. Provjeri format fajla 01.');
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cardHtml = cards
  .map(
    (c) => `
  <section class="card" id="${c.id}">
    <div class="frame"></div>
    <div class="inner">
      <div class="dot"></div>
      <p class="fragment">${esc(c.en)}</p>
      <p class="fragment sr">${esc(c.sr)}</p>
      <div class="meta">
        <span class="node">${esc(c.node)}</span>
        <span class="sep"></span>
        <span>${esc(c.age)}</span>
      </div>
    </div>
    <div class="example">EXAMPLE · YOURS COULD BE HERE</div>
    <div class="foot">nomorequiet.com</div>
    <div class="tag">${c.id}</div>
  </section>`
  )
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>NMQ · sve kartice (${cards.length})</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Spectral:wght@200;300&display=swap" rel="stylesheet">
<style>
  :root{--void:#0a0806;--deep-earth:#110e0a;--amber:#c8822a;--gold:#D4AF37;--cream:#f0e8d8;--mist:#a89880;--silence:#5a4e40}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#000;font-family:'Cormorant Garamond',Georgia,serif;padding:24px}
  .hint{color:var(--mist);font-family:'Spectral',serif;font-size:13px;letter-spacing:.06em;margin-bottom:20px;text-align:center}
  .hint b{color:var(--gold)}
  .grid{display:flex;flex-wrap:wrap;gap:24px;justify-content:center}

  .card{position:relative;width:1080px;height:1350px;overflow:hidden;flex:0 0 auto;
    background:radial-gradient(ellipse at 50% 38%, rgba(200,130,42,.10) 0%, rgba(10,8,6,0) 62%),
               linear-gradient(160deg,var(--void) 0%,var(--deep-earth) 55%,var(--void) 100%);
    color:var(--cream)}
  .card::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.05;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:220px 220px}
  .frame{position:absolute;inset:56px;border:1px solid rgba(212,175,55,.14)}
  .inner{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 110px}
  .dot{width:14px;height:14px;border-radius:50%;background:var(--gold);margin-bottom:56px;
    box-shadow:0 0 14px rgba(212,175,55,.9),0 0 34px rgba(200,130,42,.55);animation:pulse 4s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 14px rgba(212,175,55,.9),0 0 34px rgba(200,130,42,.55)}
                   50%{opacity:.45;box-shadow:0 0 7px rgba(212,175,55,.5),0 0 16px rgba(200,130,42,.25)}}
  .fragment{font-weight:300;font-style:italic;font-size:64px;line-height:1.32;max-width:900px}
  .fragment::before{content:'\\201C'} .fragment::after{content:'\\201D'}
  .fragment.sr{margin-top:36px;font-size:40px;color:var(--mist);opacity:.9}
  body.only-en .fragment.sr{display:none}
  body.only-sr .fragment:not(.sr){display:none}
  .meta{margin-top:56px;display:flex;align-items:center;gap:20px;font-family:'Spectral',serif;font-weight:200;
    font-size:22px;letter-spacing:.22em;text-transform:uppercase;color:var(--mist)}
  .meta .node{color:var(--gold)} .meta .sep{width:1px;height:20px;background:var(--silence)}
  .example{position:absolute;bottom:210px;left:0;right:0;text-align:center;font-family:'Spectral',serif;
    font-weight:200;font-size:18px;letter-spacing:.28em;text-transform:uppercase;color:rgba(212,175,55,.55)}
  body.no-example .example{display:none}
  .foot{position:absolute;bottom:110px;left:0;right:0;text-align:center;font-family:'Spectral',serif;
    font-weight:200;font-size:19px;letter-spacing:.3em;text-transform:uppercase;color:var(--silence)}
  .tag{position:absolute;top:22px;left:26px;font-family:'Spectral',serif;font-size:16px;letter-spacing:.2em;color:rgba(212,175,55,.45)}
  body.no-tag .tag{display:none}

  .toolbar{position:fixed;top:0;left:0;right:0;z-index:99;display:flex;gap:22px;justify-content:center;align-items:center;
    padding:12px;background:rgba(10,8,6,.95);border-bottom:1px solid rgba(212,175,55,.2);
    font-family:'Spectral',serif;font-size:13px;letter-spacing:.08em;color:var(--mist)}
  .toolbar label{cursor:pointer;user-select:none}
  body{padding-top:64px}

  /* PDF: jedna kartica = jedna stranica */
  @page{size:285.75mm 357.19mm;margin:0}
  @media print{
    .toolbar,.hint{display:none}
    body{background:#000;padding:0}
    .grid{display:block}
    .card{break-after:page;page-break-after:always;margin:0}
  }
</style>
</head>
<body class="with-sr">
<div class="toolbar">
  <label><input type="radio" name="lang" value="with-sr" checked> EN + SR</label>
  <label><input type="radio" name="lang" value="only-en"> samo EN</label>
  <label><input type="radio" name="lang" value="only-sr"> samo SR</label>
  <label><input type="checkbox" id="ex" checked> labela „EXAMPLE"</label>
  <label><input type="checkbox" id="tg" checked> ID kartice</label>
</div>
<p class="hint">${cards.length} kartica · screenshot: DevTools → desni klik na karticu → <b>Capture node screenshot</b> · PDF: Ctrl+P (jedna kartica = jedna stranica)</p>
<div class="grid">
${cardHtml}
</div>
<script>
  const b = document.body;
  document.querySelectorAll('input[name=lang]').forEach(r =>
    r.addEventListener('change', () => { b.classList.remove('with-sr','only-en','only-sr'); b.classList.add(r.value); }));
  document.getElementById('ex').addEventListener('change', e => b.classList.toggle('no-example', !e.target.checked));
  document.getElementById('tg').addEventListener('change', e => b.classList.toggle('no-tag', !e.target.checked));
</script>
</body>
</html>
`;

writeFileSync(out, html, 'utf8');
console.log(`OK: ${cards.length} kartica → ${out}`);
console.log(`Prva: ${cards[0].id} · ${cards[0].node} · ${cards[0].age}`);
console.log(`Zadnja: ${cards.at(-1).id} · ${cards.at(-1).node} · ${cards.at(-1).age}`);
