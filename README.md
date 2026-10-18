# CalmConnect

A mental health and wellness web app: mood tracking, a private journal, self check-ins, resources and a community forum.
College project. Full plan: [PLAN.md](PLAN.md)

**Stack:** React (Vite) + React Router + Bootstrap 5 · Node + Express · PostgreSQL

## Folder layout

```
client/                 React app (http://localhost:5173)
  src/
    api/axios.js        use this for every API call
    context/            AuthContext: who is logged in
    components/         Navbar, Footer, Layout, ProtectedRoute, BreathingCircle, Placeholder
    pages/              one file per page (admin pages in pages/admin/)
    styles/app.css      colours, fonts, custom styles
server/                 Express API (http://localhost:5000)
  sql/schema.sql        all tables
  sql/seed.sql          sample data
  sql/setup.js          creates tables + sample data + admin account
  src/index.js          app setup, mounts every route file
  src/db.js             database connection, exports query()
  src/middleware/auth.js  requireAuth, requireAdmin
  src/routes/           one file per feature
```

## First-time setup

You need **Node.js 20+** and a **PostgreSQL** database. Either install Postgres locally or create a free database on [Neon](https://neon.tech) and copy its connection string.

```bash
# 1. Backend
cd server
npm install
cp .env.example .env        # then edit .env: DATABASE_URL and JWT_SECRET
npm run db:setup            # creates tables, sample resources, admin account
npm run dev                 # API on http://localhost:5000

# 2. Frontend (in a second terminal)
cd client
npm install
npm run dev                 # app on http://localhost:5173
```

Admin login after setup: the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env` (default `admin@calmconnect.local` / `admin123`).

`npm run db:setup` **deletes all data** and starts fresh. Run it again whenever `schema.sql` changes.

## What already works

- Register, log in, log out (`server/src/routes/auth.js`, `client/src/pages/Login.jsx`, `Register.jsx`)
- Protected pages: logged-out users are sent to `/login`, non-admins can't open `/admin`
- Home page, Help page, Breathing page
- Resources page loads from the database (`GET /api/resources`)

Everything else shows a **Not built yet** box with its owner and a to-do list.

## How to build a feature

1. **Backend:** open your file in `server/src/routes/`. The TODO comments list the routes. Copy the pattern from `resources.js`.
2. **Frontend:** open your page in `client/src/pages/`, delete the `<Placeholder>` and build the page. Copy the loading/error pattern from `Resources.jsx`.
3. Test it in the browser, then commit.

Rules that keep the app safe:

- Take the user's id from `req.user.id`, **never** from the request body.
- Always use `$1, $2` placeholders in SQL. Never build SQL by joining strings.
- Every journal and mood query filters by `user_id = $1`.
- Never send `password_hash` back to the browser.

## Who owns what

| Person | Backend files | Frontend pages |
|--------|---------------|----------------|
| A | `auth.js` | Dashboard, Profile |
| B | `mood.js`, `journal.js` | Mood, Journal, JournalEditor |
| C | `resources.js`, `bookmarks.js`, `assessments.js` | Resources, Assessments, AssessmentTake, Breathe, Help |
| D | `posts.js`, `admin.js` | Community, PostDetail, admin/* |

## Working together with Git

- Never commit `.env` (it's already in `.gitignore`).
- Make a branch per feature: `git checkout -b mood-tracker`
- Pull `main` before you start each day: `git pull origin main`
- Open a pull request when the feature works, and ask one teammate to look at it.
