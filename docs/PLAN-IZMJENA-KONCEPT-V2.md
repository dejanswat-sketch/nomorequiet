# Plan izmjena — Koncept v2 (Kuća bez naplate)

**Datum:** 22. maj 2026. · **Izvor:** [`KONCEPT-V2.md`](KONCEPT-V2.md) · **Status:** Faza 1 u toku (1.1–1.4 završeno)

> Redoslijed nije slučajan: prvo **istina i ulaz**, pa **ritual**, pa **značenje**, pa **kapija povjerenja**, i na kraju **prekidač za naplatu i SEO**.
> Ništa se ne implementira dok ne kažeš. Procjene su u radnim danima.

---

## Stanje (22.05.2026)

**Završeno (Faza 1, dio 1):**
- ✅ **1.1** `next.config.mjs` — `/` sada vodi na `/map-of-lights` (mapa je prva strana). Provjereno na živom serveru: `HTTP 307 → /map-of-lights`.
- ✅ **1.2** `LandingHero.tsx` — obrisan animirani brojač na 1.847 i `lightCount` stanje; umjesto broja stoji `The map is open · be one of the first lights`.
- ✅ **1.3** `LandingLightCounter.tsx` — obrisani fiksni brojevi po čvorovima i „1,000 founding lights sealed"; čvorovi su sada pejzaž (labela, ime, koordinate). Donja linija: `Seven nodes, one House. The map fills slowly — a light is a sentence, not a score.`
- ✅ **1.4** `LandingFoundingFragments.tsx` — 9 izmišljenih fragmenata više nisu „tuđi unosi": naslov je `Nothing has been written here yet.`, podnaslov kaže da su to **primjeri**, svaka kartica nosi labelu `Example`, a dodat je poziv `Leave the first sentence`.

