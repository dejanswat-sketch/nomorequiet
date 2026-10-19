# NoMoreQuiet — Plan sadržaja (90 dana)

**Datum:** 22. maj 2026.
**Cilj ovog dokumenta:** da sadržaj bude **motor rasta** (jer plaćene reklame ne pokrivaju cijenu od 4,99 €/mj), a ne ukras.
**Pratnja:** `01-KARTICE-FRAGMENTI.md`, `02-PROMPTS-REFLEKSIJA.md`, `03-SKRIPTE-REELS.md`, `04-SEO-CLANCI.md`, `05-EMAIL-SEKVENCE.md`.

---

## 1. Cilj i mjerljivi rezultat

| Period | Sadržaj | Cilj posjeta/mj | Novi nalozi | Plaćeni |
|---|---|---|---|---|
| 30 dana | 30 kartica, 12 reels, 4 članka, welcome sekvenca | 1.000 | 100 | 5 |
| 60 dana | +30 kartica, +12 reels, +6 članaka | 4.000 | 350 | 25 |
| 90 dana | +30 kartica, +12 reels, +8 članaka, B2B ponuda | 10.000 | 900 | 80 |

**Jedna metrika odlučuje:** koliko ljudi koji su došli sa sadržaja **napiše prvi unos** (`journal_entry_submitted`). Sve ostalo je posljedica.

---

## 2. Glas — pravila koja se ne krše

**Glas:** miran, topao, kratak. Tišina je tema, ne neprijatelj.
**Autentične rečenice brenda (koristiti doslovno):**
- "NoMoreQuiet is not silence. It is the place where silence finally finds its voice."
- "Not therapy. Not coaching. A House."
- "One sentence. It doesn't have to be beautiful. Just true."
- "This is not a place to fix yourself. It is a place where you are allowed to be."

**Uvijek:** prvo lice, jedna misao po kartici, konkretno mjesto i vrijeme, bez rime.
**Nikad:**
- tvrdnja da je ovo terapija, lijek, izlječenje ili dijagnoza;
- „self-help" aforizam („Ti si dovoljna", „Pusti što te ne služi");
- lažna statistika i izmišljeni korisnici kao stvarni ljudi;
- pritisak i oskudnost („samo danas", „izgubićeš mjesto");
- emodži (0 u karticama, max 1 u reelsu);
- prikaz samopovređivanja, nasilja, detalja trauma.

**Etika koja se ne pregovara:**
1. **Anonimnost je obećanje.** Nikad ne objaviti tuđi unos bez izričite dozvole i bez uklanjanja prepoznatljivih detalja.
2. **Dok nema stvarnih korisnika, nema lažnih citata.** Vidi §6 — šta zamijeniti.
3. **Duboke teme idu sa diskretnim resursima.** Uz temu gubitka/beznadežnosti ide jedna mirna linija: „If this is heavier than words, please reach a person. Local lines vary — we list them at /voices." Brojeve provjeriti prije objave (Centar Srde 0800 300 303 za Srbiju; 988 za SAD).
4. **GDPR (EU):** email samo uz saglasnost, odjava u svakom mejlu, bez kupljenih lista.

---

## 3. Tri linije sadržaja

### L1 — FRAGMENTI (dnevno, glavni motor)
Jedna anonimna rečenica na zlatnoj točki, crna pozadina, čvor i „staro". Format koji se šeruje i koji **ne postoji nigdje drugdje** — to je vizuelni potpis NoMoreQuiet-a.
Izvor: `01-KARTICE-FRAGMENTI.md` (40 komada).
Platforme: Instagram feed + Story, Pinterest, TikTok (kao zadnji kadar reelsa).

### L2 — PITANJA (3× nedjeljno, motor pretrage i čuvanja)
Pitanje koje čovjek sačuva ili pošalje prijatelju. Ide u karticu, story, reel i na kraju u SEO članak.
Izvor: `02-PROMPTS-REFLEKSIJA.md` (60 pitanja) + `04-SEO-CLANCI.md`.

### L3 — PRIČA KUĆE (1× nedjeljno, motor povjerenja)
Manifest, zašto postoji sedam čvorova, šta je „Certificate of Exit", kako izgleda kad ti neko čita unos (Deep Read). Ovo gradi razlog za pretplatu.
Izvor: `03-SKRIPTE-REELS.md` (priče) + newsletter.

---

## 4. Nedjeljni ritam (kalendar)

