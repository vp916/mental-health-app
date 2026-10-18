import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/me", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM helper_profiles WHERE user_id = $1", [req.user.id]);
    res.json(rows[0] || null);
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

export default router;
