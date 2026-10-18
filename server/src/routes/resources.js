import { Router } from "express";
import { query } from "../db.js";

const router = Router();

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

export default router;
