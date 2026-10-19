# 04 — SEO članci (briefovi, klasteri, tehnički preduslovi, plan objava)

> **Projekat:** NoMoreQuiet (NMQ) — reflektivno pisanje: dnevnik + AI ogledalo + zajednička „Map of Lights"
> **Tržište:** engleski govorno područje (US / UK / EU), jezik sadržaja: **EN**
> **Stack:** Next.js (App Router), trenutne rute: `/landing-page`, `/map-of-lights`, `/voices`, `/journal-screen`, `/portal`, `/personal-arc`, `/pricing`
> **Status dokumenta:** plan sadržaja + tehnički SEO preduslovi. Sve provjere u odjeljku 4 su urađene na stvarnom kodu i repozitorijumu (dokazi navedeni po stavci).

---

## 0. Crvene linije glasa (važi za svaki članak, naslov i meta opis)

Ovo nije „ton preporuke" — ovo je uslov bez kojeg se tekst ne objavljuje.

- **Zabranjeno u sadržaju, naslovima, meta opisima i slugovima:** `cure`, `treat depression`, `heal your anxiety`, `fix yourself`, `overcome trauma in 30 days`, medicinske/kliničke tvrdnje, dijagnoze, lažne statistike, procenti bez izvora, obećanja ishoda.
- **Obavezno priznanje granice** u svakom tekstu koji dodiruje mentalno zdravlje: *„This is a reflection, not therapy. If you are in crisis, please contact emergency services or a mental health professional."* (identična formulacija već postoji u aplikaciji — `src/app/journal-screen/components/JournalReflection.tsx`).
- **Nikad ne tvrdi da zamjenjuje terapiju, psihoterapiju ili coaching.** Ključna rečenica brenda: **„Not therapy. Not coaching. A House."**
- **Nikad ne obećavaj izlječenje anksioznosti ili depresije.** Tema smije biti prisutna (npr. anksioznost), ali tekst govori o *pisanju i ritualu*, ne o *ishodu*.
- **Bez pritiska u CTA.** Nema „Start your healing journey today", nema brojača, nema rokova.
- **Krizni resursi** (US 988, UK NHS 111 opcija 2, EU 112) — prije objave provjeriti zvaničnu stranicu i linkovati nju, nikad ne navoditi broj bez provjere.
- **Riječi koje koristimo:** House, room, light, node, silence, mountain, mirror, ritual, prompt, writing, listening, unhurried.
- **Riječi koje izbjegavamo:** journey (kao kliše), transform, unlock, breakthrough, hack, secret, manifest, glow up.

---

## 1. Uvod — strategija u 10 linija

1. **Cilj nije saobraćaj, nego ulaz u Kuću.** Svaki članak postoji da čitaoca odvede u jedno od dva stanja: „imam riječ za ono što nosim" ili „ovdje smijem da pišem bez straha" — jer to su jedina dva razloga zbog kojih neko otvara aplikaciju za reflektivno pisanje.
2. **Radimo 4 klastera, ne 40 tema.** A = shadow work promptovi, B = „nemam šta da kažem" / neumijem da imenujem osjećanja, C = noćno pisanje i overthinking, D = privatnost i anonimno pisanje. Sve ostalo je šum.
3. **Prioritet je A1 i B1, ne „dnevnik" kao pojam.** Upit `journaling` je zasićen i vodi na lifestyle blogove; upiti sa `prompts`, `nothing to say`, `can't name feelings`, `2 am`, `private` imaju manju konkurenciju i mnogo jasniju namjeru.
4. **Long-tail je jedini realan ulaz za nov domen.** Bez autoriteta, realno rangiramo na 4–7 riječi (`shadow work journaling prompts for beginners`, `journaling when you have nothing to say`), a ne na glavi `shadow work`.
5. **„Prompt" upiti su najbolji tip upita za NMQ.** Oni imaju *trenutnu* namjeru (korisnik hoće da piše sada, večeras), lako se recikliraju u Reels i kartice, i prirodno vode u `/journal` gdje proizvod stvarno radi.
6. **Zato A ima najviše promptova, a B najviše empatije.** A hvata volumen, B hvata identitet korisnika koji je NMQ-ov stvarni korisnik: onaj koji je odustao od dnevnika jer „ne zna šta da napiše".
7. **C hvata trenutak dana, D hvata nepovjerenje.** Noć je najčešći sat pisanja, a privatnost je najčešća prepreka; C i D su niži prioritet samo zato što imaju manji volumen, ne zato što su slabiji argumenti.
8. **Svaki članak ima jednu primarnu rutu u proizvod.** Nema članka bez internog linka; ako ne znamo u koju sobu vodi, tekst nije završen.
9. **Vezivanje za proizvod ide po formuli:** *problem (1 H2) → zašto klasičan savjet ne radi (1 H2) → promptovi/ritual (3–4 H2) → jedna rečenica granice „not therapy" → miran CTA u sobu*. Nikad obrnuto (prvo prodaja, pa sadržaj).
10. **Mjerimo tri stvari, ne dvadeset:** indeksirane stranice, ulaz iz long-tail upita, i klik na `Begin Writing`. Ostalo je kozmetika.

---

## 2. Četiri klastera

| # | Klaster | Primarni upit | Namjera | Ciljna stranica | Prioritet |
|---|---|---|---|---|---|
| **A** | Shadow work journaling prompts | `shadow work journaling prompts` | Informaciona + trenutna radnja (hoće prompt sada) | `/guides/shadow-work-journaling-prompts` → `/journal` | **1** |
| **B** | Journaling za one koji „nemaju šta da kažu" | `journaling when you have nothing to say` | Informaciona + emocionalna (traži dozvolu da ne zna) | `/guides/journaling-when-you-have-nothing-to-say` → `/journal` | **1** |
| **C** | Noćno pisanje / san i overthinking | `night journaling before sleep` | Ritualna (traži korak-po-korak ritual za večeras) | `/guides/night-journaling-ritual-before-sleep` → `/journal`, `/personal-arc` | **2** |
| **D** | Privatnost digitalnog dnevnika / anonimno pisanje | `is a digital journal private` | Komercijalna istraga + nepovjerenje (traži dokaz) | `/guides/is-a-digital-journal-private` → `/pricing` | **3** |

**Zašto takav prioritet:**

- **A = 1** — najveći volumen među četiri klastera, najlakše se reciklira (svaki prompt je zaseban Reels), i upit je *radni*: korisnik želi da piše odmah.
- **B = 1** — najmanja konkurencija, najveća podudarnost sa stvarnim korisnikom NMQ-a i najjači diferencijator (niko drugi ne piše ozbiljno za ljude koji ne znaju šta bi napisali).
- **C = 2** — solidan volumen, ali vodi na dnevni ritual koji se teže pretvara u pretplatu; jak kanal za email, ne za konverziju.
- **D = 3** — mali volumen, ali visok kvalitet posjete (upit dolazi od nepovjerljivog korisnika koji je već blizu odluke) i jedini klaster koji prirodno vodi na `/pricing`. Kasnije, ne nikad.

**Veza klaster → soba u proizvodu:**

