import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import options from "../options.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id, type, score, level, taken_at FROM assessments WHERE user_id = $1 ORDER BY taken_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { type, answers } = req.body;
    const test = options.assessments[type];
    if (!test) {
      return res.status(400).json({ message: "Unknown check-in." });
    }
    if (!Array.isArray(answers) || answers.length !== test.questions.length) {
      return res.status(400).json({ message: "Please answer every question." });
    }

    // Answers are choice numbers: 0 = first choice ... maxAnswer = last choice.
    const maxAnswer = test.choices.length - 1;
    for (const answer of answers) {
      if (!Number.isInteger(answer) || answer < 0 || answer > maxAnswer) {
        return res.status(400).json({ message: "Please answer every question." });
      }
    }

    // Some PSS-10 questions are positive ("felt confident..."), so their scale is flipped.
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (test.reversed.includes(i)) score += maxAnswer - answers[i];
      else score += answers[i];
    }

    // levels are sorted by max, so the first level whose max is at least the score is the result.
    const result = test.levels.find((level) => score <= level.max);

    const { rows } = await query(
      "INSERT INTO assessments (user_id, type, score, level) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.id, type, score, result.level]
    );
    res.status(201).json({ ...rows[0], tip: result.tip });
  } catch (err) {
    next(err);
  }
});

export default router;
