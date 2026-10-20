import { useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api/axios.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
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
        <h1 className="h2 mb-2">Forgot password</h1>
        <p className="text-secondary mb-4">Enter your email and we'll send you a link to choose a new password.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        {message ? (
          <div className="alert alert-success">{message}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" className="form-control"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-4 text-secondary">
          Remembered it? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
