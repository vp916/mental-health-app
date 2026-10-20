import { Router } from "express";
import { query } from "../db.js";

const router = Router();

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Same affirmation for everyone all day, a new one each day.
router.get("/today", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT text FROM affirmations ORDER BY id");
    if (rows.length === 0) return res.json(null);

    const dayNumber = Math.floor(Date.now() / MS_PER_DAY);   // days since 1 Jan 1970
    res.json(rows[dayNumber % rows.length]);
  } catch (err) {
    next(err);
  }
});

export default router;
