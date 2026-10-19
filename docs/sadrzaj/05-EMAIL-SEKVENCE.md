# 05 — EMAIL SEKVENCIJE (NoMoreQuiet)

> **Verzija:** 1.0 · **Jezik:** engleski (primarni — UI je na engleskom) + srpski prevod svakog mejla
> **Glas:** miran, topao, kratak. Bez pritiska, bez urgency trikova, bez lažne oskudnosti, bez uzvičnika, bez emodžija (dozvoljeno 0–1).
> **Tvrde granice:** nijedna tvrdnja o terapiji, liječenju ili dijagnozi. Nijedna izmišljena priča korisnika kao stvarna. Nijedno preuveličavanje sposobnosti AI-ja. Nikad kupljene liste.
> **Dužina tijela:** max 180 riječi po mejlu (EN). SR prevod je isti sadržaj, ne skraćenica.

**Svet i riječi koje koristimo:** The House · The Mountain · Map of Lights · The Pyramid · fragments · Lights · The Vault · The Portal · Personal Arc

**Proizvodi i cijene (tačno, ne mijenjati):**

| Proizvod | Cijena | Šta je |
|---|---|---|
| Free | 0 € | The Vault — tvoji fragmenti ostaju tvoji |
| Light | 1 € | jedno svjetlo na Map of Lights (jednokratno) |
| Deep Insight | 10 € | AI Jungovska analiza, 600–800 riječi |
| Companion | 4,99 €/mj | AI pamćenje, Personal Arc, pun Portal |
| Deep Read | 49 € | živ čovjek čita tvoje unose, odgovor za 48–72h, najviše 5 nedjeljno |

> **Napomena za izvedbu:** tačan opis funkcije „Light (1 €)" uskladiti sa stvarnim ponašanjem proizvoda prije slanja. Ako se funkcija promijeni, mijenja se i rečenica u mejlu — ne obećavati ono što proizvod ne radi.

**Merge varijable:** `{{first_name}}` · `{{fragment_count}}` · `{{last_entry_date}}` · `{{days_since_last_entry}}` · `{{map_of_lights_lit}}` · `{{portal_url}}` · `{{unsubscribe_url}}`

---

# 1. DOBRODOŠLICA — 7 emailova

Redoslijed: **dan 0, 1, 3, 6, 10, 16, 24** (računa se od registracije, ne od potvrde mejla).
Ako korisnik prije zakazanog dana napravi ciljnu radnju (npr. napiše 3 fragmenta), email se **ne preskače** — samo se blago skrati ličnim uvodom. Sekvenca se prekida odmah na prvu kupovinu Companion-a (prelazi u korisnički tok).

---

## Email 1 — Dan 0: „The House is open"

- **Subject (EN):** The House is open
- **Subject B (A/B alternativa):** One sentence is enough
- **Preview text (EN):** The House is open. One sentence is enough.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> You are here. That already took something.
>
> NoMoreQuiet is not a course, and not therapy. It is a House. You come in, you write one true sentence, and The Vault keeps it. No one reads it unless you decide so. Not us. Not the AI.
>
> You do not need to be a writer. You do not need to be fine. One sentence. It doesn't have to be beautiful. Just true.
>
> If you do one thing today, open The Portal and write the first fragment. That is the whole beginning.
>
> — Dejan, NoMoreQuiet
>
> P.S. There is no streak to break here. Come back when you have something to say.

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Tu si. I to je već nešto uzelo od tebe.
>
> NoMoreQuiet nije kurs i nije terapija. To je Kuća. Uđeš, napišeš jednu istinitu rečenicu, i The Vault je čuva. Niko je ne čita osim ako ti tako odlučiš. Ni mi. Ni AI.
>
> Ne moraš biti pisac. Ne moraš biti dobro. Jedna rečenica. Ne mora biti lijepa. Samo istinita.
>
> Ako danas uradiš samo jednu stvar: otvori Portal i napiši prvi fragment. To je cijeli početak.
>
> — Dejan, NoMoreQuiet
>
> P.S. Ovde nema niza koji se prekida. Vrati se kad imaš šta da kažeš.

- **CTA (EN):** Write your first fragment → [Open The Portal]({{portal_url}})
- **CTA (SR):** Napiši prvi fragment → [Otvori Portal]({{portal_url}})
- **Cilj emaila:** dovesti korisnika do prvog unosa (aktivacija), bez objašnjavanja cijelog proizvoda.
- **Šta mjerimo:** open rate · click na CTA · **aktivacija: prvi fragment unutar 24h** · odjava (treba ostati ispod 0,5%).

---

## Email 2 — Dan 1: „A short tour of the House"