**Dodatno (moralo, jer je mapa sada PRVA strana — isti lažni podaci bili su i na njoj):**
- ✅ `MapOfLightsClient.tsx` — obrisan **lažni niz od 16 svjetala** (`LIGHTS`) i polja `lightCount`/`foundingLights`; početno stanje je prazno, bez izmišljenih unosa. Dodato pošteno prazno stanje: `Nothing has been written here yet. / The first light could be yours.`
- ✅ `MapSidebar.tsx` — uklonjeni brojevi po čvorovima i suma („1,847 lights burning"), uklonjena legenda „FOUNDING LIGHT / ACTIVE LIGHT" koja je tvrdila da osnivačka svjetla postoje. Sada: `Seven nodes. One House.` + `A light is a sentence, not a score`.
- ✅ `MapNodeDetail.tsx` — uklonjen panel „LIGHTS BURNING / FOUNDING LIGHTS".
- ✅ `MapCanvas.tsx` — uklonjen broj svjetala u tooltipu čvora.
- ✅ `LandingMapPreview.tsx` — uklonjeni brojevi u pregledu mape.
- ✅ `FeaturedStoryWidget.tsx` — izmišljeni citat („Every great book begins…") zamijenjen poštenim tekstom Kuće; labela je sada `FROM THE HOUSE` kad nema stvarnog unosa (a `Featured Echo` samo kad stvarni postoji).

**Provjera:** `npm run build` prolazi; na živom serveru `/` → 307 → `/map-of-lights`, a u HTML-u mape **nema** više `847`, `1,847`, `lights burning` ni `FOUNDING LIGHTS`. `npx tsc --noEmit` — nijedna **nova** greška (postojeće u projektu su bile i prije). Dokaz: `sadrzaj/sablon/faza1-mapa-cista.png`.

**Ostaje u Fazi 1 (čeka tvoj znak):** 1.5–1.7 — sklanjanje cijena iz javnog toka (nav „STAY IN THE HOUSE", footer linkovi `Deep Insight — 10 €` / `The Deep Read — 49 €`, landing tierovi, `pricing` ruta, CTA u `MapNodeDetail` koji kaže „1 €", i prodajni blok posle pisanja). To dira naplatne putanje, pa ne diram bez potvrde.

---

## Faza 1 — Istina i ulaz (1 dan) · najveći efekat, najmanje koda

| # | Fajl | Šta se mijenja |
|---|---|---|
| 1.1 | `next.config.mjs` (redirect `/` → `/landing-page`, linija 21–29) | Dok se mapa ne spoji sa landingom, `/` vodi na `/map-of-lights`. Kasnije: `src/app/page.tsx` renderuje mapu, a landing ide **ispod** nje. |
| 1.2 | `src/app/landing-page/components/LandingHero.tsx` (linije 12–25, 230–238) | Brisanje animiranog brojača na **1.847**; umjesto broja ide jedna poštena rečenica („The map is open. Be one of the first lights."). |
| 1.3 | `src/app/landing-page/components/LandingLightCounter.tsx` (linije 5–13, 94–97) | Fiksni brojevi po čvorovima (847, 213, 156…) i „1,000 founding lights sealed" se uklanjaju. Ukupan broj — samo ako je stvaran; izvor je `/api/stats/lights` (postoji u `HEAD`, lokalno obrisan). |
| 1.4 | `src/app/landing-page/components/LandingFoundingFragments.tsx` (linije 5–15) | 9 izmišljenih fragmenata sa lažnom starošću → varijanta **A** (`EXAMPLE · YOURS COULD BE HERE`) ili **B** (prazna mapa + poziv). Vidi `sadrzaj/06-SABLON-KARTICE.md` §5. |
| 1.5 | `src/components/AppNav.tsx` (linija 53) · `LandingFooter.tsx` (linije 51–53) · `LandingStarTiers.tsx` · `LandingProductPyramid.tsx` | Skloniti cijene i linkove ka naplati iz javnog toka dok je `PAYWALL=false`. |
| 1.6 | `src/app/pricing/page.tsx` | Fajl ostaje; ruta se gasi (404) dok je prekidač ugašen. |
| 1.7 | `src/app/journal-screen/components/JournalReflection.tsx` + `JournalEditor.tsx` (linije 173–194) | Ugašen prodajni blok posle pisanja (`UPSELL_CONTENT`, `recommend_upsell`). Kod ostaje, samo se ne prikazuje. |

**Vidi se odmah:** mapa je prva, nema lažnih brojeva, nema prodaje.

---

## Faza 2 — Ponoćni ritual „Kuća diše" (1 dan)

| # | Fajl | Šta se mijenja |
|---|---|---|
| 2.1 | **novo** `src/lib/hooks/useRtanjMidnight.ts` | Računa sljedeći 00:00 po `Europe/Belgrade`; vraća stanje `breathing` u trajanju 60 s. Bez servera, bez baze. |
| 2.2 | **novo** `src/app/map-of-lights/components/MidnightBreath.tsx` | Tokom tog minuta: pojačan sjaj svih svjetala + jedna linija `The House is breathing.` **Bez broja ljudi.** |
| 2.3 | `src/app/map-of-lights/components/MapCanvas.tsx` | Prima `breathing` i pojačava glow/puls (postojeći `pulseAmber` uzor). |

**Vidi se odmah:** zajednički trenutak koji nijedan konkurent ne može kopirati.

---

## Faza 3 — Sedam čvorova dobija značenje (pola dana)

| # | Fajl | Šta se mijenja |
|---|---|---|
| 3.1 | **novo** `src/lib/nodes.ts` | Jedan izvor istine: `id`, ime, postojeća labela (THE HOUSE, THE VORTEX, THE CROWN, THE SOURCE, THE TOR, THE CROSSING, THE MAGNET), **pitanje** i kratak opis. |
| 3.2 | `LandingLightCounter.tsx` (nodeStats) · `src/app/map-of-lights/components/MapSidebar.tsx` · `MapNodeDetail.tsx` · `MapCanvas.tsx` | Čitaju iz `nodes.ts`; čvor prikazuje svoje pitanje. |
| 3.3 | `src/app/journal-screen/components/WriteScreen.tsx` | Uz izbor čvora stoji njegovo pitanje + pravilo „one sentence". |

**Vidi se odmah:** mapa postaje pejzaž ljudskog iskustva, a pisanje dobija smjer bez savjeta.

---

## Faza 4 — Kapija povjerenja (2–3 dana) · najvažnija za besplatnu Kuću

| # | Fajl | Šta se mijenja |
|---|---|---|
| 4.1 | `src/app/api/ai/chat-completion/route.ts` | **Trenutno nema nikakvu zaštitu** — dodati sesiju + rate limit. Bez ovoga svako troši ključ. |
| 4.2 | `src/middleware.ts` | Zaštita ruta `/journal-screen`, `/dashboard`, `/user-settings`, `/admin-panel`. |
| 4.3 | `supabase/migrations/…_journal_rate_limit.sql` (novo) + `src/lib/services/journalService.ts` | Ograničenje 3 unosa na sat po uređaju; uzor je već u `20260428130000_portal_rate_limit.sql`. |
| 4.4 | `MapNodeDetail.tsx` + **novo** `light_reports` (migracija) + admin prikaz | Dugme **„Prijavi svjetlo"**; uzor za admin je `AdminCrisisInbox.tsx`. |
| 4.5 | `AuthScreen.tsx` + `journalService.ts` | Prvi unos **bez naloga**: anonimni ključ u `localStorage`; posle unosa opcija „zadrži" preko mejl linka. |

**Vidi se odmah:** mapa se ne može zatrpati; AI ključ je zaštićen.

---

## Faza 5 — Prekidač za naplatu i SEO (1 dan)

| # | Fajl | Šta se mijenja |
|---|---|---|
| 5.1 | **novo** `src/lib/features.ts` | `PAYWALL` (env) — jedno mjesto za uključivanje naplate kasnije. |
| 5.2 | `src/lib/hooks/useStripeCheckout.ts` · `src/app/api/stripe/*` · `pricing/page.tsx` | Kad je ugašeno: 404/redirect, bez poziva Stripe-u. **Kod i tabele se ne brišu.** |
| 5.3 | `src/app/sitemap.ts` · `src/app/robots.ts` (iz `HEAD`, očišćeni) | Sitemap bez aplikativnih ekrana i bez lažnog `lastModified`; robots disallow `/admin-panel`, `/api/`, `/portal/`, `/dashboard/`, `/user-settings/`, `/payment/`. |
| 5.4 | `.env` + `src/app/*/page.tsx` | `NEXT_PUBLIC_SITE_URL=https://nomorequiet.com`; `metadata` po ruti (obrazac već postoji na `src/app/voices/page.tsx`) + OG slika. |
| 5.5 | `src/app/layout.tsx` (linije 51–52) · `next.config.mjs` (linija 5) | Skloniti dva Rocket skripta (privatnost + brzina); `productionBrowserSourceMaps: false`. |

---

## Šta se NE dira

`src/lib/stripe/*` · `src/app/api/stripe/*` (samo se gase) · `supabase/migrations/*` (samo se dodaje) · `deep_read_queue`, `purchases`, `lights` · `admin-panel` · `docs/sadrzaj/*` (paket sadržaja) · `docs/KONCEPT-V2.md`.

---

## Rizici

1. **Anonimnost bez naloga** je najosjetljiviji dio — ako se ne uradi 4.3–4.5, mapa se pokvari brže nego što se izgradi.
2. **Skrivena naplata** može zbuniti ako negdje ostane cijena (footer, nav, e-mail sekvence). Zato Faza 1 ide prije svega.
3. **Ponoćni ritual** zavisi od tačnog vremena klijenta; ako sat nije tačan, trenutak se promaši — rješenje je server-provjereno vrijeme (kasnije, Faza 5).
4. **Brisanje lažnih brojeva** ostavlja praznu mapu — to je namjerno, ali mora imati poštenu rečenicu (1.4), inače izgleda kao da nešto ne radi.

---

## Prvi zadatak (kad kažeš „kreni")

**Faza 1, stavke 1.1–1.4** — mapa kao ulaz + istina (bez lažnih brojeva i izmišljenih fragmenata).
To je jedina izmjena koja se vidi odmah, a ne dira ni naplatu ni bazu.
