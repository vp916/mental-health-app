import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import options from "../options.js";

const router = Router();

router.use(requireAuth);

const helperFields = `u.id, u.name, h.kind, h.bio, h.specialisations, h.languages, h.gender, h.is_free, h.is_available`;

router.get("/", async (req, res, next) => {
  try {
    // Each filter is skipped when it is empty ("") or not ticked (false).
    const specialisation = req.query.specialisation || "";
    const language = req.query.language || "";
    const gender = req.query.gender || "";
    const freeOnly = req.query.free === "true";
    const availableOnly = req.query.available === "true";

    const { rows } = await query(
      `SELECT ${helperFields}
       FROM helper_profiles h
       JOIN users u ON u.id = h.user_id
       WHERE h.status = 'approved'
         AND ($1 = '' OR $1 = ANY(h.specialisations))
         AND ($2 = '' OR $2 = ANY(h.languages))
         AND ($3 = '' OR h.gender = $3)
         AND ($4 = FALSE OR h.is_free)
         AND ($5 = FALSE OR h.is_available)
       ORDER BY h.is_available DESC, u.name`,
      [specialisation, language, gender, freeOnly, availableOnly]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/suggested", async (req, res, next) => {
  try {
    const { rows: results } = await query(
      "SELECT type, level FROM assessments WHERE user_id = $1 ORDER BY taken_at DESC",
      [req.user.id]
    );

    // Results are newest first, so the first one we see for each check-in is the latest.
    const latestLevel = {};
    for (const r of results) {
      if (!latestLevel[r.type]) latestLevel[r.type] = r.level;
    }

    // A Moderate or High result suggests helpers for that topic (Anxiety, Stress).
    const topics = [];
    for (const type in latestLevel) {
      if (latestLevel[type] === "Moderate" || latestLevel[type] === "High") {
        topics.push(options.assessments[type].suggests);
      }
    }

    if (topics.length === 0) return res.json({ topics: [], helpers: [] });

    // && means "the two lists share at least one item".
    const { rows } = await query(
      `SELECT ${helperFields}
       FROM helper_profiles h
       JOIN users u ON u.id = h.user_id
       WHERE h.status = 'approved' AND h.specialisations && $1 AND u.id <> $2
       ORDER BY h.is_available DESC, u.name
       LIMIT 3`,
      [topics, req.user.id]
    );
    res.json({ topics, helpers: rows });
  } catch (err) {
    next(err);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM helper_profiles WHERE user_id = $1", [req.user.id]);
    res.json(rows[0] || null);
  } catch (err) {
    next(err);
  }
});

router.patch("/me/availability", async (req, res, next) => {
  try {
    const { rows } = await query(
      "UPDATE helper_profiles SET is_available = $1 WHERE user_id = $2 AND status = 'approved' RETURNING is_available",
      [req.body.is_available === true, req.user.id]
    );
    if (!rows[0]) return res.status(403).json({ message: "Only approved helpers can change availability." });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/apply", async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return res.status(400).json({ message: "Only regular accounts can apply as a helper." });
    }

    const { kind, license_number, bio, specialisations, languages, gender, is_free } = req.body;

    if (!kind || !bio || !specialisations?.length || !languages?.length) {
      return res.status(400).json({ message: "Type, bio, at least one specialisation and one language are required." });
    }
    if (kind === "licensed" && !license_number) {
      return res.status(400).json({ message: "Licensed therapists must give a license number." });
    }

    const { rows } = await query(
      `INSERT INTO helper_profiles (user_id, kind, license_number, bio, specialisations, languages, gender, is_free)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         kind = $2, license_number = $3, bio = $4, specialisations = $5, languages = $6,
         gender = $7, is_free = $8, status = 'pending', applied_at = NOW()
       RETURNING *`,
      [req.user.id, kind, license_number || null, bio, specialisations, languages, gender || null, is_free !== false]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT ${helperFields}
       FROM helper_profiles h
       JOIN users u ON u.id = h.user_id
       WHERE h.user_id = $1 AND h.status = 'approved'`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Helper not found." });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
