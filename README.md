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

## Project layout

```
client/src/
  api/axios.js            every API call goes through this
  context/AuthContext.jsx logged-in user
  components/             Navbar, Footer, Layout, ProtectedRoute, shared pieces
  pages/                  one file per page, admin pages in pages/admin/
  styles/app.css          colours, fonts, custom styles
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
| Sample data | `server/sql/seed.sql` |
| Colours and fonts | top of `client/src/styles/app.css` |
| Menu links | `client/src/components/Navbar.jsx` |
| Pages and URLs | `client/src/App.jsx` |

## Progress

- [x] Milestone 1: accounts, pen names, roles, helper applications, admin approval
- [x] Milestone 2: community, check-ins, mood tracker, journal
- [ ] Milestone 3: helper directory, matching, encrypted chat
- [ ] Milestone 4: dashboard, resources, AI chatbot, demo data

## Rules for writing code

- Take the user's id from `req.user.id`, never from the request body.
- Use `$1, $2` placeholders in SQL. Never build SQL by joining strings.
- Every personal query filters by `user_id`.
- Never send `password_hash` to the browser.
- Never commit `.env`.
