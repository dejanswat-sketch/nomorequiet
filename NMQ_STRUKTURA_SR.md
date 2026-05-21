# NoMoreQuiet (NMQ) — Struktura, audit i plan

**Datum:** 21. maj 2026.  
**Repozitorijum:** `nomorequiet_5081`  
**Cilj:** jaka, jasna, bezbedna struktura; dovoljno kvalitetna; odlična na mobilnom (tel).

> **Napomena:** Projekat `nezadovoljnezene` / `dissatisfied-women` nije diran.

---

## 1. Dijagram strukture (App Router)

```
/  ──redirect──►  /landing-page
│
├── JAVNO (marketing + otkrivanje)
│   ├── /landing-page          ← glavni ulaz, hero, manifest, map preview, pricing CTA
│   ├── /map-of-lights         ← interaktivna mapa (SVG + čvorovi)
│   ├── /voices                ← priče planine
│   └── /pricing               ← tierovi (Stripe); AppNav direktno, ne AppLayout
│
├── AUTH
│   ├── /sign-up-login-screen  ← registracija / prijava (nav isključen)
│   └── /auth/callback         ← Supabase OAuth callback (route handler)
│
├── APLIKACIJA (za ulogovane)
│   ├── /journal-screen        ← dnevnik + AI ogledalo + crisis protocol
│   ├── /dashboard             ← Vault profil (sopstveni AppNav u DashboardScreen)
│   ├── /portal                ← AI companion (layout.tsx u portal/)
│   ├── /personal-arc          ← emocionalna vremenska linija
│   ├── /user-settings         ← podešavanja naloga
│   └── /payment/success       ← posle Stripe checkout-a
│
├── ADMIN
│   └── /admin-panel           ← KPI, crisis inbox, deep read queue (AdminLayout)
│
├── API (/api/*)               ← middleware ih preskače (bez session refresh)
│   ├── stripe/*               ← checkout, webhook, customer-portal
│   ├── stats/lights           ← javni brojač svetala
│   ├── ai/chat-completion     ← ⚠ bez auth na ruti
│   ├── portal/check-limit
│   ├── deep-read/*, deep-insight/*
│   ├── account/*
│   └── admin/*                ← provera role=admin u handleru
│
├── META
│   ├── sitemap.ts
│   └── robots.ts              ← disallow privatnih putanja
│
└── Root layout (src/app/layout.tsx)
    AuthProvider · GoogleAnalytics · Toaster · viewport
```

### Layout / navigacija

| Stranica | Navigacija | Komponenta |
|----------|------------|------------|
| landing-page | `AppLayout` + transparent `AppNav` | Deljeni header |
| map, journal, voices, personal-arc | `AppLayout` + solid `AppNav` | Deljeni header |
| pricing | Samo `AppNav` (duplikat pattern) | Fragmentirano |
| dashboard, admin | Sopstveni topbar/sidebar | Fragmentirano |
| sign-up | `showNav={false}` | Bez headera |

**Tok informacija (IA):**  
`landing-page` → `sign-up-login-screen` → `journal-screen` / `dashboard` → `map-of-lights` → `pricing` → Stripe → `payment/success`

---

## 2. Bezbednost

### Auth

- **Supabase Auth** preko `AuthContext` (client) i `@/lib/supabase/server` (API/rute).
- **Middleware** (`src/middleware.ts`): osvežava sesiju samo ako postoji `sb-*-auth-token` kolačić; **ne štiti rute** (nema redirect na login).
- **Admin API**: `user_profiles.role === 'admin'` u handlerima (`crisis-flags`, `deep-read-queue`, itd.).

### RLS (Supabase)

- Uključen na: `user_profiles`, `journal_entries`, `lights`, `portal_*`, `purchases`, `soul_stories`, `deep_read_queue`, `win_notifications`.
- Funkcije: `is_admin_from_auth()`, `is_admin_role()`, `is_admin_user()`.
- Korisnik vidi/ menja samo svoje redove; admin politike za operativne tabele.

