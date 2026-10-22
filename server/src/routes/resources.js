import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import options from "../options.js";

const router = Router();

const types = ["article", "video", "link"];

function checkResource(data) {
  const { title, type, category, url, body } = data;
  if (!title?.trim() || !types.includes(type) || !options.resourceCategories.includes(category)) {
    return "Give a title, a type and a category.";
  }
  if (type === "article" && !body?.trim()) return "Write the article text.";
  if (type !== "article" && !url?.trim()) return "Add the link.";
  // Only real web links, so a "javascript:" URL can't run code when someone clicks it.
  if (type !== "article" && !/^https?:\/\//i.test(url.trim())) return "Links must start with http:// or https://.";
  return null;
}

router.get("/", async (req, res, next) => {
  try {
    // An empty filter means "show all".
    const category = req.query.category || "";
    const type = req.query.type || "";

    const { rows } = await query(
      `SELECT * FROM resources
       WHERE ($1 = '' OR category = $1) AND ($2 = '' OR type = $2)
       ORDER BY created_at DESC`,
      [category, type]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const problem = checkResource(req.body);
    if (problem) return res.status(400).json({ message: problem });

    const { title, type, category, url, body } = req.body;
    const { rows } = await query(
      "INSERT INTO resources (title, type, category, url, body) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title.trim(), type, category, url || null, body || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const problem = checkResource(req.body);
    if (problem) return res.status(400).json({ message: problem });

    const { title, type, category, url, body } = req.body;
    const { rows } = await query(
      "UPDATE resources SET title = $1, type = $2, category = $3, url = $4, body = $5 WHERE id = $6 RETURNING *",
      [title.trim(), type, category, url || null, body || null, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Resource not found." });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { rowCount } = await query("DELETE FROM resources WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: "Resource not found." });
    res.json({ message: "Resource deleted." });
  } catch (err) {
    next(err);
  }
});

export default router;
