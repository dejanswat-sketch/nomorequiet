// ============================================================
//  ciklus-posetioca.mjs
//  Prolazi kroz sajt kao PRVI POSJETILAC (bez naloga) i bilježi:
//  - šta se vidi (screenshot svakog koraka)
//  - JS greške, neuspjele mrežne pozive, HTTP >= 400
//  - gdje vode dugmad i gdje se stigne
//
//  Pokretanje (server mora raditi na :3000):
//    node docs/qa/ciklus-posetioca.mjs
//  Izlaz: docs/qa/snimke/*.png  +  docs/qa/ciklus-log.json
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
const profileDir = join(here, '.edge-profile');
mkdirSync(shotsDir, { recursive: true });

const log = { startedAt: new Date().toISOString(), console: [], exceptions: [], http: [], failed: [], steps: [], api: {} };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── 1. Edge ────────────────────────────────────────────────────────────────
const edge = spawn(
  EDGE,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--remote-debugging-port=9222',
    `--user-data-dir=${profileDir}`,
    '--window-size=1440,900',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

async function devtoolsPage() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      /* još se diže */
    }
    await sleep(400);
  }
  throw new Error('DevTools se nije podigao na :9222');
}

// ─── 2. CDP klijent ─────────────────────────────────────────────────────────
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = [];
    ws.on('message', (raw) => {
      const m = JSON.parse(raw.toString());
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
      } else if (m.method) {
        for (const fn of this.listeners) fn(m);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(fn) {
    this.listeners.push(fn);
  }
}

let currentUrl = '';
let cdp;

function wireLogging() {
  cdp.on((m) => {
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails || {};
      log.exceptions.push({
        url: currentUrl,
        text: d.text || '',
        detail: d.exception?.description || d.exception?.value || '',
      });
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) {
      log.console.push({
        url: currentUrl,
        type: m.params.type,
        text: (m.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ').slice(0, 300),
      });
    }
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
      log.console.push({ url: currentUrl, type: 'log', text: `${m.params.entry.text} ${m.params.entry.url || ''}`.slice(0, 300) });
    }
    if (m.method === 'Network.responseReceived') {
      const r = m.params.response;
      if (r.status >= 400) log.http.push({ url: currentUrl, target: r.url, status: r.status });
    }
    if (m.method === 'Network.loadingFailed') {
      log.failed.push({ url: currentUrl, error: m.params.errorText, blocked: m.params.blockedReason || null });
    }
  });
}

// ─── 3. Pomoćne funkcije ────────────────────────────────────────────────────
async function evaluate(expression) {
  const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) return { error: r.exceptionDetails.text };
  return r.result?.value;
}

async function navigate(path, settle = 2600) {
  currentUrl = path;
  await cdp.send('Page.navigate', { url: BASE + path });
  await sleep(settle);
  return evaluate('({url: location.href, title: document.title, ready: document.readyState})');
}

async function shot(name, { full = false } = {}) {
  const args = { format: 'png' };
  if (full) args.captureBeyondViewport = true;
  const r = await cdp.send('Page.captureScreenshot', args);
  writeFileSync(join(shotsDir, `${name}.png`), Buffer.from(r.data, 'base64'));
}

/** Klikne prvi element koji sadrži zadati tekst. */
async function clickText(text) {
  const expr = `(() => {
    const t = ${JSON.stringify(text)}.toLowerCase();
    const els = [...document.querySelectorAll('a,button')];
    const el = els.find(e => (e.innerText || '').toLowerCase().includes(t));
    if (!el) return { clicked: false, reason: 'nije nadjeno' };
    el.click();
    return { clicked: true, tag: el.tagName, text: (el.innerText || '').trim().slice(0, 60) };
  })()`;
  const res = await evaluate(expr);
  await sleep(2200);
  return res;
}

async function visibleText() {
  return evaluate('document.body.innerText.replace(/\\s+/g," ").slice(0, 4000)');
}

async function pageHas(needles) {
  const text = await visibleText();
  const out = {};
  for (const n of needles) out[n] = text.toLowerCase().includes(n.toLowerCase());
  return out;
}