### API izloženost

| Ruta | Auth | Napomena |
|------|------|----------|
| `/api/stats/lights` | Ne | Javni count — OK |
| `/api/ai/chat-completion` | **Ne** | Bilo ko može trošiti LLM ključeve ako su u env |
| `/api/stripe/webhook` | Stripe signature | OK |
| `/api/deep-read/weekly-limit` | Service role | OK (server-only) |
| `/api/deep-read/notify-admin` | `STRIPE_WEBHOOK_SECRET` header | Deljeni secret — prihvatljivo za interne pozive |
| `/api/stripe/checkout` | User session | OK |
| Admin rute | Session + admin role | OK |

### Env / git

- **`.env` je bio u git indeksu** — rizik curenja tajni; uklonjen iz trackinga, `.gitignore` pokriva `.env*`.
- Dodat `.env.example` (bez vrednosti).
- Tajne: `STRIPE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_*`, `RESEND_*`, itd. — samo na serveru / Vercel.

### Middleware / zaglavlja

- Middleware ne blokira `/api/*`.
- **Security headers** dodati u `next.config.mjs` (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).

### Crisis protocol

- Kolona `journal_entries.crisis_flag`.
- DB trigger `notify_crisis_alert` → Edge Function `send-crisis-alert` (Resend email adminu).
- Admin panel: `AdminCrisisInbox` + `/api/admin/crisis-flags`.
- UI: `JournalLayout` crisis overlay (WF-05).

---

## 3. Mobil (tel)

### Viewport / safe area

- Root `viewport`: `device-width`, `initialScale: 1`, `viewportFit: cover`.
- `body`: `overflow-x-hidden`, padding `env(safe-area-inset-*)` za notch/home indicator.

### Touch

- `.amber-btn` / `.ghost-btn`: `min-height: 44px`, `min-width: 44px` (Apple HIG).

### Responsive

- Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px (default v3).
- **Landing hero:** skaliranje naslova `text-4xl sm:… md:…`, sekcija `overflow-x-hidden`.
- **Map preview:** manja visina na malim ekranima (`min(420px, 55vh)`).
- **Map of Lights:** `flex-col` ispod `md`, sidebar `max-h-[38vh]` + scroll; mapa `min-h-[45vh]`; widget priča prilagođen širini ekrana.
- **3D hero:** Canvas 2D (ne Three.js na landing-u) — `maxWidth: 100%`, fiksna visina kontejnera; OK na tel.
- **Map stranica:** SVG + tačke — touch `onClick` na čvorovima (hover samo desktop); sidebar i dalje usko na tel ali sada iznad mape, ne pored.

### Preostali mobilni rizici

- Journal/dashboard: sidebar `w-72` na desktop; journal ima collapsed `w-12` — proveriti na užim ekranima.
- Pricing: bento grid — `grid-cols-1` na tel (OK).
- Admin panel: nije optimizovan za tel (očekivano).
- `productionBrowserSourceMaps: true` — veći bundle u produkciji (ne mobil UI, ali performanse).

---

## 4. Jasnoća (IA)

**Jasan put za novog posetioca:**  
Landing CTA „Begin Writing” → auth → journal ili dashboard.  
„See the Map” / „Map of Lights” vidljivo sa landinga i nav-a „THE MOUNTAIN”.  
Pricing: „Stay in the House” u nav-u + sekcije na landingu (`LandingStarTiers`).

**Slabosti jasnoće:**

- URL-ovi sa Rocket imenima (`sign-up-login-screen`, `journal-screen`) — nisu RESTful (`/login`, `/journal`).
- Dva različita nav patterna (AppLayout vs inline AppNav na pricing/dashboard).
- Nema route guard-a — ulogovan/neulogovan isti URL za journal (RLS štiti podatke, ali UX može zbuniti).
- `ignoreBuildErrors` / `ignoreDuringBuilds` — „serious site” standard ne bi tolerisao tihe TS/ESLint greške.