| Dan | Instagram | TikTok | Pinterest | Newsletter/SEO |
|---|---|---|---|---|
| Pon | Kartica-fragment (feed) | Reel: pitanje dana | 3 kartice | — |
| Uto | Story: pitanje | — | 3 kartice | — |
| Sri | Kartica-fragment | Reel: fragment u pokretu | 3 kartice | — |
| Čet | Carousel: 5 pitanja | Reel: tišina/ASMR | 3 kartice | Email (welcome flow) |
| Pet | Kartica-fragment | Reel: „zašto pišemo" | 3 kartice | — |
| Sub | Story: iza kulisa Kuće | Reel: čvor nedjelje | 3 kartice | — |
| Ned | Kartica-fragment | — | 3 kartice | Priča Kuće + SEO članak |

**Obim:** 4 kartice + 4 reelsa + 21 pin + 1 članak + 1–2 mejla nedjeljno. To je izvodljivo jednom čovjeku za ~4 sata ako se snima u serijama (batch: 12 reelsa u jednom danu).

---

## 5. Lanac recikliranja (jedan rad → sedam komada)

```
1 PITANJE (npr. "What are you carrying that has no name?")
   ├─ 1. Kartica-fragment (feed/Story)      → L1
   ├─ 2. Reel 15s (hook = pitanje)          → L2
   ├─ 3. Story sa anketom (Da/Ne, Ne znam)  → L2
   ├─ 4. Pin (vertikalna kartica + pitanje) → L2
   ├─ 5. Email #3 u welcome sekvenci        → L3
   ├─ 6. SEO članak (600–900 riječi)        → L2
   └─ 7. Zadnji kadar reelsa = mapa + CTA "Leave one sentence."
```

**Pravilo:** nijedan sadržaj se ne pravi samo za jednu platformu. Ako ne može u tri formata — ne pravi se.

---

## 6. Nalazi iz koda koji moraju biti riješeni prije prve objave

Provjerio sam kod i radnu kopiju. Ovo nije „sitnica", ovo je sadržaj koji korisnik vidi:

