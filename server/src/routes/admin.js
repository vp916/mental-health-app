import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id, name, email, role, pen_name, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/helpers", async (req, res, next) => {
  try {
    const status = req.query.status || "pending";
    const { rows } = await query(
      `SELECT h.*, u.name, u.email
       FROM helper_profiles h
       JOIN users u ON u.id = h.user_id
       WHERE h.status = $1
       ORDER BY h.applied_at`,
      [status]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.patch("/helpers/:userId", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected." });
    }

    const approvedAt = status === "approved" ? new Date() : null;
    const { rows } = await query(
      "UPDATE helper_profiles SET status = $1, approved_at = $2 WHERE user_id = $3 RETURNING *",
      [status, approvedAt, req.params.userId]
    );
    if (!rows[0]) return res.status(404).json({ message: "Application not found." });

    const role = status === "approved" ? "helper" : "user";
    await query("UPDATE users SET role = $1 WHERE id = $2 AND role <> 'admin'", [role, req.params.userId]);

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