- **Subject (EN):** A short tour of the House
- **Subject B (A/B alternativa):** Where your words actually go
- **Preview text (EN):** The Vault, the Portal, the Map of Lights.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Yesterday you wrote down something true. Today, a short tour — nothing to learn, only to know.
>
> **The Vault** is where your fragments live. Private by default. You can read, edit or delete any of them at any time.
>
> **The Portal** is the door you write through. One page, one cursor, no formatting to fight with.
>
> **The Map of Lights** is the quiet part. Every fragment you keep adds a Light. Over weeks, the map shows you what you kept returning to — without anyone telling you what it means.
>
> **The Mountain** is the rest of the landscape. You will meet it later, when there is more of you written down.
>
> That is the whole House. Small on purpose.
>
> — Dejan
>
> P.S. If writing felt strange yesterday, that is normal. The second sentence is easier than the first.

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Juče si zapisao/la nešto istinito. Danas kratka šetnja kroz Kuću — ništa ne treba učiti, samo znati.
>
> **The Vault** je mjesto gdje tvoji fragmenti žive. Privatno po pravilu. Možeš ih čitati, mijenjati i brisati kad god želiš.
>
> **The Portal** su vrata kroz koja pišeš. Jedna stranica, jedan kursor, bez borbe sa formatiranjem.
>
> **The Map of Lights** je tihi dio. Svaki fragment koji zadržiš dodaje jedno svjetlo. Kroz nedjelje, mapa ti pokaže čemu si se vraćao/la — bez toga da ti iko govori šta to znači.
>
> **The Mountain** je ostatak pejzaža. Srest ćeš ga kasnije, kad bude više tebe zapisanog.
>
> To je cijela Kuća. Namjerno mala.
>
> — Dejan
>
> P.S. Ako je juče pisanje bilo čudno, to je normalno. Druga rečenica je lakša od prve.

- **CTA (EN):** Open The Portal again → [Write fragment no. 2]({{portal_url}})
- **CTA (SR):** Otvori Portal ponovo → [Napiši fragment br. 2]({{portal_url}})
- **Cilj emaila:** razumijevanje tri ključna dijela proizvoda i drugi unos (navika).
- **Šta mjerimo:** open · click · **2. fragment** · vrijeme do drugog unosa · odjava.

---

## Email 3 — Dan 3: „The map fills slowly"

- **Subject (EN):** The map fills slowly
- **Subject B (A/B alternativa):** Three days, three sentences
- **Preview text (EN):** A map that fills with your own light.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Three days in. You have {{map_of_lights_lit}} Lights on your map, and {{fragment_count}} fragments in The Vault.
>
> There is nothing to win here. The Map of Lights is not a score. It is a picture of where your attention went — and attention is the only thing we can honestly measure about a person.
>
> Some people write every day. Some write twice a month, and it still works. Both are the House.
>
> If you are stuck, try one of these:
>
> — Finish this sentence: "What I did not say today was…"
> — Write about a room from your childhood.
> — Write one line about what you are avoiding.
>
> No one grades it. The AI mirror only speaks when you ask it to.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Treći dan. Imaš {{map_of_lights_lit}} svjetala na mapi i {{fragment_count}} fragmenata u The Vault-u.
>
> Ovde se ništa ne dobija. Map of Lights nije rezultat. To je slika toga gdje ti je pažnja otišla — a pažnja je jedino što o čovjeku možemo pošteno mjeriti.
>
> Neki ljudi pišu svaki dan. Neki pišu dvaput mjesečno, i to i dalje radi. Oboje je Kuća.
>
> Ako si zaglavio/la, probaj jedno od ovoga:
>
> — Dovrši rečenicu: „Ono što danas nisam rekla/rekao je…"
> — Piši o sobi iz djetinjstva.
> — Napiši jednu liniju o tome šta izbjegavaš.
>
> Niko ne ocjenjuje. AI ogledalo progovara samo kad ga pitaš.
>
> — Dejan

- **CTA (EN):** Add a Light today → [One sentence]({{portal_url}})
- **CTA (SR):** Dodaj svjetlo danas → [Jedna rečenica]({{portal_url}})
- **Cilj emaila:** pretvoriti radnju u naviku i skinuti pritisak sa „svaki dan" obrasca.
- **Šta mjerimo:** open · click · **3. fragment** · broj dana sa unosom u prvoj nedjelji.

---

## Email 4 — Dan 6: „The mirror does not interpret for you"

- **Subject (EN):** The mirror does not interpret for you
- **Subject B (A/B alternativa):** How the AI mirror actually works
- **Preview text (EN):** What the AI mirror does, and what it doesn't.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> A word about the AI mirror, because it is easy to misunderstand.
>
> It does not diagnose you. It does not know your life. It reads what you wrote and reflects patterns back: words that repeat, feelings that return, questions you keep circling. Sometimes that is useful. Sometimes it is only a mirror.
>
> It runs **only when you press the button**. It never reads your Vault on its own. It never writes to your fragments.
>
> If you want to try it, write two or three short fragments this week and then ask. The mirror is clearer when there is more of you on the page.
>
> One sentence. It doesn't have to be beautiful. Just true.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Riječ o AI ogledalu — jer se lako pogrešno razumije.
>
> Ono te ne dijagnostikuje. Ne zna tvoj život. Čita ono što si napisao/la i vraća ti obrasce: riječi koje se ponavljaju, osjećanja koja se vraćaju, pitanja oko kojih kružiš. Nekad je to korisno. Nekad je samo ogledalo.
>
> Radi **samo kad ti pritisneš dugme**. Nikad ne čita tvoj Vault sam. Nikad ne piše u tvoje fragmente.
>
> Ako želiš da probaš: napiši dva-tri kratka fragmenta ove nedjelje, pa pitaj. Ogledalo je jasnije kad te ima više na stranici.
>
> Jedna rečenica. Ne mora biti lijepa. Samo istinita.
>
> — Dejan