---

## 5. Praznine vs „ozbiljan sajt”

| Oblast | Stanje | Prioritet |
|--------|--------|-----------|
| Auth na `/api/ai/chat-completion` | Nedostaje | Visok |
| Route protection (middleware) | Nedostaje | Srednji |
| `.env` u git istoriji | Uklonjen iz indeksa; rotirati ključeve ako je push-ovan | Visok |
| CSP header | Nedostaje | Srednji |
| Jedinstven layout/nav | Delimično | Srednji |
| Map/journal mobil layout | Poboljšano u ovoj fazi | Srednji |
| E2E / a11y testovi | Nedostaju | Niži |
| i18n (SR/EN) | Samo EN u UI | Niži |

---

## 6. Urađeno u ovoj fazi (21.05.2026)

1. **NMQ_STRUKTURA_SR.md** — ovaj dokument.
2. **`.gitignore`** — `.env`, `.env.local`, `.env.*.local`.
3. **`git rm --cached .env`** — prestaje praćenje tajni u repou.
4. **`.env.example`** — šablon promenljivih.
5. **`next.config.mjs`** — security headers.
6. **`layout.tsx`** — viewportFit + safe-area na body.
7. **`AppLayout`** — `overflow-x-hidden`.
8. **`tailwind.css`** — touch-friendly CTA (44px).
9. **`LandingHero`** — responsive tipografija, overflow kontrola.
10. **`LandingMapPreview`** — responsive visina mape.
11. **`MapOfLightsClient`** — mobilni stack layout + widget širina.
12. **`robots.ts`** — već postojao; sitemap linkovan.

---

## 7. Preporučene sledeće faze

### Faza A — Bezbednost (1–2 dana)

- Zaštititi `/api/ai/chat-completion` (session + rate limit ili samo server-side poziv iz journal/portal).
- Middleware matcher: opcioni redirect neautentifikovanih sa `/journal-screen`, `/dashboard`, `/admin-panel`.
- Rotirati sve ključeve ako je `.env` ikad bio na GitHub-u.
- Uključiti CSP (bar report-only pa enforce).

### Faza B — Mobil polish (2–3 dana)

- Journal: drawer za sidebar na `< md`.
- Map: full-screen mapa na tel sa FAB za filter čvorova.
- Pricing: prebaciti na `AppLayout` radi konzistentnosti.

### Faza C — Kvalitet (ongoing)

- Isključiti `ignoreBuildErrors` / popraviti TS.
- Isključiti `productionBrowserSourceMaps` u produkciji.
- Lighthouse CI na landing + map + journal.

---

## 8. Mobilni test checklist

- [ ] iPhone Safari / Chrome Android: landing — nema horizontalnog scroll-a
- [ ] Hero naslov čitljiv (4xl na malom ekranu)
- [ ] CTA „Begin Writing” / „See the Map” lako pogoditi prstom (≥44px)
- [ ] Map preview sekcija: čvorovi vidljivi, bez odsecanja
- [ ] Hamburger meni: svi linkovi (Vault, Mountain, Pricing, Sign in)
- [ ] `/map-of-lights`: sidebar iznad mape, mapa zauzima donji deo ekrana
- [ ] Tap na čvor na mapi otvara detalj (ne samo hover)
- [ ] `/sign-up-login-screen`: forma bez zoom-a na input (font ≥16px ako bude potrebno)
- [ ] `/pricing`: kartice jedna ispod druge, dugmad puna širina
- [ ] Safe area: sadržaj ne ispod home indikatora (notch telefoni)
- [ ] `/journal-screen` ulogovan: pisanje + crisis poruka čitljiva

---

*Ažurirati ovaj fajl posle svake strukturalne faze.*
