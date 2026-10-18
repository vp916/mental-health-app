import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/axios.js";
import { useAuth, homePath } from "../context/AuthContext.jsx";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, data.user);
      navigate(homePath(data.user));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="cc-auth mx-auto">
        <h1 className="h2 mb-2">Create an account</h1>
        <p className="text-secondary mb-4">Your journal and mood entries are private to you.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input id="name" name="name" className="form-control"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-control"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" className="form-control"
              value={form.password} onChange={handleChange} minLength={6} required />
            <div className="form-text">At least 6 characters.</div>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-secondary">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