- **CTA (EN):** Ask the mirror → [Open your Vault]({{portal_url}})
- **CTA (SR):** Pitaj ogledalo → [Otvori svoj Vault]({{portal_url}})
- **Cilj emaila:** objasniti stvarni rad AI-ja (bez preuveličavanja) i podstaći povjerenje kroz upotrebu.
- **Šta mjerimo:** open · click · prvo korišćenje ogledala · povratak u app u roku 48h.

---

## Email 5 — Dan 10: „What you write stays yours"

- **Subject (EN):** What you write stays yours
- **Subject B (A/B alternativa):** Your words, your rules
- **Preview text (EN):** Your words stay yours. Always.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Ten days. By now you have probably written something you would not say out loud. So let us be exact about where it lives.
>
> — Your fragments are private by default.
> — We do not sell, share or publish them. Ever.
> — You can export them, edit them, delete them, or delete the whole account.
> — The AI mirror sees only the fragments you choose to send to it, at the moment you press the button.
> — Emails like this one never quote your entries.
>
> That is not a marketing promise. It is the reason the House can exist at all. Writing honestly only works if the room is safe.
>
> If something about privacy is unclear, reply to this email. A person reads replies.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Deset dana. Do sada si vjerovatno napisao/la nešto što ne bi rekla/ rekao naglas. Zato da budemo precizni gdje to živi.
>
> — Tvoji fragmenti su privatni po pravilu.
> — Ne prodajemo ih, ne dijelimo ih i ne objavljujemo. Nikada.
> — Možeš ih izvesti, mijenjati, brisati — ili obrisati cijeli nalog.
> — AI ogledalo vidi samo fragmente koje mu ti pošalješ, u trenutku kad pritisneš dugme.
> — Mejlovi kao ovaj nikad ne citiraju tvoje unose.
>
> To nije marketinško obećanje. To je razlog zbog kojeg Kuća uopšte može postojati. Iskreno pisanje radi samo ako je soba sigurna.
>
> Ako ti nešto oko privatnosti nije jasno, odgovori na ovaj mejl. Čovjek čita odgovore.
>
> — Dejan

- **CTA (EN):** Read the privacy note → [How we handle your words]({{portal_url}}/privacy)
- **CTA (SR):** Pročitaj napomenu o privatnosti → [Kako čuvamo tvoje riječi]({{portal_url}}/privacy)
- **Cilj emaila:** izgraditi povjerenje i smanjiti odustajanje zbog straha za privatnost.
- **Šta mjerimo:** open · click na privacy · reply rate · odjava (ključna metrika: da ostane niska).

---

## Email 6 — Dan 16: „For the days when nothing comes"

- **Subject (EN):** For the days when nothing comes
- **Subject B (A/B alternativa):** You are allowed to be quiet here
- **Preview text (EN):** For the days when nothing comes.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Last entry: {{last_entry_date}}. That is {{days_since_last_entry}} days ago. I am not counting to make you feel late.
>
> There are weeks when the page stays empty. Sometimes that is avoidance. Sometimes it is just life, or tiredness, or a season that asks for silence. Both are allowed.
>
> If you want to come back, do not start with something big. Open the Vault and read the last fragment you wrote. Then write one line under it — even "I don't know what to say today."
>
> That line is a real entry. The House does not need more than that.
>
> We don't offer instant solutions, miracles, or therapy. What we offer is presence — and it does not expire.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Posljednji unos: {{last_entry_date}}. To je prije {{days_since_last_entry}} dana. Ne brojim da bi se osjećao/la kao da kasniš.
>
> Ima nedjelja kad stranica ostane prazna. Nekad je to izbjegavanje. Nekad je samo život, ili umor, ili godišnje doba koje traži tišinu. Oboje je dozvoljeno.
>
> Ako želiš da se vratiš, ne počinji nečim velikim. Otvori Vault i pročitaj posljednji fragment. Onda napiši jednu liniju ispod njega — makar „Ne znam šta da kažem danas."
>
> Ta linija je pravi unos. Kući ne treba više od toga.
>
> Ne nudimo instant rješenja, čuda ni terapiju. Nudimo prisustvo — i ono ne ističe.
>
> — Dejan

