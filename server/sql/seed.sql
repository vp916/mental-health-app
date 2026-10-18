-- Sample data so the app isn't empty during development.
-- The admin user is created by setup.js (it needs a bcrypt hash).

INSERT INTO resources (title, type, category, url, body) VALUES
  ('Box breathing in four steps', 'article', 'stress', NULL,
   'Breathe in for 4 seconds, hold for 4, breathe out for 4, hold for 4. Repeat for two minutes.'),
  ('Why sleep matters before exams', 'article', 'sleep', NULL,
   'Memory is consolidated during sleep. Pulling an all-nighter often costs more marks than it gains.'),
  ('Tele-MANAS: free mental health support', 'link', 'students', 'https://telemanas.mohfw.gov.in', NULL),
  ('5-minute body scan meditation', 'video', 'mindfulness', 'https://www.youtube.com/results?search_query=5+minute+body+scan', NULL);
