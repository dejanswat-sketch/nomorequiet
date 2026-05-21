# Rad na projektu — NoMoreQuiet

## Lokacija

`W:\Projects\nomorequiet_5081`  
GitHub: https://github.com/dejanswat-sketch/nomorequiet_5081

**Napomena:** Projekat `nezadovoljnezene` / `dissatisfied-women` na W disku ostaje odvojen (engleski UI) — nije diran.

## Pokretanje lokalno

```bash
cd W:\Projects\nomorequiet_5081
copy .env.example .env
# popuni Supabase i Stripe ključeve u .env
npm install
npm run dev
```

Aplikacija: http://localhost:4028  
UI je na **engleskom**.

## Šta je urađeno (mali fix paket)

- Repozitorijum kloniran na `W:\Projects\nomorequiet_5081` (HEAD uključuje fix brojača svetla iz commita `1d17d80` — live total preko `/api/stats/lights`).
- Dodat `.env.example` (bez tajni); `.env` u `.gitignore` i uklonjen iz git praćenja (lokalni `.env` ostaje na disku).
- README: repo ime, port 4028, engleski UI.
- Dodat `src/app/robots.ts` (robots.txt + link ka sitemap).
- `npm run build` prolazi.

## Predlozi za sledeće korake

1. Postaviti produkcioni `NEXT_PUBLIC_SITE_URL` (trenutno u primeru Rocket URL).
2. Zameniti placeholder Stripe ključeve i webhook secret za pravi checkout.
3. Po želji: live brojevi po čvorovima na landing sekciji (trenutno statički po nodu, samo ukupan broj je live).
4. Deploy na Hostinger (`npm run build` + `npm run start` na portu 3000).
5. Proveriti da `.env` nikad ne uđe u commit (već u `.gitignore`).