- **CTA (EN):** Read your last fragment → [Open The Vault]({{portal_url}})
- **CTA (SR):** Pročitaj posljednji fragment → [Otvori The Vault]({{portal_url}})
- **Cilj emaila:** vratiti neaktivnog korisnika bez krivice, kroz najmanju moguću radnju.
- **Šta mjerimo:** open · click · **povratak u app (return rate)** · novi unos nakon 16. dana.

---

## Email 7 — Dan 24: „Rooms in the House"

- **Subject (EN):** Rooms in the House
- **Subject B (A/B alternativa):** What the House has, and what it costs
- **Preview text (EN):** Rooms in the House, and what they cost.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Twenty-four days. You have {{fragment_count}} fragments and {{map_of_lights_lit}} Lights. Whatever you do next, that stays yours and it stays free.
>
> There are three other rooms, and I would rather describe them plainly than sell them.
>
> **Light — 1 €.** One Light, once. For people who want to mark a single moment without a subscription.
>
> **Deep Insight — 10 €.** A Jungian reading of your fragments by the AI. 600–800 words. Longer, slower, more depth than the mirror in the app.
>
> **Companion — 4,99 € per month.** Memory: the AI remembers your arc between sessions. Personal Arc, and the full Portal. Cancel whenever you like.
>
> **Deep Read — 49 €.** A living person reads your entries and answers within 48–72 hours. We read at most five a week, because one person reads them.
>
> Nothing here is required. The Vault stays free either way.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Dvadeset četiri dana. Imaš {{fragment_count}} fragmenata i {{map_of_lights_lit}} svjetala. Šta god uradiš dalje, to ostaje tvoje i ostaje besplatno.
>
> Postoje još tri sobe, i radije ću ih opisati obično nego prodavati.
>
> **Light — 1 €.** Jedno svjetlo, jednom. Za ljude koji žele da obilježe jedan trenutak bez pretplate.
>
> **Deep Insight — 10 €.** Jungovska analiza tvojih fragmenata koju radi AI. 600–800 riječi. Duže, sporije, dublje od ogledala u aplikaciji.
>
> **Companion — 4,99 € mjesečno.** Pamćenje: AI pamti tvoj luk između sesija. Personal Arc i pun Portal. Otkaži kad god želiš.
>
> **Deep Read — 49 €.** Živ čovjek čita tvoje unose i odgovara za 48–72 sata. Čitamo najviše pet nedjeljno, jer ih čita jedan čovjek.
>
> Ništa od ovoga nije obavezno. Vault ostaje besplatan u svakom slučaju.
>
> — Dejan

- **CTA (EN):** See the rooms and prices → [Open The House]({{portal_url}}/pricing)
- **CTA (SR):** Pogledaj sobe i cijene → [Otvori Kuću]({{portal_url}}/pricing)
- **Cilj emaila:** prva meka monetizacija — dati tačan pregled i pustiti korisnika da odluči.
- **Šta mjerimo:** open · click na cjenovnik · **prva kupovina (konverzija)** · odjava.

---

# 2. REAKTIVACIJA — 3 emaila

Za korisnike koji su **imali najmanje jedan unos**, pa se nisu vratili 14, 30 i 60 dana.
Bez krivice. **Bez popusta u prvom mejlu.** Nikad „izgubićeš", nikad odbrojavanja, nikad lažna oskudnost.

| Email | Okidač | Naglasak |
|---|---|---|
| R1 | 14 dana bez unosa | tišina je dozvoljena, Vault te čeka |
| R2 | 30 dana bez unosa | tvoj vlastiti tekst kao poziv (ne naš) |
| R3 | 60 dana bez unosa | vrata otključana + jasna opcija da prestanemo pisati |

---

## R1 — 14 dana: „Nothing is lost"

- **Subject (EN):** Nothing is lost
- **Subject B (A/B alternativa):** Your Vault is still there
- **Preview text (EN):** Nothing is lost. It is still in The Vault.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Your last fragment was on {{last_entry_date}}. Since then, {{days_since_last_entry}} days. I am writing once, and then I will be quiet.
>
> Nothing you wrote expired. Nothing was deleted. The Vault does not close, and the Map of Lights keeps your {{map_of_lights_lit}} Lights exactly where they were.
>
> If those weeks were full of life, good. If they were hard, you do not owe us an explanation, and you do not owe us a return.
>
> If you do come back, one line is enough. "I'm still here" is a complete entry.
>
> — Dejan
>
> P.S. If these notes are not useful to you right now, one click below and we will stop. No hard feelings.

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Tvoj posljednji fragment je bio {{last_entry_date}}. Od tada {{days_since_last_entry}} dana. Pišem jednom, pa se umirujem.
>
> Ništa što si napisao/la nije isteklo. Ništa nije obrisano. The Vault se ne zatvara, a Map of Lights drži tvojih {{map_of_lights_lit}} svjetala tačno tamo gdje su bila.
>
> Ako su te nedjelje bile pune života — dobro je. Ako su bile teške, ne duguješ nam objašnjenje i ne duguješ nam povratak.
>
> Ako se ipak vratiš, jedna linija je dovoljna. „Još sam tu" je potpun unos.
>
> — Dejan
>
> P.S. Ako ti ove poruke sada ne pomažu, jedan klik ispod i prestajemo. Bez zamjere.

