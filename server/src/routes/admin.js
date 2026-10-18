// Owner: Person D
// Copy the pattern from resources.js (finished example).
import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Every route in this file needs a logged-in admin.
router.use(requireAuth, requireAdmin);

// TODO GET   /api/admin/stats         counts: users, posts, mood entries this week, open reports
// TODO GET   /api/admin/users         list users (never send password_hash)
// TODO GET   /api/admin/reports       open reports with post title
// TODO PATCH /api/admin/reports/:id   resolve a report, optionally hide the post

export default router;