| Klaster | Ruta u proizvod | Zašto ta ruta |
|---|---|---|
| A | `/journal` (pisanje + AI ogledalo) | Prompt se odmah upisuje; `Mirror` vraća refleksiju |
| B | `/journal` (prazan editor + „The House is listening") | Proizvod je namjerno napravljen za prazan list |
| C | `/personal-arc` + `/journal` | Noćno pisanje gradi niz; `Personal Arc` pokazuje obrazac kroz dane |
| D | `/pricing` + `/journal` (`Burn Vault`) | Privatnost je dio ponude; `Burn Vault` je dokaz koji se može pokazati |

---

## 3. Osamnaest briefova za članke

**Konvencije za sve briefove:**

- **Ruta članka:** `/guides/<slug>` (hub `/guides`), kategorija-hub `/guides/<klaster>` — vidi odjeljak 4, stavka 4.4.
- **Ruta `journal` u briefovima** označava **ciljnu RESTful rutu** `/journal` (danas `/journal-screen`). Isto važi za `/sign-in` (danas `/sign-up-login-screen`).
- **Interni linkovi:** `/landing-page`, `/pricing`, `/map-of-lights`, `/voices`, `/guides` su **javne i indeksabilne** — njih linkujemo tijelom teksta. `/journal`, `/portal`, `/personal-arc`, `/dashboard` su **prijavom zaštićene aplikativne stranice** — do njih vodi isključivo CTA (i te stranice moraju biti `noindex`, vidi odjeljak 4).
- **Prioritet:** 1 = objaviti u prva 4–6 sedmica, 2 = naredni ciklus, 3 = kad klaster A/B već rangira.
- **Disclaimer blok** (skraćeno „DISCLAIMER" u nastavku) = gore navedena rečenica iz odjeljka 0, u podnožju svakog teksta koji dodiruje mentalno zdravlje.

---

### KLASTER A — Shadow work journaling prompts

---

#### A1 — Shadow Work Journaling Prompts for Quiet People

- **Naslov (EN, 47):** Shadow Work Journaling Prompts for Quiet People
- **Slug:** `shadow-work-journaling-prompts`
- **Meta description (EN, 137):** `57 shadow work journaling prompts written for quiet people. Plain language, no jargon, no rush — pick one question and see what surfaces.`
- **Primarni upit:** `shadow work journaling prompts`
- **Sekundarni / long-tail:**
  - `shadow work prompts for quiet people`
  - `shadow work journaling prompts pdf list`
  - `best shadow work journal questions`
  - `shadow work prompts for beginners free`
  - `shadow work journaling ideas for introverts`
  - `how many shadow work prompts should i do a day`
- **Namjera korisnika:** hoće gotovu listu pitanja i da večeras napiše prvi unos — ne traži teoriju.
- **Obim:** 1.900–2.300 riječi. **Prioritet: 1**
- **Struktura H2:**
  1. `What Shadow Work Journaling Actually Is (in Plain Words)`
  2. `Why Quiet People Often Do This Work Better`
  3. `How to Use These Prompts Without Overwhelming Yourself`
  4. `57 Shadow Work Journaling Prompts` (podijeljeno u 5 H3 grupa: Beginnings, Anger & Resentment, Shame, Boundaries, Wanting)
  5. `One Prompt, Ten Minutes: A Slow Example`
  6. `What to Do When a Prompt Brings Up Something Heavy`
  7. `Prompts You Should Skip for Now`
  8. `Where to Keep This Writing`
- **Interni linkovi:**
  - `/journal` — kroz CTA, jer je to mjesto gdje prompt postaje unos (login-gated → samo kroz CTA).
  - `/landing-page` — iz H2 #1, da čitalac vidi šta je Kuća prije nego što ostavi mejl.
  - `/voices` — iz H2 #6, kao dokaz da su teški unosi već postojali kod drugih ljudi (bez brojeva i bez citata bez dozvole).
  - `/guides/shadow-work-prompts-for-beginners` (A2) — iz H2 #3, za onoga koga lista plaši.
  - `/guides/shadow-work-vs-therapy` (A5) — iz H2 #6, jedna rečenica + link, obavezan.
- **CTA (EN):** `If you want a room to write these in, the door is open — begin writing when you're ready.`
- **Napomena o riziku:** „Shadow work" se u online sadržaju često prodaje kao terapija. Zabranjeno: tvrditi da zamjenjuje terapiju, obećavati „otpuštanje traume", tvrditi da je potisnuto sjećanje bezbjedno vaditi. Obavezan DISCLAIMER + H2 #6 koji eksplicitno šalje teške slučajeve profesionalcu. Nikakve statistike o efektima.

---

#### A2 — Shadow Work Prompts for Beginners: Start Here

- **Naslov (EN, 45):** Shadow Work Prompts for Beginners: Start Here
- **Slug:** `shadow-work-prompts-for-beginners`
- **Meta description (EN, 137):** `New to shadow work? Start with nine gentle prompts, one short rule, and a ten-minute habit. No jargon, no pressure, nothing to get right.`
- **Primarni upit:** `shadow work prompts for beginners`
- **Sekundarni / long-tail:**
  - `how to start shadow work journaling`
  - `easy shadow work prompts`
  - `shadow work for beginners step by step`
  - `first shadow work journal entry example`
  - `shadow work without a therapist`
  - `shadow work prompt list for absolute beginners`
- **Namjera korisnika:** plaši se da radi nešto pogrešno i traži najmanji mogući prvi korak.
- **Obim:** 1.500–1.900 riječi. **Prioritet: 1**
- **Struktura H2:**
  1. `The Only Rule That Matters at the Start`
  2. `What You Are Not Supposed to Feel After Writing`
  3. `Nine Beginner Prompts (and What Each One Is Really Asking)`
  4. `A Ten-Minute First Entry, Step by Step`
  5. `Three Beginner Mistakes That Make People Quit`
  6. `When It Stops Feeling Safe to Continue`
  7. `Writing Regularly Without Turning It Into a Task`
- **Interni linkovi:**
  - `/journal` — H2 #4, jer desetominutni unos je tačno ono što editor radi (login-gated → CTA).
  - `/guides/journaling-when-you-have-nothing-to-say` (B1) — iz H2 #2; ovo je najčešći razlog odustajanja.
  - `/guides/shadow-work-journaling-prompts` (A1) — iz H2 #3, za one koji žele punu listu.
  - `/map-of-lights` — iz H2 #7, kao miran način da pisanje ne bude samo u glavi.
  - `/pricing` — jednom, u fusnoti: da se vidi razlika između besplatne Kuće i dubljih soba.
- **CTA (EN):** `Pick one prompt. Write four lines. You can stop there.`
- **Napomena o riziku:** „Beginner" tekstovi najlakše skliznu u obećanje rezultata. Zabranjeno: „you will feel lighter after 7 days", bilo kakav rok, bilo kakva tvrdnja o ishodu. DISCLAIMER obavezan.

---

#### A3 — Journal Prompts for Anxiety: A Gentle First Step

- **Naslov (EN, 48):** Journal Prompts for Anxiety: A Gentle First Step
- **Slug:** `journal-prompts-for-anxiety`
- **Meta description (EN, 132):** `Twelve journaling prompts for anxious moments, written to slow the page down rather than fix you. This is a reflection, not therapy.`
- **Primarni upit:** `journal prompts for anxiety`
- **Sekundarni / long-tail:**
  - `what to write when anxious`
  - `journaling prompts for overthinking`
  - `anxiety journal prompts for nighttime`
  - `does journaling help with anxiety`
  - `how to journal when you are panicking`
  - `calming journal prompts before bed`
- **Namjera korisnika:** uznemiren je u ovom trenutku i traži nešto što može da uradi odmah, bez rizika da pogorša stanje.
- **Obim:** 1.400–1.800 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `What Journaling Can and Cannot Do for Anxiety` (ovdje eksplicitno: *ne liječi anksioznost*)
  2. `Start With the Body, Not the Story`
  3. `Twelve Prompts for Anxious Moments`
  4. `What to Write When You Cannot Write Sentences`
  5. `Prompts to Avoid When You Are Already Spinning`
  6. `If It Is More Than a Loud Evening`
  7. `A Small Nightly Ritual`
- **Interni linkovi:**
  - `/journal` — H2 #3 i #7, kroz CTA (login-gated).
  - `/guides/night-journaling-ritual-before-sleep` (C1) — iz H2 #7, jer anksioznost je najčešće uveče.
  - `/guides/journaling-when-you-cannot-identify-emotions` (B3) — iz H2 #4.
  - `/landing-page` — iz H2 #1, uz rečenicu granice.
  - `/personal-arc` — H2 #7, jednom, kao dugi pogled (login-gated → CTA).
- **CTA (EN):** `You don't have to solve it tonight. You can just write one line.`
- **Napomena o riziku:** **najosjetljiviji tekst u klasteru.** Zabranjeno: `cure`, `treat`, `beat anxiety`, tvrdnje o naučno dokazanom efektu bez izvora, savjet o prekidu ili promjeni terapije/lijekova. H2 #1 i #6 su obavezni. U H2 #6 navesti opštu uputu „contact emergency services or a mental health professional" i linkovati zvanične stranice (provjeriti prije objave). Nikakve ankete, nikakvi procenti.

---

#### A4 — What Is Shadow Work? A Plain-Language Guide

- **Naslov (EN, 43):** What Is Shadow Work? A Plain-Language Guide
- **Slug:** `what-is-shadow-work`
- **Meta description (EN, 139):** `A plain-language guide to shadow work: where the idea comes from, what it is not, and how people actually do it with a pen and ten minutes.`
- **Primarni upit:** `what is shadow work`
- **Sekundarni / long-tail:**
  - `shadow work meaning`
  - `is shadow work real`
  - `shadow work explained simply`
  - `where does shadow work come from`
  - `shadow work vs inner child work`
  - `is shadow work safe`
- **Namjera korisnika:** istražuje pojam prije nego što se uključi; traži definiciju i legitimitet.
- **Obim:** 1.600–2.000 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `The Short Definition`
  2. `Where the Term Comes From (Honestly)`
  3. `What Shadow Work Is Not`
  4. `Why It Caught On Outside the Clinic`
  5. `What It Looks Like in Practice: One Page`
  6. `Common Criticisms, Answered Fairly`
  7. `How to Try It Without Buying Anything`
- **Interni linkovi:**
  - `/guides/shadow-work-journaling-prompts` (A1) — H2 #5 i #7; ovaj tekst je „definicija", A1 je „rad".
  - `/guides/shadow-work-vs-therapy` (A5) — H2 #3, obavezan link.
  - `/landing-page` — H2 #7, kao primjer alata koji ne obećava ishod.
  - `/voices` — H2 #5, jedan konkretan javni zapis (samo ako je autor dao izričitu dozvolu).
- **CTA (EN):** `Understanding it is enough for today. Writing comes later, if you want.`
- **Napomena o riziku:** H2 #2 i #3 su odbrambeni pojas. Zabranjeno: predstavljati Junga kao klinički dokaz, tvrditi naučni konsenzus, miješati duhovnost i psihologiju bez ograde. Obavezno reći da termin živi i van kliničkog konteksta i da nije zamjena za terapiju. DISCLAIMER obavezan.

---

#### A5 — Shadow Work vs Therapy: What Journaling Can Do

- **Naslov (EN, 46):** Shadow Work vs Therapy: What Journaling Can Do
- **Slug:** `shadow-work-vs-therapy`
- **Meta description (EN, 143):** `Shadow work and therapy are not the same thing. Here is where journaling helps, where it stops, and how to tell when you need a person instead.`
- **Primarni upit:** `shadow work vs therapy`
- **Sekundarni / long-tail:**
  - `can shadow work replace therapy`
  - `is journaling a substitute for therapy`
  - `shadow work without a therapist`
  - `when to see a therapist instead of journaling`
  - `journaling vs therapy for trauma`
  - `is it safe to do shadow work alone`
- **Namjera korisnika:** bira između dva puta i traži iskrenu granicu, ne prodaju.
- **Obim:** 1.800–2.300 riječi. **Prioritet: 1** (ovo je zaštitni tekst brenda)
- **Struktura H2:**
  1. `Two Different Rooms, Not Two Versions of One Thing`
  2. `What Journaling Genuinely Gives You`
  3. `What It Cannot Give You`
  4. `Four Signs You Need a Person, Not a Page`
  5. `Why We Say "Not Therapy. Not Coaching. A House."`
  6. `How to Use Both, Without Confusing Them`
  7. `If You Are in Crisis Right Now`
- **Interni linkovi:**
  - `/pricing` — H2 #5, da se vidi šta Kuća jeste i šta nije (bez pritiska, u kontekstu granice).
  - `/landing-page` — H2 #5, primarna.
  - `/guides/what-is-shadow-work` (A4) — H2 #1.
  - `/journal` — H2 #6, kroz CTA (login-gated).
  - `/guides/journal-prompts-for-anxiety` (A3) — H2 #4, za one koji se prepoznaju.
- **CTA (EN):** `If writing helps, write. If you need a person, find one — and keep the House for the quiet hours.`
- **Napomena o riziku:** **tekst nosi najveću odgovornost u cijelom planu.** Zabranjeno: implicitno „terapija ti ne treba", suprotstavljanje pisanja i stručne pomoći, bilo kakva tvrdnja da je pisanje dovoljno. H2 #4 i #7 su obavezni i ne smiju se skraćivati. Krizni resursi samo kroz zvanične, provjerene linkove. Ovo je i jedini tekst gdje je dozvoljeno citirati brend-rečenicu u H2.

---

### KLASTER B — Journaling za one koji „nemaju šta da kažu"

---

#### B1 — Journaling When You Have Nothing to Say

- **Naslov (EN, 39):** Journaling When You Have Nothing to Say
- **Slug:** `journaling-when-you-have-nothing-to-say`
- **Meta description (EN, 143):** `"I have nothing to say" is the most common reason people quit journaling. Here is what to write instead — six openings that ask nothing of you.`
- **Primarni upit:** `journaling when you have nothing to say`
- **Sekundarni / long-tail:**
  - `what to write in a journal when you have nothing to write about`
  - `i want to journal but i have nothing to say`
  - `journaling when your mind is blank`
  - `how to journal when you feel empty`
  - `journal prompts for when nothing is happening`
  - `why i quit journaling`
- **Namjera korisnika:** traži dozvolu i tehniku da piše bez sadržaja; često je već jednom odustao.
- **Obim:** 1.500–1.800 riječi. **Prioritet: 1**
- **Struktura H2:**
  1. `The Blank Page Is Not the Problem`
  2. `Why "Just Write Anything" Never Worked`
  3. `Six Openings for a Day With Nothing in It`
  4. `Writing About Not Writing`
  5. `The One-Sentence Entry (and Why It Counts)`
  6. `If Your Mind Is Blank Because You Are Tired, Not Empty`
  7. `Making It a Habit Without Making It a Chore`
- **Interni linkovi:**
  - `/journal` — H2 #3 i #5, kroz CTA; editor ima stanje „The House is listening" koje je tačno za ovaj slučaj (login-gated).
  - `/landing-page` — H2 #2, jer proizvod je napravljen za prazan list.
  - `/guides/journaling-when-you-cannot-identify-emotions` (B3) — H2 #1, za one koji ne mogu ni da imenuju.
  - `/guides/five-minute-journaling-for-people-who-hate-it` (B4) — H2 #7.
  - `/voices` — H2 #5, jedan kratak javni zapis kao dokaz da kratko piše.
- **CTA (EN):** `Write one sentence about having nothing to say. That is a real entry.`
- **Napomena o riziku:** tema graniči sa emocionalnom tupošću i iscrpljenošću. Zabranjeno: poistovjećivati „nemam šta da kažem" sa depresijom, davati dijagnostičke kriterije, tvrditi da pisanje rješava stanje. H2 #6 drži granicu: ako je praznina trajna i prati je nemogućnost funkcionisanja — to je razgovor sa stručnom osobom, ne sa stranicom. DISCLAIMER obavezan.

---

#### B2 — How to Journal Without Naming Your Feelings

- **Naslov (EN, 43):** How to Journal Without Naming Your Feelings
- **Slug:** `how-to-journal-without-naming-your-feelings`
- **Meta description (EN, 140):** `Some people cannot put feelings into words, and that is not a failure. Five ways to journal using places, objects, weather and time instead.`
- **Primarni upit:** `how to journal when you can't name your feelings`
- **Sekundarni / long-tail:**
  - `journaling when you can't describe emotions`
  - `what to write if i don't know how i feel`
  - `journal prompts that don't need feelings`
  - `writing about emotions without words`
  - `journaling for people who struggle to express themselves`
  - `describe your day without emotions journal`
- **Namjera korisnika:** zna da nešto nosi, ali nema riječ; traži metod koji ne zahtijeva emocionalni vokabular.
- **Obim:** 1.400–1.700 riječi. **Prioritet: 1**
- **Struktura H2:**
  1. `If You Cannot Name It, Describe Where It Sits`
  2. `The Weather Method`
  3. `The Room Method`
  4. `The Object Method`
  5. `The Time Method`
  6. `When Words Come Later — and What to Do Then`
  7. `What This Is Not (and When to Ask for Help)`
- **Interni linkovi:**
  - `/journal` — sva četiri metoda, kroz jedan CTA na kraju (login-gated).
  - `/guides/journaling-when-you-have-nothing-to-say` (B1) — H2 #1, sestrinski tekst.
  - `/guides/journaling-when-you-cannot-identify-emotions` (B3) — H2 #6, dublji tekst.
  - `/personal-arc` — H2 #6, kao način da se obrazac vidi kasnije, ne sada (login-gated).
  - `/landing-page` — H2 #7, uz rečenicu granice.
- **CTA (EN):** `You don't need the right word. Describe the room instead.`
- **Napomena o riziku:** tema dodiruje aleksitimiju. **Zabranjeno:** postavljati dijagnozu, koristiti „alexithymia" kao etiketu za čitaoca, tvrditi da je to stanje koje se „popravlja pisanjem". Termin se smije pomenuti samo jednom, opisno, uz jasnu ogradu da to nije dijagnoza i da dijagnozu daje stručna osoba. DISCLAIMER obavezan.

---

#### B3 — Journaling When You Cannot Identify Emotions

- **Naslov (EN, 44):** Journaling When You Cannot Identify Emotions
- **Slug:** `journaling-when-you-cannot-identify-emotions`
- **Meta description (EN, 148):** `When you cannot tell what you feel, journaling still works — it just looks different. A slow method for people who go blank when asked how they are.`
- **Primarni upit:** `journaling when you can't identify your emotions`
- **Sekundarni / long-tail:**
  - `i don't know how i feel journaling`
  - `journaling for emotional numbness`
  - `how to journal when you feel disconnected`
  - `emotion wheel journaling alternative`
  - `journaling when you cannot cry or feel`
  - `why do i go blank when asked how i feel`
- **Namjera korisnika:** traži objašnjenje sopstvenog doživljaja i metodu koja ne pretpostavlja emocionalnu pismenost.
- **Obim:** 1.500–1.900 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `Going Blank Is Information, Not a Defect`
  2. `Why "How Do You Feel?" Is the Wrong First Question`
  3. `Start With Sensation, Then Place, Then Time`
  4. `A Fifteen-Minute Session, Written Out`
  5. `Borrowed Words: Using Someone Else's Sentence`
  6. `What to Do on Days When Even That Fails`
  7. `When Numbness Is Not a Mood`
- **Interni linkovi:**
  - `/journal` — H2 #4, kroz CTA.
  - `/guides/how-to-journal-without-naming-your-feelings` (B2) — H2 #3, praktični sestrinski tekst.
  - `/guides/journal-prompts-for-feeling-numb` (B5) — H2 #6.
  - `/voices` — H2 #5, kao izvor „tuđih rečenica" (samo javno objavljeni, odobreni zapisi).
  - `/landing-page` — H2 #1, uz rečenicu granice.
- **CTA (EN):** `Start with what your hands are doing. The feeling can wait.`
- **Napomena o riziku:** **visok rizik.** „Emotional numbness" može biti simptom ozbiljnog stanja. Zabranjeno: dijagnostikovati, nabrajati kliničke uzroke kao listu za samoprovjeru, tvrditi da pisanje „vraća osjećaje". H2 #7 je obavezan i mora reći da dugotrajna tupost zaslužuje razgovor sa stručnom osobom. Bez statistika. DISCLAIMER obavezan.

---

#### B4 — Five-Minute Journaling for People Who Hate It

- **Naslov (EN, 45):** Five-Minute Journaling for People Who Hate It
- **Slug:** `five-minute-journaling-for-people-who-hate-it`
- **Meta description (EN, 143):** `For everyone who has started a journal four times and quit. A five-minute version with one rule, no gratitude lists, and permission to hate it.`
- **Primarni upit:** `five minute journaling`
- **Sekundarni / long-tail:**
  - `short journaling for people who hate journaling`
  - `minimalist journaling routine`
  - `journaling without prompts and pressure`
  - `how to journal in 5 minutes a day`
  - `i hate journaling but want to try`
  - `low effort journaling method`
- **Namjera korisnika:** želi najmanju moguću obavezu koja se neće pretvoriti u još jedan neuspjeh.
- **Obim:** 1.200–1.500 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `Why Most Journaling Advice Fails People Who Hate Journaling`
  2. `The Five-Minute Frame`
  3. `One Rule: No Catching Up`
  4. `Three Ways to Fill Five Minutes`
  5. `What to Do With the Guilt About Skipping Days`
  6. `When Five Minutes Becomes Ten (or Never Does)`
  7. `Keeping It Private`
- **Interni linkovi:**
  - `/journal` — H2 #3 i #4, kroz CTA; editor ne zahtijeva dužinu (login-gated).
  - `/guides/journaling-when-you-have-nothing-to-say` (B1) — H2 #1.
  - `/guides/night-journaling-ritual-before-sleep` (C1) — H2 #6, ako se pet minuta veže za veče.
  - `/pricing` — H2 #6, jednom: besplatna Kuća je dovoljna, dublje sobe su opcija.
  - `/guides/is-a-digital-journal-private` (D1) — H2 #7.
- **CTA (EN):** `Five minutes. One rule. Nothing to keep up with.`
- **Napomena o riziku:** nizak klinički rizik, ali visok rizik od „self-help" klišea. Zabranjeno: `gratitude practice`, `morning routine that changes your life`, `atomic habits`-stil obećanja, moralisanje o disciplini. Ton: dozvola, ne metoda.

---

#### B5 — Journal Prompts for When You Feel Numb

- **Naslov (EN, 38):** Journal Prompts for When You Feel Numb
- **Slug:** `journal-prompts-for-feeling-numb`
- **Meta description (EN, 146):** `Fourteen gentle prompts for numb days, when feelings are not available. Written for flat, tired, switched-off evenings — no pressure to feel more.`
- **Primarni upit:** `journal prompts for when you feel numb`
- **Sekundarni / long-tail:**
  - `what to write when you feel nothing`
  - `journaling for flat days`
  - `prompts for emotional numbness`
  - `what to journal when you are emotionally exhausted`
  - `writing prompts for empty days`
  - `how to journal when you feel switched off`
- **Namjera korisnika:** hoće listu koja ne zahtijeva da „osjeti nešto" prije nego što počne.
- **Obim:** 1.300–1.600 riječi. **Prioritet: 3**
- **Struktura H2:**
  1. `Numb Is Not the Same as Empty`
  2. `Why Feeling Prompts Make It Worse`
  3. `Fourteen Prompts That Ask Nothing of Your Feelings`
  4. `The Inventory Entry`
  5. `What Counts as a Good Entry on a Flat Day`
  6. `If the Flatness Has Lasted Weeks`
  7. `Keeping the Habit Alive Until Feeling Returns`
- **Interni linkovi:**
  - `/journal` — H2 #3 i #4, kroz CTA.
  - `/guides/journaling-when-you-cannot-identify-emotions` (B3) — H2 #1, glavni sestrinski tekst.
  - `/guides/five-minute-journaling-for-people-who-hate-it` (B4) — H2 #7.
  - `/personal-arc` — H2 #7, kao dugi pogled na periode (login-gated).
  - `/landing-page` — H2 #6, uz rečenicu granice.
- **CTA (EN):** `You don't have to feel anything to write a line today.`
- **Napomena o riziku:** **visok rizik** — tupost može biti simptom. Zabranjeno: dijagnostikovati, tvrditi da pisanje „otključava" osjećanja, savjetovati promjenu terapije. H2 #6 obavezan, sa uputom ka stručnoj osobi. Bez citata studija bez izvora. DISCLAIMER obavezan.

---

### KLASTER C — Noćno pisanje / san i overthinking

---

#### C1 — Night Journaling: A Calm Ritual Before Sleep

- **Naslov (EN, 44):** Night Journaling: A Calm Ritual Before Sleep
- **Slug:** `night-journaling-ritual-before-sleep`
- **Meta description (EN, 140):** `A twenty-minute night journaling ritual: what to write, what to leave out, and how to close the notebook so your head can let go of the day.`
- **Primarni upit:** `night journaling before sleep`
- **Sekundarni / long-tail:**
  - `evening journaling routine`
  - `what to write in a journal at night`
  - `journaling to sleep better`
  - `night journal prompts`
  - `how to journal before bed without waking up your mind`
  - `best time of day to journal`
- **Namjera korisnika:** traži konkretan večernji ritual koji zatvara dan i ne razbudi ga.
- **Obim:** 1.500–1.800 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `Why the Night Page Is Different From the Morning Page`
  2. `The Twenty-Minute Frame: Three Short Passes`
  3. `What to Write (and What to Save for Daylight)`
  4. `The Closing Line`
  5. `Things That Wake People Up Mid-Ritual`
  6. `If You Write Instead of Sleeping`
  7. `What This Ritual Is Not`
- **Interni linkovi:**
  - `/journal` — H2 #2 i #4, kroz CTA (login-gated).
  - `/personal-arc` — H2 #7, kao način da se vidi obrazac noći kroz nedjelje (login-gated).
  - `/guides/evening-journal-prompts` (C4) — H2 #3, za one koji hoće samo listu.
  - `/guides/journaling-for-overthinking-at-2am` (C2) — H2 #5, za one koji su već budni.
  - `/landing-page` — H2 #1, uz rečenicu granice.
- **CTA (EN):** `Write the day down, then close the book. The House stays open.`
- **Napomena o riziku:** dodiruje san. **Zabranjeno:** tvrditi da pisanje liječi nesanicu, davati medicinske savjete o spavanju (melatonin, doze, „sleep hygiene" kao terapija), obećavati bolji san. Formulacija mora biti „ritual koji pomaže da se dan zatvori", ne „rješenje za nesanicu". Ako je nesanica dugotrajna — H2 #6 šalje stručnoj osobi. DISCLAIMER obavezan.

---

#### C2 — Journaling for Overthinking at 2 AM

- **Naslov (EN, 35):** Journaling for Overthinking at 2 AM
- **Slug:** `journaling-for-overthinking-at-2am`
- **Meta description (EN, 138):** `When your mind starts at 2 a.m., a page can hold what your head keeps replaying. A short method for the middle of the night, in dim light.`
- **Primarni upit:** `journaling for overthinking at night`
- **Sekundarni / long-tail:**
  - `can't sleep mind racing journal`
  - `what to do when you wake up overthinking`
  - `writing to stop overthinking at night`
  - `3 am thoughts journaling`
  - `overthinking before sleep what to write`
  - `journaling in the middle of the night`
- **Namjera korisnika:** budan je, umoran i zarobljen u petlji; traži nešto što može uraditi odmah, bez svjetla i bez truda.
- **Obim:** 1.300–1.600 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `What Overthinking at Night Is Doing to You`
  2. `Why "Stop Thinking About It" Fails`
  3. `The Dim-Light Method: Four Steps`
  4. `The Unfinished-Sentence Trick`
  5. `What to Write When It Is a Real Problem, Not a Loop`
  6. `Going Back to Bed After Writing`
  7. `If This Is Every Night`
- **Interni linkovi:**
  - `/journal` — H2 #3 i #4, kroz CTA; rad u mraku i kratke forme.
  - `/guides/night-journaling-ritual-before-sleep` (C1) — H2 #3, preventivni tekst.
  - `/guides/journal-prompts-for-anxiety` (A3) — H2 #5, za one koji prepoznaju jaču uznemirenost.
  - `/guides/how-to-empty-your-head-before-bed` (C3) — H2 #6.
  - `/personal-arc` — H2 #7, kroz CTA (login-gated).
- **CTA (EN):** `Put the loop on the page. Then put the page away.`
- **Napomena o riziku:** miješa san i anksioznost — **visok rizik.** Zabranjeno: `cure insomnia`, medicinski savjeti, tvrdnje o kognitivnim efektima bez izvora, strašenje posljedicama neprospavane noći. H2 #5 i #7 obavezni, sa uputom ka stručnoj osobi. Bez statistika o snu. DISCLAIMER obavezan.

---

#### C3 — How to Empty Your Head Before Bed

- **Naslov (EN, 33):** How to Empty Your Head Before Bed
- **Slug:** `how-to-empty-your-head-before-bed`
- **Meta description (EN, 138):** `A simple brain-dump method for the end of the day: what to write down, in what order, and how to stop when the list starts writing itself.`
- **Primarni upit:** `how to empty your head before bed`
- **Sekundarni / long-tail:**
  - `brain dump before bed`
  - `journaling to clear your mind at night`
  - `write down worries before sleep`
  - `how to get thoughts out of your head`
  - `evening brain dump method`
  - `brain dump journal template`
- **Namjera korisnika:** hoće jednostavnu tehniku „istovarivanja" glave, bez emocija i bez analize.
- **Obim:** 1.200–1.500 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `Emptying Is Not Analyzing`
  2. `The Four-Box Brain Dump`
  3. `Order Matters: Now, Tomorrow, Later, Never`
  4. `How to Stop at the Right Moment`
  5. `What to Do With the Page Afterwards`
  6. `When the Dump Turns Into Worrying`
  7. `A Two-Minute Version for Bad Nights`
- **Interni linkovi:**
  - `/journal` — H2 #2 i #3, kroz CTA.
  - `/guides/night-journaling-ritual-before-sleep` (C1) — H2 #1, ritual kao okvir.
  - `/guides/journaling-for-overthinking-at-2am` (C2) — H2 #6.
  - `/guides/how-to-delete-journal-entries` (D3) — H2 #5: ako je stranica samo za jednokratno pražnjenje, korisnik treba da zna kako se briše.
  - `/landing-page` — H2 #1.
- **CTA (EN):** `Dump it, sort it, close it. Nothing else has to happen tonight.`
- **Napomena o riziku:** nizak do srednji rizik. Zabranjeno: predstavljati brain dump kao kliničku tehniku ili terapiju, obećavati bolji san. H2 #6 drži granicu prema ruminaciji: ako istovarivanje uvijek pređe u brigu, to nije posao za stranicu. DISCLAIMER obavezan.

---

#### C4 — Evening Journal Prompts to Close the Day

- **Naslov (EN, 40):** Evening Journal Prompts to Close the Day
- **Slug:** `evening-journal-prompts`
- **Meta description (EN, 145):** `Twenty evening journal prompts that close a day instead of grading it. No gratitude lists, no productivity review — just a quiet end to the page.`
- **Primarni upit:** `evening journal prompts`
- **Sekundarni / long-tail:**
  - `night journal prompts for adults`
  - `end of day journaling questions`
  - `evening reflection prompts`
  - `journal prompts to unwind`
  - `what to write at the end of the day`
  - `evening journaling ideas for overthinkers`
- **Namjera korisnika:** hoće gotovu listu pitanja za večeras, bez teorije i bez obaveze.
- **Obim:** 1.700–2.100 riječi. **Prioritet: 2**
- **Struktura H2:**
  1. `Closing a Day Is Not Reviewing It`
  2. `Why Gratitude Lists Backfire for Some People`
  3. `Twenty Evening Prompts` (H3: `The Day Itself`, `Other People`, `Your Body`, `What You Are Carrying`, `Tomorrow, Lightly`)
  4. `One Prompt for a Very Bad Day`
  5. `How to End the Entry`
  6. `Writing the Same Answer Every Night`
  7. `Keeping the Ritual From Becoming a Verdict`
- **Interni linkovi:**
  - `/journal` — H2 #3 i #5, kroz CTA.
  - `/guides/night-journaling-ritual-before-sleep` (C1) — H2 #1, okvir u koji se lista ugrađuje.
  - `/guides/journal-prompts-for-feeling-numb` (B5) — H2 #4, za dane bez osjećaja.
  - `/guides/shadow-work-journaling-prompts` (A1) — H2 #6, kad se isti odgovor ponavlja (to je materijal za dublji rad, ne za večeras).
  - `/map-of-lights` — H2 #7, kao miran izlaz iz ličnog u zajedničko.
- **CTA (EN):** `Choose one prompt. Answer it in three lines. That closes the day.`
- **Napomena o riziku:** nizak rizik, ali visok rizik od klišea: zabranjeno `gratitude`, `wins of the day`, `productivity review`, `rate your day 1–10`, moralisanje. Ton: zatvaranje dana, ne ocjenjivanje. DISCLAIMER obavezan.

---

### KLASTER D — Privatnost digitalnog dnevnika / anonimno pisanje

---

#### D1 — Is a Digital Journal Really Private?

- **Naslov (EN, 36):** Is a Digital Journal Really Private?
- **Slug:** `is-a-digital-journal-private`
- **Meta description (EN, 150):** `Digital journals are not automatically private. What to check before you type anything honest: storage, encryption, staff access, deletion and export.`
- **Primarni upit:** `is a digital journal private`
- **Sekundarni / long-tail:**
  - `are journaling apps safe`
  - `can journaling app employees read my entries`
  - `is it safe to keep a journal online`
  - `digital journal vs paper privacy`
  - `do journaling apps sell your data`
  - `how to keep a private digital journal`
- **Namjera korisnika:** želi da napiše nešto istinito i mora prvo znati ko to može vidjeti.
- **Obim:** 1.600–2.000 riječi. **Prioritet: 3**
- **Struktura H2:**
  1. `Private Is Not One Thing`
  2. `Five Questions to Ask Any Journaling App`
  3. `Who Can Technically Read Your Entries`
  4. `What "AI Reflection" Means for Your Words`
  5. `Deletion, Export and Backups`
  6. `Paper vs Digital: The Honest Trade`
  7. `What We Do, and What We Do Not Claim`
- **Interni linkovi:**
  - `/pricing` — H2 #7, primarni komercijalni link (šta ulazi u dublje sobe).
  - `/landing-page` — H2 #4 i #7, objašnjenje kako radi AI ogledalo.
  - `/guides/how-to-delete-journal-entries` (D3) — H2 #5.
  - `/guides/anonymous-journaling` (D2) — H2 #1, za one koji ne žele ni ime.
  - `/voices` — H2 #4, objašnjenje da se javno objavljuje samo uz izričitu dozvolu.
- **CTA (EN):** `Ask us the same five questions. The answers should be checkable, not promised.`
- **Napomena o riziku:** **komercijalno najosjetljiviji tekst.** Zabranjeno: tvrditi „100% anonymous", „military-grade", „we can never see your data" ako to nije tehnički dokazivo; izmišljati certifikate, presedane i brojeve; tvrditi GDPR/usklađenost bez provjere. Svaka tvrdnja u H2 #7 mora biti provjerljiva u kodu ili politici privatnosti. Ako nešto nije istina — ne piše se. Nema medicinskih tvrdnji.

---

#### D2 — Anonymous Journaling: Write Without a Name

- **Naslov (EN, 42):** Anonymous Journaling: Write Without a Name
- **Slug:** `anonymous-journaling`
- **Meta description (EN, 145):** `Anonymous journaling is not about hiding — it is about writing before you are ready to be known. What it gives you, and what it cannot guarantee.`
- **Primarni upit:** `anonymous journaling`
- **Sekundarni / long-tail:**
  - `how to journal anonymously online`
  - `anonymous diary app`
  - `write anonymously without an account`
  - `anonymous journaling benefits`
  - `is anonymous journaling safe`
  - `journaling under a nickname`
- **Namjera korisnika:** želi da piše slobodno, bez imena i bez osjećaja da ga neko prepoznaje.
- **Obim:** 1.300–1.600 riječi. **Prioritet: 3**
- **Struktura H2:**
  1. `Why a Name Changes What You Write`
  2. `Three Kinds of Anonymity (Only One Is Real)`
  3. `What Anonymity Gives You on the Page`
  4. `What It Cannot Guarantee`
  5. `Writing Under a Nickname: The House Practice`
  6. `When You Want to Be Known After All`
  7. `Choosing Your Node, Not Your Name`
- **Interni linkovi:**
  - `/map-of-lights` — H2 #7, jer je node zamjena za ime u javnom dijelu.
  - `/landing-page` — H2 #5 i #7, objašnjenje nadimka i dodjele čvora.
  - `/sign-in` — H2 #5, jedini direktan ulaz (danas `/sign-up-login-screen`).
  - `/guides/is-a-digital-journal-private` (D1) — H2 #4, obavezan link uz ogradu.
  - `/voices` — H2 #6, kako izgleda kada neko ipak pristane da bude javan.
- **CTA (EN):** `You can write before you are ready to be known.`
- **Napomena o riziku:** zabranjeno: garantovati anonimnost, tvrditi da se identitet „ne može utvrditi", miješati nadimak sa tehničkom anonimnošću. H2 #2 i #4 su obavezni i moraju jasno razdvojiti *društvenu* anonimnost (nadimak) od *tehničke* (bez ličnih podataka). Bez medicinskih tvrdnji.

---

#### D3 — How to Delete Journal Entries Permanently

- **Naslov (EN, 41):** How to Delete Journal Entries Permanently
- **Slug:** `how-to-delete-journal-entries`
- **Meta description (EN, 142):** `Deleting an entry is not always the same as erasing it. Backups, sync and exports explained — plus how one-way deletion actually works in NMQ.`
- **Primarni upit:** `how to delete journal entries permanently`
- **Sekundarni / long-tail:**
  - `how to permanently delete journal app entries`
  - `does deleting a journal entry remove it from backups`
  - `burn journal pages safely`
  - `delete diary entries from cloud`
  - `how to erase digital journal history`
  - `journal app delete account and data`
- **Namjera korisnika:** želi da nešto nestane stvarno, provjerljivo, i traži razumljivo objašnjenje gdje podaci žive.
- **Obim:** 1.200–1.600 riječi. **Prioritet: 3**
- **Struktura H2:**
  1. `Delete, Archive, or Erase — Three Different Things`
  2. `Where Entries Actually Live`
  3. `Backups: The Part Everyone Forgets`
  4. `One-Way Deletion: How the Burn Vault Works`
  5. `What Deletion Cannot Undo`
  6. `Deleting an Account, Not Just an Entry`
  7. `A Short Checklist Before You Burn Anything`
- **Interni linkovi:**
  - `/journal` — H2 #4, kroz CTA; `Burn Vault` je funkcija editora (login-gated).
  - `/guides/is-a-digital-journal-private` (D1) — H2 #2 i #3.
  - `/pricing` — H2 #6, jednom, u kontekstu naloga i podataka.
  - `/landing-page` — H2 #4, kako se pozicionira brisanje bez ostatka.
  - `/guides/how-to-empty-your-head-before-bed` (C3) — H2 #7, za stranice koje služe samo za pražnjenje.
- **CTA (EN):** `If you want it gone, it should be gone. Here is exactly what happens.`
- **Napomena o riziku:** svaka tvrdnja o brisanju mora odgovarati stvarnom ponašanju sistema (uključujući `Burn Vault` i politiku privatnosti). Zabranjeno: „we hold no record" ako bilo koji backup ili log zadržava kopiju; izmišljanje rokova čuvanja. Ovo je tekst gdje je netačnost istovremeno pravni i reputacioni rizik — prije objave obavezno poređenje sa `user-settings` tokom brisanja naloga i sa politikom privatnosti.

---

#### D4 — Private Journaling Apps vs Paper: An Honest Look

- **Naslov (EN, 48):** Private Journaling Apps vs Paper: An Honest Look
- **Slug:** `private-journaling-apps-vs-paper`
- **Meta description (EN, 145):** `Paper cannot be breached and apps cannot be lost in a flood. An honest comparison of private journaling on paper and on screen, without a winner.`
- **Primarni upit:** `journaling app vs paper`
- **Sekundarni / long-tail:**
  - `is paper journaling more private`
  - `digital vs paper journal pros and cons`
  - `best private journaling method`
  - `paper journal vs app for privacy`
  - `should i journal on paper or phone`
  - `private journal app comparison`
- **Namjera korisnika:** još bira format; traži neutralno poređenje, a ne preporuku.
- **Obim:** 1.500–1.900 riječi. **Prioritet: 3**
- **Struktura H2:**
  1. `What Each Format Is Actually Good At`
  2. `Privacy: Two Different Threats`
  3. `Durability and Loss`
  4. `Search, Memory and Looking Back`
  5. `Writing Speed and Honesty`
  6. `What People Regret About Each`
  7. `Choosing by Constraint, Not by Ideology`
- **Interni linkovi:**
  - `/pricing` — H2 #7, kao odluka o „koliko soba" želiš, ne o „dobro ili loše".
  - `/guides/is-a-digital-journal-private` (D1) — H2 #2, obavezan, nosi glavni argument.
  - `/guides/how-to-delete-journal-entries` (D3) — H2 #6.
  - `/personal-arc` — H2 #4, kao ono što papir ne može (login-gated → CTA).
  - `/landing-page` — H2 #1, neutralno predstavljanje Kuće.
- **CTA (EN):** `Either one works. Pick the one you will actually open.`
- **Napomena o riziku:** poređenje mora ostati neutralno — zabranjeno omalovažavati papir, izmišljati cijene konkurenata, imenovati konkurente u negativnom kontekstu, tvrditi da je digitalno „sigurnije" bez tehničkog objašnjenja. Bez medicinskih tvrdnji. Ako se pominju drugi alati, samo provjerljive, javne činjenice.

---

### Zbirna tabela briefova

| ID | Naslov (EN) | Znakova | Slug | Klaster | Obim | Prioritet |
|---|---|---|---|---|---|---|
| A1 | Shadow Work Journaling Prompts for Quiet People | 47 | `shadow-work-journaling-prompts` | A | 1.900–2.300 | 1 |
| A2 | Shadow Work Prompts for Beginners: Start Here | 45 | `shadow-work-prompts-for-beginners` | A | 1.500–1.900 | 1 |
| A3 | Journal Prompts for Anxiety: A Gentle First Step | 48 | `journal-prompts-for-anxiety` | A | 1.400–1.800 | 2 |
| A4 | What Is Shadow Work? A Plain-Language Guide | 43 | `what-is-shadow-work` | A | 1.600–2.000 | 2 |
| A5 | Shadow Work vs Therapy: What Journaling Can Do | 46 | `shadow-work-vs-therapy` | A | 1.800–2.300 | 1 |
| B1 | Journaling When You Have Nothing to Say | 39 | `journaling-when-you-have-nothing-to-say` | B | 1.500–1.800 | 1 |
| B2 | How to Journal Without Naming Your Feelings | 43 | `how-to-journal-without-naming-your-feelings` | B | 1.400–1.700 | 1 |
| B3 | Journaling When You Cannot Identify Emotions | 44 | `journaling-when-you-cannot-identify-emotions` | B | 1.500–1.900 | 2 |
| B4 | Five-Minute Journaling for People Who Hate It | 45 | `five-minute-journaling-for-people-who-hate-it` | B | 1.200–1.500 | 2 |
| B5 | Journal Prompts for When You Feel Numb | 38 | `journal-prompts-for-feeling-numb` | B | 1.300–1.600 | 3 |
| C1 | Night Journaling: A Calm Ritual Before Sleep | 44 | `night-journaling-ritual-before-sleep` | C | 1.500–1.800 | 2 |
| C2 | Journaling for Overthinking at 2 AM | 35 | `journaling-for-overthinking-at-2am` | C | 1.300–1.600 | 2 |
| C3 | How to Empty Your Head Before Bed | 33 | `how-to-empty-your-head-before-bed` | C | 1.200–1.500 | 2 |
| C4 | Evening Journal Prompts to Close the Day | 40 | `evening-journal-prompts` | C | 1.700–2.100 | 2 |
| D1 | Is a Digital Journal Really Private? | 36 | `is-a-digital-journal-private` | D | 1.600–2.000 | 3 |
| D2 | Anonymous Journaling: Write Without a Name | 42 | `anonymous-journaling` | D | 1.300–1.600 | 3 |
| D3 | How to Delete Journal Entries Permanently | 41 | `how-to-delete-journal-entries` | D | 1.200–1.600 | 3 |
| D4 | Private Journaling Apps vs Paper: An Honest Look | 48 | `private-journaling-apps-vs-paper` | D | 1.500–1.900 | 3 |

**Ukupno: 18 briefova** (A: 5, B: 5, C: 4, D: 4). Svih 18 naslova je ≤ 60 znakova; svaki meta opis je ≤ 155 znakova.

---

## 4. Tehnički preduslovi za SEO (8 stavki)

> Stanje je provjereno na kodu u `E:\NMQ-PROGRAMI\nomorequiet` (HEAD `70867bd`, radno stablo sa necommitovanim izmjenama). **Prve dvije stavke su blokatori: bez njih članci ne mogu biti indeksirani kako treba.**

### 4.1 `sitemap.ts` i `robots.ts` — fajlovi su izbrisani iz radnog stabla

- **Nalaz:** `git status` pokazuje `D src/app/sitemap.ts` i `D src/app/robots.ts` — fajlovi **postoje u HEAD-u** (`git show HEAD:src/app/sitemap.ts`) ali su **obrisani lokalno** i trenutno ih nema na disku (provjereno: `Test-Path` → `False` za oba).
- **Dodatni problem u vraćenoj verziji:** HEAD `sitemap.ts` u sitemap stavlja i aplikativne rute `/journal-screen`, `/dashboard`, `/portal`, `/personal-arc`, `/sign-up-login-screen` — to su ekrani iza prijave, ne sadržaj. To su „tanki" duplikati koji troše crawl budžet.
- **Dodatni problem u `robots.ts`:** ne zabranjuje `/admin-panel` (postoji kao ruta) i ne zabranjuje buduće `/guides/*` ništa ne treba da zabranjuje — ali mora eksplicitno blokirati admin i aplikativne ekrane.
- **Šta uraditi:**
  - vratiti oba fajla iz gita i prepraviti ih;
  - `sitemap.ts`: samo javne rute — `/` (landing), `/pricing`, `/map-of-lights`, `/voices`, `/guides`, `/guides/<slug>` (svih 18), `/about`, `/privacy`; **bez** `/journal`, `/portal`, `/personal-arc`, `/dashboard`, `/admin-panel`, `/payment/*`, `/sign-in`;
  - `sitemap.ts`: `lastModified` iz stvarnog datuma izmjene članka (`dateModified` iz frontmatter-a), ne `new Date()` za sve (trenutna verzija laže pretraživače da se sve mijenja svaki dan);
  - `robots.ts`: `disallow: ['/api/', '/journal', '/portal', '/personal-arc', '/dashboard', '/user-settings', '/admin-panel', '/payment/', '/sign-in']` + `sitemap: <SITE_URL>/sitemap.xml`;
  - dodati `<link rel="canonical">` i `robots: { index: false }` u metadata aplikativnih ekrana (pojas i tregeri — `robots.txt` ne sprječava indeksiranje ako negdje postoji link).

### 4.2 `NEXT_PUBLIC_SITE_URL` mora biti pravi domen

- **Nalaz:** u `.env` stoji `NEXT_PUBLIC_SITE_URL=https://nomorequie6253.builtwithrocket.new` — Rocket preview domen.
- **Posljedica:** svaki `canonical`, svaki `og:url`, svaki podijeljeni link i svaki `sitemap.xml` URL pokazuje na Rocket domen, ne na `nomorequiet.com`. To je najbrži način da se izgubi sav autoritet na pogrešnoj domeni i da dijeljeni linkovi izgledaju kao preview.
- **Dodatno:** `src/app/layout.tsx` (linije 51–52) učitava dva Rocket skripta (`rocket-web.js`, `rocket-shot.js`) sa `builtwithrocket.new`. Pored privatnosti (klaster D!) to je i treći mrežni zahtjev u kritičnom putu na mobilnom.
- **Šta uraditi:** postaviti `NEXT_PUBLIC_SITE_URL=https://nomorequiet.com` (produkcija) + `.env.example` na isti domen kao dokumentaciju; ukloniti oba Rocket skripta iz `layout.tsx`; u `layout.tsx` dodati `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!)` da relativne OG/canonical putanje ne pucaju.

### 4.3 Metadata, canonical i OG slike po ruti (trenutno ih nema nijedna)

- **Nalaz:** **nijedan** od 12 `page.tsx` fajlova ne eksportuje `metadata` ni `generateMetadata` — provjereno za `/landing-page`, `/map-of-lights`, `/voices`, `/journal-screen`, `/portal`, `/personal-arc`, `/pricing`, `/dashboard`, `/admin-panel`, `/user-settings`, `/payment/success`, `/sign-up-login-screen`. Svi naslijeđuju isti root naslov i opis iz `src/app/layout.tsx`.
- **Posljedica:** u rezultatima pretrage `/pricing`, `/voices` i `/landing-page` izgledaju identično; nema `canonical`, nema `og:*` po stranici.
- **Prepreka:** veliki broj stranica je `'use client'` (`/pricing`, `/portal`, `/personal-arc`, `/sign-up-login-screen`, `/user-settings`, `/payment/success`) i **ne može** eksportovati `metadata`. Rješenje je već primijenjeno na `/voices`: server `page.tsx` + klijentska komponenta u `components/`. Taj obrazac primijeniti svuda.
- **Šta uraditi (šablon):** `page.tsx` (server, bez `'use client'`) eksportuje `metadata` ili `generateMetadata` → `<AppLayout><XScreen /></AppLayout>`; metadata sadrži `title`, `description` (≤155), `alternates: { canonical: '/pricing' }`, `openGraph`, `twitter`; aplikativni ekrani dobijaju `robots: { index: false, follow: false }`.
- Za članke: `generateStaticParams` + `generateMetadata` po slug-u, `title` iz frontmatter-a, `openGraph.article` sa `publishedTime`/`modifiedTime`, canonical `/guides/<slug>`.

**OG slike (dio iste stavke — dijeljenje je glavni kanal za ovu temu):**

- **Nalaz (OG slike):** u `public/` je samo `favicon.ico`; u `src/app/` nema nijednog `opengraph-image.*` ni `twitter-image.*`.
- **Posljedica (OG slike):** svaki dijeljeni link (WhatsApp, X, LinkedIn, Slack, email) izlazi bez slike — najveći pojedinačni gubitak CTR-a iz dijeljenja, a dijeljenje je glavni kanal za temu poput ove.
- **Šta uraditi (OG slike):**
  - korijenski `src/app/opengraph-image.tsx` preko `next/og` `ImageResponse`, 1200×630, paleta void `#110e0a` + amber/zlato, tipografija Cormorant;
  - po-klaster OG (A–D) sa naslovom klastera i brojem promptova;
  - dinamički OG za članke: `src/app/guides/[slug]/opengraph-image.tsx` koji ispisuje naslov članka i „Not therapy. Not coaching. A House.";
  - `twitter: { card: 'summary_large_image' }` u metadata;
  - OG slike moraju biti bez obećanja u tekstu (npr. nikad „heal anxiety") — ista pravila kao za naslove.

### 4.4 RESTful rute (i 301 redirekcije)

- **Nalaz:** rute su opisne ali ne-RESTful (`/journal-screen`, `/sign-up-login-screen`), a `/` trenutno radi **privremeni** redirect (`permanent: false` → HTTP 307) na `/landing-page`. Canonical tako varira između `/` i `/landing-page`, a root URL nikad ne nosi snagu.
- **Šta uraditi (mapiranje):**

| Sada | Cilj (RESTful) | Redirekcija |
|---|---|---|
| `/` (307) + `/landing-page` | `/` servira landing | `/landing-page` → `/` **301/308** |
| `/journal-screen` | `/journal` | **301/308** |
| `/sign-up-login-screen` | `/sign-in` | **301/308** |
| `/personal-arc` | `/personal-arc` (ostaje) | — |
| `/map-of-lights`, `/voices`, `/pricing`, `/portal` | isto (ostaje) | — |
| `/dashboard` | `/dashboard` (iz prijave) | `noindex` |
| `/user-settings` | `/settings` | **301** + `noindex` |
| `/admin-panel` | `/admin` | **301** + `noindex` + `robots.txt` |
| `/payment/success` | `/checkout/success` | **301** + `noindex` |
| — | `/guides`, `/guides/[slug]` | novo (hub + 18 članaka) |
| — | `/about`, `/privacy`, `/editorial-policy` | novo (E-E-A-T, vidi 4.7) |

- Sve redirekcije idu u `next.config.mjs` → `redirects()` sa `permanent: true` (**ne** 307 kao sada za `/`), i to **prije** objave članaka — nikad mijenjati rute poslije indeksiranja bez redirekcije.
- Interni linkovi u svih 18 članaka koriste **nove** rute (zato `/journal` u briefovima), a stari linkovi iz emaila/Reels-a se ne mijenjaju — redirekcija ih pokriva.
- Bez orphan stranica: hub `/guides` linkuje svih 18, svaki članak linkuje hub + 4–5 srodnih članaka (kako je navedeno u briefovima).

### 4.5 Brzina na mobilnom

- **Nalaz:** landing hero crta piramidu na `<canvas>` sa `requestAnimationFrame` petljom i animira brojač svjetla (`LandingHero.tsx`), cijeli landing je klijentski; `next.config.mjs` uključuje `productionBrowserSourceMaps`, što uvećava deploy i otkriva izvorni kod.
- **Šta uraditi:**
  - mjeriti stvarno: PageSpeed Insights / Lighthouse (mobile) na `/` , `/pricing`, `/guides/<slug>`; cilj LCP < 2,5 s i INP < 200 ms na 4G profilu;
  - članke graditi kao **statiku/RSC** (`generateStaticParams`, `export const revalidate`) — bez klijentskih biblioteka, bez animacija, jedan font (`next/font` sa `display: swap`, lokalno hostovan);
  - hero canvas: zamrznuti animaciju iza `prefers-reduced-motion` i odgoditi prvi frame dok se ne učita tekst (LCP element je tekst, ne canvas);
  - slike: `next/image` sa `sizes`, AVIF/WebP, bez OG/hero slika preko 200 KB;
  - ne dodavati nove treće-strane skripte na stranice članaka (analitika i OG su dovoljni).

### 4.6 `productionBrowserSourceMaps` isključiti

- **Nalaz:** `next.config.mjs`, linija 5: `productionBrowserSourceMaps: true`.
- **Posljedica:** produkcijski bundle nosi `.map` fajlove — veći artefakt, sporiji deploy na dijeljenom hostingu i javno dostupan izvorni kod (uključujući promptove i logiku AI ogledala).
- **Šta uraditi:** `productionBrowserSourceMaps: false` (ili liniju obrisati — default je `false`), pa provjeriti da u `.next/static` nema `*.map` nakon build-a. Izuzetak samo ako se privremeno debugira, i tada ne u produkciji.

### 4.7 Strukturirani podaci (FAQ / Article) i E-E-A-T

- **Nalaz:** u projektu nema nijednog JSON-LD bloka — ni `Organization`, ni `Article`, ni `FAQPage`, ni `BreadcrumbList`.
- **Šta uraditi (JSON-LD kroz `<script type="application/ld+json">` u server komponentama):**
  - **`Organization`** (jednom, u root layout-u): `name: "NoMoreQuiet"`, `url`, `logo`, `sameAs` (samo profili koji stvarno postoje).
  - **`Article`/`BlogPosting`** na svakom članku: `headline` (isto kao H1), `description` (meta), `datePublished`, `dateModified`, `author` → `Person`/entitet sa `/about`, `publisher` → `Organization`, `mainEntityOfPage`.
  - **`FAQPage`** samo tamo gdje na stranici stvarno postoji vidljivi FAQ blok (prednost: A1, A4, A5, B1, D1, D3) — bez izmišljanja pitanja koja nisu na stranici.
  - **`BreadcrumbList`** za `/guides/<slug>` (Home → Guides → Klaster → Članak).
  - **Zabranjeno u structured data:** `MedicalWebPage`, `MedicalCondition`, `Drug`, `MedicalScholarlyArticle` i bilo koja medicinska svojstva; nikakve `aggregateRating`/`review` oznake bez stvarnih, prikazanih recenzija.
  - **E-E-A-T za YMYL-adjacent teme:** `/about` (ko piše i šta je Kuća), `/editorial-policy` (kako se piše, šta se nikad ne tvrdi, kako se ispravlja), `/privacy`. Bez toga tekstovi o anksioznosti i tuposti nemaju entitetski oslonac.

### 4.8 GA4 mjerenje

- **Nalaz:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` je postavljen u `.env` (nije prazan); `src/components/GoogleAnalytics.tsx` poziva `trackPageView` na svaku promjenu `pathname`, a `gtag('config', ...)` istovremeno šalje i svoj `page_view` → **dvostruko brojanje pregleda**.
- **Šta uraditi:**
  - isključiti automatski page_view u `gtag('config')` (`send_page_view: false`) i ostaviti samo jedan izvor istine (SPA `trackPageView`);
  - postaviti konverzije/evente koji se stvarno mjere: `begin_writing_click` (CTA u člancima), `article_scroll_75`, `guides_hub_click`, `checkout_started` (postoji `/api/stripe/checkout`), `sign_up_completed`;
  - UTM šema za Reels/kartice/email: `utm_source=instagram|email`, `utm_medium=social|newsletter`, `utm_campaign=guides-<slug>` — bez UTM-a se organski i socijalni saobraćaj stapaju i plan iz odjeljka 5 postaje nemjerljiv;
  - povezati Search Console sa GA4 i pratiti **upite**, ne samo posjete (long-tail upiti su jedini realan signal za klastere A i B);
  - poštovati postojeći `Permissions-Policy` i `Referrer-Policy` iz `next.config.mjs` — ne dodavati trackere koji ih zaobilaze (posebno zbog klastera D).

---

## 5. Mjesečni plan objava (3 mjeseca, 18 članaka)

**Napomena:** brojevi ispod su **interne mete**, ne obećanja i ne tvrdnje o rezultatima. Ne objavljuju se na sajtu i ne koriste se u marketingu.

**Redoslijed je namjeran:** prvo klaster A i B (prioritet 1) jer grade temu i autoritet, pa C (ritual i email), pa D (komercijalna istraga i `/pricing`).

| Mjesec | 6 članaka | Cilj (interna meta) | Reciklaža — po članku (Reels / kartica / email) |
|---|---|---|---|
| **Mjesec 1** | A1, A2, A5, B1, B2, A3 | **Indeks:** svih 6 indeksirano u 21 dan (Search Console: „URL is on Google", bez „Discovered – currently not indexed"); **posjete:** 150–400 organskih sesija; **upita:** 20+ različitih long-tail upita sa ≥1 prikazom; **tehnički:** stavke 4.1–4.3 zatvorene prije prvog članka | **A1** → Reel: 1 prompt na ekranu, 12 s, bez muzike · Kartica: karusel 3 slajda (3 prompta) · Email: „One prompt for this week" #1<br>**A2** → Reel: „the only rule" 20 s · Kartica: 9 beginner promptova · Email: „Start with four lines"<br>**A5** → Reel: 3 rečenice granice („two different rooms") · Kartica: „4 signs you need a person, not a page" · Email: zaštitni tekst u podnožju svakog pisma<br>**B1** → Reel: prazan list + jedna rečenica · Kartica: 6 openings · Email: „The blank page is not the problem"<br>**B2** → Reel: „describe the room, not the feeling" · Kartica: 4 metode (weather/room/object/time) · Email: vježba za 10 minuta<br>**A3** → Reel: 1 miran prompt, bez teksta o ishodu · Kartica: 12 promptova · Email: uz obavezan DISCLAIMER blok |
| **Mjesec 2** | B3, B4, B5, C1, C2, C4 | **Indeks:** 12/12 indeksirano; **posjete:** 600–1.200 organskih sesija ukupno; **upita:** 3 upita u top 20 (realno: B1, B2, C1 varijante); **ponašanje:** ≥35 % sesija na člancima sa scroll 75 %; **tehnički:** 4.4 (redirekcije) i 4.6 (source maps) zatvoreni | **B3** → Reel: „going blank is information" · Kartica: 15-minutna sesija korak po korak · Email: „start with sensation"<br>**B4** → Reel: tajmer 5:00, jedna rečenica · Kartica: „one rule: no catching up" · Email: mini-izdanje „5 minutes, nothing to keep up with"<br>**B5** → Reel: bez teksta, samo 14 promptova u ritmu · Kartica: inventory entry · Email: za „flat days"<br>**C1** → Reel: 20-minutni ritual u 3 pasa (time-lapse) · Kartica: „what to save for daylight" · Email: večernje izdanje u 21:00<br>**C2** → Reel: „put the loop on the page" (tamni ekran) · Kartica: unfinished-sentence trick · Email: za budne noći<br>**C4** → Reel: 1 večernji prompt dnevno, 7 dana · Kartica: 20 promptova u 5 grupa · Email: nedjeljno zatvaranje dana |
| **Mjesec 3** | C3, D1, D2, D3, D4 + 1 osvježeni A1 (v2) | **Indeks:** 18/18 + hub `/guides`; **posjete:** 1.500–3.000 organskih sesija ukupno; **upita:** 1 upit u top 10 (cilj: `journaling when you have nothing to say`); **konverzija:** prvi mjerljivi `begin_writing_click` iz organskog saobraćaja (bez cilja broja); **tehnički:** 4.5 (mobilna brzina), 4.7 (structured data) i 4.8 (GA4 eventi/UTM) zatvoreni | **C3** → Reel: „four-box brain dump" u 15 s · Kartica: four-box šablon · Email: „stop at the right moment"<br>**D1** → Reel: 5 pitanja za svaku aplikaciju (tekst, bez lica) · Kartica: „private is not one thing" · Email: pitanja koja treba da postaviš svakom alatu<br>**D2** → Reel: „write before you are ready to be known" · Kartica: 3 vrste anonimnosti · Email: nadimak i node<br>**D3** → Reel: „delete, archive, or erase" · Kartica: checklist prije brisanja · Email: gdje unosi stvarno žive<br>**D4** → Reel: papir vs ekran, bez pobjednika · Kartica: „two different threats" · Email: „pick the one you will actually open"<br>**A1 v2** → Reel: 3 najbolja prompta iz v1 · Kartica: ažurirana lista · Email: „the list, revisited" (isti URL, ažuriran `dateModified`) |

**Pravila reciklaže (važe za sve mjesece):**

- **Jedan članak = najmanje 1 Reels (15–30 s), 1 kartica/karusel, 1 email segment.** Bez izuzetka; ako se članak ne može reciklirati, naslov nije dobar.
- **Reels nikad ne obećava ishod.** Tekst na ekranu je prompt ili rečenica iz članka, nikad „this will heal you".
- **Kartice se prave iz sadržaja stranice, ne iz marketinškog teksta** — tako kartica i stranica govore istim glasom.
- **Email nosi DISCLAIMER** u svakom izdanju koje dira anksioznost, tupost ili san.
- **Ažuriranje je objava:** kad se članak osvježi, mijenja se `dateModified` u JSON-LD i `lastModified` u sitemap-u; URL se **ne** mijenja.
- **Mjeri se mjesečno, ne dnevno:** indeksirane stranice (Search Console → Pages), upiti (Queries), `begin_writing_click` (GA4). Ako poslije 6 sedmica članak nije indeksiran → problem je tehnički (odjeljak 4), ne sadržajni.

---

## 6. Kontrolna lista prije objave članka (svih 18)

1. Naslov ≤ 60 znakova, meta ≤ 155 znakova, slug bez dijakritika i bez apostrofa.
2. Jedan H1 (isti kao naslov), 5–8 H2 iz briefa, logičan redoslijed; nijedan H2 nije preskočen.
3. Nema zabranjenih riječi iz odjeljka 0 (pretraga prije objave: `cure`, `treat`, `heal`, `fix`, `replace therapy`, `%`).
4. DISCLAIMER blok prisutan ako tema dira mentalno zdravlje (A1, A2, A3, A4, A5, B1, B2, B3, B4, B5, C1, C2, C3, C4).
5. 4–6 internih linkova: najmanje 2 javne rute (`/landing-page`, `/pricing`, `/map-of-lights`, `/voices`, `/guides`) + 2 srodna članka; aplikativne rute samo kroz CTA.
6. Tačno 1 CTA, bez pritiska i bez rokova.
7. Canonical na `/guides/<slug>`, `og:*` i `twitter:card`, OG slika 1200×630.
8. JSON-LD: `Article` + `BreadcrumbList` (+ `FAQPage` samo ako FAQ postoji vidljivo).
9. Autor i datum u tekstu, link na `/about` (E-E-A-T) i, gdje treba, na `/editorial-policy`.
10. Nema nepotvrđenih tvrdnji, statistika, certifikata i imena konkurenata u negativnom kontekstu — svaka brojka ima izvor ili je nema.
