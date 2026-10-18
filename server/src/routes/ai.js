import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import options from "../options.js";

const router = Router();

const crisisReply =
  "I'm really sorry you're going through this. Please talk to someone right now: call Tele-MANAS on 14416 " +
  "(free, any time) or 112 in an emergency. You can also open Find a helper to chat with a verified helper.";

router.post("/chat", requireAuth, async (req, res, next) => {
  try {
    const messages = (req.body.messages || []).slice(-10);
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user" || !last.text?.trim()) {
      return res.status(400).json({ message: "Write a message first." });
    }

    const lower = last.text.toLowerCase();
    if (options.crisisWords.some((word) => lower.includes(word))) {
      return res.json({ reply: crisisReply, crisis: true });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: "The AI assistant isn't set up yet. Add GEMINI_API_KEY to server/.env." });
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: options.aiInstructions }] },
          contents: messages.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] })),
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!response.ok || !reply) {
      console.error("Gemini error:", data.error?.message || data);
      return res.status(502).json({ message: "The AI assistant couldn't answer right now. Please try again." });
    }

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

export default router;
