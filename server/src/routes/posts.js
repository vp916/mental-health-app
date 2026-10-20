import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import options from "../options.js";

const router = Router();

router.use(requireAuth);

async function postIsVisible(id) {
  const { rows } = await query("SELECT id FROM posts WHERE id = $1 AND NOT is_hidden", [id]);
  return rows.length > 0;
}

router.get("/", async (req, res, next) => {
  try {
    // An empty circle means "all circles".
    const circle = req.query.circle || "";

    const { rows } = await query(
      `SELECT p.id, p.circle, p.title, LEFT(p.body, 220) AS preview, p.created_at, u.pen_name,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND NOT c.is_hidden)::int AS comment_count
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE NOT p.is_hidden AND ($1 = '' OR p.circle = $1)
       ORDER BY p.created_at DESC`,
      [circle]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { circle, title, body } = req.body;
    if (!options.circles.includes(circle) || !title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: "Choose a circle and write a title and a message." });
    }

    const { rows } = await query(
      "INSERT INTO posts (user_id, circle, title, body) VALUES ($1, $2, $3, $4) RETURNING id",
      [req.user.id, circle, title.trim(), body.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const postResult = await query(
      `SELECT p.id, p.circle, p.title, p.body, p.created_at, p.user_id, p.is_hidden, u.pen_name
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE p.id = $1`,
      [req.params.id]
    );
    const post = postResult.rows[0];
    if (!post || (post.is_hidden && req.user.role !== "admin")) {
      return res.status(404).json({ message: "This post doesn't exist or was removed." });
    }

    const comments = await query(
      `SELECT c.id, c.body, c.created_at, u.pen_name, c.user_id = $2 AS is_mine
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = $1 AND NOT c.is_hidden
       ORDER BY c.created_at`,
      [post.id, req.user.id]
    );
    const reactions = await query("SELECT user_id, type FROM reactions WHERE post_id = $1", [post.id]);

    const myReactions = [];
    const receivedReactions = [];
    for (const r of reactions.rows) {
      if (r.user_id === req.user.id) myReactions.push(r.type);
      if (!receivedReactions.includes(r.type)) receivedReactions.push(r.type);
    }

    res.json({
      id: post.id,
      circle: post.circle,
      title: post.title,
      body: post.body,
      created_at: post.created_at,
      is_hidden: post.is_hidden,
      pen_name: post.pen_name,
      is_mine: post.user_id === req.user.id,   // send true/false, not the author's user id
      comments: comments.rows,
      my_reactions: myReactions,
      received_reactions: receivedReactions,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    // Admins can delete any post, everyone else only their own.
    let result;
    if (req.user.role === "admin") {
      result = await query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    } else {
      result = await query("DELETE FROM posts WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    }
    if (result.rowCount === 0) return res.status(404).json({ message: "Post not found." });
    res.json({ message: "Post deleted." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ message: "Write something before sending." });
    }
    if (!(await postIsVisible(req.params.id))) {
      return res.status(404).json({ message: "This post doesn't exist or was removed." });
    }

    const { rows } = await query(
      "INSERT INTO comments (post_id, user_id, body) VALUES ($1, $2, $3) RETURNING id",
      [req.params.id, req.user.id, body.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/reactions", async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!options.reactions.some((r) => r.type === type)) {
      return res.status(400).json({ message: "Unknown reaction." });
    }
    if (!(await postIsVisible(req.params.id))) {
      return res.status(404).json({ message: "This post doesn't exist or was removed." });
    }

    // Clicking a reaction again takes it back: try to delete it, and add it only if nothing was deleted.
    const removed = await query(
      "DELETE FROM reactions WHERE post_id = $1 AND user_id = $2 AND type = $3",
      [req.params.id, req.user.id, type]
    );
    if (removed.rowCount === 0) {
      await query("INSERT INTO reactions (post_id, user_id, type) VALUES ($1, $2, $3)", [req.params.id, req.user.id, type]);
    }

    const { rows } = await query(
      "SELECT type FROM reactions WHERE post_id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    res.json(rows.map((r) => r.type));
  } catch (err) {
    next(err);
  }
});

export default router;
