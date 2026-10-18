import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { penNameWords } from "../options.js";

const router = Router();

const userFields = "id, name, email, role, pen_name, created_at";

function makeToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function makePenName() {
  while (true) {
    const name = `${randomItem(penNameWords.adjectives)} ${randomItem(penNameWords.nouns)} ${Math.floor(Math.random() * 90) + 10}`;
    const { rows } = await query("SELECT id FROM users WHERE pen_name = $1", [name]);
    if (rows.length === 0) return name;
  }
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const penName = await makePenName();
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, pen_name)
       VALUES ($1, $2, $3, $4)
       RETURNING ${userFields}`,
      [name.trim(), email.toLowerCase(), passwordHash, penName]
    );

    res.status(201).json({ token: makeToken(rows[0]), user: rows[0] });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    const { password_hash, public_key, encrypted_private_key, ...safeUser } = user;
    res.json({ token: makeToken(user), user: safeUser });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT ${userFields} FROM users WHERE id = $1`, [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const { rows } = await query("SELECT password_hash FROM users WHERE id = $1", [req.user.id]);
    if (!(await bcrypt.compare(currentPassword || "", rows[0].password_hash))) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, req.user.id]);
    res.json({ message: "Password changed." });
  } catch (err) {
    next(err);
  }
});

export default router;
