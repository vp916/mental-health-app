// Owner: Person C
// Copy the pattern from resources.js (finished example).
import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Every route in this file needs a logged-in user.
router.use(requireAuth);

// TODO GET    /api/bookmarks                my bookmarked resources (JOIN resources)
// TODO POST   /api/bookmarks/:resourceId    add (ON CONFLICT DO NOTHING)
// TODO DELETE /api/bookmarks/:resourceId    remove

export default router;
