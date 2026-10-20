import { useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api/axios.js";
import ChatBackdrop, { aiFaces } from "../components/ChatBackdrop.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function AiChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const updated = [...messages, { role: "user", text: text.trim() }];
    setMessages(updated);
    setText("");
    setError("");
    setWaiting(true);
    try {
      const { data } = await api.post("/ai/chat", { messages: updated });
      setMessages([...updated, { role: "assistant", text: data.reply, crisis: data.crisis }]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setWaiting(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: "48rem" }}>
      <PageHeader title="AI wellness assistant" text={<>
        An AI that can listen and suggest small things to try. It is not a therapist. Messages here go to Google
        Gemini, aren't end-to-end encrypted and aren't saved, so avoid sharing personal details.
        For a real person, <Link to="/helpers">find a helper</Link>.
      </>} />

      <div className="cc-chat-scene">
        <ChatBackdrop items={aiFaces} />
        <div className="cc-chat-window">
          <div className="cc-chat-head">
            <img className="flex-shrink-0" src="/images/chat/assistant.svg" alt="" width={40} height={40} />
            <div>
              <div className="fw-semibold">Wellness assistant</div>
              <div className="small text-secondary">AI, not a person</div>
            </div>
          </div>

          <div className="cc-chat">
            {waiting && (
              <div className="cc-message-row">
                <img className="flex-shrink-0" src="/images/chat/assistant.svg" alt="" width={34} height={34} />
                <div className="cc-message cc-typing" aria-label="The assistant is typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            {[...messages].reverse().map((m, i) => (
              <div key={messages.length - i} className={`cc-message-row ${m.role === "user" ? "is-mine" : ""}`}>
                {m.role !== "user" && <img className="flex-shrink-0" src="/images/chat/assistant.svg" alt="" width={34} height={34} />}
                <div className="cc-message">
                  <div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                    {m.crisis && <Link to="/help" className="small">See where to get help now</Link>}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center my-auto">
                <img className="flex-shrink-0" src="/images/chat/assistant.svg" alt="" width={64} height={64} />
                <p className="h5 mt-3 mb-1">Hi, I'm here to listen.</p>
                <p className="text-secondary mb-0">Tell me what's on your mind. There's no wrong place to start.</p>
              </div>
            )}
          </div>

          <form className="cc-chat-form" onSubmit={send}>
            <div className="d-flex gap-2">
              <input className="form-control" placeholder="Write a message" value={text} onChange={(e) => setText(e.target.value)} />
              <button type="submit" className="btn btn-primary" disabled={waiting || !text.trim()}>Send</button>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