- **CTA (EN):** Write one line → [Open The Portal]({{portal_url}}) · or [pause these emails]({{unsubscribe_url}})
- **CTA (SR):** Napiši jednu liniju → [Otvori Portal]({{portal_url}}) · ili [pauziraj ove mejlove]({{unsubscribe_url}})
- **Cilj emaila:** vratiti korisnika bez pritiska i bez popusta; pokazati da podaci nisu izgubljeni.
- **Šta mjerimo:** open · click · return rate · odjava (očekivano viša — to je u redu).

---

## R2 — 30 dana: „The fragment you left open"

- **Subject (EN):** The fragment you left open
- **Subject B (A/B alternativa):** Something you wrote a month ago
- **Preview text (EN):** The fragment you left open.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> A month since {{last_entry_date}}.
>
> There is probably one fragment in your Vault that you stopped in the middle of. Not the longest one. The one you closed the page on.
>
> I am not going to quote it here — your words are not email material. But you can open it, and finish the sentence a month later. It will not read the same as it would have then. That difference is the whole point of keeping a Vault.
>
> If you would rather start fresh, that is fine too. A new fragment does not erase the old ones.
>
> One sentence. It doesn't have to be beautiful. Just true.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Mjesec od {{last_entry_date}}.
>
> U tvom Vault-u vjerovatno postoji jedan fragment koji si ostavio/la na pola. Ne najduži. Onaj na kojem si zatvorio/la stranicu.
>
> Neću ga citirati ovdje — tvoje riječi nisu email materijal. Ali možeš ga otvoriti i dovršiti rečenicu mjesec dana kasnije. Neće se čitati isto kao što bi tada. Ta razlika je cijeli smisao Vault-a.
>
> Ako bi radije da počneš iznova, i to je u redu. Novi fragment ne briše stare.
>
> Jedna rečenica. Ne mora biti lijepa. Samo istinita.
>
> — Dejan

- **CTA (EN):** Finish the sentence → [Open The Vault]({{portal_url}})
- **CTA (SR):** Dovrši rečenicu → [Otvori The Vault]({{portal_url}})
- **Cilj emaila:** vratiti korisnika kroz njegov vlastiti tekst, ne kroz našu ponudu.
- **Šta mjerimo:** open · click · **povratak i novi unos** · dubina sesije (broj pročitanih fragmenata).

---

## R3 — 60 dana: „The door is unlocked"

- **Subject (EN):** The door is unlocked
- **Subject B (A/B alternativa):** Should we stop writing to you?
- **Preview text (EN):** The door is unlocked, whenever you are.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> This is the last note in this series, so I will be direct.
>
> Two months since your last fragment. Your account is intact, free, and waiting. Nothing was deleted and nothing was sold. If you never come back, that is a legitimate ending — not a failure.
>
> If you want the smallest possible door: **Light is 1 €**, once, for a single Light on your map. No subscription, nothing to cancel.
>
> And if you would rather not hear from us again, use the link below. We will not write to you again, and we will not ask why.
>
> Either way: thank you for the sentences you did write. They were true when you wrote them, and they still are.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Ovo je posljednja poruka u ovom nizu, pa ću biti direktan.
>
> Dva mjeseca od tvog posljednjeg fragmenta. Nalog je netaknut, besplatan i čeka. Ništa nije obrisano i ništa nije prodato. Ako se nikad ne vratiš, to je legitiman kraj — ne neuspjeh.
>
> Ako želiš najmanja moguća vrata: **Light je 1 €**, jednom, za jedno svjetlo na tvojoj mapi. Bez pretplate, nema šta da se otkazuje.
>
> A ako ne želiš više da čuješ od nas, koristi link ispod. Nećemo ti više pisati i nećemo pitati zašto.
>
> U svakom slučaju: hvala za rečenice koje si napisao/la. Bile su istinite kad si ih pisao/la, i to su i sada.
>
> — Dejan

- **CTA (EN):** Light a single Light (1 €) → [Open the Map]({{portal_url}}/pricing) · or [stop these emails]({{unsubscribe_url}})
- **CTA (SR):** Upali jedno svjetlo (1 €) → [Otvori mapu]({{portal_url}}/pricing) · ili [zaustavi ove mejlove]({{unsubscribe_url}})
- **Cilj emaila:** čisto zatvaranje niza — mala ponuda za one koji žele, jasna odjava za one koji ne.
- **Šta mjerimo:** open · click na Light · odjava · **reaktivacija nakon 60 dana** · spam prijave (moraju ostati 0).

---

# 3. PRODAJNI EMAILOVI — 3

Pravilo za sve tri: mejl se šalje **jednom**, nikad više od jednog prodajnog mejla u 14 dana, i nikad korisniku koji je u kriznom režimu (vidi sekciju 4) ili koji se odjavio iz ponuda.

