# Koncept v2 — Kuća bez naplate

**Datum:** 22. maj 2026. · **Status:** predlog za dogovor · **Pratnja:** `sadrzaj/00-PLAN-SADRZAJA.md`, `sadrzaj/06-SABLON-KARTICE.md`

> Ovaj dokument opisuje **samo koncept**: šta Kuća jeste, kako izgleda prvi susret, šta je besplatno i šta čeka kasniji dogovor.
> Ne dira kod. Iz njega se posle vadi lista izmjena.

---

## 1. Šta je Kuća

**NoMoreQuiet je mjesto gdje jedna istinita rečenica postaje svjetlo na zajedničkoj mapi.**
Napisana je anonimno, ostaje trajno, i ne mjeri se ničim — ni lajkovima, ni brojem, ni rangom.

**Šta Kuća nije:** nije društvena mreža, nije terapija, nije kurs ličnog razvoja, nije aplikacija za produktivnost.
Kuća **ne liječi, ne savjetuje i ne ocjenjuje**. Kuća prima.

---

## 2. Jedan ulaz: mapa

Prvo što čovjek vidi **nije** tekst o nama, nego **mapa svjetala** — tuđe rečenice koje već gore.

- Bez naloga se vidi sve. Bez naloga se **ne može** ništa lajkovati, komentarisati ni pratiti (jer toga nema).
- Jedno dugme: **„Leave one sentence"**.
- Prvi susret traje 10 sekundi: pogledaš mapu → razumiješ šta je → ostaviš svoju rečenicu ili odeš.

**Prazna mapa je dio priče, ne sramota.** Dok nema unosa, stoji:
`The first light on Rtanj hasn't been written yet.`

---

## 3. Sedam čvorova — svaki nosi jedno pitanje

Čvorovi nisu ukras. Svaki je jedno ljudsko pitanje, i zato pisanje dobija smjer bez ijednog savjeta.

| Čvor | Postojeća labela | Pitanje koje nosi | Na engleskom |
|---|---|---|---|
| **Rtanj** | THE HOUSE | Šta nosim sa sobom? | *What are you carrying?* |
| **Sedona** | THE VORTEX | Šta obilazim u krug? | *What are you walking around?* |
| **Kailash** | THE CROWN | Šta sam izgubio? | *What did you lose?* |
| **Shasta** | THE SOURCE | Šta još želim? | *What do you still want?* |
| **Glastonbury** | THE TOR | Šta pokušavam da oprostim? | *What are you trying to forgive?* |
| **Machu Picchu** | THE CROSSING | Šta me je naučilo? | *What did it teach you?* |
| **Es Vedrà** | THE MAGNET | Šta ostavljam za sobom? | *What are you leaving behind?* |

Mapa tako postaje **pejzaž ljudskog iskustva**: vidiš gdje ljudi nose, gdje gube, gdje praštaju. To je nešto što nijedan dnevnik nema.

---

## 4. Ponoćni ritual — „Kuća diše"

**Kuća ima svoje vrijeme: ponoć na Rtnju.** U tom trenutku sva upaljena svjetla zajedno zasvijetle jače, na šezdeset sekundi, i vrate se u mir.

- Vidi se samo svjetlo i jedna rečenica: `The House is breathing.`
- Nigdje se ne piše **koliko** ih je — Kuća ne mjeri. Čovjek vidi da nije sam, ali ne dobija broj.
- Traje minut, pa nestane. Ko je propustio — dođe sutra.

**Zašto je ovo najvažniji dio koncepta:** to je jedini razlog za vraćanje koji konkurent ne može kopirati, a ne košta ništa. Ritual, ne obaveza. Bez serija (streak), bez krivice, bez obavještenja koja pritiskaju.

---

## 5. Pravila Kuće (ustav — ne mijenja se bez dogovora)

1. **Anonimnost je obećanje.** Nikad se ne objavljuje tuđi unos, ni anonimizovan, bez dozvole autora.
2. **Kuća ne mjeri.** Nema lajkova, brojača pregleda, pratilaca, rang-lista, „najboljih" rečenica.
3. **Nema savjeta.** Ni od nas, ni od AI-ja, ni između ljudi. Nema komentara.
4. **Pisanje je uvijek besplatno.** Nikad iza naplate, nikad ograničeno brojem riječi.
5. **Krizna pomoć je uvijek besplatna** i nikad se ne naplaćuje, ne reklamira i ne koristi za rast.
6. **Kuća ne zadržava.** „Burn Vault" briše zauvek, „Certificate of Exit" je stvarni izlaz.
7. **AI je ogledalo, ne stručnjak.** Nikad ne tumači, ne dijagnostikuje i ne obećava.

