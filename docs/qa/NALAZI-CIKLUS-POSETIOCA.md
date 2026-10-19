# Nalazi — ciklus posjetioca

**Datum:** 22. maj 2026. · **Način:** pravi browser (Edge 154) vođen preko CDP-a, 18 koraka, snimka svakog ekrana
**Alati:** [`ciklus-posetioca.mjs`](ciklus-posetioca.mjs) · [`ciklus-2-detalji.mjs`](ciklus-2-detalji.mjs) · snimke u [`snimke/`](snimke/) · sirovi log [`ciklus-log.json`](ciklus-log.json), [`ciklus-2-log.json`](ciklus-2-log.json)
**Ponavljanje:** `npm run start` pa `node docs/qa/ciklus-posetioca.mjs`

---

## Ukratko

Posjetilac koji danas dođe na sajt: **vidi lijepu i poštenu mapu, može da napiše rečenicu i dobije AI refleksiju — a onda sve nestane.** Registracija ne radi jer baza ne postoji, a nekoliko strana (uključujući admin panel) otvoreno je bez naloga.

- JS izuzeci: **0** (kod se ne ruši)
- Konzola (error/warn): **42** — sve jedno te isto: `ERR_NAME_NOT_RESOLVED` na `shmidovbjbvhcuolaksp.supabase.co`
- Neuspjeli zahtjevi: **69** (56 DNS + 13 prekinutih)
- HTTP ≥ 400: **5**

---

## BLOKERI (dok se ovo ne riješi, korisnika nema smisla puštati)

### 1. Baza ne postoji — sve ostalo je posljedica
`NEXT_PUBLIC_SUPABASE_URL` pokazuje na `https://shmidovbjbvhcuolaksp.supabase.co`, a DNS ga ne razrješava (`ERR_NAME_NOT_RESOLVED`, 56 zahtjeva). To znači: **registracija i prijava ne mogu da rade**, nijedan unos se ne čuva, mapa nikad neće dobiti prvo svjetlo, „Voices" ostaje prazan.
→ Treba: novi Supabase projekat (ili vraćanje starog) + migracije iz `supabase/migrations/`.

### 2. Gost može sve (nedosljedna zaštita ruta)
| Ruta | Gost | Ishod |
|---|---|---|
| `/dashboard` | ✅ preusmjeren na prijavu | dobro |
| `/user-settings` | ✅ preusmjeren na prijavu | dobro |
| `/journal-screen` | ❌ otvoren | piše, traži refleksiju, dobija je |
| `/portal` | ❌ otvoren | vidi se aplikacija |
| `/personal-arc` | ❌ otvoren | vidi se aplikacija |
| `/admin-panel` | ❌ otvoren | **„ADMIN · FOUNDER PANEL"** sa menijem Dashboard / Story Hub / Deep Read Queue / Crisis Inbox / Ritual Switch / Users |

Dokaz: [`snimke/10-gost-admin.png`](snimke/10-gost-admin.png), [`snimke/05-gost-journal.png`](snimke/05-gost-journal.png)
→ API-ji admin panela vraćaju 401 (podaci nisu procurili), ali interfejs i imena sekcija su javni.

### 3. AI ruta otvorena — tuđi ključ se troši
`POST /api/ai/chat-completion` **bez prijave → HTTP 200** i stvarni odgovor Gemini modela (`"ok"`). U kombinaciji sa #2, svako može besplatno da troši Gemini ključ preko tvog sajta.
→ Faza 4, stavka 4.1 plana.

---

## OZBILJNO (korisnik to vidi i osjeti)

### 4. Gost napiše rečenicu, dobije refleksiju — i izgubi je
Testirano: upisano 13 riječi u `/journal-screen` bez naloga → klik „RECEIVE YOUR REFLECTION" → **refleksija stiže** („REFLECTION RECEIVED · THE HOUSE REFLECTS · RTANJ"), a unos se **ne čuva** (nema sesije). Nigdje se ne kaže da tekst neće biti sačuvan. Prvi susret završava gubitkom onoga što je čovjek napisao — najgore moguće prvo iskustvo za ovakav koncept.

### 5. AI ne govori glasom Kuće
Odgovor počinje sa **„Let's break down the transformation:"** — to je analitičarski ton, ne ogledalo. Uz to izlazi kao sirov tekst (vidi [`snimke/17-gost-refleksija.png`](snimke/17-gost-refleksija.png)). Prompt za refleksiju treba preurediti: bez analize, bez nabrajanja, bez savjeta.