---

## P1 — Deep Insight (10 €)

**Kada se šalje (okidač u ponašanju):** korisnik ima **≥5 fragmenata**, koristio je AI ogledalo **≥2 puta**, i nije kupio nijedan proizvod. Alternativni okidač: prošlo je **7 dana** od prvog fragmenta i ima ≥3 unosa. Nikad prije 5. dana.

- **Subject (EN):** When the mirror is not deep enough
- **Subject B (A/B alternativa):** 600–800 words about your own writing
- **Preview text (EN):** A slower, deeper reading of your fragments.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> The mirror in the app answers quickly. Deep Insight does not.
>
> For 10 €, the AI reads a selection of your fragments and writes a Jungian analysis: 600–800 words about the images, repetitions and figures that keep appearing in what you write. Slower, longer, less like a reply and more like a reading.
>
> What it is not: it is not therapy, not a diagnosis, not a professional opinion about your mental health. It is a text about your texts, and you decide what to do with it.
>
> It works best if you have at least five substantial fragments — otherwise there is not enough to read. You have {{fragment_count}}.
>
> You can read the analysis whenever you like, and it stays in your Vault.
>
> — Dejan
>
> P.S. If it says something you disagree with, that is allowed. It is a mirror, not an authority.

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Ogledalo u aplikaciji odgovara brzo. Deep Insight ne.
>
> Za 10 €, AI čita izbor tvojih fragmenata i piše Jungovsku analizu: 600–800 riječi o slikama, ponavljanjima i likovima koji se stalno vraćaju u onome što pišeš. Sporije, duže, manje kao odgovor, više kao čitanje.
>
> Šta to nije: nije terapija, nije dijagnoza, nije stručno mišljenje o tvom mentalnom zdravlju. To je tekst o tvojim tekstovima, i ti odlučuješ šta ćeš s njim.
>
> Najbolje radi ako imaš bar pet sadržajnih fragmenata — inače nema dovoljno da se čita. Ti imaš {{fragment_count}}.
>
> Analizu možeš čitati kad god želiš i ostaje u tvom Vault-u.
>
> — Dejan
>
> P.S. Ako kaže nešto s čim se ne slažeš, i to je dozvoljeno. To je ogledalo, ne autoritet.

- **CTA (EN):** Request Deep Insight — 10 € → [Read deeper]({{portal_url}}/deep-insight)
- **CTA (SR):** Zatraži Deep Insight — 10 € → [Čitaj dublje]({{portal_url}}/deep-insight)
- **Šta NE reći:** da analiza „otkriva tvoju pravu ličnost" ili „rješava tvoje obrasce"; da je to terapija ili zamjena za terapeuta; da AI „zna tvoje nesvjesno"; da je rezultat „transformacija"; bilo kakav rok ili „samo danas".

---

## P2 — Companion (4,99 €/mj)

**Kada se šalje (okidač u ponašanju):** korisnik je aktivan **≥14 dana**, ima **≥10 fragmenata**, vratio se u app **≥5 različitih dana**, i koristio je Map of Lights. Nikad tokom prve nedjelje i nikad u istoj nedjelji kad i P1.

- **Subject (EN):** A House that remembers
- **Subject B (A/B alternativa):** Your arc, kept between sessions
- **Preview text (EN):** The AI remembers where you left off.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Free gives you the Vault, and it stays free. Companion is for people who are already writing regularly — you have {{fragment_count}} fragments and {{map_of_lights_lit}} Lights, so you probably are.
>
> What changes for 4,99 € per month:
>
> — **Memory.** The AI keeps the thread between sessions. You do not explain your context again every time you ask.
> — **Personal Arc.** A long view of your fragments over months, not a single reply.
> — **Full Portal.** The whole writing space, without the free limits.
>
> Cancel whenever you like. One click, no phone call, no questions. If you cancel, your fragments stay exactly where they are.
>
> If the free Vault is enough for you right now, that is a complete answer. It is not a lesser version of the House.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Besplatno ti daje The Vault, i to ostaje besplatno. Companion je za ljude koji već redovno pišu — ti imaš {{fragment_count}} fragmenata i {{map_of_lights_lit}} svjetala, pa vjerovatno jesi.
>
> Šta se mijenja za 4,99 € mjesečno:
>
> — **Pamćenje.** AI drži nit između sesija. Ne objašnjavaš ponovo svoj kontekst svaki put kad pitaš.
> — **Personal Arc.** Dug pogled na tvoje fragmente kroz mjesece, ne jedan odgovor.
> — **Pun Portal.** Cijeli prostor za pisanje, bez ograničenja besplatne verzije.
>
> Otkaži kad god želiš. Jedan klik, bez poziva, bez pitanja. Ako otkažeš, tvoji fragmenti ostaju tačno gdje su.
>
> Ako ti je besplatni Vault sada dovoljan, to je potpun odgovor. On nije slabija verzija Kuće.
>
> — Dejan

