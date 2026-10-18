// Owner: Person C
// This file is the worked example: GET / is finished, so copy its pattern for the other routes.
import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/resources?category=sleep&type=video   (public)
router.get("/", async (req, res, next) => {
  try {
    const { category, type } = req.query;
    const conditions = [];
    const params = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await query(`SELECT * FROM resources ${where} ORDER BY created_at DESC`, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// TODO POST   /api/resources       (admin) create  { title, type, category, url, body }
// TODO PUT    /api/resources/:id   (admin) update
// TODO DELETE /api/resources/:id   (admin) delete
router.post("/", requireAuth, requireAdmin, (req, res) => res.status(501).json({ message: "Not built yet" }));

export default router;
