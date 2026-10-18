// Owner: Person B
// Copy the pattern from resources.js (finished example).
import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Every route in this file needs a logged-in user.
router.use(requireAuth);

// TODO GET    /api/mood?days=30   my entries, newest first
// TODO POST   /api/mood           save today's entry { mood, stress, energy, sleep_hours, note }
//                                 (tip: INSERT ... ON CONFLICT (user_id, entry_date) DO UPDATE)
// TODO DELETE /api/mood/:id       delete one of my entries
//
// Always filter by user_id = req.user.id

export default router;