- **CTA (EN):** Try Companion — 4,99 €/month → [Open the full Portal]({{portal_url}}/companion)
- **CTA (SR):** Probaj Companion — 4,99 €/mj → [Otvori pun Portal]({{portal_url}}/companion)
- **Šta NE reći:** „pretplata ti je potrebna da bi napredovao/la"; skriveni uslovi ili teško otkazivanje; „AI te konačno razumije"; ograničeno vrijeme ili popust sa odbrojavanjem; bilo kakvo vezivanje uz krizno stanje korisnika.

---

## P3 — Deep Read (49 €)

**Kada se šalje (okidač u ponašanju):** korisnik je aktivan **≥60 dana** ili ima **≥30 fragmenata**, ima redovne unose u zadnjih 30 dana, i (poželjno) već je kupio Deep Insight. Nikad prije 30. dana od registracije.

- **Subject (EN):** A person reads this one
- **Subject B (A/B alternativa):** 48–72 hours, and a human answer
- **Preview text (EN):** A living person reads your entries.
- **Tijelo (EN):**

> Hello {{first_name}},
>
> Deep Read is the only thing in the House that is not automated. 49 €, once.
>
> A living person reads your entries and writes back within 48–72 hours: what stood out, what repeated, what you may not have noticed. Not a score, not advice you did not ask for, and not therapy.
>
> Two honest limits:
>
> — We read at most **five Deep Reads a week**, because one person reads them. If the week is full, we will tell you and hold your place.
> — If something in your entries suggests you need real professional support, we will say so plainly instead of pretending a letter is enough.
>
> You choose which fragments are included. Nothing else is shared.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Deep Read je jedina stvar u Kući koja nije automatizovana. 49 €, jednom.
>
> Živ čovjek čita tvoje unose i piše ti za 48–72 sata: šta je iskočilo, šta se ponavljalo, šta možda nisi primijetio/la. Nije ocjena, nije savjet koji nisi tražio/la, i nije terapija.
>
> Dvije poštene granice:
>
> — Čitamo najviše **pet Deep Read-ova nedjeljno**, jer ih čita jedan čovjek. Ako je nedjelja puna, reći ćemo ti i zadržati tvoje mjesto.
> — Ako nešto u tvojim unosima ukazuje da ti treba stvarna stručna podrška, reći ćemo to otvoreno, umjesto da se pravimo da je pismo dovoljno.
>
> Ti biraš koji fragmenti ulaze. Ništa drugo se ne dijeli.
>
> — Dejan

- **CTA (EN):** Request a Deep Read — 49 € → [Send your fragments]({{portal_url}}/deep-read)
- **CTA (SR):** Zatraži Deep Read — 49 € → [Pošalji svoje fragmente]({{portal_url}}/deep-read)
- **Šta NE reći:** da je to „stručna analiza" ili „klinički uvid"; da zamjenjuje terapeuta ili liječnika; da je čita „psiholog" (ako nije); da je broj mjesta „skoro popunjen" ili da „uskoro poskupljuje"; nikakva tvrdnja o ishodu ili „izlječenju".

---

# 4. CRISIS-AWARE EMAIL

**Okidač:** korisnik napiše težak unos — bilo preko oznake raspoloženja, bilo preko automatizovane detekcije jezika (samo kao **signal**, nikad kao dijagnoza). Šalje se **jednom** i nikad se ne ponavlja u istoj nedjelji.

