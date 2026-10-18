# CalmConnect

A mental health and wellness platform built around one problem: people don't ask for help because of stigma and fear of being judged. Users share under pen names, get support from verified therapists and volunteer listeners, and track their own wellbeing.

**Stack:** React (Vite) + React Router + Bootstrap 5 · Node + Express · PostgreSQL (Neon)

## Setup

You need **Node.js 20+** and a free **Neon** database ([neon.tech](https://neon.tech)).

1. Create a Neon project, open **Connect**, turn **Connection pooling** off, click **Show password** and copy the connection string.
2. Set up the backend:

   ```bash
   cd server
   npm install
   cp .env.example .env      # paste the string as DATABASE_URL, set JWT_SECRET
   npm run db:setup          # creates all tables, sample data and the admin account
   npm run dev               # http://localhost:5000
   ```

3. Set up the frontend in a second terminal:

   ```bash
   cd client
   npm install
   npm run dev               # http://localhost:5173
   ```

Admin login: `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` (default `admin@calmconnect.local` / `admin123`).

`npm run db:setup` deletes all data and starts fresh. Run it again whenever `schema.sql` changes.

### Demo data

```bash
cd server
npm run db:setup && npm run db:demo
```

| Account | Password | Role |
|---|---|---|
| `asha@demo.com` | `demo1234` | User with 30 days of mood, journal, check-ins, posts |
| `kabir@demo.com`, `meera@demo.com`, `rohan@demo.com` | `demo1234` | Users |
| `ananya@demo.com`, `kunal@demo.com`, `farah@demo.com` | `demo1234` | Verified helpers |
| `vikram@demo.com` | `demo1234` | Helper application waiting for approval |
| `admin@calmconnect.local` | `admin123` | Admin |

### AI assistant

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and put it in `server/.env` as `GEMINI_API_KEY`. Without a key the rest of the app works and the assistant page explains that it isn't set up.

## Project layout

```
client/src/
  api/axios.js            every API call goes through this
  crypto.js               all chat encryption (Web Crypto API)
  context/AuthContext.jsx logged-in user
  components/             Navbar, Footer, Layout, ProtectedRoute, shared pieces
  pages/                  one file per page, admin pages in pages/admin/
  styles/theme.css        our colours and fonts, Bootstrap re-coloured to match
  styles/app.css          our own styles (all classes start with cc-)
server/
  sql/schema.sql          all tables
  sql/seed.sql            sample data
  sql/setup.js            runs schema + seed, creates the admin
  src/options.js          fixed lists: circles, specialisations, languages, ...
  src/index.js            app setup and routes
  src/middleware/auth.js  requireAuth, requireAdmin
  src/routes/             one file per feature
```

## Where to change things

| To change | Edit |
|---|---|
| Circles, reactions, crisis words, check-in questions, specialisations, languages, emotions | `server/src/options.js` |
| Words used for pen names | `penNameWords` in `server/src/options.js` |
| A table or column | `server/sql/schema.sql`, then `npm run db:setup` |
| Starter resources and affirmations | `server/sql/seed.sql` |
| Demo accounts and activity | `server/sql/demo.js` |
| What the AI assistant is told | `aiInstructions` in `server/src/options.js` |
| Colours and fonts | top of `client/src/styles/theme.css` |
| Menu links | `client/src/components/Navbar.jsx` |
| Pages and URLs | `client/src/App.jsx` |

## Progress

- [x] Milestone 1: accounts, pen names, roles, helper applications, admin approval
- [x] Milestone 2: community, check-ins, mood tracker, journal
- [x] Milestone 3: helper directory, matching, encrypted chat
- [x] Milestone 4: dashboard, resources, AI chatbot, demo data

## How the encrypted chat works

1. On sign-up the browser makes an ECDH key pair. The public key goes to the server. The private key stays in the browser, and a copy locked with the user's password is stored on the server so the user can log in on another device.
2. Both people in a chat combine their own private key with the other person's public key and get the same AES key. That key is never sent anywhere.
3. Messages are encrypted in the browser before sending. The `messages` table only holds `ciphertext` and `iv`.
4. New messages are fetched every 3 seconds.

## Deploying (free)

1. **Database:** create one shared Neon project and run `npm run db:setup` (and `db:demo` if you want) against its `DATABASE_URL`.
2. **Backend on Render:** New → Web Service → this repo. Root directory `server`, build command `npm install`, start command `npm start`. Add the environment variables `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY` and `CLIENT_URL` (the Vercel address from step 3).
3. **Frontend on Vercel:** New Project → this repo. Root directory `client`, framework Vite. Add `VITE_API_URL` = your Render address + `/api`, e.g. `https://calmconnect.onrender.com/api`.

Render's free plan sleeps when idle, so the first request after a while takes about 30 seconds.

## Rules for writing code

- Take the user's id from `req.user.id`, never from the request body.
- Use `$1, $2` placeholders in SQL. Never build SQL by joining strings.
- Every personal query filters by `user_id`.
- Never send `password_hash` to the browser.
- Never commit `.env`.
