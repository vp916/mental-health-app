import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api/axios.js";
import PageHeader from "../components/PageHeader.jsx";

export default function Journal() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const { data } = await api.get("/journal", { params: { q: search } });
        setEntries(data);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  return (
    <div className="container py-5" style={{ maxWidth: "48rem" }}>
      <PageHeader title="Journal" text="Only you can read your journal.">
        <Link to="/journal/new" className="btn btn-primary">New entry</Link>
      </PageHeader>

      <input type="search" className="form-control mb-4" placeholder="Search your entries"
        value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading && <p className="text-secondary">Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && entries.length === 0 && (
        <p className="text-secondary">{search ? "No entries match your search." : "Write your first entry. Even a few lines helps."}</p>
      )}

      <div className="d-grid gap-3">
        {entries.map((e) => (
          <Link to={`/journal/${e.id}`} className="cc-panel d-block text-decoration-none text-reset" key={e.id}>
            <div className="small text-secondary mb-1">
              {new Date(e.updated_at).toLocaleDateString()}
              {e.emotion && ` · ${e.emotion}`}
            </div>
            <h2 className="h5 mb-1">{e.title}</h2>
            <p className="mb-0 text-secondary">{e.preview}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
