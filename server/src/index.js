import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import moodRoutes from "./routes/mood.js";
import journalRoutes from "./routes/journal.js";
import assessmentRoutes from "./routes/assessments.js";
import resourceRoutes from "./routes/resources.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import postRoutes from "./routes/posts.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

// Unknown /api route
app.use("/api", (req, res) => res.status(404).json({ message: "Route not found." }));

// Any error passed to next(err) ends up here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
