// ============================================================
//  ciklus-2-detalji.mjs — dublja provjera dvije ključne stvari:
//   A) detalj čvora na mapi (klik UNUTAR sidebara, ne u navigaciji)
//   B) gost piše rečenicu i traži refleksiju — šta se stvarno desi
//
//  Pokretanje (server na :3000):
//    node docs/qa/ciklus-2-detalji.mjs
// ============================================================

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:3000';
const here = dirname(fileURLToPath(import.meta.url));
const shotsDir = join(here, 'snimke');
const profileDir = join(here, '.edge-profile2');
mkdirSync(shotsDir, { recursive: true });

const log = { console: [], exceptions: [], http: [], failed: [], nalazi: {} };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const edge = spawn(
  EDGE,
  ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
   '--remote-debugging-port=9223', `--user-data-dir=${profileDir}`, '--window-size=1440,900', 'about:blank'],
  { stdio: 'ignore' }
);

async function devtoolsPage() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch('http://127.0.0.1:9223/json/list')).json();
      const p = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (p) return p;
    } catch { /* diže se */ }
    await sleep(400);
  }
  throw new Error('DevTools 9223 nije spreman');
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.listeners = [];
    ws.on('message', (raw) => {
      const m = JSON.parse(raw.toString());
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
      } else if (m.method) for (const f of this.listeners) f(m);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  on(f) { this.listeners.push(f); }
}

let cdp;
const evaluate = async (e) => (await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value;
const shot = async (n) => writeFileSync(join(shotsDir, `${n}.png`), Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
const text = () => evaluate('document.body.innerText.replace(/\\s+/g," ").slice(0,5000)');

async function main() {
  const page = await devtoolsPage();
  const ws = new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false, maxPayload: 256 * 1024 * 1024 });
  await new Promise((res, rej) => { ws.on('open', res); ws.on('error', rej); });
  cdp = new CDP(ws);
  cdp.on((m) => {
    if (m.method === 'Runtime.exceptionThrown') log.exceptions.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type))
      log.console.push((m.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ').slice(0, 220));
    if (m.method === 'Network.responseReceived' && m.params.response.status >= 400)
      log.http.push({ status: m.params.response.status, url: m.params.response.url });
    if (m.method === 'Network.loadingFailed') log.failed.push({ error: m.params.errorText, url: m.params.requestId });
  });
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');

  // ── A) Detalj čvora: klik isključivo unutar sidebara ──────────────────────
  await cdp.send('Page.navigate', { url: BASE + '/' });
  await sleep(3500);
  const klik = await evaluate(`(() => {
    const side = document.querySelector('.w-72') || document.body;
    // Node dugme (ne filter!): prepoznaje se po metafori cvora
    const btn = [...side.querySelectorAll('button')].find(b => /fire, earth, stone/i.test(b.innerText));
    if (!btn) return { ok: false };
    btn.click();
    return { ok: true, tekst: btn.innerText.replace(/\\s+/g,' ').slice(0,80) };
  })()`);
  await sleep(1500);
  await shot('16-detalj-cvora');
  const detalj = await text();
  log.nalazi['detalj-cvora'] = {
    klik,
    imaPanel: /not therapy|the center of all paths|fire, earth, stone/i.test(detalj),
    imaCijenu1e: /1\s?€/.test(detalj),
    imaCtaLight: /light a point/i.test(detalj),
    imaBrojeve: /lights burning|founding lights|\b\d{3,}\b/i.test(detalj),
    isjecak: detalj.slice(0, 400),
  };
  console.log('A) detalj čvora:', JSON.stringify(log.nalazi['detalj-cvora'], null, 1).slice(0, 700));

  // SAMO_A=1 → preskoči dio B (koji troši AI poziv)
  if (process.env.SAMO_A) {
    cdp.ws.close();
    return;
  }

  // ── B) Gost piše i traži refleksiju ───────────────────────────────────────
  log.console.length = 0; log.http.length = 0; log.exceptions.length = 0;
  await cdp.send('Page.navigate', { url: BASE + '/journal-screen' });
  await sleep(3500);
  const prije = await text();
  log.nalazi['gost-journal-prije'] = {
    imaNaN: /nan/i.test(prije),
    isjecak: prije.slice(0, 300),
  };

  // upiši rečenicu u editor (contenteditable ili textarea)
  const upis = await evaluate(`(() => {
    const ta = document.querySelector('textarea');
    if (ta) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(ta, 'Tonight I am testing whether a stranger can write here without an account.');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      return { ok: true, nacin: 'textarea' };
    }
    const ce = document.querySelector('[contenteditable="true"]');
    if (ce) { ce.focus(); ce.textContent = 'Tonight I am testing whether a stranger can write here without an account.'; ce.dispatchEvent(new Event('input', { bubbles: true })); return { ok: true, nacin: 'contenteditable' }; }
    return { ok: false };
  })()`);
  await sleep(600);

  const dugme = await evaluate(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => /receive your reflection/i.test(x.innerText));
    if (!b) return { ok: false };
    b.click();
    return { ok: true };
  })()`);
  await sleep(14000); // čekamo AI odgovor
  await shot('17-gost-refleksija');
  const posle = await text();
  log.nalazi['gost-refleksija'] = {
    upis, dugme,
    dobioRefleksiju: /reflection|mirror|what i hear|you wrote/i.test(posle) && posle.length > (prije?.length || 0),
    znakovaPrije: prije?.length, znakovaPosle: posle?.length,
    imaGresku: /error|failed|went wrong|something/i.test(posle),
    isjecak: posle.slice(0, 600),
  };
  console.log('B) gost + refleksija:', JSON.stringify(log.nalazi['gost-refleksija'], null, 1).slice(0, 900));

  cdp.ws.close();
}

try {
  await main();
  writeFileSync(join(here, 'ciklus-2-log.json'), JSON.stringify(log, null, 2), 'utf8');
  console.log('\nHTTP >= 400:', log.http.length, '| konzola:', log.console.length, '| izuzeci:', log.exceptions.length);
  console.log(log.http.slice(0, 6).map((h) => `  ${h.status} ${h.url.slice(0, 100)}`).join('\n'));
} catch (e) {
  console.error('GREŠKA:', e);
  process.exitCode = 1;
} finally {
  try { edge.kill('SIGKILL'); } catch { /* ignorisano */ }
  await sleep(1200);
  try { rmSync(profileDir, { recursive: true, force: true }); } catch { /* ignorisano */ }
}
