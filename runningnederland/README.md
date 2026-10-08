# RunningNederland

De nieuwe versie van RunningNederland: het overzicht van hardloopevenementen in Nederland.
Gebouwd met **Vue 3 + TypeScript (Vite)**, data uit **Supabase**, gehost op **Netlify**.
Het ontwerp volgt het RunningNederland-design system (groen + salie, lettertype Figtree).

## Wat zit erin

| Pagina | Pad |
| --- | --- |
| Home (banner, uitgelichte evenementen, regio's) | `/` |
| Agenda (regio's, filters, kalender, kaarten, sorteren, pagina's) | `/agenda` |
| Evenement (details, bewaren in Mijn Runs, in de buurt) | `/evenement/:id` |
| Kids Runs | `/kids` |
| Trainingsschema's (5 km, 10 km, halve marathon) | `/trainingsschemas` |
| Foto's | `/fotos` |
| Mijn Runs (bewaarde evenementen, in de browser) | `/mijnruns` |
| Over ons | `/overons` |
| Contact (Netlify Forms) | `/contact` |
| Admin (inloggen via Supabase, evenementen toevoegen/bewerken/verwijderen, uitlichten) | `/admin` |

Extra: NL/EN-schakelaar, licht en donker thema (volgt de instelling van de bezoeker), mobiel menu,
filters in de URL (een gefilterde agenda kun je delen), straal rond een postcode (via PDOK).

## Lokaal starten

Je hebt [Node.js](https://nodejs.org) 20 of nieuwer nodig.

```bash
npm install
npm run dev
```

Open daarna http://localhost:5173. Zonder Supabase-gegevens toont de site **voorbeelddata**.

## Supabase koppelen

1. Kopieer `.env.example` naar `.env.local` en vul in:
   - `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` (Supabase → Project Settings → API).
   - Gebruik **alleen de anon/public key**, nooit de service_role/secret key.
2. Heb je nog geen tabel? Voer `supabase/schema.sql` uit in de SQL Editor van Supabase.
   Heb je al een tabel met andere kolomnamen? Pas dan `fromRow` en `toRow` aan in `src/lib/events.ts`.
3. Maak een beheerdersaccount in Supabase → Authentication → Users → *Add user*, en zet
   *Allow new users to sign up* uit. Met dat account log je in op `/admin`.

## Online zetten met Netlify

1. Netlify → *Add new site* → *Import an existing project* → kies deze GitHub-repository.
2. Build-instellingen komen uit `netlify.toml` (build: `npm run build`, map: `dist`).
3. Netlify → Site configuration → *Environment variables*: voeg `VITE_SUPABASE_URL` en
   `VITE_SUPABASE_ANON_KEY` toe en deploy opnieuw.
4. Contactformulier: berichten verschijnen onder Netlify → *Forms*. Zet daar eventueel een e-mailmelding aan.

Elke push naar GitHub zet Netlify automatisch online. Een aparte branch krijgt een eigen preview-link.

## Waar pas je wat aan?

| Wat | Bestand |
| --- | --- |
| Kleuren, afstanden, afrondingen | `src/styles/tokens.css` (uit het design system) |
| Algemene opmaak, knoppen, formulieren | `src/styles/base.css` |
| Soorten evenementen en de foto per soort | `src/data/categories.ts` + `public/images/categories/` |
| Provincies en regio's | `src/data/provinces.ts` |
| Trainingsschema's | `src/data/training.ts` |
| Teksten (NL/EN) van menu, knoppen en filters | `src/lib/i18n.ts` |
| Koppeling met de Supabase-kolommen | `src/lib/events.ts` |
| Voorbeelddata | `src/data/sample-events.ts` |
| Header / footer / banner / kaart | `src/components/` |
| Pagina's | `src/views/` |

## Foto's

Zet foto's als WebP in `public/images/categories/` (± 1200 px breed, 100–200 KB) en koppel ze in
`src/data/categories.ts`. Meerdere foto's per soort mag: de site wisselt dan af, zodat dezelfde foto
niet naast elkaar staat. Een evenement kan ook een eigen foto krijgen via het veld *Eigen foto* in Admin.