**Pravila:** bez savjeta, bez analize, bez tumačenja unosa, bez pitanja, bez prodaje. Nikakav prodajni ili welcome email **30 dana** nakon ovog mejla (suppression lista „crisis"). Nikakvo citiranje unosa. Nikakva tvrdnja da je čovjek pročitao unos ako nije.

> **VAŽNO — PRIJE SLANJA:** svi telefonski brojevi i linkovi za stručnu pomoć **moraju se provjeriti** — brojevi se mijenjaju, razlikuju se po državi, a EU 112 nije linija za mentalno zdravlje. U šablon se ne upisuje nijedan broj dok ga ne provjeri odgovorna osoba. Ako korisnik nije u EU, potreban je lokalizovan blok. Preporučeni izvori za provjeru: nacionalna ministarstva zdravlja i službeni sajtovi za prevenciju samoubistva. Ovaj mejl treba da prođe pravnu/etikku provjeru prije prvog slanja.

**Subject (EN):** I'm not going to give you advice
**Subject B (A/B alternativa):** Just presence, nothing else
**Preview text (EN):** No advice. No fixing. Just presence.

- **Tijelo (EN):**

> Hello {{first_name}},
>
> This note is automatic — no one read your entry. And it is sincere.
>
> Some days the page takes more than it gives. I am not going to tell you what to do with that, and I am not going to explain your own words back to you.
>
> What I will say is this: you wrote it down. That is not nothing. The room stayed open while you did it, and it is open now.
>
> We don't offer instant solutions, miracles, or therapy. What we offer is presence. If today needs more than presence, a trained person should be the one beside you, and looking for one is not a weakness.
>
> If you are in danger right now, or thinking about hurting yourself, please contact emergency services in your country or a crisis line. [List of verified numbers by region — to be checked before sending.]
>
> You do not have to answer this email. You do not have to write anything today.
>
> — Dejan

- **Tijelo (SR):**

> Zdravo {{first_name}},
>
> Ova poruka je automatska — niko nije pročitao tvoj unos. I iskrena je.
>
> Ima dana kad stranica uzme više nego što dâ. Neću ti govoriti šta da radiš s tim, i neću ti objašnjavati tvoje vlastite riječi.
>
> Reći ću ovo: zapisao/la si to. To nije malo. Soba je ostala otvorena dok si pisao/la, i otvorena je i sada.
>
> Ne nudimo instant rješenja, čuda ni terapiju. Nudimo prisustvo. Ako danas treba više od prisustva, uz tebe treba biti obučena osoba — i potražiti je nije slabost.
>
> Ako si sada u opasnosti ili razmišljaš da se povrijediš, molim te obrati se hitnoj službi u svojoj zemlji ili liniji za kriznu podršku. [Spisak provjerenih brojeva po regijama — provjeriti prije slanja.]
>
> Ne moraš odgovoriti na ovaj mejl. Ne moraš danas ništa napisati.
>
> — Dejan

- **CTA (EN):** No call to action. Optional, quiet link only: [Support and crisis lines]({{portal_url}}/support) — plus [pause emails for 30 days]({{unsubscribe_url}})
- **CTA (SR):** Bez poziva na akciju. Samo tiha opcija: [Podrška i krizne linije]({{portal_url}}/support) — i [pauza mejlova 30 dana]({{unsubscribe_url}})
- **Cilj emaila:** prisustvo bez savjeta, uz diskretno i provjereno upućivanje na stručnu pomoć.
- **Šta mjerimo:** open · klik na stranicu podrške · pauza pretplate · **odjave i spam prijave (moraju ostati minimalne)**. Ovaj mejl se **ne** ocjenjuje po konverziji.

---

# 5. PRAVILA SLANJA (10 linija)

1. **Saglasnost (GDPR, EU):** šaljemo samo uz jasnu, dokumentovanu saglasnost (double opt-in za marketing); checkbox nikad nije unaprijed označen i odvojen je od uslova korišćenja; vodimo dokaz saglasnosti (datum, izvor, IP).
2. **Odjava u svakom mejlu:** funkcionalan link u svakom mejlu, bez prijave i bez pitanja; odjava važi odmah i za sve marketinške tokove (tranzakcijske poruke ostaju odvojene).
3. **Bez kupovnih lista:** nikad ne kupujemo, iznajmljujemo ni uvozimo liste; svaki kontakt dolazi iz naše baze sa dokazom saglasnosti.
4. **Personalizacija:** koristimo samo `{{first_name}}` i brojeve iz njegovog rada (broj fragmenata, datumi); nikad ne citiramo sadržaj unosa i nikad ne pogađamo raspoloženje u subjectu.
5. **UTM:** svaki link nosi `utm_source=email`, `utm_medium=lifecycle`, `utm_campaign=<sekvenca>`, `utm_content=<pozicija>`; bez UTM-a nema mjerenja, pa nema ni odluke.
6. **A/B testiranje subjecta:** Subject i Subject B se puštaju 50/50 na uzorku; pobjednik se određuje po **click rate-u**, ne po open rate-u; test traje dok uzorak ne bude dovoljan za zaključak, a ne dok ne potvrdi našu želju.
7. **Frekvencija:** najviše **2 mejla nedjeljno** po korisniku i najviše **1 prodajni mejl u 14 dana**; krizni režim i pauza nadjačavaju sve kampanje.
8. **Krizni režim:** nakon crisis-aware mejla nema marketinških poruka **30 dana**; unos se nikad ne koristi kao prodajni argument.
9. **Podaci i čuvanje:** email adrese se čuvaju samo dok postoji saglasnost; brisanje naloga briše i marketinški profil; zahtjeve za pristup/brisanje rješavamo u roku od 30 dana.
10. **Odgovornost i ton:** svaki mejl prolazi provjeru prema pravilima glasa (bez pritiska, bez lažne oskudnosti, bez tvrdnji o terapiji) prije slanja; ako ne možemo da ga potpišemo mirno, ne šaljemo ga.

**Kontrolna lista prije prvog slanja sekvence:**
- [ ] Provjereni svi linkovi i merge varijable (test na sopstveni nalog).
- [ ] Provjereni krizni brojevi i pravni tekst (sekcija 4).
- [ ] Postavljeni UTM obrasci i suppression liste („crisis", „no_offers", „unsubscribed").
- [ ] Poslati test mejlovi na Gmail, Outlook i mobilni klijent (provjeriti prelom i preview text).
- [ ] Dokumentovano ko odgovara na `reply` i u kom roku.
