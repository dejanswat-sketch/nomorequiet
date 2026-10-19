# Šablon kartice — uputstvo

**Fajl:** [`sablon/kartica.html`](sablon/kartica.html) — samostalan HTML, otvara se dvoklikom u browseru (Chrome/Edge).
**Svrha:** da svaka kartica iz `01-KARTICE-FRAGMENTI.md` može da se pretvori u sliku za 30 sekundi, u **tačnim bojama i fontovima aplikacije** (bez Canva naloga i bez plaćanja).

---

## 1. Kako se koristi

**Način A — alatna traka:** otvori `kartica.html`, ukucaj fragment / čvor / starost, izaberi format.

**Način B — preko linka (brže, za seriju):**
```
kartica.html?clean=1&f=I%20stopped%20explaining%20myself.&n=Rtanj&a=312%20days%20ago&s=feed
```
Parametri: `f` = fragment, `n` = čvor, `a` = starost, `s` = `feed` | `story` | `pin`,
`clean=1` = sakrij alatnu traku (za čist screenshot), `ex=1` = prikaži labelu `EXAMPLE · YOURS COULD BE HERE` (varijanta A iz §5).
(Razmak u linku piši kao `%20`.)

**Gotove sve kartice odjednom:** [`sablon/sve-kartice.html`](sablon/sve-kartice.html) — jedna stranica sa svih 40 kartica, prekidači za EN/SR, labelu i ID.
**Regenerisanje posle izmjene paketa 01:**
```bash
node docs/sadrzaj/sablon/generisi-kartice.mjs
```
**Primjeri renderovanih kartica (dokaz da šablon radi):** `sablon/primjer-kartica.png` (osnovna) · `sablon/primjer-kartica-example.png` (varijanta A).

**Izvoz u sliku:**
1. Chrome → `F12` → **Elements** → desni klik na `<div class="card">` → **Capture node screenshot**.
2. Ili blokiraj toolbar (obriši `div.toolbar` u Elements) i uradi običan screenshot prozora.
3. Ili `Ctrl+P` → *Save as PDF* za štampu (toolbar se sam skriva pri štampi).

**Imenovanje fajlova (obavezno, zbog UTM-a i mjerenja):**
```
fc014-rtanj-feed.png      → fragment #014, čvor Rtanj, format feed
pr007-story.png           → pitanje #007, story
re012-tiktok.mp4          → reel #012
```
Isti ID ide u UTM: `utm_campaign=fc014`.

---

## 2. Formati i mjere

| Format | Dimenzije | Gdje ide |
|---|---|---|
| `feed` | 1080 × 1350 (4:5) | Instagram feed, Facebook |
| `story` | 1080 × 1920 (9:16) | Story, Reels zadnji kadar, TikTok |
| `pin` | 1000 × 1500 (2:3) | Pinterest (najbolji za dugi promet) |

Sigurna zona za tekst: **120 px** od ivice (u šablonu je već ugrađeno).

---

## 3. Brend tokeni (identično aplikaciji)

| Token | HEX | Upotreba |
|---|---|---|
| `void` | `#0a0806` | pozadina |
| `deep-earth` | `#110e0a` | pozadina (gradijent) |
| `gold` | `#D4AF37` | točka, labela čvora, naglasak |
| `amber` | `#c8822a` | sjaj, sekundarno |
| `amber-glow` | `#e8a04a` | sjaj točke |
| `cream` | `#f0e8d8` | tekst fragmenta |
| `mist` | `#a89880` | starost, sekundarni tekst |
| `silence` | `#5a4e40` | potpis, okvir |

**Fontovi:** `Cormorant Garamond` (300 italic) za fragment · `Spectral` (200, uppercase, letter-spacing .22em) za labele.
**Točka:** 14 px, `#D4AF37`, dvostruki sjaj (14 px i 34 px), pulsiranje 4 s.
**Zrno:** noise 5 % preko cijele kartice — daje „papir", ne izgleda kao plastika.

---

## 4. Pravila teksta na kartici

1. **Jedna rečenica.** Ako ne staje u tri reda na feed formatu — nije fragment, nego tekst.
2. Bez navodnika u kucanju (šablon ih sam dodaje), bez emodžija, bez potpisa autora.
3. Starost **mora** biti istinita ako je kartica stvarni korisnički unos. Vidi §5.
4. Čvor se piše bez „The": `Rtanj`, `Sedona`, `Kailash`, `Shasta`, `Glastonbury`, `Machu Picchu`, `Es Vedrà`.
5. Donji potpis je uvijek `nomorequiet.com` (kad domen bude preusmjeren na aplikaciju).

---

## 5. Istinitost — tri varijante dok nema stvarnih korisnika

Do prvih pravih unosa, kartice se **ne smiju** predstavljati kao tuđe. Tri čiste opcije:

**A) Primjer (najjednostavnije)**
Labela ispod fragmenta: `EXAMPLE · YOURS COULD BE HERE`
→ zadrži estetiku, ne tvrdi ništa.

**B) Poziv (najbolje za rast)**
Kartica bez fragmenta, samo prazna točka i tekst:
`"The first light on Rtanj hasn't been written yet."` + CTA `Leave one sentence.`
→ pretvara slabost (nula korisnika) u priču o početku.

**C) Riječi Kuće (za priče, ne za fragmente)**
Potpis: `THE HOUSE`, bez izmišljene starosti.
→ koristi se za manifest i citate osnivača, jasno odvojeno od korisničkih unosa.

**Preporuka:** kombinacija **A + B** u prve 4 nedjelje, pa prelazak na stvarne unose (uz pisanu dozvolu autora i bez prepoznatljivih detalja).

---

## 6. Alt tekst (pristupačnost + Pinterest SEO)

Alt tekst nije ukras — Pinterest ga čita kao opis pina.

```
"Quote card: 'I stopped explaining myself to people who weren't listening.'
 Rtanj node, 312 days ago — NoMoreQuiet, anonymous journaling map."
```

Pravilo: alt = `Quote card: '<fragment>' + <node> + <starost> + NoMoreQuiet`.

---

## 7. Šta NE raditi sa karticom

1. Ne dodavati logo preko teksta (točka je logo).
2. Ne mijenjati font na sans-serif (Arial, Roboto) — gubi se cijeli identitet.
3. Ne stavljati više od jednog citata na karticu.
4. Ne koristiti stock fotografije mora, planina i zalazaka — pozadina je crna, točka je svjetlo.
5. Ne dodavati „Follow for more" — CTA je uvijek jedna mirna rečenica.
