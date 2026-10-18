// Owner: Person D
// Copy the pattern from resources.js (finished example).
import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Every route in this file needs a logged-in user.
router.use(requireAuth);

// TODO GET    /api/posts                 visible posts (is_hidden = false) with author name,
//                                        show 'Anonymous' when is_anonymous is true
// TODO POST   /api/posts                 create { title, body, is_anonymous }
// TODO GET    /api/posts/:id             one post with its comments
// TODO DELETE /api/posts/:id             delete (author or admin only)
// TODO POST   /api/posts/:id/comments    add comment { body, is_anonymous }
// TODO POST   /api/posts/:id/report      report { reason }

export default router;