| # | Nalaz | Zašto je problem za sadržaj | Predlog |
|---|---|---|---|
| 1 | `LandingHero.tsx` animira brojač na **fiksno 1.847** („lights burning on the pyramid") | Lažni društveni dokaz. Prvi ozbiljan novinar ili korisnik to provjeri i priča brenda pada. U EU je i rizik nepoštene poslovne prakse. | Dok nema stvarnih svjetala: „The map is open. Be one of the first lights." ili vratiti live brojač iz `/api/stats/lights` (postoji u commitu `1d17d80`, a u radnoj kopiji je obrisan) |
| 2 | `LandingLightCounter.tsx` — brojevi po čvorovima (847, 213, 156…) i „1,000 founding lights sealed" su **fiksni** | Isto kao #1, samo razrađeno po čvorovima | Live brojevi iz baze; ako je nula — prikazati nulu ili skriti sekciju |
| 3 | `LandingFoundingFragments.tsx` — 9 fragmenata sa izmišljenom starošću („312 days ago") se prikazuju kao **tuđi anonimni unosi** | Brend gradi povjerenje na anonimnosti; izmišljeni citati ga potkopavaju iz temelja | Do prvih stvarnih unosa: (a) labela „Example fragments — this is what a light looks like", ili (b) iskoristiti ih kao **poziv** („Write the first one."), ili (c) potpisati kao riječi osnivača Kuće |
| 4 | Tipfeler u hero naslovu: „The place where **mirno** finally finds its voice." | Srpska riječ u engleskom copy-ju na prvom ekranu | **Popravljeno** u ovoj sesiji → „quiet" |
| 5 | Radna kopija je **regresirana u odnosu na zadnji commit** (`70867bd`): obrisani `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/api/stats/lights/route.ts` i vraćene stare verzije `layout.tsx`, `tailwind.css`, `AppLayout.tsx` | Bez `sitemap.xml` i `robots.txt` **nijedan SEO članak se ne indeksira** — pola ovog plana ne radi | Vratiti iz commita: `git checkout HEAD -- src/app/sitemap.ts src/app/robots.ts src/app/api/stats/lights/route.ts src/app/layout.tsx src/styles/tailwind.css src/components/AppLayout.tsx` (prvo backup radne kopije) |
| 6 | `NEXT_PUBLIC_SITE_URL` je placeholder (Rocket domen) | Canonical, OG slike i svi dijeljeni linkovi vode na tuđi domen — sav sadržaj radi protiv nas | Postaviti na `https://nomorequiet.com` prije prve objave |
| 7 | Rute nisu RESTful (`/journal-screen`, `/sign-up-login-screen`) | Ružno u dijeljenim linkovima i u pretrazi | Kasnije: `/journal`, `/join`, sa redirectima |

**Preporuka reda:** #5 i #6 (tehnički), pa #1–#3 (istinitost), pa tek onda prva objava.

---

## 7. Kanali i zašto baš oni

| Kanal | Šta radi | Zašto |
|---|---|---|
| **Pinterest** | Kartice i pitanja | Najbolji odnos truda i prometa u niši „journaling prompts"; pin živi mjesecima i sam donosi pretragu |
| **Instagram** | Feed kartice, Story ankete, Reels | Estetika (crno/zlatno) je sama po sebi sadržaj; Story ankete daju signal koja pitanja rezonuju |
| **TikTok / Shorts** | Reels 12–25s | Jedini kanal koji može donijeti 10.000 posjeta bez budžeta, ako hook radi |
| **SEO blog** | 18 članaka (`04`) | Sporo, ali jedini kanal koji se sabira; Pinterest i SEO zajedno drže 60 % prometa |
| **Newsletter** | 7-mejl welcome (`05`) | Jedini kanal koji je „naš" — ne zavisi od algoritma |

**Ne trošiti:** plaćene reklame prije nego LTV pređe ~60 € (danas je ~30–40 €), i plaćeni influenseri.

---

## 8. SEO klasteri (detalji u `04-SEO-CLANCI.md`)

| Klaster | Primjer upita | Ciljna stranica |
|---|---|---|
| A — Shadow work prompts | „shadow work journal prompts" | `/journal-screen` (kasnije `/journal`) |
| B — Ne mogu da izrazim osjećanja | „i can't express my feelings journaling" | `/landing-page` |
| C — Noćno pisanje / pretjerano razmišljanje | „journaling before bed for overthinking" | `/journal-screen` |
| D — Privatnost i anonimnost | „anonymous online journal no sign up" | `/map-of-lights` |

---

## 9. Mjerenje

GA4 eventi **već postoje** u kodu (`src/lib/analytics.ts`):
`journal_entry_submitted` · `journal_upsell_shown` · `map_node_viewed` · `light_created` · `portal_round_completed` · `portal_completed` · `checkout_initiated` · `purchase_success`.

**UTM šema (obavezno za svaki link):**
```
https://nomorequiet.com/landing-page?utm_source=instagram&utm_medium=social&utm_campaign=fc01&utm_content=frag-014
```
- `utm_campaign`: `fc##` (fragment), `pr##` (pitanje), `re##` (reel), `seo##` (članak), `nl##` (newsletter)
- `utm_content`: ID kartice/reelsa iz paketa → tačno se vidi **koja kartica prodaje**.

**Tabela koju puniti nedjeljno (5 minuta):** objava → posjete → prvi unosi → plaćeni. Nakon 4 nedjelje znaš koja linija radi; ostalo se gasi.

---

## 10. Šta NE raditi

1. Ne kupovati email liste i ne slati svima „popust 50 %".
2. Ne objavljivati tuđe unose bez dozvole — ni anonimizovane.
3. Ne miješati brend sa „AI terapeut" pričom; AI je **ogledalo**, ne stručnjak.
4. Ne objavljivati 5 različitih formata dnevno — ritam iz §4 ili ništa.
5. Ne mijenjati cijene u sadržaju dok se ne odluči nova ljestvica (Companion 4,99 € ostaje istina dok se ne promijeni u Stripe-u).
6. Ne praviti sadržaj o „produktivnosti" i „jutarnjoj rutini uspješnih" — to je druga publika i ubija ton.

---

## 11. Prvih 7 dana (konkretno)

| Dan | Radnja | Izlaz |
|---|---|---|
| 1 | Vratiti `sitemap.ts`/`robots.ts`/live brojač, postaviti `NEXT_PUBLIC_SITE_URL`, backup | Tehnički preduslov |
| 2 | Odlučiti šta sa izmišljenim fragmentima i brojačem (§6, #1–3) | Istinit landing |
| 3 | Izabrati 12 kartica i 4 pitanja iz paketa, napraviti šablone u Canva/Figma | Vizuelni šablon |
| 4 | Snimiti 8 reelsa u jednoj seriji (batch) | Video banka |
| 5 | Otvoriti Pinterest + IG biznis nalog, postaviti UTM | Kanali spremni |
| 6 | Poslati welcome sekvencu na sopstveni test nalog, provjeriti svaki link | Email radi |
| 7 | Objaviti prve 3 kartice + 1 reel, početi tabelu mjerenja | Start |

---

*Ažurirati poslije svake nedjelje mjerenja. Kad neka linija sadržaja ne donese nijedan prvi unos u 4 nedjelje — gasi se.*