// ─── 4. Ciklus ──────────────────────────────────────────────────────────────
async function run() {
  const page = await devtoolsPage();
  const ws = new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false, maxPayload: 256 * 1024 * 1024 });
  await new Promise((res, rej) => {
    ws.on('open', res);
    ws.on('error', rej);
  });
  cdp = new CDP(ws);
  wireLogging();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  await cdp.send('Log.enable');

  const step = (name, data) => {
    log.steps.push({ name, ...data });
    console.log(`  · ${name}${data.url ? ' → ' + data.url : ''}`);
  };

  // 1. Prva strana (posjetilac ukuca domen)
  console.log('CIKLUS POSJETIOCA');
  let info = await navigate('/');
  await shot('01-pocetna');
  step('01-pocetna', { url: info?.url, title: info?.title });

  // 2. Klik na čvor u sidebaru
  const nodeClick = await clickText('Rtanj');
  await shot('02-cvor-detalj');
  const detailText = await visibleText();
  step('02-cvor-detalj', {
    clicked: nodeClick?.clicked,
    imaCijenu: /1\s?€/.test(detailText),
    imaBrojSvjetala: /\d+\s+lights|LIGHTS BURNING/i.test(detailText),
  });

  // 3. CTA iz detalja čvora
  const cta = await clickText('Light a Point');
  const afterCta = await evaluate('location.pathname');
  await shot('03-posle-cta-cvora');
  step('03-posle-cta-cvora', { ctaClicked: cta?.clicked, stigaoNa: afterCta });

  // 4. Nav dugme "Begin Writing"
  await navigate('/');
  const begin = await clickText('Begin Writing');
  const afterBegin = await evaluate('location.pathname');
  await shot('04-begin-writing');
  step('04-begin-writing', { clicked: begin?.clicked, stigaoNa: afterBegin });

  // 5–10. Gost na zaštićenim stranama (bez naloga)
  for (const [name, path] of [
    ['05-gost-journal', '/journal-screen'],
    ['06-gost-dashboard', '/dashboard'],
    ['07-gost-portal', '/portal'],
    ['08-gost-personal-arc', '/personal-arc'],
    ['09-gost-user-settings', '/user-settings'],
    ['10-gost-admin', '/admin-panel'],
  ]) {
    info = await navigate(path);
    await shot(name);
    const text = await visibleText();
    step(name, {
      url: info?.url,
      znakovaTeksta: text?.length ?? 0,
      vidiSePrazno: /nothing|no entries|empty|loading|loading…|—/i.test(text || ''),
      imaPozivNaPrijavu: /sign in|log in|sign up|begin writing/i.test(text || ''),
    });
  }

  // 11. Voices
  info = await navigate('/voices');
  await shot('11-voices', { full: true });
  step('11-voices', { url: info?.url, ...(await pageHas(['voices', 'story', 'stories'])) });

  // 12. Pricing
  info = await navigate('/pricing');
  await shot('12-pricing', { full: true });
  const pricingText = await visibleText();
  step('12-pricing', {
    url: info?.url,
    imaCijene: /(4[.,]99|49\s?€|10\s?€|1\s?€)/.test(pricingText || ''),
  });

  // 13. Landing (cijela strana)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 4000, deviceScaleFactor: 1, mobile: false });
  info = await navigate('/landing-page', 3600);
  await shot('13-landing-cijela');
  const landingText = await visibleText();
  step('13-landing-cijela', {
    url: info?.url,
    imaCijene: /(4[.,]99|49\s?€|10\s?€)/.test(landingText || ''),
    imaPostenPocеtak: /nothing has been written here yet/i.test(landingText || ''),
    imaBroj1847: /1[.,]?847/.test(landingText || ''),
  });
  await cdp.send('Emulation.clearDeviceMetricsOverride');

  // 14. Mobilni prikaz (prva strana)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  info = await navigate('/', 3000);
  await shot('14-mobilna-mapa');
  step('14-mobilna-mapa', { url: info?.url });
  await cdp.send('Emulation.clearDeviceMetricsOverride');

  // 15. Nepostojeća strana
  info = await navigate('/ova-strana-ne-postoji');
  await shot('15-404');
  step('15-404', { url: info?.url, naslov: info?.title });

  // 16. robots / sitemap
  for (const p of ['/robots.txt', '/sitemap.xml']) {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    log.api[p] = res.status;
    console.log(`  · ${p} → HTTP ${res.status}`);
  }

  // 17. AI ruta bez prijave (dokaz rupe; jedan minimalan poziv)
  try {
    const res = await fetch(BASE + '/api/ai/chat-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'GEMINI',
        model: 'gemini/gemini-2.5-flash',
        messages: [{ role: 'user', content: 'Reply with the single word: ok' }],
        stream: false,
      }),
    });
    const body = await res.text();
    log.api['/api/ai/chat-completion'] = { status: res.status, bodyStart: body.slice(0, 220) };
    console.log(`  · /api/ai/chat-completion (bez prijave) → HTTP ${res.status}`);
  } catch (e) {
    log.api['/api/ai/chat-completion'] = { error: String(e) };
  }

  // 18. Obrisana ruta za broj svjetala
  {
    const res = await fetch(BASE + '/api/stats/lights');
    log.api['/api/stats/lights'] = res.status;
    console.log(`  · /api/stats/lights → HTTP ${res.status}`);
  }

  cdp.ws.close();
}

try {
  await run();
  log.finishedAt = new Date().toISOString();
  writeFileSync(join(here, 'ciklus-log.json'), JSON.stringify(log, null, 2), 'utf8');
  console.log('\n── SAŽETAK ─────────────────────────────');
  console.log('JS izuzeci:', log.exceptions.length);
  console.log('konzola (error/warn):', log.console.length);
  console.log('HTTP >= 400:', log.http.length);
  console.log('neuspjeli zahtjevi:', log.failed.length);
  console.log('API:', JSON.stringify(log.api));
  console.log('log: docs/qa/ciklus-log.json · snimke: docs/qa/snimke/');
} catch (e) {
  console.error('GREŠKA U CIKLUSU:', e);
  process.exitCode = 1;
} finally {
  try {
    edge.kill('SIGKILL');
  } catch {
    /* ignorisano */
  }
  await sleep(1200);
  try {
    rmSync(profileDir, { recursive: true, force: true });
  } catch {
    /* ignorisano */
  }
}