### 6. Admin panel prikazuje izmišljene brojke
Dok piše „Failed to load analytics", ispod se crta **grafikon sa lažnim podacima** („Entries · New Users · Revenue", „APR 21-27, 2026", raspodjela depth skorova), a u meniju stoje hardkodovani bedževi (Crisis Inbox 1, Deep Read Queue 1). Isti problem klase kao lažni brojevi na landingu i mapi — samo u adminu.

### 7. Mobilna mapa je neupotrebljiva
Na 390 px sidebar zauzima **cijeli ekran**, a mapa ostaje kao uski komadić sa jednom točkom. Dokaz: [`snimke/14-mobilna-mapa.png`](snimke/14-mobilna-mapa.png). A mobilni je bio jedan od glavnih ciljeva projekta.

### 8. Popravljeno u ovoj sesiji (bilo je vidljivo)
- **Dupli filter na mapi**: „Mount Kailash" i „Mount Shasta" su se oba skraćivala na **„MOUNT"** — dva ista dugmeta. Sada: KAILASH, SHASTA (i ostali jedinstveni).
- **`NaN AVG DEPTH`** u dnevniku kad nema unosa → sada `—`.
- **Fiksni „26 DAYS"** za potpuno novog posjetioca → sada stvarni broj dana od prvog unosa (0 ako nema unosa).
- **Mrtvi `seedEntries`** — 8 izmišljenih dnevnika sa izmišljenim AI odgovorima („The stone knows when it is time.") u `JournalLayout.tsx`. Nisu se prikazivali, ali su bili minsko polje: da ih je neko uključio kao demo, tuđi lažni život bi se pojavio kao nečiji Vault. Uklonjeni.

---

## SREDNJE (kvari utisak ili SEO)

| # | Nalaz | Dokaz |
|---|---|---|
| 9 | `robots.txt` i `sitemap.xml` → **404** (fajlovi izbrisani iz radnog stabla) | log |
| 10 | `/api/deep-read/weekly-limit` → **500** na `/pricing` (strana tiho prikazuje rezervnih „5 mjesta") | log |
| 11 | **Svi ekrani imaju isti naslov** („NoMoreQuiet — The Place Where Silence Finds Its Voice"); nema `metadata`, canonical-a ni OG slike | koraci 05–15 |
| 12 | 404 strana vraća status 404, ali naslov je sajtov — bez svog naslova | `snimke/15-404.png` |
| 13 | Landing i pricing još nude cijene (1 € / 10 € / 4,99 € / 49 €) — to je Faza 1, stavke 1.5–1.7 | koraci 12–13 |
| 14 | Gostu se u dnevniku nudi **„BURN THE VAULT"** (brisanje svega) — dugme bez smisla bez naloga | `snimke/05-gost-journal.png` |
| 15 | Refleksija i dalje radi i kad baza padne → korisnik ne zna da ništa nije sačuvano | korak B |

---

## Šta je dobro (da se ne pokvari)

- Mapa kao prva strana radi i **ne laže više**: prazna mapa, poštena rečenica, bez brojeva.
- Gost **ne vidi** nijednu grešku u interfejsu — kod se ne ruši (0 izuzetaka), strana se uvijek učita.
- Vizuelni identitet je dosljedan i lijep na desktopu; tipografija, zlato na crnom, točke svjetla.
- Cijeli lanac „mapa → čvor → CTA → prijava" vodi tamo gdje treba (`/sign-up-login-screen`).

---

## Preporučen red popravki

1. **Baza** (novi Supabase projekat + migracije) — bez ovoga ništa nema smisla mjeriti.
2. **Zaštita ruta** (`/admin-panel` odmah, pa ostalo) + **auth na AI ruti** — Faza 4.
3. **Gost-pisanje pretvoriti u namjeru**: ili zaključati, ili (po konceptu) dozvoliti prvi unos i **sačuvati ga bez naloga** uz jasnu poruku. Trenutno je najgore od oba — dozvoljeno, a ne sačuvano.
4. **Prompt refleksije** — da govori kao Kuća, ne kao analitičar.
5. **Mobilna mapa** (sidebar u donji list ili drawer).
6. **Admin panel**: skloniti lažni grafikon i bedževe; zaključati.
7. `robots`/`sitemap`/`metadata` — Faza 5.
