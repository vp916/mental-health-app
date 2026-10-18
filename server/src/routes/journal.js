// Owner: Person B
// Copy the pattern from resources.js (finished example).
import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Every route in this file needs a logged-in user.
router.use(requireAuth);

// TODO GET    /api/journal?q=word   my entries, search title/body with ILIKE
// TODO POST   /api/journal          create { title, body, emotion }
// TODO GET    /api/journal/:id      one entry (only if it's mine)
// TODO PUT    /api/journal/:id      edit (only if it's mine), set updated_at = NOW()
// TODO DELETE /api/journal/:id      delete (only if it's mine)
//
// Always filter by user_id = req.user.id

export default router;
