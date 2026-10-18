// Owner: Person C
// Copy the pattern from resources.js (finished example).
import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Every route in this file needs a logged-in user.
router.use(requireAuth);

// TODO GET  /api/assessments   my past results, newest first
// TODO POST /api/assessments   save a result { type: 'GAD7' | 'PSS10', score, level }

export default router;
