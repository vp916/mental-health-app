import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { penNameWords } from "../options.js";

const router = Router();

function makeToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

async function getUser(id) {
  const { rows } = await query(
    `SELECT u.id, u.name, u.email, u.role, u.pen_name, u.created_at, h.status AS helper_status
     FROM users u
     LEFT JOIN helper_profiles h ON h.user_id = u.id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0];
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
      "INSERT INTO users (name, email, password_hash, pen_name) VALUES ($1, $2, $3, $4) RETURNING id",
      [name.trim(), email.toLowerCase(), passwordHash, penName]
    );

    res.status(201).json({ token: makeToken(rows[0]), user: await getUser(rows[0].id) });
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

    res.json({ token: makeToken(user), user: await getUser(user.id) });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    res.json(await getUser(req.user.id));
  } catch (err) {
    next(err);
  }
});

router.get("/keys", requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query("SELECT public_key, encrypted_private_key FROM users WHERE id = $1", [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/keys", requireAuth, async (req, res, next) => {
  try {
    const { public_key, encrypted_private_key } = req.body;
    if (!public_key || !encrypted_private_key) {
      return res.status(400).json({ message: "Both keys are required." });
    }
    await query(
      "UPDATE users SET public_key = $1, encrypted_private_key = $2 WHERE id = $3",
      [public_key, encrypted_private_key, req.user.id]
    );
    res.json({ message: "Keys saved." });
  } catch (err) {
    next(err);
  }
});

router.put("/password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, encrypted_private_key } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const { rows } = await query("SELECT password_hash FROM users WHERE id = $1", [req.user.id]);
    if (!(await bcrypt.compare(currentPassword || "", rows[0].password_hash))) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query(
      "UPDATE users SET password_hash = $1, encrypted_private_key = COALESCE($2, encrypted_private_key) WHERE id = $3",
      [passwordHash, encrypted_private_key || null, req.user.id]
    );
    res.json({ message: "Password changed." });
  } catch (err) {
    next(err);
  }
});

// A reset link is signed with JWT_SECRET plus the user's current password hash,
// so it stops working after 30 minutes or as soon as the password changes.
function resetSecret(user) {
  return process.env.JWT_SECRET + user.password_hash;
}

async function sendResetEmail(email, link) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`Password reset link for ${email}: ${link}`);
    return;
  }
  const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await mailer.sendMail({
    from: `CalmConnect <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your CalmConnect password",
    text: `Open this link to choose a new password. It works for 30 minutes.\n\n${link}\n\nIf you didn't ask for this, you can ignore this email.`,
  });
}

router.post("/forgot-password", async (req, res, next) => {
  try {
    const email = (req.body.email || "").toLowerCase();
    const { rows } = await query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
    const user = rows[0];

    if (user) {
      const token = jwt.sign({ id: user.id }, resetSecret(user), { expiresIn: "30m" });
      await sendResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password?token=${token}`);
    }
    // Same answer either way, so nobody can use this to check who has an account.
    res.json({ message: "If that email has an account, we've sent a link to reset the password." });
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const id = jwt.decode(token || "")?.id;
    const { rows } = await query("SELECT id, password_hash FROM users WHERE id = $1", [id || 0]);
    const user = rows[0];
    try {
      if (!user) throw new Error();
      jwt.verify(token, resetSecret(user));
    } catch {
      return res.status(400).json({ message: "This reset link has expired or was already used. Ask for a new one." });
    }

    // The old chat key was locked with the old password, so it can't be unlocked any more.
    // Clearing it makes the app create a new one at the next login.
    const passwordHash = await bcrypt.hash(password, 10);
    await query(
      "UPDATE users SET password_hash = $1, public_key = NULL, encrypted_private_key = NULL WHERE id = $2",
      [passwordHash, user.id]
    );
    res.json({ message: "Password changed. You can log in now." });
  } catch (err) {
    next(err);
  }
});

export default router;