---

## 6. Kapija povjerenja (mora postojati i kad je sve besplatno)

Bez naplate nema prirodnog filtera, a anonimnost bez filtera se pokvari u mjesec dana. Zato uz besplatan koncept **obavezno** ide:

- zaštita AI rute (samo ulogovan/aktiviran korisnik) i ograničenje broja unosa po satu;
- tiho dugme **„Prijavi svjetlo"** i uklanjanje bez javne drame;
- minimalna provjera prije pojave na mapi (bez ljudskog čitanja — pravilo, ne cenzura);
- jasna stranica privatnosti i pravila, na ljudskom jeziku;
- nula Rocket skripti i nula vanjskih pratilaca ponašanja (privatnost je dio ponude).

---

## 7. Šta je besplatno, a šta čeka dogovor

**Besplatno zauvijek (i tako i ostaje):** pisanje · mapa · svjetlo na mapi · ponoćni ritual · „Burn Vault" i izlaz · krizna pomoć · sve javno čitanje mape.

**Čeka naš kasniji dogovor:** članstvo, sezonski rituali, Deep Read (čovjek čita), poklon-svjetlo, B2B, štampana „Knjiga svjetala".

**Tehnički:** naplata se **ne briše iz koda**, samo se gasi jednim prekidačem (`PAYWALL=false`): skrivena stranica sa cijenama, ugašeni Stripe pozivi, ugašen prodajni prozorčić posle pisanja (`recommend_upsell`). Kad se dogovorimo — uključujemo, ne prepisujemo.

---

## 8. Kako ćemo znati da koncept drži

Tri brojke, mjesečno, ništa više:

| Šta mjerimo | Zdravo | Ako je ispod |
|---|---|---|
| Vraćanje 7. dan | 20 %+ | Koncept ne drži; mijenja se ritual, ne cijena |
| Broj fragmenata po čovjeku | 3+ | Ulaz je težak; pojednostaviti prvi unos |
| Prisustvo u ponoćnom minutu | 10 %+ aktivnih te nedjelje | Ritual se ne vidi; mijenja se trenutak ili najava |

Tek kad ove tri brojke budu zdrave, smisleno je razgovarati **šta** naplatiti.

---

## 9. Iz ovoga slijedi (lista za kod, kasnije)

1. Prva strana = mapa (landing tekst se pomjera ispod mape).
2. Sedam čvorova dobija pitanje i kratak opis (tekst, bez novih tabela).
3. Ponoćni ritual (vizuelno pulsiranje + jedna rečenica; „Rtanj midnight").
4. Skloniti: cijene, „MOST CHOSEN" bedž, prodajni prozorčić, lažni brojači (1.847) i izmišljeni fragmenti.
5. Kapija povjerenja: zaštita AI rute, ograničenje unosa, „Prijavi svjetlo".
6. Prekidač `PAYWALL` — naplata ugašena, kod ostaje.
7. `sitemap.ts` / `robots.ts` i pravi `NEXT_PUBLIC_SITE_URL` (da mapa bude nađena).

---

## 10. Odluke (zaključano 22.05.2026)

1. **Jezik: engleski** — sučelje i sadržaj na engleskom. Srpski dolazi kasnije kao prevod (paket sadržaja je već dvojezičan, pa kartice mogu i na srpskom za lokalnu publiku).
2. **Ponoć na Rtnju — jedinstveno vrijeme za sve.** Kuća ima svoj sat: 00:00 po srednjoevropskom. Isti trenutak za cijeli svijet; ime je simbol, ne opis nečijeg lokalnog vremena. (00:00 CET = 18:00 Njujork · 15:00 Los Anđeles · 08:00 Tokio — zato se u tekstu zove **„The Hour"**, a ne „noć".)
3. **Prvi unos bez naloga** — anonimni ključ u browseru, nalog je opcija kasnije („zadrži ovu rečenicu"). Uz to obavezno: ograničenje 3 unosa na sat po uređaju, laka automatska provjera prije pojave na mapi, i dugme „Prijavi svjetlo".

---

*Dokument je zaključan. Lista izmjena u kodu je u [`PLAN-IZMJENA-KONCEPT-V2.md`](PLAN-IZMJENA-KONCEPT-V2.md).*
