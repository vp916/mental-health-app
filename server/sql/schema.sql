-- CalmConnect database schema
-- Run with: npm run db:setup   (drops and recreates every table, so only use it on a dev database)

DROP TABLE IF EXISTS reports, comments, posts, bookmarks, resources,
                     assessments, journal_entries, mood_entries, users CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mood_entries (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  mood        SMALLINT CHECK (mood BETWEEN 1 AND 5),
  stress      SMALLINT CHECK (stress BETWEEN 1 AND 5),
  energy      SMALLINT CHECK (energy BETWEEN 1 AND 5),
  sleep_hours NUMERIC(3, 1),
  note        TEXT,
  UNIQUE (user_id, entry_date)              -- one entry per day
);

CREATE TABLE journal_entries (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  body        TEXT NOT NULL,
  emotion     VARCHAR(30),                  -- happy, sad, anxious, calm, angry, grateful
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assessments (
  id        SERIAL PRIMARY KEY,
  user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type      VARCHAR(10) NOT NULL CHECK (type IN ('GAD7', 'PSS10')),
  score     SMALLINT NOT NULL,
  level     VARCHAR(20) NOT NULL,           -- low / moderate / high
  taken_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resources (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  type        VARCHAR(20) NOT NULL CHECK (type IN ('article', 'video', 'link')),
  category    VARCHAR(50),                  -- stress, anxiety, sleep, mindfulness, students
  url         TEXT,                         -- for video / link
  body        TEXT,                         -- for an article written inside the app
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookmarks (
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  resource_id INT REFERENCES resources(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, resource_id)
);

CREATE TABLE posts (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  body         TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_hidden    BOOLEAN DEFAULT FALSE,       -- set by admin
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id           SERIAL PRIMARY KEY,
  post_id      INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reports (
  id          SERIAL PRIMARY KEY,
  post_id     INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason      TEXT,
  status      VARCHAR(10) DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at  TIMESTAMP DEFAULT NOW()
);
