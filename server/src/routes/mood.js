import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

function isRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM mood_entries
       WHERE user_id = $1 AND entry_date > CURRENT_DATE - 30
       ORDER BY entry_date`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { entry_date, mood, stress, energy, sleep_hours, note } = req.body;
    if (!entry_date) {
      return res.status(400).json({ message: "The date is missing." });
    }
    if (!isRating(mood) || !isRating(stress) || !isRating(energy)) {
      return res.status(400).json({ message: "Rate mood, stress and energy from 1 to 5." });
    }

    // One entry per day: if today already has one, ON CONFLICT updates it instead of adding another.
    const { rows } = await query(
      `INSERT INTO mood_entries (user_id, entry_date, mood, stress, energy, sleep_hours, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, entry_date) DO UPDATE SET
         mood = $3, stress = $4, energy = $5, sleep_hours = $6, note = $7
       RETURNING *`,
      [req.user.id, entry_date, mood, stress, energy, sleep_hours || null, note || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { rowCount } = await query("DELETE FROM mood_entries WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    if (!rowCount) return res.status(404).json({ message: "Entry not found." });
    res.json({ message: "Entry deleted." });
  } catch (err) {
    next(err);
  }
});

export default router;
