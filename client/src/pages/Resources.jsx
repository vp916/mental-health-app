// Owner: Person C
// This page is the worked example for loading data: copy its pattern (loading / error / list) for other pages.
// TODO: bookmark button for logged-in users.
import { useEffect, useState } from "react";
import api, { errorMessage } from "../api/axios.js";

const categories = ["all", "stress", "anxiety", "sleep", "mindfulness", "students"];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = category === "all" ? {} : { category };
        const { data } = await api.get("/resources", { params });
        setResources(data);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  return (
    <div className="container py-5">
      <h1 className="h2 mb-4">Resources</h1>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            className={`btn btn-sm ${c === category ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCategory(c)}
          >
            {c[0].toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="text-secondary">Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && resources.length === 0 && (
        <p className="text-secondary">Nothing in this category yet.</p>
      )}

      <div className="d-grid gap-3" style={{ maxWidth: "46rem" }}>
        {resources.map((r) => (
          <article className="cc-panel" key={r.id}>
            <div className="small text-secondary mb-1">
              {r.type} in {r.category}
            </div>
            <h2 className="h5 mb-2">
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
              ) : (
                r.title
              )}
            </h2>
            {r.body && <p className="mb-0">{r.body}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
