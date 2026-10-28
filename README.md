# Jancy & Aswin — Engagement Invitation (MERN)

A mobile-first invitation site: the black J♡A card parts like curtains, the
invitation writes itself in gold, guests scratch a golden heart to reveal the
date, then RSVP and leave blessings (stored in MongoDB).

## Structure
```
client/   React + Vite (the experience)
  src/data.js            ← all names, date, venue, map link — edit here
  src/components/        Envelope (curtain), Invitation, ScratchHeart, Countdown,
                         Details, Families, Rsvp, Wishes, Footer
  src/lib/fx.js          gold dust / heart confetti canvas + haptics
server/   Express + Mongoose
  routes/rsvp.js         POST /api/rsvp, GET /api/rsvp?key=ADMIN_KEY (guest list)
  routes/wishes.js       GET/POST /api/wishes
```

## Run locally
```bash
npm run install:all
cp server/.env.example server/.env      # add your MONGO_URI
npm run dev:server                      # :5000
npm run dev:client                      # :5173 (proxies /api to :5000)
```

## Deploy (one service, e.g. Render)
- Build command: `npm run install:all && npm run build`
- Start command: `npm start`
- Env: `MONGO_URI`, `ADMIN_KEY`, `CLIENT_ORIGIN`
Express serves `client/dist`, so the site and API share one URL.

If you host the client separately (Vercel/Netlify), set `VITE_API_URL` in `client/.env`.

## Guest list
Open `https://your-site/api/rsvp?key=YOUR_ADMIN_KEY` to see every RSVP and the
total seats confirmed.

## Single-file preview
`npm run build:preview --prefix client` → `client/dist-preview/index.html`,
a standalone page with no backend (RSVPs/blessings stay in that browser).
