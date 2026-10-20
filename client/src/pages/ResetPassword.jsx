import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api, { errorMessage } from "../api/axios.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { token: searchParams.get("token"), password });
      setMessage(data.message);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="cc-auth mx-auto">
        <h1 className="h2 mb-2">Choose a new password</h1>
        <p className="text-secondary mb-4">
          Your chats are end-to-end encrypted with a key locked by your old password. After a reset, messages
          from before can't be read any more. New messages work as normal.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        {message ? (
          <>
            <div className="alert alert-success">{message}</div>
            <Link to="/login" className="btn btn-primary w-100">Log in</Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">New password</label>
              <input id="password" type="password" className="form-control" minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
